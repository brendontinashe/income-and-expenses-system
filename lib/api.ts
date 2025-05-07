// API client for interacting with the backend

// Base URL for API requests
const API_BASE_URL = "http://localhost:8000/api"

// Helper function for making API requests
async function fetchAPI<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add auth token if available
  const token = localStorage.getItem("auth_token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API request failed with status ${response.status}`)
    }

    // Parse JSON response
    return (await response.json()) as T
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Types
export interface BaseResponse<T = any> {
  success: boolean
  message: string
  data: T | null
}

export interface Category {
  id: number
  name: string
  type: "income" | "expense"
  color: string
  created_at: string
  updated_at?: string
}

export interface Income {
  id: number
  amount: number
  date: string
  description?: string
  category_id: number
  source?: string
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly"
  recurrence_end_date?: string
  created_at: string
  updated_at?: string
  category?: Category
}

export interface Expense {
  id: number
  amount: number
  date: string
  description?: string
  category_id: number
  vendor?: string
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly"
  recurrence_end_date?: string
  created_at: string
  updated_at?: string
  category?: Category
}

export interface Budget {
  id: number
  name: string
  amount: number
  start_date: string
  end_date: string
  category_id?: number
  created_at: string
  updated_at?: string
  category?: Category
}

export interface BudgetProgress {
  budget_id: number
  budget_amount: number
  spent_amount: number
  remaining_amount: number
  percentage: number
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Settings {
  id: number
  company_name: string
  currency: string
  fiscal_year_start: string
  theme: string
  auto_backup: boolean
  created_at: string
  updated_at?: string
}

export interface ReportData {
  income_total: number
  expense_total: number
  net_total: number
  income_by_category: Record<string, number>
  expenses_by_category: Record<string, number>
  daily_totals: Record<string, { income: number; expense: number; net: number }>
}

export interface DashboardData {
  income_total: number
  expense_total: number
  balance: number
  savings_rate: number
  income_by_category: Record<string, number>
  expenses_by_category: Record<string, number>
  monthly_data: Record<string, { income: number; expense: number; net: number }>
  recent_transactions: Array<{
    id: number
    type: "income" | "expense"
    amount: number
    date: string
    category_name: string
    description?: string
  }>
}

// API functions
export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Login failed with status ${response.status}`)
    }

    const data = await response.json()
    localStorage.setItem("auth_token", data.access_token)
    return data
  },

  async register(userData: {
    username: string
    email: string
    password: string
    full_name?: string
  }): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/auth/register", "POST", userData)
  },

  async logout(): Promise<void> {
    localStorage.removeItem("auth_token")
  },

  // User
  async getCurrentUser(): Promise<User> {
    return fetchAPI<User>("/users/me")
  },

  async updateUser(userData: {
    username?: string
    email?: string
    password?: string
    full_name?: string
  }): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/users/me", "PUT", userData)
  },

  // Dashboard
  async getDashboardData(period: "day" | "week" | "month" | "year" = "month"): Promise<DashboardData> {
    return fetchAPI<DashboardData>(`/dashboard?period=${period}`)
  },

  // Income
  async getIncomes(filters?: { start_date?: string; end_date?: string; category_id?: number }): Promise<Income[]> {
    let endpoint = "/income"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.start_date) params.append("start_date", filters.start_date)
      if (filters.end_date) params.append("end_date", filters.end_date)
      if (filters.category_id) params.append("category_id", filters.category_id.toString())

      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    return fetchAPI<Income[]>(endpoint)
  },

  async getIncome(id: number): Promise<Income> {
    return fetchAPI<Income>(`/income/${id}`)
  },

  async createIncome(incomeData: Omit<Income, "id" | "created_at" | "updated_at" | "category">): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/income", "POST", incomeData)
  },

  async updateIncome(
    id: number,
    incomeData: Partial<Omit<Income, "id" | "created_at" | "updated_at" | "category">>,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/income/${id}`, "PUT", incomeData)
  },

  async deleteIncome(id: number): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/income/${id}`, "DELETE")
  },

  // Expenses
  async getExpenses(filters?: { start_date?: string; end_date?: string; category_id?: number }): Promise<Expense[]> {
    let endpoint = "/expenses"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.start_date) params.append("start_date", filters.start_date)
      if (filters.end_date) params.append("end_date", filters.end_date)
      if (filters.category_id) params.append("category_id", filters.category_id.toString())

      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    return fetchAPI<Expense[]>(endpoint)
  },

  async getExpense(id: number): Promise<Expense> {
    return fetchAPI<Expense>(`/expenses/${id}`)
  },

  async createExpense(
    expenseData: Omit<Expense, "id" | "created_at" | "updated_at" | "category">,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/expenses", "POST", expenseData)
  },

  async updateExpense(
    id: number,
    expenseData: Partial<Omit<Expense, "id" | "created_at" | "updated_at" | "category">>,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/expenses/${id}`, "PUT", expenseData)
  },

  async deleteExpense(id: number): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/expenses/${id}`, "DELETE")
  },

  // Categories
  async getCategories(type?: "income" | "expense"): Promise<Category[]> {
    let endpoint = "/categories"
    if (type) {
      endpoint += `?type=${type}`
    }
    return fetchAPI<Category[]>(endpoint)
  },

  async getCategory(id: number): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`)
  },

  async createCategory(categoryData: Omit<Category, "id" | "created_at" | "updated_at">): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/categories", "POST", categoryData)
  },

  async updateCategory(
    id: number,
    categoryData: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/categories/${id}`, "PUT", categoryData)
  },

  async deleteCategory(id: number): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/categories/${id}`, "DELETE")
  },

  // Budgets
  async getBudgets(filters?: { start_date?: string; end_date?: string; category_id?: number }): Promise<Budget[]> {
    let endpoint = "/budgets"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.start_date) params.append("start_date", filters.start_date)
      if (filters.end_date) params.append("end_date", filters.end_date)
      if (filters.category_id) params.append("category_id", filters.category_id.toString())

      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    return fetchAPI<Budget[]>(endpoint)
  },

  async getBudget(id: number): Promise<Budget> {
    return fetchAPI<Budget>(`/budgets/${id}`)
  },

  async createBudget(budgetData: Omit<Budget, "id" | "created_at" | "updated_at" | "category">): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/budgets", "POST", budgetData)
  },

  async updateBudget(
    id: number,
    budgetData: Partial<Omit<Budget, "id" | "created_at" | "updated_at" | "category">>,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/budgets/${id}`, "PUT", budgetData)
  },

  async deleteBudget(id: number): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>(`/budgets/${id}`, "DELETE")
  },

  async getBudgetProgress(id: number): Promise<BaseResponse<BudgetProgress>> {
    return fetchAPI<BaseResponse<BudgetProgress>>(`/budgets/${id}/progress`)
  },

  // Settings
  async getSettings(): Promise<Settings> {
    return fetchAPI<Settings>("/settings")
  },

  async updateSettings(
    settingsData: Partial<Omit<Settings, "id" | "created_at" | "updated_at">>,
  ): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/settings", "PUT", settingsData)
  },

  async clearAllData(): Promise<BaseResponse> {
    return fetchAPI<BaseResponse>("/settings/clear-data", "POST")
  },

  // Reports
  async getSummaryReport(dateRange: { start_date: string; end_date: string }): Promise<ReportData> {
    return fetchAPI<ReportData>("/reports/summary", "POST", dateRange)
  },

  async getCashFlowReport(params: {
    start_date: string
    end_date: string
    group_by?: "day" | "week" | "month"
  }): Promise<BaseResponse<Record<string, { income: number; expenses: number; net: number }>>> {
    let endpoint = "/reports/cash-flow"
    const queryParams = new URLSearchParams()
    queryParams.append("start_date", params.start_date)
    queryParams.append("end_date", params.end_date)
    if (params.group_by) queryParams.append("group_by", params.group_by)

    endpoint += `?${queryParams.toString()}`

    return fetchAPI<BaseResponse<Record<string, { income: number; expenses: number; net: number }>>>(endpoint)
  },
}

export default api
