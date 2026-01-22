from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

BASE_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
LORA_PATH = "./lora_model"

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto"
)

model = PeftModel.from_pretrained(model, LORA_PATH)
model.eval()

prompt = """### Instruction:
Generate a 7-day meal plan.

### Input:
Goal: Fat loss
Calories: 1800
Diet: Vegan
Macros: Protein 40%, Carbs 30%, Fats 30%

### Response:
"""

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    output = model.generate(
        **inputs,
        max_new_tokens=500,
        temperature=0.7,
        top_p=0.9,
        do_sample=True
    )

print(tokenizer.decode(output[0], skip_special_tokens=True))
