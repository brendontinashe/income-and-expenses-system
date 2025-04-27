"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { Toast } from "@/components/toast"

type ToastType = "default" | "success" | "error" | "warning" | "info"

interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: ToastType
  duration?: number
  action?: React.ReactNode
}

interface ToastContextType {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, type = "default", duration = 5000, action }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type, duration, action }])
  }

  const dismiss = (id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    } else {
      setToasts([])
    }
  }

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:max-w-[420px]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            action={toast.action}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
