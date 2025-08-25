"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"

interface ShuttleInfo {
  id: number
  name: string
  route: string
  nextStop: string
  estimatedArrival: string
  capacity: string
  lastUpdated: string
}

interface ShuttleInfoModalProps {
  isOpen: boolean
  onClose: () => void
  shuttle: ShuttleInfo
}

export function ShuttleInfoModal({ isOpen, onClose, shuttle }: ShuttleInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M8 6v6" />
              <path d="M15 6v6" />
              <path d="M2 12h19.6" />
              <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="15" cy="18" r="2" />
            </svg>
            {shuttle.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Route</span>
              <Badge variant="outline" className="justify-start font-normal">
                {shuttle.route}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Capacity</span>
              <Badge
                variant={
                  shuttle.capacity === "Low" ? "outline" : shuttle.capacity === "Medium" ? "secondary" : "default"
                }
                className="justify-start font-normal"
              >
                <Users className="mr-1 h-3 w-3" />
                {shuttle.capacity}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">Next Stop</span>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{shuttle.nextStop}</span>
              <Badge variant="secondary" className="ml-auto">
                <Clock className="mr-1 h-3 w-3" />
                {shuttle.estimatedArrival}
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Last updated: {shuttle.lastUpdated}</div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Set Alert</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
