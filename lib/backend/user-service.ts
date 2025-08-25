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
import { User, Driver } from "./types"

export class UserService {
  // Create a new user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if email already exists
      const existingUserQuery = query(
        collection(db, "users"), 
        where("email", "==", userData.email)
      )
      const existingUserSnapshot = await getDocs(existingUserQuery)
      
      if (!existingUserSnapshot.empty) {
        throw new Error("Email already exists")
      }

      // Check if student ID already exists (for students)
      if (userData.role === "student" && userData.studentId) {
        const existingStudentQuery = query(
          collection(db, "users"), 
          where("studentId", "==", userData.studentId)
        )
        const existingStudentSnapshot = await getDocs(existingStudentQuery)
        
        if (!existingStudentSnapshot.empty) {
          throw new Error("Student ID already exists")
        }
      }
      
      // Generate a unique ID for the user
      const userRef = doc(collection(db, "users"))
      const newUser: User = {
        ...userData,
        id: userRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(userRef, newUser)
      return userRef.id
    } catch (error: any) {
      console.error("Error creating user:", error)
      throw new Error(error.message || "Failed to create user")
    }
  }

  // Get all users with pagination - aggregates from multiple collections
  async getUsers(limitCount: number = 50, lastUser?: User): Promise<User[]> {
    try {
      console.log("Fetching users from Firestore...")
      
      // Get users from "users" collection
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
      const usersSnapshot = await getDocs(usersQuery)
      console.log("Users collection docs:", usersSnapshot.docs.length)
      
      const users = usersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[]

      // Get drivers from "drivers" collection and convert to User format
      const driversQuery = query(
        collection(db, "drivers"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
      const driversSnapshot = await getDocs(driversQuery)
      console.log("Drivers collection docs:", driversSnapshot.docs.length)
      
      const drivers = driversSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "driver" as const,
          studentId: data.studentId,
          department: data.department,
          level: data.level,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      })

      // Combine and sort by creation date
      const allUsers = [...users, ...drivers]
      console.log("Total users found:", allUsers.length)
      console.log("Users:", users.length, "Drivers:", drivers.length)
      
      return allUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limitCount)
    } catch (error) {
      console.error("Error fetching users:", error)
      throw new Error("Failed to fetch users")
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      // First try to get from users collection
      const userDoc = await getDoc(doc(db, "users", userId))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          id: userDoc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      }

      // If not found in users, try drivers collection
      const driverDoc = await getDoc(doc(db, "drivers", userId))
      
      if (driverDoc.exists()) {
        const data = driverDoc.data()
        return {
          id: driverDoc.id,
          email: data.email,
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "driver" as const,
          studentId: data.studentId,
          department: data.department,
          level: data.level,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      }
      
      return null
    } catch (error) {
      console.error("Error fetching user:", error)
      throw new Error("Failed to fetch user")
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // First try users collection
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      )
      const userSnapshot = await getDocs(userQuery)
      
      if (!userSnapshot.empty) {
        const doc = userSnapshot.docs[0]
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      }

      // If not found, try drivers collection
      const driverQuery = query(
        collection(db, "drivers"),
        where("email", "==", email)
      )
      const driverSnapshot = await getDocs(driverQuery)
      
      if (!driverSnapshot.empty) {
        const doc = driverSnapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "driver" as const,
          studentId: data.studentId,
          department: data.department,
          level: data.level,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      }
      
      return null
    } catch (error) {
      console.error("Error fetching user by email:", error)
      throw new Error("Failed to fetch user")
    }
  }

  // Get user by student ID
  async getUserByStudentId(studentId: string): Promise<User | null> {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("studentId", "==", studentId)
      )
      const snapshot = await getDocs(userQuery)
      
      if (snapshot.empty) {
        return null
      }
      
      const doc = snapshot.docs[0]
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as User
    } catch (error) {
      console.error("Error fetching user by student ID:", error)
      throw new Error("Failed to fetch user")
    }
  }

  // Update user
  async updateUser(userId: string, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      // Try to update in users collection first
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          ...updateData,
          updatedAt: new Date()
        })
        return
      }

      // If not found in users, try drivers collection
      const driverRef = doc(db, "drivers", userId)
      const driverDoc = await getDoc(driverRef)
      
      if (driverDoc.exists()) {
        await updateDoc(driverRef, {
          ...updateData,
          updatedAt: new Date()
        })
        return
      }
      
      throw new Error("User not found")
    } catch (error: any) {
      console.error("Error updating user:", error)
      throw new Error(error.message || "Failed to update user")
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    try {
      // Try to delete from users collection first
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        await deleteDoc(userRef)
        return
      }

      // If not found in users, try drivers collection
      const driverRef = doc(db, "drivers", userId)
      const driverDoc = await getDoc(driverRef)
      
      if (driverDoc.exists()) {
        await deleteDoc(driverRef)
        return
      }
      
      throw new Error("User not found")
    } catch (error: any) {
      console.error("Error deleting user:", error)
      throw new Error(error.message || "Failed to delete user")
    }
  }

  // Get users by role
  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      if (role === 'driver') {
        // Get drivers from drivers collection
        const driversQuery = query(
          collection(db, "drivers"),
          orderBy("createdAt", "desc")
        )
        const driversSnapshot = await getDocs(driversQuery)
        return driversSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            email: data.email,
            name: data.name,
            firstName: data.firstName,
            lastName: data.lastName,
            role: "driver" as const,
            studentId: data.studentId,
            department: data.department,
            level: data.level,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as User
        })
      } else {
        // Get other roles from users collection
        const usersQuery = query(
          collection(db, "users"),
          where("role", "==", role),
          orderBy("createdAt", "desc")
        )
        const snapshot = await getDocs(usersQuery)
        return snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as User[]
      }
    } catch (error) {
      console.error("Error fetching users by role:", error)
      throw new Error("Failed to fetch users")
    }
  }

  // Get users by department
  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      // Get from users collection
      const usersQuery = query(
        collection(db, "users"),
        where("department", "==", department),
        orderBy("createdAt", "desc")
      )
      const usersSnapshot = await getDocs(usersQuery)
      const users = usersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[]

      // Get from drivers collection
      const driversQuery = query(
        collection(db, "drivers"),
        where("department", "==", department),
        orderBy("createdAt", "desc")
      )
      const driversSnapshot = await getDocs(driversQuery)
      const drivers = driversSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "driver" as const,
          studentId: data.studentId,
          department: data.department,
          level: data.level,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as User
      })

      return [...users, ...drivers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } catch (error) {
      console.error("Error fetching users by department:", error)
      throw new Error("Failed to fetch users")
    }
  }

  // Get users by level (for students)
  async getUsersByLevel(level: string): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("level", "==", level),
        orderBy("createdAt", "desc")
      )
      
      const snapshot = await getDocs(usersQuery)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[]
    } catch (error) {
      console.error("Error fetching users by level:", error)
      throw new Error("Failed to fetch users")
    }
  }

  // Search users
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      // Get all users and filter in memory since Firestore doesn't support full-text search
      const allUsers = await this.getUsers(1000)
      
      return allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.level && user.level.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    } catch (error) {
      console.error("Error searching users:", error)
      throw new Error("Failed to search users")
    }
  }

  // Get user statistics
  async getUserStatistics(): Promise<{
    totalUsers: number
    students: number
    drivers: number
    admins: number
    guests: number
    newThisWeek: number
  }> {
    try {
      const allUsers = await this.getUsers(1000)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const totalUsers = allUsers.length
      const students = allUsers.filter(u => u.role === 'student').length
      const drivers = allUsers.filter(u => u.role === 'driver').length
      const admins = allUsers.filter(u => u.role === 'admin').length
      const guests = allUsers.filter(u => u.role === 'guest').length
      const newThisWeek = allUsers.filter(u => u.createdAt >= oneWeekAgo).length
      
      return {
        totalUsers,
        students,
        drivers,
        admins,
        guests,
        newThisWeek
      }
    } catch (error) {
      console.error("Error getting user statistics:", error)
      throw new Error("Failed to get user statistics")
    }
  }

  // Bulk operations
  async bulkUpdateUsers(userIds: string[], updateData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const updatePromises = userIds.map(userId => 
        this.updateUser(userId, updateData)
      )
      
      await Promise.all(updatePromises)
    } catch (error) {
      console.error("Error bulk updating users:", error)
      throw new Error("Failed to bulk update users")
    }
  }

  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    try {
      const deletePromises = userIds.map(userId => 
        this.deleteUser(userId)
      )
      
      await Promise.all(deletePromises)
    } catch (error) {
      console.error("Error bulk deleting users:", error)
      throw new Error("Failed to bulk delete users")
    }
  }

  // Get recent users
  async getRecentUsers(limitCount: number = 10): Promise<User[]> {
    try {
      const allUsers = await this.getUsers(limitCount)
      return allUsers
    } catch (error) {
      console.error("Error fetching recent users:", error)
      throw new Error("Failed to fetch recent users")
    }
  }
}

export const userService = new UserService()
