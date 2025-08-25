"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function Footer() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <footer className="border-t py-4 px-4 lg:px-6">
      <div className="container mx-auto flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <p>© 2024 KNUST Shuttle Tracker. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>

        {/* Admin access link - only visible to admins */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Shield className="h-3 w-3" />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>
    </footer>
  )
}
