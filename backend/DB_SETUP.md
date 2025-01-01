# Database configuration

The database for this project should be managed with [alembic](https://alembic.sqlalchemy.org/en/latest/index.html). It can automatically initialize and apply migrations based classes defined with SQLAlchemy

### Initialization

1. Automatically create a folder, `alembic/`, for all configuration and data pertaining to database migrations

```bash
alembic init alembic
```

2. Modify the `sqlalchemy.url` parameter in `alembic.ini` according to the databasec connection parameters you want

```ini
# Example for postgresql running on localhost
sqlalchemy.url = postgresql://postgres:postgres@localhost/coastalclear
```

3. Modify `alembic/env.py` to read the model metadata

```python
from models import Base
target_metadata = Base.metadata
```

4. Initialize the database schema using an alembic migration

```bash
alembic revision --autogenerate -m "Initialize database"
alembic upgrade head
```

### Migrations

After making changes to the classes in `models.py`, it's possible to create a script to update the schema of the database that the application connects to:

```bash
alembic revision --autogenerate -m <message>
alembic upgrade head
```
