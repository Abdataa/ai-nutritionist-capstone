from offline_inference import generate_meal_plan

result = generate_meal_plan(
    goal="Muscle gain",
    calories=2500,
    diet_type="Vegetarian",
    protein=35,
    carbs=40,
    fats=25
)


print("VALID:", result["valid"])
print(result["message"])
print(result["meal_plan"])
