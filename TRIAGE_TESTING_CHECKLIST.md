# ✅ Triage Color System - Testing Checklist

## 🚀 Backend Status
- [x] Backend started on port 5000
- [x] MongoDB connected
- [x] WebSocket server ready
- [x] ONNX runtime installed

---

## 📋 Pre-Testing Checklist

### Backend
- [x] Server running on `http://localhost:5000`
- [x] MongoDB connected
- [ ] Check server logs for any errors
- [ ] Verify `server/triage_model.onnx` exists

### Frontend
- [ ] Frontend running on `http://localhost:3000`
- [ ] Browser console open (F12)
- [ ] Network tab open to monitor API calls

---

## 🧪 Testing Workflow

### Phase 1: Nurse App Testing

#### 1.1 Login as Nurse
- [ ] Navigate to `http://localhost:3000/nurse/signin`
- [ ] Enter nurse credentials
- [ ] Successfully logged in
- [ ] Redirected to nurse dashboard

#### 1.2 Scan Patient QR Code
- [ ] Click "QR Scanner" button
- [ ] Scan a patient's QR code
- [ ] Successfully redirected to vitals page
- [ ] Patient information displays correctly

#### 1.3 Enter Vital Signs
- [ ] Fill Height: 170 cm
- [ ] Fill Weight: 70 kg
- [ ] Fill Temperature: 37°C
- [ ] Fill Blood Pressure: 120/80
- [ ] Fill Heart Rate: 72 bpm
- [ ] Fill Respiratory Rate: 16
- [ ] Fill Pulse: 72 bpm
- [ ] All fields populated correctly

#### 1.4 Predict Triage Color
- [ ] Click "🎯 Predict Triage Color" button
- [ ] Button shows loading state
- [ ] Wait 2-3 seconds for prediction
- [ ] Color buttons appear (Red, Yellow, Green, Blue)
- [ ] Predicted color is highlighted
- [ ] Check server logs for: "✅ Predicted triage color: green"
- [ ] Check browser console for: "✅ Triage color predicted: green"

#### 1.5 Select Triage Color
- [ ] Predicted color is pre-selected
- [ ] Can click other colors to change
- [ ] Selected color shows checkmark
- [ ] Selected color displays at bottom

#### 1.6 Submit Vitals
- [ ] "Record Vitals" button is enabled
- [ ] Click "Record Vitals" button
- [ ] Button shows "Recording..." state
- [ ] Success message appears: "Vitals recorded successfully! Triage Color: GREEN"
- [ ] Form clears
- [ ] Vitals list updates with new entry

---

### Phase 2: Patient App Testing

#### 2.1 Login as Patient
- [ ] Logout from nurse app
- [ ] Navigate to `http://localhost:3000/patient/signin`
- [ ] Login with same patient ID
- [ ] Successfully logged in
- [ ] Redirected to patient home page

#### 2.2 Check Triage Status Card
- [ ] Scroll down on home page
- [ ] "🎯 Your Triage Status" card visible
- [ ] Color circle displays (should be green)
- [ ] Priority level shows: "🟢 Non-Urgent - Routine Care"
- [ ] Description text visible
- [ ] "Based on your latest vital signs..." text shows

#### 2.3 Verify Color Display
- [ ] Color circle background matches triage color
- [ ] Text color is appropriate (white on dark, dark on light)
- [ ] Card layout is responsive
- [ ] All information is readable

---

### Phase 3: Different Vitals Scenarios

#### 3.1 Test Yellow (Urgent) Vitals
- [ ] Logout patient, login as nurse
- [ ] Scan same patient
- [ ] Enter elevated vitals:
  - Temperature: 38.5°C
  - BP: 140/90
  - HR: 95
  - RR: 18
- [ ] Predict triage color
- [ ] Should predict: Yellow
- [ ] Select and submit
- [ ] Check patient app - should show Yellow

#### 3.2 Test Red (Critical) Vitals
- [ ] Enter critical vitals:
  - Temperature: 39.5°C
  - BP: 180/110
  - HR: 120
  - RR: 28
- [ ] Predict triage color
- [ ] Should predict: Red
- [ ] Select and submit
- [ ] Check patient app - should show Red

#### 3.3 Test Blue (Semi-Urgent) Vitals
- [ ] Enter semi-urgent vitals:
  - Temperature: 37.5°C
  - BP: 130/85
  - HR: 85
  - RR: 17
- [ ] Predict triage color
- [ ] Should predict: Blue
- [ ] Select and submit
- [ ] Check patient app - should show Blue

---

### Phase 4: Error Handling

#### 4.1 Missing Vitals
- [ ] Leave some vital fields empty
- [ ] Click "Predict Triage Color"
- [ ] Should show error: "Please fill in all vital fields"
- [ ] No API call made

#### 4.2 Invalid Blood Pressure Format
- [ ] Enter BP as "120" (missing diastolic)
- [ ] Click "Predict Triage Color"
- [ ] Should handle gracefully or show error
- [ ] Check console for error messages

#### 4.3 Network Error Simulation
- [ ] Open DevTools Network tab
- [ ] Throttle to "Offline"
- [ ] Try to predict triage
- [ ] Should show network error
- [ ] Restore network

---

### Phase 5: Console Verification

#### 5.1 Server Logs
Check server console for:
```
✅ Triage model loaded successfully
📊 Model inputs: [...]
📊 Model outputs: [...]
🔍 Input data for triage prediction: [...]
📊 Model predictions: [...]
✅ Predicted triage color: [color]
```

#### 5.2 Browser Console
Check browser console for:
```
🔵 Predicting triage color...
✅ Triage color predicted: [color]
🔵 Submitting vitals for patient: [id]
✅ Vitals submitted successfully: [data]
```

---

## 📊 Test Results Summary

### Nurse App
- [ ] Vitals entry works
- [ ] Triage prediction works
- [ ] Color selection works
- [ ] Vitals submission works
- [ ] Success message displays

### Patient App
- [ ] Triage status card displays
- [ ] Color shows correctly
- [ ] Priority level accurate
- [ ] Updates when new vitals recorded

### Model Inference
- [ ] ONNX model loads successfully
- [ ] Predictions are accurate
- [ ] Fallback works if model fails
- [ ] Performance is acceptable

### Error Handling
- [ ] Missing fields handled
- [ ] Network errors handled
- [ ] Invalid data handled
- [ ] Graceful degradation

---

## 🎯 Success Criteria

All items must be checked for successful implementation:
- [ ] All Phase 1 tests pass
- [ ] All Phase 2 tests pass
- [ ] All Phase 3 tests pass
- [ ] All Phase 4 tests pass
- [ ] All Phase 5 verifications pass
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable

---

## 📝 Notes

- First prediction may take 2-3 seconds (model loading)
- Subsequent predictions are faster
- Fallback prediction is instant
- Triage color persists in database
- Patient app updates automatically

---

**Status: Ready for Testing! 🚀**

Backend: ✅ Running
Frontend: ⏳ Start when ready
Testing: ⏳ Begin when both running

