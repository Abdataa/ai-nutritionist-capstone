def default_meal_plan(calories: int):
    """
    Safe fallback meal plan (rule-based)
    """
    daily_calories = calories or 2000

    return [
        {
            "day": day,
            "meals": [
                {
                    "name": "Balanced Bowl",
                    "calories": int(daily_calories * 0.35),
                    "ingredients": ["rice", "vegetables", "protein source"]
                },
                {
                    "name": "Healthy Lunch",
                    "calories": int(daily_calories * 0.40),
                    "ingredients": ["whole grains", "vegetables", "lean protein"]
                },
                {
                    "name": "Light Dinner",
                    "calories": int(daily_calories * 0.25),
                    "ingredients": ["vegetables", "healthy fats"]
                }
            ],
            "total_calories": daily_calories
        }
        for day in range(1, 8)
    ]
