"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DollarSign, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // This would be replaced with actual API call
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      setError("Failed to send reset link. Please try again.")
      console.error("Password reset failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="flex items-center mb-2">
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">Back to login</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          {isSubmitted ? (
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to <span className="font-medium">{email}</span>
                  </p>
                </div>
                <Button asChild className="mt-4">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>

      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} FinanceTrack. All rights reserved.
      </footer>
    </div>
  )
}
