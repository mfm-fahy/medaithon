# 🧪 COMPLETE TESTING GUIDE - DOCTOR QUEUE SYSTEM

## 📋 Test Credentials

### Doctors (All specializations)
```
General Medicine:
  dr_general_1 / password123 (Dr. Rajesh Kumar)
  dr_general_2 / password123 (Dr. Priya Sharma)

Cardiology:
  dr_cardio_1 / password123 (Dr. Amit Patel)
  dr_cardio_2 / password123 (Dr. Neha Gupta)

Orthopedics:
  dr_ortho_1 / password123 (Dr. Vikram Singh)
  dr_ortho_2 / password123 (Dr. Anjali Verma)

Pediatrics:
  dr_pedia_1 / password123 (Dr. Suresh Nair)
  dr_pedia_2 / password123 (Dr. Meera Iyer)

Neurology:
  dr_neuro_1 / password123 (Dr. Arjun Desai)
  dr_neuro_2 / password123 (Dr. Divya Reddy)

General Surgery:
  dr_surgery_1 / password123 (Dr. Rohan Malhotra)
  dr_surgery_2 / password123 (Dr. Kavya Menon)

Radiology:
  dr_radio_1 / password123 (Dr. Sanjay Bhat)
  dr_radio_2 / password123 (Dr. Pooja Saxena)

Emergency:
  dr_emergency_1 / password123 (Dr. Nikhil Joshi)
  dr_emergency_2 / password123 (Dr. Riya Chopra)
```

### Nurse
```
nurse_alice / password123
```

### Patient
```
patient_john / password123
```

---

## 🧪 Test Scenario 1: Basic Queue Display

### Steps
1. **Doctor Login**
   - URL: `http://localhost:3000/doctor/signin`
   - Username: `dr_general_1`
   - Password: `password123`

2. **Verify Dashboard**
   - ✅ Doctor name displays
   - ✅ Specialization shows
   - ✅ Current time displays
   - ✅ Waiting patients count shows
   - ✅ WebSocket status shows "Real-time updates connected"

3. **Check Queue**
   - ✅ Patient queue card visible
   - ✅ Refresh button present
   - ✅ "No patients in queue" message if empty

---

## 🧪 Test Scenario 2: Nurse Assigns Patient

### Steps
1. **Nurse Login**
   - URL: `http://localhost:3000/nurse/signin`
   - Username: `nurse_alice`
   - Password: `password123`

2. **Scan Patient**
   - Click "QR Code Scanner"
   - Enter Patient ID: `P1761244196137`
   - Click "Search Patient"

3. **Assign Doctor**
   - Click "Update Vitals & View History"
   - Click "Select Doctor & Assign Room"
   - Select Category: "General Medicine"
   - Select Doctor: "Dr. Rajesh Kumar"
   - Enter Room: "A101"
   - Click "Assign Doctor & Update Navigation"

4. **Verify Assignment**
   - ✅ Success message appears
   - ✅ Patient assigned to doctor

---

## 🧪 Test Scenario 3: Doctor Sees Patient in Queue

### Steps
1. **Doctor Dashboard**
   - Go to: `http://localhost:3000/doctor/dashboard`
   - Login: `dr_general_1` / `password123`

2. **Verify Patient Appears**
   - ✅ Patient appears in queue
   - ✅ Queue position shows "1"
   - ✅ Patient name displays
   - ✅ Patient ID displays
   - ✅ Age and sex display
   - ✅ Room and floor display

3. **Check Buttons**
   - ✅ "View" button present
   - ✅ "Complete" button present
   - ✅ "Refresh Queue" button present

---

## 🧪 Test Scenario 4: Refresh Queue

### Steps
1. **Click Refresh Button**
   - Click "Refresh Queue" button
   - ✅ Loading spinner appears
   - ✅ Button disabled during refresh

2. **Verify Update**
   - ✅ Queue updates
   - ✅ Button becomes enabled
   - ✅ Latest data displayed

---

## 🧪 Test Scenario 5: Complete Patient

### Steps
1. **Click Complete Button**
   - Click "Complete" button on patient
   - ✅ Patient removed from queue
   - ✅ Queue becomes empty

2. **Verify Completed Tracker**
   - ✅ "Completed Patients" card appears
   - ✅ Shows count: "1 patient completed"

---

## 🧪 Test Scenario 6: Multiple Patients

### Steps
1. **Assign Multiple Patients**
   - Nurse assigns 3 patients to same doctor
   - Each with different room numbers

2. **Verify Queue**
   - ✅ All 3 patients appear
   - ✅ Queue positions: 1, 2, 3
   - ✅ Different room numbers display

3. **Complete Patients**
   - Complete patient #1
   - ✅ Patient #2 becomes position #1
   - ✅ Patient #3 becomes position #2
   - ✅ Completed count increases

---

## 🧪 Test Scenario 7: Real-Time Updates

### Steps
1. **Open Two Browsers**
   - Browser 1: Doctor dashboard (logged in)
   - Browser 2: Nurse app (logged in)

2. **Assign Patient from Browser 2**
   - Nurse assigns patient to doctor
   - ✅ Patient appears in Browser 1 automatically
   - ✅ No manual refresh needed
   - ✅ WebSocket shows connected

3. **Verify Real-Time**
   - ✅ Queue updates instantly
   - ✅ Position numbers correct
   - ✅ All details display

---

## 🧪 Test Scenario 8: View Patient Details

### Steps
1. **Click View Button**
   - Click "View" button on patient
   - ✅ Navigate to patient details page
   - ✅ Full patient information displays

2. **Go Back**
   - Click back button
   - ✅ Return to doctor dashboard
   - ✅ Queue still shows

---

## 🧪 Test Scenario 9: Multiple Doctors

### Steps
1. **Assign to Different Doctors**
   - Nurse assigns patient 1 to Dr. Rajesh Kumar
   - Nurse assigns patient 2 to Dr. Priya Sharma

2. **Doctor 1 Dashboard**
   - Login as `dr_general_1`
   - ✅ Only patient 1 shows
   - ✅ Patient 2 not visible

3. **Doctor 2 Dashboard**
   - Login as `dr_general_2`
   - ✅ Only patient 2 shows
   - ✅ Patient 1 not visible

---

## 🧪 Test Scenario 10: Error Handling

### Steps
1. **Test Network Error**
   - Stop backend server
   - Try to refresh queue
   - ✅ Error message displays
   - ✅ Fallback to mock data

2. **Test Invalid Doctor**
   - Try to access with invalid doctor ID
   - ✅ Proper error handling
   - ✅ Redirect to login

---

## ✅ Expected Results Summary

| Feature | Expected | Status |
|---------|----------|--------|
| Doctor Login | Success | ✅ |
| Queue Display | Shows patients | ✅ |
| Refresh Button | Updates queue | ✅ |
| Complete Button | Removes patient | ✅ |
| Real-Time Updates | Automatic | ✅ |
| Multiple Patients | All display | ✅ |
| Multiple Doctors | Isolated queues | ✅ |
| Error Handling | Graceful | ✅ |
| WebSocket | Connected | ✅ |
| UI/UX | Enhanced | ✅ |

---

## 🎯 Success Criteria

All tests pass when:
- ✅ Patients appear in doctor's queue
- ✅ Queue updates in real-time
- ✅ Refresh button works
- ✅ Complete button works
- ✅ Multiple doctors have isolated queues
- ✅ Error handling works
- ✅ UI is responsive
- ✅ WebSocket is connected

---

## 🚀 Ready for Testing!

All features are implemented and ready for comprehensive testing!

