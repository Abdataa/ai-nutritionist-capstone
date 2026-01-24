"""
backend/ai/generator.py
Main AI orchestration layer for meal plan generation.
Integrates fine-tuned TinyLLaMA model with fallback mechanisms.
"""

import json
import logging
from typing import Dict, Any, Optional
import asyncio

# Import your components
from ai.prompt_template import get_prompt_template
from ai.validator import validate_meal_plan
from ai.evaluation import evaluate_meal_plan
from ai.fallback import default_meal_plan
from ai.utils import calculate_macros

# Configure logging
logger = logging.getLogger(__name__)

class AINutritionistGenerator:
    """Main AI generator class for meal plan creation."""
    
    def __init__(self, model_path: str = None):
        """
        Initialize the generator.
        
        Args:
            model_path: Path to fine-tuned TinyLLaMA model
        """
        self.model = None
        self.tokenizer = None
        self.model_path = model_path
        
        # Load model lazily on first use
        self._model_loaded = False
        
    async def load_model(self):
        """Load the fine-tuned TinyLLaMA model asynchronously."""
        if self._model_loaded:
            return
            
        try:
            logger.info("Loading fine-tuned TinyLLaMA model...")
            
            #  avoid early dependency
            from transformers import AutoTokenizer, AutoModelForCausalLM
            from peft import PeftModel
            import torch
            
            # Load base model
            base_model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path or "../ai-model/fine-tuned/tinyllama-nutritionist-lora"
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                base_model,
                torch_dtype=torch.float16,
                device_map="auto" if torch.cuda.is_available() else "cpu",
                low_cpu_mem_usage=True
            )
            
            # Load LoRA adapters
            if self.model_path:
                self.model = PeftModel.from_pretrained(self.model, self.model_path)
            
            self.model.eval()
            self._model_loaded = True
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def _generate_with_model(self, prompt: str, max_tokens: int = 500) -> str:
        """Generate text using the fine-tuned TinyLLaMA model."""
        import torch
        
        # Tokenize input
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        # Generate
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                do_sample=True,
                temperature=0.3,
                top_p=0.9,
                repetition_penalty=1.1,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode
        generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)
        
        # Extract just the generated part (after prompt)
        if prompt in generated_text:
            generated_text = generated_text[len(prompt):]
            
        return generated_text.strip()

    def _extract_json_from_response(self, response_text: str) -> Optional[Dict]:
        """Extract JSON from model response."""
        try:
            # Find JSON block
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                # Try array format
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
                
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parsing failed: {e}")
            
        return None

    async def generate_meal_plan(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main method to generate a meal plan.
        
        Args:
            request_data: Dictionary with user parameters:
                - goal: str (e.g., "Fat loss", "Muscle gain")
                - daily_calories: int
                - diet_type: str (e.g., "Vegan", "Keto")
                - macros: Dict with protein, carbs, fats percentages
        
        Returns:
            Dictionary with meal plan and metadata
        """
        # Extract parameters
        goal = request_data.get("goal", "General fitness")
        calories = request_data.get("daily_calories", 2000)
        diet_type = request_data.get("diet_type", "Balanced")
        macros = request_data.get("macros", {"protein": 30, "carbs": 40, "fats": 30})
        
        logger.info(f"Generating meal plan: {goal}, {calories} cal, {diet_type}")
        
        # Step 1: Get prompt template
        prompt = get_prompt_template(
            goal=goal,
            calories=calories,
            diet_type=diet_type,
            protein=macros.get("protein", 30),
            carbs=macros.get("carbs", 40),
            fats=macros.get("fats", 30)
        )
        
        # Step 2: Try AI generation
        ai_plan = None
        ai_error = None
        
        try:
            # Load model if not loaded
            if not self._model_loaded:
                await self.load_model()
            
            # Generate with model
            logger.info("Generating with fine-tuned TinyLLaMA...")
            response = await asyncio.to_thread(
                self._generate_with_model,
                prompt,
                max_tokens=600
            )
            
            # Extract JSON
            ai_plan = self._extract_json_from_response(response)
            
            if ai_plan:
                logger.info("AI generation successful")
            else:
                ai_error = "Failed to parse AI response as JSON"
                
        except Exception as e:
            ai_error = str(e)
            logger.error(f"AI generation failed: {ai_error}")
        
        # Step 3: Validate AI plan
        if ai_plan:
            is_valid, validation_msg = validate_meal_plan(
                ai_plan,
                target_calories=calories,
                diet_type=diet_type
            )
            
            if is_valid:
                # Evaluate quality
                evaluation = evaluate_meal_plan(ai_plan, target_calories=calories)
                
                return {
                    "success": True,
                    "meal_plan": ai_plan,
                    "source": "ai_model",
                    "evaluation": evaluation,
                    "calories": calories,
                    "macros": calculate_macros(ai_plan),
                    "grocery_list": self._extract_grocery_list(ai_plan)
                }
            else:
                ai_error = f"Validation failed: {validation_msg}"
        
        # Step 4: Fallback to rule-based plan
        logger.info(f"Using fallback plan due to: {ai_error}")
        fallback_plan = default_meal_plan(
            calories=calories,
            diet_type=diet_type,
            goal=goal
        )
        
        return {
            "success": True,
            "meal_plan": fallback_plan,
            "source": "rule_based_fallback",
            "evaluation": {"fallback_used": True, "reason": ai_error},
            "calories": calories,
            "macros": calculate_macros(fallback_plan),
            "grocery_list": self._extract_grocery_list(fallback_plan)
        }
    
    def _extract_grocery_list(self, meal_plan: Dict) -> Dict[str, float]:
        """Extract grocery list from meal plan."""
        groceries = {}
        
        try:
            # Extract all ingredients across all days and meals
            for day in meal_plan.get("days", []):
                for meal in day.get("meals", []):
                    for ingredient in meal.get("ingredients", []):
                        name = ingredient.get("name", "").lower()
                        quantity = ingredient.get("quantity", 0)
                        unit = ingredient.get("unit", "")
                        
                        if name:
                            key = f"{name} ({unit})" if unit else name
                            groceries[key] = groceries.get(key, 0) + quantity
            
        except Exception as e:
            logger.warning(f"Failed to extract grocery list: {e}")
        
        return groceries

# Singleton instance
generator = AINutritionistGenerator()