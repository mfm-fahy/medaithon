# 🧪 TESTING GUIDE - Doctor Queue & Real-Time Navigation

## 🎯 Complete End-to-End Testing

Follow these steps to test the complete workflow.

---

## 📋 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Patient | `patient_john` | `password123` |
| Doctor | `dr_smith` | `password123` |
| Nurse | `nurse_alice` | `password123` |

---

## 🧪 Test Scenario 1: Doctor Saves Patient Record

### Step 1: Doctor Login
```
URL: http://localhost:3001/doctor/signin
Username: dr_smith
Password: password123
```

### Step 2: View Patient
1. Click on patient **John Patient** (patient_john)
2. You should see patient details

### Step 3: Fill Patient Record
1. **Diagnosis**: "Hypertension with elevated BP"
2. **Remarks**: "Patient stable, vitals normal"
3. **Advice**: "Take rest, reduce salt intake"

### Step 4: Add Medicines
1. Click "Add Another Medicine" to add medicines
2. **Medicine 1**:
   - Name: Aspirin
   - Route: Oral
   - Dose: 500mg
   - Frequency: Twice daily

3. **Medicine 2**:
   - Name: Lisinopril
   - Route: Oral
   - Dose: 10mg
   - Frequency: Once daily

### Step 5: Add Injection
1. Check "Patient needs Injection / IV"
2. Enter: "Saline IV for hydration"

### Step 6: Add Lab Test
1. Check "Patient needs Lab Tests"
2. Enter: "Complete Blood Count (CBC)"

### Step 7: Save Record
1. Click "Save Patient Record"
2. Should see: ✅ "Patient record saved successfully!"
3. Auto-redirects to dashboard after 2 seconds

---

## 🧪 Test Scenario 2: Patient Sees Real-Time Updates

### Step 1: Patient Login (Open in New Window/Tab)
```
URL: http://localhost:3001/patient/signin
Username: patient_john
Password: password123
```

### Step 2: Go to Navigation Page
1. Click "Hospital Navigation" or go to `/patient/navigation`
2. Should see:
   - ✅ Green connection indicator (🔌 Real-time updates connected)
   - ✅ Doctor appointment location card

### Step 3: Doctor Saves Record (From Step 1)
1. Go back to doctor window
2. Complete the save process

### Step 4: Patient Sees Updates (In Patient Window)
1. Should see blue animation: "💉 You need to go for injection!" or "🧪 You need to go for lab test!"
2. Should see new cards:
   - **💉 Injection Required** card with:
     - Injection details: "Saline IV for hydration"
     - Room number: Random (e.g., G45)
     - Status: pending
   
   - **🧪 Lab Test Required** card with:
     - Lab test details: "Complete Blood Count (CBC)"
     - Room number: Random (e.g., G78)
     - Status: pending
   
   - **💊 Prescribed Medicines** card with:
     - Aspirin - Oral - 500mg - Twice daily
     - Lisinopril - Oral - 10mg - Once daily

---

## 🧪 Test Scenario 3: Nurse Sees Prescribed Medicines

### Step 1: Nurse Login (Open in New Window/Tab)
```
URL: http://localhost:3001/nurse/signin
Username: nurse_alice
Password: password123
```

### Step 2: Go to QR Scanner
1. Click "QR Code Scanner" or go to `/nurse/qr-scanner`
2. Click "Start Scanning"

### Step 3: Scan Patient QR Code
1. Use patient's QR code (from patient app or database)
2. Patient details should appear

### Step 4: View Patient Details
1. Click "Update Vitals & View History"
2. Should see patient details page

### Step 5: Scroll Down to See Medicines
1. Should see **💊 Doctor Prescribed Medicines** section with:
   - Aspirin - Oral - 500mg - Twice daily
   - Lisinopril - Oral - 10mg - Once daily

2. Should see **💉 Injection Required** section with:
   - Details: "Saline IV for hydration"
   - Room: Random number
   - Status: pending

3. Should see **🧪 Lab Test Required** section with:
   - Details: "Complete Blood Count (CBC)"
   - Room: Random number
   - Status: pending

---

## ✅ Expected Results

### Doctor Window
- ✅ Patient record saves successfully
- ✅ Success message appears
- ✅ Auto-redirects to dashboard

### Patient Window
- ✅ Blue animation notification appears
- ✅ Injection card displays with room number
- ✅ Lab test card displays with room number
- ✅ Prescribed medicines card displays all medicines
- ✅ Last updated timestamp shows current time

### Nurse Window
- ✅ Prescribed medicines section visible
- ✅ Injection details section visible
- ✅ Lab test details section visible
- ✅ All information matches what doctor entered

---

## 🐛 Troubleshooting

### Patient Not Seeing Updates
1. Check WebSocket connection (green indicator)
2. Verify patient is logged in
3. Check browser console for errors
4. Refresh patient page

### Medicines Not Showing
1. Verify doctor saved record with medicines
2. Check patient app is connected to WebSocket
3. Refresh patient page

### Room Numbers Not Generating
1. Check backend logs for errors
2. Verify patient record was saved
3. Check MongoDB for patient record

---

## 📊 Backend Logs to Check

When doctor saves record, you should see:
```
🔵 Saving patient record for: P1234567890
✅ Patient record saved successfully
🔌 Sending WebSocket update to patient: P1234567890
```

When patient receives update:
```
🔌 WebSocket message received: {type: 'navigation-update', ...}
💉 Injection details updated: {...}
🧪 Lab test details updated: {...}
💊 Prescribed medicines updated: [...]
```

---

## 🎉 All Tests Passed!

If all steps complete successfully, the feature is working perfectly! 🚀

