from fastapi import FastAPI
from database import database as db
from routers import auth
from routers import clients, nutrition, macros

app = FastAPI(title="AI-Nutritionist Backend - Week1")

# include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
def on_startup():
    # Create DB tables
    db.Base.metadata.create_all(bind=db.engine)

@app.get("/")
def root():
    return {"message": "AI-Nutritionist backend (Week 1) is running"}

app.include_router(clients.router, tags=["clients"])
app.include_router(nutrition.router, tags=["nutrition"])
app.include_router(macros.router, tags=["macros"])