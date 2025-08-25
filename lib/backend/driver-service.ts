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
  Timestamp
} from "firebase/firestore"
import { db } from "../firebase"
import { Driver, Trip } from "./types"

export class DriverService {
  // Create a new driver
  async createDriver(driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if driver ID already exists
      const existingDriverQuery = query(
        collection(db, "drivers"), 
        where("driverId", "==", driverData.driverId)
      )
      const existingDriverSnapshot = await getDocs(existingDriverQuery)
      
      if (!existingDriverSnapshot.empty) {
        throw new Error("Driver ID already exists")
      }

      // Check if email already exists
      const existingEmailQuery = query(
        collection(db, "drivers"), 
        where("email", "==", driverData.email)
      )
      const existingEmailSnapshot = await getDocs(existingEmailQuery)
      
      if (!existingEmailSnapshot.empty) {
        throw new Error("Email already exists")
      }
      
      // Generate a unique ID for the driver
      const driverRef = doc(collection(db, "drivers"))
      const newDriver: Driver = {
        ...driverData,
        id: driverRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        currentStatus: "available"
      }
      
      await setDoc(driverRef, newDriver)
      return driverRef.id
    } catch (error: any) {
      console.error("Error creating driver:", error)
      throw new Error(error.message || "Failed to create driver")
    }
  }

  // Get all drivers with pagination
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

  // Get driver by ID
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

  // Get driver by email
  async getDriverByEmail(email: string): Promise<Driver | null> {
    try {
      const driverQuery = query(
        collection(db, "drivers"),
        where("email", "==", email)
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
      console.error("Error fetching driver by email:", error)
      throw new Error("Failed to fetch driver")
    }
  }

  // Update driver
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
    } catch (error: any) {
      console.error("Error updating driver:", error)
      throw new Error(error.message || "Failed to update driver")
    }
  }

  // Delete driver
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
    } catch (error: any) {
      console.error("Error deleting driver:", error)
      throw new Error(error.message || "Failed to delete driver")
    }
  }

  // Toggle driver status
  async toggleDriverStatus(driverId: string): Promise<void> {
    try {
      const driver = await this.getDriverById(driverId)
      if (!driver) {
        throw new Error("Driver not found")
      }

      await this.updateDriver(driverId, { isActive: !driver.isActive })
    } catch (error: any) {
      console.error("Error toggling driver status:", error)
      throw new Error(error.message || "Failed to toggle driver status")
    }
  }

  // Update driver location
  async updateDriverLocation(driverId: string, latitude: number, longitude: number): Promise<void> {
    try {
      await this.updateDriver(driverId, {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      })
    } catch (error: any) {
      console.error("Error updating driver location:", error)
      throw new Error(error.message || "Failed to update driver location")
    }
  }

  // Update driver status
  async updateDriverStatus(driverId: string, status: Driver['currentStatus']): Promise<void> {
    try {
      await this.updateDriver(driverId, { currentStatus: status })
    } catch (error: any) {
      console.error("Error updating driver status:", error)
      throw new Error(error.message || "Failed to update driver status")
    }
  }

  // Get driver trips
  async getDriverTrips(driverId: string, limitCount: number = 20): Promise<Trip[]> {
    try {
      const tripsQuery = query(
        collection(db, "trips"),
        where("driverId", "==", driverId),
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
      console.error("Error fetching driver trips:", error)
      throw new Error("Failed to fetch driver trips")
    }
  }

  // Search drivers
  async searchDrivers(searchTerm: string): Promise<Driver[]> {
    try {
      const drivers = await this.getDrivers(100) // Get more drivers for search
      
      return drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (driver.vehicleNumber && driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.route && driver.route.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    } catch (error) {
      console.error("Error searching drivers:", error)
      throw new Error("Failed to search drivers")
    }
  }

  // Get active drivers
  async getActiveDrivers(): Promise<Driver[]> {
    try {
      const driversQuery = query(
        collection(db, "drivers"),
        where("isActive", "==", true),
        where("currentStatus", "==", "available")
      )
      
      const snapshot = await getDocs(driversQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate()
      })) as Driver[]
    } catch (error) {
      console.error("Error fetching active drivers:", error)
      throw new Error("Failed to fetch active drivers")
    }
  }

  // Get drivers by route
  async getDriversByRoute(route: string): Promise<Driver[]> {
    try {
      const driversQuery = query(
        collection(db, "drivers"),
        where("route", "==", route),
        where("isActive", "==", true)
      )
      
      const snapshot = await getDocs(driversQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate()
      })) as Driver[]
    } catch (error) {
      console.error("Error fetching drivers by route:", error)
      throw new Error("Failed to fetch drivers by route")
    }
  }
}

export const driverService = new DriverService()
