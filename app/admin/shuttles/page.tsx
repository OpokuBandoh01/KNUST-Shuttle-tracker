"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bus,
  Wrench,
  Plus,
  Edit,
  Search,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Battery,
  RefreshCw,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { shuttleService } from "@/lib/backend/shuttle-service"
import { driverService } from "@/lib/backend/driver-service"
import { Shuttle, Driver } from "@/lib/backend/types"
import { formatDate, debounce } from "@/lib/backend/utils"

export default function AdminShuttlesPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [shuttles, setShuttles] = useState<Shuttle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [fleetStats, setFleetStats] = useState({
    totalShuttles: 0,
    activeShuttles: 0,
    maintenanceShuttles: 0,
    offlineShuttles: 0,
    utilizationRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAddShuttle, setShowAddShuttle] = useState(false)
  const [showShuttleDetails, setShowShuttleDetails] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("vehicleNumber")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Form state for adding/editing shuttle
  const [shuttleForm, setShuttleForm] = useState({
    vehicleNumber: "",
    model: "",
    capacity: "",
    driverId: "",
    currentRoute: "",
    status: "available" as Shuttle['status']
  })

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadShuttlesData()
  }, [isAdmin, router])

  const loadShuttlesData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Load data in parallel
      const [shuttlesData, driversData, statsData] = await Promise.all([
        shuttleService.getShuttles(100),
        driverService.getDrivers(100),
        shuttleService.getFleetStatistics()
      ])
      
      setShuttles(shuttlesData)
      setDrivers(driversData)
      setFleetStats(statsData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddShuttle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setFormErrors({})

    // Validate form
    const errors: Record<string, string> = {}
    
    if (!shuttleForm.vehicleNumber.trim()) {
      errors.vehicleNumber = "Vehicle number is required"
    }
    
    if (!shuttleForm.model.trim()) {
      errors.model = "Model is required"
    }
    
    if (!shuttleForm.capacity.trim()) {
      errors.capacity = "Capacity is required"
    } else if (isNaN(Number(shuttleForm.capacity)) || Number(shuttleForm.capacity) <= 0) {
      errors.capacity = "Capacity must be a positive number"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      const nextMaintenance = new Date()
      nextMaintenance.setDate(nextMaintenance.getDate() + 30) // 30 days from now

      await shuttleService.createShuttle({
        vehicleNumber: shuttleForm.vehicleNumber.trim(),
        model: shuttleForm.model.trim(),
        capacity: Number(shuttleForm.capacity),
        driverId: shuttleForm.driverId || undefined,
        currentRoute: shuttleForm.currentRoute || undefined,
        status: shuttleForm.status,
        lastMaintenance: new Date(),
        nextMaintenance
      })

      setSuccess("Shuttle added successfully!")
      setShowAddShuttle(false)
      setShuttleForm({
        vehicleNumber: "",
        model: "",
        capacity: "",
        driverId: "",
        currentRoute: "",
        status: "available"
      })
      
      // Reload data
      await loadShuttlesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteShuttle = async (shuttleId: string) => {
    if (!confirm("Are you sure you want to delete this shuttle? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await shuttleService.deleteShuttle(shuttleId)
      setSuccess("Shuttle deleted successfully!")
      await loadShuttlesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateShuttleStatus = async (shuttleId: string, status: Shuttle['status']) => {
    try {
      setIsLoading(true)
      await shuttleService.updateShuttleStatus(shuttleId, status)
      setSuccess("Shuttle status updated successfully!")
      await loadShuttlesData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditShuttle = (shuttle: Shuttle) => {
    setShuttleForm({
      vehicleNumber: shuttle.vehicleNumber,
      model: shuttle.model,
      capacity: shuttle.capacity.toString(),
      driverId: shuttle.driverId || "",
      currentRoute: shuttle.currentRoute || "",
      status: shuttle.status
    })
    setShowAddShuttle(true)
  }

  // Filter and sort shuttles
  const filteredAndSortedShuttles = shuttles
    .filter(shuttle => {
      const matchesSearch = 
        shuttle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shuttle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shuttle.currentRoute && shuttle.currentRoute.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = filterStatus === "all" || shuttle.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case "vehicleNumber":
          aValue = a.vehicleNumber.toLowerCase()
          bValue = b.vehicleNumber.toLowerCase()
          break
        case "model":
          aValue = a.model.toLowerCase()
          bValue = b.model.toLowerCase()
          break
        case "capacity":
          aValue = a.capacity
          bValue = b.capacity
          break
        case "createdAt":
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
          break
        default:
          aValue = a.vehicleNumber.toLowerCase()
          bValue = b.vehicleNumber.toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Get driver name by ID
  const getDriverName = (driverId?: string) => {
    if (!driverId) return "N/A"
    const driver = drivers.find(d => d.id === driverId)
    return driver ? driver.name : "N/A"
  }

  // Get status color
  const getStatusColor = (status: Shuttle['status']) => {
    switch (status) {
      case 'available':
        return 'default'
      case 'in_use':
        return 'default'
      case 'maintenance':
        return 'destructive'
      case 'offline':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  // Get status label
  const getStatusLabel = (status: Shuttle['status']) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'in_use':
        return 'In Use'
      case 'maintenance':
        return 'Maintenance'
      case 'offline':
        return 'Offline'
      default:
        return status
    }
  }

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value)
  }, 300)

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
              <p className="text-muted-foreground">Monitor and manage the shuttle fleet</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={loadShuttlesData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowAddShuttle(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Shuttle
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Fleet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fleetStats.totalShuttles}</div>
                <p className="text-xs text-muted-foreground">Shuttles in service</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fleetStats.activeShuttles}</div>
                <p className="text-xs text-muted-foreground">Currently operating</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fleetStats.maintenanceShuttles}</div>
                <p className="text-xs text-muted-foreground">Under maintenance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
                <Battery className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fleetStats.utilizationRate}%</div>
                <p className="text-xs text-muted-foreground">Average daily usage</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="fleet" className="space-y-4">
            <TabsList>
              <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="fleet" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Shuttle Fleet</CardTitle>
                      <CardDescription>Overview of all shuttles and their current status</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search shuttles..."
                          onChange={(e) => debouncedSearch(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      
                      {/* Filter */}
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="in_use">In Use</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Sort */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vehicleNumber">Vehicle #</SelectItem>
                          <SelectItem value="model">Model</SelectItem>
                          <SelectItem value="capacity">Capacity</SelectItem>
                          <SelectItem value="createdAt">Date Added</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }}
                      >
                        {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading shuttles...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAndSortedShuttles.length === 0 ? (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-muted-foreground">No shuttles found</p>
                        </div>
                      ) : (
                        filteredAndSortedShuttles.map((shuttle) => (
                          <Card key={shuttle.id}>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{shuttle.model}</h4>
                                    <p className="text-sm text-muted-foreground">{shuttle.vehicleNumber}</p>
                                  </div>
                                  <Badge variant={getStatusColor(shuttle.status)}>
                                    {getStatusLabel(shuttle.status)}
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Route:</span>
                                    <span className="font-medium">{shuttle.currentRoute || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Driver:</span>
                                    <span className="font-medium">{getDriverName(shuttle.driverId)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Capacity:</span>
                                    <span className="font-medium">{shuttle.capacity} passengers</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Last Maintenance:</span>
                                    <span className="font-medium">{formatDate(shuttle.lastMaintenance)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Next Maintenance:</span>
                                    <span className="font-medium">{formatDate(shuttle.nextMaintenance)}</span>
                                  </div>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => setShowShuttleDetails(shuttle.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleEditShuttle(shuttle)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteShuttle(shuttle.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                      Maintenance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shuttles
                        .filter(shuttle => shuttle.nextMaintenance <= new Date())
                        .slice(0, 5)
                        .map((shuttle) => (
                          <div key={shuttle.id} className="border-l-4 border-red-500 pl-3">
                            <p className="font-medium text-sm">{shuttle.vehicleNumber} - Maintenance Due</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {formatDate(shuttle.nextMaintenance)}
                            </p>
                          </div>
                        ))}
                      {shuttles.filter(shuttle => shuttle.nextMaintenance <= new Date()).length === 0 && (
                        <p className="text-sm text-muted-foreground">No maintenance alerts</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Maintenance Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Weekly Inspection</p>
                          <p className="text-xs text-muted-foreground">All shuttles</p>
                        </div>
                        <Badge variant="outline">Every Monday</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Monthly Service</p>
                          <p className="text-xs text-muted-foreground">Rotating schedule</p>
                        </div>
                        <Badge variant="outline">1st of month</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Annual Inspection</p>
                          <p className="text-xs text-muted-foreground">Certification required</p>
                        </div>
                        <Badge variant="outline">Yearly</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Shuttle Tracking</CardTitle>
                  <CardDescription>Real-time location and status of active shuttles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shuttles
                      .filter(shuttle => shuttle.status === 'in_use' || shuttle.status === 'available')
                      .slice(0, 5)
                      .map((shuttle) => (
                        <div key={shuttle.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{shuttle.model}</h4>
                                <Badge variant="default">{getStatusLabel(shuttle.status)}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Vehicle Number:</span>
                                  <p className="font-medium">{shuttle.vehicleNumber}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Route:</span>
                                  <p className="font-medium">{shuttle.currentRoute || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Driver:</span>
                                  <p className="font-medium">{getDriverName(shuttle.driverId)}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Capacity:</span>
                                  <p className="font-medium">{shuttle.capacity} passengers</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">{shuttle.capacity}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">max capacity</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {shuttles.filter(shuttle => shuttle.status === 'in_use' || shuttle.status === 'available').length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No active shuttles to track</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add/Edit Shuttle Modal */}
      <Dialog open={showAddShuttle} onOpenChange={setShowAddShuttle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Shuttle</DialogTitle>
            <DialogDescription>
              Create a new shuttle with all necessary details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddShuttle} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-number">Vehicle Number *</Label>
                <Input
                  id="vehicle-number"
                  placeholder="KN-1234-20"
                  value={shuttleForm.vehicleNumber}
                  onChange={(e) => setShuttleForm({ ...shuttleForm, vehicleNumber: e.target.value })}
                  className={formErrors.vehicleNumber ? "border-red-500" : ""}
                />
                {formErrors.vehicleNumber && (
                  <p className="text-xs text-red-500">{formErrors.vehicleNumber}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="Toyota Hiace"
                  value={shuttleForm.model}
                  onChange={(e) => setShuttleForm({ ...shuttleForm, model: e.target.value })}
                  className={formErrors.model ? "border-red-500" : ""}
                />
                {formErrors.model && (
                  <p className="text-xs text-red-500">{formErrors.model}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="35"
                  value={shuttleForm.capacity}
                  onChange={(e) => setShuttleForm({ ...shuttleForm, capacity: e.target.value })}
                  className={formErrors.capacity ? "border-red-500" : ""}
                />
                {formErrors.capacity && (
                  <p className="text-xs text-red-500">{formErrors.capacity}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={shuttleForm.status} onValueChange={(value: Shuttle['status']) => setShuttleForm({ ...shuttleForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <Select value={shuttleForm.driverId || "none"} onValueChange={(value) => setShuttleForm({ ...shuttleForm, driverId: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Driver</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} ({driver.driverId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select value={shuttleForm.currentRoute || "none"} onValueChange={(value) => setShuttleForm({ ...shuttleForm, currentRoute: value === "none" ? "" : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Route</SelectItem>
                    <SelectItem value="brunei-ksb">Brunei-KSB</SelectItem>
                    <SelectItem value="library-pharmacy">Library-Pharmacy</SelectItem>
                    <SelectItem value="casley-hayford">Casley Hayford</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddShuttle(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Shuttle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Shuttle Details Modal */}
      <Dialog open={!!showShuttleDetails} onOpenChange={() => setShowShuttleDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shuttle Details</DialogTitle>
            <DialogDescription>
              Detailed information about the shuttle
            </DialogDescription>
          </DialogHeader>
          {showShuttleDetails && (
            <div className="space-y-4">
              {(() => {
                const shuttle = shuttles.find(s => s.id === showShuttleDetails)
                if (!shuttle) return <p>Shuttle not found</p>
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Vehicle Number</Label>
                        <p className="text-sm">{shuttle.vehicleNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Model</Label>
                        <p className="text-sm">{shuttle.model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Capacity</Label>
                        <p className="text-sm">{shuttle.capacity} passengers</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={getStatusColor(shuttle.status)}>
                          {getStatusLabel(shuttle.status)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Driver</Label>
                        <p className="text-sm">{getDriverName(shuttle.driverId)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Route</Label>
                        <p className="text-sm">{shuttle.currentRoute || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Last Maintenance</Label>
                        <p className="text-sm">{formatDate(shuttle.lastMaintenance)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Next Maintenance</Label>
                        <p className="text-sm">{formatDate(shuttle.nextMaintenance)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm">{formatDate(shuttle.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Updated</Label>
                        <p className="text-sm">{formatDate(shuttle.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowShuttleDetails(null)
                          handleEditShuttle(shuttle)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Shuttle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newStatus = shuttle.status === 'available' ? 'maintenance' : 'available'
                          handleUpdateShuttleStatus(shuttle.id, newStatus)
                          setShowShuttleDetails(null)
                        }}
                      >
                        {shuttle.status === 'available' ? 'Send to Maintenance' : 'Mark Available'}
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
       