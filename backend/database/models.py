from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime
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
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

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
