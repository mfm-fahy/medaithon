# 🧪 Biomedical App - Complete Testing Guide

## ✅ Pre-Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Browser console open (F12)
- [ ] No previous login sessions

---

## 🧪 Test Suite 1: Authentication

### Test 1.1: Valid Login
```
Steps:
1. Go to: http://localhost:3000/biomedical/login
2. Enter Username: biomedical_admin
3. Enter Password: admin123
4. Click: Login

Expected:
✅ Page redirects to /biomedical/home
✅ Welcome message shows username
✅ No console errors
```

### Test 1.2: Invalid Username
```
Steps:
1. Go to: http://localhost:3000/biomedical/login
2. Enter Username: wrong_user
3. Enter Password: admin123
4. Click: Login

Expected:
✅ Error message: "Invalid username or password"
✅ Stay on login page
✅ No redirect
```

### Test 1.3: Invalid Password
```
Steps:
1. Go to: http://localhost:3000/biomedical/login
2. Enter Username: biomedical_admin
3. Enter Password: wrong_pass
4. Click: Login

Expected:
✅ Error message: "Invalid username or password"
✅ Stay on login page
✅ No redirect
```

### Test 1.4: Empty Fields
```
Steps:
1. Go to: http://localhost:3000/biomedical/login
2. Leave fields empty
3. Check: Login button

Expected:
✅ Login button is disabled
✅ Cannot submit form
```

---

## 🧪 Test Suite 2: Home Page

### Test 2.1: Home Page Load
```
Steps:
1. Login successfully
2. Check: Home page loads

Expected:
✅ Header shows "BioMedical Management System"
✅ Two main cards visible
✅ Quick stats displayed
✅ Logout button visible
```

### Test 2.2: Navigation to Equipment
```
Steps:
1. On home page
2. Click: "Go to Equipment Management"

Expected:
✅ Redirect to /biomedical/equipment
✅ Equipment page loads
✅ Header shows "Equipment Management"
```

### Test 2.3: Navigation to Waste
```
Steps:
1. On home page
2. Click: "Go to Waste Management"

Expected:
✅ Redirect to /biomedical/waste
✅ Waste page loads
✅ Header shows "Waste Management"
```

### Test 2.4: Logout
```
Steps:
1. On home page
2. Click: Logout button

Expected:
✅ Redirect to /biomedical/login
✅ localStorage cleared
✅ Session ended
```

---

## 🧪 Test Suite 3: Equipment Management

### Test 3.1: Equipment Page Load
```
Steps:
1. Navigate to Equipment Management
2. Check: Page loads

Expected:
✅ Header shows "Equipment Management"
✅ Stats cards visible
✅ Equipment list visible
✅ "Add Equipment" button visible
```

### Test 3.2: Equipment Stats
```
Steps:
1. On Equipment page
2. Check: Stats cards

Expected:
✅ Total Equipment: 0
✅ Active: 0
✅ Due Soon: 0
✅ Overdue: 0
```

### Test 3.3: Back Navigation
```
Steps:
1. On Equipment page
2. Click: Back button

Expected:
✅ Redirect to /biomedical/home
✅ Home page loads
```

### Test 3.4: Add Equipment Button
```
Steps:
1. On Equipment page
2. Click: "Add Equipment" button

Expected:
✅ Button is clickable
✅ No errors in console
```

---

## 🧪 Test Suite 4: Waste Management

### Test 4.1: Waste Page Load
```
Steps:
1. Navigate to Waste Management
2. Check: Page loads

Expected:
✅ Header shows "Waste Management"
✅ Waste stats visible
✅ Collection tasks section visible
✅ Dispatch schedule section visible
```

### Test 4.2: Waste Statistics
```
Steps:
1. On Waste page
2. Check: Waste stats

Expected:
✅ Yellow Waste: 0 kg
✅ Red Waste: 0 kg
✅ Blue Waste: 0 kg
✅ White Waste: 0 kg
```

### Test 4.3: Collection Tasks
```
Steps:
1. On Waste page
2. Check: Collection tasks section

Expected:
✅ Section visible
✅ "No collection tasks scheduled" message
✅ "Add Waste Record" button visible
```

### Test 4.4: Dispatch Schedule
```
Steps:
1. On Waste page
2. Check: Dispatch schedule section

Expected:
✅ Section visible
✅ Table headers visible
✅ "No dispatch scheduled" message
```

### Test 4.5: Back Navigation
```
Steps:
1. On Waste page
2. Click: Back button

Expected:
✅ Redirect to /biomedical/home
✅ Home page loads
```

---

## 🧪 Test Suite 5: Responsive Design

### Test 5.1: Mobile View (375px)
```
Steps:
1. Open DevTools (F12)
2. Set viewport to 375x667
3. Navigate through all pages

Expected:
✅ All content visible
✅ No horizontal scroll
✅ Touch-friendly buttons
✅ Text readable
```

### Test 5.2: Tablet View (768px)
```
Steps:
1. Set viewport to 768x1024
2. Navigate through all pages

Expected:
✅ Layout adjusts properly
✅ Cards display well
✅ Tables readable
✅ No overflow
```

### Test 5.3: Desktop View (1024px+)
```
Steps:
1. Set viewport to 1920x1080
2. Navigate through all pages

Expected:
✅ Optimal layout
✅ All features visible
✅ Professional appearance
```

---

## 🧪 Test Suite 6: UI/UX

### Test 6.1: Color Scheme
```
Expected:
✅ Equipment: Blue gradient
✅ Waste: Green gradient
✅ Status badges: Color-coded
✅ Background: Light gray
```

### Test 6.2: Icons
```
Expected:
✅ All icons display correctly
✅ Icons are properly sized
✅ Icons match content
```

### Test 6.3: Buttons
```
Expected:
✅ All buttons clickable
✅ Hover effects work
✅ Disabled state visible
✅ Loading state visible
```

### Test 6.4: Cards
```
Expected:
✅ Cards display properly
✅ Shadows visible
✅ Hover effects work
✅ Content readable
```

---

## 🧪 Test Suite 7: Error Handling

### Test 7.1: Network Error
```
Steps:
1. Stop backend server
2. Try to load equipment page
3. Check: Error handling

Expected:
✅ Graceful error message
✅ No console errors
✅ User can retry
```

### Test 7.2: Session Expiry
```
Steps:
1. Clear localStorage
2. Try to access /biomedical/equipment

Expected:
✅ Redirect to login page
✅ Session validation works
```

---

## 📊 Test Results Template

```
Test Suite: _______________
Date: _______________
Tester: _______________

Test 1: ✅ PASS / ❌ FAIL
Test 2: ✅ PASS / ❌ FAIL
Test 3: ✅ PASS / ❌ FAIL
Test 4: ✅ PASS / ❌ FAIL
Test 5: ✅ PASS / ❌ FAIL

Total: __/5 PASSED
Success Rate: ___%

Notes:
_________________________________
_________________________________
```

---

## 🎯 Acceptance Criteria

- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Navigation works correctly
- [ ] UI looks professional
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] Session management works

---

**Ready to test the Biomedical App!** 🧪✨

