"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  studentId?: string
  department?: string
  level?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  
  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [department, setDepartment] = useState("")
  const [level, setLevel] = useState("")

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!firstName.trim()) {
      errors.firstName = "First name is required"
    }
    if (!lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!studentId.trim()) {
      errors.studentId = "Student ID is required"
    } else if (!/^\d{8}$/.test(studentId)) {
      errors.studentId = "Student ID must be 8 digits"
    }

    if (!department) {
      errors.department = "Department is required"
    }

    if (!level) {
      errors.level = "Level is required"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setFormErrors({})

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      await signUp(email, password, {
        firstName,
        lastName,
        role: "student",
        studentId,
        department,
        level
      })
      
      // Show success message instead of redirecting
      setIsSuccess(true)
      setIsSubmitting(false)
      
      // Clear form
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setFirstName("")
      setLastName("")
      setStudentId("")
      setDepartment("")
      setLevel("")
      
    } catch (error: any) {
      setError(error.message || "Failed to create account")
      setIsSubmitting(false)
    }
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  // Show success message if account was created
  if (isSuccess) {
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
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-3xl font-bold">Account Created!</h1>
              <p className="text-muted-foreground">
                Your account has been successfully created. You can now sign in with your email and password.
              </p>
            </div>
            <Button onClick={handleGoToLogin} className="w-full">
              Go to Sign In
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Back to Home
              </Link>
            </div>
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
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Enter your details to get started</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input 
                  id="first-name" 
                  placeholder="John" 
                  required 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSubmitting}
                />
                {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input 
                  id="last-name" 
                  placeholder="Doe" 
                  required 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSubmitting}
                />
                {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="m.example@st.knust.edu.gh" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID</Label>
              <Input 
                id="student-id" 
                placeholder="12345678" 
                required 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.studentId && <p className="text-sm text-red-500">{formErrors.studentId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                  <SelectItem value="chemical-engineering">Chemical Engineering</SelectItem>
                  <SelectItem value="materials-engineering">Materials Engineering</SelectItem>
                  <SelectItem value="agricultural-engineering">Agricultural Engineering</SelectItem>
                  <SelectItem value="biomedical-engineering">Biomedical Engineering</SelectItem>
                  <SelectItem value="petroleum-engineering">Petroleum Engineering</SelectItem>
                  <SelectItem value="geomatic-engineering">Geomatic Engineering</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.department && <p className="text-sm text-red-500">{formErrors.department}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={level} onValueChange={setLevel} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Level 100</SelectItem>
                  <SelectItem value="200">Level 200</SelectItem>
                  <SelectItem value="300">Level 300</SelectItem>
                  <SelectItem value="400">Level 400</SelectItem>
                  <SelectItem value="500">Level 500</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.level && <p className="text-sm text-red-500">{formErrors.level}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                required 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
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
