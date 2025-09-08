"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)

  const clearAllData = () => {
    setIsClearing(true)

    // Simulate clearing data with a timeout
    setTimeout(() => {
      // Clear all localStorage data
      localStorage.clear()

      // Reset any other client-side state here

      setIsClearing(false)
      toast({
        title: "System data cleared",
        description: "All data has been successfully cleared from the system.",
        variant: "default",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and system preferences.</p>
      </div>
      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <Switch id="marketing-emails" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <Switch id="security-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Customize your system experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view">Compact View</Label>
              <Switch id="compact-view" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto Save</Label>
              <Switch id="auto-save" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader className="text-destructive">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={18} />
              Danger Zone
            </CardTitle>
            <CardDescription>Actions here can't be undone. Please proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clearing all data will remove all income records, expenses, budgets, categories, and user preferences from
              the system. This action cannot be reversed.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all data from the system including income records, expenses,
                    budgets, categories, and user preferences. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllData}
                    disabled={isClearing}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isClearing ? "Clearing..." : "Yes, clear all data"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
