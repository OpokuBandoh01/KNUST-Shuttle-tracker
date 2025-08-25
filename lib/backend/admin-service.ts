import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  writeBatch
} from "firebase/firestore"
import { db } from "../firebase"
import { 
  Driver, 
  Route, 
  Trip, 
  Shuttle, 
  Alert, 
  Analytics, 
  SystemSettings,
  User
} from "./types"

export class AdminService {
  // Driver Management
  async getDrivers(limitCount: number = 50, lastDriver?: Driver): Promise<Driver[]> {
    try {
      let driversQuery = query(
        collection(db, "drivers"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )

      if (lastDriver) {
        const lastDoc = await getDoc(doc(db, "drivers", lastDriver.id))
        driversQuery = query(
          collection(db, "drivers"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(limitCount)
        )
      }

      const snapshot = await getDocs(driversQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate()
      })) as Driver[]
    } catch (error) {
      console.error("Error fetching drivers:", error)
      throw new Error("Failed to fetch drivers")
    }
  }

  async getDriverById(driverId: string): Promise<Driver | null> {
    try {
      const driverQuery = query(
        collection(db, "drivers"),
        where("driverId", "==", driverId)
      )
      const snapshot = await getDocs(driverQuery)
      
      if (snapshot.empty) return null
      
      const driverData = snapshot.docs[0].data()
      return {
        ...driverData,
        id: snapshot.docs[0].id,
        createdAt: driverData.createdAt?.toDate() || new Date(),
        updatedAt: driverData.updatedAt?.toDate() || new Date(),
        lastLogin: driverData.lastLogin?.toDate()
      } as Driver
    } catch (error) {
      console.error("Error fetching driver:", error)
      throw new Error("Failed to fetch driver")
    }
  }

  async updateDriver(driverId: string, updates: Partial<Driver>): Promise<void> {
    try {
      const driverQuery = query(
        collection(db, "drivers"),
        where("driverId", "==", driverId)
      )
      const snapshot = await getDocs(driverQuery)
      
      if (snapshot.empty) {
        throw new Error("Driver not found")
      }

      const driverDoc = snapshot.docs[0]
      await updateDoc(doc(db, "drivers", driverDoc.id), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating driver:", error)
      throw new Error("Failed to update driver")
    }
  }

  async deleteDriver(driverId: string): Promise<void> {
    try {
      const driverQuery = query(
        collection(db, "drivers"),
        where("driverId", "==", driverId)
      )
      const snapshot = await getDocs(driverQuery)
      
      if (snapshot.empty) {
        throw new Error("Driver not found")
      }

      const driverDoc = snapshot.docs[0]
      await deleteDoc(doc(db, "drivers", driverDoc.id))
    } catch (error) {
      console.error("Error deleting driver:", error)
      throw new Error("Failed to delete driver")
    }
  }

  async toggleDriverStatus(driverId: string): Promise<void> {
    try {
      const driver = await this.getDriverById(driverId)
      if (!driver) {
        throw new Error("Driver not found")
      }

      await this.updateDriver(driverId, { isActive: !driver.isActive })
    } catch (error) {
      console.error("Error toggling driver status:", error)
      throw new Error("Failed to toggle driver status")
    }
  }

  // Route Management
  async getRoutes(): Promise<Route[]> {
    try {
      const snapshot = await getDocs(collection(db, "routes"))
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Route[]
    } catch (error) {
      console.error("Error fetching routes:", error)
      throw new Error("Failed to fetch routes")
    }
  }

  async createRoute(routeData: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const routeRef = doc(collection(db, "routes"))
      const newRoute: Route = {
        ...routeData,
        id: routeRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(routeRef, newRoute)
      return routeRef.id
    } catch (error) {
      console.error("Error creating route:", error)
      throw new Error("Failed to create route")
    }
  }

  async updateRoute(routeId: string, updates: Partial<Route>): Promise<void> {
    try {
      await updateDoc(doc(db, "routes", routeId), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating route:", error)
      throw new Error("Failed to update route")
    }
  }

  async deleteRoute(routeId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "routes", routeId))
    } catch (error) {
      console.error("Error deleting route:", error)
      throw new Error("Failed to delete route")
    }
  }

  // Trip Management
  async getTrips(limitCount: number = 50): Promise<Trip[]> {
    try {
      const tripsQuery = query(
        collection(db, "trips"),
        orderBy("startTime", "desc"),
        limit(limitCount)
      )
      const snapshot = await getDocs(tripsQuery)
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Trip[]
    } catch (error) {
      console.error("Error fetching trips:", error)
      throw new Error("Failed to fetch trips")
    }
  }

  async getTodayTrips(): Promise<Trip[]> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const tripsQuery = query(
        collection(db, "trips"),
        where("startTime", ">=", Timestamp.fromDate(today)),
        where("startTime", "<", Timestamp.fromDate(tomorrow))
      )
      
      const snapshot = await getDocs(tripsQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Trip[]
    } catch (error) {
      console.error("Error fetching today's trips:", error)
      throw new Error("Failed to fetch today's trips")
    }
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    try {
      // Get counts
      const driversSnapshot = await getDocs(collection(db, "drivers"))
      const routesSnapshot = await getDocs(collection(db, "routes"))
      const tripsSnapshot = await getDocs(collection(db, "trips"))
      const usersSnapshot = await getDocs(collection(db, "users"))
      
      const totalDrivers = driversSnapshot.size
      const activeRoutes = routesSnapshot.docs.filter(doc => doc.data().isActive).length
      const totalTrips = tripsSnapshot.size
      const totalUsers = usersSnapshot.size
      
      // Get today's trips
      const todayTrips = await this.getTodayTrips()
      const dailyTrips = todayTrips.length
      
      // Calculate weekly growth (mock data for now)
      const weeklyGrowth = 12 // This would be calculated from actual data
      
      // Get top routes
      const topRoutes = await this.getTopRoutes()
      
      // Get driver performance
      const driverPerformance = await this.getDriverPerformance()
      
      return {
        totalUsers,
        totalDrivers,
        totalTrips,
        activeRoutes,
        systemHealth: 98, // This would be calculated from system metrics
        dailyTrips,
        weeklyGrowth,
        topRoutes,
        driverPerformance
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      throw new Error("Failed to fetch analytics")
    }
  }

  private async getTopRoutes(): Promise<Analytics['topRoutes']> {
    try {
      const routesSnapshot = await getDocs(collection(db, "routes"))
      const routes = routesSnapshot.docs.map(doc => ({
        routeId: doc.id,
        routeName: doc.data().name,
        tripCount: Math.floor(Math.random() * 100) + 20, // Mock data
        averagePassengers: Math.floor(Math.random() * 15) + 5
      }))
      
      return routes
        .sort((a, b) => b.tripCount - a.tripCount)
        .slice(0, 5)
    } catch (error) {
      console.error("Error fetching top routes:", error)
      return []
    }
  }

  private async getDriverPerformance(): Promise<Analytics['driverPerformance']> {
    try {
      const driversSnapshot = await getDocs(collection(db, "drivers"))
      const drivers = driversSnapshot.docs.map(doc => ({
        driverId: doc.id,
        driverName: doc.data().name,
        tripsCompleted: Math.floor(Math.random() * 50) + 10, // Mock data
        averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        onTimePercentage: Math.floor(Math.random() * 20) + 80 // 80% - 100%
      }))
      
      return drivers
        .sort((a, b) => b.tripsCompleted - a.tripsCompleted)
        .slice(0, 5)
    } catch (error) {
      console.error("Error fetching driver performance:", error)
      return []
    }
  }

  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const settingsDoc = await getDoc(doc(db, "system", "settings"))
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data()
        return {
          ...data,
          serviceHours: {
            weekdays: {
              start: data.serviceHours?.weekdays?.start || "06:00",
              end: data.serviceHours?.weekdays?.end || "22:00",
              peakFrequency: data.serviceHours?.weekdays?.peakFrequency || "5 minutes",
              offPeakFrequency: data.serviceHours?.weekdays?.offPeakFrequency || "10 minutes"
            },
            weekends: {
              start: data.serviceHours?.weekends?.start || "08:00",
              end: data.serviceHours?.weekends?.end || "20:00",
              frequency: data.serviceHours?.weekends?.frequency || "15 minutes",
              enabled: data.serviceHours?.weekends?.enabled !== false
            }
          },
          notifications: {
            pushNotifications: data.notifications?.pushNotifications !== false,
            emailNotifications: data.notifications?.emailNotifications !== false,
            smsNotifications: data.notifications?.smsNotifications !== false,
            alertThresholds: {
              delay: data.notifications?.alertThresholds?.delay || 10,
              capacity: data.notifications?.alertThresholds?.capacity || 90,
              systemLoad: data.notifications?.alertThresholds?.systemLoad || 85
            }
          },
          security: {
            twoFactorAuth: data.security?.twoFactorAuth !== false,
            passwordComplexity: data.security?.passwordComplexity !== false,
            sessionTimeout: data.security?.sessionTimeout || 30,
            maxLoginAttempts: data.security?.maxLoginAttempts || 5,
            apiRateLimiting: data.security?.apiRateLimiting !== false,
            rateLimit: data.security?.rateLimit || "1000 requests/hour"
          }
        } as SystemSettings
      }
      
      // Return default settings if none exist
      return this.getDefaultSystemSettings()
    } catch (error) {
      console.error("Error fetching system settings:", error)
      return this.getDefaultSystemSettings()
    }
  }

  async updateSystemSettings(updates: Partial<SystemSettings>): Promise<void> {
    try {
      await updateDoc(doc(db, "system", "settings"), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating system settings:", error)
      throw new Error("Failed to update system settings")
    }
  }

  private getDefaultSystemSettings(): SystemSettings {
    return {
      maintenanceMode: false,
      realTimeTracking: true,
      autoBackup: true,
      locationUpdateInterval: 30,
      serviceHours: {
        weekdays: {
          start: "06:00",
          end: "22:00",
          peakFrequency: "5 minutes",
          offPeakFrequency: "10 minutes"
        },
        weekends: {
          start: "08:00",
          end: "20:00",
          frequency: "15 minutes",
          enabled: true
        }
      },
      notifications: {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        alertThresholds: {
          delay: 10,
          capacity: 90,
          systemLoad: 85
        }
      },
      security: {
        twoFactorAuth: true,
        passwordComplexity: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        apiRateLimiting: true,
        rateLimit: "1000 requests/hour"
      }
    }
  }

  // Alert Management
  async getAlerts(): Promise<Alert[]> {
    try {
      const alertsQuery = query(
        collection(db, "alerts"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(alertsQuery)
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Alert[]
    } catch (error) {
      console.error("Error fetching alerts:", error)
      throw new Error("Failed to fetch alerts")
    }
  }

  async createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const alertRef = doc(collection(db, "alerts"))
      const newAlert: Alert = {
        ...alertData,
        id: alertRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(alertRef, newAlert)
      return alertRef.id
    } catch (error) {
      console.error("Error creating alert:", error)
      throw new Error("Failed to create alert")
    }
  }

  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<void> {
    try {
      await updateDoc(doc(db, "alerts", alertId), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating alert:", error)
      throw new Error("Failed to update alert")
    }
  }

  async deleteAlert(alertId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "alerts", alertId))
    } catch (error) {
      console.error("Error deleting alert:", error)
      throw new Error("Failed to delete alert")
    }
  }

  // Stop Management
  async getStops(): Promise<Stop[]> {
    try {
      const stopsQuery = query(
        collection(db, "stops"),
        orderBy("order", "asc")
      )
      const snapshot = await getDocs(stopsQuery)
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Stop[]
    } catch (error) {
      console.error("Error fetching stops:", error)
      throw new Error("Failed to fetch stops")
    }
  }

  async createStop(stopData: Omit<Stop, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const stopRef = doc(collection(db, "stops"))
      const newStop: Stop = {
        ...stopData,
        id: stopRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(stopRef, newStop)
      return stopRef.id
    } catch (error) {
      console.error("Error creating stop:", error)
      throw new Error("Failed to create stop")
    }
  }

  async updateStop(stopId: string, updates: Partial<Stop>): Promise<void> {
    try {
      await updateDoc(doc(db, "stops", stopId), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating stop:", error)
      throw new Error("Failed to update stop")
    }
  }

  async deleteStop(stopId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "stops", stopId))
    } catch (error) {
      console.error("Error deleting stop:", error)
      throw new Error("Failed to delete stop")
    }
  }

  // Schedule Management
  async getSchedules(): Promise<Schedule[]> {
    try {
      const schedulesQuery = query(
        collection(db, "schedules"),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(schedulesQuery)
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Schedule[]
    } catch (error) {
      console.error("Error fetching schedules:", error)
      throw new Error("Failed to fetch schedules")
    }
  }

  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const scheduleRef = doc(collection(db, "schedules"))
      const newSchedule: Schedule = {
        ...scheduleData,
        id: scheduleRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(scheduleRef, newSchedule)
      return scheduleRef.id
    } catch (error) {
      console.error("Error creating schedule:", error)
      throw new Error("Failed to create schedule")
    }
  }

  async updateSchedule(scheduleId: string, updates: Partial<Schedule>): Promise<void> {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error("Error updating schedule:", error)
      throw new Error("Failed to update schedule")
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "schedules", scheduleId))
    } catch (error) {
      console.error("Error deleting schedule:", error)
      throw new Error("Failed to delete schedule")
    }
  }
}

export const adminService = new AdminService()
