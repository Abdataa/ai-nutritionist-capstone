"""
Main FastAPI application - fixed to include all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
try:
    # Import routers
    from routers import auth, mealplan, pdf, clients
    
    # Include them with proper prefixes
    app.include_router(auth.router)
    app.include_router(mealplan.router)
    app.include_router(pdf.router)
    app.include_router(clients.router)
    
    logger.info("✅ All routers loaded successfully")
    
except ImportError as e:
    logger.error(f"❌ Failed to import routers: {e}")
    logger.info("Running in minimal mode without routers")

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