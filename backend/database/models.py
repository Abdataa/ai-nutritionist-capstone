# Import SQLAlchemy column types and utilities
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, LargeBinary

# Import relationship to define table relationships
from sqlalchemy.orm import relationship

# Import datetime for timestamps
from datetime import datetime

# Import Base class for ORM models
from .database import Base


# =========================
# User Model
# =========================
class User(Base):
    # Table name in the database
    __tablename__ = "users"

    # Primary key (unique user ID)
    id = Column(Integer, primary_key=True, index=True)

    # Basic user info
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    # Store hashed password (never store plain text passwords)
    password_hash = Column(String, nullable=False)

    # User role (e.g., user, admin)
    role = Column(String, default="user", nullable=False)

    # Account status flags
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Security-related fields
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)

    # Refresh token storage (hashed for security)
    refresh_token_hash = Column(String, nullable=True)
    refresh_token_expires = Column(DateTime, nullable=True)

    # Email verification fields
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True)
    email_verification_expires = Column(DateTime, nullable=True)

    # Password reset fields
    password_reset_token = Column(String, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)

    # Two-factor authentication (2FA) fields
    tfa_enabled = Column(Boolean, default=False)
    tfa_verified = Column(Boolean, default=False)
    tfa_secret = Column(String, nullable=True)

    # Profile information
    profile_picture = Column(String, nullable=True)  # File path or URL
    height = Column(Integer, nullable=True)          # Height in cm
    weight = Column(Integer, nullable=True)          # Weight in kg
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    activity_level = Column(String, nullable=True)   # e.g., low, moderate, high
    goal = Column(String, nullable=True)             # Fitness or nutrition goal

    # Timestamp fields
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship: One user can have many meal plans
    mealplans = relationship("MealPlan", back_populates="owner")


# =========================
# MealPlan Model
# =========================
class MealPlan(Base):
    # Table name
    __tablename__ = "mealplans"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key linking meal plan to a user
    user_id = Column(Integer, ForeignKey("users.id"))

    # Meal plan configuration
    goal = Column(String, nullable=False)
    diet_type = Column(String, nullable=False)
    daily_calories = Column(Integer, nullable=False)

    # Macronutrient distribution
    macro_protein = Column(Integer, nullable=False)
    macro_carbs = Column(Integer, nullable=False)
    macro_fats = Column(Integer, nullable=False)

    # Creation timestamp
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship back to the user
    owner = relationship("User", back_populates="mealplans")

    # Relationship: One meal plan can have many history entries
    history = relationship("MealHistory", back_populates="mealplan")


# =========================
# MealHistory Model
# =========================
class MealHistory(Base):
    # Table name
    __tablename__ = "mealhistory"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key linking to meal plan
    mealplan_id = Column(Integer, ForeignKey("mealplans.id"))

    # Day number of the meal plan (e.g., Day 1, Day 2)
    day_number = Column(Integer, nullable=False)

    # Stored meal data (JSON string)
    meals_json = Column(Text, nullable=False)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship back to meal plan
    mealplan = relationship("MealPlan", back_populates="history")
