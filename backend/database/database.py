# Import function to create a database engine (connection to the DB)
from sqlalchemy import create_engine

# Import tools for creating database sessions and ORM base class
from sqlalchemy.orm import sessionmaker, declarative_base

# Database connection URL
# This uses SQLite and stores the database file as "nutritionist.db"
DATABASE_URL = "sqlite:///./nutritionist.db"

# Create the database engine
# connect_args is required for SQLite when used with FastAPI
# check_same_thread=False allows the DB to be accessed from multiple threads
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a session factory
# autocommit=False → changes must be committed manually
# autoflush=False → prevents automatic DB writes before queries
# bind=engine → connects sessions to our database engine
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all ORM models
# All database models will inherit from this Base
Base = declarative_base()

# It provides a database session to routes
def get_db():
    # Create a new database session
    db = SessionLocal()
    try:
        # Yield the session to the request
        yield db
    finally:
        # Always close the session after the request is finished
        db.close()
