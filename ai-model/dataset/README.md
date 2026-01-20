# AI Nutritionist Fine-Tuning Dataset

## Description
This dataset contains instruction–response pairs for fine-tuning a Large Language Model
to generate personalized 7-day meal plans for fitness clients.

## Format
- JSONL
- Instruction-tuning format
- Roles: system, user, assistant

## Input Features
- Fitness goal
- Daily calorie target
- Diet type
- Macro distribution

## Output
- Structured JSON meal plan
- 7 days
- Meals, snacks, ingredients, calories

## Usage
Designed for supervised fine-tuning (SFT) on models such as:
- TinyLLaMA
- Mistral-7B
- GPT-OSS

## Note
Due to hardware constraints, full fine-tuning is intended for cloud execution.