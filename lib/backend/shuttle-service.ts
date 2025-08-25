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
import { Shuttle } from "./types"

export class ShuttleService {
  // Create a new shuttle
  async createShuttle(shuttleData: Omit<Shuttle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if vehicle number already exists
      const existingShuttleQuery = query(
        collection(db, "shuttles"), 
        where("vehicleNumber", "==", shuttleData.vehicleNumber)
      )
      const existingShuttleSnapshot = await getDocs(existingShuttleQuery)
      
      if (!existingShuttleSnapshot.empty) {
        throw new Error("Vehicle number already exists")
      }
      
      // Generate a unique ID for the shuttle
      const shuttleRef = doc(collection(db, "shuttles"))
      const newShuttle: Shuttle = {
        ...shuttleData,
        id: shuttleRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(shuttleRef, newShuttle)
      return shuttleRef.id
    } catch (error: any) {
      console.error("Error creating shuttle:", error)
      throw new Error(error.message || "Failed to create shuttle")
    }
  }

  // Get all shuttles with pagination
  async getShuttles(limitCount: number = 50, lastShuttle?: Shuttle): Promise<Shuttle[]> {
    try {
      let shuttlesQuery = query(
        collection(db, "shuttles"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )

      if (lastShuttle) {
        const lastDoc = await getDoc(doc(db, "shuttles", lastShuttle.id))
        shuttlesQuery = query(
          collection(db, "shuttles"),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        )
      }

      const snapshot = await getDocs(shuttlesQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastMaintenance: doc.data().lastMaintenance?.toDate() || new Date(),
        nextMaintenance: doc.data().nextMaintenance?.toDate() || new Date()
      })) as Shuttle[]
    } catch (error) {
      console.error("Error fetching shuttles:", error)
      throw new Error("Failed to fetch shuttles")
    }
  }

  // Get shuttle by ID
  async getShuttleById(shuttleId: string): Promise<Shuttle | null> {
    try {
      const shuttleDoc = await getDoc(doc(db, "shuttles", shuttleId))
      
      if (!shuttleDoc.exists()) {
        return null
      }
      
      const data = shuttleDoc.data()
      return {
        ...data,
        id: shuttleDoc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastMaintenance: data.lastMaintenance?.toDate() || new Date(),
        nextMaintenance: data.nextMaintenance?.toDate() || new Date()
      } as Shuttle
    } catch (error) {
      console.error("Error fetching shuttle:", error)
      throw new Error("Failed to fetch shuttle")
    }
  }

  // Get shuttle by vehicle number
  async getShuttleByVehicleNumber(vehicleNumber: string): Promise<Shuttle | null> {
    try {
      const shuttleQuery = query(
        collection(db, "shuttles"),
        where("vehicleNumber", "==", vehicleNumber)
      )
      const snapshot = await getDocs(shuttleQuery)
      
      if (snapshot.empty) {
        return null
      }
      
      const doc = snapshot.docs[0]
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastMaintenance: data.lastMaintenance?.toDate() || new Date(),
        nextMaintenance: data.nextMaintenance?.toDate() || new Date()
      } as Shuttle
    } catch (error) {
      console.error("Error fetching shuttle by vehicle number:", error)
      throw new Error("Failed to fetch shuttle")
    }
  }

  // Update shuttle
  async updateShuttle(shuttleId: string, updateData: Partial<Omit<Shuttle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const shuttleRef = doc(db, "shuttles", shuttleId)
      const shuttleDoc = await getDoc(shuttleRef)
      
      if (!shuttleDoc.exists()) {
        throw new Error("Shuttle not found")
      }
      
      await updateDoc(shuttleRef, {
        ...updateData,
        updatedAt: new Date()
      })
    } catch (error: any) {
      console.error("Error updating shuttle:", error)
      throw new Error(error.message || "Failed to update shuttle")
    }
  }

  // Delete shuttle
  async deleteShuttle(shuttleId: string): Promise<void> {
    try {
      const shuttleRef = doc(db, "shuttles", shuttleId)
      const shuttleDoc = await getDoc(shuttleRef)
      
      if (!shuttleDoc.exists()) {
        throw new Error("Shuttle not found")
      }
      
      await deleteDoc(shuttleRef)
    } catch (error: any) {
      console.error("Error deleting shuttle:", error)
      throw new Error(error.message || "Failed to delete shuttle")
    }
  }

  // Get shuttles by status
  async getShuttlesByStatus(status: Shuttle['status']): Promise<Shuttle[]> {
    try {
      const shuttlesQuery = query(
        collection(db, "shuttles"),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )
      
      const snapshot = await getDocs(shuttlesQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastMaintenance: doc.data().lastMaintenance?.toDate() || new Date(),
        nextMaintenance: doc.data().nextMaintenance?.toDate() || new Date()
      })) as Shuttle[]
    } catch (error) {
      console.error("Error fetching shuttles by status:", error)
      throw new Error("Failed to fetch shuttles")
    }
  }

  // Get shuttles by route
  async getShuttlesByRoute(route: string): Promise<Shuttle[]> {
    try {
      const shuttlesQuery = query(
        collection(db, "shuttles"),
        where("currentRoute", "==", route),
        orderBy("createdAt", "desc")
      )
      
      const snapshot = await getDocs(shuttlesQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastMaintenance: doc.data().lastMaintenance?.toDate() || new Date(),
        nextMaintenance: doc.data().nextMaintenance?.toDate() || new Date()
      })) as Shuttle[]
    } catch (error) {
      console.error("Error fetching shuttles by route:", error)
      throw new Error("Failed to fetch shuttles")
    }
  }

  // Assign driver to shuttle
  async assignDriverToShuttle(shuttleId: string, driverId: string): Promise<void> {
    try {
      const shuttleRef = doc(db, "shuttles", shuttleId)
      const shuttleDoc = await getDoc(shuttleRef)
      
      if (!shuttleDoc.exists()) {
        throw new Error("Shuttle not found")
      }
      
      await updateDoc(shuttleRef, {
        driverId,
        updatedAt: new Date()
      })
    } catch (error: any) {
      console.error("Error assigning driver to shuttle:", error)
      throw new Error(error.message || "Failed to assign driver")
    }
  }

  // Update shuttle status
  async updateShuttleStatus(shuttleId: string, status: Shuttle['status']): Promise<void> {
    try {
      const shuttleRef = doc(db, "shuttles", shuttleId)
      const shuttleDoc = await getDoc(shuttleRef)
      
      if (!shuttleDoc.exists()) {
        throw new Error("Shuttle not found")
      }
      
      await updateDoc(shuttleRef, {
        status,
        updatedAt: new Date()
      })
    } catch (error: any) {
      console.error("Error updating shuttle status:", error)
      throw new Error(error.message || "Failed to update shuttle status")
    }
  }

  // Get maintenance due shuttles
  async getMaintenanceDueShuttles(): Promise<Shuttle[]> {
    try {
      const today = new Date()
      const shuttlesQuery = query(
        collection(db, "shuttles"),
        where("nextMaintenance", "<=", today),
        orderBy("nextMaintenance", "asc")
      )
      
      const snapshot = await getDocs(shuttlesQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastMaintenance: doc.data().lastMaintenance?.toDate() || new Date(),
        nextMaintenance: doc.data().nextMaintenance?.toDate() || new Date()
      })) as Shuttle[]
    } catch (error) {
      console.error("Error fetching maintenance due shuttles:", error)
      throw new Error("Failed to fetch maintenance due shuttles")
    }
  }

  // Update maintenance dates
  async updateMaintenanceDates(shuttleId: string, lastMaintenance: Date, nextMaintenance: Date): Promise<void> {
    try {
      const shuttleRef = doc(db, "shuttles", shuttleId)
      const shuttleDoc = await getDoc(shuttleRef)
      
      if (!shuttleDoc.exists()) {
        throw new Error("Shuttle not found")
      }
      
      await updateDoc(shuttleRef, {
        lastMaintenance,
        nextMaintenance,
        updatedAt: new Date()
      })
    } catch (error: any) {
      console.error("Error updating maintenance dates:", error)
      throw new Error(error.message || "Failed to update maintenance dates")
    }
  }

  // Get fleet statistics
  async getFleetStatistics(): Promise<{
    totalShuttles: number
    activeShuttles: number
    maintenanceShuttles: number
    offlineShuttles: number
    utilizationRate: number
  }> {
    try {
      const allShuttles = await this.getShuttles(1000)
      
      const totalShuttles = allShuttles.length
      const activeShuttles = allShuttles.filter(s => s.status === 'available' || s.status === 'in_use').length
      const maintenanceShuttles = allShuttles.filter(s => s.status === 'maintenance').length
      const offlineShuttles = allShuttles.filter(s => s.status === 'offline').length
      const utilizationRate = totalShuttles > 0 ? Math.round((activeShuttles / totalShuttles) * 100) : 0
      
      return {
        totalShuttles,
        activeShuttles,
        maintenanceShuttles,
        offlineShuttles,
        utilizationRate
      }
    } catch (error) {
      console.error("Error getting fleet statistics:", error)
      throw new Error("Failed to get fleet statistics")
    }
  }
}

export const shuttleService = new ShuttleService()
