from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database import models, schemas
from services.macro_calculator import (
calculate_bmr,
calculate_daily_calories,
adjust_for_goal,
calculate_macros,
)


router = APIRouter()


@router.post("/macros/{nutrition_id}", response_model=schemas.MacroResponse)
def generate_macros(nutrition_id: int, db: Session = Depends(get_db)):
 nutrition = db.query(models.NutritionInput).filter_by(id=nutrition_id).first()
 client = nutrition.client


 bmr = calculate_bmr(client.weight_kg, client.height_cm, client.age, client.gender)
 calories = calculate_daily_calories(bmr, nutrition.activity_level)
 calories = adjust_for_goal(calories, nutrition.goal)


 calories, protein, carbs, fats = calculate_macros(calories)


 result = models.MacroResult(
 nutrition_input_id=nutrition.id,
 calories=calories,
 protein_g=protein,
 carbs_g=carbs,
 fats_g=fats,
)


 db.add(result)
 db.commit()
 db.refresh(result)


 return result