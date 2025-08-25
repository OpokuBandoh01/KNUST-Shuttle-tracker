import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Download, RefreshCw, Activity, Zap, AlertCircle } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">System usage insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Ridership</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+0.5m</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="routes">Route Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

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
                <CardTitle>Fleet Performance</CardTitle>
                <CardDescription>Shuttle operational efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Performance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">87%</span>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                  <Progress value={87} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fleet Utilization</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">92%</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                  <Progress value={92} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fuel Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">8.5km/L</span>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                  <Progress value={78} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Maintenance Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">94%</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                  <Progress value={94} className="h-2" />
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
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">High server load detected</p>
                    <p className="text-xs text-muted-foreground">Response times may be slower during peak hours</p>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">All systems operational</p>
                    <p className="text-xs text-muted-foreground">No critical issues detected</p>
                  </div>
                  <Badge variant="default">Normal</Badge>
                </div>
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
                {[
                  {
                    name: "Brunei - KSB Route",
                    dailyRiders: 1247,
                    avgWaitTime: "4.2 min",
                    onTimePerformance: 87,
                    satisfaction: 4.6,
                    utilization: 92,
                  },
                  {
                    name: "Express Route",
                    dailyRiders: 456,
                    avgWaitTime: "2.8 min",
                    onTimePerformance: 94,
                    satisfaction: 4.8,
                    utilization: 78,
                  },
                  {
                    name: "Campus Loop",
                    dailyRiders: 0,
                    avgWaitTime: "N/A",
                    onTimePerformance: 0,
                    satisfaction: 0,
                    utilization: 0,
                  },
                ].map((route, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{route.name}</h4>
                        <p className="text-sm text-muted-foreground">{route.dailyRiders} daily riders</p>
                      </div>
                      <Badge
                        variant={route.utilization > 80 ? "default" : route.utilization > 0 ? "secondary" : "outline"}
                      >
                        {route.utilization > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                        <p className="font-medium">{route.avgWaitTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">On-Time Performance</p>
                        <p className="font-medium">{route.onTimePerformance}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Satisfaction</p>
                        <p className="font-medium">{route.satisfaction > 0 ? `${route.satisfaction}/5` : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <p className="font-medium">{route.utilization}%</p>
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
                        <Button size="sm" variant="outline">
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
