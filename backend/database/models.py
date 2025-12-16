from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    full_name = Column(String(255), nullable=True)

    # relationship to clients (one coach -> many clients) if needed
    clients = relationship("Client", back_populates="coach")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    notes = Column(String, nullable=True)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    coach = relationship("User", back_populates="clients")
