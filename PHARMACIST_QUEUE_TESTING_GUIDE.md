# 🧪 Pharmacist Queue - Complete Testing Guide

## 🎯 Testing Overview

This guide provides step-by-step instructions to test the pharmacist patient queue feature with real data.

---

## 📋 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Pharmacist | `pharmacist_1` | `password123` |
| Doctor | `dr_general_1` | `password123` |
| Patient | `patient_john` | `password123` |

---

## 🧪 Test Scenario 1: Access Patient Queue

### Step 1: Pharmacist Login
```
URL: http://localhost:3001/pharmacist/signin
Username: pharmacist_1
Password: password123
```

### Step 2: Navigate to Dashboard
1. Should see Pharmacist Dashboard
2. Should see three buttons:
   - ✅ "📋 Patient Queue" (Green)
   - ✅ "💊 Medicine Management" (Blue)
   - ✅ "Logout" (White)

### Step 3: Click Patient Queue Button
1. Click "📋 Patient Queue" button
2. Should navigate to `/pharmacist/queue`
3. Page should load with:
   - ✅ Header: "💊 Patient Queue"
   - ✅ Search bar
   - ✅ Patient list
   - ✅ Patient details sidebar (empty initially)
   - ✅ Statistics card

### Expected Results
- ✅ Page loads without errors
- ✅ All UI elements visible
- ✅ No console errors
- ✅ Loading state shows briefly

---

## 🧪 Test Scenario 2: Load Patients with Prescriptions

### Step 1: Wait for Data Load
1. Page should show "Loading patients..." briefly
2. After 2-3 seconds, patients should appear

### Step 2: Verify Patient List
1. Should see multiple patient cards
2. Each card should show:
   - ✅ Patient name
   - ✅ Patient ID (e.g., P001)
   - ✅ Age and sex
   - ✅ Phone number
   - ✅ Medicine count badge (e.g., "💊 5 medicines")
   - ✅ "View Details" button

### Step 3: Check Statistics
1. Scroll to bottom
2. Should see statistics card with:
   - ✅ Total Patients count
   - ✅ Total Prescriptions count
   - ✅ Average Medicines/Patient
   - ✅ Last Updated timestamp

### Expected Results
- ✅ All patients with prescriptions display
- ✅ Patient information is accurate
- ✅ Medicine counts are correct
- ✅ Statistics calculate correctly

---

## 🧪 Test Scenario 3: Search Functionality

### Test 3A: Search by Patient Name
1. Enter patient name in search box (e.g., "John")
2. List should filter in real-time
3. Only patients with "John" in name should show
4. Clear search box
5. All patients should reappear

### Test 3B: Search by Patient ID
1. Enter patient ID in search box (e.g., "P001")
2. List should filter to show only that patient
3. Clear search box
4. All patients should reappear

### Test 3C: Case-Insensitive Search
1. Enter "john" (lowercase)
2. Should find patients with "John" (uppercase)
3. Enter "JOHN" (uppercase)
4. Should find same patients

### Test 3D: No Results
1. Enter non-existent patient name (e.g., "XYZ123")
2. Should show "No patients with prescriptions found"
3. Clear search
4. All patients should reappear

### Expected Results
- ✅ Search filters in real-time
- ✅ Case-insensitive search works
- ✅ No results message displays
- ✅ Clear search restores full list

---

## 🧪 Test Scenario 4: View Patient Details

### Step 1: Click on Patient Card
1. Click on any patient card
2. Patient details sidebar should open on right
3. Should show:
   - ✅ Patient name
   - ✅ Patient ID
   - ✅ Age
   - ✅ Sex
   - ✅ Email
   - ✅ Phone

### Step 2: View Prescriptions
1. Scroll down in sidebar
2. Should see "💊 Medicines" section
3. Should list all medicines for patient with:
   - ✅ Medicine name
   - ✅ Route badge (e.g., "Oral", "IV", "IM")
   - ✅ Dose (e.g., "500mg")
   - ✅ Frequency (e.g., "Twice daily")
   - ✅ Duration (e.g., "5 days")
   - ✅ Advice (if any)
   - ✅ Prescribing doctor name

### Step 3: Close Sidebar
1. Click "✕" button in sidebar
2. Sidebar should close
3. Patient list should be fully visible

### Step 4: Open Different Patient
1. Click on different patient card
2. Sidebar should update with new patient details
3. Should show correct medicines for new patient

### Expected Results
- ✅ Sidebar opens and closes correctly
- ✅ Patient information displays accurately
- ✅ All prescriptions show with complete details
- ✅ Doctor names display correctly
- ✅ Switching patients updates sidebar

---

## 🧪 Test Scenario 5: Manage Medicines Button

### Step 1: Open Patient Details
1. Click on patient card
2. Sidebar opens

### Step 2: Click Manage Medicines
1. Click "Manage Medicines" button
2. Should navigate to `/pharmacist/patient/{patientId}`
3. Should see medicine management page

### Step 3: Verify Navigation
1. Should see patient information
2. Should see prescriptions list
3. Should see medicine purchase options

### Expected Results
- ✅ Navigation works correctly
- ✅ Patient ID is passed correctly
- ✅ Medicine management page loads
- ✅ Correct patient data displays

---

## 🧪 Test Scenario 6: Error Handling

### Test 6A: Network Error
1. Disconnect internet
2. Click "Patient Queue"
3. Should show error message
4. Reconnect internet
5. Refresh page
6. Should load successfully

### Test 6B: API Error
1. Stop backend server
2. Click "Patient Queue"
3. Should show error message
4. Start backend server
5. Refresh page
6. Should load successfully

### Test 6C: Invalid Patient ID
1. Manually edit URL to invalid patient ID
2. Should show error or empty state
3. Go back to queue
4. Should work normally

### Expected Results
- ✅ Error messages display clearly
- ✅ No console errors
- ✅ Can recover from errors
- ✅ Graceful error handling

---

## 🧪 Test Scenario 7: Responsive Design

### Test 7A: Desktop View (1920x1080)
1. Open on desktop browser
2. Should show 3-column layout:
   - ✅ Search bar (full width)
   - ✅ Patient list (left, 2/3 width)
   - ✅ Patient details (right, 1/3 width)
3. All elements should be visible
4. No horizontal scrolling needed

### Test 7B: Tablet View (768x1024)
1. Open on tablet or resize browser
2. Should show 2-column layout
3. Patient list and details should stack
4. Should be readable and usable

### Test 7C: Mobile View (375x667)
1. Open on mobile or resize browser
2. Should show 1-column layout
3. All elements should stack vertically
4. Should be readable and usable
5. No horizontal scrolling

### Expected Results
- ✅ Desktop layout works perfectly
- ✅ Tablet layout is responsive
- ✅ Mobile layout is usable
- ✅ No layout issues on any device

---

## 🧪 Test Scenario 8: Performance

### Test 8A: Load Time
1. Open Patient Queue page
2. Measure time to load
3. Should load in < 3 seconds
4. Should show loading state

### Test 8B: Search Performance
1. Type in search box
2. Should filter instantly
3. No lag or delay
4. Smooth typing experience

### Test 8C: Scroll Performance
1. Scroll through patient list
2. Should be smooth
3. No stuttering or lag
4. Smooth scrolling in sidebar

### Expected Results
- ✅ Fast page load
- ✅ Instant search filtering
- ✅ Smooth scrolling
- ✅ No performance issues

---

## 🧪 Test Scenario 9: Data Accuracy

### Step 1: Verify Patient Data
1. Open Patient Queue
2. Compare displayed patient info with database
3. Should match exactly:
   - ✅ Patient name
   - ✅ Patient ID
   - ✅ Age
   - ✅ Sex
   - ✅ Email
   - ✅ Phone

### Step 2: Verify Prescription Data
1. Click on patient
2. Compare medicines with database
3. Should match exactly:
   - ✅ Medicine name
   - ✅ Route
   - ✅ Dose
   - ✅ Frequency
   - ✅ Duration
   - ✅ Doctor name

### Expected Results
- ✅ All patient data is accurate
- ✅ All prescription data is accurate
- ✅ No missing information
- ✅ No incorrect information

---

## 🧪 Test Scenario 10: Security

### Test 10A: Authentication
1. Logout from pharmacist account
2. Try to access `/pharmacist/queue` directly
3. Should redirect to login page
4. Should not show any data

### Test 10B: Authorization
1. Login as different role (e.g., doctor)
2. Try to access `/pharmacist/queue` directly
3. Should redirect to appropriate dashboard
4. Should not show pharmacist data

### Test 10C: Token Validation
1. Open Patient Queue
2. Clear auth token from localStorage
3. Refresh page
4. Should redirect to login
5. Should not show any data

### Expected Results
- ✅ Unauthenticated users cannot access
- ✅ Wrong role cannot access
- ✅ Invalid tokens are rejected
- ✅ Secure access control

---

## ✅ Testing Checklist

### Functionality
- [ ] Patient Queue page loads
- [ ] Patients display with prescriptions
- [ ] Search by name works
- [ ] Search by ID works
- [ ] Patient details sidebar opens
- [ ] Prescriptions display correctly
- [ ] Manage medicines button works
- [ ] Statistics display correctly

### UI/UX
- [ ] All elements visible
- [ ] Colors and styling correct
- [ ] Buttons are clickable
- [ ] Sidebar is sticky
- [ ] Responsive on desktop
- [ ] Responsive on tablet
- [ ] Responsive on mobile
- [ ] No layout issues

### Performance
- [ ] Page loads quickly
- [ ] Search is instant
- [ ] Scrolling is smooth
- [ ] No lag or stuttering
- [ ] No memory leaks

### Security
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Tokens validated
- [ ] No data leaks
- [ ] Secure API calls

### Data
- [ ] Patient data accurate
- [ ] Prescription data accurate
- [ ] Doctor names correct
- [ ] Statistics correct
- [ ] No missing data

### Error Handling
- [ ] Network errors handled
- [ ] API errors handled
- [ ] Invalid data handled
- [ ] Error messages clear
- [ ] Can recover from errors

---

## 📊 Backend Logs to Check

When loading patient queue, you should see:
```
✅ Patients fetched: 15
✅ Prescriptions fetched for patient: P001
✅ Prescriptions fetched for patient: P002
...
```

---

## 🎉 All Tests Passed!

If all scenarios pass, the feature is ready for:
- ✅ User training
- ✅ Production deployment
- ✅ User feedback collection

---

## 📞 Troubleshooting

### Issue: No patients showing
- Check backend is running
- Check database has patients with prescriptions
- Check browser console for errors
- Refresh page

### Issue: Search not working
- Check search input is focused
- Try different search term
- Refresh page
- Check browser console

### Issue: Sidebar not opening
- Click on patient card again
- Refresh page
- Check browser console
- Try different patient

### Issue: Medicines not showing
- Verify patient has prescriptions in database
- Refresh page
- Check browser console
- Verify API is returning data

---

## 🚀 Next Steps After Testing

1. ✅ All tests pass
2. 📚 Create training materials
3. 👥 Train pharmacists
4. 🚀 Deploy to production
5. 📊 Monitor for issues
6. 💬 Gather user feedback

**Ready to test! 🧪✨**


