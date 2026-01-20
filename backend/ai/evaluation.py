from typing import Dict, List

EXPECTED_DAYS = 7
CALORIE_TOLERANCE = 100  # ± kcal

def evaluate_meal_plan(meal_plan: List[Dict], target_calories: int) -> Dict:
    """
    Evaluates AI-generated meal plan quality.
    Returns metric scores and flags.
    """

    metrics = {
        "valid_json": True,
        "days_coverage": False,
        "meal_structure_valid": True,
        "calorie_accuracy": True,
        "ingredients_present": True,
        "safety_passed": True
    }

    # --- 1. Days Coverage ---
    if len(meal_plan) == EXPECTED_DAYS:
        metrics["days_coverage"] = True

    # --- 2. Per-Day Validation ---
    for day in meal_plan:
        if "meals" not in day or "total_calories" not in day:
            metrics["meal_structure_valid"] = False
            break

        # --- 3. Calorie Accuracy ---
        if abs(day["total_calories"] - target_calories) > CALORIE_TOLERANCE:
            metrics["calorie_accuracy"] = False

        # --- 4. Ingredient Check ---
        for meal in day.get("meals", []):
            if not meal.get("ingredients"):
                metrics["ingredients_present"] = False

    # --- 5. Safety Check  ---
    if target_calories < 1000 or target_calories > 4000:
        metrics["safety_passed"] = False

    return metrics
