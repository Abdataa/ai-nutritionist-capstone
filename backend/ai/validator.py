"""
Validation for meal plans and user inputs.
"""

def validate_meal_plan(meal_plan: dict, target_calories: int, 
                      diet_type: str = None) -> tuple[bool, str]:
    """Validate generated meal plan."""
    
    # Basic structure validation
    required_keys = {"plan_name", "days"}
    if not all(key in meal_plan for key in required_keys):
        return False, "Missing required keys"
    
    if not isinstance(meal_plan["days"], list) or len(meal_plan["days"]) != 7:
        return False, "Must have exactly 7 days"
    
    # Check each day
    total_calories = 0
    for day in meal_plan["days"]:
        if "meals" not in day:
            return False, f"Day {day.get('day')} missing meals"
        
        day_cals = sum(meal.get("calories", 0) for meal in day["meals"])
        total_calories += day_cals
        
        # Check each meal has required fields
        for meal in day["meals"]:
            req_meal_keys = {"meal", "description", "calories"}
            if not all(key in meal for key in req_meal_keys):
                return False, f"Meal missing required fields"
    
    # Check calorie range (±10%)
    avg_daily = total_calories / 7
    if not (target_calories * 0.9 <= avg_daily <= target_calories * 1.1):
        return False, f"Calories out of range: {avg_daily:.0f} vs target {target_calories}"
    
    # Diet-specific validation
    if diet_type:
        forbidden = {
            "vegan": ["chicken", "beef", "pork", "fish", "egg", "milk", "cheese", "honey"],
            "vegetarian": ["chicken", "beef", "pork", "fish", "salmon", "tuna"],
            "keto": ["bread", "pasta", "rice", "potato", "sugar", "juice"]
        }
        
        forbidden_items = forbidden.get(diet_type.lower(), [])
        plan_str = str(meal_plan).lower()
        
        for item in forbidden_items:
            if item in plan_str:
                return False, f"Forbidden item for {diet_type}: {item}"
    
    return True, "Valid"