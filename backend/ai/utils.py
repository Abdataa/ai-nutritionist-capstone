"""
Utility functions for meal plan processing.
"""

import json
from typing import Dict, Tuple, Any

def calculate_macros(meal_plan: Dict[str, Any]) -> Tuple[float, Dict[str, float]]:
    """Calculate total calories and macro breakdown from meal plan."""
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fats = 0
    
    try:
        if isinstance(meal_plan, dict):
            days = meal_plan.get("days", [])
            for day in days:
                if isinstance(day, dict):
                    meals = day.get("meals", [])
                    for meal in meals:
                        if isinstance(meal, dict):
                            total_calories += meal.get("calories", 0)
                            macros = meal.get("macros", {})
                            if isinstance(macros, dict):
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

def extract_grocery_list(meal_plan: Dict[str, Any]) -> Dict[str, float]:
    """Extract grocery list from meal plan."""
    groceries = {}
    
    try:
        if isinstance(meal_plan, dict):
            days = meal_plan.get("days", [])
            for day in days:
                if isinstance(day, dict):
                    meals = day.get("meals", [])
                    for meal in meals:
                        if isinstance(meal, dict):
                            ingredients = meal.get("ingredients", [])
                            for ingredient in ingredients:
                                if isinstance(ingredient, dict):
                                    name = ingredient.get("name", "").lower()
                                    quantity = ingredient.get("quantity", 0)
                                    unit = ingredient.get("unit", "")
                                    
                                    if name:
                                        key = f"{name} ({unit})" if unit else name
                                        groceries[key] = groceries.get(key, 0) + float(quantity)
    except Exception:
        pass
    
    return groceries