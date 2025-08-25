"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  TrendingUp, 
  TrendingDown,
  UserCheck,
  UserX,
  Car as CarIcon,
  Route as RouteIcon
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { driverService } from "@/lib/backend/driver-service"
import { Driver } from "@/lib/backend/types"
import { formatDate, getInitials } from "@/lib/backend/utils"

export default function DriversPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [routeFilter, setRouteFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  
  // Modal States
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [showDriverDetails, setShowDriverDetails] = useState<string | null>(null)
  
  // Form States
  const [driverForm, setDriverForm] = useState({
    driverId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleNumber: "",
    route: ""
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadDrivers()
  }, [isAdmin, router])

  const loadDrivers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const driversData = await driverService.getDrivers(100)
      setDrivers(driversData)
      setFilteredDrivers(driversData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filter and sort drivers
  useEffect(() => {
    let filtered = drivers.filter(driver => {
      const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (driver.vehicleNumber && driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.route && driver.route.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && driver.isActive) ||
        (statusFilter === "inactive" && !driver.isActive)
      
      const matchesRoute = routeFilter === "all" || driver.route === routeFilter
      
      return matchesSearch && matchesStatus && matchesRoute
    })

    // Sort drivers
    filtered.sort((a, b) => {
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

    setFilteredDrivers(filtered)
  }, [drivers, searchTerm, statusFilter, routeFilter, sortBy, sortOrder])

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
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
      
      await loadDrivers()
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
      await loadDrivers()
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
      await loadDrivers()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getUniqueRoutes = () => {
    const routes = drivers.map(d => d.route).filter((route): route is string => Boolean(route))
    return [...new Set(routes)]
  }

  const getStatusCount = (status: string) => {
    switch (status) {
      case "active":
        return drivers.filter(d => d.isActive).length
      case "inactive":
        return drivers.filter(d => !d.isActive).length
      case "available":
        return drivers.filter(d => d.currentStatus === "available").length
      case "on_trip":
        return drivers.filter(d => d.currentStatus === "on_trip").length
      default:
        return 0
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600">Manage shuttle drivers and their assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadDrivers} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddDriver(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
            <div className="text-2xl font-bold text-green-600">
                  {getStatusCount("active")}
            </div>
            <p className="text-sm text-gray-600">Active Drivers</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {getStatusCount("available")}
                </div>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <CarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {getStatusCount("on_trip")}
                </div>
                <p className="text-sm text-gray-600">On Trip</p>
              </div>
              <RouteIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{drivers.length}</div>
            <p className="text-sm text-gray-600">Total Drivers</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search drivers by name, ID, email, vehicle, or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Route Filter */}
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {getUniqueRoutes().map(route => (
                  <SelectItem key={route} value={route}>{route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="driverId">ID</SelectItem>
                <SelectItem value="createdAt">Date Added</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort Order */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drivers List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading drivers...</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No drivers found matching your criteria</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
        {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(driver.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                        <Badge variant={driver.isActive ? "default" : "secondary"}>
                          {driver.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {driver.currentStatus || "available"}
                        </Badge>
                    </div>

                      <div className="grid grid-cols-1 gap-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {driver.email}
                      </div>
                        {driver.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {driver.phone}
                      </div>
                        )}
                    </div>

                      <div className="grid grid-cols-1 gap-2 mt-2 text-sm text-gray-600">
                      <div>
                          <span className="font-medium">ID:</span> {driver.driverId}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                          Joined: {formatDate(driver.createdAt)}
                      </div>
                    </div>

                      {driver.vehicleNumber && driver.route && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="font-medium">Assigned:</span>
                          <span className="ml-1">
                          {driver.vehicleNumber} on {driver.route || "No route"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowDriverDetails(driver.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleDriverStatus(driver.driverId)}>
                        {driver.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteDriver(driver.driverId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Driver
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Add Driver Modal */}
      <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Create a new driver account with all necessary details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDriver} className="space-y-6">
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Driver ID *</label>
                <Input
                  placeholder="DRV-123456"
                  value={driverForm.driverId}
                  onChange={(e) => setDriverForm({ ...driverForm, driverId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  placeholder="John Doe"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="driver@knust.edu.gh"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input
                  type="password"
                  placeholder="Enter secure password"
                  value={driverForm.password}
                  onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  placeholder="+233 123 456 789"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Number</label>
                <Input
                  placeholder="KN-1234-20"
                  value={driverForm.vehicleNumber}
                  onChange={(e) => setDriverForm({ ...driverForm, vehicleNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Route</label>
                <Select value={driverForm.route || ""} onValueChange={(value) => setDriverForm({ ...driverForm, route: value })}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Complete information about the driver
            </DialogDescription>
          </DialogHeader>
          {showDriverDetails && (
            <div className="space-y-4">
              {(() => {
                const driver = drivers.find(d => d.id === showDriverDetails)
                if (!driver) return <p>Driver not found</p>
                
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm">{driver.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Driver ID</label>
                      <p className="text-sm">{driver.driverId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{driver.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm">{driver.phone || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vehicle</label>
                      <p className="text-sm">{driver.vehicleNumber || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Route</label>
                      <p className="text-sm">{driver.route || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge variant={driver.isActive ? "default" : "secondary"}>
                        {driver.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Status</label>
                      <Badge variant="outline">{driver.currentStatus || "available"}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm">{formatDate(driver.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm">{formatDate(driver.updatedAt)}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
