"""
Configuration settings for the application.
Simplified version to avoid parsing issues.
"""

import os
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Simple settings class without Pydantic."""
    
    # API Configuration
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    PROJECT_NAME: str = "AI Nutritionist"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # CORS - Simple string parsing
    _cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
    BACKEND_CORS_ORIGINS: List[str] = []
    if _cors_origins:
        if _cors_origins.startswith("["):
            # JSON array
            import json
            BACKEND_CORS_ORIGINS = json.loads(_cors_origins)
        else:
            # Comma-separated string
            BACKEND_CORS_ORIGINS = [origin.strip() for origin in _cors_origins.split(",") if origin.strip()]
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ai_nutritionist.db")
    
    # AI Model
    MODEL_PATH: str = os.getenv("MODEL_PATH", "../ai-model/fine-tuned/tinyllama-nutritionist-lora")
    USE_AI_MODEL: bool = os.getenv("USE_AI_MODEL", "True").lower() == "true"
    
    # Other settings
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB


# Create settings instance
settings = Settings()