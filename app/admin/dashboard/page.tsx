"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MapPin, 
  Clock, 
  BarChart3, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Filter,
  Download,
  Settings
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/backend/admin-service"
import { driverService } from "@/lib/backend/driver-service"
import { Driver, Analytics, Alert as AlertType } from "@/lib/backend/types"
import { formatDate, formatTime, getStatusColor, debounce } from "@/lib/backend/utils"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [showDriverDetails, setShowDriverDetails] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Form state for adding driver
  const [driverForm, setDriverForm] = useState({
    driverId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleNumber: "",
    route: ""
  })

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadDashboardData()
  }, [isAdmin, router])

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Load data in parallel
      const [driversData, analyticsData, alertsData] = await Promise.all([
        driverService.getDrivers(100),
        adminService.getAnalytics(),
        adminService.getAlerts()
      ])
      
      setDrivers(driversData)
      setAnalytics(analyticsData)
      setAlerts(alertsData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setFormErrors({})

    // Validate form
    const errors: Record<string, string> = {}
    
    if (!driverForm.driverId.trim()) {
      errors.driverId = "Driver ID is required"
    }
    
    if (!driverForm.name.trim()) {
      errors.name = "Full name is required"
    }
    
    if (!driverForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverForm.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!driverForm.password.trim()) {
      errors.password = "Password is required"
    } else if (driverForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      await driverService.createDriver({
        driverId: driverForm.driverId.trim(),
        name: driverForm.name.trim(),
        email: driverForm.email.trim(),
        password: driverForm.password,
        phone: driverForm.phone.trim() || undefined,
        vehicleNumber: driverForm.vehicleNumber.trim() || undefined,
        route: driverForm.route || undefined,
        isActive: true,
        currentStatus: "available"
      })

      setSuccess("Driver added successfully!")
      setShowAddDriver(false)
      setDriverForm({
        driverId: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        vehicleNumber: "",
        route: ""
      })
      
      // Reload data
      await loadDashboardData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm("Are you sure you want to delete this driver? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await driverService.deleteDriver(driverId)
      setSuccess("Driver deleted successfully!")
      await loadDashboardData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDriverStatus = async (driverId: string) => {
    try {
      setIsLoading(true)
      await driverService.toggleDriverStatus(driverId)
      setSuccess("Driver status updated successfully!")
      await loadDashboardData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDriver = (driver: Driver) => {
    setDriverForm({
      driverId: driver.driverId,
      name: driver.name,
      email: driver.email,
      password: "", // Don't show password
      phone: driver.phone || "",
      vehicleNumber: driver.vehicleNumber || "",
      route: driver.route || ""
    })
    setShowAddDriver(true)
  }

  // Filter and sort drivers
  const filteredAndSortedDrivers = drivers
    .filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (driver.vehicleNumber && driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.route && driver.route.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "active" && driver.isActive) ||
        (filterStatus === "inactive" && !driver.isActive)
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "driverId":
          aValue = a.driverId.toLowerCase()
          bValue = b.driverId.toLowerCase()
          break
        case "email":
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case "createdAt":
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage drivers and monitor system activity</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={loadDashboardData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowAddDriver(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
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

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalDrivers || drivers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {drivers.filter(d => d.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.activeRoutes || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.weeklyGrowth ? `+${analytics.weeklyGrowth} from last week` : 'Routes available'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.dailyTrips || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.weeklyGrowth ? `+${analytics.weeklyGrowth}% from yesterday` : 'Trips completed'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.systemHealth || 98}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.systemHealth === 100 ? 'All systems operational' : 'Minor issues detected'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Active Alerts
                </CardTitle>
                <CardDescription>System alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">{alert.severity}</Badge>
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                  {alerts.length > 3 && (
                    <Button variant="outline" className="w-full">
                      View All {alerts.length} Alerts
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drivers Management */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage driver accounts and permissions</CardDescription>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search drivers..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="driverId">ID</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
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
                  <p className="mt-2 text-muted-foreground">Loading drivers...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedDrivers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No drivers found</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredAndSortedDrivers.map((driver) => (
                        <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {driver.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{driver.name}</h3>
                              <p className="text-sm text-muted-foreground">{driver.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">ID: {driver.driverId}</p>
                                {driver.vehicleNumber && (
                                  <p className="text-xs text-muted-foreground">• {driver.vehicleNumber}</p>
                                )}
                                {driver.route && (
                                  <p className="text-xs text-muted-foreground">• {driver.route}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={driver.isActive ? "default" : "secondary"}>
                              {driver.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {driver.currentStatus || "available"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDriverDetails(driver.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleDriverStatus(driver.driverId)}
                            >
                              {driver.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDriver(driver.driverId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add/Edit Driver Modal */}
      <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Create a new driver account with all necessary details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDriver} className="space-y-6">
            {/* Required Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver-id">Driver ID *</Label>
                <Input
                  id="driver-id"
                  placeholder="DRV-123456"
                  value={driverForm.driverId}
                  onChange={(e) => setDriverForm({ ...driverForm, driverId: e.target.value })}
                  className={formErrors.driverId ? "border-red-500" : ""}
                />
                {formErrors.driverId && (
                  <p className="text-xs text-red-500">{formErrors.driverId}</p>
                )}
                <p className="text-xs text-muted-foreground">Used for driver login</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driver-name">Full Name *</Label>
                <Input
                  id="driver-name"
                  placeholder="John Doe"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driver-email">Email Address *</Label>
                <Input
                  id="driver-email"
                  type="email"
                  placeholder="driver@knust.edu.gh"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">{formErrors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">Firebase authentication</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driver-password">Password *</Label>
                <Input
                  id="driver-password"
                  type="password"
                  placeholder="Enter secure password"
                  value={driverForm.password}
                  onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">Min 6 characters</p>
              </div>
            </div>

            {/* Optional Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver-phone">Phone Number</Label>
                <Input
                  id="driver-phone"
                  placeholder="+233 123 456 789"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                <Input
                  id="vehicle-number"
                  placeholder="KN-1234-20"
                  value={driverForm.vehicleNumber}
                  onChange={(e) => setDriverForm({ ...driverForm, vehicleNumber: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select value={driverForm.route} onValueChange={(value) => setDriverForm({ ...driverForm, route: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brunei-ksb">Brunei-KSB</SelectItem>
                    <SelectItem value="library-pharmacy">Library-Pharmacy</SelectItem>
                    <SelectItem value="casley-hayford">Casley Hayford</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddDriver(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Driver"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Driver Details Modal */}
      <Dialog open={!!showDriverDetails} onOpenChange={() => setShowDriverDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Detailed information about the driver
            </DialogDescription>
          </DialogHeader>
          {showDriverDetails && (
            <div className="space-y-4">
              {(() => {
                const driver = drivers.find(d => d.id === showDriverDetails)
                if (!driver) return <p>Driver not found</p>
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm">{driver.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Driver ID</Label>
                        <p className="text-sm">{driver.driverId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{driver.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm">{driver.phone || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Vehicle</Label>
                        <p className="text-sm">{driver.vehicleNumber || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Route</Label>
                        <p className="text-sm">{driver.route || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={driver.isActive ? "default" : "secondary"}>
                          {driver.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Current Status</Label>
                        <Badge variant="outline">{driver.currentStatus || "available"}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm">{formatDate(driver.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Updated</Label>
                        <p className="text-sm">{formatDate(driver.updatedAt)}</p>
                      </div>
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
