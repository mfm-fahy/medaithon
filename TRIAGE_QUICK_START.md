# 🚀 Triage System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Backend is Already Running ✅
```
✅ Server running on port 5000
✅ MongoDB connected
✅ WebSocket ready
```

### Step 2: Start Frontend
```bash
cd client
npm run dev
```
Then open: `http://localhost:3000`

### Step 3: Test Immediately
1. Login as **Nurse**
2. Scan patient QR code
3. Enter vitals (any values)
4. Click **"🎯 Predict Triage Color"**
5. Select color and submit
6. Login as **Patient** to see result

---

## 🎯 What You'll See

### Nurse App
```
┌─────────────────────────────────────┐
│  Vitals Entry Form                  │
├─────────────────────────────────────┤
│ Height: [170]                       │
│ Weight: [70]                        │
│ Temperature: [37]                   │
│ Blood Pressure: [120/80]            │
│ Heart Rate: [72]                    │
│ Respiratory Rate: [16]              │
│ Pulse: [72]                         │
├─────────────────────────────────────┤
│ [🎯 Predict Triage Color]           │
├─────────────────────────────────────┤
│ Predicted Triage Color:             │
│ [🔴 Red] [🟡 Yellow] [🟢 Green]    │
│ [🔵 Blue]                           │
├─────────────────────────────────────┤
│ [Record Vitals]                     │
└─────────────────────────────────────┘
```

### Patient App
```
┌─────────────────────────────────────┐
│ 🎯 Your Triage Status               │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────────────────┐     │
│    │                         │     │
│    │      🟢 GREEN           │     │
│    │                         │     │
│    └─────────────────────────┘     │
│                                     │
│  🟢 Non-Urgent - Routine Care      │
│                                     │
│  Based on your latest vital signs  │
│  recorded by the nurse              │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 Triage Color Quick Reference

```
🔴 RED = CRITICAL
   └─ Immediate attention needed
   └─ Examples: High fever (39.5°C), BP 180/110, HR 120

🟡 YELLOW = URGENT  
   └─ High priority care
   └─ Examples: Fever (38.5°C), BP 140/90, HR 95

🟢 GREEN = NON-URGENT
   └─ Routine care
   └─ Examples: Normal vitals (37°C, 120/80, HR 72)

🔵 BLUE = SEMI-URGENT
   └─ Moderate priority
   └─ Examples: Slightly elevated (37.5°C, 130/85, HR 85)
```

---

## 🧪 Test Scenarios

### Test 1: Normal Vitals (Green)
```
Height: 170, Weight: 70, Temp: 37
BP: 120/80, HR: 72, RR: 16, Pulse: 72
Expected: 🟢 GREEN
```

### Test 2: Elevated Vitals (Yellow)
```
Height: 170, Weight: 70, Temp: 38.5
BP: 140/90, HR: 95, RR: 18, Pulse: 95
Expected: 🟡 YELLOW
```

### Test 3: Critical Vitals (Red)
```
Height: 170, Weight: 70, Temp: 39.5
BP: 180/110, HR: 120, RR: 28, Pulse: 120
Expected: 🔴 RED
```

### Test 4: Semi-Urgent Vitals (Blue)
```
Height: 170, Weight: 70, Temp: 37.5
BP: 130/85, HR: 85, RR: 17, Pulse: 85
Expected: 🔵 BLUE
```

---

## 🔍 What to Check

### ✅ Success Indicators

**Nurse App:**
- [ ] Vitals form displays
- [ ] "Predict Triage Color" button works
- [ ] Color buttons appear after prediction
- [ ] Can select color
- [ ] Submit button works
- [ ] Success message shows

**Patient App:**
- [ ] Triage status card visible
- [ ] Color displays correctly
- [ ] Priority text matches color
- [ ] Card is readable

**Console Logs:**
- [ ] Server: "✅ Predicted triage color: [color]"
- [ ] Browser: "✅ Triage color predicted: [color]"

---

## ⚠️ Troubleshooting

### Problem: Button doesn't respond
**Solution:** 
- Fill all vital fields
- Check backend is running
- Check browser console for errors

### Problem: No color appears
**Solution:**
- Check server logs
- Verify `server/triage_model.onnx` exists
- Restart backend

### Problem: Triage not showing in patient app
**Solution:**
- Refresh page
- Check if vitals were saved
- Check browser console

---

## 📚 Documentation

For more details, see:
- `TRIAGE_COLOR_IMPLEMENTATION.md` - Complete guide
- `TRIAGE_TESTING_CHECKLIST.md` - Detailed tests
- `TRIAGE_SYSTEM_SUMMARY.md` - Full overview

---

## 🎯 Key Points

✅ **Automatic Prediction** - ML model predicts color automatically
✅ **Fallback Logic** - Works even if model fails
✅ **Real-time Updates** - Patient app updates immediately
✅ **Easy to Use** - Simple UI for nurses
✅ **Persistent** - Colors saved to database

---

## 🚀 You're Ready!

1. ✅ Backend running
2. ⏳ Start frontend: `npm run dev` (in client folder)
3. ⏳ Login and test
4. ⏳ Check results

**That's it! The system is ready to use.** 🎉

---

## 📞 Quick Help

**Backend not running?**
```bash
cd server
npm run dev
```

**Frontend not starting?**
```bash
cd client
npm run dev
```

**Need to check logs?**
- Server logs: Check terminal where `npm run dev` is running
- Browser logs: Press F12 in browser, go to Console tab

**Model not loading?**
- Check: `ls server/triage_model.onnx`
- Reinstall: `cd server && npm install onnxruntime-node`

---

**Status: READY TO TEST** ✅

