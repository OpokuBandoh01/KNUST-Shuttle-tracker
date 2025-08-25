"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, FileUp, MapPin, Menu, MessageSquare, Plus, Settings, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TimetablePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("manual")

  // Mock timetable data
  const timetable = [
    { id: 1, day: "Monday", startTime: "08:30", endTime: "10:30", course: "MATH 151", location: "KSB Stand" },
    { id: 2, day: "Monday", startTime: "13:00", endTime: "15:00", course: "PHYS 143", location: "Library Stand" },
    { id: 3, day: "Tuesday", startTime: "09:00", endTime: "11:00", course: "CHEM 171", location: "Pharmacy Stand" },
    { id: 4, day: "Wednesday", startTime: "10:30", endTime: "12:30", course: "ENGL 157", location: "Brunei Stand" },
    { id: 5, day: "Thursday", startTime: "14:00", endTime: "16:00", course: "COMP 183", location: "KSB Stand" },
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
          <Link href="/timetable" className="text-sm font-medium text-primary">
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
              <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
              <p className="text-muted-foreground">Add your class schedule to get shuttle alerts</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Timetable</CardTitle>
              <CardDescription>Upload your academic timetable or add classes manually</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="upload">Upload Timetable</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select>
                        <SelectTrigger id="day">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Input id="course" placeholder="e.g., MATH 151" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input id="start-time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input id="end-time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brunei">Brunei Stand</SelectItem>
                          <SelectItem value="library">Library Stand</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy Stand</SelectItem>
                          <SelectItem value="ksb">KSB Stand</SelectItem>
                          <SelectItem value="casley">Casley Hayford Stand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notification">Notification Time</Label>
                      <Select>
                        <SelectTrigger id="notification">
                          <SelectValue placeholder="Select time before class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutes before</SelectItem>
                          <SelectItem value="15">15 minutes before</SelectItem>
                          <SelectItem value="20">20 minutes before</SelectItem>
                          <SelectItem value="30">30 minutes before</SelectItem>
                          <SelectItem value="45">45 minutes before</SelectItem>
                          <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>Add Class</Button>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4 pt-4">
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your timetable file or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">Supports PDF, Excel, or CSV formats</p>
                    <Button variant="outline">Browse Files</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      You can export your timetable from the KNUST student portal or upload a manually created file.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Timetable</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {timetable.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary rounded-md p-2 flex flex-col items-center justify-center min-w-[60px]">
                        <Calendar className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">{item.day.substring(0, 3)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{item.course}</h3>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
