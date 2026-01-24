from fastapi import FastAPI
from routers import auth, mealplan, pdf, clients

app = FastAPI(title="AI Nutritionist API", version="1.0.0")

# Include routers
app.include_router(auth.router)
app.include_router(mealplan.router)
app.include_router(clients.router)
app.include_router(pdf.router)