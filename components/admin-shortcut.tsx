"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function AdminShortcut() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Listen for Ctrl+Shift+A keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()

        // Check if user is admin before redirecting
        const isAdmin = user?.role === "admin"
        if (isAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/login?tab=admin")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, user])

  // This is an invisible component, just for the keyboard shortcut
  return null
}
