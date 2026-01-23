# Business logic for macro calculations


ACTIVITY_MULTIPLIER = {
 "low": 1.2,
 "moderate": 1.55,
 "high": 1.9,
}


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
 """Mifflin-St Jeor Equation"""
 if gender.lower() == "male":
  return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
 return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161


def calculate_daily_calories(bmr: float, activity_level: str) -> float:
 return bmr * ACTIVITY_MULTIPLIER.get(activity_level, 1.2)


def adjust_for_goal(calories: float, goal: str) -> float:
   if goal == "cut":
    return calories - 500
   if goal == "bulk":
    return calories + 300
   return calories


def calculate_macros(calories: float):
 protein_g = calories * 0.30 / 4
 carbs_g = calories * 0.40 / 4
 fats_g = calories * 0.30 / 9
 return calories, protein_g, carbs_g, fats_g