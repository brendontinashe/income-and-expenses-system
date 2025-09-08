"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react"

interface ToastProps {
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning" | "info"
  action?: React.ReactNode
  onClose?: () => void
}

export function Toast({ title, description, type = "default", action, onClose }: ToastProps) {
  const Icon = {
    default: Info,
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[type]

  const bgColor = {
    default: "bg-background",
    success: "bg-green-50 dark:bg-green-950",
    error: "bg-red-50 dark:bg-red-950",
    warning: "bg-yellow-50 dark:bg-yellow-950",
    info: "bg-blue-50 dark:bg-blue-950",
  }[type]

  const borderColor = {
    default: "border-border",
    success: "border-green-200 dark:border-green-800",
    error: "border-red-200 dark:border-red-800",
    warning: "border-yellow-200 dark:border-yellow-800",
    info: "border-blue-200 dark:border-blue-800",
  }[type]

  const iconColor = {
    default: "text-foreground",
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-blue-500 dark:text-blue-400",
  }[type]

  return (
    <div
      className={cn("flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm", bgColor, borderColor)}
      role="alert"
    >
      {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
      <div className="flex-1 space-y-1">
        {title && <h3 className="font-medium">{title}</h3>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  )
}
