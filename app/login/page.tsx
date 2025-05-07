"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check if user just registered
  const justRegistered = searchParams.get("registered") === "true"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/api/auth/token", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Login failed with status ${response.status}`)
      }

      const data = await response.json()

      // Store the token
      localStorage.setItem("auth_token", data.access_token)

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remember_user", username)
      } else {
        localStorage.removeItem("remember_user")
      }

      // Redirect to dashboard on success
      toast({
        title: "Login successful",
        description: "Welcome back to FinanceTrack!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Invalid username or password. Please try again.")
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for remembered user
  useState(() => {
    const rememberedUser = localStorage.getItem("remember_user")
    if (rememberedUser) {
      setUsername(rememberedUser)
      setRememberMe(true)
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <DollarSign className="h-5 w-5" />
          <span>FinanceTrack</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {justRegistered && (
                <Alert>
                  <AlertDescription className="text-emerald-600">
                    Registration successful! Please log in with your credentials.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} FinanceTrack. All rights reserved.
      </footer>
    </div>
  )
}
