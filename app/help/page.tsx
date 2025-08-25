"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Bell, Clock, MapPin, Menu, MessageSquare, Settings, User, Search, Phone, Mail, HelpCircle } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

export default function HelpPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const faqData = [
    {
      question: "How do I track shuttles in real-time?",
      answer:
        "Go to the Map page to see live shuttle locations. Shuttles are shown as moving icons on the map, and you can tap on them to see more details like their next stop and estimated arrival time.",
    },
    {
      question: "How do I set up shuttle alerts?",
      answer:
        "You can set up alerts by tapping on any shuttle stand on the map or going to the Alerts page. Choose which shuttle you want to track, when you want to be notified (2-15 minutes before arrival), and whether you want the alert to repeat daily.",
    },
    {
      question: "Can I add my class timetable?",
      answer:
        "Yes! Go to the Timetable page where you can either upload your academic timetable or manually add classes. The app will then suggest optimal shuttle timing based on your schedule.",
    },
    {
      question: "What shuttle stops are available?",
      answer:
        "Currently, we track the Brunei-KSB route with 5 stops: Brunei Stand, Library Stand, Pharmacy Stand, KSB Stand, and Casley Hayford Stand. The route runs in both directions.",
    },
    {
      question: "How accurate are the shuttle arrival times?",
      answer:
        "Arrival times are estimated based on real-time GPS tracking and typical travel patterns. Times may vary due to traffic, weather, or other factors. We recommend arriving at your stop a few minutes early.",
    },
    {
      question: "Can I use the app without creating an account?",
      answer:
        "Yes, you can use the app as a guest to view shuttle locations and basic information. However, creating an account allows you to set up alerts, save your timetable, and access personalized features.",
    },
    {
      question: "What should I do if a shuttle doesn't arrive as expected?",
      answer:
        "If a shuttle is significantly delayed or doesn't arrive, please report it through the Feedback page. This helps us improve the service and keep other students informed.",
    },
    {
      question: "How do I change my notification settings?",
      answer:
        "Go to Settings to customize your notification preferences. You can enable/disable push notifications, change default views, and manage other app preferences.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take privacy seriously. Your personal information is encrypted and only used to provide shuttle tracking services. See our Privacy Policy for more details.",
    },
    {
      question: "How do I report a bug or suggest a feature?",
      answer:
        "Use the Feedback page to report bugs, suggest features, or share your experience. We review all feedback and use it to improve the app.",
    },
  ]

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <Link href="/feedback" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Feedback
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Find answers to common questions and get help using the app</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Send Feedback</h3>
                  <p className="text-sm text-muted-foreground">Report issues or suggestions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Call Support</h3>
                  <p className="text-sm text-muted-foreground">+233 123 456 789</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">support@knustshuttle.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search FAQ */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search FAQ</CardTitle>
              <CardDescription>Find answers to your questions quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                {searchQuery ? `${filteredFAQ.length} results found` : "Common questions and answers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQ.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or{" "}
                    <Link href="/feedback" className="text-primary hover:underline">
                      contact support
                    </Link>{" "}
                    for help.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Getting Started Guide */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>New to KNUST Shuttle Tracker? Here's how to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">View the Map</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by exploring the map to see live shuttle locations and available stops.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Set Up Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Tap on shuttle stands to create alerts for when shuttles are approaching.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Add Your Timetable</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload or manually enter your class schedule for personalized shuttle reminders.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Customize Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust notification preferences and app settings to suit your needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
