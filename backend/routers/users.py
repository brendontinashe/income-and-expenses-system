from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from datetime import datetime, timedelta
import hashlib
import secrets
import jwt
from backend.models import User, UserCreate, UserUpdate, BaseResponse
from backend.database import users_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

# Simple JWT configuration
SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/token")

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
@router.post("/users/token")
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

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Get the current user's information
    """
    return current_user

@router.get("/users", response_model=List[User])
async def get_all_users(current_user: dict = Depends(get_current_user)):
    """
    Get all users (admin only)
    """
    # In a real app, check if current_user is an admin
    return get_all(users_table)

@router.post("/users", response_model=BaseResponse)
async def create_user(user: UserCreate):
    """
    Create a new user
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
    
    # Create the user
    user_id = create(users_table, user_dict)
    
    return {
        "success": True,
        "message": "User created successfully",
        "data": {"id": user_id}
    }

@router.put("/users/me", response_model=BaseResponse)
async def update_user_me(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    """
    Update the current user's information
    """
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    # Hash the password if it's being updated
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])
    
    # Check if username or email would conflict with existing users
    if "username" in update_data or "email" in update_data:
        username = update_data.get("username", current_user["username"])
        email = update_data.get("email", current_user["email"])
        
        existing_user = users_table.get(
            ((query.username == username) | (query.email == email)) & 
            (query.id != current_user["id"])
        )
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already registered"
            )
    
    # Update the user
    update(users_table, current_user["id"], update_data)
    
    return {
        "success": True,
        "message": "User updated successfully",
        "data": {"id": current_user["id"]}
    }

@router.delete("/users/me", response_model=BaseResponse)
async def delete_user_me(current_user: dict = Depends(get_current_user)):
    """
    Delete the current user
    """
    delete(users_table, current_user["id"])
    
    return {
        "success": True,
        "message": "User deleted successfully",
        "data": {"id": current_user["id"]}
    }
