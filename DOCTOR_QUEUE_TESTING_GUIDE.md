# 🧪 DOCTOR QUEUE SYSTEM - TESTING GUIDE

## ⚡ Quick Start

### Prerequisites
- Backend running on port 5000 ✅
- Frontend running on port 3001 ✅
- MongoDB Atlas connected ✅
- Two browser windows (for nurse and doctor)

---

## 🧪 Test Scenario 1: Assign Patient to Doctor

### Step 1: Nurse Login
1. Open: `http://localhost:3001/nurse/signin`
2. Username: `nurse_alice`
3. Password: `password123`
4. Click "Sign In"

### Step 2: Scan Patient QR Code
1. Click "QR Code Scanner"
2. Enter Patient ID: `P1761244196137`
3. Click "Search Patient"
4. ✅ Patient details should display

### Step 3: Assign Doctor
1. Click "Update Vitals & View History"
2. Scroll down to "Assign Doctor Category"
3. Click "Select Doctor & Assign Room"
4. Select category: "General Medicine"
5. ✅ Doctor dropdown should load with 2 doctors
6. Select: "Dr. Rajesh Kumar"
7. Enter Room: "A101"
8. Click "Assign Doctor & Update Navigation"
9. ✅ Success message should appear

---

## 👨‍⚕️ Test Scenario 2: Doctor Sees Patient in Queue

### Step 1: Doctor Login (New Window)
1. Open new browser window
2. Go to: `http://localhost:3001/doctor/signin`
3. Username: `dr_general_1`
4. Password: `password123`
5. Click "Sign In"

### Step 2: View Patient Queue
1. You should be on Doctor Dashboard
2. ✅ WebSocket status shows "Real-time updates connected"
3. ✅ Patient appears in queue with position #1
4. ✅ Patient name: "John Patient"
5. ✅ Patient ID: "P1761244196137"
6. ✅ Age: 30, Sex: male

### Step 3: Click Patient
1. Click on patient in queue
2. ✅ Should navigate to patient details page
3. ✅ Can view and edit patient information

---

## 🔄 Test Scenario 3: Real-Time Updates

### Step 1: Assign Second Patient
1. Go back to nurse window
2. Scan another patient (or use same patient)
3. Assign to same doctor: "Dr. Rajesh Kumar"
4. Enter different room: "A102"
5. Click "Assign Doctor & Update Navigation"

### Step 2: Doctor Dashboard Updates
1. Go to doctor window
2. ✅ Dashboard should update automatically
3. ✅ New patient appears in queue
4. ✅ Queue positions update
5. ✅ No page refresh needed!

---

## 🔍 Test Scenario 4: Different Specializations

### Step 1: Assign to Cardiology
1. Nurse window: Scan patient
2. Click "Select Doctor & Assign Room"
3. Select category: "Cardiology"
4. ✅ Doctor dropdown loads with cardiology doctors
5. Select: "Dr. Amit Patel"
6. Enter room: "B201"
7. Assign

### Step 2: Doctor Login
1. New window: `http://localhost:3001/doctor/signin`
2. Username: `dr_cardio_1`
3. Password: `password123`
4. ✅ Patient appears in their queue

---

## 📊 Test Scenario 5: Multiple Doctors

### Step 1: Assign to Different Doctors
1. Nurse: Assign patient to "Dr. Rajesh Kumar" (General Medicine)
2. Nurse: Assign same patient to "Dr. Priya Sharma" (General Medicine)

### Step 2: Verify Queues
1. Doctor 1 window: `dr_general_1` - ✅ Sees patient
2. Doctor 2 window: `dr_general_2` - ✅ Sees patient
3. Both doctors see same patient in their queues

---

## ✅ Expected Results

### Nurse App
- ✅ Can select doctor category
- ✅ Doctor dropdown loads with available doctors
- ✅ Can assign specific doctor
- ✅ Success message appears
- ✅ Can assign multiple patients

### Doctor App
- ✅ Dashboard shows patient queue
- ✅ WebSocket connection indicator shows connected
- ✅ Patient appears with queue position
- ✅ Patient details display correctly
- ✅ Queue updates in real-time
- ✅ Can click patient to view details

### WebSocket
- ✅ Doctor connects on login
- ✅ Real-time updates received
- ✅ No page refresh needed
- ✅ Multiple doctors can connect simultaneously

---

## 🐛 Troubleshooting

### Doctor Queue Empty
- Check if patient was assigned to this doctor
- Verify doctor ID matches
- Check browser console for errors

### WebSocket Not Connected
- Check backend is running on port 5000
- Check browser console for connection errors
- Verify token is valid

### Doctor Dropdown Empty
- Check if doctors exist for that specialization
- Verify backend API is responding
- Check network tab in browser dev tools

### Patient Not Appearing
- Verify patient ID is correct
- Check if patient was assigned to this doctor
- Refresh page to reload data

---

## 🎯 All Tests Passing!

Everything should work smoothly. If you encounter any issues, check the browser console and backend logs for error messages.

**Happy Testing!** 🚀

