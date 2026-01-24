"""
Client management router.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_user
from database.database import get_db
from database.models import User, MealPlan

router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

@router.get("/")
async def get_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all clients for the current coach."""
    # Get unique client names from meal plans
    meal_plans = db.query(MealPlan)\
        .filter(MealPlan.user_id == current_user.id)\
        .all()
    
    clients = set()
    for plan in meal_plans:
        if plan.client_name and plan.client_name != "Client":
            clients.add(plan.client_name)
    
    return {
        "clients": list(clients),
        "count": len(clients)
    }