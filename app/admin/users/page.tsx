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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserCheck, 
  Plus, 
  Edit, 
  Search, 
  Shield, 
  GraduationCap, 
  Car, 
  MoreHorizontal, 
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { userService } from "@/lib/backend/user-service"
import { driverService } from "@/lib/backend/driver-service"
import { User, Driver } from "@/lib/backend/types"
import { formatDate, debounce } from "@/lib/backend/utils"

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    students: 0,
    drivers: 0,
    admins: 0,
    guests: 0,
    newThisWeek: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAddUser, setShowAddUser] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("students")

  // Form state for adding/editing user
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "student" as User['role'],
    studentId: "",
    department: "",
    level: ""
  })

  // Update form role when active tab changes
  useEffect(() => {
    if (activeTab === "students") {
      setUserForm(prev => ({ ...prev, role: "student" }))
    } else if (activeTab === "drivers") {
      setUserForm(prev => ({ ...prev, role: "driver" }))
    } else if (activeTab === "admins") {
      setUserForm(prev => ({ ...prev, role: "admin" }))
    }
  }, [activeTab])

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadUsersData()
  }, [isAdmin, router])

  const loadUsersData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      
      console.log("Loading users data...")
      
      // Load data in parallel
      const [usersData, driversData, statsData] = await Promise.all([
        userService.getUsers(100),
        driverService.getDrivers(100),
        userService.getUserStatistics()
      ])
      
      console.log("Users data:", usersData)
      console.log("Drivers data:", driversData)
      console.log("Stats data:", statsData)
      
      setUsers(usersData)
      setDrivers(driversData)
      setUserStats(statsData)
    } catch (error: any) {
      console.error("Error loading users data:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    setFormErrors({})

    // Validate form based on user type
    const errors: Record<string, string> = {}
    
    if (!userForm.name.trim()) {
      errors.name = "Full name is required"
    }
    
    if (!userForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (userForm.role === "student" && !userForm.studentId.trim()) {
      errors.studentId = "Student ID is required for students"
    }

    if (userForm.role === "driver" && !userForm.studentId.trim()) {
      errors.studentId = "Driver ID is required for drivers"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      if (userForm.role === "driver") {
        // Create driver using driver service
        await driverService.createDriver({
          driverId: userForm.studentId.trim(), // Using studentId field for driverId
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          password: "temporary123", // Temporary password, should be changed
          phone: userForm.department.trim() || undefined, // Using department field for phone
          vehicleNumber: userForm.level.trim() || undefined, // Using level field for vehicleNumber
          route: userForm.firstName.trim() || undefined, // Using firstName field for route
          isActive: true,
          currentStatus: "available"
        })
        setSuccess("Driver added successfully!")
      } else {
        // Create other users using user service
        await userService.createUser({
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          firstName: userForm.firstName.trim() || undefined,
          lastName: userForm.lastName.trim() || undefined,
          role: userForm.role,
          studentId: userForm.studentId.trim() || undefined,
          department: userForm.department.trim() || undefined,
          level: userForm.level.trim() || undefined
        })
        setSuccess("User added successfully!")
      }

      setShowAddUser(false)
      setUserForm({
        name: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "student",
        studentId: "",
        department: "",
        level: ""
      })
      
      // Reload data
      await loadUsersData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await userService.deleteUser(userId)
      setSuccess("User deleted successfully!")
      await loadUsersData()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setUserForm({
      name: user.name,
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role,
      studentId: user.studentId || "",
      department: user.department || "",
      level: user.level || ""
    })
    setShowAddUser(true)
  }

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.level && user.level.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesRole = filterRole === "all" || user.role === filterRole
      
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "email":
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case "role":
          aValue = a.role.toLowerCase()
          bValue = b.role.toLowerCase()
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

  // Get users by role for tabs
  const getUsersByRole = (role: User['role']) => {
    return filteredAndSortedUsers.filter(user => user.role === role)
  }

  // Get driver info for user
  const getDriverInfo = (user: User) => {
    if (user.role !== 'driver') return null
    return drivers.find(d => d.email === user.email)
  }

  // Get role color
  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'student':
        return 'default'
      case 'driver':
        return 'secondary'
      case 'admin':
        return 'destructive'
      case 'guest':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // Get role icon
  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-3 w-3" />
      case 'driver':
        return <Car className="h-3 w-3" />
      case 'admin':
        return <Shield className="h-3 w-3" />
      case 'guest':
        return <Users className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
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
              <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">Manage students, drivers, and administrators</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={loadUsersData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New User
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

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{userStats.newThisWeek} this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.students}</div>
                <p className="text-xs text-muted-foreground">Currently enrolled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.drivers}</div>
                <p className="text-xs text-muted-foreground">On duty today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.admins}</div>
                <p className="text-xs text-muted-foreground">System admins</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="admins">Administrators</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Student Users</CardTitle>
                      <CardDescription>Manage student accounts and permissions</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search students..."
                          onChange={(e) => debouncedSearch(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      
                      {/* Filter */}
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="student">Students</SelectItem>
                          <SelectItem value="driver">Drivers</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                          <SelectItem value="guest">Guests</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Sort */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="role">Role</SelectItem>
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
                      <p className="mt-2 text-muted-foreground">Loading students...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUsersByRole('student').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No students found</p>
                        </div>
                      ) : (
                        getUsersByRole('student').map((student) => (
                          <div key={student.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{student.name}</h4>
                                    <Badge variant="default">
                                      <GraduationCap className="h-3 w-3 mr-1" />
                                      Student
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                    {student.studentId && <span>ID: {student.studentId}</span>}
                                    {student.department && <span>{student.department}</span>}
                                    {student.level && <span>{student.level}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">
                                  <p className="text-xs text-muted-foreground">Joined</p>
                                  <p className="font-medium">{formatDate(student.createdAt)}</p>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowUserDetails(student.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditUser(student)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteUser(student.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage driver accounts and certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading drivers...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUsersByRole('driver').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No drivers found</p>
                        </div>
                      ) : (
                        getUsersByRole('driver').map((user) => {
                          const driverInfo = getDriverInfo(user)
                          return (
                            <div key={user.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-medium">{user.name}</h4>
                                      <Badge variant="secondary">
                                        <Car className="h-3 w-3 mr-1" />
                                        Driver
                                      </Badge>
                                      {driverInfo && (
                                        <Badge variant={driverInfo.isActive ? "default" : "secondary"}>
                                          {driverInfo.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                      {driverInfo && <span>ID: {driverInfo.driverId}</span>}
                                      {driverInfo?.phone && <span>Phone: {driverInfo.phone}</span>}
                                      {driverInfo?.vehicleNumber && <span>Vehicle: {driverInfo.vehicleNumber}</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className="font-medium">{driverInfo?.currentStatus || "Unknown"}</p>
                                  </div>
                                  <div className="flex space-x-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setShowUserDetails(user.id)}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Accounts</CardTitle>
                  <CardDescription>Manage system administrators and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading administrators...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUsersByRole('admin').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No administrators found</p>
                        </div>
                      ) : (
                        getUsersByRole('admin').map((admin) => (
                          <div key={admin.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                  <AvatarFallback>
                                    {admin.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{admin.name}</h4>
                                    <Badge variant="destructive">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Administrator
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                    {admin.department && <span>{admin.department}</span>}
                                    <span>Joined: {formatDate(admin.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">
                                  <p className="text-xs text-muted-foreground">Last Updated</p>
                                  <p className="font-medium">{formatDate(admin.updatedAt)}</p>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowUserDetails(admin.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditUser(admin)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteUser(admin.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add/Edit User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "students" ? "Add New Student" : 
               activeTab === "drivers" ? "Add New Driver" : 
               activeTab === "admins" ? "Add New Administrator" : 
               "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "students" ? "Create a new student account with appropriate permissions" :
               activeTab === "drivers" ? "Create a new driver account with vehicle and route assignments" :
               activeTab === "admins" ? "Create a new administrator account with system access" :
               "Create a new user account with appropriate role and permissions"}
            </DialogDescription>
          </DialogHeader>
          
          {activeTab === "students" && (
            <form onSubmit={handleAddUser} className="space-y-6">
              {/* Required Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID *</Label>
                  <Input
                    id="student-id"
                    placeholder="20210001"
                    value={userForm.studentId}
                    onChange={(e) => setUserForm({ ...userForm, studentId: e.target.value })}
                    className={formErrors.studentId ? "border-red-500" : ""}
                  />
                  {formErrors.studentId && (
                    <p className="text-xs text-red-500">{formErrors.studentId}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Used for student login</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name *</Label>
                  <Input
                    id="student-name"
                    placeholder="John Doe"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email Address *</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@knust.edu.gh"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Firebase authentication</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-level">Level *</Label>
                  <Select value={userForm.level || "none"} onValueChange={(value) => setUserForm({ ...userForm, level: value === "none" ? "" : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="5th Year">5th Year</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-department">Department</Label>
                  <Input
                    id="student-department"
                    placeholder="Computer Engineering"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-firstname">First Name</Label>
                  <Input
                    id="student-firstname"
                    placeholder="John"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Student"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "drivers" && (
            <form onSubmit={handleAddUser} className="space-y-6">
              {/* Required Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver-id">Driver ID *</Label>
                  <Input
                    id="driver-id"
                    placeholder="DRV-123456"
                    value={userForm.studentId} // Reusing studentId field for driverId
                    onChange={(e) => setUserForm({ ...userForm, studentId: e.target.value })}
                    className={formErrors.studentId ? "border-red-500" : ""}
                  />
                  {formErrors.studentId && (
                    <p className="text-xs text-red-500">{formErrors.studentId}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Used for driver login</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driver-name">Full Name *</Label>
                  <Input
                    id="driver-name"
                    placeholder="John Doe"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
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
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Firebase authentication</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driver-phone">Phone Number</Label>
                  <Input
                    id="driver-phone"
                    placeholder="+233 123 456 789"
                    value={userForm.department} // Reusing department field for phone
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  />
                </div>
              </div>

              {/* Optional Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-number">Vehicle Number</Label>
                  <Input
                    id="vehicle-number"
                    placeholder="KN-1234-20"
                    value={userForm.level} // Reusing level field for vehicleNumber
                    onChange={(e) => setUserForm({ ...userForm, level: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Select value={userForm.firstName || "none"} onValueChange={(value) => setUserForm({ ...userForm, firstName: value === "none" ? "" : value })}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="driver-firstname">First Name</Label>
                  <Input
                    id="driver-firstname"
                    placeholder="John"
                    value={userForm.lastName} // Reusing lastName field for firstName
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Driver"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "admins" && (
            <form onSubmit={handleAddUser} className="space-y-6">
              {/* Required Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input
                    id="admin-name"
                    placeholder="John Doe"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Address *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@knust.edu.gh"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Firebase authentication</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-department">Department</Label>
                  <Input
                    id="admin-department"
                    placeholder="Transport Services"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  />
                </div>
              </div>

              {/* Optional Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-firstname">First Name</Label>
                  <Input
                    id="admin-firstname"
                    placeholder="John"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-lastname">Last Name</Label>
                  <Input
                    id="admin-lastname"
                    placeholder="Doe"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Administrator"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={!!showUserDetails} onOpenChange={() => setShowUserDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>
          {showUserDetails && (
            <div className="space-y-4">
              {(() => {
                const user = users.find(u => u.id === showUserDetails)
                if (!user) return <p>User not found</p>
                
                const driverInfo = getDriverInfo(user)
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm">{user.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Role</Label>
                        <Badge variant={getRoleColor(user.role)}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Student ID</Label>
                        <p className="text-sm">{user.studentId || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Department</Label>
                        <p className="text-sm">{user.department || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Level</Label>
                        <p className="text-sm">{user.level || "N/A"}</p>
                      </div>
                    </div>
                    
                    {driverInfo && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Driver Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Driver ID</Label>
                            <p className="text-sm">{driverInfo.driverId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Badge variant={driverInfo.isActive ? "default" : "secondary"}>
                              {driverInfo.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Current Status</Label>
                            <p className="text-sm">{driverInfo.currentStatus || "Unknown"}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Vehicle</Label>
                            <p className="text-sm">{driverInfo.vehicleNumber || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm">{formatDate(user.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Updated</Label>
                        <p className="text-sm">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowUserDetails(null)
                          handleEditUser(user)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDeleteUser(user.id)
                          setShowUserDetails(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
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
   