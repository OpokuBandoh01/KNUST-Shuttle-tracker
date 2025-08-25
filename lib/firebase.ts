import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA14n5Y_c7rMRl88Lk-886An9c2_LttSy0",
    authDomain: "shuttle-tracker-fe0f5.firebaseapp.com",
    projectId: "shuttle-tracker-fe0f5",
    storageBucket: "shuttle-tracker-fe0f5.firebasestorage.app",
    messagingSenderId: "324402631022",
    appId: "1:324402631022:web:e134ef04d305f08e2fb17f"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app 