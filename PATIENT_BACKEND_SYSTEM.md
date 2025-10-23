# 🏥 Patient Backend System - Complete Implementation

## Overview
A comprehensive real-time hospital management system for patients with QR code generation, automatic patient ID creation, and real-time hospital navigation with dynamic wait times.

## ✨ Key Features

### 1. **Patient Signup & Registration**
- ✅ Stores patient details in MongoDB
- ✅ Generates unique Patient ID: `P{timestamp}`
- ✅ Generates QR code data for patient identification
- ✅ Stores all patient information securely with password hashing
- ✅ Returns token and QR code immediately after signup

### 2. **Hospital Navigation System**
- ✅ Generates random but realistic room numbers (e.g., A001, B102)
- ✅ Assigns departments with specific floors
- ✅ Creates step-by-step directions
- ✅ Calculates estimated wait times based on department
- ✅ Real-time wait time updates via WebSocket

### 3. **Real-time Updates**
- ✅ WebSocket connection for live navigation updates
- ✅ Automatic wait time adjustments (±5 minutes variation)
- ✅ Status updates (scheduled → in-progress → completed)
- ✅ Connection status indicator on frontend

### 4. **Visit Scheduling**
- ✅ Patients can schedule new or follow-up visits
- ✅ Select specific departments
- ✅ Describe symptoms and medical concerns
- ✅ Automatic hospital navigation generation
- ✅ Immediate navigation display after scheduling

## 🏗️ Architecture

### Backend Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── models/
│   │   ├── Patient.js           # Enhanced with navigation data
│   │   ├── User.js
│   │   ├── Visit.js
│   │   └── ...other models
│   ├── routes/
│   │   ├── auth.js              # Signup/Login with QR generation
│   │   ├── visits.js            # Visit scheduling & navigation
│   │   └── ...other routes
│   ├── services/
│   │   ├── hospitalNavigation.js # Navigation generation logic
│   │   └── websocket.js         # Real-time update manager
│   └── index.js                 # Express + WebSocket server
└── package.json
```

### Frontend Structure
```
client/
├── app/
│   └── patient/
│       ├── signup/page.tsx      # Patient registration
│       ├── home/page.tsx        # Patient dashboard
│       └── navigation/page.tsx  # Real-time navigation
├── components/
│   └── patient/
│       ├── visit-form.tsx       # Enhanced with real-time nav
│       └── ...other components
└── lib/
    └── auth-context.tsx         # Authentication state
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new patient
  - Returns: `{ token, user: { patientId, qrCode, ... } }`
- `POST /api/auth/login` - Patient login
  - Returns: `{ token, user: { patientId, qrCode, ... } }`

### Visits & Navigation
- `POST /api/visits` - Schedule a visit
  - Body: `{ visitType, symptoms, description, department }`
  - Returns: `{ visit, hospitalNavigation }`
- `GET /api/visits/navigation/:patientId` - Get current navigation
  - Returns: `{ hospitalNavigation, currentVisit }`
- `GET /api/visits/navigation/realtime/:patientId` - Get real-time updates
  - Returns: `{ hospitalNavigation, realtimeUpdate }`

## 🔌 WebSocket Events

### Client → Server
```javascript
// Register for real-time updates
{ type: 'register', patientId: 'P1234567890' }

// Keep-alive ping
{ type: 'ping' }
```

### Server → Client
```javascript
// Registration confirmation
{ type: 'registered', message: '...', timestamp: Date }

// Wait time update
{ type: 'wait-time-update', estimatedWaitTime: 25, timestamp: Date }

// Full navigation update
{ type: 'navigation-update', data: { roomNumber, floor, ... }, timestamp: Date }

// Status update
{ type: 'status-update', status: 'in-progress', message: '...', timestamp: Date }

// Keep-alive pong
{ type: 'pong', timestamp: Date }
```

## 📊 Data Models

### Patient Model (Enhanced)
```javascript
{
  userId: ObjectId,
  patientId: String,           // Unique: P{timestamp}
  age: Number,
  sex: String,
  phone: String,
  occupation: String,
  address: String,
  qrCode: String,              // JSON stringified QR data
  currentVisit: ObjectId,      // Reference to Visit
  hospitalNavigation: {
    roomNumber: String,        // e.g., "A001"
    floor: String,             // e.g., "Ground Floor"
    department: String,        // e.g., "OP Nurse"
    directions: String,        // Step-by-step directions
    estimatedWaitTime: Number, // Minutes
    status: String,            // scheduled/in-progress/completed
    lastUpdated: Date
  }
}
```

## 🎯 Hospital Navigation Generation

### Departments Available
- OP Nurse (Ground Floor)
- Emergency (Ground Floor)
- Cardiology (1st Floor)
- Orthopedics (1st Floor)
- Pediatrics (2nd Floor)
- Neurology (2nd Floor)
- General Surgery (3rd Floor)
- Radiology (Basement)

### Room Number Format
- Format: `{Section}{FloorNumber}{RandomNumber}`
- Example: `A001`, `B102`, `C-105`

### Wait Time Ranges
- OP Nurse: 15-45 minutes
- Emergency: 5-30 minutes
- Cardiology: 20-60 minutes
- Orthopedics: 25-50 minutes
- Pediatrics: 10-40 minutes
- Neurology: 30-75 minutes
- General Surgery: 40-90 minutes
- Radiology: 15-45 minutes

## 🚀 Getting Started

### Backend Setup
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
# WebSocket available at ws://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

## 📱 User Flow

1. **Signup**
   - Patient fills signup form
   - Backend generates Patient ID and QR code
   - User receives token and QR code
   - Redirects to home page

2. **Home Page**
   - Display patient info and QR code
   - Show quick action buttons
   - Display visit scheduling form

3. **Schedule Visit**
   - Select visit type (new/follow-up)
   - Choose department
   - Describe symptoms
   - Submit form

4. **Navigation Display**
   - Backend generates hospital navigation
   - Frontend displays room number, floor, directions
   - WebSocket connects for real-time updates
   - Wait time updates automatically

5. **Real-time Updates**
   - Patient sees live wait time changes
   - Status updates as they progress
   - Connection indicator shows status

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Secure WebSocket connections
- ✅ MongoDB data validation

## 📈 Performance

- ✅ Real-time updates via WebSocket (no polling)
- ✅ Efficient database queries with indexing
- ✅ Optimized navigation generation
- ✅ Connection pooling for MongoDB

## 🧪 Testing

### Test Patient Signup
```bash
POST http://localhost:5000/api/auth/signup
{
  "username": "testpatient",
  "email": "test@example.com",
  "password": "password123",
  "name": "Test Patient",
  "role": "patient",
  "age": 30,
  "sex": "male",
  "phone": "1234567890",
  "occupation": "Engineer",
  "address": "123 Main St"
}
```

### Test Visit Scheduling
```bash
POST http://localhost:5000/api/visits
Authorization: Bearer {token}
{
  "visitType": "new",
  "symptoms": "Headache and fever",
  "description": "Experiencing for 2 days",
  "department": "OP Nurse"
}
```

## 🎉 Features Implemented

✅ Patient signup with QR code generation
✅ Unique patient ID generation
✅ MongoDB data storage
✅ Hospital navigation generation
✅ Random room number assignment
✅ Real-time wait time updates
✅ WebSocket real-time communication
✅ Department-based routing
✅ Step-by-step directions
✅ Status tracking
✅ Frontend integration
✅ Real-time UI updates
✅ Connection status indicator
✅ Responsive design

## 📝 Notes

- All timestamps are in ISO format
- Wait times are simulated with ±5 minute variations
- Room numbers are generated randomly but realistically
- Directions are randomly selected from a pool of realistic hospital directions
- WebSocket automatically reconnects on disconnect
- All data is persisted in MongoDB

## 🔄 Next Steps (Optional Enhancements)

- Add SMS/Email notifications
- Implement doctor assignment
- Add vitals tracking
- Create nurse queue management
- Add prescription management
- Implement lab test tracking
- Add payment integration
- Create admin dashboard

