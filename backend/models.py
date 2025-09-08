from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from enum import Enum

# Base response model
class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

# User models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True

# Token models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Category models
class CategoryType(str, Enum):
    income = "income"
    expense = "expense"

class CategoryBase(BaseModel):
    name: str
    type: CategoryType
    color: str = "#000000"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True

# Transaction models
class RecurrenceType(str, Enum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    date: str
    description: Optional[str] = None
    category_id: int
    recurrence: RecurrenceType = RecurrenceType.none
    recurrence_end_date: Optional[str] = None

class IncomeCreate(TransactionBase):
    source: Optional[str] = None

class IncomeUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    source: Optional[str] = None
    recurrence: Optional[RecurrenceType] = None
    recurrence_end_date: Optional[str] = None

class Income(TransactionBase):
    id: int
    source: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    category: Optional[Category] = None

    class Config:
        orm_mode = True

class ExpenseCreate(TransactionBase):
    vendor: Optional[str] = None

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    vendor: Optional[str] = None
    recurrence: Optional[RecurrenceType] = None
    recurrence_end_date: Optional[str] = None

class Expense(TransactionBase):
    id: int
    vendor: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    category: Optional[Category] = None

    class Config:
        orm_mode = True

# Budget models
class BudgetBase(BaseModel):
    name: str
    amount: float = Field(..., gt=0)
    start_date: str
    end_date: str
    category_id: Optional[int] = None

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    category_id: Optional[int] = None

class Budget(BudgetBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None
    category: Optional[Category] = None

    class Config:
        orm_mode = True

class BudgetProgress(BaseModel):
    budget_id: int
    budget_amount: float
    spent_amount: float
    remaining_amount: float
    percentage: float

# Settings models
class SettingsBase(BaseModel):
    company_name: str
    currency: str
    fiscal_year_start: str
    theme: str
    auto_backup: bool

class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    currency: Optional[str] = None
    fiscal_year_start: Optional[str] = None
    theme: Optional[str] = None
    auto_backup: Optional[bool] = None

class Settings(SettingsBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True

# Report models
class DateRangeParams(BaseModel):
    start_date: str
    end_date: str
    group_by: Optional[str] = "day"

class ReportData(BaseModel):
    income_total: float
    expense_total: float
    net_total: float
    income_by_category: Dict[str, float]
    expenses_by_category: Dict[str, float]
    daily_totals: Dict[str, Dict[str, float]]

# Dashboard models
class DashboardData(BaseModel):
    income_total: float
    expense_total: float
    balance: float
    savings_rate: float
    recent_transactions: List[Dict[str, Any]]
    income_by_category: Dict[str, float]
    expenses_by_category: Dict[str, float]
    monthly_data: Dict[str, Dict[str, float]]
