"use client"

import type React from "react"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning" | "info"
  action?: React.ReactNode
}

export function Toast({ title, description, type = "default", action }: ToastProps) {
  const { dismiss } = useToast()

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        {
          "bg-background text-foreground": type === "default",
          "bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-50": type === "success",
          "bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-50": type === "error",
          "bg-yellow-50 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-50": type === "warning",
          "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-50": type === "info",
        },
      )}
    >
      <div className="flex flex-col gap-1">
        {title && <div className="text-sm font-medium">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
      <Button
        variant="ghost"
        size="icon"
        className={cn("absolute right-1 top-1 rounded-full p-0 opacity-70 transition-opacity hover:opacity-100", {
          "hover:bg-green-100 dark:hover:bg-green-900/50": type === "success",
          "hover:bg-red-100 dark:hover:bg-red-900/50": type === "error",
          "hover:bg-yellow-100 dark:hover:bg-yellow-900/50": type === "warning",
          "hover:bg-blue-100 dark:hover:bg-blue-900/50": type === "info",
        })}
        onClick={() => dismiss()}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}
