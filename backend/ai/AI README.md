AI Module - AI Nutritionist Capstone

## 1. Overview

The AI module is the core intelligence of the AI Nutritionist for Fitness Coaches system. It is responsible for generating personalized meal plans based on user-specific nutritional requirements using a Large Language Model (LLM), while ensuring correctness, safety, and reliability through validation, evaluation, and fallback mechanisms.

The design follows a production-inspired AI pipeline, not a simple prompt-based demo.



## 2. Responsibilities of the AI Module

The AI module performs the following tasks:

* Prompt engineering for structured meal plan generation
* LLM-based meal plan generation
* Output validation (structure + calorie constraints)
* Quality evaluation using rule-based metrics
* Automatic fallback to safe default meal plans when AI output is invalid
* Preparation for future fine-tuning and offline LLM deployment

## 3. AI Architecture Overview

### AI Processing Pipeline

```
User Input
    ↓
Prompt Template
    ↓
LLM
    ↓
JSON Parsing
    ↓
Validation (Schema + Calories)
    ↓
Evaluation (Quality Metrics)
    ↓
Safe Output OR Fallback Meal Plan
```

This layered approach ensures the system is robust against LLM hallucinations and malformed outputs.

---

## 4. Prompt Engineering

### Prompt Location

```
backend/ai/prompt_template.py
```

### Prompt Design Principles

* Explicit role instruction ("You are a certified fitness nutritionist")
* Strict JSON-only output requirement
* Fixed schema definition
* Explicit calorie and macro constraints
* Zero tolerance for explanations or free text

### Example Prompt (Simplified)

```text
Generate a 7-day meal plan in STRICT JSON format.

Constraints:
- Daily calories: {calories}
- Diet type: {diet_type}
- Macro split:
  - Protein: {protein}%
  - Carbs: {carbs}%
  - Fats: {fats}%

Rules:
- Output must be valid JSON
- No extra text or comments
```

## 5. Meal Plan Generation

### Generator File

```
backend/ai/generator.py
```

### Model Used

* Model: gpt-4o-mini
* Access: OpenAI API
* Execution: Async-safe using asyncio.to_thread

### Core Function

```python
async def generate_meal_plan(request)
```

This function:

1. Builds the prompt
2. Calls the LLM
3. Parses JSON output
4. Validates and evaluates results
5. Applies fallback if necessary

## 6. Validation Layer

### File

```
backend/ai/validator.py
```

### Purpose

Validation ensures hard correctness of AI output.

### Validation Checks

* Correct JSON structure
* Required fields exist (days, meals, snacks)
* Daily calorie total is within acceptable tolerance
* Numeric values are valid and non-negative

### Outcome

```python
(is_valid: bool, message: str)
```

Invalid outputs never reach the frontend.

---

## 7. Evaluation Layer

### File

```
backend/ai/evaluation.py
```

### Purpose

Evaluation measures output quality, not just correctness.

### Example Metrics

* Calorie accuracy score
* Meal diversity score
* Nutritional balance heuristic
* Completeness (all days present)

Evaluation enables quality-aware AI decisions.

---

## 8. Fallback Strategy

### File

```
backend/ai/fallback.py
```

### Why Fallback Is Needed

LLMs may:

* Produce invalid JSON
* Miss constraints
* Hallucinate values
* Fail API calls

### Fallback Behavior

If validation or evaluation fails:

* The system returns a predefined safe meal plan
* Marks response with `fallback_used = true`
* Prevents system crashes or unsafe outputs

This is a production-grade safety mechanism.

---

## 9. Dataset & Fine-Tuning Preparation

### Dataset Location

```
ai-model/dataset/mealplans.jsonl
```

### Dataset Structure

Each line contains:

```json
{
  "input": {
     "goal": "Fat loss",
     "calories": 1800,
     "diet_type": "Vegan",
     "macros": {"protein": 40, "carbs": 30, "fats": 30}
  },
  "output": { ... structured meal plan ... }
}
```

### Fine-Tuning Status

* Full fine-tuning is out of scope due to hardware constraints
* Dataset is prepared for:
  * Future LoRA fine-tuning
  * Offline LLM deployment (TinyLLaMA / Mistral)

---

## 10. Hardware & Deployment Considerations

### Local Laptop (Development)

* CPU-only
* Suitable for:
  * Prompt engineering
  * Validation logic
  * API-based inference

### Fine-Tuning

* Google Colab (GPU)
* Cloud GPU services

## 11. Security & Privacy Notes

* No user data is used for training

* No personally identifiable data processed
* Output is deterministic and auditable via validation rules

## 12. AI Module Limitations

* Depends on external LLM availability
* Generated meal plans are advisory, not medical prescriptions
* Nutritional values are approximate
