"""
Pydantic schemas for meal plan requests and responses.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime


class Macros(BaseModel):
    """Macronutrient percentages."""
    protein: float = Field(30, ge=0, le=100, description="Protein percentage")
    carbs: float = Field(40, ge=0, le=100, description="Carbohydrate percentage")
    fats: float = Field(30, ge=0, le=100, description="Fat percentage")
    
    @validator('*')
    def round_percentage(cls, v):
        """Round percentages to one decimal place."""
        return round(v, 1)


class MealPlanRequest(BaseModel):
    """Request schema for generating a meal plan."""
    goal: str = Field(
        ...,
        description="Fitness goal (fat_loss, muscle_gain, maintenance, endurance, general_fitness)"
    )
    daily_calories: int = Field(
        ...,
        ge=800,
        le=4000,
        description="Daily calorie target (800-4000)"
    )
    diet_type: str = Field(
        ...,
        description="Diet type (vegan, vegetarian, keto, paleo, mediterranean, gluten_free, balanced)"
    )
    macros: Optional[Macros] = Field(
        default=Macros(),
        description="Macronutrient distribution (default: 30/40/30)"
    )
    client_name: Optional[str] = Field(
        None,
        max_length=100,
        description="Name of the client (optional)"
    )
    notes: Optional[str] = Field(
        None,
        max_length=500,
        description="Additional notes or dietary restrictions"
    )


class NutritionalInfo(BaseModel):
    """Nutritional information schema."""
    total_calories: float
    target_calories: int
    macros: Dict[str, Any]


class MealPlanResponse(BaseModel):
    """Response schema for a meal plan."""
    id: str
    client_name: str
    goal: str
    target_calories: int
    diet_type: str
    macros: Dict[str, float]
    meal_plan: Dict[str, Any]
    nutritional_info: NutritionalInfo
    grocery_list: Dict[str, Any]
    source: str
    evaluation: Dict[str, Any]
    notes: Optional[str]
    created_at: datetime
    message: Optional[str] = None


class MealPlanCreate(BaseModel):
    """Schema for creating a meal plan (for direct DB creation)."""
    client_name: str
    goal: str
    target_calories: int
    diet_type: str
    macros: Dict[str, float]
    generated_plan: Dict[str, Any]
    source: str


class MealPlanUpdate(BaseModel):
    """Schema for updating a meal plan."""
    client_name: Optional[str]
    notes: Optional[str]


class MealPlanSummary(BaseModel):
    """Summary schema for listing meal plans."""
    id: str
    client_name: str
    goal: str
    target_calories: int
    diet_type: str
    created_at: datetime
    source: str


class MealPlanListResponse(BaseModel):
    """Response schema for listing meal plans."""
    meal_plans: List[MealPlanSummary]
    total: int
    skip: int
    limit: int
    has_more: bool