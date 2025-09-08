from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from datetime import datetime, timedelta
import hashlib
import secrets
import jwt
from pydantic import BaseModel
from backend.models import User, UserCreate, UserUpdate, BaseResponse, Token, TokenData
from backend.database import users_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

# Simple JWT configuration
SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Helper functions for authentication
def hash_password(password: str) -> str:
    """Hash a password for storing"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against a provided password"""
    return hash_password(plain_password) == hashed_password

def authenticate_user(username: str, password: str):
    """Authenticate a user"""
    user = users_table.get((query.username == username) | (query.email == username))
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from the JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = users_table.get((query.username == username) | (query.email == username))
    if user is None:
        raise credentials_exception
    return user

# API endpoints
@router.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Get an access token for authentication
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/register", response_model=BaseResponse)
async def register_user(user: UserCreate):
    """
    Register a new user
    """
    # Check if username or email already exists
    existing_user = users_table.get((query.username == user.username) | (query.email == user.email))
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    # Hash the password
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    user_dict["is_active"] = True
    
    # Create the user
    user_id = create(users_table, user_dict)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {"id": user_id}
    }

@router.get("/auth/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Get the current user's information
    """
    return current_user
