import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Bus, Clock, Bell } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About KNUST Shuttle Tracker
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Making campus transportation efficient, reliable, and accessible for everyone
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-12 mt-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                  KNUST Shuttle Tracker was developed to solve the common transportation challenges faced by students
                  and staff at Kwame Nkrumah University of Science and Technology. Our mission is to provide a reliable,
                  efficient, and user-friendly shuttle tracking system that helps the KNUST community navigate the
                  campus with ease.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">The Problem We're Solving</h2>
                <p className="text-muted-foreground">
                  Campus transportation can be unpredictable, leading to missed classes, wasted time waiting at shuttle
                  stops, and overall frustration. Students often struggle with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Uncertainty about shuttle arrival times</li>
                  <li>Missing shuttles and being late for classes</li>
                  <li>Overcrowded shuttles during peak hours</li>
                  <li>Lack of coordination between class schedules and shuttle timings</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Solution</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Real-time Tracking</h3>
                    <p className="text-center text-muted-foreground">
                      GPS-enabled tracking shows you exactly where each shuttle is on campus
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Smart Alerts</h3>
                    <p className="text-center text-muted-foreground">
                      Get notified when shuttles approach your location or favorite stops
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Timetable Integration</h3>
                    <p className="text-center text-muted-foreground">
                      Sync with your class schedule for timely reminders and optimal planning
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Team</h2>
                <p className="text-muted-foreground">
                  KNUST Shuttle Tracker was developed by a dedicated team of student developers and faculty advisors
                  from the Computer Science and Engineering departments at KNUST. Our team combines technical expertise
                  with a deep understanding of campus life to create a solution that truly addresses the needs of our
                  community.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Future Plans</h2>
                <p className="text-muted-foreground">
                  We're continuously working to improve the KNUST Shuttle Tracker with new features and enhancements:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Expanding to cover more routes across campus</li>
                  <li>Implementing predictive arrival times using machine learning</li>
                  <li>Adding capacity monitoring to show how crowded each shuttle is</li>
                  <li>Developing a feedback system for continuous service improvement</li>
                  <li>Creating a community feature for ride sharing and carpooling</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/map">
                <Button size="lg">
                  <Bus className="mr-2 h-5 w-5" />
                  Try the Shuttle Tracker
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2024 KNUST Shuttle Tracker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
