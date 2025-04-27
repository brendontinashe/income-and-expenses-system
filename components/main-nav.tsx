"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, Calendar, CreditCard, DollarSign, Home, PieChart, Settings, Tag, Users } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

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
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <DollarSign className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">FinanceTrack</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              route.active ? "text-foreground" : "text-foreground/60",
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="ml-6">
        <ThemeToggle />
      </div>
    </div>
  )
}
