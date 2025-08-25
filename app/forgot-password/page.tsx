"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "student"
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a password reset email
    setIsSubmitted(true)
  }

  const getPlaceholder = () => {
    switch (userType) {
      case "student":
        return "m.example@st.knust.edu.gh"
      case "driver":
        return "driver@knust.edu.gh"
      case "admin":
        return "admin@knust.edu.gh"
      default:
        return "email@example.com"
    }
  }

  const getTitle = () => {
    switch (userType) {
      case "student":
        return "Student Password Reset"
      case "driver":
        return "Driver Password Reset"
      case "admin":
        return "Admin Password Reset"
      default:
        return "Password Reset"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          {!isSubmitted ? (
            <>
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">{getTitle()}</h1>
                <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder={getPlaceholder()}
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </div>
              <div className="space-y-2 pt-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive an email? Check your spam folder or{" "}
                  <button className="underline" onClick={() => setIsSubmitted(false)}>
                    try again
                  </button>
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2024 KNUST Shuttle Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
