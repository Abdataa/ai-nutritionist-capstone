import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# ----------------------------
# CONFIG
# ----------------------------
BASE_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
LORA_PATH = "../fine-tuned/tinyllama-nutritionist-lora/nutrition_lora/nutrition_lora"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

FORBIDDEN = {
    "vegan": ["chicken", "beef", "fish", "salmon", "tuna", "egg", "milk", "cheese", "honey"],
    "vegetarian": ["chicken", "beef", "fish", "salmon", "tuna"],
    "omnivore": []  # no restriction
}

# ----------------------------
# LOAD MODEL
# ----------------------------
tokenizer = AutoTokenizer.from_pretrained(LORA_PATH)
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto"
)
model = PeftModel.from_pretrained(model, LORA_PATH)
model.eval()

# ----------------------------
# POST-GENERATION VALIDATION
# ----------------------------
def validate_meal_plan(text, diet_type):
    forbidden_words = FORBIDDEN.get(diet_type.lower(), [])
    for word in forbidden_words:
        if word in text.lower():
            return False, f"Forbidden item detected: {word}"
    return True, "Valid"

# ----------------------------
# PDF EXPORT
# ----------------------------
def export_pdf(text, filename="meal_plan.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    margin = 40
    lines = text.splitlines()
    y = height - margin
    for line in lines:
        c.drawString(margin, y, line)
        y -= 14
        if y < margin:
            c.showPage()
            y = height - margin
    c.save()
    print(f" PDF exported as {filename}")

# ----------------------------
# GENERATION FUNCTION
# ----------------------------
def generate_meal_plan(goal, calories, diet_type, protein, carbs, fats, max_tokens=500):
    prompt = f"""
### Instruction:
Generate a 7-day meal plan.

### Input:
Goal: {goal}
Calories: {calories}
Diet: {diet_type} (STRICT — respect all diet rules)
Macros: Protein {protein}%, Carbs {carbs}%, Fats {fats}%

Rules:
- ONLY allowed foods for the diet
- If unsure, use tofu, legumes, vegetables, grains, nuts
- Return JSON with meals, snacks, total_calories
"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            do_sample=True,
            top_p=0.9,
            temperature=0.3
        )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)
    # Extract JSON part if possible
    try:
        start = decoded.find("[")
        end = decoded.rfind("]") + 1
        meal_plan_json = decoded[start:end]
        parsed = json.loads(meal_plan_json)
    except Exception:
        parsed = decoded

    # Validate meals
    valid, message = validate_meal_plan(decoded, diet_type)
    return parsed, valid, message

# ----------------------------
# MAIN (example usage)
# ----------------------------
if __name__ == "__main__":
    # Example: vegan fat loss
    plan, valid, msg = generate_meal_plan(
        goal="Fat loss",
        calories=1800,
        diet_type="Vegan",
        protein=40,
        carbs=30,
        fats=30
    )
    print("VALIDATION:", valid, msg)
    print("---- MEAL PLAN ----")
    print(plan)

    # Export PDF
    if valid:
        export_pdf(str(plan), filename="meal_plan_vegan.pdf")
