"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, LogOut, MapPin, Menu, MessageSquare, Moon, SettingsIcon, Sun, User, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggleSwitch } from "@/components/theme-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isStudent, isGuest, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
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
                  <SettingsIcon className="mr-2 h-4 w-4" />
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
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => router.push(isAuthenticated ? "/profile" : "/login?message=Please sign up to access your profile")}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your app preferences and account settings</p>
          </div>

          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize how the app works for you</CardDescription>
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

                  <div className="space-y-2">
                    <Label htmlFor="default-view">Default Map View</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="default-view">
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Brunei-KSB Route</SelectItem>
                        <SelectItem value="brunei">Brunei Stand</SelectItem>
                        <SelectItem value="library">Library Stand</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy Stand</SelectItem>
                        <SelectItem value="ksb">KSB Stand</SelectItem>
                        <SelectItem value="casley">Casley Hayford Stand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="distance-unit">Distance Unit</Label>
                    <Select defaultValue="meters">
                      <SelectTrigger id="distance-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meters">Meters</SelectItem>
                        <SelectItem value="feet">Feet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="refresh-rate">Map Refresh Rate</Label>
                    <Select defaultValue="10">
                      <SelectTrigger id="refresh-rate">
                        <SelectValue placeholder="Select refresh rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Every 5 seconds</SelectItem>
                        <SelectItem value="10">Every 10 seconds</SelectItem>
                        <SelectItem value="30">Every 30 seconds</SelectItem>
                        <SelectItem value="60">Every minute</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Higher refresh rates provide more up-to-date information but may use more data
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>Customize accessibility settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="text-size">Text Size</Label>
                      <p className="text-sm text-muted-foreground">Adjust the size of text throughout the app</p>
                    </div>
                    <Select defaultValue="medium">
                      <SelectTrigger id="text-size" className="w-[180px]">
                        <SelectValue placeholder="Select text size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="x-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch id="high-contrast" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-motion">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                    </div>
                    <Switch id="reduce-motion" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6 mt-6">
              {isAuthenticated ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Two-Factor Authentication</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Not enabled</p>
                            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Setup
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Data Export</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Download your data</p>
                            <p className="text-xs text-muted-foreground">Export your account data and activity history</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Export
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Privacy Settings</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Manage data sharing</p>
                            <p className="text-xs text-muted-foreground">Control what information is shared with the app</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Account Deletion</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Permanently delete account</p>
                            <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                          </div>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="pt-2">
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        View and Edit Profile
                      </Button>
                    </CardContent>
                  </Card>



                  {user?.role === "admin" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Admin Access</CardTitle>
                        <CardDescription>Access administrative functions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={() => router.push("/admin/dashboard")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Go to Admin Dashboard
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Sign in to manage your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      You are currently using the app as a guest. Sign in to access your account settings.
                    </p>
                    <div className="flex justify-center">
                      <Button onClick={() => router.push("/login")}>Sign In</Button>
                    </div>
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="underline">
                        Sign up
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts about shuttle arrivals</p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch id="email-notifications" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="notification-distance">Notification Distance</Label>
                    <Select defaultValue="200">
                      <SelectTrigger id="notification-distance">
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 meters</SelectItem>
                        <SelectItem value="200">200 meters</SelectItem>
                        <SelectItem value="500">500 meters</SelectItem>
                        <SelectItem value="1000">1 kilometer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Get notified when shuttles are within this distance of your selected stop
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Notification Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="arrival-notifications" className="flex items-center space-x-2 cursor-pointer">
                          <span>Shuttle Arrivals</span>
                        </Label>
                        <Switch id="arrival-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="delay-notifications" className="flex items-center space-x-2 cursor-pointer">
                          <span>Delays & Disruptions</span>
                        </Label>
                        <Switch id="delay-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="schedule-notifications" className="flex items-center space-x-2 cursor-pointer">
                          <span>Schedule Changes</span>
                        </Label>
                        <Switch id="schedule-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="news-notifications" className="flex items-center space-x-2 cursor-pointer">
                          <span>News & Updates</span>
                        </Label>
                        <Switch id="news-notifications" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiet Hours</CardTitle>
                  <CardDescription>Set times when you don't want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">Pause notifications during specified times</p>
                    </div>
                    <Switch id="quiet-hours" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Select defaultValue="22">
                        <SelectTrigger id="start-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Select defaultValue="7">
                        <SelectTrigger id="end-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium">KNUST Shuttle Tracker</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/terms" className="text-sm hover:underline">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact Support
                </Link>
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
