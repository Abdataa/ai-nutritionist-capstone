from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database import models, schemas
from core.security import get_current_user


router = APIRouter()


@router.post("/clients", response_model=schemas.ClientResponse)
def create_client(
 data: schemas.ClientCreate,
 db: Session = Depends(get_db),
 user=Depends(get_current_user)
 ):
 client = models.ClientProfile(coach_id=user["sub"], **data.dict())
 db.add(client)
 db.commit()
 db.refresh(client)
 return client

@router.get("/clients/{client_id}", response_model=schemas.ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
 client = db.query(models.ClientProfile).filter_by(id=client_id, coach_id=user["sub"]).first()
 if not client:
  raise HTTPException(404)
 return client


@router.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
 client = db.query(models.ClientProfile).filter_by(id=client_id, coach_id=user["sub"]).first()
 if not client:
  raise HTTPException(404)
 db.delete(client)
 db.commit()
 return {"detail": "Client deleted"}