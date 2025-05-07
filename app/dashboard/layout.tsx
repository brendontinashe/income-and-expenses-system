import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex-1 ml-0 md:ml-[250px] transition-all duration-300 ease-in-out">
          <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
