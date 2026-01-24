#ai-model/inference/offline_inference.py
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

# ----------------------------
# CONFIG
# ----------------------------
BASE_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
LORA_PATH = "../fine-tuned/tinyllama-nutritionist-lora/nutrition_lora/nutrition_lora"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

FORBIDDEN = {
    "vegan": ["chicken", "beef", "fish", "salmon", "tuna", "egg", "milk", "cheese", "honey"],
    "vegetarian": ["chicken", "beef", "fish", "salmon", "tuna"],
    "omnivore": []
}

# ----------------------------
# LOAD MODEL



tokenizer = AutoTokenizer.from_pretrained(LORA_PATH)

#  IMPORTANT: NO device_map, NO offloading
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float32,   # CPU-safe
    low_cpu_mem_usage=False
)

model = PeftModel.from_pretrained(
    base_model,
    LORA_PATH,
    is_trainable=False
)

model.eval()


# ----------------------------
# VALIDATION
# ----------------------------
def validate_meal_plan(text: str, diet_type: str):
    forbidden = FORBIDDEN.get(diet_type.lower(), [])
    for word in forbidden:
        if word in text.lower():
            return False, f"Forbidden item detected: {word}"
    return True, "Valid"

# ----------------------------
# GENERATION
# ----------------------------
def generate_meal_plan(
    goal: str,
    calories: int,
    diet_type: str,
    protein: int,
    carbs: int,
    fats: int,
    max_tokens: int = 500
):
    prompt = f"""
### Instruction:
Generate a 7-day meal plan.

### Input:
Goal: {goal}
Calories: {calories}
Diet: {diet_type} (STRICT)
Macros: Protein {protein}%, Carbs {carbs}%, Fats {fats}%

Rules:
- ONLY allowed foods for the diet
- Return JSON only
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

    # Try extracting JSON
    try:
        start = decoded.find("[")
        end = decoded.rfind("]") + 1
        parsed = json.loads(decoded[start:end])
    except Exception:
        parsed = decoded

    valid, msg = validate_meal_plan(decoded, diet_type)

    return {
        "meal_plan": parsed,
        "valid": valid,
        "message": msg,
        "raw_output": decoded
    }


# ----------------------------
# CLI TEST
# ----------------------------
if __name__ == "__main__":
    result = generate_meal_plan(
        goal="Fat loss",
        calories=1800,
        diet_type="Vegan",
        protein=40,
        carbs=30,
        fats=30
    )

    print("VALID:", result["valid"], result["message"])
    print(json.dumps(result["meal_plan"], indent=2))
