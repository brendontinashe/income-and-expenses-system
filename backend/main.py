from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import income, expenses, budgets, categories, users, settings, auth, dashboard

app = FastAPI(title="Finance Tracker API", description="Backend API for the Finance Tracker application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(income.router, prefix="/api", tags=["income"])
app.include_router(expenses.router, prefix="/api", tags=["expenses"])
app.include_router(budgets.router, prefix="/api", tags=["budgets"])
app.include_router(categories.router, prefix="/api", tags=["categories"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(settings.router, prefix="/api", tags=["settings"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Finance Tracker API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
