from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database import models, schemas
from core.security import get_current_user


router = APIRouter()


@router.post("/nutrition/{client_id}")
def submit_nutrition(
 client_id: int,
 data: schemas.NutritionInputSchema,
 db: Session = Depends(get_db),
 user=Depends(get_current_user)
 ):
 nutrition = models.NutritionInput(client_id=client_id, **data.dict())
 db.add(nutrition)
 db.commit()
 db.refresh(nutrition)
 return nutrition