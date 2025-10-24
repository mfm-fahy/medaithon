# 🧪 Staff Management - Testing Guide

## 📋 Test Categories

### 1. UI/UX Testing

#### Test 1.1: Role Selection Display
- [ ] All 5 role cards are visible
- [ ] Icons display correctly (👨‍⚕️ 👩‍⚕️ 💊 🔬 ⚙️)
- [ ] Color gradients are visible
- [ ] Hover effects work on role cards
- [ ] Selected role is highlighted

#### Test 1.2: Form Display
- [ ] Basic fields visible (Name, Username, Email, Password)
- [ ] Role-specific fields appear based on selection
- [ ] Field labels are clear
- [ ] Placeholder text is helpful
- [ ] Required fields are marked with *

#### Test 1.3: Responsive Design
- [ ] Mobile (375px): Single column layout
- [ ] Tablet (768px): 2-column layout
- [ ] Desktop (1920px): Full responsive
- [ ] No horizontal scrolling
- [ ] Buttons are clickable on all sizes

---

### 2. Form Validation Testing

#### Test 2.1: Required Fields
- [ ] Name field required
- [ ] Username field required
- [ ] Email field required
- [ ] Password field required
- [ ] Doctor Designation required
- [ ] Error messages appear for empty fields

#### Test 2.2: Password Validation
- [ ] Password < 6 chars shows error
- [ ] Password = 6 chars accepted
- [ ] Password > 6 chars accepted
- [ ] Error message: "Password must be at least 6 characters"

#### Test 2.3: Email Validation
- [ ] Invalid email format rejected
- [ ] Valid email format accepted
- [ ] Error message for invalid email

#### Test 2.4: Unique Validation
- [ ] Duplicate username rejected
- [ ] Duplicate email rejected
- [ ] Error message: "User already exists"

---

### 3. Role-Specific Field Testing

#### Test 3.1: Doctor Fields
- [ ] Designation field appears
- [ ] Specialization field appears
- [ ] Department field appears
- [ ] Years of Experience field appears
- [ ] All fields have correct placeholders

#### Test 3.2: Nurse Fields
- [ ] Department field appears
- [ ] License Number field appears
- [ ] Other fields hidden

#### Test 3.3: Pharmacist Fields
- [ ] Department field appears
- [ ] License Number field appears
- [ ] Other fields hidden

#### Test 3.4: Lab Technician Fields
- [ ] Department field appears
- [ ] License Number field appears
- [ ] Other fields hidden

#### Test 3.5: Biomedical Engineer Fields
- [ ] Department field appears
- [ ] Specialization field appears
- [ ] Other fields hidden

---

### 4. Form Submission Testing

#### Test 4.1: Doctor Submission
- [ ] Fill all required fields
- [ ] Click "Add Doctor" button
- [ ] Success message appears
- [ ] Redirected to dashboard
- [ ] Form clears

#### Test 4.2: Nurse Submission
- [ ] Fill all required fields
- [ ] Click "Add Nurse" button
- [ ] Success message appears
- [ ] Redirected to dashboard

#### Test 4.3: Pharmacist Submission
- [ ] Fill all required fields
- [ ] Click "Add Pharmacist" button
- [ ] Success message appears
- [ ] Redirected to dashboard

#### Test 4.4: Lab Technician Submission
- [ ] Fill all required fields
- [ ] Click "Add Lab Technician" button
- [ ] Success message appears
- [ ] Redirected to dashboard

#### Test 4.5: Biomedical Engineer Submission
- [ ] Fill all required fields
- [ ] Click "Add Biomedical Engineer" button
- [ ] Success message appears
- [ ] Redirected to dashboard

---

### 5. Error Handling Testing

#### Test 5.1: Network Errors
- [ ] Backend offline: Error message shown
- [ ] Connection timeout: Error message shown
- [ ] Invalid response: Error message shown

#### Test 5.2: Validation Errors
- [ ] Empty name: Error shown
- [ ] Empty username: Error shown
- [ ] Empty email: Error shown
- [ ] Empty password: Error shown
- [ ] Short password: Error shown

#### Test 5.3: Duplicate Errors
- [ ] Duplicate username: Error shown
- [ ] Duplicate email: Error shown

---

### 6. Database Testing

#### Test 6.1: User Record Creation
```bash
# Check MongoDB
db.users.findOne({ username: "testuser" })
```
- [ ] User record created
- [ ] Password hashed
- [ ] Role set correctly
- [ ] Email stored

#### Test 6.2: Staff Record Creation
```bash
# Check MongoDB
db.staffs.findOne({ userId: ObjectId("...") })
```
- [ ] Staff record created
- [ ] Role set correctly
- [ ] Department stored
- [ ] Other fields stored

#### Test 6.3: Data Integrity
- [ ] No duplicate records
- [ ] All fields stored correctly
- [ ] Timestamps created
- [ ] References correct

---

### 7. API Testing

#### Test 7.1: Signup Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Doctor",
    "username": "testdoctor",
    "email": "test@hospital.com",
    "password": "password123",
    "role": "doctor",
    "designation": "Senior Doctor"
  }'
```
- [ ] Returns 201 status
- [ ] Returns token
- [ ] Returns user data

#### Test 7.2: Get Staff Endpoint
```bash
curl -X GET http://localhost:5000/api/staff \
  -H "Authorization: Bearer <token>"
```
- [ ] Returns 200 status
- [ ] Returns staff array
- [ ] Includes all fields

#### Test 7.3: Get Staff by Role
```bash
curl -X GET http://localhost:5000/api/staff/role/doctor \
  -H "Authorization: Bearer <token>"
```
- [ ] Returns doctors only
- [ ] Returns correct count

---

### 8. Security Testing

#### Test 8.1: Authentication
- [ ] Non-admin cannot access
- [ ] Invalid token rejected
- [ ] Expired token rejected

#### Test 8.2: Authorization
- [ ] Only admin can add staff
- [ ] Only admin can view staff
- [ ] Only admin can delete staff

#### Test 8.3: Input Sanitization
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] Special characters handled

---

### 9. Performance Testing

#### Test 9.1: Form Load Time
- [ ] Page loads < 2 seconds
- [ ] Form renders smoothly
- [ ] No lag on interactions

#### Test 9.2: Submission Time
- [ ] Form submits < 3 seconds
- [ ] Success message appears quickly
- [ ] Redirect happens smoothly

#### Test 9.3: Database Performance
- [ ] Query completes < 1 second
- [ ] No timeout errors
- [ ] Handles concurrent requests

---

### 10. Integration Testing

#### Test 10.1: Dashboard Integration
- [ ] Staff management button visible
- [ ] Button navigates to form
- [ ] Form integrates with dashboard

#### Test 10.2: Authentication Integration
- [ ] New staff can login
- [ ] Credentials work correctly
- [ ] Role assigned correctly

#### Test 10.3: Database Integration
- [ ] Data persists
- [ ] Can retrieve staff data
- [ ] Can update staff data

---

## 🧪 Test Data

### Doctor
```
Name: Dr. Sarah Johnson
Username: sarahjohnson
Email: sarah@hospital.com
Password: secure123
Designation: Senior Doctor
Specialization: Cardiology
Department: Cardiology Department
Years of Experience: 8
```

### Nurse
```
Name: Emily Davis
Username: emilydavis
Email: emily@hospital.com
Password: secure123
Department: ICU Ward A
License Number: NURSE123456
```

### Pharmacist
```
Name: Michael Chen
Username: michaelchen
Email: michael@hospital.com
Password: secure123
Department: Pharmacy
License Number: PHARM123456
```

### Lab Technician
```
Name: Sarah Wilson
Username: sarahwilson
Email: sarah@hospital.com
Password: secure123
Department: Laboratory
License Number: LAB123456
```

### Biomedical Engineer
```
Name: Robert Johnson
Username: robertjohnson
Email: robert@hospital.com
Password: secure123
Department: Biomedical Engineering
Specialization: Equipment Maintenance
```

---

## ✅ Test Execution Checklist

- [ ] All UI tests passed
- [ ] All validation tests passed
- [ ] All role-specific tests passed
- [ ] All submission tests passed
- [ ] All error handling tests passed
- [ ] All database tests passed
- [ ] All API tests passed
- [ ] All security tests passed
- [ ] All performance tests passed
- [ ] All integration tests passed

---

## 📊 Test Results Summary

| Category | Tests | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| UI/UX | 3 | - | - | ⏳ |
| Validation | 4 | - | - | ⏳ |
| Role-Specific | 5 | - | - | ⏳ |
| Submission | 5 | - | - | ⏳ |
| Error Handling | 3 | - | - | ⏳ |
| Database | 3 | - | - | ⏳ |
| API | 3 | - | - | ⏳ |
| Security | 3 | - | - | ⏳ |
| Performance | 3 | - | - | ⏳ |
| Integration | 3 | - | - | ⏳ |
| **TOTAL** | **36** | **-** | **-** | **⏳** |

---

## 🎯 Success Criteria

✅ All tests pass
✅ No console errors
✅ No validation errors
✅ Data persists in database
✅ New staff can login
✅ Responsive on all devices
✅ Performance acceptable
✅ Security measures working

---

**Status:** Ready for Testing
**Date:** 2025-10-24
**Version:** 1.0.0

