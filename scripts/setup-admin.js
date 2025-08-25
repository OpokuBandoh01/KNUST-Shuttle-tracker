// Script to set up initial admin account
// Run this script once to create the admin account
// Usage: node setup-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const readline = require('readline');

const firebaseConfig = {
  apiKey: "AIzaSyA14n5Y_c7rMRl88Lk-886An9c2_LttSy0",
  authDomain: "shuttle-tracker-fe0f5.firebaseapp.com",
  projectId: "shuttle-tracker-fe0f5",
  storageBucket: "shuttle-tracker-fe0f5.firebasestorage.app",
  messagingSenderId: "324402631022",
  appId: "1:324402631022:web:e134ef04d305f08e2fb17f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAdmin() {
  try {
    console.log("=== Admin Account Setup ===\n");
    
    // Get admin details from user input
    const adminEmail = await question("Enter admin email: ");
    const adminPassword = await question("Enter admin password (min 6 characters): ");
    const adminName = await question("Enter admin name: ");
    
    // Validate input
    if (!adminEmail || !adminPassword || !adminName) {
      console.error("All fields are required!");
      rl.close();
      return;
    }
    
    if (adminPassword.length < 6) {
      console.error("Password must be at least 6 characters long!");
      rl.close();
      return;
    }
    
    console.log("\nCreating admin account...");
    
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log("Firebase user created:", user.uid);
    
    // Add admin to admins collection
    const adminData = {
      id: user.uid,
      email: adminEmail,
      name: adminName,
      role: "admin"
    };
    
    await setDoc(doc(db, "admins", user.uid), adminData);
    
    console.log("\n✅ Admin account created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("👤 Name:", adminName);
    console.log("🔐 Password: [hidden for security]");
    console.log("\n⚠️  Please change the password after first login!");
    console.log("💡 You can manage admin accounts through Firebase Console");
    
  } catch (error) {
    console.error("❌ Error setting up admin:", error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log("💡 This email is already registered. Try a different email or sign in with existing account.");
    }
  } finally {
    rl.close();
  }
}

setupAdmin(); 