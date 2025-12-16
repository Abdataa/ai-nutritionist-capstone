from pydantic import BaseModel, EmailStr, Field

# --- User schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}

# --- Token schema ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
