"""
API router for meal plan generation endpoints.
Handles requests for creating, retrieving, and managing meal plans.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
import json
import logging
from datetime import datetime
import uuid

# Import dependencies
from core.security import get_current_user
from database.database import get_db
from database.models import User
from database.models import MealPlan as MealPlanModel
from schemas.mealplan import (
    MealPlanRequest,
    MealPlanResponse,
    MealPlanCreate,
    MealPlanUpdate,
    MealPlanListResponse
)
from ai.generator import generator
from ai.utils import calculate_macros, extract_grocery_list

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/meal-plans",
    tags=["meal-plans"],
    responses={
        401: {"description": "Unauthorized"},
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)


@router.post("/generate", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_meal_plan(
    request: MealPlanRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Generate a personalized meal plan using AI.
    
    - **goal**: Fitness goal (fat_loss, muscle_gain, maintenance, endurance)
    - **daily_calories**: Target daily calories (800-4000)
    - **diet_type**: Dietary preference (vegan, vegetarian, keto, paleo, etc.)
    - **macros**: Macronutrient distribution in percentages
    - **client_name**: Optional name for the client
    - **notes**: Additional notes or restrictions
    
    Returns a complete 7-day meal plan with nutritional analysis.
    """
    
    try:
        logger.info(f"Generating meal plan for user {current_user.id}")
        
        # Convert Pydantic model to dict for generator
        request_data = {
            "goal": request.goal,
            "daily_calories": request.daily_calories,
            "diet_type": request.diet_type,
            "macros": request.macros.dict() if request.macros else {"protein": 30, "carbs": 40, "fats": 30},
            "client_name": request.client_name,
            "notes": request.notes
        }
        
        # Validate input ranges
        if request.daily_calories < 800 or request.daily_calories > 4000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Calories must be between 800 and 4000"
            )
        
        # Check macro percentages sum to 100
        if request.macros:
            total = request.macros.protein + request.macros.carbs + request.macros.fats
            if abs(total - 100) > 1:  # Allow 1% tolerance
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Macronutrient percentages must sum to 100% (got {total}%)"
                )
        
        # Call AI generator
        logger.info("Calling AI generator...")
        result = await generator.generate_meal_plan(request_data)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate meal plan"
            )
        
        # Create meal plan record in database
        
        meal_plan_record = MealPlanModel(
                user_id=current_user.id,
                client_name=request.client_name or "Client",  # ← NEW
                goal=request.goal,
                diet_type=request.diet_type,
                daily_calories=request.daily_calories,  # ← Your field name
                macros=request.macros.dict() if request.macros else {"protein": 30, "carbs": 40, "fats": 30},
                generated_plan=result["meal_plan"],  # ← NEW
                grocery_list=result.get("grocery_list", {}),  # ← NEW
                source=result["source"],  # ← NEW
                notes=request.notes  # ← NEW
                         )
        
        
        db.add(meal_plan_record)
        db.commit()
        db.refresh(meal_plan_record)
        
        logger.info(f"Meal plan {meal_plan_record.id} created successfully")
        
        # Prepare response
        return {
            "id": meal_plan_record.id,
            "client_name": meal_plan_record.client_name,
            "goal": meal_plan_record.goal,
            "target_calories": meal_plan_record.target_calories,
            "diet_type": meal_plan_record.diet_type,
            "macros": json.loads(meal_plan_record.macros) if meal_plan_record.macros else {},
            "meal_plan": json.loads(meal_plan_record.generated_plan),
            "nutritional_info": json.loads(meal_plan_record.nutritional_info),
            "grocery_list": json.loads(meal_plan_record.grocery_list),
            "source": meal_plan_record.source,
            "evaluation": json.loads(meal_plan_record.evaluation),
            "notes": meal_plan_record.notes,
            "created_at": meal_plan_record.created_at,
            "message": "Meal plan generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating meal plan: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/", response_model=MealPlanListResponse)
async def list_meal_plans(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    List all meal plans for the current user.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    
    Returns paginated list of meal plans.
    """
    try:
        # Query meal plans for current user
        meal_plans = db.query(MealPlanModel)\
            .filter(MealPlanModel.user_id == current_user.id)\
            .order_by(MealPlanModel.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        # Count total
        total = db.query(MealPlanModel)\
            .filter(MealPlanModel.user_id == current_user.id)\
            .count()
        
        # Format response
        formatted_plans = []
        for plan in meal_plans:
            formatted_plans.append({
                "id": plan.id,
                "client_name": plan.client_name,
                "goal": plan.goal,
                "target_calories": plan.target_calories,
                "diet_type": plan.diet_type,
                "created_at": plan.created_at,
                "source": plan.source
            })
        
        return {
            "meal_plans": formatted_plans,
            "total": total,
            "skip": skip,
            "limit": limit,
            "has_more": (skip + len(formatted_plans)) < total
        }
        
    except Exception as e:
        logger.error(f"Error listing meal plans: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve meal plans"
        )


@router.get("/{plan_id}", response_model=MealPlanResponse)
async def get_meal_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get a specific meal plan by ID.
    
    - **plan_id**: UUID of the meal plan
    
    Returns complete meal plan details.
    """
    try:
        meal_plan = db.query(MealPlanModel)\
            .filter(
                MealPlanModel.id == plan_id,
                MealPlanModel.user_id == current_user.id
            )\
            .first()
        
        if not meal_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal plan not found"
            )
        
        return {
            "id": meal_plan.id,
            "client_name": meal_plan.client_name,
            "goal": meal_plan.goal,
            "target_calories": meal_plan.target_calories,
            "diet_type": meal_plan.diet_type,
            "macros": json.loads(meal_plan.macros) if meal_plan.macros else {},
            "meal_plan": json.loads(meal_plan.generated_plan),
            "nutritional_info": json.loads(meal_plan.nutritional_info),
            "grocery_list": json.loads(meal_plan.grocery_list),
            "source": meal_plan.source,
            "evaluation": json.loads(meal_plan.evaluation),
            "notes": meal_plan.notes,
            "created_at": meal_plan.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving meal plan {plan_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve meal plan"
        )


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Delete a meal plan.
    
    - **plan_id**: UUID of the meal plan to delete
    """
    try:
        meal_plan = db.query(MealPlanModel)\
            .filter(
                MealPlanModel.id == plan_id,
                MealPlanModel.user_id == current_user.id
            )\
            .first()
        
        if not meal_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal plan not found"
            )
        
        db.delete(meal_plan)
        db.commit()
        
        logger.info(f"Meal plan {plan_id} deleted by user {current_user.id}")
        
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting meal plan {plan_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete meal plan"
        )


@router.post("/{plan_id}/duplicate", response_model=MealPlanResponse)
async def duplicate_meal_plan(
    plan_id: str,
    new_client_name: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Duplicate an existing meal plan with a new ID.
    Useful for creating variations for different clients.
    
    - **plan_id**: UUID of the meal plan to duplicate
    - **new_client_name**: Optional new client name
    """
    try:
        # Get original plan
        original = db.query(MealPlanModel)\
            .filter(
                MealPlanModel.id == plan_id,
                MealPlanModel.user_id == current_user.id
            )\
            .first()
        
        if not original:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Original meal plan not found"
            )
        
        # Create duplicate
        duplicate = MealPlanModel(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            client_name=new_client_name or f"{original.client_name} (Copy)",
            goal=original.goal,
            target_calories=original.target_calories,
            diet_type=original.diet_type,
            macros=original.macros,
            generated_plan=original.generated_plan,
            source=f"Duplicate of {original.id}",
            nutritional_info=original.nutritional_info,
            grocery_list=original.grocery_list,
            evaluation=original.evaluation,
            notes=f"Duplicated from {original.client_name}",
            created_at=datetime.utcnow()
        )
        
        db.add(duplicate)
        db.commit()
        db.refresh(duplicate)
        
        logger.info(f"Duplicated meal plan {plan_id} to {duplicate.id}")
        
        return {
            "id": duplicate.id,
            "client_name": duplicate.client_name,
            "goal": duplicate.goal,
            "target_calories": duplicate.target_calories,
            "diet_type": duplicate.diet_type,
            "macros": json.loads(duplicate.macros) if duplicate.macros else {},
            "meal_plan": json.loads(duplicate.generated_plan),
            "nutritional_info": json.loads(duplicate.nutritional_info),
            "grocery_list": json.loads(duplicate.grocery_list),
            "source": duplicate.source,
            "evaluation": json.loads(duplicate.evaluation),
            "notes": duplicate.notes,
            "created_at": duplicate.created_at,
            "message": "Meal plan duplicated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error duplicating meal plan {plan_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to duplicate meal plan"
        )


@router.get("/{plan_id}/export/pdf")
async def export_meal_plan_pdf(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Export a meal plan as PDF.
    
    - **plan_id**: UUID of the meal plan to export
    
    Returns a PDF file for download.
    """
    try:
        meal_plan = db.query(MealPlanModel)\
            .filter(
                MealPlanModel.id == plan_id,
                MealPlanModel.user_id == current_user.id
            )\
            .first()
        
        if not meal_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal plan not found"
            )
        
        # Generate PDF filename
        filename = f"meal_plan_{meal_plan.client_name.replace(' ', '_')}_{plan_id[:8]}.pdf"
        filepath = f"/tmp/{filename}"  # Temporary storage
        
        # Import PDF generator
        from ai.pdf_generator import create_meal_plan_pdf
        
        # Create PDF
        create_meal_plan_pdf(
            plan_data={
                "client_name": meal_plan.client_name,
                "goal": meal_plan.goal,
                "target_calories": meal_plan.target_calories,
                "diet_type": meal_plan.diet_type,
                "meal_plan": json.loads(meal_plan.generated_plan),
                "grocery_list": json.loads(meal_plan.grocery_list),
                "created_at": meal_plan.created_at.strftime("%Y-%m-%d")
            },
            output_path=filepath
        )
        
        logger.info(f"PDF exported for meal plan {plan_id}")
        
        # Return file as download
        return FileResponse(
            path=filepath,
            filename=filename,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except HTTPException:
        raise
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="PDF export feature not configured"
        )
    except Exception as e:
        logger.error(f"Error exporting PDF for meal plan {plan_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export PDF: {str(e)}"
        )