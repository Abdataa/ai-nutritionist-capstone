"""
Utility functions for meal plan processing.
"""

def calculate_macros(meal_plan: dict) -> tuple:
    """Calculate total calories and macro breakdown from meal plan."""
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fats = 0
    
    try:
        for day in meal_plan.get("days", []):
            for meal in day.get("meals", []):
                total_calories += meal.get("calories", 0)
                macros = meal.get("macros", {})
                total_protein += macros.get("protein_g", 0)
                total_carbs += macros.get("carbs_g", 0)
                total_fats += macros.get("fats_g", 0)
        
        # Calculate percentages
        if total_calories > 0:
            protein_pct = (total_protein * 4 / total_calories) * 100
            carbs_pct = (total_carbs * 4 / total_calories) * 100
            fats_pct = (total_fats * 9 / total_calories) * 100
        else:
            protein_pct = carbs_pct = fats_pct = 0
        
        return total_calories, {
            "protein_g": total_protein,
            "carbs_g": total_carbs,
            "fats_g": total_fats,
            "protein_pct": protein_pct,
            "carbs_pct": carbs_pct,
            "fats_pct": fats_pct
        }
    except Exception:
        return 0, {}