import datetime as dt
import logging
from contextlib import asynccontextmanager
from typing import Annotated, Any, Union
from urllib.parse import urlparse, urlunparse

import requests
from authlib.integrations.starlette_client import OAuthError
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware

import auth
import exceptions
import models
import s3
import schemas
from api.main import api_router
from config import settings
from database import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """https://fastapi.tiangolo.com/advanced/events/#lifespan"""
    logger.info(f"\tEnvironment vars: {settings}")
    yield


class ProxyHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if "X-Forwarded-Proto" in request.headers:
            request.scope["scheme"] = request.headers["X-Forwarded-Proto"]
        if "X-Forwarded-For" in request.headers:
            request.scope["client"] = (
                request.headers["X-Forwarded-For"],
                request.client.port,
            )
        return await call_next(request)


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if isinstance(response, RedirectResponse):
            url = urlparse(str(response.headers["location"]))
            if url.scheme == "http":
                # Change scheme to https
                response.headers["location"] = urlunparse(url._replace(scheme="https"))
        return response


app = FastAPI(title="CoastalClear API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
)
app.add_middleware(ProxyHeadersMiddleware)
app.add_middleware(HTTPSRedirectMiddleware)

app.include_router(api_router, prefix="/api")


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("favicon.ico")


@app.get("/health")
async def health_check() -> Any:
    """Health check endpoint."""
    return {"status": "Healthy", "time": dt.datetime.now()}


@app.get("/token")
async def get_token(token: Annotated[str, Depends(auth.OAUTH2_SCHEME)]):
    return {"token": token}


@app.get("/")
async def root(request: Request):
    """Shows the user's current authentication status and user info, if any."""
    if request.session.get("token"):
        return {"status": "Authenticated", "session": request.session}
    return {"status": "Not authenticated yet"}


@app.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> Union[schemas.Token, JSONResponse]:
    """Login with username and password."""
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return exceptions.INVALID_CREDENTIALS

    token = auth.create_access_token(data={"sub": user.email})
    request.session["token"] = token
    request.session["user"] = {"email": user.email}

    return schemas.Token(access_token=token, token_type="bearer")


@app.post("/register", response_model=schemas.Token)
async def register_user(
    request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)
) -> Union[schemas.Token, JSONResponse]:
    """Register a new user with username and password."""
    stored_user = auth.get_user(db, user.email)
    if stored_user:
        return exceptions.EMAIL_USED
    new_user = auth.create_user(db, user)
    stored_user = auth.authenticate_user(new_user.email, user.password, db)
    if not stored_user:
        return exceptions.INVALID_CREDENTIALS

    token = auth.create_access_token(data={"sub": stored_user.email})
    request.session["token"] = token
    request.session["user"] = {
        "email": stored_user.email,
        "name": stored_user.name,
    }

    return schemas.Token(access_token=token, token_type="bearer")


@app.post("/login-google", response_model=schemas.Token)
async def login_with_google_token(
    request: Request, payload: dict, db: Session = Depends(get_db)
) -> Union[schemas.Token, JSONResponse]:
    """Authenticate with Google OAuth2 token. If user exists, return token. If not, create user and return token."""
    try:
        token = payload["access_token"]
        res = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        )
        user_info = res.json()

        stored_user = auth.get_user(db, user_info["email"])
        if stored_user:
            if not stored_user.external_provider:
                return exceptions.EMAIL_USED
        else:
            user_create = schemas.UserCreateExternalProvider(email=user_info["email"])
            stored_user = auth.create_user_external_provider(db, user_create)

        token = auth.create_access_token(data={"sub": stored_user.email})
        request.session["token"] = token
        request.session["user"] = dict(user_info)

        return schemas.Token(access_token=token, token_type="bearer")

    except Exception as e:
        return {"error": str(e)}


@app.get("/login-google")
async def login_google(request: Request):
    """Redirect to Google OAuth2 login page."""
    return await auth.OAUTH_CLIENT.google.authorize_redirect(
        request, request.url_for("oauth_redirect")
    )


@app.get("/oauth-redirect", response_model=Union[schemas.Token, dict])
async def oauth_redirect(
    request: Request, db: Session = Depends(get_db)
) -> Union[schemas.Token, dict]:
    try:
        token = await auth.OAUTH_CLIENT.google.authorize_access_token(request)
        logger.info(f"Access token: {token}")

        user_info = token.get("userinfo")
        if user_info is None:
            user_info = await auth.OAUTH_CLIENT.google.parse_id_token(request, token)

        logger.info(f"User info: {user_info}")

        stored_user = auth.get_user(db, user_info["email"])

        if stored_user:
            if not stored_user.external_provider:
                return exceptions.EMAIL_USED
        else:
            user_create = schemas.UserCreateExternalProvider(email=user_info["email"])
            stored_user = auth.create_user_external_provider(db, user_create)

        token = auth.create_access_token(data={"sub": stored_user.email})
        request.session["token"] = token
        request.session["user"] = dict(user_info)

        return schemas.Token(
            access_token=token,
            token_type="bearer",
        )

    except OAuthError as err:
        return {"error": err.error}
    except Exception as e:
        return {"error": str(e)}


@app.get("/logout")
async def logout(request: Request) -> dict:
    """Logout and clear current client session."""
    request.session.clear()
    return {"message": "Logged out"}


@app.get("/s3-upload-url")
async def get_s3_upload_url(
    object_name: str, content_type: str = "image/png", expires_in: int = 60
) -> str:
    """Generate a presigned URL to upload a file to S3."""
    return s3.create_presigned_url(object_name, content_type, expires_in)


@app.get("/me")
async def read_users_me(
    curr_user: Annotated[models.User, Depends(auth.get_current_active_user)],
):
    return curr_user
