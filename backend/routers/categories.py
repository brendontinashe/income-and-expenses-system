from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from backend.models import Category, CategoryCreate, CategoryUpdate, BaseResponse, TransactionType
from backend.database import categories_table, get_all, get_by_id, create, update, delete, search, query

router = APIRouter()

@router.get("/categories", response_model=List[Category])
async def get_all_categories(
    type: Optional[TransactionType] = None
):
    """
    Get all categories with optional filtering by type
    """
    all_categories = get_all(categories_table)
    
    # Apply filters
    if type:
        all_categories = [c for c in all_categories if c["type"] == type]
    
    return all_categories

@router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: int):
    """
    Get a specific category by ID
    """
    category = get_by_id(categories_table, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category

@router.post("/categories", response_model=BaseResponse)
async def create_category(category: CategoryCreate):
    """
    Create a new category
    """
    # Check if a category with the same name and type already exists
    existing = categories_table.search((query.name == category.name) & (query.type == category.type))
    if existing:
        raise HTTPException(status_code=400, detail="A category with this name and type already exists")
    
    category_dict = category.dict()
    category_id = create(categories_table, category_dict)
    
    return {
        "success": True,
        "message": "Category created successfully",
        "data": {"id": category_id}
    }

@router.put("/categories/{category_id}", response_model=BaseResponse)
async def update_category(category_id: int, category_update: CategoryUpdate):
    """
    Update an existing category
    """
    existing_category = get_by_id(categories_table, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Convert model to dict and remove None values
    update_data = {k: v for k, v in category_update.dict().items() if v is not None}
    
    # Check if the updated name would conflict with an existing category
    if "name" in update_data:
        existing = categories_table.search(
            (query.name == update_data["name"]) & 
            (query.type == existing_category["type"]) & 
            (query.id != category_id)
        )
        if existing:
            raise HTTPException(status_code=400, detail="A category with this name and type already exists")
    
    # Update the record
    update(categories_table, category_id, update_data)
    
    return {
        "success": True,
        "message": "Category updated successfully",
        "data": {"id": category_id}
    }

@router.delete("/categories/{category_id}", response_model=BaseResponse)
async def delete_category(category_id: int):
    """
    Delete a category
    """
    existing_category = get_by_id(categories_table, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if this is the last category of its type
    same_type_categories = categories_table.search(query.type == existing_category["type"])
    if len(same_type_categories) <= 1:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete the last {existing_category['type']} category"
        )
    
    delete(categories_table, category_id)
    
    return {
        "success": True,
        "message": "Category deleted successfully",
        "data": {"id": category_id}
    }
