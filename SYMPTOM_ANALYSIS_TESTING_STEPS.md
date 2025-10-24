# 🧪 Symptom Analysis - Testing Steps

## ✅ System Status

- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ MongoDB: Connected
- ✅ OpenRouter API: Configured
- ✅ Symptom Analysis: Ready

---

## 🚀 Step-by-Step Testing

### Step 1: Open Patient App
```
1. Go to: http://localhost:3000/patient/home
2. You should see the patient dashboard
```

### Step 2: Login (if needed)
```
Username: patient_john
Password: password123
```

### Step 3: Open Chatbot
```
1. Look for blue chat button in bottom-right corner
2. Click the button
3. Chatbot modal should open
```

### Step 4: Describe Your Symptoms
```
1. Type in the chat input: "I have a headache, fever, and body aches for 2 days"
2. Click Send button or press Enter
3. Your message should appear in the chat
```

### Step 5: Wait for Response
```
1. AI should respond with a message
2. You should see a loading indicator
3. Response should appear in the chat
```

### Step 6: Click "Analyze My Symptoms"
```
1. After your first message, look for orange button
2. Button text: "🔍 Analyze My Symptoms"
3. Click the button
4. Wait 3-5 seconds for analysis
```

### Step 7: View Analysis
```
The analysis should show:
✓ Possible conditions with confidence levels
✓ Causes for each condition
✓ Risk levels (Low/Medium/High)
✓ Recommended actions
✓ Emergency warnings
✓ Disclaimer
```

---

## 🔍 What to Check

### Console Logs (Press F12)
```
Frontend logs should show:
🔍 Requesting detailed symptom analysis...
📤 Sending to: http://localhost:5000/api/chatbot/analyze-symptoms-detailed
📋 Symptoms: [your symptoms]
🔑 Session ID: [session id]
📊 Response status: 200
✅ Symptom analysis received: [data]
```

### Backend Logs (Terminal)
```
Backend logs should show:
🔍 Detailed symptom analysis requested
✅ Symptom analysis completed
✅ Analysis saved to chat session
```

### Expected Analysis Format
```
**POSSIBLE CONDITIONS:**
1. [Condition] - Confidence: [X]%
   - Description: [...]
   - Causes: [...]
   - Risk Level: [Low/Medium/High]

**COMMON CAUSES:**
- [Cause 1]
- [Cause 2]

**RECOMMENDED ACTIONS:**
- [Action 1]
- [Action 2]

**WHEN TO SEEK IMMEDIATE MEDICAL ATTENTION:**
- [Warning 1]
- [Warning 2]

**IMPORTANT DISCLAIMER:**
[Disclaimer text]
```

---

## 🧪 Test Scenarios

### Test 1: Flu-like Symptoms
```
Input: "I have fever, cough, and sore throat"
Expected: Identifies flu, cold, COVID-19
Check: Causes listed, risk levels shown
```

### Test 2: Chest Pain
```
Input: "I have chest pain and shortness of breath"
Expected: Identifies cardiac conditions
Check: Emergency warnings shown
```

### Test 3: Digestive Issues
```
Input: "I have stomach pain and diarrhea"
Expected: Identifies GI conditions
Check: Hydration recommendations
```

### Test 4: Multiple Symptoms
```
Input: "Headache, fever, body aches, cough, sore throat"
Expected: Comprehensive analysis
Check: Multiple conditions identified
```

---

## ✅ Success Criteria

- [ ] Chatbot opens
- [ ] Can send messages
- [ ] AI responds
- [ ] "Analyze My Symptoms" button appears
- [ ] Button is clickable
- [ ] Analysis generates
- [ ] Conditions identified
- [ ] Confidence levels shown
- [ ] Causes listed
- [ ] Risk levels displayed
- [ ] Recommendations provided
- [ ] Emergency warnings shown
- [ ] Formatting is correct
- [ ] No console errors
- [ ] No network errors

---

## 🐛 Troubleshooting

### Issue: Button Not Appearing
```
✓ Check: Sent at least one message
✓ Check: Browser console (F12) for errors
✓ Try: Refresh page (Ctrl+R)
✓ Try: Clear browser cache
```

### Issue: Analysis Not Generating
```
✓ Check: Backend is running (Terminal 37)
✓ Check: OpenRouter API key valid
✓ Check: Internet connection
✓ Check: Browser console for errors
✓ Try: Restart backend
```

### Issue: JSON Parse Error
```
✓ Check: Backend is responding
✓ Check: Response is valid JSON
✓ Check: No HTML error pages
✓ Try: Restart backend
✓ Try: Refresh frontend
```

### Issue: Formatting Issues
```
✓ Check: Message display code
✓ Check: CSS classes applied
✓ Check: Browser zoom is 100%
✓ Try: Refresh page
```

---

## 📊 Performance Metrics

### Expected Times
- Message send: < 1 second
- Analysis generation: 3-5 seconds
- Display rendering: < 1 second

### Expected Sizes
- Analysis response: 1-2 KB
- Chat message: < 500 bytes

---

## 🔧 Backend Restart (if needed)

### If Backend Crashes
```
1. Open Terminal
2. Go to: d:\med\v3\server
3. Run: node src/index.js
4. Wait for: "✅ Server is running on port 5000"
5. Refresh: Frontend page
```

---

## 📱 Testing on Different Devices

### Mobile (375px)
- [ ] Button visible
- [ ] Modal fits screen
- [ ] Analysis readable
- [ ] No horizontal scroll

### Tablet (768px)
- [ ] Button positioned correctly
- [ ] Modal properly sized
- [ ] Analysis displays well

### Desktop (1024px+)
- [ ] Button in corner
- [ ] Modal centered
- [ ] Analysis optimal width

---

## 🎬 Quick Demo (5 Minutes)

```
1. Open: http://localhost:3000/patient/home
2. Login: patient_john / password123
3. Click: Blue chat button
4. Type: "I have a headache and fever"
5. Click: Send
6. Wait: Message appears
7. Click: "Analyze My Symptoms" button
8. Wait: 3-5 seconds
9. View: Detailed analysis
10. Verify: All sections present
```

---

## 📞 Support

### If Something Goes Wrong
1. Check browser console (F12)
2. Check backend terminal
3. Restart backend: `node src/index.js`
4. Refresh frontend: Ctrl+R
5. Try again

### Common Errors
```
"Unexpected token '<'" → Backend returned HTML error
"Failed to analyze symptoms" → API error or timeout
"Session not found" → Session ID issue
"Network error" → Backend not running
```

---

## ✨ Features to Test

- [ ] Symptom analysis
- [ ] Disease identification
- [ ] Confidence levels
- [ ] Cause explanation
- [ ] Risk assessment
- [ ] Recommendations
- [ ] Emergency warnings
- [ ] Message formatting
- [ ] Chat history
- [ ] Save for doctor
- [ ] Mobile responsive
- [ ] Error handling

---

**Ready to test the advanced symptom analysis!** 🔍✨

