"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Wrench, Clock, Mail, RefreshCw } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="mx-auto bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <Wrench className="h-10 w-10 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Under Maintenance</h1>
              <p className="text-muted-foreground">
                We're currently performing scheduled maintenance to improve your experience. The service will be back
                online shortly.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Maintenance Window
                </CardTitle>
                <CardDescription>Expected duration and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Started:</span>
                  <span className="text-sm text-muted-foreground">2:00 AM GMT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Expected End:</span>
                  <span className="text-sm text-muted-foreground">4:00 AM GMT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm text-muted-foreground">~2 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  What We're Improving
                </CardTitle>
                <CardDescription>Updates being implemented</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Enhanced real-time tracking accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Improved notification system</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Database performance optimizations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Security updates and bug fixes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Emergency Shuttle Information</h3>
              <p className="text-sm text-blue-700">
                During maintenance, please contact the KNUST Transport Office directly for urgent shuttle information:
              </p>
              <p className="text-sm font-medium text-blue-900 mt-1">📞 +233 123 456 789</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Status
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@knustshuttle.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                We apologize for any inconvenience. Follow us on social media for real-time updates on the maintenance
                progress.
              </p>
            </div>
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
