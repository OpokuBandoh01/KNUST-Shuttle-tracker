"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, MapPin, Menu, MessageSquare, Plus, Settings, Trash2, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertSetupModal } from "@/components/alert-setup-modal"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AlertsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [showAlertSetup, setShowAlertSetup] = useState(false)

  // Mock alerts data
  const alerts = [
    {
      id: 1,
      standName: "Brunei Stand",
      shuttleName: "All Shuttles",
      notifyBefore: "5 mins",
      active: true,
      repeat: "Daily",
    },
    {
      id: 2,
      standName: "Library Stand",
      shuttleName: "Shuttle A1",
      notifyBefore: "10 mins",
      active: true,
      repeat: "Once",
    },
    {
      id: 3,
      standName: "KSB Stand",
      shuttleName: "Shuttle A2",
      notifyBefore: "5 mins",
      active: false,
      repeat: "Daily",
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
          <Link href="/alerts" className="text-sm font-medium text-primary">
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
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Shuttle Alerts</h1>
              <p className="text-muted-foreground">Get notified when shuttles approach your location</p>
            </div>
            <Button className="mt-4 md:mt-0" onClick={() => setShowAlertSetup(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Alert
            </Button>
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-md p-2 flex items-center justify-center ${
                            alert.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{alert.standName}</h3>
                          <p className="text-sm text-muted-foreground">{alert.shuttleName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.notifyBefore} before
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.repeat}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Switch checked={alert.active} />
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Alerts Set</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't set up any shuttle alerts yet. Create your first alert to get notified when shuttles
                  approach your location.
                </p>
                <Button onClick={() => setShowAlertSetup(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About Alerts</CardTitle>
              <CardDescription>How shuttle alerts work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                  1
                </div>
                <p>
                  <strong>Set an alert</strong> for a specific shuttle stand and choose which shuttle(s) you want to
                  track.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                  2
                </div>
                <p>
                  <strong>Choose when</strong> to be notified - from 2 to 15 minutes before the shuttle arrives.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                  3
                </div>
                <p>
                  <strong>Get notified</strong> via push notification when the shuttle is approaching your selected
                  stand.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                  4
                </div>
                <p>
                  <strong>Set recurring alerts</strong> for your regular schedule to never miss a shuttle again.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Alert Setup Modal */}
      <AlertSetupModal
        isOpen={showAlertSetup}
        onClose={() => setShowAlertSetup(false)}
        stand={{
          id: 1,
          name: "Select a stand from the map",
          shuttles: [
            { id: 1, name: "Shuttle A1", estimatedArrival: "2 mins" },
            { id: 2, name: "Shuttle A2", estimatedArrival: "8 mins" },
          ],
        }}
      />
    </div>
  )
}
