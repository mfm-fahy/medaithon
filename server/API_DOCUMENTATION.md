# Hospital Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/signup` and `/auth/signin`) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "patient",
  "age": 35,
  "sex": "male",
  "phone": "+1234567890",
  "occupation": "Engineer",
  "address": "123 Main St, City"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "name": "John Doe"
  }
}
```

### 2. Sign In
**POST** `/auth/signin`

Sign in with username and password.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "name": "John Doe"
  }
}
```

---

## Patient Endpoints

### 1. Get All Patients
**GET** `/patients`

Requires: `admin`, `doctor`, or `nurse` role

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "john_doe",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "patientId": "P1729689600000",
    "age": 35,
    "sex": "male",
    "phone": "+1234567890",
    "occupation": "Engineer",
    "address": "123 Main St, City",
    "createdAt": "2024-10-23T10:00:00Z"
  }
]
```

### 2. Get Patient by ID
**GET** `/patients/:id`

**Response:** Single patient object

### 3. Update Patient
**PUT** `/patients/:id`

Requires: `patient` or `admin` role

**Request Body:**
```json
{
  "age": 36,
  "phone": "+1234567891",
  "address": "456 Oak Ave, City"
}
```

### 4. Get Patient Vitals
**GET** `/patients/:id/vitals`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "patientId": "507f1f77bcf86cd799439011",
    "height": 180,
    "weight": 75,
    "temperature": 98.6,
    "bloodPressure": "120/80",
    "heartRate": 72,
    "respiratoryRate": 16,
    "pulse": 72,
    "recordedAt": "2024-10-23T10:00:00Z"
  }
]
```

### 5. Get Patient Prescriptions
**GET** `/patients/:id/prescriptions`

### 6. Get Patient Lab Tests
**GET** `/patients/:id/lab-tests`

---

## Doctor Endpoints

### 1. Get All Doctors
**GET** `/doctors`

### 2. Get Doctor by ID
**GET** `/doctors/:id`

### 3. Update Doctor
**PUT** `/doctors/:id`

Requires: `doctor` or `admin` role

### 4. Create Prescription
**POST** `/doctors/:id/prescriptions`

Requires: `doctor` role

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "medicine": "Aspirin",
  "route": "Oral",
  "dose": "500mg",
  "frequency": "Twice daily",
  "duration": "7 days",
  "advice": "Take with food"
}
```

### 5. Get Doctor Prescriptions
**GET** `/doctors/:id/prescriptions`

Requires: `doctor` or `admin` role

---

## Prescription Endpoints

### 1. Get All Prescriptions
**GET** `/prescriptions`

Requires: `admin`, `doctor`, or `pharmacist` role

### 2. Get Prescription by ID
**GET** `/prescriptions/:id`

### 3. Update Prescription
**PUT** `/prescriptions/:id`

Requires: `doctor` or `admin` role

### 4. Delete Prescription
**DELETE** `/prescriptions/:id`

Requires: `doctor` or `admin` role

---

## Vitals Endpoints

### 1. Get All Vitals
**GET** `/vitals`

Requires: `admin`, `doctor`, or `nurse` role

### 2. Record Vitals
**POST** `/vitals`

Requires: `nurse` role

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "height": 180,
  "weight": 75,
  "temperature": 98.6,
  "bloodPressure": "120/80",
  "heartRate": 72,
  "respiratoryRate": 16,
  "pulse": 72
}
```

### 3. Get Vitals by ID
**GET** `/vitals/:id`

### 4. Update Vitals
**PUT** `/vitals/:id`

Requires: `nurse` or `admin` role

---

## Medicine Endpoints

### 1. Get All Medicines
**GET** `/medicines`

### 2. Add Medicine
**POST** `/medicines`

Requires: `pharmacist` or `admin` role

**Request Body:**
```json
{
  "chemicalName": "Acetylsalicylic Acid",
  "brandName": "Aspirin",
  "quantity": 100,
  "price": 5.99,
  "manufacturer": "Bayer",
  "batchNumber": "BATCH123"
}
```

### 3. Get Medicine by ID
**GET** `/medicines/:id`

### 4. Update Medicine
**PUT** `/medicines/:id`

Requires: `pharmacist` or `admin` role

### 5. Delete Medicine
**DELETE** `/medicines/:id`

Requires: `pharmacist` or `admin` role

---

## Lab Test Endpoints

### 1. Get All Lab Tests
**GET** `/lab-tests`

Requires: `admin`, `doctor`, or `labTechnician` role

### 2. Create Lab Test
**POST** `/lab-tests`

Requires: `doctor` or `admin` role

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "testName": "Complete Blood Count",
  "sampleType": "Blood",
  "estimatedTime": "2 hours"
}
```

### 3. Get Lab Test by ID
**GET** `/lab-tests/:id`

### 4. Update Lab Test
**PUT** `/lab-tests/:id`

Requires: `labTechnician` or `admin` role

**Request Body:**
```json
{
  "status": "completed",
  "result": "Normal",
  "resultDate": "2024-10-23T10:00:00Z"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Error message",
  "error": {}
}
```

---

## User Roles

- **patient**: Can view own information
- **doctor**: Can create prescriptions, view patients
- **nurse**: Can record vitals
- **pharmacist**: Can manage medicines
- **labTechnician**: Can manage lab tests
- **admin**: Full access to all endpoints

