"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ToastProvider } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    role: "Financial Manager",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic would go here
  }

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96&text=JD" alt="@johndoe" />
                      <AvatarFallback className="text-2xl bg-indigo-600 text-white">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Connect your accounts for a better experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-sm text-muted-foreground">Connect your LinkedIn account</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-sm text-muted-foreground">Connect your Twitter account</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600 dark:text-green-400"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook</h4>
                      <p className="text-sm text-muted-foreground">Connect your Facebook account</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Authenticator App</h4>
                    <p className="text-sm text-muted-foreground">Use an authenticator app to generate one-time codes</p>
                  </div>
                  <Button variant="outline">Set up</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Text Message</h4>
                    <p className="text-sm text-muted-foreground">Receive a code via SMS</p>
                  </div>
                  <Button variant="outline">Set up</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-transactions"
                          className="rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="email-transactions">Transaction updates</label>
                      </div>
                      <span className="text-xs text-muted-foreground">Receive emails for all transactions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-budgets" className="rounded border-gray-300" defaultChecked />
                        <label htmlFor="email-budgets">Budget alerts</label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Get notified when you're close to budget limits
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-reports" className="rounded border-gray-300" defaultChecked />
                        <label htmlFor="email-reports">Weekly reports</label>
                      </div>
                      <span className="text-xs text-muted-foreground">Receive weekly financial summaries</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Push Notifications</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="push-transactions"
                          className="rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="push-transactions">Transaction updates</label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Receive push notifications for all transactions
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="push-budgets" className="rounded border-gray-300" defaultChecked />
                        <label htmlFor="push-budgets">Budget alerts</label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Get notified when you're close to budget limits
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 cursor-pointer bg-white hover:border-blue-500">
                      <div className="h-20 bg-white border-b mb-2"></div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer bg-gray-900 hover:border-blue-500">
                      <div className="h-20 bg-gray-900 border-b border-gray-700 mb-2"></div>
                      <p className="text-sm font-medium text-center text-white">Dark</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer bg-gradient-to-b from-white to-gray-900 hover:border-blue-500">
                      <div className="h-20 bg-gradient-to-b from-white to-gray-200 border-b mb-2"></div>
                      <p className="text-sm font-medium text-center">System</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Color Scheme</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="border rounded-lg p-2 cursor-pointer hover:border-blue-500">
                      <div className="h-10 bg-blue-600 rounded-md mb-2"></div>
                      <p className="text-xs font-medium text-center">Blue</p>
                    </div>
                    <div className="border rounded-lg p-2 cursor-pointer hover:border-purple-500">
                      <div className="h-10 bg-purple-600 rounded-md mb-2"></div>
                      <p className="text-xs font-medium text-center">Purple</p>
                    </div>
                    <div className="border rounded-lg p-2 cursor-pointer hover:border-green-500">
                      <div className="h-10 bg-green-600 rounded-md mb-2"></div>
                      <p className="text-xs font-medium text-center">Green</p>
                    </div>
                    <div className="border rounded-lg p-2 cursor-pointer hover:border-amber-500">
                      <div className="h-10 bg-amber-600 rounded-md mb-2"></div>
                      <p className="text-xs font-medium text-center">Amber</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToastProvider>
  )
}
