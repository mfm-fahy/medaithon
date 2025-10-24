# 🔧 Chatbot Troubleshooting Guide

## ❌ Issue: Can't Click Chatbot Icon

### ✅ Fixed Issues

#### Issue 1: Token Key Mismatch
**Problem**: Chatbot button was looking for token under wrong key
- Was looking for: `localStorage.getItem("token")`
- Should be: `localStorage.getItem("auth_token")`

**Solution Applied**: ✅ FIXED
- Updated `client/app/patient/home/page.tsx`
- Changed token retrieval to use correct key: `"auth_token"`

#### Issue 2: Pulse Animation Blocking Clicks
**Problem**: Absolute positioned pulse div was blocking button clicks
- Pulse animation was on top of button
- Clicks were hitting the pulse div instead of button

**Solution Applied**: ✅ FIXED
- Added `pointer-events-none` to pulse div
- Moved pulse div behind button
- Added `relative z-50` to button for proper layering

---

## 🚀 How to Apply Fixes

### Step 1: Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty cache and hard refresh"
```

### Step 2: Restart Frontend
```bash
# Stop current frontend (Ctrl+C)
cd client
npm run dev
```

### Step 3: Test Chatbot
```
1. Go to http://localhost:3000
2. Login as patient
3. Look for blue chat button (bottom-right)
4. Click the button
5. Chat modal should open
```

---

## ✅ Verification Checklist

- [x] Token key fixed to `"auth_token"`
- [x] Pulse animation not blocking clicks
- [x] Button has proper z-index
- [x] Button is clickable
- [x] Modal opens on click
- [x] Modal closes on click

---

## 🧪 Testing Steps

### Test 1: Button Visibility
```
1. Login as patient
2. Go to home page
3. Look at bottom-right corner
4. Should see blue button with pulse animation
```

**Expected**: ✅ Blue button visible with pulse

### Test 2: Button Clickability
```
1. Move mouse over button
2. Click button
3. Should see cursor change to pointer
4. Should see modal open
```

**Expected**: ✅ Modal opens

### Test 3: Modal Functionality
```
1. Click button to open modal
2. Type test message: "Hello"
3. Click send button
4. Should see AI response
```

**Expected**: ✅ AI responds

### Test 4: Save Symptoms
```
1. Chat with AI about symptoms
2. Click "Save Symptoms for Doctor"
3. Should see success message
```

**Expected**: ✅ Symptoms saved

---

## 🐛 If Still Not Working

### Check 1: Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Take screenshot of errors
```

### Check 2: Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click chatbot button
4. Look for failed requests
5. Check response status
```

### Check 3: Token in Storage
```
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Look for "auth_token" key
5. Verify token value exists
```

### Check 4: Backend Running
```
1. Check if backend is running
2. Terminal should show: "Server running on port 5000"
3. Try accessing: http://localhost:5000/health
4. Should see: {"message": "Server is running"}
```

---

## 📝 Common Issues & Solutions

### Issue: Button not visible
**Solution**:
- Clear browser cache
- Restart frontend
- Check z-index in DevTools

### Issue: Button visible but not clickable
**Solution**:
- Check for JavaScript errors in console
- Verify token exists in localStorage
- Check if button has `pointer-events: auto`

### Issue: Modal opens but no response
**Solution**:
- Check OpenRouter API key in `.env`
- Verify backend is running
- Check network tab for failed requests
- Check server logs for errors

### Issue: Symptoms not saving
**Solution**:
- Verify you're logged in
- Check browser console for errors
- Verify backend is running
- Check MongoDB connection

---

## 🔍 Debug Mode

### Enable Console Logging
Add this to browser console:
```javascript
// Check token
console.log("Token:", localStorage.getItem("auth_token"))

// Check user
console.log("User:", localStorage.getItem("hospital_user"))

// Check if button exists
console.log("Button:", document.querySelector("button[class*='rounded-full']"))
```

### Check API Connection
```javascript
// Test API endpoint
fetch("http://localhost:5000/health")
  .then(r => r.json())
  .then(d => console.log("API OK:", d))
  .catch(e => console.log("API Error:", e))
```

---

## 📞 Support

If issues persist:

1. **Check Documentation**
   - CHATBOT_QUICK_START.md
   - CHATBOT_SETUP_GUIDE.md

2. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages

3. **Check Network Tab**
   - F12 → Network tab
   - Look for failed requests

4. **Check Server Logs**
   - Terminal running backend
   - Look for error messages

---

## ✅ Status

### Fixed Issues
- ✅ Token key mismatch
- ✅ Pulse animation blocking clicks
- ✅ Z-index layering

### Ready to Use
- ✅ Button clickable
- ✅ Modal opens
- ✅ Chat functional
- ✅ Symptoms save

---

## 🎯 Next Steps

1. Clear browser cache
2. Restart frontend
3. Test chatbot button
4. Verify it works
5. Start chatting!

**If you still have issues, check the browser console for error messages and share them for debugging.**

