"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  Tag,
  Users,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const { user, logout, isLoading } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      icon: <Home className="h-5 w-5" />,
      color: "text-slate-500",
      bgColor: "bg-slate-100 dark:bg-slate-800",
    },
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: <Home className="h-5 w-5" />,
      color: "text-slate-500",
      bgColor: "bg-slate-100 dark:bg-slate-800",
    },
    {
      href: "/income",
      label: "Income",
      active: pathname === "/income" || pathname.startsWith("/income/"),
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      href: "/expenses",
      label: "Expenses",
      active: pathname === "/expenses" || pathname.startsWith("/expenses/"),
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      href: "/reports",
      label: "Reports",
      active: pathname === "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      href: "/budgets",
      label: "Budgets",
      active: pathname === "/budgets",
      icon: <PieChart className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      href: "/calendar",
      label: "Calendar",
      active: pathname === "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
      icon: <Tag className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      href: "/users",
      label: "Users",
      active: pathname === "/users",
      icon: <Users className="h-5 w-5" />,
      color: "text-teal-500",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      href: "/settings",
      label: "Settings",
      active: pathname === "/settings",
      icon: <Settings className="h-5 w-5" />,
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-800",
    },
  ]

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U"

    if (user.full_name) {
      const nameParts = user.full_name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      return user.full_name[0].toUpperCase()
    }
    return user.username[0].toUpperCase()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-3 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <DollarSign className={cn("h-6 w-6 text-primary", isCollapsed ? "mx-auto" : "mr-2")} />
            {!isCollapsed && <span className="font-bold text-lg">FinanceTrack</span>}
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <ChevronRight className={cn("h-5 w-5 transition-transform", isCollapsed ? "rotate-180" : "")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted",
                  route.active ? "bg-muted" : "transparent",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", route.bgColor, route.color)}>
                  {route.icon}
                </div>
                {!isCollapsed && <span className="ml-3">{route.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 hidden rounded-md border bg-popover px-3 py-2 group-hover:flex">
                    <span>{route.label}</span>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className={cn("border-t p-4", isCollapsed ? "flex justify-center" : "")}>
          {isCollapsed ? (
            <Avatar className="h-9 w-9">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.username}&background=random`}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback className="bg-indigo-600 text-white">{getUserInitials()}</AvatarFallback>
                </>
              )}
            </Avatar>
          ) : (
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      {isLoading ? (
                        <Skeleton className="h-full w-full rounded-full" />
                      ) : (
                        <>
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.username}&background=random`}
                            alt={user?.username || "User"}
                          />
                          <AvatarFallback className="bg-indigo-600 text-white">{getUserInitials()}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{user?.full_name || user?.username}</span>
                          <span className="text-xs text-muted-foreground">Account</span>
                        </>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
