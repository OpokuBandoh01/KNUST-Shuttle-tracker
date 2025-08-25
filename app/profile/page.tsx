"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Clock, Edit, MapPin, Menu, MessageSquare, Settings, User, Camera, Save, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  department?: string
  level?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isStudent, isGuest, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    level: ""
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?message=Please sign in to access your profile")
    }
  }, [isAuthenticated, router])

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || ["Guest", "User"]
      setFormData({
        firstName: nameParts[0] || "Guest",
        lastName: nameParts[1] || "User",
        email: user.email || "",
        department: user.department || "",
        level: user.level || ""
      })
    }
  }, [user])

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Mock user data - in real app, this would come from the user object
  const userData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    studentId: user?.studentId || "N/A",
    email: formData.email,
    program: formData.department || "Guest Access",
    year: formData.level || "N/A",
    joinDate: "September 2024",
    totalTrips: 45,
    favoriteRoute: "Brunei-KSB",
    alertsSet: 3,
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.department) {
      errors.department = "Department is required"
    }

    if (!formData.level) {
      errors.level = "Level is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    
    try {
      await updateUserProfile({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        department: formData.department,
        level: formData.level
      })
      
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      const nameParts = user.name?.split(" ") || ["Guest", "User"]
      setFormData({
        firstName: nameParts[0] || "Guest",
        lastName: nameParts[1] || "User",
        email: user.email || "",
        department: user.department || "",
        level: user.level || ""
      })
    }
    setFormErrors({})
    setIsEditing(false)
  }

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
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/map")}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Map
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/timetable")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Timetable
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/alerts")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Alerts
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/feedback")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link href={isAuthenticated ? "/map" : "/"} className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold">KNUST Shuttle</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Map
          </Link>
          <Link href="/timetable" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Timetable
          </Link>
          <Link href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Alerts
          </Link>
          <Link href="/feedback" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Feedback
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
            <User className="h-5 w-5 text-primary" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
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

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Overview */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle>
                  {userData.firstName} {userData.lastName}
                </CardTitle>
                <CardDescription>{userData.program}</CardDescription>
                <Badge variant="outline">{userData.year}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{userData.totalTrips}</div>
                    <div className="text-xs text-muted-foreground">Total Trips</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{userData.alertsSet}</div>
                    <div className="text-xs text-muted-foreground">Active Alerts</div>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-sm font-medium">Member Since</div>
                  <div className="text-sm text-muted-foreground">{userData.joinDate}</div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name *</Label>
                    <Input
                      id="first-name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-destructive">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name *</Label>
                    <Input
                      id="last-name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-destructive">{formErrors.lastName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" defaultValue={userData.studentId} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    {isEditing ? (
                      <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                          <SelectItem value="chemical-engineering">Chemical Engineering</SelectItem>
                          <SelectItem value="materials-engineering">Materials Engineering</SelectItem>
                          <SelectItem value="agricultural-engineering">Agricultural Engineering</SelectItem>
                          <SelectItem value="biomedical-engineering">Biomedical Engineering</SelectItem>
                          <SelectItem value="petroleum-engineering">Petroleum Engineering</SelectItem>
                          <SelectItem value="geomatic-engineering">Geomatic Engineering</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.department} disabled className="bg-muted" />
                    )}
                    {formErrors.department && (
                      <p className="text-sm text-destructive">{formErrors.department}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    {isEditing ? (
                      <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">Level 100</SelectItem>
                          <SelectItem value="200">Level 200</SelectItem>
                          <SelectItem value="300">Level 300</SelectItem>
                          <SelectItem value="400">Level 400</SelectItem>
                          <SelectItem value="500">Level 500</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.level} disabled className="bg-muted" />
                    )}
                    {formErrors.level && (
                      <p className="text-sm text-destructive">{formErrors.level}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings and data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => router.push("/notifications")}>
                    <Bell className="mr-2 h-4 w-4" />
                    View Notifications
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/help")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    App Settings
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
