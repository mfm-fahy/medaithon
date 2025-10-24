# 🧪 Generalized Chatbot - Testing Guide

## ✅ System Status

- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ MongoDB: Connected
- ✅ OpenRouter API: Configured
- ✅ Chatbot: Ready

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Open Patient App
```
URL: http://localhost:3000/patient/home
```

### Step 2: Login
```
Username: patient_john
Password: password123
```

### Step 3: Open Chatbot
```
Click blue chat button (bottom-right corner)
```

### Step 4: Test Different Questions

#### Test 1: Health Question
```
Type: "I have a headache and fever"
Expected: Health advice and guidance
```

#### Test 2: General Knowledge
```
Type: "What is the capital of France?"
Expected: Informative response about Paris
```

#### Test 3: Hospital Info
```
Type: "How do I schedule an appointment?"
Expected: Appointment scheduling help
```

#### Test 4: Greeting
```
Type: "Hello"
Expected: Friendly greeting and offer to help
```

#### Test 5: Emergency
```
Type: "I'm having severe chest pain"
Expected: Emergency guidance
```

---

## 📋 Test Scenarios

### Scenario 1: Health Concern
```
Input: "I have a cough and sore throat for 3 days"
Expected Output:
- Acknowledges symptoms
- Asks clarifying questions
- Provides general information
- Suggests seeing doctor
- Offers to help track symptoms
```

### Scenario 2: Medication Question
```
Input: "What are the side effects of aspirin?"
Expected Output:
- Explains what aspirin is used for
- Lists common side effects
- Mentions precautions
- Recommends consulting doctor
```

### Scenario 3: General Knowledge
```
Input: "Tell me about the solar system"
Expected Output:
- Provides informative response
- Explains planets and stars
- Gives interesting facts
- Maintains friendly tone
```

### Scenario 4: Appointment Help
```
Input: "How do I book a doctor's appointment?"
Expected Output:
- Explains appointment process
- Provides contact information
- Mentions required information
- Offers further assistance
```

### Scenario 5: Emergency Situation
```
Input: "I can't breathe"
Expected Output:
- Recognizes emergency
- Recommends calling 911
- Advises immediate action
- Provides emergency guidance
```

---

## ✅ Success Criteria

- [ ] Chatbot opens without errors
- [ ] Can send messages
- [ ] Gets responses for health questions
- [ ] Gets responses for general questions
- [ ] Handles appointments questions
- [ ] Recognizes emergencies
- [ ] Shows timestamps
- [ ] Saves to chat history
- [ ] Can save for doctor
- [ ] No console errors
- [ ] No network errors
- [ ] Mobile responsive

---

## 🔍 What to Check

### Console Logs (F12)
```
Frontend should show:
✅ Message sent
✅ Response received
✅ No errors
```

### Backend Logs (Terminal)
```
Backend should show:
🔵 Chatbot message received
🔌 Connecting to OpenRouter API...
✅ OpenRouter API response received successfully
```

### Response Quality
```
✓ Relevant to question
✓ Helpful and friendly
✓ Properly formatted
✓ Includes timestamps
✓ Saves to history
```

---

## 🎬 Demo Script

```
1. Open: http://localhost:3000/patient/home
2. Login: patient_john / password123
3. Click: Blue chat button
4. Test 1: Type "I have a headache"
   - Verify: Gets health response
5. Test 2: Type "What is AI?"
   - Verify: Gets general knowledge response
6. Test 3: Type "How do I schedule an appointment?"
   - Verify: Gets appointment help
7. Test 4: Type "I'm having chest pain"
   - Verify: Gets emergency guidance
8. Test 5: Click "Analyze My Symptoms"
   - Verify: Gets detailed analysis
9. Click "Save Symptoms for Doctor"
   - Verify: Saves successfully
```

---

## 🐛 Troubleshooting

### Issue: No Response
```
✓ Check: Backend is running
✓ Check: API key is valid
✓ Check: Internet connection
✓ Check: Browser console (F12)
✓ Try: Refresh page
```

### Issue: Wrong Response Type
```
✓ Check: System prompt is updated
✓ Check: Backend restarted
✓ Check: API key is correct
✓ Try: Clear browser cache
```

### Issue: Formatting Problems
```
✓ Check: CSS classes applied
✓ Check: Browser zoom is 100%
✓ Check: Responsive design
✓ Try: Refresh page
```

### Issue: API Error
```
✓ Check: OpenRouter API status
✓ Check: API key format
✓ Check: Network connection
✓ Try: Restart backend
```

---

## 📊 Performance Metrics

### Expected Times
- Message send: < 1 second
- API response: 2-5 seconds
- Display: < 1 second

### Expected Sizes
- Response: 500 bytes - 2 KB
- Chat message: < 500 bytes

---

## 🔧 Backend Restart (if needed)

```
1. Open Terminal
2. Go to: d:\med\v3\server
3. Run: node src/index.js
4. Wait for: "✅ Server is running on port 5000"
5. Refresh: Frontend page
```

---

## 📱 Device Testing

### Mobile (375px)
- [ ] Chatbot opens
- [ ] Messages fit screen
- [ ] No horizontal scroll
- [ ] Touch-friendly

### Tablet (768px)
- [ ] Chatbot positioned correctly
- [ ] Messages display well
- [ ] All features work

### Desktop (1024px+)
- [ ] Chatbot in corner
- [ ] Optimal width
- [ ] All features work

---

## ✨ Features to Test

- [ ] Health questions
- [ ] General knowledge
- [ ] Hospital information
- [ ] Appointment help
- [ ] Emergency guidance
- [ ] Message timestamps
- [ ] Chat history
- [ ] Save for doctor
- [ ] Analyze symptoms
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states

---

## 🎯 Test Results

### Test 1: Health Question
```
Status: ✅ PASS / ❌ FAIL
Response Quality: ___/10
Notes: ________________
```

### Test 2: General Knowledge
```
Status: ✅ PASS / ❌ FAIL
Response Quality: ___/10
Notes: ________________
```

### Test 3: Hospital Info
```
Status: ✅ PASS / ❌ FAIL
Response Quality: ___/10
Notes: ________________
```

### Test 4: Emergency
```
Status: ✅ PASS / ❌ FAIL
Response Quality: ___/10
Notes: ________________
```

### Test 5: Appointments
```
Status: ✅ PASS / ❌ FAIL
Response Quality: ___/10
Notes: ________________
```

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend terminal
3. Verify API key in .env
4. Restart backend
5. Refresh frontend
6. Try again

---

**Ready to test the generalized chatbot!** 🤖✨

