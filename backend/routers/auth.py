from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, List
import os
import re
import logging
import uuid
import secrets
import string
from pathlib import Path
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from slowapi import Limiter
from slowapi.util import get_remote_address

from database.database import get_db
from database.models import User
from database.schemas import UserCreate, UserResponse, UserLogin, UserStatusUpdate, GoogleLoginRequest, UserProfileUpdate, PasswordChangeRequest
from core.config import settings
from core.token_manager import TokenManager
from core.email_utils import EmailVerification
from core.audit_logger import log_user_login, log_failed_login, log_user_registration, log_security_event
from core.tfa_manager import TwoFactorAuth
from passlib.context import CryptContext

router = APIRouter()

# dependency to get DB session
def get_db():
    yield from db_module.get_db()

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # check if user exists
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Ensure password doesn't exceed bcrypt's 72-byte limit
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        truncated_password = password_bytes[:72].decode('utf-8', errors='ignore')
    else:
        truncated_password = password
    return pwd_context.hash(truncated_password)

def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if len(password.encode('utf-8')) > 72:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def check_account_lockout(user: User) -> bool:
    if user.locked_until and user.locked_until > datetime.utcnow():
        return True
    return False

def reset_failed_attempts(db: Session, user: User):
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.utcnow()
    db.commit()

def increment_failed_attempts(db: Session, user: User):
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= 5:
        user.locked_until = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if check_account_lockout(user):
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account is locked due to too many failed login attempts. Please try again later."
        )
    if not verify_password(password, user.password_hash):
        increment_failed_attempts(db, user)
        return False
    reset_failed_attempts(db, user)
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def require_role(required_role: str):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: {required_role} role required"
            )
        return current_user
    return role_checker

def is_user_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: admin role required"
        )
    return current_user

@router.post("/register", response_model=UserResponse)
@limiter.limit("10/hour")
def register_user(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    if not validate_email(user.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format")
    if not validate_password(user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password too weak or too long")
    
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    verification_token = EmailVerification.generate_verification_token()
    verification_expires = datetime.utcnow() + timedelta(hours=24)
    
    if user.role not in ["user", "coach"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    
    # Validate role
    if user.role not in ["user", "coach"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Valid roles: user, coach"
        )
    
    # Create new user
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,  # Use the provided role
        is_active=True,
        is_verified=False,
        email_verification_token=verification_token,
        email_verification_expires=verification_expires
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    try:
        EmailVerification.send_verification_email(db_user.email, verification_token)
    except Exception as e:
        logging.error(f"Failed to send verification email: {str(e)}")
    
    log_user_registration(db_user.id, request.client.host, request.headers.get("user-agent", "Unknown"))
    return db_user

@router.post("/login")
@limiter.limit("5/minute")
async def login_user(request: Request, db: Session = Depends(get_db)):
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            body = await request.json()
            email = body.get("email")
            password = body.get("password")
        else:
            form = await request.form()
            email = form.get("username")
            password = form.get("password")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request format")
    
    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")
    
    user = authenticate_user(db, email, password)
    if not user:
        log_failed_login(email, request.client.host, request.headers.get("user-agent", "Unknown"))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = TokenManager.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    refresh_token = TokenManager.create_refresh_token(data={"sub": user.email})
    
    user.refresh_token_hash = TokenManager.hash_token(refresh_token)
    user.refresh_token_expires = datetime.utcnow() + timedelta(days=7)
    db.commit()
    
    log_user_login(user.id, request.client.host, request.headers.get("user-agent", "Unknown"))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/google-login")
async def google_login(login_data: GoogleLoginRequest, request: Request, db: Session = Depends(get_db)):
    """Authenticate user using Google ID token"""
    try:
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            logging.warning("GOOGLE_CLIENT_ID not set, using insecure token decoding (DEVELOPMENT ONLY)")
            idinfo = jwt.get_unverified_claims(login_data.credential)
        else:
            idinfo = id_token.verify_oauth2_token(
                login_data.credential, 
                google_requests.Request(), 
                client_id
            )

        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])

        user = db.query(User).filter(User.email == email).first()
        if not user:
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
            user = User(
                name=name,
                email=email,
                password_hash=get_password_hash(random_password),
                role="user",
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            log_user_registration(user.id, request.client.host, request.headers.get("user-agent", "Unknown"))

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = TokenManager.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
        refresh_token = TokenManager.create_refresh_token(data={"sub": user.email})
        
        user.refresh_token_hash = TokenManager.hash_token(refresh_token)
        user.refresh_token_expires = datetime.utcnow() + timedelta(days=7)
        db.commit()

        log_user_login(user.id, request.client.host, request.headers.get("user-agent", "Unknown"))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    except Exception as e:
        logging.error(f"Google login error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Authentication failed: {str(e)}")

@router.post("/refresh")
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh the access token using a valid refresh token"""
    try:
        if not refresh_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token required")
        
        email, payload = TokenManager.verify_token(refresh_token, token_type="refresh")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        if user.refresh_token_expires and user.refresh_token_expires < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has expired")
        
        hashed_token = TokenManager.hash_token(refresh_token)
        if user.refresh_token_hash != hashed_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = TokenManager.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    except HTTPException:
        if 'user' in locals():
            user.refresh_token_hash = None
            user.refresh_token_expires = None
            db.commit()
        raise

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all users (for coaches to view their clients)"""
    if current_user.role not in ['coach', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return db.query(User).all()

@router.put("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(user_id: int, status_data: UserStatusUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update a client's status"""
    if current_user.role not in ['coach', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.status = status_data.status
    user.is_active = status_data.is_active
    db.commit()
    db.refresh(user)
    return user
@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all users (for coaches to view their clients)"""
    # Only allow coaches to access this endpoint
    if current_user.role not in ['coach', 'admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    # Get all users from database
    users = db.query(User).all()
    return users


# Schema for updating user profile
from pydantic import BaseModel

class UserProfileUpdate(BaseModel):
    name: str = None
    email: str = None
    phone: str = None
    company: str = None
    title: str = None
    location: str = None
    bio: str = None
    height: float = None
    weight: float = None
    age: int = None
    gender: str = None
    activity_level: str = None
    goal: str = None


@router.put("/profile", response_model=UserResponse)
def update_user_profile(profile_data: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user profile information"""
    update_data = profile_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(password_data: PasswordChangeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Change user password"""
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if not validate_password(password_data.new_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password too weak or too long")
    
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.post("/remove-profile-picture")
async def remove_profile_picture(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Remove user's profile picture"""
    if current_user.profile_picture:
        file_path = Path(current_user.profile_picture)
        if file_path.exists():
            try:
                os.remove(file_path)
            except Exception as e:
                logging.error(f"Error deleting profile picture: {str(e)}")
    
    current_user.profile_picture = None
    db.commit()
    return {"message": "Profile picture removed"}

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if not validate_password(password_data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with uppercase, lowercase, number, and special character, and not exceed 72 bytes"
        )
    
    # Hash and update password
    hashed_password = get_password_hash(password_data.new_password)
    current_user.password_hash = hashed_password
    db.commit()
    
    return {"message": "Password changed successfully"}


@router.post("/remove-profile-picture")
async def remove_profile_picture(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove user's profile picture"""
    # If user has a profile picture, delete the file
    if current_user.profile_picture:
        file_path = Path(current_user.profile_picture)
        if file_path.exists():
            try:
                os.remove(file_path)
            except Exception as e:
                logging.error(f"Error deleting profile picture file: {str(e)}")
    
    # Clear the profile picture field in database
    current_user.profile_picture = None
    db.commit()
    
    return {"message": "Profile picture removed successfully"}


@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Invalidate the refresh token on logout"""
    current_user.refresh_token_hash = None
    current_user.refresh_token_expires = None
    db.commit()
    return {"message": "Logged out successfully"}

@router.post("/verify-email")
async def verify_email(request: Request, db: Session = Depends(get_db)):
    """Verify user's email address"""
    try:
        body = await request.json()
        verification_code = body.get("verification_code")
    except Exception:
        form = await request.form()
        verification_code = form.get("verification_code")
    
    if not verification_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code required")
    
    user = db.query(User).filter(User.email_verification_token == verification_code).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code")
    if user.email_verification_expires and user.email_verification_expires < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code expired")
    
    user.is_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    db.commit()
    return {"message": "Email verified"}

@router.post("/resend-verification")
def resend_verification(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already verified")
    
    verification_token = EmailVerification.generate_verification_token()
    user.email_verification_token = verification_token
    user.email_verification_expires = datetime.utcnow() + timedelta(hours=24)
    db.commit()
    
    try:
        EmailVerification.send_verification_email(user.email, verification_token)
    except Exception as e:
        logging.error(f"Failed to resend verification: {str(e)}")
    return {"message": "Verification email sent"}

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        reset_token = EmailVerification.generate_password_reset_token()
        user.password_reset_token = reset_token
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=24)
        db.commit()
        try:
            EmailVerification.send_password_reset_email(user.email, reset_token)
        except Exception as e:
            logging.error(f"Failed to send reset email: {str(e)}")
    return {"message": "If an account exists, a reset link has been sent"}

@router.post("/reset-password")
def reset_password(reset_code: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.password_reset_token == reset_code).first()
    if not user or (user.password_reset_expires and user.password_reset_expires < datetime.utcnow()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset code")
    if not validate_password(new_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password too weak")
    
    user.password_hash = get_password_hash(new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    return {"message": "Password reset successfully"}

@router.post("/enable-tfa")
def enable_tfa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    qr_code = TwoFactorAuth.enable_tfa_for_user(current_user, db)
    return {"message": "TFA enabled", "qr_code": qr_code, "secret": current_user.tfa_secret}

@router.post("/verify-tfa-setup")
def verify_tfa_setup(token: str, current_user: User = Depends(get_current_user)):
    if not current_user.tfa_secret:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="TFA not enabled")
    if not TwoFactorAuth.verify_tfa_setup(current_user, token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid TFA token")
    return {"message": "TFA verified"}

@router.post("/disable-tfa")
def disable_tfa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    TwoFactorAuth.disable_tfa_for_user(current_user, db)
    return {"message": "TFA disabled"}

@router.post("/verify-tfa")
def verify_tfa_login(token: str, email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.tfa_enabled or not user.tfa_secret:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="TFA not active")
    if not TwoFactorAuth.verify_token(user.tfa_secret, token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    return {"message": "TFA verified", "user_id": user.id}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    allowed_extensions = {"jpg", "jpeg", "png", "gif", "pdf"}
    file_extension = Path(file.filename).suffix[1:].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type not allowed")
    
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")
    
    await file.seek(0)
    uploads_dir = Path("uploads") / f"user_{current_user.id}"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = uploads_dir / unique_filename
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    if file_extension in {"jpg", "jpeg", "png", "gif"}:
        current_user.profile_picture = str(file_path)
        db.commit()
    
    return {"filename": file.filename, "file_path": str(file_path), "message": "Uploaded"}

@router.get("/profile-picture")
def get_profile_picture(current_user: User = Depends(get_current_user)):
    if not current_user.profile_picture:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return {"profile_picture": current_user.profile_picture}

@router.get("/admin/users", response_model=List[UserResponse])
def admin_get_all_users(current_user: User = Depends(is_user_admin), db: Session = Depends(get_db)):
    return db.query(User).all()

@router.put("/admin/users/{user_id}/role")
def admin_update_user_role(user_id: int, role: str, current_user: User = Depends(is_user_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if role not in ["user", "coach", "admin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    user.role = role
    db.commit()
    return {"message": f"Updated to {role}"}
