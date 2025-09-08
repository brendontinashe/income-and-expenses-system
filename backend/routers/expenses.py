from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date, datetime
from backend.models import Expense, ExpenseCreate, ExpenseUpdate, BaseResponse
from backend.database import expenses_table, categories_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

@router.get("/expenses", response_model=List[Expense])
async def get_all_expenses(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None
):
    """
    Get all expense records with optional filtering
    """
    all_expenses = get_all(expenses_table)
    
    # Apply filters
    filtered_expenses = all_expenses
    
    if start_date:
        filtered_expenses = [e for e in filtered_expenses if datetime.fromisoformat(e["date"]).date() >= start_date]
    
    if end_date:
        filtered_expenses = [e for e in filtered_expenses if datetime.fromisoformat(e["date"]).date() <= end_date]
    
    if category_id:
        filtered_expenses = [e for e in filtered_expenses if e["category_id"] == category_id]
    
    if min_amount:
        filtered_expenses = [e for e in filtered_expenses if e["amount"] >= min_amount]
    
    if max_amount:
        filtered_expenses = [e for e in filtered_expenses if e["amount"] <= max_amount]
    
    # Add category details to each expense record
    for expense in filtered_expenses:
        category = get_by_id(categories_table, expense["category_id"])
        if category:
            expense["category"] = category
    
    return filtered_expenses

@router.get("/expenses/{expense_id}", response_model=Expense)
async def get_expense(expense_id: int):
    """
    Get a specific expense record by ID
    """
    expense = get_by_id(expenses_table, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")
    
    # Add category details
    category = get_by_id(categories_table, expense["category_id"])
    if category:
        expense["category"] = category
    
    return expense

@router.post("/expenses", response_model=BaseResponse)
async def create_expense(expense: ExpenseCreate):
    """
    Create a new expense record
    """
    # Convert date to string for JSON storage
    expense_dict = expense.dict()
    expense_dict["date"] = expense.date.isoformat()
    
    # Check if category exists
    category = get_by_id(categories_table, expense.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    expense_id = create(expenses_table, expense_dict)
    
    return {
        "success": True,
        "message": "Expense record created successfully",
        "data": {"id": expense_id}
    }

@router.put("/expenses/{expense_id}", response_model=BaseResponse)
async def update_expense(expense_id: int, expense_update: ExpenseUpdate):
    """
    Update an existing expense record
    """
    existing_expense = get_by_id(expenses_table, expense_id)
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense record not found")
    
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in expense_update.dict().items() if v is not None}
    
    # Convert date to string if present
    if "date" in update_data and update_data["date"]:
        update_data["date"] = update_data["date"].isoformat()
    
    # Check if category exists if category_id is being updated
    if "category_id" in update_data and update_data["category_id"]:
        category = get_by_id(categories_table, update_data["category_id"])
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Update the record
    update(expenses_table, expense_id, update_data)
    
    return {
        "success": True,
        "message": "Expense record updated successfully",
        "data": {"id": expense_id}
    }

@router.delete("/expenses/{expense_id}", response_model=BaseResponse)
async def delete_expense(expense_id: int):
    """
    Delete an expense record
    """
    existing_expense = get_by_id(expenses_table, expense_id)
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense record not found")
    
    delete(expenses_table, expense_id)
    
    return {
        "success": True,
        "message": "Expense record deleted successfully",
        "data": {"id": expense_id}
    }

@router.get("/expenses/total", response_model=BaseResponse)
async def get_expense_total(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None
):
    """
    Get the total expenses for a given period and optional category
    """
    all_expenses = get_all(expenses_table)
    
    # Apply filters
    filtered_expenses = all_expenses
    
    if start_date:
        filtered_expenses = [e for e in filtered_expenses if datetime.fromisoformat(e["date"]).date() >= start_date]
    
    if end_date:
        filtered_expenses = [e for e in filtered_expenses if datetime.fromisoformat(e["date"]).date() <= end_date]
    
    if category_id:
        filtered_expenses = [e for e in filtered_expenses if e["category_id"] == category_id]
    
    total = sum(e["amount"] for e in filtered_expenses)
    
    return {
        "success": True,
        "message": "Expense total calculated successfully",
        "data": {"total": total}
    }
