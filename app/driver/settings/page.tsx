"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bell, 
  Clock, 
  MapPin, 
  Menu, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut, 
  Sun, 
  Moon,
  Shield,
  Wifi,
  Battery,
  Navigation
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggleSwitch } from "@/components/theme-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"

function DriverSettingsContent() {
  const router = useRouter()
  const { user, logout, isDriver, getDriverDetails, updateDriverProfile, changeDriverPassword } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [gpsTracking, setGpsTracking] = useState(true)
  const [autoStart, setAutoStart] = useState(false)
  const [updateFrequency, setUpdateFrequency] = useState([5])
  const [driverData, setDriverData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

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

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      // TODO: Save settings to database
      console.log("Saving settings...")
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setIsChangingPassword(true)
      setPasswordError("")
      setPasswordSuccess("")

      // Validate form
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setPasswordError("All fields are required")
        return
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("New passwords do not match")
        return
      }

      if (passwordForm.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long")
        return
      }

      // Change password
      await changeDriverPassword(passwordForm.currentPassword, passwordForm.newPassword)
      
      setPasswordSuccess("Password changed successfully!")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      // Close dialog after a short delay
      setTimeout(() => {
        setIsPasswordDialogOpen(false)
        setPasswordSuccess("")
      }, 2000)
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePasswordDialogClose = () => {
    setIsPasswordDialogOpen(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setPasswordError("")
    setPasswordSuccess("")
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
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
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
                <Button variant="ghost" className="justify-start text-red-500" onClick={() => router.push("/login")}>
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
            <Settings className="h-5 w-5 text-primary" />
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Driver Settings</h1>
            <p className="text-muted-foreground">Customize your driver app preferences and operational settings</p>
          </div>

          <div className="space-y-6">
            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize how the driver app works for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <ThemeToggleSwitch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts and system notifications</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="english">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="twi">Twi</SelectItem>
                      <SelectItem value="ga">Ga</SelectItem>
                      <SelectItem value="ewe">Ewe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Operational Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Operational Settings
                </CardTitle>
                <CardDescription>Configure tracking and route-specific preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="gps-tracking">GPS Tracking</Label>
                    <p className="text-sm text-muted-foreground">Allow real-time location sharing with students</p>
                  </div>
                  <Switch id="gps-tracking" checked={gpsTracking} onCheckedChange={setGpsTracking} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-start">Auto-start Route</Label>
                    <p className="text-sm text-muted-foreground">Automatically start tracking when app opens</p>
                  </div>
                  <Switch id="auto-start" checked={autoStart} onCheckedChange={setAutoStart} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="update-frequency">Location Update Frequency</Label>
                  <div className="px-3">
                    <Slider
                      id="update-frequency"
                      min={3}
                      max={15}
                      step={1}
                      value={updateFrequency}
                      onValueChange={setUpdateFrequency}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>3 sec</span>
                      <span>Current: {updateFrequency[0]} sec</span>
                      <span>15 sec</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lower values provide more accurate tracking but use more battery
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="break-mode">Break Mode</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger id="break-mode">
                      <SelectValue placeholder="Select break mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual breaks only</SelectItem>
                      <SelectItem value="scheduled">Scheduled breaks (every 2 hours)</SelectItem>
                      <SelectItem value="automatic">Automatic break detection</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Configure how the app handles break periods during your shift
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Safety & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety & Security
                </CardTitle>
                <CardDescription>Emergency and safety-related settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive critical safety notifications</p>
                  </div>
                  <Switch id="emergency-alerts" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="speed-alerts">Speed Limit Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when exceeding campus speed limits</p>
                  </div>
                  <Switch id="speed-alerts" defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Select defaultValue="transport-office">
                    <SelectTrigger id="emergency-contact">
                      <SelectValue placeholder="Select primary emergency contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transport-office">KNUST Transport Office</SelectItem>
                      <SelectItem value="security">Campus Security</SelectItem>
                      <SelectItem value="supervisor">Route Supervisor</SelectItem>
                      <SelectItem value="personal">Personal Emergency Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-900">Emergency Protocol</div>
                      <div className="text-sm text-orange-700 mt-1">
                        In case of emergency, press and hold the power button for 3 seconds to trigger an automatic
                        alert to the transport office.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your driver account and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Driver ID</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{driverData?.driverId || "Loading..."}</p>
                    <Button variant="outline" size="sm" disabled>
                      Cannot Change
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">••••••••••</p>
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new password for your account.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {passwordError && (
                          <Alert variant="destructive">
                            <AlertDescription>{passwordError}</AlertDescription>
                          </Alert>
                        )}
                        
                        {passwordSuccess && (
                          <Alert>
                            <AlertDescription>{passwordSuccess}</AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              placeholder="Enter your current password"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              placeholder="Enter your new password"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={handlePasswordDialogClose}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handlePasswordChange} 
                            disabled={isChangingPassword}
                          >
                            {isChangingPassword ? "Changing..." : "Change Password"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Export</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Download your driving data and statistics</p>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-medium">KNUST Shuttle Tracker - Driver App</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="link" className="h-auto p-0 justify-start text-sm">
                    Driver Guidelines
                  </Button>
                  <Button variant="link" className="h-auto p-0 justify-start text-sm">
                    Safety Protocols
                  </Button>
                  <Button variant="link" className="h-auto p-0 justify-start text-sm">
                    Contact Support
                  </Button>
                  <Button variant="link" className="h-auto p-0 justify-start text-sm">
                    Report Technical Issue
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

export default function DriverSettingsPage() {
  return (
    <ErrorBoundary>
      <DriverSettingsContent />
    </ErrorBoundary>
  )
}
