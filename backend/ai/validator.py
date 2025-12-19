def validate_meal_plan(meal_plan: list, target_calories: int):
    """
    Validates AI-generated meal plan structure and logic
    """

    if not isinstance(meal_plan, list):
        return False, "Meal plan must be a list"

    if len(meal_plan) != 7:
        return False, "Meal plan must contain exactly 7 days"

    for day in meal_plan:
        if "day" not in day:
            return False, "Missing day field"

        if "meals" not in day or "snacks" not in day:
            return False, "Each day must include meals and snacks"

        if not isinstance(day["meals"], list) or not isinstance(day["snacks"], list):
            return False, "Meals and snacks must be lists"

        if "total_calories" not in day:
            return False, "Missing total_calories field"

        # Allow ±5% calorie tolerance
        calories = day["total_calories"]
        tolerance = target_calories * 0.05

        if abs(calories - target_calories) > tolerance:
            return False, f"Calories out of range for day {day['day']}"

    return True, "Meal plan is valid"
