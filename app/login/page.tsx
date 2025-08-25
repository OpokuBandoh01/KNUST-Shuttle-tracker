"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface FormErrors {
  studentEmail?: string
  studentPassword?: string
  driverId?: string
  driverPassword?: string
  adminEmail?: string
  adminPassword?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, adminSignIn, driverSignIn, setAsGuest, isLoading, loadCredentials, hasRememberedCredentials, clearCredentials } = useAuth()
  const [activeTab, setActiveTab] = useState("student")
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  
  // Form states
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [driverId, setDriverId] = useState("")
  const [driverPassword, setDriverPassword] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  
  // Remember me states
  const [rememberStudent, setRememberStudent] = useState(false)
  const [rememberDriver, setRememberDriver] = useState(false)

  // Password visibility states
  const [showStudentPassword, setShowStudentPassword] = useState(false)
  const [showDriverPassword, setShowDriverPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)

  // Load remembered credentials on component mount and tab change
  useEffect(() => {
    if (activeTab === "student" && hasRememberedCredentials('student')) {
      const credentials = loadCredentials('student')
      if (credentials?.email && credentials?.password) {
        setStudentEmail(credentials.email)
        setStudentPassword(credentials.password)
        setRememberStudent(true)
      }
    } else if (activeTab === "driver" && hasRememberedCredentials('driver')) {
      const credentials = loadCredentials('driver')
      if (credentials?.driverId && credentials?.password) {
        setDriverId(credentials.driverId)
        setDriverPassword(credentials.password)
        setRememberDriver(true)
      }
    }
  }, [activeTab, hasRememberedCredentials, loadCredentials])

  useEffect(() => {
    const messageParam = searchParams.get("message")
    if (messageParam) {
      setMessage(messageParam)
      setShowMessage(true)
    }
  }, [searchParams])

  // Clear message when user starts interacting with forms
  const clearMessage = () => {
    setShowMessage(false)
    setMessage("")
  }

  const validateStudentForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!studentEmail.trim()) {
      errors.studentEmail = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      errors.studentEmail = "Please enter a valid email address"
    }
    
    if (!studentPassword.trim()) {
      errors.studentPassword = "Password is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateDriverForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!driverId.trim()) {
      errors.driverId = "Driver ID is required"
    }
    
    if (!driverPassword.trim()) {
      errors.driverPassword = "Password is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateAdminForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!adminEmail.trim()) {
      errors.adminEmail = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      errors.adminEmail = "Please enter a valid email address"
    }
    
    if (!adminPassword.trim()) {
      errors.adminPassword = "Password is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setFormErrors({})
    
    if (!validateStudentForm()) {
      setIsSubmitting(false)
      return
    }
    
    try {
      await signIn(studentEmail, studentPassword, rememberStudent)
      router.push("/map")
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setFormErrors({})
    
    if (!validateDriverForm()) {
      setIsSubmitting(false)
      return
    }
    
    try {
      await driverSignIn(driverId, driverPassword, rememberDriver)
      router.push("/driver/dashboard")
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setFormErrors({})
    
    if (!validateAdminForm()) {
      setIsSubmitting(false)
      return
    }
    
    try {
      await adminSignIn(adminEmail, adminPassword)
      router.push("/admin/dashboard")
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestAccess = () => {
    setAsGuest()
    router.push("/map")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          {showMessage && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <Tabs defaultValue="student" className="w-full" onValueChange={(value) => {
            setActiveTab(value)
            clearMessage()
            
            // Clear form fields when switching tabs
            if (value === "student") {
              setDriverId("")
              setDriverPassword("")
              setRememberDriver(false)
            } else if (value === "driver") {
              setStudentEmail("")
              setStudentPassword("")
              setRememberStudent(false)
            } else if (value === "admin") {
              setStudentEmail("")
              setStudentPassword("")
              setDriverId("")
              setDriverPassword("")
              setRememberStudent(false)
              setRememberDriver(false)
            }
          }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="driver">Driver</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <div className="space-y-4">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input 
                      id="student-email" 
                      placeholder="m.example@st.knust.edu.gh" 
                      required 
                      type="email"
                      value={studentEmail}
                      onChange={(e) => {
                        setStudentEmail(e.target.value)
                        clearMessage()
                      }}
                      disabled={isSubmitting}
                    />
                    {formErrors.studentEmail && (
                      <p className="text-sm text-red-500">{formErrors.studentEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password">Password</Label>
                      <Link href="/forgot-password?type=student" className="text-sm underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id="student-password" 
                        required 
                        type={showStudentPassword ? "text" : "password"}
                        value={studentPassword}
                        onChange={(e) => {
                          setStudentPassword(e.target.value)
                          clearMessage()
                        }}
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        disabled={isSubmitting}
                      >
                        {showStudentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showStudentPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {formErrors.studentPassword && (
                      <p className="text-sm text-red-500">{formErrors.studentPassword}</p>
                    )}
                  </div>
                  
                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-student"
                        type="checkbox"
                        checked={rememberStudent}
                        onChange={(e) => {
                          setRememberStudent(e.target.checked)
                          if (!e.target.checked) {
                            // Clear saved credentials when unchecking
                            clearCredentials('student')
                            // Clear form fields to show credentials are no longer saved
                            setStudentEmail("")
                            setStudentPassword("")
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="remember-student" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                    {hasRememberedCredentials('student') && (
                      <button
                        type="button"
                        onClick={() => {
                          clearCredentials('student')
                          setStudentEmail("")
                          setStudentPassword("")
                          setRememberStudent(false)
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Clear saved
                      </button>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline">
                    Sign up
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGuestAccess}>
                  Continue as Guest
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="driver">
              <div className="space-y-4">
                <form onSubmit={handleDriverLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-id">Driver ID</Label>
                    <Input 
                      id="driver-id" 
                      placeholder="DRV-123456" 
                      required 
                      value={driverId}
                      onChange={(e) => {
                        setDriverId(e.target.value)
                        clearMessage()
                      }}
                      disabled={isSubmitting}
                    />
                    {formErrors.driverId && (
                      <p className="text-sm text-red-500">{formErrors.driverId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="driver-password" 
                        required 
                        type={showDriverPassword ? "text" : "password"}
                        value={driverPassword}
                        onChange={(e) => {
                          setDriverPassword(e.target.value)
                          clearMessage()
                        }}
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowDriverPassword(!showDriverPassword)}
                        disabled={isSubmitting}
                      >
                        {showDriverPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showDriverPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {formErrors.driverPassword && (
                      <p className="text-sm text-red-500">{formErrors.driverPassword}</p>
                    )}
                  </div>
                  
                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-driver"
                        type="checkbox"
                        checked={rememberDriver}
                        onChange={(e) => {
                          setRememberDriver(e.target.checked)
                          if (!e.target.checked) {
                            // Clear saved credentials when unchecking
                            clearCredentials('driver')
                            // Clear form fields to show credentials are no longer saved
                            setDriverId("")
                            setDriverPassword("")
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="remember-driver" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                    {hasRememberedCredentials('driver') && (
                      <button
                        type="button"
                        onClick={() => {
                          clearCredentials('driver')
                          setDriverId("")
                          setDriverPassword("")
                          setRememberDriver(false)
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Clear saved
                      </button>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="text-center text-sm">
                  <p className="text-muted-foreground">
                    Driver accounts are created by administrators.
                    <br />
                    Contact support if you need assistance.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <div className="space-y-4">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email" 
                      placeholder="admin@knust.edu.gh" 
                      required 
                      type="email"
                      value={adminEmail}
                      onChange={(e) => {
                        setAdminEmail(e.target.value)
                        clearMessage()
                      }}
                      disabled={isSubmitting}
                    />
                    {formErrors.adminEmail && (
                      <p className="text-sm text-red-500">{formErrors.adminEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Password</Label>
                      <Link href="/forgot-password?type=admin" className="text-sm underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id="admin-password" 
                        required 
                        type={showAdminPassword ? "text" : "password"}
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value)
                          clearMessage()
                        }}
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        disabled={isSubmitting}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showAdminPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {formErrors.adminPassword && (
                      <p className="text-sm text-red-500">{formErrors.adminPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Admin Login"}
                  </Button>
                </form>
                <div className="text-center text-sm">
                  <p className="text-muted-foreground">
                    Admin access is restricted to authorized personnel only.
                    <br />
                    Contact IT support for assistance.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2025 KNUST Shuttle Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
