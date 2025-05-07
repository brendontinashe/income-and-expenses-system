from fastapi import APIRouter, HTTPException
from typing import Optional, Dict
from datetime import date, datetime, timedelta
from collections import defaultdict
from backend.models import DateRange, ReportData, BaseResponse
from backend.database import income_table, expenses_table, categories_table, get_all, get_by_id

router = APIRouter()

@router.post("/reports/summary", response_model=ReportData)
async def get_summary_report(date_range: DateRange):
    """
    Get a summary report for the specified date range
    """
    start_date = date_range.start_date
    end_date = date_range.end_date
    
    # Get all income and expenses
    all_income = get_all(income_table)
    all_expenses = get_all(expenses_table)
    all_categories = {cat["id"]: cat for cat in get_all(categories_table)}
    
    # Filter by date range
    filtered_income = [
        i for i in all_income 
        if datetime.fromisoformat(i["date"]).date() >= start_date 
        and datetime.fromisoformat(i["date"]).date() <= end_date
    ]
    
    filtered_expenses = [
        e for e in all_expenses 
        if datetime.fromisoformat(e["date"]).date() >= start_date 
        and datetime.fromisoformat(e["date"]).date() <= end_date
    ]
    
    # Calculate totals
    income_total = sum(i["amount"] for i in filtered_income)
    expense_total = sum(e["amount"] for e in filtered_expenses)
    net_total = income_total - expense_total
    
    # Group by category
    income_by_category = defaultdict(float)
    for income in filtered_income:
        category_id = income["category_id"]
        category_name = all_categories.get(category_id, {}).get("name", "Unknown")
        income_by_category[category_name] += income["amount"]
    
    expenses_by_category = defaultdict(float)
    for expense in filtered_expenses:
        category_id = expense["category_id"]
        category_name = all_categories.get(category_id, {}).get("name", "Unknown")
        expenses_by_category[category_name] += expense["amount"]
    
    # Group by day
    daily_totals = {}
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.isoformat()
        
        # Income for this day
        day_income = sum(
            i["amount"] for i in filtered_income 
            if datetime.fromisoformat(i["date"]).date() == current_date
        )
        
        # Expenses for this day
        day_expenses = sum(
            e["amount"] for e in filtered_expenses 
            if datetime.fromisoformat(e["date"]).date() == current_date
        )
        
        daily_totals[date_str] = {
            "income": day_income,
            "expense": day_expenses,
            "net": day_income - day_expenses
        }
        
        current_date += timedelta(days=1)
    
    return {
        "income_total": income_total,
        "expense_total": expense_total,
        "net_total": net_total,
        "income_by_category": dict(income_by_category),
        "expenses_by_category": dict(expenses_by_category),
        "daily_totals": daily_totals
    }

@router.get("/reports/cash-flow", response_model=BaseResponse)
async def get_cash_flow_report(
    start_date: date,
    end_date: date,
    group_by: str = "day"  # day, week, month
):
    """
    Get a cash flow report grouped by day, week, or month
    """
    # Get all income and expenses
    all_income = get_all(income_table)
    all_expenses = get_all(expenses_table)
    
    # Filter by date range
    filtered_income = [
        i for i in all_income 
        if datetime.fromisoformat(i["date"]).date() >= start_date 
        and datetime.fromisoformat(i["date"]).date() <= end_date
    ]
    
    filtered_expenses = [
        e for e in all_expenses 
        if datetime.fromisoformat(e["date"]).date() >= start_date 
        and datetime.fromisoformat(e["date"]).date() <= end_date
    ]
    
    # Group data based on the specified interval
    grouped_data = {}
    
    if group_by == "day":
        # Group by day
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.isoformat()
            
            # Income for this day
            day_income = sum(
                i["amount"] for i in filtered_income 
                if datetime.fromisoformat(i["date"]).date() == current_date
            )
            
            # Expenses for this day
            day_expenses = sum(
                e["amount"] for e in filtered_expenses 
                if datetime.fromisoformat(e["date"]).date() == current_date
            )
            
            grouped_data[date_str] = {
                "income": day_income,
                "expenses": day_expenses,
                "net": day_income - day_expenses
            }
            
            current_date += timedelta(days=1)
    
    elif group_by == "week":
        # Group by week
        week_data = defaultdict(lambda: {"income": 0, "expenses": 0})
        
        for income in filtered_income:
            income_date = datetime.fromisoformat(income["date"]).date()
            week_num = income_date.isocalendar()[1]
            year = income_date.year
            week_key = f"{year}-W{week_num:02d}"
            week_data[week_key]["income"] += income["amount"]
        
        for expense in filtered_expenses:
            expense_date = datetime.fromisoformat(expense["date"]).date()
            week_num = expense_date.isocalendar()[1]
            year = expense_date.year
            week_key = f"{year}-W{week_num:02d}"
            week_data[week_key]["expenses"] += expense["amount"]
        
        # Calculate net for each week
        for week_key, data in week_data.items():
            data["net"] = data["income"] - data["expenses"]
            grouped_data[week_key] = data
    
    elif group_by == "month":
        # Group by month
        month_data = defaultdict(lambda: {"income": 0, "expenses": 0})
        
        for income in filtered_income:
            income_date = datetime.fromisoformat(income["date"]).date()
            month_key = f"{income_date.year}-{income_date.month:02d}"
            month_data[month_key]["income"] += income["amount"]
        
        for expense in filtered_expenses:
            expense_date = datetime.fromisoformat(expense["date"]).date()
            month_key = f"{expense_date.year}-{expense_date.month:02d}"
            month_data[month_key]["expenses"] += expense["amount"]
        
        # Calculate net for each month
        for month_key, data in month_data.items():
            data["net"] = data["income"] - data["expenses"]
            grouped_data[month_key] = data
    
    return {
        "success": True,
        "message": f"Cash flow report grouped by {group_by}",
        "data": grouped_data
    }
