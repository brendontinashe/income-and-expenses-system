"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarNav } from "@/components/sidebar-nav"
import { ToastProvider } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              {!isHomePage && <SidebarNav />}
              <div
                className={`flex-1 space-y-4 p-4 md:p-8 pt-6 ${!isHomePage ? "md:ml-[250px]" : ""} transition-all duration-300`}
              >
                <div className="container mx-auto">{children}</div>
              </div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
