from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
from backend.models import Settings, SettingsUpdate, BaseResponse
from backend.database import settings_table, get_all, get_by_id, create, update, delete, clear_all_data

router = APIRouter()

@router.get("/settings", response_model=Settings)
async def get_settings():
    """
    Get the application settings
    """
    # There should only be one settings record
    all_settings = get_all(settings_table)
    if not all_settings:
        # Create default settings if none exist
        default_settings = {
            "id": 1,
            "company_name": "My Finance Tracker",
            "currency": "USD",
            "fiscal_year_start": "01-01",
            "theme": "light",
            "auto_backup": True,
            "created_at": datetime.now().isoformat()
        }
        create(settings_table, default_settings)
        return default_settings
    
    return all_settings[0]

@router.put("/settings", response_model=BaseResponse)
async def update_settings(settings_update: SettingsUpdate):
    """
    Update the application settings
    """
    # Get the current settings
    all_settings = get_all(settings_table)
    if not all_settings:
        # Create default settings if none exist
        settings_id = 1
        default_settings = {
            "id": settings_id,
            "company_name": "My Finance Tracker",
            "currency": "USD",
            "fiscal_year_start": "01-01",
            "theme": "light",
            "auto_backup": True,
            "created_at": datetime.now().isoformat()
        }
        create(settings_table, default_settings)
    else:
        settings_id = all_settings[0]["id"]
    
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    
    # Update the settings
    update(settings_table, settings_id, update_data)
    
    return {
        "success": True,
        "message": "Settings updated successfully",
        "data": {"id": settings_id}
    }

@router.post("/settings/clear-data", response_model=BaseResponse)
async def clear_data():
    """
    Clear all data from the system (except users and settings)
    """
    clear_all_data()
    
    return {
        "success": True,
        "message": "All data has been cleared successfully",
        "data": None
    }
