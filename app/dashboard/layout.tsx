import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { ToastProvider } from "@/hooks/use-toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <SidebarNav />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 md:ml-[250px] transition-all duration-300">
          <div className="container mx-auto">{children}</div>
        </div>
      </div>
    </ToastProvider>
  )
}
