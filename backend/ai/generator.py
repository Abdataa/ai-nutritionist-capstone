from openai import OpenAI
from core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_meal_plan(data):
    prompt = f"""
    You are a certified fitness nutritionist.

    Generate a 3-day meal plan for:
    - Goal: {data.goal}
    - Calories: {data.calories} kcal/day
    - Diet type: {data.diet_type}
    - Macros: Protein {data.protein}%, Carbs {data.carbs}%, Fats {data.fats}%

    Include:
    - 3 meals + 2 snacks per day
    - Approx calories per meal
    - Grocery list
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=600
    )

    return response.choices[0].message.content

