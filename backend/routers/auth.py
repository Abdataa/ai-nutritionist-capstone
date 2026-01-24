"""
Authentication router for user registration, login, and token management.
"""

from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging
from schemas.user import UserCreate, UserResponse, UserLogin

from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,            # Add this
    get_current_active_user,
    decode_token,
    generate_password,
    PasswordValidator,
    Token,
    rate_limiter
)
from core.config import settings
from database.database import get_db
from database.models import User
from schemas.user import UserCreate, UserResponse, UserLogin

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["authentication"]
)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user (fitness coach).
    
    - **name**: Full name of the user
    - **email**: Email address (must be unique)
    - **password**: Strong password (min 8 chars, with uppercase, lowercase, digit, special)
    
    Returns the created user without password.
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Validate password strength
        is_valid, errors = PasswordValidator.comprehensive_validate(user_data.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password validation failed",
                headers={"X-Password-Errors": "; ".join(errors)}
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user registered: {new_user.email}")
        
        return {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "created_at": new_user.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login user and return access token.
    
    - **username**: Email address
    - **password**: Password
    
    Returns JWT access and refresh tokens.
    """
    # Rate limiting check
    if rate_limiter.is_rate_limited(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )
    
    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    token_data = {
        "user_id": user.id,
        "email": user.email,
        "name": user.name
    }
    
    access_token, expires_at = create_access_token(token_data)
    refresh_token, _ = create_refresh_token(token_data)
    
    logger.info(f"User logged in: {user.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # seconds
        "user_id": user.id,
        "user_name": user.name
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token.
    
    - **refresh_token**: Valid refresh token
    
    Returns new access token.
    """
    try:
        # Decode refresh token
        payload = decode_token(refresh_token)
        
        if payload.get("type") != "refresh_token":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Get user from database
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new access token
        token_data = {
            "user_id": user.id,
            "email": user.email,
            "name": user.name
        }
        
        access_token, expires_at = create_access_token(token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user_id": user.id,
            "user_name": user.name
        }
        
    except JWTError:  # noqa: F821
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.post("/forgot-password")
async def forgot_password(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Request password reset (sends reset email in production).
    
    - **email**: User's email address
    
    Returns success message (in production, would send email).
    """
    # Find user
    user = db.query(User).filter(User.email == email).first()
    
    # Always return success (for security, don't reveal if user exists)
    if not user:
        # Still return success to prevent email enumeration
        logger.warning(f"Password reset requested for non-existent email: {email}")
        return {
            "message": "If the email exists, a password reset link has been sent."
        }
    
    # In production, send email with reset link
    # For now, generate a reset token (would be sent via email)
    reset_data = {
        "user_id": user.id,
        "email": user.email,
        "purpose": "password_reset"
    }
    
    reset_token, _ = create_access_token(
        reset_data,
        expires_delta=timedelta(hours=1)  # Short-lived reset token
    )
    
    logger.info(f"Password reset token generated for user: {user.email}")
    
    # In a real application, you would send an email here
    # For demo purposes, we'll log it
    logger.info(f"Reset token for {user.email}: {reset_token}")
    
    return {
        "message": "If the email exists, a password reset link has been sent.",
        "demo_reset_token": reset_token  # Remove in production!
    }


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """
    Reset password using reset token.
    
    - **token**: Password reset token
    - **new_password**: New password
    
    Returns success message.
    """
    try:
        # Decode reset token
        payload = decode_token(token)
        
        if payload.get("purpose") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        # Validate new password
        is_valid, errors = PasswordValidator.comprehensive_validate(new_password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password validation failed",
                headers={"X-Password-Errors": "; ".join(errors)}
            )
        
        # Get user
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update password
        user.password_hash = get_password_hash(new_password)
        db.commit()
        
        logger.info(f"Password reset for user: {user.email}")
        
        return {
            "message": "Password has been reset successfully"
        }
        
    except JWTError:  # noqa: F821
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)  # noqa: F821
):
    """
    Get current user information.
    
    Returns the authenticated user's details.
    """
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }


@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user),  # noqa: F821
    db: Session = Depends(get_db)
):
    """
    Change password for authenticated user.
    
    - **current_password**: Current password
    - **new_password**: New password
    
    Returns success message.
    """
    # Verify current password
    if not verify_password(current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    is_valid, errors = PasswordValidator.comprehensive_validate(new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password validation failed",
            headers={"X-Password-Errors": "; ".join(errors)}
        )
    
    # Check if new password is same as current
    if current_password == new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    current_user.password_hash = get_password_hash(new_password)
    db.commit()
    
    logger.info(f"Password changed for user: {current_user.email}")
    
    return {
        "message": "Password changed successfully"
    }