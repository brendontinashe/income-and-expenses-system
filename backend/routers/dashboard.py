from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import calendar
from backend.models import DashboardData, BaseResponse
from backend.database import (
    income_table, expenses_table, categories_table, 
    get_all, get_by_id, search, query
)
from backend.routers.auth import get_current_user

router = APIRouter()

def get_month_date_range():
    """Get the date range for the current month"""
    today = datetime.now()
    first_day = today.replace(day=1)
    last_day = today.replace(day=calendar.monthrange(today.year, today.month)[1])
    return first_day.strftime("%Y-%m-%d"), last_day.strftime("%Y-%m-%d")

def get_year_date_range():
    """Get the date range for the current year"""
    today = datetime.now()
    first_day = today.replace(month=1, day=1)
    last_day = today.replace(month=12, day=31)
    return first_day.strftime("%Y-%m-%d"), last_day.strftime("%Y-%m-%d")

def get_category_name(category_id):
    """Get category name by ID"""
    category = get_by_id(categories_table, category_id)
    return category["name"] if category else "Unknown"

@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard_data(
    current_user: dict = Depends(get_current_user),
    period: str = Query("month", description="Period for dashboard data: month, year, or custom"),
    start_date: Optional[str] = Query(None, description="Start date for custom period (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date for custom period (YYYY-MM-DD)")
):
    """
    Get dashboard data including income, expenses, and statistics
    """
    # Determine date range
    if period == "custom" and start_date and end_date:
        date_from, date_to = start_date, end_date
    elif period == "year":
        date_from, date_to = get_year_date_range()
    else:  # Default to month
        date_from, date_to = get_month_date_range()
    
    # Get income data
    income_data = search(income_table, {})
    income_in_period = [
        inc for inc in income_data 
        if date_from <= inc["date"] <= date_to
    ]
    
    # Get expense data
    expense_data = search(expenses_table, {})
    expenses_in_period = [
        exp for exp in expense_data 
        if date_from <= exp["date"] <= date_to
    ]
    
    # Calculate totals
    income_total = sum(inc["amount"] for inc in income_in_period)
    expense_total = sum(exp["amount"] for exp in expenses_in_period)
    balance = income_total - expense_total
    
    # Calculate savings rate
    savings_rate = (balance / income_total * 100) if income_total > 0 else 0
    
    # Get recent transactions (combined and sorted)
    all_transactions = []
    for inc in income_in_period:
        all_transactions.append({
            "id": inc["id"],
            "type": "income",
            "amount": inc["amount"],
            "date": inc["date"],
            "description": inc.get("description", ""),
            "category_id": inc["category_id"],
            "category_name": get_category_name(inc["category_id"])
        })
    
    for exp in expenses_in_period:
        all_transactions.append({
            "id": exp["id"],
            "type": "expense",
            "amount": exp["amount"],
            "date": exp["date"],
            "description": exp.get("description", ""),
            "category_id": exp["category_id"],
            "category_name": get_category_name(exp["category_id"])
        })
    
    # Sort by date (newest first) and limit to 5
    recent_transactions = sorted(
        all_transactions, 
        key=lambda x: x["date"], 
        reverse=True
    )[:5]
    
    # Calculate income by category
    income_by_category = {}
    for inc in income_in_period:
        category_name = get_category_name(inc["category_id"])
        if category_name in income_by_category:
            income_by_category[category_name] += inc["amount"]
        else:
            income_by_category[category_name] = inc["amount"]
    
    # Calculate expenses by category
    expenses_by_category = {}
    for exp in expenses_in_period:
        category_name = get_category_name(exp["category_id"])
        if category_name in expenses_by_category:
            expenses_by_category[category_name] += exp["amount"]
        else:
            expenses_by_category[category_name] = exp["amount"]
    
    # Generate monthly data for charts
    monthly_data = {}
    
    # Parse start and end dates
    start_date_obj = datetime.strptime(date_from, "%Y-%m-%d")
    end_date_obj = datetime.strptime(date_to, "%Y-%m-%d")
    
    # Create a dictionary with all dates in the range
    current_date = start_date_obj
    while current_date <= end_date_obj:
        date_str = current_date.strftime("%Y-%m-%d")
        monthly_data[date_str] = {
            "income": 0,
            "expense": 0,
            "net": 0
        }
        current_date += timedelta(days=1)
    
    # Fill in income data
    for inc in income_in_period:
        date = inc["date"]
        if date in monthly_data:
            monthly_data[date]["income"] += inc["amount"]
            monthly_data[date]["net"] += inc["amount"]
    
    # Fill in expense data
    for exp in expenses_in_period:
        date = exp["date"]
        if date in monthly_data:
            monthly_data[date]["expense"] += exp["amount"]
            monthly_data[date]["net"] -= exp["amount"]
    
    return {
        "income_total": income_total,
        "expense_total": expense_total,
        "balance": balance,
        "savings_rate": savings_rate,
        "recent_transactions": recent_transactions,
        "income_by_category": income_by_category,
        "expenses_by_category": expenses_by_category,
        "monthly_data": monthly_data
    }
