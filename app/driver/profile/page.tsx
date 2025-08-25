"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  Clock,
  Edit,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  User,
  Camera,
  Star,
  Save,
  X,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Driver } from "@/lib/auth-context"

export default function DriverProfilePage() {
  const router = useRouter()
  const { user, logout, getDriverDetails, updateDriverProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [driverData, setDriverData] = useState<Driver | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    route: ""
  })

  useEffect(() => {
    if (user && user.role === "driver") {
      loadDriverData()
    }
  }, [user])

  const loadDriverData = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Get driver details using the user's email to find the driver record
      const driverQuery = await getDriverDetails(user!.email)
      if (driverQuery) {
        setDriverData(driverQuery)
        setFormData({
          name: driverQuery.name || "",
          email: driverQuery.email || "",
          phone: driverQuery.phone || "",
          vehicleNumber: driverQuery.vehicleNumber || "",
          route: driverQuery.route || ""
        })
      } else {
        setError("Driver profile not found")
      }
    } catch (error: any) {
      setError(error.message || "Failed to load driver data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      await updateDriverProfile({
        name: formData.name,
        phone: formData.phone,
        vehicleNumber: formData.vehicleNumber,
        route: formData.route
      })

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // Reload driver data to get updated information
      await loadDriverData()
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (driverData) {
      setFormData({
        name: driverData.name || "",
        email: driverData.email || "",
        phone: driverData.phone || "",
        vehicleNumber: driverData.vehicleNumber || "",
        route: driverData.route || ""
      })
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading driver profile...</p>
        </div>
      </div>
    )
  }

  if (!driverData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load driver profile data.</p>
          <Button onClick={() => router.push("/driver/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Split name into first and last name for display
  const nameParts = driverData.name.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

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
          <Button variant="ghost" size="icon" onClick={() => router.push("/driver/profile")}>
            <User className="h-5 w-5 text-primary" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Driver Profile</h1>
              <p className="text-muted-foreground">Manage your driver information and credentials</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Overview */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {firstName[0]}
                      {lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle>
                  {isEditing ? formData.name : driverData.name}
                </CardTitle>
                <CardDescription>Driver ID: {driverData.driverId}</CardDescription>
                <Badge variant="outline">{driverData.route || "No route assigned"}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground">Total Trips</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                      0.0
                      <Star className="h-4 w-4 fill-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground">Students Served</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">0h</div>
                    <div className="text-xs text-muted-foreground">Active Hours</div>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-sm font-medium">Driver Since</div>
                  <div className="text-sm text-muted-foreground">
                    {driverData.createdAt ? new Date(driverData.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your driver details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-id">Driver ID</Label>
                    <Input 
                      id="driver-id" 
                      value={driverData.driverId} 
                      disabled 
                      className="bg-muted" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="route">Assigned Route</Label>
                    <Input 
                      id="route" 
                      value={formData.route} 
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle Number</Label>
                    <Input 
                      id="vehicle" 
                      value={formData.vehicleNumber} 
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your driver account and access support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={() => router.push("/driver/route")}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Route Details
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/driver/feedback")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Feedback
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/driver/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Driver Settings
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
