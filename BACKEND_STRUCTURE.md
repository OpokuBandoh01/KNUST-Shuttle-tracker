# Backend Structure Documentation

## Overview
The shuttle tracker app uses a well-organized backend structure with Firebase/Firestore as the database and organized service layers for different functionalities.

## Directory Structure

```
lib/
├── backend/
│   ├── types.ts           # TypeScript interfaces and types
│   ├── admin-service.ts   # Admin-specific operations
│   ├── driver-service.ts  # Driver management operations
│   └── utils.ts          # Utility functions and helpers
├── firebase.ts           # Firebase configuration
└── auth-context.tsx      # Authentication context
```

## Backend Services

### 1. Types (`types.ts`)
Central location for all TypeScript interfaces and types used across the application:

- **User**: Base user interface with role-based access
- **Driver**: Driver-specific data structure
- **Admin**: Admin user interface
- **Route**: Shuttle route information
- **Trip**: Trip tracking data
- **Shuttle**: Vehicle information
- **Alert**: System alerts and notifications
- **Notification**: User notifications
- **Analytics**: Dashboard analytics data
- **SystemSettings**: System configuration

### 2. Admin Service (`admin-service.ts`)
Handles all admin-related operations:

#### Driver Management
- `getDrivers()` - Fetch drivers with pagination
- `getDriverById()` - Get specific driver
- `updateDriver()` - Update driver information
- `deleteDriver()` - Remove driver
- `toggleDriverStatus()` - Activate/deactivate driver

#### Route Management
- `getRoutes()` - Fetch all routes
- `createRoute()` - Create new route
- `updateRoute()` - Modify existing route
- `deleteRoute()` - Remove route

#### Trip Management
- `getTrips()` - Fetch trip data
- `getTodayTrips()` - Get today's trips

#### Analytics
- `getAnalytics()` - Comprehensive dashboard data
- `getTopRoutes()` - Most popular routes
- `getDriverPerformance()` - Driver statistics

#### System Settings
- `getSystemSettings()` - Fetch system configuration
- `updateSystemSettings()` - Update system settings

#### Alert Management
- `getAlerts()` - Fetch active alerts
- `createAlert()` - Create new alert
- `updateAlert()` - Modify alert
- `deleteAlert()` - Remove alert

### 3. Driver Service (`driver-service.ts`)
Dedicated service for driver operations:

#### Core Operations
- `createDriver()` - Add new driver
- `getDrivers()` - Fetch drivers with pagination
- `getDriverById()` - Get driver by ID
- `getDriverByEmail()` - Get driver by email
- `updateDriver()` - Update driver data
- `deleteDriver()` - Remove driver

#### Status Management
- `toggleDriverStatus()` - Activate/deactivate
- `updateDriverLocation()` - Update GPS coordinates
- `updateDriverStatus()` - Update current status

#### Advanced Queries
- `getDriverTrips()` - Get driver's trip history
- `searchDrivers()` - Search with multiple criteria
- `getActiveDrivers()` - Get available drivers
- `getDriversByRoute()` - Filter by route

### 4. Utilities (`utils.ts`)
Common helper functions:

#### Date/Time Utilities
- `timestampToDate()` - Convert Firestore timestamp
- `dateToTimestamp()` - Convert to Firestore timestamp
- `formatDate()` - Format date for display
- `formatTime()` - Format time for display
- `formatDateTime()` - Format date and time
- `getTimeDifference()` - Calculate time differences
- `formatDuration()` - Human-readable duration

#### Data Validation
- `isValidEmail()` - Email format validation
- `isValidPhone()` - Phone number validation
- `generateId()` - Generate unique IDs

#### UI Utilities
- `getStatusColor()` - Status badge colors
- `getSeverityColor()` - Alert severity colors
- `capitalizeWords()` - Text formatting
- `truncateText()` - Text truncation
- `getInitials()` - Get user initials

#### Performance Utilities
- `debounce()` - Debounce function calls
- `throttle()` - Throttle function calls
- `deepClone()` - Deep object cloning
- `isEmpty()` - Check if object is empty

## Data Flow

### 1. Authentication Flow
```
User Login → Firebase Auth → Check Role → Load User Data → Set Context
```

### 2. Admin Operations Flow
```
Admin Action → Service Method → Firestore Query → Update State → UI Update
```

### 3. Data Fetching Flow
```
Component Mount → useEffect → Service Call → Firestore → State Update → Render
```

## Security Features

### 1. Role-Based Access Control
- Admin operations require admin role
- Driver operations require appropriate permissions
- User data isolation

### 2. Input Validation
- Form validation on client side
- Server-side validation in services
- Type safety with TypeScript

### 3. Error Handling
- Comprehensive error catching
- User-friendly error messages
- Logging for debugging

## Performance Optimizations

### 1. Data Fetching
- Parallel data loading with `Promise.all()`
- Pagination for large datasets
- Debounced search inputs

### 2. State Management
- Efficient state updates
- Memoized callbacks
- Optimized re-renders

### 3. Caching
- Local state caching
- Efficient data structures
- Minimal API calls

## Usage Examples

### Adding a Driver
```typescript
import { driverService } from "@/lib/backend/driver-service"

const newDriver = await driverService.createDriver({
  driverId: "DRV-123456",
  name: "John Doe",
  email: "john@knust.edu.gh",
  password: "secure123",
  phone: "+233 123 456 789",
  vehicleNumber: "KN-1234-20",
  route: "brunei-ksb",
  isActive: true
})
```

### Fetching Analytics
```typescript
import { adminService } from "@/lib/backend/admin-service"

const analytics = await adminService.getAnalytics()
console.log(`Total drivers: ${analytics.totalDrivers}`)
console.log(`Today's trips: ${analytics.dailyTrips}`)
```

### Updating Driver Status
```typescript
import { driverService } from "@/lib/backend/driver-service"

await driverService.toggleDriverStatus("DRV-123456")
```

## Future Enhancements

### 1. Real-time Updates
- Firestore real-time listeners
- WebSocket connections
- Push notifications

### 2. Advanced Analytics
- Machine learning insights
- Predictive analytics
- Performance metrics

### 3. API Rate Limiting
- Request throttling
- Usage monitoring
- Cost optimization

### 4. Caching Layer
- Redis integration
- CDN optimization
- Browser caching

## Best Practices

### 1. Error Handling
- Always wrap async operations in try-catch
- Provide meaningful error messages
- Log errors for debugging

### 2. Type Safety
- Use TypeScript interfaces
- Validate data at boundaries
- Handle optional fields gracefully

### 3. Performance
- Minimize database queries
- Use efficient data structures
- Implement proper loading states

### 4. Security
- Validate all inputs
- Check user permissions
- Sanitize data before storage

## Testing

### 1. Unit Tests
- Service method testing
- Utility function testing
- Mock Firebase calls

### 2. Integration Tests
- End-to-end workflows
- Database operations
- API interactions

### 3. Performance Tests
- Load testing
- Response time monitoring
- Memory usage analysis
