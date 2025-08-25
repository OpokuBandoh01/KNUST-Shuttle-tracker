"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, LogOut, MapPin, Menu, MessageSquare, Settings, User, Star, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"

function DriverFeedbackContent() {
  const router = useRouter()
  const { user, logout, isDriver, getDriverDetails } = useAuth()
  const [filterPeriod, setFilterPeriod] = useState("week")
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

  // Mock feedback data
  const feedbackStats = {
    averageRating: 4.8,
    totalFeedback: 156,
    positivePercentage: 92,
    responseRate: 78,
  }

  const recentFeedback = [
    {
      id: 1,
      rating: 5,
      comment: "Very punctual and friendly driver. Always arrives on time and drives safely.",
      date: "2 hours ago",
      studentId: "20123456",
      type: "positive",
    },
    {
      id: 2,
      rating: 4,
      comment: "Good service overall, but the shuttle was a bit crowded during peak hours.",
      date: "1 day ago",
      studentId: "20234567",
      type: "neutral",
    },
    {
      id: 3,
      rating: 5,
      comment: "Excellent driver! Very courteous and helpful. Keep up the good work!",
      date: "2 days ago",
      studentId: "20345678",
      type: "positive",
    },
    {
      id: 4,
      rating: 3,
      comment: "The shuttle was 5 minutes late, but the driver was apologetic and explained the delay.",
      date: "3 days ago",
      studentId: "20456789",
      type: "neutral",
    },
    {
      id: 5,
      rating: 5,
      comment: "Great service! The driver is always professional and the shuttle is clean.",
      date: "4 days ago",
      studentId: "20567890",
      type: "positive",
    },
    {
      id: 6,
      rating: 2,
      comment: "The shuttle left early from Brunei Stand. Please stick to the schedule.",
      date: "5 days ago",
      studentId: "20678901",
      type: "negative",
    },
  ]

  const monthlyTrends = [
    { month: "Jan", rating: 4.6, feedback: 45 },
    { month: "Feb", rating: 4.7, feedback: 52 },
    { month: "Mar", rating: 4.8, feedback: 59 },
    { month: "Apr", rating: 4.8, feedback: 63 },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading feedback data...</p>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredFeedback = recentFeedback.filter((feedback) => {
    if (filterPeriod === "week") return true // Show all for demo
    if (filterPeriod === "month") return true
    return true
  })

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
          <Link href="/driver/feedback" className="text-sm font-medium text-primary">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Feedback</h1>
              <p className="text-muted-foreground">View and analyze feedback from students about your service</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feedback Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{feedbackStats.averageRating}</div>
                    <div className="text-xs text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{feedbackStats.totalFeedback}</div>
                    <div className="text-xs text-muted-foreground">Total Feedback</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-green-500 rounded-full" />
                  <div>
                    <div className="text-2xl font-bold">{feedbackStats.positivePercentage}%</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-primary rounded-full" />
                  <div>
                    <div className="text-2xl font-bold">{feedbackStats.responseRate}%</div>
                    <div className="text-xs text-muted-foreground">Response Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Recent Feedback */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest comments and ratings from students</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="positive">Positive</TabsTrigger>
                    <TabsTrigger value="neutral">Neutral</TabsTrigger>
                    <TabsTrigger value="negative">Negative</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4 mt-4">
                    {filteredFeedback.map((feedback) => (
                      <div key={feedback.id} className={`p-4 rounded-lg border ${getTypeColor(feedback.type)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">{feedback.date}</div>
                        </div>
                        <p className="text-sm mb-2">{feedback.comment}</p>
                        <div className="text-xs text-muted-foreground">Student ID: {feedback.studentId}</div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="positive" className="space-y-4 mt-4">
                    {filteredFeedback
                      .filter((f) => f.type === "positive")
                      .map((feedback) => (
                        <div key={feedback.id} className={`p-4 rounded-lg border ${getTypeColor(feedback.type)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">{feedback.date}</div>
                          </div>
                          <p className="text-sm mb-2">{feedback.comment}</p>
                          <div className="text-xs text-muted-foreground">Student ID: {feedback.studentId}</div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="neutral" className="space-y-4 mt-4">
                    {filteredFeedback
                      .filter((f) => f.type === "neutral")
                      .map((feedback) => (
                        <div key={feedback.id} className={`p-4 rounded-lg border ${getTypeColor(feedback.type)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">{feedback.date}</div>
                          </div>
                          <p className="text-sm mb-2">{feedback.comment}</p>
                          <div className="text-xs text-muted-foreground">Student ID: {feedback.studentId}</div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="negative" className="space-y-4 mt-4">
                    {filteredFeedback
                      .filter((f) => f.type === "negative")
                      .map((feedback) => (
                        <div key={feedback.id} className={`p-4 rounded-lg border ${getTypeColor(feedback.type)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">{feedback.date}</div>
                          </div>
                          <p className="text-sm mb-2">{feedback.comment}</p>
                          <div className="text-xs text-muted-foreground">Student ID: {feedback.studentId}</div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your rating trends over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{trend.month}</div>
                      <div className="text-sm text-muted-foreground">{trend.feedback} reviews</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{trend.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Improvement Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tips for Improvement</CardTitle>
              <CardDescription>Based on recent feedback, here are some suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                  💡
                </div>
                <div>
                  <div className="font-medium text-blue-900">Punctuality</div>
                  <div className="text-sm text-blue-700">
                    Students appreciate when shuttles arrive on time. Try to maintain consistent schedules.
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-xs font-medium">
                  ✨
                </div>
                <div>
                  <div className="font-medium text-green-900">Communication</div>
                  <div className="text-sm text-green-700">
                    Keep students informed about delays or changes. A simple announcement goes a long way.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DriverFeedbackPage() {
  return (
    <ErrorBoundary>
      <DriverFeedbackContent />
    </ErrorBoundary>
  )
}
