from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date, datetime
from backend.models import Budget, BudgetCreate, BudgetUpdate, BaseResponse
from backend.database import budgets_table, categories_table, expenses_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

@router.get("/budgets", response_model=List[Budget])
async def get_all_budgets(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None
):
    """
    Get all budget records with optional filtering
    """
    all_budgets = get_all(budgets_table)
    
    # Apply filters
    filtered_budgets = all_budgets
    
    if start_date:
        filtered_budgets = [b for b in filtered_budgets if datetime.fromisoformat(b["end_date"]).date() >= start_date]
    
    if end_date:
        filtered_budgets = [b for b in filtered_budgets if datetime.fromisoformat(b["start_date"]).date() <= end_date]
    
    if category_id:
        filtered_budgets = [b for b in filtered_budgets if b.get("category_id") == category_id]
    
    # Add category details to each budget record
    for budget in filtered_budgets:
        if budget.get("category_id"):
            category = get_by_id(categories_table, budget["category_id"])
            if category:
                budget["category"] = category
    
    return filtered_budgets

@router.get("/budgets/{budget_id}", response_model=Budget)
async def get_budget(budget_id: int):
    """
    Get a specific budget record by ID
    """
    budget = get_by_id(budgets_table, budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # Add category details
    if budget.get("category_id"):
        category = get_by_id(categories_table, budget["category_id"])
        if category:
            budget["category"] = category
    
    return budget

@router.post("/budgets", response_model=BaseResponse)
async def create_budget(budget: BudgetCreate):
    """
    Create a new budget
    """
    # Convert dates to string for JSON storage
    budget_dict = budget.dict()
    budget_dict["start_date"] = budget.start_date.isoformat()
    budget_dict["end_date"] = budget.end_date.isoformat()
    
    # Check if category exists if category_id is provided
    if budget.category_id:
        category = get_by_id(categories_table, budget.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    budget_id = create(budgets_table, budget_dict)
    
    return {
        "success": True,
        "message": "Budget created successfully",
        "data": {"id": budget_id}
    }

@router.put("/budgets/{budget_id}", response_model=BaseResponse)
async def update_budget(budget_id: int, budget_update: BudgetUpdate):
    """
    Update an existing budget
    """
    existing_budget = get_by_id(budgets_table, budget_id)
    if not existing_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in budget_update.dict().items() if v is not None}
    
    # Convert dates to string if present
    if "start_date" in update_data and update_data["start_date"]:
        update_data["start_date"] = update_data["start_date"].isoformat()
    
    if "end_date" in update_data and update_data["end_date"]:
        update_data["end_date"] = update_data["end_date"].isoformat()
    
    # Check if category exists if category_id is being updated
    if "category_id" in update_data and update_data["category_id"]:
        category = get_by_id(categories_table, update_data["category_id"])
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Update the record
    update(budgets_table, budget_id, update_data)
    
    return {
        "success": True,
        "message": "Budget updated successfully",
        "data": {"id": budget_id}
    }

@router.delete("/budgets/{budget_id}", response_model=BaseResponse)
async def delete_budget(budget_id: int):
    """
    Delete a budget
    """
    existing_budget = get_by_id(budgets_table, budget_id)
    if not existing_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    delete(budgets_table, budget_id)
    
    return {
        "success": True,
        "message": "Budget deleted successfully",
        "data": {"id": budget_id}
    }

@router.get("/budgets/{budget_id}/progress", response_model=BaseResponse)
async def get_budget_progress(budget_id: int):
    """
    Get the progress of a budget (how much has been spent vs. the budget amount)
    """
    budget = get_by_id(budgets_table, budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # Get all expenses for this budget's time period and category (if specified)
    all_expenses = get_all(expenses_table)
    
    # Filter expenses by date range
    start_date = datetime.fromisoformat(budget["start_date"]).date()
    end_date = datetime.fromisoformat(budget["end_date"]).date()
    
    filtered_expenses = [
        e for e in all_expenses 
        if datetime.fromisoformat(e["date"]).date() >= start_date 
        and datetime.fromisoformat(e["date"]).date() <= end_date
    ]
    
    # Further filter by category if the budget has a category
    if budget.get("category_id"):
        filtered_expenses = [e for e in filtered_expenses if e["category_id"] == budget["category_id"]]
    
    # Calculate total spent
    total_spent = sum(e["amount"] for e in filtered_expenses)
    
    # Calculate percentage
    percentage = (total_spent / budget["amount"]) * 100 if budget["amount"] > 0 else 0
    
    return {
        "success": True,
        "message": "Budget progress calculated successfully",
        "data": {
            "budget_id": budget_id,
            "budget_amount": budget["amount"],
            "spent_amount": total_spent,
            "remaining_amount": budget["amount"] - total_spent,
            "percentage": percentage
        }
    }
