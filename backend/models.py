from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

# Enums
class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class RecurrenceType(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

# Base models
class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

# User models
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

# Category models
class CategoryBase(BaseModel):
    name: str
    type: TransactionType
    color: Optional[str] = "#808080"  # Default gray color

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

# Transaction models (base for income and expenses)
class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    date: date
    description: Optional[str] = None
    category_id: int
    recurrence: RecurrenceType = RecurrenceType.NONE
    recurrence_end_date: Optional[date] = None

class IncomeCreate(TransactionBase):
    source: Optional[str] = None

class IncomeUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    source: Optional[str] = None
    recurrence: Optional[RecurrenceType] = None
    recurrence_end_date: Optional[date] = None

class Income(TransactionBase):
    id: int
    source: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[Category] = None

class ExpenseCreate(TransactionBase):
    vendor: Optional[str] = None

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    vendor: Optional[str] = None
    recurrence: Optional[RecurrenceType] = None
    recurrence_end_date: Optional[date] = None

class Expense(TransactionBase):
    id: int
    vendor: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[Category] = None

# Budget models
class BudgetBase(BaseModel):
    name: str
    amount: float = Field(..., gt=0)
    start_date: date
    end_date: date
    category_id: Optional[int] = None

    @validator('end_date')
    def end_date_after_start_date(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category_id: Optional[int] = None

class Budget(BudgetBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[Category] = None

# Settings models
class SettingsBase(BaseModel):
    company_name: Optional[str] = "My Finance Tracker"
    currency: Optional[str] = "USD"
    fiscal_year_start: Optional[str] = "01-01"  # MM-DD format
    theme: Optional[str] = "light"
    auto_backup: Optional[bool] = True

class SettingsUpdate(SettingsBase):
    pass

class Settings(SettingsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

# Report models
class DateRange(BaseModel):
    start_date: date
    end_date: date

    @validator('end_date')
    def end_date_after_start_date(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class ReportData(BaseModel):
    income_total: float
    expense_total: float
    net_total: float
    income_by_category: Dict[str, float]
    expenses_by_category: Dict[str, float]
    daily_totals: Dict[str, Dict[str, float]]  # date -> {income, expense, net}
