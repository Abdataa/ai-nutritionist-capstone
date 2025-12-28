# Fine-Tuning Pipeline – AI Nutritionist

## Overview
This module defines a supervised fine-tuning (SFT) pipeline for adapting a
Large Language Model to generate personalized nutritional meal plans.

## Dataset
- Format: JSONL
- Instruction-tuning format
- Roles: system, user, assistant

## Model
- Base model: Mistral-7B-Instruct
- Fine-tuning type: Supervised Fine-Tuning (SFT)

## Execution
Due to local hardware limitations, full training is designed to be executed
on cloud platforms such as Google Colab or GPU servers.

## Output
The fine-tuned model can be exported and integrated into the backend
for offline inference.
