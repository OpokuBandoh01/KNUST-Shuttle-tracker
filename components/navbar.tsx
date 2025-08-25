"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Clock, 
  Info, 
  Layers, 
  MapPin, 
  Menu, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  UserPlus,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import GuestAccessModal from "@/components/guest-access-modal"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavbarProps {
  showMobileMenu?: boolean
  className?: string
}

export default function Navbar({ showMobileMenu = true, className = "" }: NavbarProps) {
  const router = useRouter()
  const { user, isAuthenticated, isStudent, isGuest, logout, setAsGuest } = useAuth()
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [restrictedFeature, setRestrictedFeature] = useState("")

  const handleGuestAccess = () => {
    setAsGuest()
    router.push("/map")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleProfileClick = () => {
    if (isGuest) {
      setRestrictedFeature("profile")
      setShowGuestModal(true)
    } else {
      router.push("/profile")
    }
  }

  const handleSettingsClick = () => {
    if (isGuest) {
      setRestrictedFeature("settings")
      setShowGuestModal(true)
    } else {
      router.push("/settings")
    }
  }

  const handleTimetableClick = () => {
    if (isGuest) {
      setRestrictedFeature("timetable")
      setShowGuestModal(true)
    } else {
      router.push("/timetable")
    }
  }

  const handleAlertsClick = () => {
    if (isGuest) {
      setRestrictedFeature("alerts")
      setShowGuestModal(true)
    } else {
      router.push("/alerts")
    }
  }

  const handleFeedbackClick = () => {
    if (isGuest) {
      setRestrictedFeature("feedback")
      setShowGuestModal(true)
    } else {
      router.push("/feedback")
    }
  }

  return (
    <header className={`px-4 h-14 flex items-center justify-between border-b bg-background z-10 ${className}`}>
      <div className="flex items-center gap-2">
        {showMobileMenu && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>KNUST Shuttle</SheetTitle>
                                 {isStudent && user?.firstName && (
                   <p className="text-sm font-medium text-foreground mt-2 px-3 py-2 bg-primary/10 rounded-md border border-primary/20 transition-all duration-300 ease-in-out hover:bg-primary/20 hover:scale-105 animate-in fade-in slide-in-from-top-2">
                     Hi, {user.firstName}! 
                   </p>
                 )}
              </SheetHeader>
                             <div className="grid gap-4 py-4">
                 <Button variant="ghost" className="justify-start" onClick={() => router.push("/map")}>
                   <MapPin className="mr-2 h-4 w-4" />
                   Map
                 </Button>
                 {isStudent ? (
                   <>
                     <Button variant="ghost" className="justify-start" onClick={() => router.push("/timetable")}>
                       <Clock className="mr-2 h-4 w-4" />
                       Timetable
                     </Button>
                     <Button variant="ghost" className="justify-start" onClick={() => router.push("/alerts")}>
                       <Bell className="mr-2 h-4 w-4" />
                       Alerts
                     </Button>
                     <Button variant="ghost" className="justify-start" onClick={() => router.push("/feedback")}>
                       <MessageSquare className="mr-2 h-4 w-4" />
                       Feedback
                     </Button>
                   </>
                 ) : isGuest ? (
                   <>
                     <Button variant="ghost" className="justify-start" onClick={handleTimetableClick}>
                       <Clock className="mr-2 h-4 w-4" />
                       Timetable
                     </Button>
                     <Button variant="ghost" className="justify-start" onClick={handleAlertsClick}>
                       <Bell className="mr-2 h-4 w-4" />
                       Alerts
                     </Button>
                     <Button variant="ghost" className="justify-start" onClick={handleFeedbackClick}>
                       <MessageSquare className="mr-2 h-4 w-4" />
                       Feedback
                     </Button>
                   </>
                 ) : null}
                {isStudent && (
                  <Button variant="ghost" className="justify-start" onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                )}
                {isGuest && (
                  <Button variant="ghost" className="justify-start" onClick={() => router.push("/register")}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                )}
                {isAuthenticated && (
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
        <Link href={isAuthenticated ? "/map" : "/"} className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-bold">KNUST Shuttle</span>
        </Link>
      </div>

             <nav className="hidden md:flex items-center gap-6">
         <Link href="/map" className="text-sm font-medium text-primary">
           Map
         </Link>
         {isStudent ? (
           <>
             <Link href="/timetable" className="text-sm font-medium text-muted-foreground hover:text-foreground">
               Timetable
             </Link>
             <Link href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
               Alerts
             </Link>
             <Link href="/feedback" className="text-sm font-medium text-muted-foreground hover:text-foreground">
               Feedback
             </Link>
           </>
         ) : isGuest ? (
           <>
             <button 
               onClick={handleTimetableClick}
               className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
             >
               Timetable
             </button>
             <button 
               onClick={handleAlertsClick}
               className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
             >
               Alerts
             </button>
             <button 
               onClick={handleFeedbackClick}
               className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
             >
               Feedback
             </button>
           </>
         ) : null}
       </nav>

      <div className="flex items-center gap-2">
        {isGuest && (
          <Badge variant="secondary" className="text-xs">
            Guest
          </Badge>
        )}
                 {isStudent && user?.firstName ? (
           <div className="px-3 py-1 text-xs font-medium text-foreground bg-primary/10 rounded-md border border-primary/20 transition-all duration-300 ease-in-out hover:bg-primary/20 hover:scale-105 animate-in fade-in slide-in-from-top-2">
             Hi, {user.firstName}!
           </div>
        ) : isStudent ? (
          <Badge variant="default" className="text-xs">
            Student
          </Badge>
        ) : null}
        
        {isAuthenticated ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleGuestAccess}>
              Continue as Guest
            </Button>
          </>
        )}
      </div>
      
      <GuestAccessModal 
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        feature={restrictedFeature}
      />
    </header>
  )
} 