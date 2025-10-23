# 🚀 Quick Reference Guide

## Starting the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:3000
```

### Terminal 3 - MongoDB
```bash
mongod
# Connects to mongodb://localhost:27017
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web application |
| Backend API | http://localhost:5000/api | REST API |
| Health Check | http://localhost:5000/health | Server status |
| MongoDB | mongodb://localhost:27017 | Database |

---

## 📝 API Quick Commands

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "patient",
    "age": 35,
    "sex": "male",
    "phone": "+1234567890",
    "occupation": "Engineer",
    "address": "123 Main St"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Get Patients (with token)
```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 Test User Credentials

### Patient
- Username: `john_doe`
- Password: `password123`
- Role: `patient`

### Doctor
- Username: `dr_smith`
- Password: `password123`
- Role: `doctor`

### Nurse
- Username: `nurse_alice`
- Password: `password123`
- Role: `nurse`

### Admin
- Username: `admin`
- Password: `admin123`
- Role: `admin`

---

## 📊 Database Collections

```
Users
├── Patients
├── Doctors
├── Nurses
├── Pharmacists
├── LabTechnicians
├── Admins
├── Prescriptions
├── Vitals
├── Medicines
└── LabTests
```

---

## 🔐 User Roles & Permissions

| Role | Can Access |
|------|-----------|
| **Patient** | Own profile, vitals, prescriptions, lab tests |
| **Doctor** | Patients, create prescriptions, view vitals |
| **Nurse** | Record vitals, view patient info |
| **Pharmacist** | Medicines, prescriptions |
| **Lab Technician** | Lab tests, results |
| **Admin** | Everything |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main overview |
| SETUP_GUIDE.md | Setup instructions |
| BACKEND_SETUP_SUMMARY.md | Backend details |
| DATA_MODELS.md | Database schema |
| API_DOCUMENTATION.md | API reference |
| IMPLEMENTATION_COMPLETE.md | Implementation status |
| QUICK_REFERENCE.md | This file |

---

## 🛠️ Common Commands

### Backend
```bash
cd server
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Run linter
```

### Frontend
```bash
cd client
npm install --legacy-peer-deps    # Install dependencies
npm run dev                       # Start development server
npm run build                     # Build for production
npm start                         # Run production build
npm run lint                      # Run linter
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>
```

### MongoDB connection error
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in server/.env
```

### Frontend won't connect to backend
```bash
# Ensure backend is running
curl http://localhost:5000/health

# Check CORS settings in server/src/index.ts
```

---

## 📋 API Endpoint Categories

### Authentication (2)
- POST /auth/signup
- POST /auth/signin

### Patients (6)
- GET /patients
- GET /patients/:id
- PUT /patients/:id
- GET /patients/:id/vitals
- GET /patients/:id/prescriptions
- GET /patients/:id/lab-tests

### Doctors (5)
- GET /doctors
- GET /doctors/:id
- PUT /doctors/:id
- POST /doctors/:id/prescriptions
- GET /doctors/:id/prescriptions

### Prescriptions (4)
- GET /prescriptions
- GET /prescriptions/:id
- PUT /prescriptions/:id
- DELETE /prescriptions/:id

### Vitals (4)
- GET /vitals
- POST /vitals
- GET /vitals/:id
- PUT /vitals/:id

### Medicines (5)
- GET /medicines
- POST /medicines
- GET /medicines/:id
- PUT /medicines/:id
- DELETE /medicines/:id

### Lab Tests (4)
- GET /lab-tests
- POST /lab-tests
- GET /lab-tests/:id
- PUT /lab-tests/:id

---

## 🔑 Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=hospital_management_secret_key_2024_change_in_production
NODE_ENV=development
```

---

## 📱 Frontend Routes

```
/                    Home page
/patient/signin      Patient login
/doctor/signin       Doctor login
/nurse/signin        Nurse login
/admin/signin        Admin login
/pharmacist/signin   Pharmacist login
/lab-technician/signin  Lab technician login

/patient/dashboard   Patient dashboard
/doctor/dashboard    Doctor dashboard
/nurse/dashboard     Nurse dashboard
/admin/dashboard     Admin dashboard
/pharmacist/dashboard Pharmacist dashboard
/lab-technician/dashboard Lab technician dashboard
```

---

## 💾 Data Stored in MongoDB

✅ Patient information (name, age, sex, phone, address, medical history)
✅ Doctor details (specialization, license, department)
✅ Prescriptions (medicine, dose, frequency, duration, advice)
✅ Vitals (height, weight, temperature, BP, heart rate, etc.)
✅ Medicines (chemical name, brand, quantity, price, expiry)
✅ Lab tests (test name, sample type, status, results)
✅ User accounts (username, email, password hash, role)
✅ All timestamps and audit trails

---

## 🎯 Status Check

```bash
# Check backend
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3000

# Check MongoDB
mongosh
```

---

## 📞 Support

1. Check documentation files
2. Review API_DOCUMENTATION.md
3. Check server logs for errors
4. Verify MongoDB is running
5. Ensure ports 3000 and 5000 are available

---

**Last Updated**: October 23, 2024
**Status**: ✅ All Systems Running

