# 🏥 Hospital Management System

A comprehensive full-stack hospital management system built with Next.js, Node.js/Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Database](#database)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **User Authentication**: Secure sign up and sign in with JWT
- ✅ **Role-Based Access Control**: 6 different user roles with specific permissions
- ✅ **Patient Management**: Complete patient profile and medical history
- ✅ **Doctor Dashboard**: View patients and create prescriptions
- ✅ **Prescription Management**: Create, update, and track prescriptions
- ✅ **Vitals Tracking**: Record and monitor patient vital signs
- ✅ **Medicine Inventory**: Manage pharmacy inventory
- ✅ **Lab Tests**: Create and manage lab tests with results
- ✅ **Multi-language Support**: English and other languages
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile

### Data Storage
- ✅ All patient data stored in MongoDB
- ✅ All prescriptions and medical records persisted
- ✅ Complete audit trail with timestamps
- ✅ Secure password hashing with bcryptjs

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.0
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI
- **Language**: TypeScript
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 7.5.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Language**: TypeScript
- **API Documentation**: Comprehensive API docs included

### DevOps
- **Package Manager**: npm
- **Build Tool**: TypeScript compiler
- **Development**: ts-node for backend

---

## 📁 Project Structure

```
hospital-management/
├── client/                          # Next.js Frontend
│   ├── app/                        # App routes
│   │   ├── admin/                 # Admin dashboard
│   │   ├── doctor/                # Doctor dashboard
│   │   ├── nurse/                 # Nurse dashboard
│   │   ├── patient/               # Patient dashboard
│   │   ├── pharmacist/            # Pharmacist dashboard
│   │   ├── lab-technician/        # Lab technician dashboard
│   │   └── page.tsx               # Home page
│   ├── components/                # Reusable React components
│   ├── lib/                       # Utilities, types, contexts
│   ├── styles/                    # Global styles
│   ├── public/                    # Static assets
│   └── package.json
│
├── server/                         # Node.js/Express Backend
│   ├── src/
│   │   ├── config/               # Database configuration
│   │   ├── middleware/           # Authentication & authorization
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── User.ts
│   │   │   ├── Patient.ts
│   │   │   ├── Doctor.ts
│   │   │   ├── Nurse.ts
│   │   │   ├── Pharmacist.ts
│   │   │   ├── LabTechnician.ts
│   │   │   ├── Admin.ts
│   │   │   ├── Prescription.ts
│   │   │   ├── Vitals.ts
│   │   │   ├── Medicine.ts
│   │   │   └── LabTest.ts
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.ts
│   │   │   ├── patients.ts
│   │   │   ├── doctors.ts
│   │   │   ├── prescriptions.ts
│   │   │   ├── vitals.ts
│   │   │   ├── medicines.ts
│   │   │   └── lab-tests.ts
│   │   └── index.ts              # Main server file
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md
│   └── API_DOCUMENTATION.md
│
├── SETUP_GUIDE.md                # Complete setup instructions
├── BACKEND_SETUP_SUMMARY.md      # Backend overview
├── DATA_MODELS.md                # Database schema documentation
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

### 1. Clone and Setup

```bash
# Navigate to project directory
cd hospital-management

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
# Backend configuration
cd server
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/hospital-management
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Access the Application

Open your browser and go to: `http://localhost:3000`

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and deployment guide
- **[BACKEND_SETUP_SUMMARY.md](./BACKEND_SETUP_SUMMARY.md)** - Backend architecture overview
- **[DATA_MODELS.md](./DATA_MODELS.md)** - Database schema and relationships
- **[server/API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md)** - Complete API reference
- **[server/README.md](./server/README.md)** - Backend-specific documentation

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user

### Patients
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient details
- `PUT /patients/:id` - Update patient
- `GET /patients/:id/vitals` - Get patient vitals
- `GET /patients/:id/prescriptions` - Get prescriptions
- `GET /patients/:id/lab-tests` - Get lab tests

### Doctors
- `GET /doctors` - Get all doctors
- `POST /doctors/:id/prescriptions` - Create prescription
- `GET /doctors/:id/prescriptions` - Get doctor's prescriptions

### Prescriptions
- `GET /prescriptions` - Get all prescriptions
- `PUT /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Delete prescription

### Vitals
- `POST /vitals` - Record vitals
- `GET /vitals` - Get all vitals
- `PUT /vitals/:id` - Update vitals

### Medicines
- `GET /medicines` - Get all medicines
- `POST /medicines` - Add medicine
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine

### Lab Tests
- `GET /lab-tests` - Get all lab tests
- `POST /lab-tests` - Create lab test
- `PUT /lab-tests/:id` - Update lab test

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Patient** | View own profile, vitals, prescriptions, lab tests |
| **Doctor** | View patients, create prescriptions, view vitals |
| **Nurse** | Record vitals, view patient info |
| **Pharmacist** | Manage medicines, view prescriptions |
| **Lab Technician** | Create/manage lab tests, upload results |
| **Admin** | Full system access, manage all users |

---

## 🗄️ Database

### MongoDB Collections
- Users
- Patients
- Doctors
- Nurses
- Pharmacists
- Lab Technicians
- Admins
- Prescriptions
- Vitals
- Medicines
- Lab Tests

See [DATA_MODELS.md](./DATA_MODELS.md) for complete schema details.

---

## 🔒 Security

- ✅ Passwords hashed with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation
- ✅ Secure token expiration (7 days)

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure MongoDB is running
- Check `.env` configuration

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS settings
- Clear browser cache

### MongoDB connection error
- Ensure MongoDB service is running
- Verify connection string in `.env`
- Check MongoDB credentials

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting tips.

---

## 📦 Build & Deploy

### Build Backend
```bash
cd server
npm run build
npm start
```

### Build Frontend
```bash
cd client
npm run build
npm start
```

---

## 📝 License

This project is part of a hospital management system demonstration.

---

## 🎯 Status

✅ **Backend**: Running on port 5000
✅ **Frontend**: Running on port 3000
✅ **Database**: MongoDB configured
✅ **API**: All endpoints implemented
✅ **Authentication**: JWT implemented
✅ **Documentation**: Complete

---

## 🚀 Next Steps

1. Start both servers (see Quick Start)
2. Create a user account
3. Sign in with your credentials
4. Explore the dashboard based on your role
5. Test API endpoints using Postman or cURL

---

**Happy coding! 🎉**

