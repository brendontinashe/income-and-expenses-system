"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Plus, ArrowUpRight, ArrowDownRight, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

// Mock data for financial events
const financialEvents = [
  { id: 1, title: "Salary", amount: 5000, type: "income", date: new Date(2023, 3, 1) },
  { id: 2, title: "Rent", amount: 1200, type: "expense", date: new Date(2023, 3, 2) },
  { id: 3, title: "Utilities", amount: 180, type: "expense", date: new Date(2023, 3, 15) },
  { id: 4, title: "Freelance Payment", amount: 800, type: "income", date: new Date(2023, 3, 10) },
  { id: 5, title: "Groceries", amount: 250, type: "expense", date: new Date(2023, 3, 5) },
  { id: 6, title: "Car Insurance", amount: 120, type: "expense", date: new Date(2023, 3, 20) },
  { id: 7, title: "Investment Dividend", amount: 350, type: "income", date: new Date(2023, 3, 15) },
  { id: 8, title: "Phone Bill", amount: 75, type: "expense", date: new Date(2023, 3, 18) },
  { id: 9, title: "Rental Income", amount: 1200, type: "income", date: new Date(2023, 3, 20) },
]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventAmount, setNewEventAmount] = useState("")
  const [newEventType, setNewEventType] = useState("expense")
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleAddEvent = () => {
    if (!newEventTitle || !newEventAmount || !newEventDate) return

    toast({
      title: "Event added",
      description: `${newEventTitle} has been added to your calendar.`,
      type: "success",
    })

    setNewEventTitle("")
    setNewEventAmount("")
    setNewEventType("expense")
    setNewEventDate(new Date())
    setIsAddEventOpen(false)
  }

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Get events for the selected date
  const selectedDateEvents = financialEvents.filter((event) => selectedDate && isSameDay(event.date, selectedDate))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Calendar</h2>
          <p className="text-muted-foreground">View and manage your scheduled income and expenses</p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Financial Event</DialogTitle>
              <DialogDescription>Schedule a new income or expense event</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Rent Payment"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newEventAmount}
                  onChange={(e) => setNewEventAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newEventType} onValueChange={setNewEventType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={newEventDate}
                  onSelect={setNewEventDate}
                  className="border rounded-md p-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-20 border rounded-md bg-muted/20"></div>
                ))}
                {daysInMonth.map((day) => {
                  const dayEvents = financialEvents.filter((event) => isSameDay(event.date, day))
                  const hasIncome = dayEvents.some((event) => event.type === "income")
                  const hasExpense = dayEvents.some((event) => event.type === "expense")
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <div
                      key={day.toString()}
                      className={`h-20 border rounded-md p-1 cursor-pointer transition-colors ${
                        isSelected ? "border-primary bg-primary/10" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{format(day, "d")}</span>
                        <div className="flex gap-1">
                          {hasIncome && <div className="h-2 w-2 rounded-full bg-emerald-500"></div>}
                          {hasExpense && <div className="h-2 w-2 rounded-full bg-red-500"></div>}
                        </div>
                      </div>
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs truncate rounded px-1 py-0.5 ${
                              event.type === "income"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
              <CardDescription>
                {selectedDateEvents.length ? `${selectedDateEvents.length} events scheduled` : "No events scheduled"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div
                          className={`mr-4 rounded-full p-2 ${event.type === "income" ? "income-bg" : "expense-bg"}`}
                        >
                          {event.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4 income-text" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 expense-text" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{format(event.date, "MMM d, yyyy")}</p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${event.type === "income" ? "income-text" : "expense-text"}`}
                      >
                        {event.type === "income" ? "+" : "-"}${event.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No events for this date</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a new financial event to keep track of your income and expenses.
                  </p>
                  <Button onClick={() => setIsAddEventOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
