# Quick Start Guide - Patient Queue & QR Scanning

## 🚀 Getting Started

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3001`
- MongoDB connected

### Start Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 📍 Access Patient Queue Pages

### For Doctors
**URL**: `http://localhost:3001/doctor/patients`

**Features**:
- View all patients
- Scan QR code to find patient
- Update medical history
- Update allergies
- Real-time patient list

**Steps**:
1. Login as doctor
2. Navigate to `/doctor/patients`
3. Click "Scan QR Code" or select patient from list
4. Update medical history/allergies
5. Click "Update Patient"

---

### For Nurses
**URL**: `http://localhost:3001/nurse/patients`

**Features**:
- View all patients
- Scan QR code to find patient
- Add nursing notes
- View patient information
- Real-time patient list

**Steps**:
1. Login as nurse
2. Navigate to `/nurse/patients`
3. Scan QR code or select patient
4. Add nursing notes
5. Click "Update Patient"

---

### For Lab Technicians
**URL**: `http://localhost:3001/lab-technician/patients`

**Features**:
- View all patients
- Scan QR code to find patient
- Add lab test results
- View allergies
- Real-time patient list

**Steps**:
1. Login as lab technician
2. Navigate to `/lab-technician/patients`
3. Scan QR code or select patient
4. Add lab notes
5. Click "Add Lab Notes"

---

### For Admin
**URL**: `http://localhost:3001/admin/patients`

**Features**:
- View all patients in system
- Search by name, patient ID, or phone
- Update medical history
- Update allergies
- Full patient management

**Steps**:
1. Login as admin
2. Navigate to `/admin/patients`
3. Search for patient
4. Update information
5. Click "Update Patient"

---

## 🔍 QR Code Scanning

### How to Scan:
1. Click "Scan QR Code" button
2. Allow camera access
3. Point camera at patient's QR code
4. System automatically detects and loads patient

### Manual Entry:
If camera not available:
1. Click "Scan QR Code"
2. Scroll to "Or enter Patient ID manually"
3. Enter Patient ID (format: P{timestamp})
4. Click "Search Patient"

---

## 📋 Patient ID Format

Patient IDs are generated in format: `P{timestamp}`

Example: `P1729689600000`

- Generated during patient signup
- Unique for each patient
- Encoded in QR code
- Used for manual search

---

## 🔐 Login Credentials

### Test Accounts:
```
Doctor:
- Username: doctor1
- Password: password123

Nurse:
- Username: nurse1
- Password: password123

Lab Technician:
- Username: labtech1
- Password: password123

Admin:
- Username: admin1
- Password: password123

Patient:
- Username: patient1
- Password: password123
```

---

## 🛠️ API Endpoints

### Get Patient by QR Code
```
GET /api/patients/qr/:patientId
Headers: Authorization: Bearer {token}
```

### Update Patient by QR Code
```
PUT /api/patients/qr/:patientId
Headers: Authorization: Bearer {token}
Body: {
  "medicalHistory": "...",
  "allergies": ["..."],
  "notes": "..."
}
```

---

## ⚠️ Troubleshooting

### QR Scanner Not Working
- Check camera permissions
- Try manual Patient ID entry
- Ensure patient ID format is correct (P{timestamp})

### Patient Not Found
- Verify patient ID is correct
- Check patient exists in system
- Ensure you're logged in with correct role

### Updates Not Saving
- Check network connection
- Verify backend is running
- Check browser console for errors
- Ensure you have permission for that role

### Port Already in Use
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID {PID} /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify all servers are running
4. Check network connectivity

---

## ✅ Feature Checklist

- [x] QR code scanning
- [x] Patient queue views
- [x] Role-based access control
- [x] Patient search
- [x] Medical history updates
- [x] Allergy management
- [x] Lab notes
- [x] Nursing notes
- [x] Real-time patient lists
- [x] Error handling

**Status**: ✅ All features ready for testing!

