"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, Clock } from "lucide-react"

interface ShuttleInfo {
  id: number
  name: string
  estimatedArrival: string
}

interface StandInfo {
  id: number
  name: string
  shuttles: ShuttleInfo[]
}

interface AlertSetupModalProps {
  isOpen: boolean
  onClose: () => void
  stand: StandInfo
}

export function AlertSetupModal({ isOpen, onClose, stand }: AlertSetupModalProps) {
  const [selectedShuttle, setSelectedShuttle] = useState<string>("all")
  const [notifyBefore, setNotifyBefore] = useState<string>("5")
  const [repeatDaily, setRepeatDaily] = useState<boolean>(false)

  const handleSaveAlert = () => {
    // In a real app, this would save the alert to the backend
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Set Alert for {stand.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Select Shuttle</Label>
            <RadioGroup value={selectedShuttle} onValueChange={setSelectedShuttle}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Shuttles</Label>
              </div>
              {stand.shuttles.map((shuttle) => (
                <div key={shuttle.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={shuttle.id.toString()} id={`shuttle-${shuttle.id}`} />
                  <Label htmlFor={`shuttle-${shuttle.id}`} className="flex items-center justify-between w-full">
                    <span>{shuttle.name}</span>
                    <span className="text-xs text-muted-foreground">ETA: {shuttle.estimatedArrival}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notify-before">Notify me before arrival</Label>
            <Select value={notifyBefore} onValueChange={setNotifyBefore}>
              <SelectTrigger id="notify-before">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 minutes before</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="10">10 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="repeat-daily" checked={repeatDaily} onCheckedChange={setRepeatDaily} />
            <Label htmlFor="repeat-daily">Repeat daily at this time</Label>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <div>
                You&apos;ll receive a notification when the shuttle is about to arrive at {stand.name}.
                {repeatDaily && " This alert will repeat every day at the same time."}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveAlert}>Save Alert</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
