from datetime import datetime, timedelta
from typing import Annotated, Union

import jwt
from authlib.integrations.starlette_client import OAuth
from fastapi import Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from starlette.config import Config

import exceptions
import models
import schemas
from config import settings
from database import get_db

AT_EXPIRE_MINUTES = 60
SECRET_KEY = settings.SECRET_KEY
ALGO = "HS256"

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/login")

OAUTH_CLIENT = OAuth(Config(".env"))
OAUTH_CLIENT.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "verify": False,  # Only for local testing
    },
)


def verify_password(plain_password, hashed_password) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def create_access_token(
    data: dict, expires_delta: Union[timedelta, None] = None
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=AT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGO)


def get_user(db: Session, email: str) -> Union[models.User, None]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    user = models.User(
        email=user.email, name=user.name, hashed_pwd=PWD_CONTEXT.hash(user.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_user_external_provider(
    db: Session, user: schemas.UserCreateExternalProvider
) -> models.User:
    user = models.User(email=user.email, name=user.name, external_provider=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(
    email: str, password: str, db: Session
) -> Union[models.User, bool]:
    user = get_user(db, email)
    if not user or not verify_password(password, user.hashed_pwd):
        return False
    return user


async def get_current_user(
    token: Annotated[str, Depends(OAUTH2_SCHEME)], db: Session = Depends(get_db)
) -> Union[models.User, JSONResponse]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        email: str = payload.get("sub")
        if email is None:
            return exceptions.INVALID_CREDENTIALS
        token_data = schemas.TokenData(email=email)
    except InvalidTokenError:
        return exceptions.INVALID_CREDENTIALS
    user = get_user(db, email=token_data.email)
    if user is None:
        return exceptions.INVALID_CREDENTIALS
    return user


async def get_current_active_user(
    current_user: Annotated[models.User, Depends(get_current_user)],
) -> Union[models.User, JSONResponse]:
    if not current_user.is_active:
        return exceptions.INACTIVE_USER
    return current_user
