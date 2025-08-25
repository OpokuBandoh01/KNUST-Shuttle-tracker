"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Clock, MapPin, Menu, MessageSquare, Settings, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MainHeader() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="px-4 h-14 flex items-center justify-between border-b bg-background z-10">
      <div className="flex items-center gap-2">
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
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button variant="ghost" className="justify-start" onClick={() => router.push("/map")}>
                <MapPin className="mr-2 h-4 w-4" />
                Map
              </Button>
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
              <Button variant="ghost" className="justify-start" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-bold">KNUST Shuttle</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Map
        </Link>
        <Link href="/timetable" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Timetable
        </Link>
        <Link href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Alerts
        </Link>
        <Link href="/feedback" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Feedback
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push(isAuthenticated ? "/profile" : "/login")
          }}
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  )
}
