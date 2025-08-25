"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  Clock,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  User,
  Navigation,
  Timer,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

function DriverRouteContent() {
  const router = useRouter()
  const { user, logout, isDriver, getDriverDetails } = useAuth()
  const [driverData, setDriverData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
      }
    } catch (error) {
      console.error("Error loading driver data:", error)
    } finally {
      setIsLoading(false)
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
          <p className="mt-2 text-muted-foreground">Loading route information...</p>
        </div>
      </div>
    )
  }

  // Route data from driver profile or default
  const routeInfo = {
    name: driverData?.route || "Not assigned",
    shuttleId: driverData?.vehicleNumber || "Not assigned",
    totalDistance: "3.2 km",
    estimatedTime: "12-15 minutes",
    operatingHours: "6:00 AM - 10:00 PM",
    frequency: "Every 8-10 minutes",
  }

  const outboundStops = [
    { id: 1, name: "Brunei Stand", estimatedTime: "0 min", waitingStudents: 8, isActive: true },
    { id: 2, name: "Library Stand", estimatedTime: "3 min", waitingStudents: 12, isActive: false },
    { id: 3, name: "Pharmacy Stand", estimatedTime: "6 min", waitingStudents: 5, isActive: false },
    { id: 4, name: "KSB Stand", estimatedTime: "12 min", waitingStudents: 15, isActive: false },
  ]

  const returnStops = [
    { id: 1, name: "KSB Stand", estimatedTime: "0 min", waitingStudents: 15, isActive: false },
    { id: 2, name: "Casley Hayford Stand", estimatedTime: "4 min", waitingStudents: 3, isActive: false },
    { id: 3, name: "Library Stand", estimatedTime: "8 min", waitingStudents: 12, isActive: false },
    { id: 4, name: "Brunei Stand", estimatedTime: "15 min", waitingStudents: 8, isActive: false },
  ]

  const routeStats = [
    { label: "Today's Trips", value: "12", icon: <Navigation className="h-4 w-4" /> },
    { label: "Average Trip Time", value: "13 min", icon: <Timer className="h-4 w-4" /> },
    { label: "Students Transported", value: "127", icon: <Users className="h-4 w-4" /> },
    { label: "On-Time Performance", value: "94%", icon: <Clock className="h-4 w-4" /> },
  ]

  const trafficAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Heavy traffic near Library Stand - expect 2-3 minute delays",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "High student demand at KSB Stand - 15 students waiting",
      time: "10 minutes ago",
    },
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
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/driver/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/driver/route" className="text-sm font-medium text-primary">
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
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/profile")}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Route Information</h1>
            <p className="text-muted-foreground">Detailed information about your assigned route</p>
          </div>

          {/* Route Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {routeInfo.name} Route
              </CardTitle>
              <CardDescription>Shuttle {routeInfo.shuttleId} - Your assigned route details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{routeInfo.totalDistance}</div>
                  <div className="text-sm text-muted-foreground">Total Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{routeInfo.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Est. Trip Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{routeInfo.operatingHours}</div>
                  <div className="text-sm text-muted-foreground">Operating Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{routeInfo.frequency}</div>
                  <div className="text-sm text-muted-foreground">Frequency</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {routeStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">{stat.icon}</div>
                    <div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Route Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Stops</CardTitle>
                <CardDescription>Detailed stop information and student waiting counts</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="outbound" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="outbound">Outbound (To KSB)</TabsTrigger>
                    <TabsTrigger value="return">Return (To Brunei)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="outbound" className="space-y-4 mt-4">
                    {outboundStops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              stop.isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{stop.name}</div>
                            <div className="text-sm text-muted-foreground">ETA: {stop.estimatedTime}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{stop.waitingStudents} waiting</Badge>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="return" className="space-y-4 mt-4">
                    {returnStops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              stop.isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{stop.name}</div>
                            <div className="text-sm text-muted-foreground">ETA: {stop.estimatedTime}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{stop.waitingStudents} waiting</Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Traffic Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Traffic & Alerts
                  </CardTitle>
                  <CardDescription>Real-time updates and route conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trafficAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "warning" ? "border-l-orange-500 bg-orange-50" : "border-l-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Route Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Guidelines</CardTitle>
                  <CardDescription>Important safety and operational guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                      1
                    </div>
                    <p>Always wait for students to board completely before departing</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                      2
                    </div>
                    <p>Maintain speed limits and follow campus traffic rules</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                      3
                    </div>
                    <p>Report any incidents or delays immediately</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                      4
                    </div>
                    <p>Keep GPS tracking active during operational hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DriverRoutePage() {
  return (
    <ErrorBoundary>
      <DriverRouteContent />
    </ErrorBoundary>
  )
}
