"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Mock data for budgets
const budgets = [
  {
    id: 1,
    name: "Housing",
    amount: 1500,
    spent: 1200,
    period: "Monthly",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Food",
    amount: 600,
    spent: 450,
    period: "Monthly",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Transportation",
    amount: 300,
    spent: 280,
    period: "Monthly",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Entertainment",
    amount: 200,
    spent: 150,
    period: "Monthly",
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Utilities",
    amount: 250,
    spent: 220,
    period: "Monthly",
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Vacation",
    amount: 2000,
    spent: 500,
    period: "Yearly",
    color: "bg-indigo-500",
  },
]

export default function BudgetsPage() {
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [newBudgetName, setNewBudgetName] = useState("")
  const [newBudgetAmount, setNewBudgetAmount] = useState("")
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("monthly")
  const { toast } = useToast()

  const handleAddBudget = () => {
    if (!newBudgetName || !newBudgetAmount) return

    toast({
      title: "Budget created",
      description: `A new budget of $${newBudgetAmount} has been created for ${newBudgetName}.`,
      type: "success",
    })

    // Reset form
    setNewBudgetName("")
    setNewBudgetAmount("")
    setNewBudgetPeriod("monthly")
    setIsAddBudgetOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">Manage and track your spending limits</p>
        </div>
        <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>Set up a new budget to track your spending</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="budget-name">Budget Name</Label>
                <Input
                  id="budget-name"
                  placeholder="e.g., Groceries"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Amount</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  placeholder="0.00"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-period">Period</Label>
                <Select value={newBudgetPeriod} onValueChange={setNewBudgetPeriod}>
                  <SelectTrigger id="budget-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBudgetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBudget}>Create Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Budget Tip</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          You're close to your Transportation budget limit. Consider adjusting your spending or increasing your budget.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            All Budgets
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <Card
                key={budget.id}
                className="overflow-hidden border-t-4"
                style={{ borderTopColor: budget.color.replace("bg-", "") }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{budget.name}</CardTitle>
                      <CardDescription>{budget.period}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: ${budget.spent}</span>
                      <span>Budget: ${budget.amount}</span>
                    </div>
                    <Progress
                      value={(budget.spent / budget.amount) * 100}
                      className="h-2"
                      indicatorClassName={budget.color}
                    />
                    <div className="text-xs text-right text-muted-foreground">
                      ${budget.amount - budget.spent} remaining
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets
              .filter((budget) => budget.period === "Monthly")
              .map((budget) => (
                <Card
                  key={budget.id}
                  className="overflow-hidden border-t-4"
                  style={{ borderTopColor: budget.color.replace("bg-", "") }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{budget.name}</CardTitle>
                        <CardDescription>{budget.period}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.spent}</span>
                        <span>Budget: ${budget.amount}</span>
                      </div>
                      <Progress
                        value={(budget.spent / budget.amount) * 100}
                        className="h-2"
                        indicatorClassName={budget.color}
                      />
                      <div className="text-xs text-right text-muted-foreground">
                        ${budget.amount - budget.spent} remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets
              .filter((budget) => budget.period === "Yearly")
              .map((budget) => (
                <Card
                  key={budget.id}
                  className="overflow-hidden border-t-4"
                  style={{ borderTopColor: budget.color.replace("bg-", "") }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{budget.name}</CardTitle>
                        <CardDescription>{budget.period}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.spent}</span>
                        <span>Budget: ${budget.amount}</span>
                      </div>
                      <Progress
                        value={(budget.spent / budget.amount) * 100}
                        className="h-2"
                        indicatorClassName={budget.color}
                      />
                      <div className="text-xs text-right text-muted-foreground">
                        ${budget.amount - budget.spent} remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Visual breakdown of your budgets and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] w-full">
            <Image
              src="/placeholder.svg?height=400&width=800&text=Budget+Overview+Chart"
              alt="Budget Overview Chart"
              fill
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
