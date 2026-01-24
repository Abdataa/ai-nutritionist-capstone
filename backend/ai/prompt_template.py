"""
Structured prompt templates for the AI model.
"""

def get_prompt_template(goal: str, calories: int, diet_type: str, 
                       protein: int, carbs: int, fats: int) -> str:
    """Return structured prompt for meal plan generation."""
    
    # Diet-specific constraints
    diet_constraints = {
        "vegan": "NO animal products: meat, dairy, eggs, honey.",
        "vegetarian": "NO meat, fish, or poultry. Eggs and dairy allowed.",
        "keto": "HIGH fat, MODERATE protein, VERY LOW carbs (<50g net).",
        "paleo": "NO grains, legumes, dairy, processed foods.",
        "mediterranean": "Emphasis on vegetables, fruits, olive oil, fish.",
        "gluten_free": "NO wheat, barley, rye. Use gluten-free alternatives."
    }
    
    constraint = diet_constraints.get(diet_type.lower(), 
                                     "Balanced macronutrients.")
    
    prompt = f"""### INSTRUCTION:
Generate a 7-day personalized meal plan in JSON format.

### CLIENT PROFILE:
- Goal: {goal}
- Daily Calories: {calories}
- Diet Type: {diet_type} (STRICT ADHERENCE REQUIRED)
- Macronutrient Split: Protein {protein}%, Carbs {carbs}%, Fats {fats}%

### DIETARY CONSTRAINT:
{constraint}

### OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{{
  "plan_name": "string",
  "days": [
    {{
      "day": "Monday",
      "total_calories": number,
      "meals": [
        {{
          "meal": "Breakfast",
          "time": "8:00 AM",
          "description": "string",
          "ingredients": [
            {{"name": "string", "quantity": number, "unit": "g/ml/cups"}}
          ],
          "calories": number,
          "macros": {{"protein_g": number, "carbs_g": number, "fats_g": number}}
        }}
      ]
    }}
  ]
}}

### RULES:
1. Total daily calories must be {calories} ±100
2. Macronutrient percentages must match: P{protein}/C{carbs}/F{fats}%
3. Include 3-5 meals per day
4. Provide detailed ingredients with quantities
5. Include cooking instructions for complex meals
6. Ensure variety across the 7 days

### REMINDER:
Return ONLY the JSON object. No explanations, no markdown, no extra text.
"""
    
    return prompt