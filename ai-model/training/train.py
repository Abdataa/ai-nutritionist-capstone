"""
Fine-tuning pipeline for AI Nutritionist
NOTE: Designed for cloud execution (Google Colab / GPU server)
"""

from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
from preprocess import load_dataset, format_for_training
import yaml

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

MODEL_NAME = config["model"]["base_model"]
DATASET_PATH = config["dataset"]["path"]

# Load tokenizer & model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# Load dataset
raw_data = load_dataset(DATASET_PATH)

# Tokenize
def tokenize(example):
    text = format_for_training(example)
    return tokenizer(text, truncation=True, padding="max_length", max_length=2048)

tokenized_data = [tokenize(x) for x in raw_data]

# Training arguments
training_args = TrainingArguments(
    output_dir=config["output"]["save_dir"],
    per_device_train_batch_size=config["training"]["batch_size"],
    num_train_epochs=config["training"]["epochs"],
    learning_rate=config["training"]["learning_rate"],
    logging_steps=10,
    save_steps=500,
    fp16=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data,
)

# Start training (cloud only)
# trainer.train()

print("Training pipeline initialized successfully.")
