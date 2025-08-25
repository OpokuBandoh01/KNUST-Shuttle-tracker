"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  MapPin, 
  Bell, 
  Settings, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react"

interface GuestAccessModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
}

export default function GuestAccessModal({ isOpen, onClose, feature }: GuestAccessModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleCreateAccount = () => {
    onClose()
    router.push("/register")
  }

  const handleContinueAsGuest = () => {
    onClose()
  }

  const getFeatureInfo = () => {
    switch (feature) {
      case "profile":
        return {
          title: "Profile Access Restricted",
          description: "Guest users cannot access profile features. Create an account to manage your profile, preferences, and personal information.",
          icon: <UserPlus className="h-8 w-8 text-blue-500" />
        }
      case "settings":
        return {
          title: "Settings Access Restricted", 
          description: "Guest users cannot access settings. Create an account to customize your experience, manage notifications, and configure preferences.",
          icon: <Settings className="h-8 w-8 text-orange-500" />
        }
      case "timetable":
        return {
          title: "Timetable Access Restricted",
          description: "Guest users cannot access timetable features. Create an account to view detailed shuttle schedules and plan your routes.",
          icon: <Clock className="h-8 w-8 text-green-500" />
        }
      case "alerts":
        return {
          title: "Alerts Access Restricted",
          description: "Guest users cannot access alert features. Create an account to set up personalized notifications and shuttle alerts.",
          icon: <Bell className="h-8 w-8 text-yellow-500" />
        }
      case "feedback":
        return {
          title: "Feedback Access Restricted",
          description: "Guest users cannot access feedback features. Create an account to submit feedback and help improve the service.",
          icon: <MessageSquare className="h-8 w-8 text-purple-500" />
        }
      default:
        return {
          title: "Feature Access Restricted",
          description: "This feature is only available to registered students. Create an account to access all features.",
          icon: <AlertCircle className="h-8 w-8 text-red-500" />
        }
    }
  }

  const featureInfo = getFeatureInfo()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {featureInfo.icon}
          </div>
          <CardTitle className="text-xl">{featureInfo.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {featureInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
                     <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm">
               <CheckCircle className="h-4 w-4 text-green-500" />
               <span>Access real-time shuttle tracking</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <XCircle className="h-4 w-4 text-red-500" />
               <span>View shuttle timetables</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <XCircle className="h-4 w-4 text-red-500" />
               <span>Send feedback</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <XCircle className="h-4 w-4 text-red-500" />
               <span>Personal profile management</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <XCircle className="h-4 w-4 text-red-500" />
               <span>Custom settings & preferences</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <XCircle className="h-4 w-4 text-red-500" />
               <span>Personalized alerts</span>
             </div>
           </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateAccount} className="flex-1">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            <Button variant="outline" onClick={handleContinueAsGuest} className="flex-1">
              Continue as Guest
            </Button>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Already have an account?{" "}
              <button 
                onClick={() => router.push("/login")}
                className="underline hover:text-primary"
              >
                Sign in
              </button>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 