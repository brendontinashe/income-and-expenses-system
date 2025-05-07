import type React from "react"
import ClientRootLayout from "./clientLayout"

export const metadata = {
  title: "Income & Expenditure System",
  description: "Track and manage your income and expenses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'