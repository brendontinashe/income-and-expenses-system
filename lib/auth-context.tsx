"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: { username: string; email: string; password: string; full_name?: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const refreshUser = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      await api.login(username, password)
      await refreshUser()
      toast({
        title: "Login successful",
        description: "Welcome back to FinanceTrack!",
        type: "success",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        type: "error",
      })
      throw error
    }
  }

  const register = async (userData: { username: string; email: string; password: string; full_name?: string }) => {
    try {
      await api.register(userData)
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
        type: "success",
      })
      router.push("/login?registered=true")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
        type: "error",
      })
      throw error
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      type: "info",
    })
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
