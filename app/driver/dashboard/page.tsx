"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, LogOut, MapPin, Menu, MessageSquare, Settings, User, Users } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { Driver } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"

function DriverDashboardContent() {
  const router = useRouter()
  const { user, logout, isDriver, updateDriverProfile, getDriverDetails } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [driverData, setDriverData] = useState<Driver | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    if (!user || !isDriver) {
      router.push("/login")
      return
    }
    loadDriverData()
  }, [user, isDriver, router])

  const loadDriverData = async () => {
    try {
      setIsLoading(true)
      const driverDetails = await getDriverDetails(user!.email)
      if (driverDetails) {
        setDriverData(driverDetails)
        setIsActive(driverDetails.isActive || false)
      }
    } catch (error) {
      console.error("Error loading driver data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRouteToggle = async (active: boolean) => {
    try {
      setIsUpdatingStatus(true)
      await updateDriverProfile({ isActive: active })
      setIsActive(active)
      
      // Here you would also integrate with GPS tracking
      if (active) {
        console.log("Starting GPS tracking...")
        // TODO: Implement GPS tracking start
      } else {
        console.log("Stopping GPS tracking...")
        // TODO: Implement GPS tracking stop
      }
    } catch (error) {
      console.error("Error updating route status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading driver dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error if driver data not found
  if (!driverData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Driver Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load driver information.</p>
          <Button onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  // Mock data for waiting students (in real app, this would come from database)
  const waitingStudents = [
    { standId: 1, standName: "Brunei Stand", count: 8 },
    { standId: 2, standName: "Library Stand", count: 12 },
    { standId: 3, standName: "Pharmacy Stand", count: 5 },
    { standId: 4, standName: "KSB Stand", count: 15 },
    { standId: 5, standName: "Casley Hayford Stand", count: 3 },
  ]

  // Mock data for efficiency tips (in real app, this would be AI-generated based on data)
  const efficiencyTips = [
    "High demand at Brunei Stand. Consider prioritizing this route.",
    "Low traffic expected in the next 30 minutes based on class schedules.",
  ]

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 h-14 flex items-center justify-between border-b bg-background z-10">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>KNUST Shuttle</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/driver/dashboard")}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/driver/route")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Route Info
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/driver/feedback")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/driver/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold">KNUST Shuttle</span>
          </Link>
          <Badge variant={isActive ? "default" : "secondary"} className="ml-2">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/driver/dashboard" className="text-sm font-medium text-primary">
            Dashboard
          </Link>
          <Link href="/driver/route" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Route Info
          </Link>
          <Link href="/driver/feedback" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Feedback
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/settings")}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/profile")}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Driver Status Card */}
          <Card className="col-span-full">
            <CardHeader className="pb-2">
              <CardTitle>Driver Status</CardTitle>
              <CardDescription>Toggle to start/end your route and begin tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Route: {driverData.route || "Not assigned"}</div>
                  <div className="text-sm text-muted-foreground">Driver ID: {driverData.driverId}</div>
                  <div className="text-sm text-muted-foreground">Vehicle: {driverData.vehicleNumber || "Not assigned"}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="route-active" 
                    checked={isActive} 
                    onCheckedChange={handleRouteToggle}
                    disabled={isUpdatingStatus}
                  />
                  <Label htmlFor="route-active">
                    {isUpdatingStatus ? "Updating..." : (isActive ? "End Route" : "Start Route")}
                  </Label>
                </div>
              </div>
              {isActive && (
                <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md text-sm">
                  Your location is being shared with students. GPS tracking is active.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiting Students Card */}
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Waiting Students
              </CardTitle>
              <CardDescription>Students waiting at upcoming stops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitingStudents.map((stand) => (
                  <div key={stand.standId} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium">{stand.standName}</div>
                      <div className="text-sm text-muted-foreground">Next stop in your route</div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {stand.count} <span className="text-xs ml-1">students</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Efficiency Tips
              </CardTitle>
              <CardDescription>Suggestions based on current data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {efficiencyTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md text-sm">
                    {tip}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Today's Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Trips Completed</div>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-sm text-muted-foreground">Students Transported</div>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">4.2h</div>
                  <div className="text-sm text-muted-foreground">Active Time</div>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DriverDashboard() {
  return (
    <ErrorBoundary>
      <DriverDashboardContent />
    </ErrorBoundary>
  )
}
