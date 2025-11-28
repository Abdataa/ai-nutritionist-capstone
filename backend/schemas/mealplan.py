from pydantic import BaseModel

class MealPlanRequest(BaseModel):
    goal: str
    calories: int
    diet_type: str
    protein: int
    carbs: int
    fats: int
