"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, MapPin, Clock } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to KNUST Shuttle Tracker!",
      description: "Track shuttles in real-time and never miss your ride again.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Get real-time updates on shuttle locations, set up alerts, and plan your campus commute efficiently.
          </p>
        </div>
      ),
    },
    {
      title: "Real-time Shuttle Tracking",
      description: "See exactly where shuttles are on the Brunei-KSB route.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Track 5 Key Stops:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Brunei Stand</li>
              <li>• Library Stand</li>
              <li>• Pharmacy Stand</li>
              <li>• KSB Stand</li>
              <li>• Casley Hayford Stand</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Smart Alerts",
      description: "Get notified when shuttles are approaching your location.",
      icon: <Bell className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Alert Features:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Set alerts for specific shuttle stands</li>
              <li>• Choose notification timing (2-15 minutes before)</li>
              <li>• Recurring daily alerts for your schedule</li>
              <li>• Track specific shuttles or all shuttles</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Timetable Integration",
      description: "Sync your class schedule for automatic shuttle reminders.",
      icon: <Clock className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Timetable Benefits:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Upload or manually enter your class schedule</li>
              <li>• Get automatic reminders before classes</li>
              <li>• AI-powered suggestions for optimal shuttle timing</li>
              <li>• Never be late for lectures again</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "You're All Set!",
      description: "Start tracking shuttles and make your campus commute easier.",
      icon: <Check className="h-12 w-12 text-green-600" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            You can now access the map, set up alerts, and add your timetable. Enjoy using KNUST Shuttle Tracker!
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              💡 Tip: Start by setting up an alert for your most frequently used shuttle stand.
            </p>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/map")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    router.push("/map")
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">{steps[currentStep].icon}</div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg">{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps[currentStep].content}

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep ? "bg-primary" : index < currentStep ? "bg-green-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={skipOnboarding}>
                Skip
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                <Button onClick={nextStep}>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
