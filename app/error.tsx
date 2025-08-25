"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw, Home, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-4">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Something went wrong!</h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error while processing your request. This has been logged and our team will
                investigate.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>If this problem persists, please:</p>
              <ul className="space-y-1">
                <li>• Check your internet connection</li>
                <li>• Clear your browser cache</li>
                <li>• Try refreshing the page</li>
                <li>
                  •{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact our support team
                  </Link>
                </li>
              </ul>
              {error.digest && <p className="text-xs text-muted-foreground mt-4">Error ID: {error.digest}</p>}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2024 KNUST Shuttle Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
