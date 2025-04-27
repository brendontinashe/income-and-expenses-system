"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Printer } from "lucide-react"

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Mock data for reports
  const transactions = [
    { id: 1, date: "2023-04-01", type: "Income", category: "Salary", description: "April Salary", amount: 5000 },
    { id: 2, date: "2023-04-02", type: "Expense", category: "Housing", description: "Monthly Rent", amount: -1200 },
    { id: 3, date: "2023-04-05", type: "Expense", category: "Food", description: "Weekly Groceries", amount: -250 },
    { id: 4, date: "2023-04-10", type: "Income", category: "Freelance", description: "Client Project", amount: 800 },
    { id: 5, date: "2023-04-10", type: "Expense", category: "Transportation", description: "Gas", amount: -80 },
    { id: 6, date: "2023-04-15", type: "Expense", category: "Utilities", description: "Electric Bill", amount: -120 },
    { id: 7, date: "2023-04-15", type: "Income", category: "Investment", description: "Stock Dividends", amount: 350 },
    { id: 8, date: "2023-04-20", type: "Expense", category: "Entertainment", description: "Restaurant", amount: -75 },
    { id: 9, date: "2023-04-20", type: "Income", category: "Rental", description: "Apartment Rent", amount: 1200 },
    { id: 10, date: "2023-04-25", type: "Income", category: "Other", description: "Tax Refund", amount: 750 },
  ]

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netBalance = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select a date range to generate a custom report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2 flex-1">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button className="mb-2">Generate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction Report</CardTitle>
              <CardDescription>April 1, 2023 - April 30, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="font-bold">
                        Total Income
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">${totalIncome.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="font-bold">
                        Total Expenses
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-600">${totalExpenses.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="font-bold">
                        Net Balance
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${netBalance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary Report</CardTitle>
              <CardDescription>April 1, 2023 - April 30, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Total Income</h3>
                  <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Total Expenses</h3>
                  <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Net Balance</h3>
                  <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${netBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Monthly Trend</h3>
                <div className="h-[300px] border rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Monthly trend chart would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Report</CardTitle>
              <CardDescription>April 1, 2023 - April 30, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Income by Category</h3>
                  <div className="h-[300px] border rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Income pie chart would go here</p>
                  </div>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Salary</TableCell>
                          <TableCell className="text-right">$5,000.00</TableCell>
                          <TableCell className="text-right">61.7%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Rental</TableCell>
                          <TableCell className="text-right">$1,200.00</TableCell>
                          <TableCell className="text-right">14.8%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Freelance</TableCell>
                          <TableCell className="text-right">$800.00</TableCell>
                          <TableCell className="text-right">9.9%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Other</TableCell>
                          <TableCell className="text-right">$750.00</TableCell>
                          <TableCell className="text-right">9.3%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Investment</TableCell>
                          <TableCell className="text-right">$350.00</TableCell>
                          <TableCell className="text-right">4.3%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Expenses by Category</h3>
                  <div className="h-[300px] border rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Expenses pie chart would go here</p>
                  </div>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Housing</TableCell>
                          <TableCell className="text-right">$1,200.00</TableCell>
                          <TableCell className="text-right">69.6%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Food</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">14.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Utilities</TableCell>
                          <TableCell className="text-right">$120.00</TableCell>
                          <TableCell className="text-right">7.0%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transportation</TableCell>
                          <TableCell className="text-right">$80.00</TableCell>
                          <TableCell className="text-right">4.6%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Entertainment</TableCell>
                          <TableCell className="text-right">$75.00</TableCell>
                          <TableCell className="text-right">4.3%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>Access your previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      April 2023 Monthly Report
                    </div>
                  </TableCell>
                  <TableCell>Apr 01, 2023 - Apr 30, 2023</TableCell>
                  <TableCell>May 01, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Q1 2023 Quarterly Report
                    </div>
                  </TableCell>
                  <TableCell>Jan 01, 2023 - Mar 31, 2023</TableCell>
                  <TableCell>Apr 05, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      March 2023 Monthly Report
                    </div>
                  </TableCell>
                  <TableCell>Mar 01, 2023 - Mar 31, 2023</TableCell>
                  <TableCell>Apr 01, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
