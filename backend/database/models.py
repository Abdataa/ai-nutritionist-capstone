from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, LargeBinary
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


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

class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id = Column(Integer, primary_key=True)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # Add role field
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    refresh_token_hash = Column(String, nullable=True)
    refresh_token_expires = Column(DateTime, nullable=True)
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True)
    email_verification_expires = Column(DateTime, nullable=True)
    password_reset_token = Column(String, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)
    tfa_enabled = Column(Boolean, default=False)
    tfa_verified = Column(Boolean, default=False)
    tfa_secret = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # Path to user's profile picture
    height = Column(Integer, nullable=True)  # User's height in cm
    weight = Column(Integer, nullable=True)  # User's weight in kg
    age = Column(Integer, nullable=True)  # User's age
    gender = Column(String, nullable=True)  # User's gender
    activity_level = Column(String, nullable=True)  # User's activity level
    goal = Column(String, nullable=True)  # User's fitness goal
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    title = Column(String, nullable=True)
    location = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    status = Column(String, default="Active")  # User's status (Active, Inactive, Completed)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    coach = relationship("User")
    nutrition_inputs = relationship("NutritionInput", back_populates="client")

class NutritionInput(Base):
    __tablename__ = "nutrition_inputs"

    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("client_profiles.id"))

    goal = Column(String, nullable=False)
    activity_level = Column(String, nullable=False)
    diet_type = Column(String, nullable=False)

    client = relationship("ClientProfile", back_populates="nutrition_inputs")
    macro_result = relationship("MacroResult", back_populates="nutrition_input", uselist=False)
class MacroResult(Base):
    __tablename__ = "macro_results"

    id = Column(Integer, primary_key=True)
    nutrition_input_id = Column(Integer, ForeignKey("nutrition_inputs.id"))

    calories = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fats_g = Column(Float)

    nutrition_input = relationship("NutritionInput", back_populates="macro_result")
