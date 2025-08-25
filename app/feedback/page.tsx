"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Clock, MapPin, Menu, MessageSquare, Send, Settings, Star, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function FeedbackPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [rating, setRating] = useState<number>(0)

  return (
    <div className="flex flex-col h-screen">
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
          <Link href={isAuthenticated ? "/map" : "/"} className="flex items-center gap-2">
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
          <Link href="/feedback" className="text-sm font-medium text-primary">
            Feedback
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Feedback & Complaints</h1>
            <p className="text-muted-foreground">Help us improve the shuttle service by sharing your experience</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>Your feedback helps us improve the shuttle service for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <Select>
                    <SelectTrigger id="feedback-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="bug">App Bug/Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shuttle-route">Shuttle Route (if applicable)</Label>
                  <Select>
                    <SelectTrigger id="shuttle-route">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brunei-ksb">Brunei-KSB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rate your experience</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" className="p-1" onClick={() => setRating(star)}>
                        <Star
                          className={`h-6 w-6 ${
                            rating >= star ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-message">Your Message</Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Please describe your experience or issue in detail..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email (optional)</Label>
                  <Input id="contact-email" type="email" placeholder="your.email@example.com" />
                  <p className="text-xs text-muted-foreground">
                    We'll only use this to follow up on your feedback if necessary
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              For urgent issues or emergencies, please contact the KNUST Transport Office directly at:
              <br />
              <a href="tel:+233123456789" className="text-primary hover:underline">
                +233 123 456 789
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
