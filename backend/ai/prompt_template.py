# Define a template for the AI prompt that will be sent to OpenAI
# This template instructs the AI to generate a 7-day meal plan based on user inputs.
PROMPT_TEMPLATE = """
You are a certified fitness nutritionist.

# Instruction for the AI: Generate a structured 7-day meal plan
# using the user-provided details.
Generate a structured **7-day meal plan** based on the following user details:

# User-specific variables will be inserted here using .format()
Goal: {goal}               # User's fitness goal (e.g., weight loss, muscle gain)
Daily Calories: {calories} # Target daily calorie intake
Diet Type: {diet_type}     # Type of diet (e.g., vegan, keto, balanced)
Macros:                     # Macro ratios in percentages
  - Protein: {protein}%
  - Carbs: {carbs}%
  - Fats: {fats}%

### OUTPUT FORMAT (VERY IMPORTANT)
# Instruct AI to return ONLY valid JSON for programmatic parsing
Return ONLY valid JSON, no explanations, no markdown.

# Provide a schema example that the AI must follow for each day
Schema:
[
  {{
    "day": 1,
    "meals": [               # List of main meals
      {{
        "name": "Meal Name", # Name of the meal
        "calories": 350,     # Calories for this meal
        "ingredients": ["item1", "item2"]  # Ingredients list
      }}
    ],
    "snacks": [              # List of snacks
      {{
        "name": "Snack Name",
        "calories": 150
      }}
    ],
    "total_calories": 1800   # Total calories for the day
  }}
]

### Rules:
- 3 meals + 2 snacks PER DAY             # Structure every day consistently
- Respect calories and macro ratios       # Ensure macros match user input
- Only use foods available in African & Ethiopian markets if possible
- All days must be included (day 1–7)    # Complete 7-day plan
- JSON must be valid and parsable         # Ensures code can parse AI response
"""
