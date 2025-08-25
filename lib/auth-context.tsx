"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth"
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "./firebase"

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
}

export interface Admin {
  id: string
  email: string
  name: string
  role: "admin"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isStudent: boolean
  isGuest: boolean
  isDriver: boolean
  isAdmin: boolean
  isLoading: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  adminSignIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  driverSignIn: (driverId: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  setAsGuest: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  updateDriverProfile: (updates: Partial<Driver>) => Promise<void>
  changeDriverPassword: (currentPassword: string, newPassword: string) => Promise<void>
  getDriverDetails: (email: string) => Promise<Driver | null>
  addDriver: (driverData: Omit<Driver, 'id' | 'createdAt'>) => Promise<void>
  getDrivers: () => Promise<Driver[]>
  // Remember me functionality
  saveCredentials: (type: 'student' | 'driver', credentials: { email?: string, driverId?: string, password: string }) => void
  loadCredentials: (type: 'student' | 'driver') => { email?: string, driverId?: string, password: string } | null
  clearCredentials: (type: 'student' | 'driver') => void
  hasRememberedCredentials: (type: 'student' | 'driver') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const hasHandledInitialGuest = useRef(false)

  // Listen for Firebase auth state changes
  useEffect(() => {
    // Check for existing guest session on initial load
    if (!hasHandledInitialGuest.current) {
      const guestSession = localStorage.getItem("knust-shuttle-guest")
      if (guestSession) {
        try {
          const guestUser = JSON.parse(guestSession) as User
          console.log("Restoring guest session on initial load:", guestUser)
          setUser(guestUser)
          setIsAuthenticated(true)
          setIsLoading(false)
          hasHandledInitialGuest.current = true
        } catch (error) {
          console.error("Error parsing guest session:", error)
          localStorage.removeItem("knust-shuttle-guest")
          hasHandledInitialGuest.current = true
        }
      } else {
        console.log("No guest session found on initial load")
        hasHandledInitialGuest.current = true
      }
    }

    // Only set up Firebase listener if we don't have a guest session or if we've already handled initial guest
    if (hasHandledInitialGuest.current) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        console.log("Firebase auth state changed:", firebaseUser ? "User logged in" : "User logged out")
        
        if (firebaseUser) {
          // Check if there's a guest session in localStorage
          const currentGuestSession = localStorage.getItem("knust-shuttle-guest")
          
          if (currentGuestSession) {
            console.log("Clearing guest session due to Firebase auth")
            // If there's a guest session, clear it since user is now authenticated
            localStorage.removeItem("knust-shuttle-guest")
          }
          
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            console.log("Setting authenticated user:", userData)
            setUser(userData)
            setIsAuthenticated(true)
          }
        } else {
          // Check if there's a guest session to restore
          const currentGuestSession = localStorage.getItem("knust-shuttle-guest")
          
          if (currentGuestSession) {
            try {
              const guestUser = JSON.parse(currentGuestSession) as User
              console.log("Restoring guest session:", guestUser)
              setUser(guestUser)
              setIsAuthenticated(true)
            } catch (error) {
              console.error("Error parsing guest session:", error)
              localStorage.removeItem("knust-shuttle-guest")
              setUser(null)
              setIsAuthenticated(false)
            }
          } else {
            console.log("No guest session to restore, setting user to null")
            setUser(null)
            setIsAuthenticated(false)
          }
        }
        setIsLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Create user profile in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: email,
        name: (userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`).trim(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || "student",
        studentId: userData.studentId,
        department: userData.department,
        level: userData.level
      }

      await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      
      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: (userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`).trim()
      })

      // Don't automatically sign in the user - they need to sign in manually
      // setUser(newUser)
      // setIsAuthenticated(true)
      
      // Sign out the user from Firebase Auth since we don't want them automatically signed in
      await signOut(auth)
    } catch (error: any) {
      console.error("Error signing up:", error)
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to create account"
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Use at least 6 characters"
          break
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled"
          break
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later"
          break
        default:
          errorMessage = error.message || "Failed to create account"
      }
      
      throw new Error(errorMessage)
    }
  }

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // User will be set by the auth state listener
      
      // Save credentials if remember me is enabled
      if (rememberMe) {
        saveCredentials('student', { email, password })
      }
    } catch (error: any) {
      console.error("Error signing in:", error)
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to sign in"
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password"
          break
        case 'auth/user-not-found':
          errorMessage = "No account found with this email"
          break
        case 'auth/wrong-password':
          errorMessage = "Incorrect password"
          break
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later"
          break
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        default:
          errorMessage = error.message || "Failed to sign in"
      }
      
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // Clear guest session if it exists
      localStorage.removeItem("knust-shuttle-guest")
      
      // Clear remembered credentials on logout
      if (user?.role === 'student') {
        clearCredentials('student')
      } else if (user?.role === 'driver') {
        clearCredentials('driver')
      }
      
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const setAsGuest = () => {
    const guestUser: User = {
      id: "guest-" + Date.now(),
      email: "guest@knust.edu.gh",
      name: "Guest User",
      role: "guest"
    }
    console.log("Setting as guest:", guestUser)
    setUser(guestUser)
    setIsAuthenticated(true)
    localStorage.setItem("knust-shuttle-guest", JSON.stringify(guestUser))
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error("User not logged in")
    }
    
    try {
      // Update user profile in Firestore
      const updatedUser = { ...user, ...updates }
      await setDoc(doc(db, "users", user.id), updatedUser, { merge: true })
      
      // Update local state
      setUser(updatedUser)
    } catch (error: any) {
      console.error("Error updating user profile:", error)
      throw new Error(error.message || "Failed to update user profile")
    }
  }

  const adminSignIn = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      // First authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password)
      
      // Note: We don't save admin credentials for security reasons
      // Admin access should always require manual login
      
      // Then check if user is admin in admins collection
      const adminQuery = query(collection(db, "admins"), where("email", "==", email))
      const adminSnapshot = await getDocs(adminQuery)
      
      if (adminSnapshot.empty) {
        // Sign out from Firebase since not an admin
        await signOut(auth)
        throw new Error("Access denied. Admin privileges required.")
      }
      
      const adminData = adminSnapshot.docs[0].data() as Admin
      const adminUser: User = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: "admin"
      }
      
      setUser(adminUser)
      setIsAuthenticated(true)
    } catch (error: any) {
      console.error("Error signing in as admin:", error)
      
      let errorMessage = "Failed to sign in as admin"
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password"
          break
        case 'auth/user-not-found':
          errorMessage = "No admin account found with this email"
          break
        case 'auth/wrong-password':
          errorMessage = "Incorrect password"
          break
        default:
          errorMessage = error.message || "Failed to sign in as admin"
      }
      
      throw new Error(errorMessage)
    }
  }

    const driverSignIn = async (driverId: string, password: string, rememberMe?: boolean) => {
    try {
      // First, find the driver by driver ID to get their email
      const driverQuery = query(
        collection(db, "drivers"),
        where("driverId", "==", driverId),
        where("isActive", "==", true)
      )
      const driverSnapshot = await getDocs(driverQuery)

      if (driverSnapshot.empty) {
        throw new Error("No driver account found with this Driver ID")
      }

      const driverData = driverSnapshot.docs[0].data() as Driver
      const driverEmail = driverData.email

      // Check if the password matches
      if (driverData.password !== password) {
        throw new Error("Invalid Driver ID or password")
      }

      // Check if driver has a Firebase auth account (by checking if id starts with 'driver_')
      if (driverData.id.startsWith('driver_')) {
        // Driver doesn't have Firebase auth account yet, create one
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, driverEmail, password)
          const firebaseUser = userCredential.user

          // Create user profile in Firestore
          const newDriverUser: User = {
            id: firebaseUser.uid,
            email: driverData.email,
            name: driverData.name,
            role: "driver"
          }

          await setDoc(doc(db, "users", firebaseUser.uid), newDriverUser)
          
          // Update Firebase user profile
          await updateProfile(firebaseUser, {
            displayName: driverData.name
          })

          // Update the driver document with the Firebase UID
          await setDoc(doc(db, "drivers", driverData.id), {
            ...driverData,
            id: firebaseUser.uid
          }, { merge: true })

          // Set user and authenticate
          setUser(newDriverUser)
          setIsAuthenticated(true)
          
          // Save credentials if remember me is enabled
          if (rememberMe) {
            saveCredentials('driver', { driverId, password })
          }
        } catch (firebaseError: any) {
          console.error("Error creating Firebase auth account:", firebaseError)
          
          // If Firebase auth creation fails, we can still authenticate the driver
          // using our custom authentication system
          if (firebaseError.code === 'auth/email-already-in-use') {
            // Try to sign in with existing Firebase account
            try {
              await signInWithEmailAndPassword(auth, driverEmail, password)
              
              // Create a driver user object
              const driverUser: User = {
                id: driverData.id,
                email: driverData.email,
                name: driverData.name,
                role: "driver"
              }

              setUser(driverUser)
              setIsAuthenticated(true)
              
              // Save credentials if remember me is enabled
              if (rememberMe) {
                saveCredentials('driver', { driverId, password })
              }
            } catch (signInError: any) {
              console.error("Error signing in with existing Firebase account:", signInError)
              throw new Error("Authentication failed. Please contact support.")
            }
          } else {
            throw new Error("Failed to create authentication account. Please contact support.")
          }
        }
      } else {
        // Driver already has Firebase auth account, sign in normally
        try {
          await signInWithEmailAndPassword(auth, driverEmail, password)

          // Create a driver user object
          const driverUser: User = {
            id: driverData.id,
            email: driverData.email,
            name: driverData.name,
            role: "driver"
          }

          setUser(driverUser)
          setIsAuthenticated(true)
          
          // Save credentials if remember me is enabled
          if (rememberMe) {
            saveCredentials('driver', { driverId, password })
          }
        } catch (signInError: any) {
          console.error("Error signing in with Firebase:", signInError)
          
          // If Firebase sign-in fails, we can still authenticate using custom auth
          // This handles cases where Firebase Auth is not properly set up
          const driverUser: User = {
            id: driverData.id,
            email: driverData.email,
            name: driverData.name,
            role: "driver"
          }

          setUser(driverUser)
          setIsAuthenticated(true)
          
          // Save credentials if remember me is enabled
          if (rememberMe) {
            saveCredentials('driver', { driverId, password })
          }
        }
      }
    } catch (error: any) {
      console.error("Error signing in as driver:", error)

      let errorMessage = "Failed to sign in as driver"

      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = "Invalid Driver ID or password"
          break
        case 'auth/user-not-found':
          errorMessage = "No driver account found with this Driver ID"
          break
        case 'auth/wrong-password':
          errorMessage = "Incorrect password"
          break
        case 'auth/email-already-in-use':
          errorMessage = "Account already exists. Please contact support."
          break
        default:
          errorMessage = error.message || "Failed to sign in as driver"
      }

      throw new Error(errorMessage)
    }
  }

  const addDriver = async (driverData: Omit<Driver, 'id' | 'createdAt'>) => {
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
      
      // Generate a unique ID for the driver (we'll use this instead of Firebase UID initially)
      const driverId = `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Add driver to drivers collection first (without Firebase auth user)
      const newDriver: Driver = {
        ...driverData,
        id: driverId, // Use generated ID instead of Firebase UID
        createdAt: new Date()
      }
      
      await setDoc(doc(db, "drivers", driverId), newDriver)
      
      // Create Firebase auth account for the driver (this will be done when they first log in)
      // For now, we'll store the password in the drivers collection
      // When the driver logs in for the first time, we'll create their Firebase auth account
      
    } catch (error: any) {
      console.error("Error adding driver:", error)
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to add driver"
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Use at least 6 characters"
          break
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled"
          break
        default:
          errorMessage = error.message || "Failed to add driver"
      }
      
      throw new Error(errorMessage)
    }
  }

  const getDrivers = async (): Promise<Driver[]> => {
    try {
      const driversQuery = query(collection(db, "drivers"))
      const driversSnapshot = await getDocs(driversQuery)
      
      return driversSnapshot.docs.map(doc => doc.data() as Driver)
    } catch (error: any) {
      console.error("Error getting drivers:", error)
      throw new Error(error.message || "Failed to get drivers")
    }
  }

  const getDriverDetails = async (email: string): Promise<Driver | null> => {
    try {
      const driverQuery = query(
        collection(db, "drivers"),
        where("email", "==", email)
      )
      const driverSnapshot = await getDocs(driverQuery)
      
      if (driverSnapshot.empty) {
        return null
      }
      
      return driverSnapshot.docs[0].data() as Driver
    } catch (error: any) {
      console.error("Error getting driver details:", error)
      throw new Error(error.message || "Failed to get driver details")
    }
  }

  const updateDriverProfile = async (updates: Partial<Driver>) => {
    if (!user || user.role !== "driver") {
      throw new Error("User not logged in or not a driver")
    }
    
    try {
      // Get the current driver data
      const driverQuery = query(
        collection(db, "drivers"),
        where("email", "==", user.email)
      )
      const driverSnapshot = await getDocs(driverQuery)
      
      if (driverSnapshot.empty) {
        throw new Error("Driver profile not found")
      }
      
      const driverDoc = driverSnapshot.docs[0]
      const currentDriverData = driverDoc.data() as Driver
      
      // Update the driver document
      const updatedDriver = { ...currentDriverData, ...updates }
      await setDoc(doc(db, "drivers", driverDoc.id), updatedDriver, { merge: true })
      
      // Also update the user profile if name or email changed
      if (updates.name || updates.email) {
        const userUpdates: Partial<User> = {}
        if (updates.name) userUpdates.name = updates.name
        if (updates.email) userUpdates.email = updates.email
        
        await setDoc(doc(db, "users", user.id), userUpdates, { merge: true })
        
        // Update local user state
        setUser({ ...user, ...userUpdates })
      }
    } catch (error: any) {
      console.error("Error updating driver profile:", error)
      throw new Error(error.message || "Failed to update driver profile")
    }
  }

  const changeDriverPassword = async (currentPassword: string, newPassword: string) => {
    if (!user || user.role !== "driver") {
      throw new Error("User not logged in or not a driver")
    }
    
    try {
      // Get the current driver data
      const driverQuery = query(
        collection(db, "drivers"),
        where("email", "==", user.email)
      )
      const driverSnapshot = await getDocs(driverQuery)
      
      if (driverSnapshot.empty) {
        throw new Error("Driver profile not found")
      }
      
      const driverDoc = driverSnapshot.docs[0]
      const currentDriverData = driverDoc.data() as Driver
      
      // Verify current password
      if (currentDriverData.password !== currentPassword) {
        throw new Error("Current password is incorrect")
      }
      
      // Update password in Firestore only
      // We don't update Firebase Auth password since drivers use custom authentication
      await setDoc(doc(db, "drivers", driverDoc.id), {
        ...currentDriverData,
        password: newPassword
      }, { merge: true })
      
      // Note: We don't update Firebase Auth password because:
      // 1. Drivers use custom authentication (Driver ID as email)
      // 2. Firebase Auth password updates require recent re-authentication
      // 3. The password in Firestore is the source of truth for driver authentication
      
    } catch (error: any) {
      console.error("Error changing driver password:", error)
      throw new Error(error.message || "Failed to change password")
    }
  }

  const isStudent = user?.role === "student"
  const isGuest = user?.role === "guest"
  const isDriver = user?.role === "driver"
  const isAdmin = user?.role === "admin"

  // Remember me functionality
  const saveCredentials = (type: 'student' | 'driver', credentials: { email?: string, driverId?: string, password: string }) => {
    try {
      const key = `knust-shuttle-${type}-credentials`
      localStorage.setItem(key, JSON.stringify(credentials))
    } catch (error) {
      console.error(`Error saving ${type} credentials:`, error)
    }
  }

  const loadCredentials = (type: 'student' | 'driver') => {
    try {
      const key = `knust-shuttle-${type}-credentials`
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error(`Error loading ${type} credentials:`, error)
      return null
    }
  }

  const clearCredentials = (type: 'student' | 'driver') => {
    try {
      const key = `knust-shuttle-${type}-credentials`
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error clearing ${type} credentials:`, error)
    }
  }

  const hasRememberedCredentials = (type: 'student' | 'driver') => {
    try {
      const key = `knust-shuttle-${type}-credentials`
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`Error checking ${type} credentials:`, error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isStudent,
        isGuest,
        isDriver,
        isAdmin,
        isLoading,
        signUp,
        signIn,
        logout,
        setAsGuest,
        updateUserProfile,
        updateDriverProfile,
        changeDriverPassword,
        getDriverDetails,
        adminSignIn,
        driverSignIn,
        addDriver,
        getDrivers,
        saveCredentials,
        loadCredentials,
        clearCredentials,
        hasRememberedCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 