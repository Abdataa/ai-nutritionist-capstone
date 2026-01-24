"""
Security module for authentication and authorization.
Fixed version with all required functions.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
import secrets
import string
import os

# Get settings from environment or use defaults
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT"
)

# Token models
class Token(BaseModel):
    """Token response model."""
    access_token: str
    token_type: str
    expires_in: int
    user_id: int
    user_name: str


class TokenData(BaseModel):
    """Token payload data."""
    user_id: Optional[int] = None
    email: Optional[str] = None


# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password strength."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(char.islower() for char in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for char in password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is strong"


# Token utilities
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> tuple[str, datetime]:
    """Create a JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access_token"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> tuple[str, datetime]:
    """Create a JWT refresh token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh tokens
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh_token"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Database dependency (temporary - will be imported properly)
def get_db():
    """Get database session."""
    # This is a placeholder - you need to import the real get_db
    # from database.database import get_db
    # return get_db()
    raise NotImplementedError("You need to implement get_db or import it")


# Authentication dependencies
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)  # Note: get_db needs to be implemented
) -> Any:  # Returns User model instance
    """
    Get the current authenticated user from the JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode token
        payload = decode_token(token)
        
        # Extract user info
        user_id: Optional[int] = payload.get("user_id")
        email: Optional[str] = payload.get("email")
        
        if user_id is None or email is None:
            raise credentials_exception
        
        # Import User model here to avoid circular imports
        from database.models import User
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        
        if user is None:
            raise credentials_exception
        
        # Verify email matches
        if user.email != email:
            raise credentials_exception
        
        return user
        
    except JWTError:
        raise credentials_exception


async def get_current_active_user(
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Get the current active user.
    This can be extended to check for disabled users, etc.
    """
    # For now, just return the user
    # Add any active user checks here (e.g., is_active flag)
    # if not current_user.is_active:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    
    return current_user


# Password validator class
class PasswordValidator:
    """Class for comprehensive password validation."""
    
    @staticmethod
    def check_common_passwords(password: str) -> bool:
        """Check if password is in common passwords list."""
        common_passwords = {
            "password", "123456", "12345678", "123456789",
            "admin", "qwerty", "letmein", "welcome",
            "password123", "admin123", "qwerty123"
        }
        return password.lower() not in common_passwords
    
    @staticmethod
    def comprehensive_validate(password: str) -> tuple[bool, list[str]]:
        """
        Comprehensive password validation.
        
        Returns:
            tuple: (is_valid, list_of_errors)
        """
        errors = []
        
        # Basic checks
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one digit")
        
        if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for c in password):
            errors.append("Password must contain at least one special character")
        
        # Security checks
        if not PasswordValidator.check_common_passwords(password):
            errors.append("Password is too common")
        
        return len(errors) == 0, errors


# Rate limiter
class RateLimiter:
    """Simple rate limiter."""
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = {}
    
    def is_rate_limited(self, user_id: str) -> bool:
        """Check if user has exceeded rate limit."""
        import time
        
        current_time = time.time()
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Clean old requests
        self.requests[user_id] = [
            t for t in self.requests[user_id]
            if current_time - t < 60
        ]
        
        # Check limit
        if len(self.requests[user_id]) >= self.requests_per_minute:
            return True
        
        # Add current request
        self.requests[user_id].append(current_time)
        return False


# Create rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=5)