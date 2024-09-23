# Coastal Clear Backend

## Getting Started

Create a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
python3 -m pip install -r requirements.txt
```

## Usage

Ensure that you have an environment file named `.env` that follows the format `example.env`

### Local

To run a development server:

```bash
fastapi dev main.py
```

To run a production server with `uvicorn`:

```bash
fastapi run main.py
```

### Docker

```bash
# Build
docker build -t coastalclear-api .
# Run
docker run -p 8000:8000 --env-file ./.env coastalclear-api:latest
# Docker Compose
docker compose up
```



### DB Migrations

After making changes to the classes in `models.py`, it's possible to create a script to update the schema of the database that the application connects to:

```bash
alembic revision --autogenerate -m <message>
alembic upgrade head
```
