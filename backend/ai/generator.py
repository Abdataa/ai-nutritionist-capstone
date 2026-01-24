# Import the OpenAI client SDK
from openai import OpenAI

# Import application settings (e.g., API keys, environment configs)
from core.config import settings

# Import the prompt template used to structure the AI request
from ai.prompt_template import PROMPT_TEMPLATE

# Asyncio is used to run blocking code in a non-blocking way
import asyncio


# Initialize the OpenAI client using the API key from settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)


# Asynchronous function to generate a meal plan based on a request object
async def generate_meal_plan(request):
    """
    Generates a personalized meal plan using OpenAI based on user goals and macros.

    Args:
        request: An object containing meal plan preferences such as
                 goal, daily calories, diet type, and macro breakdown.

    Returns:
        A string containing the generated meal plan.
    """

    # Format the prompt by injecting user-specific data into the template
    prompt = PROMPT_TEMPLATE.format(
        goal=request.goal,
        calories=request.daily_calories,
        diet_type=request.diet_type,
        protein=request.macros.protein,
        carbs=request.macros.carbs,
        fats=request.macros.fats
    )

    # Run the OpenAI chat completion call in a separate thread
    # This prevents blocking the event loop since the OpenAI SDK is synchronous
    response = await asyncio.to_thread(
        client.chat.completions.create,
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        # Extract and return the generated text from the response
        return response.choices[0].message.content

    except (IndexError, AttributeError) as e:
        # Raise a clear error if the response structure is not as expected
        raise RuntimeError(
            "Failed to generate meal plan: invalid response structure"
        ) from e
