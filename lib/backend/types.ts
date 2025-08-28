// Backend Types for Shuttle Tracker

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: "student" | "guest" | "driver" | "admin"
  studentId?: string
  department?: string
  level?: string
  createdAt: Date
  updatedAt: Date
}

export interface Driver {
  id: string
  driverId: string
  email: string
  name: string
  password: string
  phone?: string
  vehicleNumber?: string
  route?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  currentLocation?: {
    latitude: number
    longitude: number
    timestamp: Date
  }
  currentStatus: "available" | "on_trip" | "offline" | "maintenance"
}

export interface Admin {
  id: string
  email: string
  name: string
  role: "admin"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface Route {
  id: string
  name: string
  description: string
  routeType: "primary" | "secondary" | "express"
  startLocation: string
  endLocation: string
  waypoints: string[]
  estimatedDuration: number // in minutes
  maxCapacity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Trip {
  id: string
  driverId: string
  routeId: string
  startTime: Date
  endTime?: Date
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  passengers: number
  maxCapacity: number
  currentLocation?: {
    latitude: number
    longitude: number
    timestamp: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface Shuttle {
  id: string
  vehicleNumber: string
  model: string
  capacity: number
  driverId?: string
  currentRoute?: string
  status: "available" | "in_use" | "maintenance" | "offline"
  lastMaintenance: Date
  nextMaintenance: Date
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  type: "delay" | "maintenance" | "route_change" | "system" | "emergency"
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  targetAudience: ("all" | "students" | "drivers" | "admins")[]
  isActive: boolean
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  isRead: boolean
  createdAt: Date
  readAt?: Date
}

export interface Analytics {
  totalUsers: number
  totalDrivers: number
  totalTrips: number
  activeRoutes: number
  systemHealth: number
  dailyTrips: number
  weeklyGrowth: number
  topRoutes: Array<{
    routeId: string
    routeName: string
    tripCount: number
    averagePassengers: number
  }>
  driverPerformance: Array<{
    driverId: string
    driverName: string
    tripsCompleted: number
    averageRating: number
    onTimePercentage: number
  }>
}

export interface Stop {
  id: string
  name: string
  description: string
  routeId: string
  location: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Schedule {
  id: string
  routeId: string
  dayType: "weekday" | "weekend" | "holiday"
  startTime: string
  endTime: string
  peakFrequency: string
  offPeakFrequency: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SystemSettings {
  // General Settings
  systemName: string
  adminEmail: string
  supportPhone: string
  timezone: string
  maintenanceMode: boolean
  realTimeTracking: boolean
  autoBackup: boolean
  locationUpdateInterval: number
  
  // Service Hours
  serviceHours: {
    weekdays: {
      start: string
      end: string
      peakFrequency: string
      offPeakFrequency: string
    }
    weekends: {
      start: string
      end: string
      frequency: string
      enabled: boolean
    }
  }
  
  // Notifications
  notifications: {
    pushNotifications: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    smtpServer: string
    smtpPort: string
    senderEmail: string
    dailyReports: boolean
    alertThresholds: {
      delay: number
      capacity: number
      systemLoad: number
    }
  }
  
  // Security
  security: {
    twoFactorAuth: boolean
    passwordComplexity: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    apiRateLimiting: boolean
    rateLimit: string
    apiKey: string
    httpsOnly: boolean
    dataRetention: string
    backupRetention: string
    anonymousAnalytics: boolean
    dataEncryption: boolean
  }
  
  // Integrations
  integrations: {
    googleMapsApi: {
      enabled: boolean
      apiKey: string
    }
    firebaseCloudMessaging: {
      enabled: boolean
      serverKey: string
    }
    smsGateway: {
      enabled: boolean
      provider: string
      apiKey: string
    }
  }
  
  // Database
  database: {
    host: string
    name: string
    autoBackup: boolean
    backupTime: string
  }
  
  // System Status
  systemStatus: {
    database: 'operational' | 'degraded' | 'down'
    apiServer: 'operational' | 'degraded' | 'down'
    realTimeService: 'operational' | 'degraded' | 'down'
    pushNotifications: 'operational' | 'degraded' | 'down'
    smsService: 'operational' | 'degraded' | 'down'
    backupSystem: 'operational' | 'degraded' | 'down'
  }
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
