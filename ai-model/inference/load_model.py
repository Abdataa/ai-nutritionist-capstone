from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_PATH = "../training/fine_tuned_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)

def generate(prompt):
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=500)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
