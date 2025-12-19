from openai import OpenAI
from core.config import settings
from ai.prompt_template import PROMPT_TEMPLATE
from ai.validator import validate_meal_plan
import asyncio
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_meal_plan(request):
    prompt = PROMPT_TEMPLATE.format(
        goal=request.goal,
        calories=request.daily_calories,
        diet_type=request.diet_type,
        protein=request.macros.protein,
        carbs=request.macros.carbs,
        fats=request.macros.fats
    )

    response = await asyncio.to_thread(
        client.chat.completions.create,
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        content = response.choices[0].message.content
    except (IndexError, AttributeError) as e:
        raise RuntimeError("Failed to generate meal plan: invalid response structure") from e

    try:
        parsed_output = json.loads(content)
    except Exception as e:
        return {
            "error": "Failed to parse meal plan output as JSON",
            "reason": str(e),
            "raw_output": content
        }

    is_valid, message = validate_meal_plan(
        parsed_output,
        target_calories=request.daily_calories
    )

    if not is_valid:
        return {
            "error": "Meal plan validation failed",
            "reason": message,
            "raw_output": parsed_output
        }

    return parsed_output




