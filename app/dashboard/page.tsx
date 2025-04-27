"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  CreditCard,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"

// Mock chart components
const BarChart = () => (
  <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/30">
    <TrendingUp className="h-8 w-8 text-muted-foreground" />
  </div>
)

const LineChart = () => (
  <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/30">
    <TrendingUp className="h-8 w-8 text-muted-foreground" />
  </div>
)

const PieChart = () => (
  <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/30">
    <TrendingUp className="h-8 w-8 text-muted-foreground" />
  </div>
)

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data without showing toast
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock data for recent transactions
  const recentTransactions = [
    { type: "income", category: "Salary", amount: 5000, date: "2023-04-01" },
    { type: "expense", category: "Rent", amount: 1200, date: "2023-04-02" },
    { type: "expense", category: "Groceries", amount: 250, date: "2023-04-05" },
    { type: "income", category: "Freelance", amount: 800, date: "2023-04-10" },
    { type: "expense", category: "Utilities", amount: 180, date: "2023-04-15" },
  ]

  // Mock data for income categories
  const incomeCategories = [
    { name: "Salary", percentage: 80 },
    { name: "Freelance", percentage: 15 },
    { name: "Investments", percentage: 5 },
  ]

  // Mock data for expense categories
  const expenseCategories = [
    { name: "Housing", percentage: 40 },
    { name: "Food", percentage: 25 },
    { name: "Transportation", percentage: 15 },
    { name: "Utilities", percentage: 10 },
    { name: "Entertainment", percentage: 10 },
  ]

  // Skeleton loader for cards
  const CardSkeleton = () => (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3"></div>
      <div className="h-8 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-1/4"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/income/add">Add Income</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Link href="/expenses/add">Add Expense</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-300">Upcoming Payment</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          You have a rent payment of $1,200 due in 3 days.{" "}
          <Link
            href="/expenses/add"
            className="font-medium underline underline-offset-4 text-amber-800 dark:text-amber-300"
          >
            Record payment
          </Link>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stats-card income-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <CardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-500 flex items-center">
                        +20.1% <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="stats-card expense-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-red-600 dark:text-red-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <CardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">$12,234.59</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600 dark:text-red-500 flex items-center">
                        +4.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="stats-card balance-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <CardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">$32,997.30</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-500 flex items-center">
                        +10.2% <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="stats-card savings-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <Percent className="h-4 w-4 text-purple-600 dark:text-purple-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <CardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">73%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-500 flex items-center">
                        +5.2% <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 dashboard-card">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent income and expense transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                            <div className="h-3 w-16 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-16 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center">
                          <div
                            className={`mr-4 rounded-full p-2 ${
                              transaction.type === "income" ? "income-bg" : "expense-bg"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="h-4 w-4 income-text" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 expense-text" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{transaction.category}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === "income" ? "income-text" : "expense-text"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/reports">View all transactions</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3 dashboard-card">
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Your top income and expense categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-muted rounded"></div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2 animate-pulse">
                            <div className="flex justify-between">
                              <div className="h-3 w-24 bg-muted rounded"></div>
                              <div className="h-3 w-8 bg-muted rounded"></div>
                            </div>
                            <div className="h-2 w-full bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-muted rounded"></div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="space-y-2 animate-pulse">
                            <div className="flex justify-between">
                              <div className="h-3 w-24 bg-muted rounded"></div>
                              <div className="h-3 w-8 bg-muted rounded"></div>
                            </div>
                            <div className="h-2 w-full bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Income</h4>
                      {incomeCategories.map((category, i) => (
                        <div key={i} className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm">{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Expenses</h4>
                      {expenseCategories.map((category, i) => (
                        <div key={i} className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm">{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 dashboard-card">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Your income and expenses for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <Image
                    src="/placeholder.svg?height=300&width=600&text=Monthly+Overview+Chart"
                    alt="Monthly Overview Chart"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Breakdown of your finances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <Image
                    src="/placeholder.svg?height=300&width=300&text=Pie+Chart"
                    alt="Income vs Expenses Pie Chart"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 dashboard-card">
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>Track your financial growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <Image
                    src="/placeholder.svg?height=300&width=900&text=Financial+Trends+Chart"
                    alt="Financial Trends Chart"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Financial Calendar</CardTitle>
              <CardDescription>View your scheduled income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[500px] border rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <div className="text-center space-y-2">
                  <Calendar className="h-10 w-10 mx-auto text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-medium">Calendar View</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Track your upcoming income and expenses with our calendar view. Schedule recurring transactions and
                    never miss a payment.
                  </p>
                  <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700" asChild>
                    <Link href="/calendar">Open Calendar</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
