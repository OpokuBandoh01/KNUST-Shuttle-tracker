"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, MapPin, Menu, MessageSquare, Settings, User, Trash2, CheckCircle } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Shuttle A1 Approaching",
      message: "Shuttle A1 will arrive at Brunei Stand in 3 minutes",
      time: "2 minutes ago",
      read: false,
      stand: "Brunei Stand",
    },
    {
      id: 2,
      type: "timetable",
      title: "Class Reminder",
      message: "MATH 151 starts in 30 minutes at KSB. Consider taking the shuttle now.",
      time: "25 minutes ago",
      read: true,
      stand: "KSB Stand",
    },
    {
      id: 3,
      type: "alert",
      title: "Shuttle A2 Delayed",
      message: "Shuttle A2 is running 5 minutes behind schedule",
      time: "1 hour ago",
      read: false,
      stand: "Library Stand",
    },
    {
      id: 4,
      type: "system",
      title: "Service Update",
      message: "Shuttle service will be temporarily suspended tomorrow from 2-4 PM for maintenance",
      time: "3 hours ago",
      read: true,
      stand: null,
    },
    {
      id: 5,
      type: "alert",
      title: "Shuttle A1 Arrived",
      message: "Shuttle A1 has arrived at Pharmacy Stand",
      time: "Yesterday",
      read: true,
      stand: "Pharmacy Stand",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <Bell className="h-5 w-5 text-primary" />
      case "timetable":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "system":
        return <Settings className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const markAllAsRead = () => {
    // In a real app, this would update the backend
    console.log("Marking all notifications as read")
  }

  const clearAll = () => {
    // In a real app, this would clear notifications
    console.log("Clearing all notifications")
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
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">Stay updated with shuttle alerts and reminders</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-6">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            {notification.stand && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {notification.stand}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="alert" className="space-y-4 mt-6">
              {notifications
                .filter((n) => n.type === "alert")
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {notification.stand && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {notification.stand}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {notification.time}
                              </span>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
            <TabsContent value="timetable" className="space-y-4 mt-6">
              {notifications
                .filter((n) => n.type === "timetable")
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {notification.stand && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {notification.stand}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {notification.time}
                              </span>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
            <TabsContent value="system" className="space-y-4 mt-6">
              {notifications
                .filter((n) => n.type === "system")
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {notification.stand && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {notification.stand}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {notification.time}
                              </span>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>

          {notifications.length === 0 && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Notifications about shuttle alerts and reminders will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
