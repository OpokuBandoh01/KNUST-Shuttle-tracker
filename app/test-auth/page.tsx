"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function TestAuthPage() {
  const { signUp, signIn } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [email, setEmail] = useState("test@knust.edu.gh")
  const [password, setPassword] = useState("123456")
  const [name, setName] = useState("Test User")

  const handleCreateAccount = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      await signUp(email, password, {
        name,
        role: "student",
        studentId: "12345678",
        department: "computer-science",
        level: "300"
      })
      setSuccess("Account created successfully! You can now sign in.")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      await signIn(email, password)
      setSuccess("Signed in successfully!")
      setTimeout(() => {
        router.push("/map")
      }, 1000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Test Authentication</h1>
          <p className="text-muted-foreground">Create and test user accounts</p>
        </div>
        
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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateAccount} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
            
            <Button 
              onClick={handleSignIn} 
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Use this page to create your first test account.</p>
          <p>After creating an account, you can sign in normally.</p>
        </div>
      </div>
    </div>
  )
} 