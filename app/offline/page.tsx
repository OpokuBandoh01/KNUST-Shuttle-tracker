"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, WifiOff, RefreshCw, Clock, MapPinned } from "lucide-react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    setLastUpdate(new Date().toLocaleTimeString())

    const handleOnline = () => {
      setIsOnline(true)
      setLastUpdate(new Date().toLocaleTimeString())
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      // Show a message that they're still offline
      alert("You're still offline. Please check your internet connection.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="mx-auto bg-orange-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <WifiOff className="h-10 w-10 text-orange-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">You're Offline</h1>
              <p className="text-muted-foreground">
                It looks like you've lost your internet connection. Some features may not be available while offline.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5" />
                  Limited Features Available
                </CardTitle>
                <CardDescription>What you can still do while offline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>View cached shuttle stop locations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Access your saved timetable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>View app settings and profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Real-time shuttle tracking (unavailable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Live alerts and notifications (unavailable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Submit feedback or sync data (unavailable)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Connection Status
                </CardTitle>
                <CardDescription>Current network information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={`text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}>
                      {isOnline ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Update:</span>
                    <span className="text-sm text-muted-foreground">{lastUpdate}</span>
                  </div>
                </div>

                <Button onClick={handleRetry} className="w-full" disabled={!isOnline}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isOnline ? "Reconnect" : "Check Connection"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Troubleshooting Tips:</strong>
              </p>
              <ul className="space-y-1 text-left max-w-md mx-auto">
                <li>• Check your WiFi or mobile data connection</li>
                <li>• Move to an area with better signal strength</li>
                <li>• Try turning airplane mode on and off</li>
                <li>• Restart your device if the problem persists</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  View Offline Map
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/timetable">
                  <Clock className="mr-2 h-4 w-4" />
                  View Timetable
                </Link>
              </Button>
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
