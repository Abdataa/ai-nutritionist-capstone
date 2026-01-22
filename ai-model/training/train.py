"""
Fine-tuning pipeline for AI Nutritionist (LoRA)
Designed for Google Colab / limited GPU
"""

from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, TaskType
from preprocess import load_dataset, format_for_training
import yaml
import torch

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

MODEL_NAME = config["model"]["base_model"]
DATASET_PATH = config["dataset"]["path"]
OUTPUT_DIR = config["output"]["save_dir"]

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

# Load base model (FP16)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"]
)

# Apply LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# Load dataset
raw_data = load_dataset(DATASET_PATH)

# Tokenization
def tokenize(example):
    text = format_for_training(example)
    tokens = tokenizer(
        text,
        truncation=True,
        padding="max_length",
        max_length=config["training"]["max_seq_length"],
    )
    tokens["labels"] = tokens["input_ids"].copy()
    return tokens

tokenized_data = [tokenize(x) for x in raw_data]

# Training arguments
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=config["training"]["batch_size"],
    gradient_accumulation_steps=config["training"]["gradient_accumulation_steps"],
    num_train_epochs=config["training"]["epochs"],
    learning_rate=config["training"]["learning_rate"],
    fp16=True,
    logging_steps=10,
    save_strategy="epoch",
    report_to="none"
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data,
)

# Train
trainer.train()

# Save LoRA adapter
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print("LoRA fine-tuning completed successfully.")
