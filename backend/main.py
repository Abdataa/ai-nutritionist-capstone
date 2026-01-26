"""
Main FastAPI application - fixed order for imports, logging, DB init, app creation and router loading.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import sys
from pathlib import Path
from database.database import Base, engine
from database import models

Base.metadata.create_all(bind=engine)

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create DB tables after models are imported
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI Nutritionist API",
    description="Personalized Nutritional Recommendations for Fitness Coaches",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware (allow all for testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers

# Import and include routers with individual error handling
try:
    from routers import auth
    app.include_router(auth.router)
    logger.info(" Auth router loaded")
except ImportError as e:
    logger.error(f" Failed to import auth router: {e}")

try:
    from routers import mealplan
    app.include_router(mealplan.router)
    logger.info("MealPlan router loaded")
except ImportError as e:
    logger.error(f"Failed to import mealplan router: {e}")
    import traceback
    traceback.print_exc()

try:
    from routers import pdf
    app.include_router(pdf.router)
    logger.info(" PDF router loaded")
except ImportError as e:
    logger.warning(f"⚠️ PDF router not loaded: {e}")

try:
    from routers import clients
    app.include_router(clients.router)
    logger.info(" Clients router loaded")
except ImportError as e:
    logger.warning(f"⚠️ Clients router not loaded: {e}")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Nutritionist API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/v1/auth",
            "meal_plans": "/api/meal-plans",
            "clients": "/api/clients",
            "pdf": "/api/pdf"
        }
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-nutritionist-api"}

# Test endpoint
@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working!"}

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 AI Nutritionist API starting...")
    logger.info("✅ Server ready!")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )