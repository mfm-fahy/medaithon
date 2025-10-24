# 🎯 Triage Color System - Quick Test Guide

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- MongoDB running
- Nurse and Patient accounts created

---

## 🧪 Step-by-Step Testing

### Step 1: Login as Nurse
1. Go to `http://localhost:3000/nurse/signin`
2. Enter nurse credentials
3. Click "Sign In"

### Step 2: Scan Patient QR Code
1. Click "QR Scanner" on nurse dashboard
2. Scan a patient's QR code (or use test patient ID)
3. You'll be redirected to vitals page

### Step 3: Enter Vital Signs
Fill in the following fields:
```
Height: 170 cm
Weight: 70 kg
Temperature: 37°C
Blood Pressure: 120/80
Heart Rate: 72 bpm
Respiratory Rate: 16
Pulse: 72 bpm
```

### Step 4: Predict Triage Color
1. Click "🎯 Predict Triage Color" button
2. Wait for prediction (should show within 2-3 seconds)
3. You should see color buttons appear:
   - 🔴 Red
   - 🟡 Yellow
   - 🟢 Green
   - 🔵 Blue

### Step 5: Select Triage Color
1. The predicted color will be highlighted
2. Click on the color to confirm (or select different color)
3. Selected color shows with checkmark

### Step 6: Submit Vitals
1. Click "Record Vitals" button
2. Should see success message: "Vitals recorded successfully! Triage Color: [COLOR]"
3. Form clears and vitals list updates

### Step 7: Verify in Patient App
1. Logout from nurse app
2. Login as patient with same patient ID
3. Go to patient home page
4. Look for "🎯 Your Triage Status" card
5. Should display:
   - Color circle with priority level
   - Priority description
   - Last update info

---

## 🧬 Test Cases

### Test Case 1: Normal Vitals (Green)
```
Height: 170, Weight: 70, Temperature: 37
BP: 120/80, HR: 72, RR: 16, Pulse: 72
Expected: Green (Non-Urgent)
```

### Test Case 2: Elevated Vitals (Yellow)
```
Height: 170, Weight: 70, Temperature: 38.5
BP: 140/90, HR: 95, RR: 18, Pulse: 95
Expected: Yellow (Urgent)
```

### Test Case 3: Critical Vitals (Red)
```
Height: 170, Weight: 70, Temperature: 39.5
BP: 180/110, HR: 120, RR: 28, Pulse: 120
Expected: Red (Critical)
```

### Test Case 4: Semi-Urgent Vitals (Blue)
```
Height: 170, Weight: 70, Temperature: 37.5
BP: 130/85, HR: 85, RR: 17, Pulse: 85
Expected: Blue (Semi-Urgent)
```

---

## 🔍 Console Logs to Check

### Backend Logs
Look for these messages in server console:

```
🔄 Loading ONNX triage model from: [path]
✅ Triage model loaded successfully
📊 Model inputs: [...]
📊 Model outputs: [...]
🔍 Input data for triage prediction: [...]
📊 Model predictions: [...]
✅ Predicted triage color: [color]
```

### Frontend Logs
Look for these messages in browser console:

```
🔵 Predicting triage color...
✅ Triage color predicted: [color]
🔵 Submitting vitals for patient: [id]
✅ Vitals submitted successfully: [data]
```

---

## ⚠️ Troubleshooting

### Issue: "Predict Triage Color" button doesn't work
**Solution:**
- Check backend is running
- Check all vital fields are filled
- Check browser console for errors
- Verify auth token is valid

### Issue: No color prediction appears
**Solution:**
- Check server logs for ONNX model loading errors
- Verify `server/triage_model.onnx` file exists
- Check if onnxruntime-node is installed: `npm list onnxruntime-node`
- Restart backend server

### Issue: Triage color not showing in patient app
**Solution:**
- Refresh patient home page
- Check if vitals were saved with triageColor
- Verify patient ID matches
- Check browser console for fetch errors

### Issue: "Record Vitals" button disabled
**Solution:**
- Must predict triage color first
- Must select a triage color
- All vital fields must be filled

---

## 📊 Expected Behavior

### Nurse App
- ✅ Vitals form displays normally
- ✅ Predict button appears after form
- ✅ Clicking predict shows loading state
- ✅ Color buttons appear after prediction
- ✅ Can select/change color
- ✅ Submit button enabled only with color selected
- ✅ Success message shows triage color

### Patient App
- ✅ Home page loads
- ✅ Triage status card appears if vitals exist
- ✅ Color circle displays correctly
- ✅ Priority level text matches color
- ✅ Card updates when new vitals recorded

---

## 🎯 Success Criteria

- [x] Nurse can predict triage color
- [x] Color prediction is accurate
- [x] Triage color saves with vitals
- [x] Patient can see triage status
- [x] Color displays correctly in patient app
- [x] Fallback prediction works if model fails
- [x] No console errors

---

## 📝 Notes

- First prediction may take 2-3 seconds (model loading)
- Subsequent predictions are faster (model cached)
- Fallback prediction is instant if model fails
- Triage color is optional in API but required in UI
- Color persists in database with vitals record

---

**Ready to test! 🚀**

