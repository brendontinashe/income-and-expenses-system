"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { BarChart3, Calendar, CreditCard, DollarSign, Home, PieChart, Settings, Tag, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/income",
      label: "Income",
      active: pathname === "/income" || pathname.startsWith("/income/"),
      icon: <DollarSign className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-500" />,
    },
    {
      href: "/expenses",
      label: "Expenses",
      active: pathname === "/expenses" || pathname.startsWith("/expenses/"),
      icon: <CreditCard className="h-4 w-4 mr-2 text-red-600 dark:text-red-500" />,
    },
    {
      href: "/reports",
      label: "Reports",
      active: pathname === "/reports",
      icon: <BarChart3 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-500" />,
    },
    {
      href: "/budgets",
      label: "Budgets",
      active: pathname === "/budgets",
      icon: <PieChart className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-500" />,
    },
    {
      href: "/calendar",
      label: "Calendar",
      active: pathname === "/calendar",
      icon: <Calendar className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-500" />,
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
      icon: <Tag className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-500" />,
    },
    {
      href: "/users",
      label: "Users",
      active: pathname === "/users",
      icon: <Users className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-500" />,
    },
    {
      href: "/settings",
      label: "Settings",
      active: pathname === "/settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <DollarSign className="h-6 w-6" />
              <span className="font-bold">FinanceTrack</span>
            </Link>
            <ThemeToggle />
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    route.active ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center space-x-2">
        <DollarSign className="h-6 w-6" />
        <span className="font-bold">FinanceTrack</span>
      </Link>
    </div>
  )
}
