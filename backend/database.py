from tinydb import TinyDB, Query
from tinydb.storages import JSONStorage
from tinydb.middlewares import CachingMiddleware
import os
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

# Ensure the data directory exists
os.makedirs("backend/data", exist_ok=True)

# Initialize the database
db = TinyDB("backend/data/finance_db.json", storage=CachingMiddleware(JSONStorage))

# Create tables for different data types
income_table = db.table("income")
expenses_table = db.table("expenses")
budgets_table = db.table("budgets")
categories_table = db.table("categories")
users_table = db.table("users")
settings_table = db.table("settings")

# Query instance
query = Query()

# Helper functions for common database operations
def get_all(table) -> List[Dict]:
    """Get all records from a table"""
    return table.all()

def get_by_id(table, id: int) -> Optional[Dict]:
    """Get a record by ID"""
    result = table.get(query.id == id)
    return result

def create(table, data: Dict) -> int:
    """Create a new record"""
    # Add timestamp and ID if not present
    if "created_at" not in data:
        data["created_at"] = datetime.now().isoformat()
    if "id" not in data:
        # Get the next ID
        all_ids = [item.get("id", 0) for item in table.all()]
        next_id = max(all_ids) + 1 if all_ids else 1
        data["id"] = next_id
    
    table.insert(data)
    return data["id"]

def update(table, id: int, data: Dict) -> bool:
    """Update a record by ID"""
    data["updated_at"] = datetime.now().isoformat()
    return table.update(data, query.id == id)

def delete(table, id: int) -> bool:
    """Delete a record by ID"""
    return table.remove(query.id == id)

def search(table, search_query: Dict) -> List[Dict]:
    """Search records based on query parameters"""
    # Build a complex query
    complex_query = None
    for key, value in search_query.items():
        if complex_query is None:
            complex_query = (query[key] == value)
        else:
            complex_query &= (query[key] == value)
    
    if complex_query is None:
        return table.all()
    
    return table.search(complex_query)

def clear_table(table) -> None:
    """Clear all records from a table"""
    table.truncate()

def clear_all_data() -> None:
    """Clear all data from all tables"""
    income_table.truncate()
    expenses_table.truncate()
    budgets_table.truncate()
    categories_table.truncate()
    # Don't clear users and settings
    # users_table.truncate()
    # settings_table.truncate()

# Initialize default categories if they don't exist
def init_default_categories():
    if not categories_table.all():
        default_income_categories = [
            {"id": 1, "name": "Salary", "type": "income", "color": "#4CAF50", "created_at": datetime.now().isoformat()},
            {"id": 2, "name": "Freelance", "type": "income", "color": "#2196F3", "created_at": datetime.now().isoformat()},
            {"id": 3, "name": "Investment", "type": "income", "color": "#9C27B0", "created_at": datetime.now().isoformat()},
            {"id": 4, "name": "Rental", "type": "income", "color": "#FF9800", "created_at": datetime.now().isoformat()},
            {"id": 5, "name": "Other", "type": "income", "color": "#607D8B", "created_at": datetime.now().isoformat()},
        ]
        
        default_expense_categories = [
            {"id": 6, "name": "Housing", "type": "expense", "color": "#F44336", "created_at": datetime.now().isoformat()},
            {"id": 7, "name": "Food", "type": "expense", "color": "#E91E63", "created_at": datetime.now().isoformat()},
            {"id": 8, "name": "Transportation", "type": "expense", "color": "#673AB7", "created_at": datetime.now().isoformat()},
            {"id": 9, "name": "Utilities", "type": "expense", "color": "#3F51B5", "created_at": datetime.now().isoformat()},
            {"id": 10, "name": "Entertainment", "type": "expense", "color": "#00BCD4", "created_at": datetime.now().isoformat()},
            {"id": 11, "name": "Healthcare", "type": "expense", "color": "#009688", "created_at": datetime.now().isoformat()},
            {"id": 12, "name": "Personal", "type": "expense", "color": "#8BC34A", "created_at": datetime.now().isoformat()},
            {"id": 13, "name": "Education", "type": "expense", "color": "#CDDC39", "created_at": datetime.now().isoformat()},
            {"id": 14, "name": "Other", "type": "expense", "color": "#795548", "created_at": datetime.now().isoformat()},
        ]
        
        for category in default_income_categories + default_expense_categories:
            categories_table.insert(category)

# Initialize default settings if they don't exist
def init_default_settings():
    if not settings_table.all():
        default_settings = {
            "id": 1,
            "company_name": "My Finance Tracker",
            "currency": "USD",
            "fiscal_year_start": "01-01",
            "theme": "light",
            "auto_backup": True,
            "created_at": datetime.now().isoformat()
        }
        settings_table.insert(default_settings)

# Initialize default data
init_default_categories()
init_default_settings()
