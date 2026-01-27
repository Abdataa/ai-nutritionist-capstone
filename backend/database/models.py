# database/models.py:

# backend/database/models.py (file with this)

from sqlalchemy import Column, Integer, String, DateTime, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    meal_plans = relationship("MealPlan", back_populates="user")


class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    target_calories = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    client_name = Column(String(100), nullable=False, default="Client")
    goal = Column(String, nullable=False)
    diet_type = Column(String, nullable=False)
    daily_calories = Column(Integer, nullable=False)
    
    # Store macros as JSON object
    macros = Column(JSON, nullable=False, default=lambda: {
        "protein": 30,
        "carbs": 40, 
        "fats": 30
    })
    
    # Store the actual AI-generated plan
    generated_plan = Column(JSON, nullable=False)
    
    # Store grocery list (AI-generated)
    grocery_list = Column(JSON, nullable=True)
    
    # Track source (ai_model or rule_based_fallback)
    source = Column(String(50), nullable=False, default="ai_model")
    
    # Coach's notes
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="meal_plans")
    

def create_meal_plan(
    user_id,
    client_name="Client",
    goal=None,
    diet_type=None,
    daily_calories=0,
    macros=None,
    ai_result=None,
    source="ai_model",
    notes=None,
):
    """
    Factory to create a MealPlan instance from provided values.
    Avoids using request/current_user/ai_result at module import time.
    """
    # Use provided macros or fall back to sensible defaults
    final_macros = macros if macros is not None else {
        "protein": 30, "carbs": 40, "fats": 30
    }

    generated_plan = ai_result.get("meal_plan") or {}
    grocery_list = ai_result.get("grocery_list") if ai_result else None
    target_calories = daily_calories

    return MealPlan(
        user_id=user_id,
        client_name=client_name,
        goal=goal,
        diet_type=diet_type,
        daily_calories=daily_calories,
        target_calories=target_calories,
        macros=final_macros,
        generated_plan=generated_plan,
        grocery_list=grocery_list,
        source=source,
        notes=notes,
    )
