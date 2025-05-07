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
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

export default function DashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/dashboard?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!dashboardData || !dashboardData.monthly_data) return null

    // Convert the monthly data object to an array for the chart
    const chartData = Object.entries(dashboardData.monthly_data).map(([date, values]: [string, any]) => ({
      date,
      income: values.income,
      expense: values.expense,
      net: values.net,
    }))

    // Sort by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  }

  // Prepare pie chart data for income and expenses by category
  const preparePieChartData = (type: "income" | "expenses") => {
    if (!dashboardData) return []

    const data = type === "income" ? dashboardData.income_by_category : dashboardData.expenses_by_category

    return Object.entries(data || {}).map(([name, value]: [string, any]) => ({
      name,
      value,
    }))
  }

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

      {!isLoading &&
        dashboardData?.recent_transactions?.length > 0 &&
        dashboardData.recent_transactions.some(
          (t: any) => t.type === "expense" && t.description?.toLowerCase().includes("rent"),
        ) && (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Upcoming Payment</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              You have a rent payment due soon.{" "}
              <Link
                href="/expenses/add"
                className="font-medium underline underline-offset-4 text-amber-800 dark:text-amber-300"
              >
                Record payment
              </Link>
            </AlertDescription>
          </Alert>
        )}

      <div className="flex gap-4 mb-4">
        <Button variant={period === "month" ? "default" : "outline"} onClick={() => setPeriod("month")} size="sm">
          This Month
        </Button>
        <Button variant={period === "year" ? "default" : "outline"} onClick={() => setPeriod("year")} size="sm">
          This Year
        </Button>
      </div>

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
                    <div className="text-2xl font-bold">${dashboardData?.income_total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      {period === "month" ? "this month" : "this year"}
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
                    <div className="text-2xl font-bold">${dashboardData?.expense_total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600 dark:text-red-500 flex items-center">
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </span>{" "}
                      {period === "month" ? "this month" : "this year"}
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
                    <div className="text-2xl font-bold">${dashboardData?.balance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${dashboardData?.balance >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"} flex items-center`}
                      >
                        {dashboardData?.balance >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 ml-1" />
                        )}
                      </span>{" "}
                      net balance
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
                    <div className="text-2xl font-bold">{dashboardData?.savings_rate.toFixed(0)}%</div>
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${dashboardData?.savings_rate >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"} flex items-center`}
                      >
                        {dashboardData?.savings_rate >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 ml-1" />
                        )}
                      </span>{" "}
                      of income saved
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
                    {dashboardData?.recent_transactions?.length > 0 ? (
                      <>
                        {dashboardData.recent_transactions.map((transaction: any, i: number) => (
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
                                <p className="text-sm font-medium">{transaction.category_name}</p>
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
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No transactions found</p>
                        <div className="mt-4 flex gap-2 justify-center">
                          <Button asChild size="sm" variant="outline">
                            <Link href="/income/add">Add Income</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link href="/expenses/add">Add Expense</Link>
                          </Button>
                        </div>
                      </div>
                    )}
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
                      {Object.entries(dashboardData?.income_by_category || {}).length > 0 ? (
                        Object.entries(dashboardData?.income_by_category || {}).map(
                          ([category, amount]: [string, any], i) => (
                            <div key={i} className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{category}</span>
                                <span className="text-sm">${amount.toFixed(2)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ width: `${(amount / dashboardData?.income_total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">No income data available</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Expenses</h4>
                      {Object.entries(dashboardData?.expenses_by_category || {}).length > 0 ? (
                        Object.entries(dashboardData?.expenses_by_category || {}).map(
                          ([category, amount]: [string, any], i) => (
                            <div key={i} className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{category}</span>
                                <span className="text-sm">${amount.toFixed(2)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${(amount / dashboardData?.expense_total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">No expense data available</p>
                      )}
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
                <CardDescription>Your income and expenses for the period</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="chart-container">
                    <BarChart
                      data={prepareChartData() || []}
                      index="date"
                      categories={["income", "expense"]}
                      colors={["emerald", "red"]}
                      valueFormatter={(value) => `$${value.toFixed(2)}`}
                      yAxisWidth={60}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Breakdown of your finances</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="chart-container">
                    <PieChart
                      data={[
                        { name: "Income", value: dashboardData?.income_total || 0 },
                        { name: "Expenses", value: dashboardData?.expense_total || 0 },
                      ]}
                      index="name"
                      valueFormatter={(value) => `$${value.toFixed(2)}`}
                      category="value"
                      colors={["emerald", "red"]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3 dashboard-card">
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>Track your financial growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="chart-container">
                    <LineChart
                      data={prepareChartData() || []}
                      index="date"
                      categories={["net"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `$${value.toFixed(2)}`}
                      yAxisWidth={60}
                    />
                  </div>
                )}
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
