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
    is_verified: bool
    tfa_enabled: bool
    tfa_verified: bool
    profile_picture: Optional[str] = None  # Path to user's profile picture
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    status: str = "Active"
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


    model_config = {"from_attributes": True}

# --- Token schema ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ClientCreate(BaseModel):
 name: str
 age: int
 gender: str
 height_cm: float
 weight_kg: float


class ClientResponse(ClientCreate):
 id: int
 model_config = {"from_attributes": True}


class NutritionInputSchema(BaseModel):
 goal: str
 activity_level: str
 diet_type: str


    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    status: str
    is_active: bool = True


class GoogleLoginRequest(BaseModel):
    credential: str


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    status: Optional[str] = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
class MacroResponse(BaseModel):
 calories: float
 protein_g: float
 carbs_g: float
 fats_g: float
