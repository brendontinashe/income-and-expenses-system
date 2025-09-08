from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date, datetime
from backend.models import Income, IncomeCreate, IncomeUpdate, BaseResponse
from backend.database import income_table, categories_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

@router.get("/income", response_model=List[Income])
async def get_all_income(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None
):
    """
    Get all income records with optional filtering
    """
    all_income = get_all(income_table)
    
    # Apply filters
    filtered_income = all_income
    
    if start_date:
        filtered_income = [i for i in filtered_income if datetime.fromisoformat(i["date"]).date() >= start_date]
    
    if end_date:
        filtered_income = [i for i in filtered_income if datetime.fromisoformat(i["date"]).date() <= end_date]
    
    if category_id:
        filtered_income = [i for i in filtered_income if i["category_id"] == category_id]
    
    if min_amount:
        filtered_income = [i for i in filtered_income if i["amount"] >= min_amount]
    
    if max_amount:
        filtered_income = [i for i in filtered_income if i["amount"] <= max_amount]
    
    # Add category details to each income record
    for income in filtered_income:
        category = get_by_id(categories_table, income["category_id"])
        if category:
            income["category"] = category
    
    return filtered_income

@router.get("/income/{income_id}", response_model=Income)
async def get_income(income_id: int):
    """
    Get a specific income record by ID
    """
    income = get_by_id(income_table, income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    
    # Add category details
    category = get_by_id(categories_table, income["category_id"])
    if category:
        income["category"] = category
    
    return income

@router.post("/income", response_model=BaseResponse)
async def create_income(income: IncomeCreate):
    """
    Create a new income record
    """
    # Convert date to string for JSON storage
    income_dict = income.dict()
    income_dict["date"] = income.date.isoformat()
    
    # Check if category exists
    category = get_by_id(categories_table, income.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    income_id = create(income_table, income_dict)
    
    return {
        "success": True,
        "message": "Income record created successfully",
        "data": {"id": income_id}
    }

@router.put("/income/{income_id}", response_model=BaseResponse)
async def update_income(income_id: int, income_update: IncomeUpdate):
    """
    Update an existing income record
    """
    existing_income = get_by_id(income_table, income_id)
    if not existing_income:
        raise HTTPException(status_code=404, detail="Income record not found")
    
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in income_update.dict().items() if v is not None}
    
    # Convert date to string if present
    if "date" in update_data and update_data["date"]:
        update_data["date"] = update_data["date"].isoformat()
    
    # Check if category exists if category_id is being updated
    if "category_id" in update_data and update_data["category_id"]:
        category = get_by_id(categories_table, update_data["category_id"])
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Update the record
    update(income_table, income_id, update_data)
    
    return {
        "success": True,
        "message": "Income record updated successfully",
        "data": {"id": income_id}
    }

@router.delete("/income/{income_id}", response_model=BaseResponse)
async def delete_income(income_id: int):
    """
    Delete an income record
    """
    existing_income = get_by_id(income_table, income_id)
    if not existing_income:
        raise HTTPException(status_code=404, detail="Income record not found")
    
    delete(income_table, income_id)
    
    return {
        "success": True,
        "message": "Income record deleted successfully",
        "data": {"id": income_id}
    }

@router.get("/income/total", response_model=BaseResponse)
async def get_income_total(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None
):
    """
    Get the total income for a given period and optional category
    """
    all_income = get_all(income_table)
    
    # Apply filters
    filtered_income = all_income
    
    if start_date:
        filtered_income = [i for i in filtered_income if datetime.fromisoformat(i["date"]).date() >= start_date]
    
    if end_date:
        filtered_income = [i for i in filtered_income if datetime.fromisoformat(i["date"]).date() <= end_date]
    
    if category_id:
        filtered_income = [i for i in filtered_income if i["category_id"] == category_id]
    
    total = sum(i["amount"] for i in filtered_income)
    
    return {
        "success": True,
        "message": "Income total calculated successfully",
        "data": {"total": total}
    }
