from fastapi import APIRouter
from schemas.mealplan import MealPlanRequest
from ai.generator import generate_meal_plan

router = APIRouter(prefix="/mealplan", tags=["Meal Plan"])

@router.post("/")
async def create_meal_plan(request: MealPlanRequest):
    result = await generate_meal_plan(request)
    return {"meal_plan": result}
