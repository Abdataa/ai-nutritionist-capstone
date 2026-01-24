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


class MacroResponse(BaseModel):
 calories: float
 protein_g: float
 carbs_g: float
 fats_g: float
