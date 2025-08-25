# Admin Account Management Guide

## Overview
Your shuttle tracker app uses Firebase Authentication + Firestore for secure admin account management. This is much more secure than hardcoded credentials.

## Initial Setup

### 1. Create Your First Admin Account
Run the setup script to create your first admin account:

```bash
node scripts/setup-admin.js
```

The script will prompt you for:
- Admin email
- Admin password (minimum 6 characters)
- Admin name

### 2. Sign In to Admin Panel
Use the created credentials to sign in through the admin login form at `/login`.

## Managing Admin Accounts

### Adding New Admins
You have two options:

#### Option A: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication → Users
4. Click "Add User"
5. Enter email and password
6. Go to Firestore → admins collection
7. Add a new document with:
   ```json
   {
     "id": "firebase-user-uid",
     "email": "admin@example.com",
     "name": "Admin Name",
     "role": "admin"
   }
   ```

#### Option B: Modify Setup Script
Edit `scripts/setup-admin.js` temporarily to add another admin, then run it again.

### Removing Admins
1. Go to Firebase Console → Authentication → Users
2. Delete the user account
3. Go to Firestore → admins collection
4. Delete the corresponding admin document

### Changing Admin Passwords
1. Go to Firebase Console → Authentication → Users
2. Find the admin user
3. Click "Reset password" to send a password reset email

## Security Best Practices

1. **Use Strong Passwords**: Minimum 8 characters with mix of letters, numbers, symbols
2. **Enable 2FA**: Consider enabling two-factor authentication for admin accounts
3. **Regular Password Changes**: Encourage admins to change passwords regularly
4. **Limit Admin Access**: Only give admin access to trusted personnel
5. **Monitor Activity**: Check Firebase Console logs for suspicious activity

## Troubleshooting

### "Access denied. Admin privileges required."
This means the user exists in Firebase Auth but not in the `admins` collection. Add them to the admins collection in Firestore.

### "No admin account found with this email"
This means the email doesn't exist in the `admins` collection. Either:
- Add the user to the admins collection, or
- Create a new admin account using the setup script

### Firebase Auth Issues
Check Firebase Console → Authentication → Users to see if the account exists and is enabled.

## Code Architecture

Your app uses a two-layer authentication system:
1. **Firebase Auth**: Handles password verification and session management
2. **Firestore admins collection**: Handles authorization (who has admin privileges)

This separation provides:
- Secure password storage (Firebase handles this)
- Flexible admin management (you control who has admin access)
- Audit trail (Firebase logs all authentication attempts)
