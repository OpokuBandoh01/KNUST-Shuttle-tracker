import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AdminShortcut } from "@/components/admin-shortcut"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shuttle-tracker",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            {children}
            <AdminShortcut />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
