"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, Download, RefreshCw, Activity, Zap, AlertCircle, TrendingUp, TrendingDown, BarChart3, MapPin, Car, UserCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { adminService } from "@/lib/backend/admin-service"
import { userService } from "@/lib/backend/user-service"
import { shuttleService } from "@/lib/backend/shuttle-service"
import { Analytics, Alert as AlertType } from "@/lib/backend/types"
import { formatDate, formatTime } from "@/lib/backend/utils"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  
  // State management
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [fleetStats, setFleetStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedRoute, setSelectedRoute] = useState("all")

  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadAnalyticsData()
  }, [isAdmin, router])

  const loadAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Load all analytics data in parallel
      const [analyticsData, userStatsData, fleetStatsData, alertsData] = await Promise.all([
        adminService.getAnalytics(),
        userService.getUserStatistics(),
        shuttleService.getFleetStatistics(),
        adminService.getAlerts()
      ])
      
      setAnalytics(analyticsData)
      setUserStats(userStatsData)
      setFleetStats(fleetStatsData)
      setAlerts(alertsData)
    } catch (error: any) {
      setError(error.message || "Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAnalyticsData()
    setIsRefreshing(false)
  }

  const handleExportReport = async (type: string) => {
    try {
      // This would integrate with a report generation service
      console.log(`Exporting ${type} report...`)
      // For now, just show a success message
      alert(`${type} report export started. You will receive it via email.`)
    } catch (error: any) {
      setError(`Failed to export ${type} report: ${error.message}`)
    }
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600"
    if (value >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (value: number) => {
    if (value >= 90) return { variant: "default" as const, text: "Excellent" }
    if (value >= 70) return { variant: "secondary" as const, text: "Good" }
    return { variant: "destructive" as const, text: "Needs Attention" }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadAnalyticsData}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">System usage insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button onClick={() => handleExportReport('comprehensive')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(analytics?.weeklyGrowth || 0)}
              <span className={`ml-1 ${analytics?.weeklyGrowth || 0 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(analytics?.weeklyGrowth || 0)}%
              </span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalDrivers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetStats?.activeShuttles || 0} shuttles in service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Trips</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.dailyTrips || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalTrips || 0} total trips this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.systemHealth || 0}%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="routes">Route Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Students</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{userStats?.students || 0}</span>
                      <Badge variant="default">{Math.round(((userStats?.students || 0) / (userStats?.totalUsers || 1)) * 100)}%</Badge>
                    </div>
                  </div>
                  <Progress value={((userStats?.students || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Drivers</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{userStats?.drivers || 0}</span>
                      <Badge variant="secondary">{Math.round(((userStats?.drivers || 0) / (userStats?.totalUsers || 1)) * 100)}%</Badge>
                    </div>
                  </div>
                  <Progress value={((userStats?.drivers || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Admins</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{userStats?.admins || 0}</span>
                      <Badge variant="outline">{Math.round(((userStats?.admins || 0) / (userStats?.totalUsers || 1)) * 100)}%</Badge>
                    </div>
                  </div>
                  <Progress value={((userStats?.admins || 0) / (userStats?.totalUsers || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">New This Week</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{userStats?.newThisWeek || 0}</span>
                      <Badge variant="default">New</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Status</CardTitle>
                <CardDescription>Shuttle fleet operational status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Shuttles</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{fleetStats?.activeShuttles || 0}</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                  </div>
                  <Progress value={((fleetStats?.activeShuttles || 0) / (fleetStats?.totalShuttles || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Maintenance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{fleetStats?.maintenanceShuttles || 0}</span>
                      <Badge variant="secondary">Maintenance</Badge>
                    </div>
                  </div>
                  <Progress value={((fleetStats?.maintenanceShuttles || 0) / (fleetStats?.totalShuttles || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Offline</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{fleetStats?.offlineShuttles || 0}</span>
                      <Badge variant="destructive">Offline</Badge>
                    </div>
                  </div>
                  <Progress value={((fleetStats?.offlineShuttles || 0) / (fleetStats?.totalShuttles || 1)) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilization Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{fleetStats?.utilizationRate || 0}%</span>
                      <Badge variant={fleetStats?.utilizationRate || 0 >= 80 ? "default" : "secondary"}>
                        {fleetStats?.utilizationRate || 0 >= 80 ? "High" : "Normal"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={fleetStats?.utilizationRate || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Routes</CardTitle>
              <CardDescription>Most active routes by trip count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topRoutes?.slice(0, 5).map((route, index) => (
                  <div key={route.routeId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{route.routeName}</p>
                        <p className="text-sm text-muted-foreground">{route.tripCount} trips</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{route.averagePassengers.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">avg passengers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage Trends</CardTitle>
                <CardDescription>Ridership patterns over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: "Monday", rides: 1247, percentage: 85 },
                    { day: "Tuesday", rides: 1156, percentage: 78 },
                    { day: "Wednesday", rides: 1389, percentage: 95 },
                    { day: "Thursday", rides: 1298, percentage: 88 },
                    { day: "Friday", rides: 1456, percentage: 100 },
                    { day: "Saturday", rides: 892, percentage: 61 },
                    { day: "Sunday", rides: 654, percentage: 45 },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium">{day.day}</div>
                      <div className="flex-1">
                        <Progress value={day.percentage} className="h-2" />
                      </div>
                      <div className="w-16 text-sm text-right">{day.rides}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>Busiest times of the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "7:00 - 9:00 AM", usage: "High", percentage: 95, rides: 342 },
                    { time: "12:00 - 2:00 PM", usage: "High", percentage: 88, rides: 298 },
                    { time: "5:00 - 7:00 PM", usage: "High", percentage: 92, rides: 315 },
                    { time: "9:00 - 11:00 AM", usage: "Medium", percentage: 65, rides: 187 },
                    { time: "2:00 - 4:00 PM", usage: "Medium", percentage: 58, rides: 165 },
                    { time: "7:00 - 9:00 PM", usage: "Low", percentage: 35, rides: 98 },
                  ].map((period, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{period.time}</span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              period.usage === "High"
                                ? "destructive"
                                : period.usage === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {period.usage}
                          </Badge>
                          <span className="text-sm">{period.rides} rides</span>
                        </div>
                      </div>
                      <Progress value={period.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>How users interact with the shuttle system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">App Usage</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Daily Active Users</span>
                      <span className="font-medium">1,847</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weekly Active Users</span>
                      <span className="font-medium">2,156</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Active Users</span>
                      <span className="font-medium">2,847</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Feature Usage</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Live Tracking</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Alerts Setup</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Timetable Views</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Satisfaction</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Average Rating</span>
                      <span className="font-medium">4.6/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Feedback Submitted</span>
                      <span className="font-medium">234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Issues Reported</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Technical metrics and system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Response Time</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">245ms</span>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Performance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">98.5%</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                  <Progress value={98} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Uptime</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">99.9%</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                  <Progress value={99} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Real-time Updates</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">1.2s</span>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Performance</CardTitle>
                <CardDescription>Top performing drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.driverPerformance?.slice(0, 5).map((driver, index) => (
                    <div key={driver.driverId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{driver.driverName}</p>
                          <p className="text-sm text-muted-foreground">{driver.tripsCompleted} trips</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{typeof driver.averageRating === 'number' ? driver.averageRating.toFixed(1) : 'N/A'}/5</p>
                        <p className="text-sm text-muted-foreground">{driver.onTimePercentage}% on-time</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Issues</CardTitle>
              <CardDescription>Current system status and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <AlertCircle className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-red-600' : 
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' : 
                        alert.severity === 'medium' ? 'secondary' : 'default'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">All systems operational</p>
                      <p className="text-xs text-muted-foreground">No critical issues detected</p>
                    </div>
                    <Badge variant="default">Normal</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
              <CardDescription>Usage and efficiency metrics by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics?.topRoutes?.map((route, index) => (
                  <div key={route.routeId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{route.routeName}</h4>
                        <p className="text-sm text-muted-foreground">{route.tripCount} trips completed</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Trip Count</p>
                        <p className="font-medium">{route.tripCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Passengers</p>
                        <p className="font-medium">{typeof route.averagePassengers === 'number' ? route.averagePassengers.toFixed(1) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <p className="font-medium">{Math.round((route.tripCount / (analytics?.totalTrips || 1)) * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Performance</p>
                        <p className="font-medium">Good</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Generate and download system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "Daily Usage Report",
                      description: "Comprehensive daily ridership data",
                      format: "PDF/Excel",
                    },
                    {
                      name: "Fleet Performance Report",
                      description: "Shuttle efficiency and maintenance metrics",
                      format: "PDF",
                    },
                    {
                      name: "User Analytics Report",
                      description: "User behavior and engagement insights",
                      format: "Excel",
                    },
                    {
                      name: "Financial Summary",
                      description: "Operational costs and revenue analysis",
                      format: "PDF/Excel",
                    },
                    {
                      name: "Route Optimization Report",
                      description: "Route efficiency recommendations",
                      format: "PDF",
                    },
                  ].map((report, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{report.format}</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportReport(report.name.toLowerCase())}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automated report generation schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Weekly Summary", frequency: "Every Monday", nextRun: "Jan 29, 2024", status: "Active" },
                    { name: "Monthly Analytics", frequency: "1st of month", nextRun: "Feb 1, 2024", status: "Active" },
                    { name: "Quarterly Review", frequency: "Every 3 months", nextRun: "Apr 1, 2024", status: "Active" },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{schedule.name}</p>
                        <p className="text-xs text-muted-foreground">{schedule.frequency}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">{schedule.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Next: {schedule.nextRun}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
