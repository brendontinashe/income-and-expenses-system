"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Plus, Trash2, PencilIcon, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import api, { type Income, type Category } from "@/lib/api"

export default function IncomePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Income>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterCategory, setFilterCategory] = useState<number | "all">("all")
  const [dateRange, setDateRange] = useState<{
    start: Date | null
    end: Date | null
  }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch categories first
        const categoriesData = await api.getCategories("income")
        setCategories(categoriesData)

        // Fetch incomes with filters
        const filters: any = {}
        if (dateRange.start) filters.start_date = dateRange.start.toISOString().split("T")[0]
        if (dateRange.end) filters.end_date = dateRange.end.toISOString().split("T")[0]
        if (filterCategory !== "all") filters.category_id = filterCategory

        const incomesData = await api.getIncomes(filters)
        setIncomes(incomesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load income data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast, dateRange, filterCategory])

  const handleAddIncome = () => {
    router.push("/income/add")
  }

  const handleEditIncome = (id: number) => {
    router.push(`/income/edit/${id}`)
  }

  const handleDeleteIncome = async (id: number) => {
    if (!confirm("Are you sure you want to delete this income record?")) return

    try {
      await api.deleteIncome(id)
      setIncomes(incomes.filter((income) => income.id !== id))
      toast({
        title: "Success",
        description: "Income record deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting income:", error)
      toast({
        title: "Error",
        description: "Failed to delete income record. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSort = (field: keyof Income) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedIncomes = [...incomes].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return 0
    }
  })

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Income</h2>
          <p className="text-muted-foreground">Manage your income records</p>
        </div>
        <Button onClick={handleAddIncome} className="flex items-center gap-2">
          <Plus size={16} />
          Add Income
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>
            Total income for the selected period:{" "}
            <span className="font-semibold text-green-600">${totalIncome.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.start && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? format(dateRange.start, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.start || undefined}
                      onSelect={(date) => setDateRange({ ...dateRange, start: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.end && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.end ? format(dateRange.end, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.end || undefined}
                      onSelect={(date) => setDateRange({ ...dateRange, end: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="w-full md:w-1/3 space-y-2">
              <Label>Category</Label>
              <Select
                value={filterCategory.toString()}
                onValueChange={(value) => setFilterCategory(value === "all" ? "all" : Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sortedIncomes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No income records found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                        Date
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">
                      <button className="flex items-center gap-1" onClick={() => handleSort("amount")}>
                        Amount
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedIncomes.map((income) => (
                    <tr key={income.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{format(new Date(income.date), "MMM d, yyyy")}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: income.category?.color || "#808080" }}
                          ></div>
                          {income.category?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="py-3 px-4">{income.description || "-"}</td>
                      <td className="py-3 px-4 font-medium text-green-600">${income.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditIncome(income.id)}>
                            <PencilIcon size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteIncome(income.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
