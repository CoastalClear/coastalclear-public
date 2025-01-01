# CoastalClear backend

The backend API for CoastalClear, written in [FastAPI](https://fastapi.tiangolo.com/).

## Getting Started

1. Create a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
python3 -m pip install -r requirements.txt
```

3. Follow the guide to initialize the [database](./DB_SETUP.md)

## Usage

Ensure that you have an environment file named `.env` that follows the format outlined in `example.env`

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
```
