"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
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
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you may
              have entered an incorrect URL.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Looking for something specific? Try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link href="/map" className="text-primary hover:underline">
                  Map
                </Link>
                <span>•</span>
                <Link href="/alerts" className="text-primary hover:underline">
                  Alerts
                </Link>
                <span>•</span>
                <Link href="/timetable" className="text-primary hover:underline">
                  Timetable
                </Link>
                <span>•</span>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
              </div>
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
