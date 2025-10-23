# 🔐 QUICK LOGIN GUIDE

## 🚀 Get Started in 30 Seconds

### Step 1: Open Frontend
```
http://localhost:3001
```

### Step 2: Click Sign In

### Step 3: Choose Your Role & Login

---

## 📋 All Credentials

| Role | Username | Password |
|------|----------|----------|
| 👤 Patient | `patient_john` | `password123` |
| 👨‍⚕️ Doctor | `dr_smith` | `password123` |
| 👩‍⚕️ Nurse | `nurse_alice` | `password123` |
| 💊 Pharmacist | `pharmacist_mike` | `password123` |
| 🧪 Lab Tech | `lab_tech_sarah` | `password123` |
| 🔧 Admin | `admin` | `admin123` |

---

## 🎯 What Each Role Can Do

### 👤 Patient
- View health records
- Check appointments
- View prescriptions
- See lab results
- Real-time navigation

### 👨‍⚕️ Doctor
- View patient records
- Create prescriptions
- Order lab tests
- Update medical history

### 👩‍⚕️ Nurse
- Scan QR codes
- Record vitals
- Assign doctors
- Update navigation

### 💊 Pharmacist
- View prescriptions
- Manage inventory
- Dispense medications
- Track history

### 🧪 Lab Tech
- Create lab tests
- Update status
- Upload results
- View history

### 🔧 Admin
- Manage users
- View statistics
- System settings
- Audit logs

---

## 🧪 Test Scenarios

### Scenario 1: Complete Patient Journey
1. Login as **nurse_alice**
2. Scan patient QR code
3. Record vitals
4. Assign doctor (Cardiology, Room C205)
5. Login as **patient_john**
6. See real-time navigation update ✨

### Scenario 2: Doctor Workflow
1. Login as **dr_smith**
2. View patient records
3. Create prescription
4. Order lab test

### Scenario 3: Lab Test
1. Login as **lab_tech_sarah**
2. View lab test orders
3. Update test status
4. Upload results

### Scenario 4: Pharmacy
1. Login as **pharmacist_mike**
2. View prescriptions
3. Dispense medications

---

## 🚀 System Status

- ✅ Backend: Port 5000
- ✅ Frontend: Port 3001
- ✅ MongoDB: Connected
- ✅ All Users: Ready
- ✅ Real-time Updates: Working

---

## 📊 Database Info

- 6 users created
- 6 role-specific records
- All passwords hashed
- All emails unique
- All usernames unique

---

## 🔐 Security

- ✅ Password hashing
- ✅ JWT authentication
- ✅ Role-based access
- ✅ License numbers
- ✅ Audit trail

---

## 📞 Troubleshooting

### Can't Login?
1. Check username spelling
2. Verify password (case-sensitive)
3. Check backend is running (port 5000)
4. Check frontend is running (port 3001)
5. Try refreshing page

### Backend Not Running?
```
cd server
npm run dev
```

### Frontend Not Running?
```
cd client
npm run dev
```

---

## 🎉 Ready to Test!

Pick a role and start testing! 🚀

**Recommended First Test**:
1. Login as nurse_alice
2. Scan patient QR code
3. Assign doctor
4. Login as patient_john
5. See real-time update ✨

---

## 📝 Notes

- All passwords are `password123` except admin (`admin123`)
- Patient ID: P1761237436154
- All users have proper role-specific records
- Real-time WebSocket updates working
- QR code scanning functional

**Happy Testing!** 🎉

