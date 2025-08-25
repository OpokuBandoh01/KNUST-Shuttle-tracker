"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw, Home, AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
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
                  <h1 className="text-3xl font-bold">Critical Error</h1>
                  <p className="text-muted-foreground">
                    A critical error occurred that prevented the application from loading properly. Please try
                    refreshing the page.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={reset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload Application
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Go Home
                    </Link>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>If this error continues to occur, please contact our support team at:</p>
                  <p className="text-primary">support@knustshuttle.com</p>
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
      </body>
    </html>
  )
}
