import json
import asyncio
from openai import OpenAI

from core.config import settings
from ai.prompt_template import PROMPT_TEMPLATE
from ai.validator import validate_meal_plan
from ai.evaluation import evaluate_meal_plan
from ai.fallback import default_meal_plan

client = OpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_meal_plan(request):
    """
    Generates a meal plan using LLM with validation, evaluation, and fallback.
    """

    # ---- Build Prompt ----
    prompt = PROMPT_TEMPLATE.format(
        goal=request.goal,
        calories=request.daily_calories,
        diet_type=request.diet_type,
        protein=request.macros.protein,
        carbs=request.macros.carbs,
        fats=request.macros.fats
    )

    # ---- Call LLM (async-safe) ----
    try:
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
    except Exception as e:
        # API-level fallback
        return {
            "meal_plan": default_meal_plan(request.daily_calories),
            "fallback_used": True,
            "reason": f"LLM call failed: {str(e)}"
        }

    # ---- Extract Content ----
    try:
        content = response.choices[0].message.content
    except (IndexError, AttributeError) as e:
        return {
            "meal_plan": default_meal_plan(request.daily_calories),
            "fallback_used": True,
            "reason": "Invalid LLM response structure"
        }

    # ---- Parse JSON ----
    try:
        parsed_output = json.loads(content)
    except Exception as e:
        return {
            "meal_plan": default_meal_plan(request.daily_calories),
            "fallback_used": True,
            "reason": "JSON parsing failed",
            "raw_output": content
        }

    # ---- Validate Structure & Calories ----
    is_valid, message = validate_meal_plan(
        parsed_output,
        target_calories=request.daily_calories
    )

    if not is_valid:
        return {
            "meal_plan": default_meal_plan(request.daily_calories),
            "fallback_used": True,
            "reason": f"Validation failed: {message}"
        }

    # ---- Evaluate Quality ----
    evaluation = evaluate_meal_plan(
        parsed_output,
        target_calories=request.daily_calories
    )

    # ---- Evaluation-based Fallback ----
    if not all(evaluation.values()):
        return {
            "meal_plan": default_meal_plan(request.daily_calories),
            "fallback_used": True,
            "reason": "Evaluation metrics failed",
            "evaluation": evaluation
        }

    # ---- Final Success Response ----
    return {
        "meal_plan": parsed_output,
        "fallback_used": False,
        "evaluation": evaluation
    }
