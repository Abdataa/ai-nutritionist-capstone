from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nutritionist.db")

# For SQLite set check_same_thread for single-thread app (SQLAlchemy engine handles it)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()

# simple helper dependency (we'll import in routers)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
