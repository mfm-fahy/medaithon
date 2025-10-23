# Hospital Management System - Backend

A comprehensive Node.js/Express backend for a hospital management system with MongoDB integration.

## Features

- **User Authentication**: Sign up and sign in for different user roles
- **Role-Based Access Control**: Patient, Doctor, Nurse, Pharmacist, Lab Technician, Admin
- **Patient Management**: Store and manage patient information
- **Prescriptions**: Doctors can create and manage prescriptions
- **Vitals Tracking**: Nurses can record patient vitals
- **Medicine Inventory**: Pharmacists can manage medicine inventory
- **Lab Tests**: Lab technicians can manage lab tests and results
- **MongoDB Integration**: All data stored in MongoDB

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/:id/vitals` - Get patient vitals
- `GET /api/patients/:id/prescriptions` - Get patient prescriptions
- `GET /api/patients/:id/lab-tests` - Get patient lab tests

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `POST /api/doctors/:id/prescriptions` - Create prescription
- `GET /api/doctors/:id/prescriptions` - Get doctor prescriptions

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Vitals
- `GET /api/vitals` - Get all vitals
- `POST /api/vitals` - Record vitals
- `GET /api/vitals/:id` - Get vitals by ID
- `PUT /api/vitals/:id` - Update vitals

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Add medicine
- `GET /api/medicines/:id` - Get medicine by ID
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `POST /api/lab-tests` - Create lab test
- `GET /api/lab-tests/:id` - Get lab test by ID
- `PUT /api/lab-tests/:id` - Update lab test

## Database Models

- **User**: Base user model with authentication
- **Patient**: Patient-specific information
- **Doctor**: Doctor-specific information
- **Nurse**: Nurse-specific information
- **Pharmacist**: Pharmacist-specific information
- **LabTechnician**: Lab technician-specific information
- **Admin**: Admin-specific information
- **Prescription**: Medicine prescriptions
- **Vitals**: Patient vital signs
- **Medicine**: Medicine inventory
- **LabTest**: Lab test records

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access

- **Patient**: Can view own information
- **Doctor**: Can create prescriptions, view patients
- **Nurse**: Can record vitals
- **Pharmacist**: Can manage medicines
- **Lab Technician**: Can manage lab tests
- **Admin**: Full access to all endpoints

