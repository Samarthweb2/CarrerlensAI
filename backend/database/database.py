import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection string with SQLite fallback
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./careerlens_auth.db")

# Adapt legacy postgresql:// to newer postgresql+psycopg2:// for SQLAlchemy
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    FastAPI DB dependency session lifecycle helper.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
