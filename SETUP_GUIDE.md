# Hospital Management System - Complete Setup Guide

## 📋 Overview

This is a full-stack hospital management system with:
- **Frontend**: Next.js React application (already running on port 3000)
- **Backend**: Node.js/Express API (running on port 5000)
- **Database**: MongoDB (for data persistence)

---

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:5000`

**Output:**
```
> hospital-management-server@1.0.0 dev
> ts-node src/index.ts
Server is running on port 5000
```

### 2. Start the Frontend Client

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-management
```

---

## 📁 Project Structure

```
hospital-management/
├── client/                  # Next.js Frontend
│   ├── app/                # App routes
│   ├── components/         # React components
│   ├── lib/                # Utilities and types
│   ├── package.json
│   └── ...
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Authentication middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Main server file
│   ├── .env               # Environment variables
│   ├── package.json
│   └── ...
├── BACKEND_SETUP_SUMMARY.md
├── SETUP_GUIDE.md
└── ...
```

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=hospital_management_secret_key_2024_change_in_production
NODE_ENV=development
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

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
- `GET /doctors/:id` - Get doctor details
- `POST /doctors/:id/prescriptions` - Create prescription
- `GET /doctors/:id/prescriptions` - Get doctor's prescriptions

### Prescriptions
- `GET /prescriptions` - Get all prescriptions
- `GET /prescriptions/:id` - Get prescription details
- `PUT /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Delete prescription

### Vitals
- `GET /vitals` - Get all vitals
- `POST /vitals` - Record vitals
- `GET /vitals/:id` - Get vitals details
- `PUT /vitals/:id` - Update vitals

### Medicines
- `GET /medicines` - Get all medicines
- `POST /medicines` - Add medicine
- `GET /medicines/:id` - Get medicine details
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine

### Lab Tests
- `GET /lab-tests` - Get all lab tests
- `POST /lab-tests` - Create lab test
- `GET /lab-tests/:id` - Get lab test details
- `PUT /lab-tests/:id` - Update lab test

---

## 👥 User Roles

1. **Patient**
   - Sign up and manage own profile
   - View own vitals, prescriptions, lab tests
   - Access medical records

2. **Doctor**
   - View patient information
   - Create and manage prescriptions
   - View patient vitals and lab tests

3. **Nurse**
   - Record patient vitals
   - View patient information
   - Update vital signs

4. **Pharmacist**
   - Manage medicine inventory
   - View prescriptions
   - Dispense medicines

5. **Lab Technician**
   - Create and manage lab tests
   - Upload test results
   - Update test status

6. **Admin**
   - Full access to all features
   - Manage all users
   - System administration

---

## 🧪 Testing the API

### Using cURL

#### Sign Up
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
    "address": "123 Main St, City"
  }'
```

#### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

#### Get Patients (with token)
```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API endpoints
2. Set up environment variables for `BASE_URL` and `TOKEN`
3. Test each endpoint

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Ensure Node.js is installed: `node --version`
- Check for TypeScript errors: `npm run build`

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `server/src/index.ts`
- Verify API endpoints in frontend code

### Port already in use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## 📦 Dependencies

### Frontend
- Next.js 16.0.0
- React 19.2.0
- TypeScript 5.3.3
- Tailwind CSS 4.1.9
- Radix UI components

### Backend
- Express 4.18.2
- Mongoose 7.5.0
- TypeScript 5.3.3
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3

---

## 🔒 Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` for production
2. **Use HTTPS**: Enable SSL/TLS in production
3. **Password Hashing**: All passwords are hashed with bcryptjs
4. **Token Expiration**: JWT tokens expire after 7 days
5. **CORS**: Configure CORS for specific domains in production
6. **Input Validation**: All inputs are validated on the backend

---

## 📝 Development Workflow

1. **Make changes to backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Make changes to frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Build for production**:
   ```bash
   # Backend
   cd server
   npm run build
   
   # Frontend
   cd client
   npm run build
   ```

---

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd server
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
cd client
vercel
```

---

## 📞 Support

For issues or questions:
1. Check the API documentation in `server/API_DOCUMENTATION.md`
2. Review the backend setup summary in `BACKEND_SETUP_SUMMARY.md`
3. Check error logs in terminal output

---

## ✅ Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected (or connection attempted)
- [ ] Can sign up new user
- [ ] Can sign in with credentials
- [ ] Can access protected endpoints with token
- [ ] All API endpoints responding correctly

---

## 🎉 You're All Set!

The hospital management system is now ready to use. Start both servers and begin managing patient data!

