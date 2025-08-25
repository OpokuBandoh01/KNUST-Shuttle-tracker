"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  MapPin, 
  Clock, 
  Route, 
  Plus, 
  Edit, 
  Search, 
  Settings, 
  Users, 
  Timer, 
  Navigation,
  Trash2,
  Eye,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/backend/admin-service"
import { Route as RouteType, Stop, Schedule } from "@/lib/backend/types"
import { formatDate, getStatusColor } from "@/lib/backend/utils"

export default function AdminRoutesPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [routes, setRoutes] = useState<RouteType[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<RouteType[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [routeTypeFilter, setRouteTypeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("routes")
  
  // Modal States
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [showAddStop, setShowAddStop] = useState(false)
  const [showEditStop, setShowEditStop] = useState<string | null>(null)
  const [showRouteDetails, setShowRouteDetails] = useState<string | null>(null)
  const [showEditRoute, setShowEditRoute] = useState<string | null>(null)
  const [showScheduleConfig, setShowScheduleConfig] = useState<string | null>(null)
  
  // Form States
  const [routeForm, setRouteForm] = useState({
    name: "",
    description: "",
    routeType: "primary" as "primary" | "secondary" | "express",
    startLocation: "",
    endLocation: "",
    estimatedDuration: "",
    maxCapacity: "",
    isActive: true
  })
  
  const [stopForm, setStopForm] = useState({
    name: "",
    description: "",
    routeId: "",
    location: "",
    order: "",
    isActive: true
  })
  
  const [scheduleForm, setScheduleForm] = useState({
    routeId: "",
    dayType: "weekday",
    startTime: "",
    endTime: "",
    peakFrequency: "",
    offPeakFrequency: "",
    isActive: true
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadRoutesData()
  }, [isAdmin, router])

  const loadRoutesData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const [routesData, stopsData, schedulesData] = await Promise.all([
        adminService.getRoutes(),
        adminService.getStops(),
        adminService.getSchedules()
      ])
      setRoutes(routesData)
      setFilteredRoutes(routesData)
      setStops(stopsData)
      setSchedules(schedulesData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filter routes
  useEffect(() => {
    let filtered = routes.filter(route => {
      const matchesSearch = 
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && route.isActive) ||
        (statusFilter === "inactive" && !route.isActive)
      
      const matchesType = routeTypeFilter === "all" || route.routeType === routeTypeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })

    setFilteredRoutes(filtered)
  }, [routes, searchTerm, statusFilter, routeTypeFilter])

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await adminService.createRoute({
        name: routeForm.name.trim(),
        description: routeForm.description.trim(),
        routeType: routeForm.routeType,
        startLocation: routeForm.startLocation.trim(),
        endLocation: routeForm.endLocation.trim(),
        waypoints: [],
        estimatedDuration: parseInt(routeForm.estimatedDuration) || 0,
        maxCapacity: parseInt(routeForm.maxCapacity) || 0,
        isActive: routeForm.isActive
      })
      
      setSuccess("Route added successfully!")
      setShowAddRoute(false)
      setRouteForm({
        name: "",
        description: "",
        routeType: "primary" as "primary" | "secondary" | "express",
        startLocation: "",
        endLocation: "",
        estimatedDuration: "",
        maxCapacity: "",
        isActive: true
      })
      
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await adminService.createStop({
        name: stopForm.name.trim(),
        description: stopForm.description.trim(),
        routeId: stopForm.routeId,
        location: stopForm.location.trim(),
        order: parseInt(stopForm.order) || 0,
        isActive: stopForm.isActive
      })
      
      setSuccess("Stop added successfully!")
      setShowAddStop(false)
      setStopForm({
        name: "",
        description: "",
        routeId: "",
        location: "",
        order: "",
        isActive: true
      })
      
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm("Are you sure you want to delete this route? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await adminService.deleteRoute(routeId)
      setSuccess("Route deleted successfully!")
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleRouteStatus = async (routeId: string) => {
    try {
      setIsLoading(true)
      const route = routes.find(r => r.id === routeId)
      if (route) {
        await adminService.updateRoute(routeId, { isActive: !route.isActive })
        setSuccess("Route status updated successfully!")
        await loadRoutesData()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEditRoute) return
    
    try {
      setIsLoading(true)
      await adminService.updateRoute(showEditRoute, {
        name: routeForm.name.trim(),
        description: routeForm.description.trim(),
        routeType: routeForm.routeType,
        startLocation: routeForm.startLocation.trim(),
        endLocation: routeForm.endLocation.trim(),
        estimatedDuration: parseInt(routeForm.estimatedDuration) || 0,
        maxCapacity: parseInt(routeForm.maxCapacity) || 0,
        isActive: routeForm.isActive
      })
      
      setSuccess("Route updated successfully!")
      setShowEditRoute(null)
      setRouteForm({
        name: "",
        description: "",
        routeType: "primary" as "primary" | "secondary" | "express",
        startLocation: "",
        endLocation: "",
        estimatedDuration: "",
        maxCapacity: "",
        isActive: true
      })
      
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigureSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showScheduleConfig) return
    
    try {
      setIsLoading(true)
      // Check if schedule already exists for this route
      const existingSchedule = schedules.find(s => s.routeId === showScheduleConfig)
      
      if (existingSchedule) {
        // Update existing schedule
        await adminService.updateSchedule(existingSchedule.id, {
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          peakFrequency: scheduleForm.peakFrequency,
          offPeakFrequency: scheduleForm.offPeakFrequency,
          dayType: scheduleForm.dayType,
          isActive: scheduleForm.isActive
        })
        setSuccess("Schedule updated successfully!")
      } else {
        // Create new schedule
        await adminService.createSchedule({
          routeId: showScheduleConfig,
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          peakFrequency: scheduleForm.peakFrequency,
          offPeakFrequency: scheduleForm.offPeakFrequency,
          dayType: scheduleForm.dayType,
          isActive: scheduleForm.isActive
        })
        setSuccess("Schedule created successfully!")
      }
      
      setShowScheduleConfig(null)
      setScheduleForm({
        routeId: "",
        dayType: "weekday",
        startTime: "",
        endTime: "",
        peakFrequency: "",
        offPeakFrequency: "",
        isActive: true
      })
      
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId)
    if (route) {
      setRouteForm({
        name: route.name,
        description: route.description,
        routeType: route.routeType,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        estimatedDuration: route.estimatedDuration.toString(),
        maxCapacity: route.maxCapacity.toString(),
        isActive: route.isActive
      })
      setShowEditRoute(routeId)
    }
  }

  const openScheduleConfig = (routeId: string) => {
    const existingSchedule = schedules.find(s => s.routeId === routeId)
    if (existingSchedule) {
      setScheduleForm({
        routeId: existingSchedule.routeId,
        dayType: existingSchedule.dayType,
        startTime: existingSchedule.startTime,
        endTime: existingSchedule.endTime,
        peakFrequency: existingSchedule.peakFrequency,
        offPeakFrequency: existingSchedule.offPeakFrequency,
        isActive: existingSchedule.isActive
      })
    } else {
      setScheduleForm({
        routeId: routeId,
        dayType: "weekday",
        startTime: "06:00",
        endTime: "22:00",
        peakFrequency: "5",
        offPeakFrequency: "10",
        isActive: true
      })
    }
    setShowScheduleConfig(routeId)
  }

  const openEditStop = (stopId: string) => {
    const stop = stops.find(s => s.id === stopId)
    if (stop) {
      setStopForm({
        name: stop.name,
        description: stop.description,
        routeId: stop.routeId,
        location: stop.location,
        order: stop.order.toString(),
        isActive: stop.isActive
      })
      setShowEditStop(stopId)
    }
  }

  const handleEditStop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEditStop) return
    
    try {
      setIsLoading(true)
      await adminService.updateStop(showEditStop, {
        name: stopForm.name.trim(),
        description: stopForm.description.trim(),
        routeId: stopForm.routeId,
        location: stopForm.location.trim(),
        order: parseInt(stopForm.order) || 0,
        isActive: stopForm.isActive
      })
      
      setSuccess("Stop updated successfully!")
      setShowEditStop(null)
      setStopForm({
        name: "",
        description: "",
        routeId: "",
        location: "",
        order: "",
        isActive: true
      })
      
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStop = async (stopId: string) => {
    if (!confirm("Are you sure you want to delete this stop? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await adminService.deleteStop(stopId)
      setSuccess("Stop deleted successfully!")
      await loadRoutesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStopStatus = async (stopId: string) => {
    try {
      setIsLoading(true)
      const stop = stops.find(s => s.id === stopId)
      if (stop) {
        await adminService.updateStop(stopId, { isActive: !stop.isActive })
        setSuccess("Stop status updated successfully!")
        await loadRoutesData()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getRouteStats = () => {
    const activeRoutes = routes.filter(r => r.isActive).length
    const totalStops = stops.filter(s => s.isActive).length
    const totalSchedules = schedules.filter(s => s.isActive).length
    const avgDuration = routes.length > 0 
      ? Math.round(routes.reduce((sum, r) => sum + r.estimatedDuration, 0) / routes.length)
      : 0

    return { activeRoutes, totalStops, totalSchedules, avgDuration }
  }

  const getStopsForRoute = (routeId: string) => {
    return stops.filter(stop => stop.routeId === routeId && stop.isActive)
  }

  const getScheduleForRoute = (routeId: string) => {
    return schedules.find(schedule => schedule.routeId === routeId && schedule.isActive)
  }

  const getShuttleCountForRoute = (routeId: string) => {
    // This would come from shuttles collection - for now return mock data
    return Math.floor(Math.random() * 5) + 1
  }

  if (!isAdmin) {
    return null
  }

  const stats = getRouteStats()

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Route Management</h1>
            <p className="text-muted-foreground">Configure shuttle routes, stops, and schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={loadRoutesData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh all data from the database</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setShowAddRoute(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Route
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new shuttle route</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRoutes} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stops</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStops}</div>
            <p className="text-xs text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchedules}</div>
            <p className="text-xs text-muted-foreground">Configured schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}m</div>
            <p className="text-xs text-muted-foreground">End to end</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="stops">Stops</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Routes</CardTitle>
                  <CardDescription>Manage shuttle routes and their configurations</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search routes..." 
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={routeTypeFilter} onValueChange={setRouteTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading routes...</p>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No routes found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRoutes.map((route) => {
                    const routeStops = getStopsForRoute(route.id)
                    const routeSchedule = getScheduleForRoute(route.id)
                    const shuttleCount = getShuttleCountForRoute(route.id)
                    
                    return (
                      <div key={route.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{route.name}</h3>
                              <Badge variant={route.isActive ? "default" : "secondary"}>
                                {route.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">{route.routeType}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{route.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{routeStops.length} stops</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{route.estimatedDuration} min duration</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{shuttleCount} shuttles assigned</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Route:</span> {route.startLocation} → {route.endLocation}
                            </div>
                          </div>
                                                     <div className="flex space-x-2">
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button variant="outline" size="sm">
                                       <MoreHorizontal className="h-4 w-4" />
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end">
                                     <DropdownMenuItem onClick={() => setShowRouteDetails(route.id)}>
                                       <Eye className="h-4 w-4 mr-2" />
                                       View Details
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => openEditRoute(route.id)}>
                                       <Edit className="h-4 w-4 mr-2" />
                                       Edit Route
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => openScheduleConfig(route.id)}>
                                       <Settings className="h-4 w-4 mr-2" />
                                       Configure Schedule
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem onClick={() => handleToggleRouteStatus(route.id)}>
                                       {route.isActive ? "Deactivate" : "Activate"}
                                     </DropdownMenuItem>
                                     <DropdownMenuItem 
                                       className="text-red-600"
                                       onClick={() => handleDeleteRoute(route.id)}
                                     >
                                       <Trash2 className="h-4 w-4 mr-2" />
                                       Delete Route
                                     </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p>Route actions menu</p>
                               </TooltipContent>
                             </Tooltip>
                           </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stops" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Shuttle Stops</CardTitle>
                  <CardDescription>Manage all shuttle stops and their details</CardDescription>
                </div>
                                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button onClick={() => setShowAddStop(true)}>
                       <Plus className="h-4 w-4 mr-2" />
                       Add Stop
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Add a new stop to an existing route</p>
                   </TooltipContent>
                 </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {stops.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No stops configured yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stops.map((stop) => {
                    const route = routes.find(r => r.id === stop.routeId)
                    return (
                      <Card key={stop.id}>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{stop.name}</h4>
                              <Badge variant={stop.isActive ? "default" : "secondary"}>
                                {stop.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{stop.description}</p>
                            <p className="text-sm text-muted-foreground">
                              Route: {route?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Order: {stop.order}
                            </p>
                                                         <div className="flex justify-between items-center">
                               <span className="text-sm">Location: {stop.location}</span>
                               <div className="flex space-x-1">
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => openEditStop(stop.id)}
                                   title="Edit Stop"
                                 >
                                   <Edit className="h-3 w-3" />
                                 </Button>
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => handleToggleStopStatus(stop.id)}
                                   title={stop.isActive ? "Deactivate Stop" : "Activate Stop"}
                                 >
                                   {stop.isActive ? (
                                     <XCircle className="h-3 w-3 text-orange-500" />
                                   ) : (
                                     <CheckCircle className="h-3 w-3 text-green-500" />
                                   )}
                                 </Button>
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => handleDeleteStop(stop.id)}
                                   title="Delete Stop"
                                   className="text-red-500 hover:text-red-700"
                                 >
                                   <Trash2 className="h-3 w-3" />
                                 </Button>
                               </div>
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Schedules</CardTitle>
              <CardDescription>Configure operating hours and frequency for each route</CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No schedules configured yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {schedules.map((schedule) => {
                    const route = routes.find(r => r.id === schedule.routeId)
                    return (
                      <div key={schedule.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{route?.name || "Unknown Route"} Schedule</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Weekdays</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Operating Hours:</span>
                                <span>{schedule.startTime} - {schedule.endTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Peak Frequency:</span>
                                <span>Every {schedule.peakFrequency} minutes</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Off-Peak Frequency:</span>
                                <span>Every {schedule.offPeakFrequency} minutes</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Status</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Day Type:</span>
                                <span className="capitalize">{schedule.dayType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge variant={schedule.isActive ? "default" : "secondary"}>
                                  {schedule.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                                                 <div className="mt-3 flex justify-end">
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button variant="outline" size="sm">
                                 <Edit className="h-4 w-4 mr-1" />
                                 Edit Schedule
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>Edit route schedule configuration</p>
                             </TooltipContent>
                           </Tooltip>
                         </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Route Modal */}
      <Dialog open={showAddRoute} onOpenChange={setShowAddRoute}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Create a new shuttle route with all necessary details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRoute} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="route-name">Route Name *</Label>
                <Input
                  id="route-name"
                  placeholder="Brunei-KSB Route"
                  value={routeForm.name}
                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-type">Route Type *</Label>
                <Select value={routeForm.routeType} onValueChange={(value) => setRouteForm({ ...routeForm, routeType: value as "primary" | "secondary" | "express" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="route-description">Description</Label>
              <Textarea
                id="route-description"
                placeholder="Route description..."
                value={routeForm.description}
                onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-location">Start Location *</Label>
                <Input
                  id="start-location"
                  placeholder="Brunei Hostel"
                  value={routeForm.startLocation}
                  onChange={(e) => setRouteForm({ ...routeForm, startLocation: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-location">End Location *</Label>
                <Input
                  id="end-location"
                  placeholder="KSB"
                  value={routeForm.endLocation}
                  onChange={(e) => setRouteForm({ ...routeForm, endLocation: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="25"
                  value={routeForm.estimatedDuration}
                  onChange={(e) => setRouteForm({ ...routeForm, estimatedDuration: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Max Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="50"
                  value={routeForm.maxCapacity}
                  onChange={(e) => setRouteForm({ ...routeForm, maxCapacity: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-active"
                checked={routeForm.isActive}
                onChange={(e) => setRouteForm({ ...routeForm, isActive: e.target.checked })}
              />
              <Label htmlFor="is-active">Route is active</Label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddRoute(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Route"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Stop Modal */}
      <Dialog open={showAddStop} onOpenChange={setShowAddStop}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Stop</DialogTitle>
            <DialogDescription>
              Add a new stop to an existing route
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStop} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stop-name">Stop Name *</Label>
                <Input
                  id="stop-name"
                  placeholder="Library"
                  value={stopForm.name}
                  onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop-route">Route *</Label>
                <Select value={stopForm.routeId} onValueChange={(value) => setStopForm({ ...stopForm, routeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stop-description">Description</Label>
              <Textarea
                id="stop-description"
                placeholder="Stop description..."
                value={stopForm.description}
                onChange={(e) => setStopForm({ ...stopForm, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stop-location">Location *</Label>
                <Input
                  id="stop-location"
                  placeholder="Near Library Building"
                  value={stopForm.location}
                  onChange={(e) => setStopForm({ ...stopForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop-order">Order *</Label>
                <Input
                  id="stop-order"
                  type="number"
                  placeholder="1"
                  value={stopForm.order}
                  onChange={(e) => setStopForm({ ...stopForm, order: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="stop-active"
                checked={stopForm.isActive}
                onChange={(e) => setStopForm({ ...stopForm, isActive: e.target.checked })}
              />
              <Label htmlFor="stop-active">Stop is active</Label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddStop(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Stop"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Stop Modal */}
      <Dialog open={!!showEditStop} onOpenChange={() => setShowEditStop(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Stop</DialogTitle>
            <DialogDescription>
              Update stop configuration
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStop} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stop-name">Stop Name *</Label>
                <Input
                  id="edit-stop-name"
                  placeholder="Library"
                  value={stopForm.name}
                  onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stop-route">Route *</Label>
                <Select value={stopForm.routeId} onValueChange={(value) => setStopForm({ ...stopForm, routeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-stop-description">Description</Label>
              <Textarea
                id="edit-stop-description"
                placeholder="Stop description..."
                value={stopForm.description}
                onChange={(e) => setStopForm({ ...stopForm, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stop-location">Location *</Label>
                <Input
                  id="edit-stop-location"
                  placeholder="Near Library Building"
                  value={stopForm.location}
                  onChange={(e) => setStopForm({ ...stopForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stop-order">Order *</Label>
                <Input
                  id="edit-stop-order"
                  type="number"
                  placeholder="1"
                  value={stopForm.order}
                  onChange={(e) => setStopForm({ ...stopForm, order: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-stop-active"
                checked={stopForm.isActive}
                onChange={(e) => setStopForm({ ...stopForm, isActive: e.target.checked })}
              />
              <Label htmlFor="edit-stop-active">Stop is active</Label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowEditStop(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Stop"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Route Modal */}
      <Dialog open={!!showEditRoute} onOpenChange={() => setShowEditRoute(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update route configuration
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRoute} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-route-name">Route Name *</Label>
                <Input
                  id="edit-route-name"
                  placeholder="Brunei-KSB Route"
                  value={routeForm.name}
                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-route-type">Route Type *</Label>
                <Select value={routeForm.routeType} onValueChange={(value) => setRouteForm({ ...routeForm, routeType: value as "primary" | "secondary" | "express" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-route-description">Description</Label>
              <Textarea
                id="edit-route-description"
                placeholder="Route description..."
                value={routeForm.description}
                onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-location">Start Location *</Label>
                <Input
                  id="edit-start-location"
                  placeholder="Brunei Hostel"
                  value={routeForm.startLocation}
                  onChange={(e) => setRouteForm({ ...routeForm, startLocation: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-location">End Location *</Label>
                <Input
                  id="edit-end-location"
                  placeholder="KSB"
                  value={routeForm.endLocation}
                  onChange={(e) => setRouteForm({ ...routeForm, endLocation: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Estimated Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="25"
                  value={routeForm.estimatedDuration}
                  onChange={(e) => setRouteForm({ ...routeForm, estimatedDuration: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Max Capacity *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  placeholder="50"
                  value={routeForm.maxCapacity}
                  onChange={(e) => setRouteForm({ ...routeForm, maxCapacity: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is-active"
                checked={routeForm.isActive}
                onChange={(e) => setRouteForm({ ...routeForm, isActive: e.target.checked })}
              />
              <Label htmlFor="edit-is-active">Route is active</Label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowEditRoute(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Route"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Route Details Modal */}
      <Dialog open={!!showRouteDetails} onOpenChange={() => setShowRouteDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Route Details</DialogTitle>
            <DialogDescription>
              Complete information about the route
            </DialogDescription>
          </DialogHeader>
          {showRouteDetails && (
            <div className="space-y-4">
              {(() => {
                const route = routes.find(r => r.id === showRouteDetails)
                if (!route) return <p>Route not found</p>
                
                const routeStops = getStopsForRoute(route.id)
                const routeSchedule = getScheduleForRoute(route.id)
                
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm">{route.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm capitalize">{route.routeType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm">{route.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge variant={route.isActive ? "default" : "secondary"}>
                        {route.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Location</label>
                      <p className="text-sm">{route.startLocation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Location</label>
                      <p className="text-sm">{route.endLocation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-sm">{route.estimatedDuration} minutes</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Max Capacity</label>
                      <p className="text-sm">{route.maxCapacity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Stops</label>
                      <p className="text-sm">{routeStops.length} stops</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Schedule</label>
                      <p className="text-sm">{routeSchedule ? "Configured" : "Not configured"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm">{formatDate(route.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm">{formatDate(route.updatedAt)}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Configuration Modal */}
      <Dialog open={!!showScheduleConfig} onOpenChange={() => setShowScheduleConfig(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Route Schedule</DialogTitle>
            <DialogDescription>
              Set operating hours and frequency for the route
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfigureSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-day-type">Day Type *</Label>
                <Select value={scheduleForm.dayType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, dayType: value as "weekday" | "weekend" | "holiday" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekday">Weekday</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="schedule-active"
                    checked={scheduleForm.isActive}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, isActive: e.target.checked })}
                  />
                  <Label htmlFor="schedule-active">Schedule is active</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-start-time">Start Time *</Label>
                <Input
                  id="schedule-start-time"
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-end-time">End Time *</Label>
                <Input
                  id="schedule-end-time"
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-peak-frequency">Peak Frequency (minutes) *</Label>
                <Input
                  id="schedule-peak-frequency"
                  type="number"
                  placeholder="5"
                  value={scheduleForm.peakFrequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, peakFrequency: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-off-peak-frequency">Off-Peak Frequency (minutes) *</Label>
                <Input
                  id="schedule-off-peak-frequency"
                  type="number"
                  placeholder="10"
                  value={scheduleForm.offPeakFrequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, offPeakFrequency: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowScheduleConfig(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Schedule"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  )
}
