import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Local storage utility functions
export const localStorageKeys = {
  INCOME: "finance-track-income",
  EXPENSES: "finance-track-expenses",
  BUDGETS: "finance-track-budgets",
  CATEGORIES: "finance-track-categories",
  USERS: "finance-track-users",
  SETTINGS: "finance-track-settings",
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
  }
}

export function clearAllLocalStorage(): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.clear()
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
