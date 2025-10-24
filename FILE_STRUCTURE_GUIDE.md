# 📁 Hospital Management System - File Structure Guide

---

## 🖥️ Frontend Structure (client/)

### App Routes (client/app/)

#### `page.tsx`
- **Purpose**: Home page landing
- **Features**: Navigation, role selection
- **Type**: Server component

#### `layout.tsx`
- **Purpose**: Root layout wrapper
- **Features**: Auth provider, language provider, analytics
- **Providers**: AuthProvider, LanguageProvider

#### `admin/`
- **Purpose**: Admin dashboard
- **Files**: page.tsx, components
- **Features**: User management, system overview

#### `doctor/`
- **Purpose**: Doctor dashboard
- **Files**: page.tsx, components
- **Features**: Patient queue, prescriptions, vitals monitoring

#### `nurse/`
- **Purpose**: Nurse dashboard
- **Files**: page.tsx, components
- **Features**: QR scanner, vitals recording, patient history

#### `patient/`
- **Purpose**: Patient dashboard
- **Files**: page.tsx, components
- **Features**: Profile, QR code, prescriptions, vitals, lab results

#### `pharmacist/`
- **Purpose**: Pharmacist dashboard
- **Files**: page.tsx, components
- **Features**: Medicine inventory, prescription fulfillment

#### `lab-technician/`
- **Purpose**: Lab technician dashboard
- **Files**: page.tsx, components
- **Features**: Lab tests, result recording

#### `api/`
- **Purpose**: API routes (if any)
- **Type**: Next.js API routes

---

### Components (client/components/)

#### `qr-scanner.tsx`
- **Purpose**: QR code scanning component
- **Library**: jsQR
- **Features**: Real-time camera access, QR decoding
- **Used by**: Nurse dashboard

#### `theme-provider.tsx`
- **Purpose**: Theme provider wrapper
- **Features**: Dark/light mode support
- **Type**: Context provider

#### `language-switcher.tsx`
- **Purpose**: Language selection component
- **Features**: Language switching, persistence
- **Type**: UI component

#### `logo.tsx`
- **Purpose**: Logo component
- **Type**: Reusable component

#### `ui/`
- **Purpose**: Shadcn UI components
- **Contents**: Button, Card, Dialog, Form, Input, etc.
- **Type**: Pre-built UI components

#### `admin/`, `doctor/`, `nurse/`, `patient/`
- **Purpose**: Role-specific components
- **Contents**: Dashboard components, forms, tables
- **Type**: Feature components

---

### Lib (client/lib/)

#### `auth-context.tsx`
- **Purpose**: Authentication context
- **Features**: User state, login/logout, token management
- **Type**: React Context

#### `language-context.tsx`
- **Purpose**: Language/i18n context
- **Features**: Language state, translation functions
- **Type**: React Context

#### `qr-generator.ts`
- **Purpose**: QR code generation utilities
- **Library**: qrcode.react
- **Functions**: Generate QR from patient ID

#### `types.ts`
- **Purpose**: TypeScript type definitions
- **Contents**: User, Patient, Doctor, Prescription types
- **Type**: Type definitions

#### `translations.ts`
- **Purpose**: Translation strings
- **Contents**: Multi-language strings
- **Type**: Data file

#### `utils.ts`
- **Purpose**: Utility functions
- **Contents**: Helper functions, formatters
- **Type**: Utility module

#### `mock-data.ts`
- **Purpose**: Mock data for development
- **Contents**: Sample users, patients, prescriptions
- **Type**: Development data

---

### Hooks (client/hooks/)

#### `use-mobile.ts`
- **Purpose**: Mobile detection hook
- **Features**: Responsive design detection
- **Type**: Custom hook

#### `use-toast.ts`
- **Purpose**: Toast notification hook
- **Features**: Show notifications
- **Type**: Custom hook

---

### Styles (client/styles/)

#### `globals.css`
- **Purpose**: Global styles
- **Features**: Tailwind CSS, custom styles
- **Type**: CSS file

---

### Config Files (client/)

#### `package.json`
- **Purpose**: Dependencies and scripts
- **Scripts**: dev, build, start, lint
- **Key Dependencies**: Next.js, React, Tailwind, Radix UI

#### `tsconfig.json`
- **Purpose**: TypeScript configuration
- **Features**: Path aliases, strict mode

#### `next.config.mjs`
- **Purpose**: Next.js configuration
- **Features**: Build settings, plugins

#### `postcss.config.mjs`
- **Purpose**: PostCSS configuration
- **Features**: Tailwind CSS setup

#### `components.json`
- **Purpose**: Shadcn UI configuration
- **Features**: Component aliases, styling

---

## 🔧 Backend Structure (server/src/)

### Config (server/src/config/)

#### `database.js` / `database.ts`
- **Purpose**: MongoDB connection
- **Features**: Mongoose connection, error handling
- **Exports**: connectDB function

---

### Middleware (server/src/middleware/)

#### `auth.js` / `auth.ts`
- **Purpose**: JWT authentication middleware
- **Features**: Token verification, role checking
- **Used by**: Protected routes

---

### Models (server/src/models/)

#### `User.js` / `User.ts`
- **Purpose**: User schema
- **Fields**: name, email, password, role
- **Methods**: Password hashing, validation

#### `Patient.js` / `Patient.ts`
- **Purpose**: Patient schema
- **Fields**: userId, patientId, qrCode, medicalHistory
- **Relations**: References User

#### `Doctor.js` / `Doctor.ts`
- **Purpose**: Doctor schema
- **Fields**: userId, specialization, licenseNumber, patientQueue
- **Relations**: References User

#### `Nurse.js` / `Nurse.ts`
- **Purpose**: Nurse schema
- **Fields**: userId, department, assignedPatients
- **Relations**: References User

#### `Pharmacist.js` / `Pharmacist.ts`
- **Purpose**: Pharmacist schema
- **Fields**: userId, licenseNumber
- **Relations**: References User

#### `LabTechnician.js` / `LabTechnician.ts`
- **Purpose**: Lab technician schema
- **Fields**: userId, department
- **Relations**: References User

#### `Admin.js` / `Admin.ts`
- **Purpose**: Admin schema
- **Fields**: userId, permissions
- **Relations**: References User

#### `Prescription.js` / `Prescription.ts`
- **Purpose**: Prescription schema
- **Fields**: doctorId, patientId, medicines, instructions
- **Relations**: References Doctor, Patient

#### `Vitals.js` / `Vitals.ts`
- **Purpose**: Vitals schema
- **Fields**: patientId, nurseId, BP, HR, temp, RR
- **Relations**: References Patient, Nurse

#### `Medicine.js` / `Medicine.ts`
- **Purpose**: Medicine schema
- **Fields**: name, quantity, expiry, price
- **Type**: Inventory item

#### `LabTest.js` / `LabTest.ts`
- **Purpose**: Lab test schema
- **Fields**: doctorId, patientId, testName, results
- **Relations**: References Doctor, Patient

#### `Visit.js` / `Visit.ts`
- **Purpose**: Visit schema
- **Fields**: patientId, department, roomNumber, waitTime
- **Relations**: References Patient

#### `Injection.js`
- **Purpose**: Injection schema
- **Fields**: patientId, doctorId, medicineId, dosage
- **Relations**: References Patient, Doctor

---

### Routes (server/src/routes/)

#### `auth.js` / `auth.ts`
- **Purpose**: Authentication endpoints
- **Endpoints**: POST /signup, POST /signin
- **Features**: User registration, login

#### `patients.js` / `patients.ts`
- **Purpose**: Patient endpoints
- **Endpoints**: GET, POST, PUT /patients
- **Features**: Patient CRUD, vitals, prescriptions

#### `doctors.js` / `doctors.ts`
- **Purpose**: Doctor endpoints
- **Endpoints**: GET /doctors, POST prescriptions
- **Features**: Doctor info, prescriptions

#### `nurses.js` (if exists)
- **Purpose**: Nurse endpoints
- **Endpoints**: GET /nurses
- **Features**: Nurse info

#### `prescriptions.js` / `prescriptions.ts`
- **Purpose**: Prescription endpoints
- **Endpoints**: GET, PUT, DELETE /prescriptions
- **Features**: Prescription management

#### `vitals.js` / `vitals.ts`
- **Purpose**: Vitals endpoints
- **Endpoints**: POST, GET, PUT /vitals
- **Features**: Vitals recording, retrieval

#### `medicines.js` / `medicines.ts`
- **Purpose**: Medicine endpoints
- **Endpoints**: GET, POST, PUT, DELETE /medicines
- **Features**: Inventory management

#### `lab-tests.js` / `lab-tests.ts`
- **Purpose**: Lab test endpoints
- **Endpoints**: GET, POST, PUT /lab-tests
- **Features**: Test management

#### `visits.js` / `visits.ts`
- **Purpose**: Visit endpoints
- **Endpoints**: POST /visits, GET /visits/navigation/:patientId
- **Features**: Visit scheduling, navigation

---

### Services (server/src/services/)

#### `websocket.js`
- **Purpose**: WebSocket management
- **Features**: Connection handling, event broadcasting
- **Events**: register, ping, wait-time-update, navigation-update

#### `hospitalNavigation.js`
- **Purpose**: Hospital navigation generation
- **Features**: Department assignment, room allocation
- **Used by**: Visit routes

---

### Main Files (server/src/)

#### `index.js` / `index.ts`
- **Purpose**: Main server file
- **Features**: Express setup, route mounting, WebSocket setup
- **Port**: 5000

#### `seed.js`
- **Purpose**: Database seeding
- **Features**: Initial data population
- **Usage**: npm run seed (if available)

---

### Config Files (server/)

#### `package.json`
- **Purpose**: Dependencies and scripts
- **Scripts**: dev, start
- **Key Dependencies**: Express, Mongoose, JWT, bcryptjs

#### `tsconfig.json`
- **Purpose**: TypeScript configuration
- **Features**: Compilation settings

#### `.env`
- **Purpose**: Environment variables
- **Variables**: MONGODB_URI, PORT, JWT_SECRET

#### `.env.example`
- **Purpose**: Example environment file
- **Usage**: Copy to .env and configure

---

### Documentation (server/)

#### `README.md`
- **Purpose**: Backend documentation
- **Contents**: Setup, features, API overview

#### `API_DOCUMENTATION.md`
- **Purpose**: Complete API reference
- **Contents**: All 31 endpoints with examples

---

## 📚 Root Documentation Files

### Quick Start Guides
- `START_HERE.md` - Quick start guide
- `QUICK_REFERENCE.md` - Quick commands
- `QUICK_START.md` - Setup instructions

### Setup & Installation
- `SETUP_GUIDE.md` - Complete setup guide
- `BACKEND_SETUP_SUMMARY.md` - Backend overview

### Project Documentation
- `README.md` - Main overview
- `PROJECT_SUMMARY.md` - Project summary
- `DOCUMENTATION_INDEX.md` - Documentation index

### Feature Documentation
- `QR_CODE_FEATURE.md` - QR code feature
- `NURSE_QR_SCANNER_IMPLEMENTATION.md` - QR scanner
- `DOCTOR_QUEUE_SYSTEM_COMPLETE.md` - Doctor queue
- `REALTIME_UPDATES_IMPLEMENTATION.md` - Real-time updates

### Data & Models
- `DATA_MODELS.md` - Database schema
- `PATIENT_BACKEND_SYSTEM.md` - Patient system

### Implementation Status
- `IMPLEMENTATION_COMPLETE.md` - Implementation status
- `FEATURE_COMPLETE_SUMMARY.md` - Feature summary
- `FINAL_SUMMARY.md` - Final summary

---

## 🧪 Test Files (root/)

- `test_signup.js` - Signup testing
- `test_signup.html` - Signup HTML test
- `test_nurse_login.js` - Nurse login testing
- `test_nurse_login_direct.html` - Direct nurse login test
- `test_doctor_assignment.js` - Doctor assignment testing
- `test_fetch_patient.js` - Patient fetch testing

---

## 📊 Summary

| Layer | Files | Purpose |
|-------|-------|---------|
| Frontend | 50+ | Next.js app, components, hooks |
| Backend | 30+ | Express routes, models, middleware |
| Config | 10+ | Environment, build, package configs |
| Docs | 50+ | Guides, API docs, implementation notes |
| Tests | 5+ | API testing files |

---

**File Structure Guide Complete** ✅

