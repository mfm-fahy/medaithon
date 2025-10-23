# 🧪 Complete Testing Guide - Patient Backend System

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- MongoDB connected and running

## 🚀 Step-by-Step Testing

### Step 1: Patient Signup
1. Open browser and go to `http://localhost:3000/patient/signup`
2. Fill in the form:
   - **Username**: `testpatient1`
   - **Email**: `test1@example.com`
   - **Password**: `password123`
   - **Name**: `John Doe`
   - **Age**: `30`
   - **Sex**: `Male`
   - **Phone**: `9876543210`
   - **Occupation**: `Engineer`
   - **Address**: `123 Main Street, City`
3. Click "Sign Up"
4. **Expected Result**:
   - ✅ Success message appears
   - ✅ QR code is displayed
   - ✅ Patient ID is shown (format: P{timestamp})
   - ✅ Redirects to patient home page

### Step 2: View Patient Home Page
1. After signup, you should be on the home page
2. **Verify**:
   - ✅ Patient name displayed
   - ✅ Patient ID visible
   - ✅ QR code displayed
   - ✅ Quick action buttons visible
   - ✅ Patient information card shows details

### Step 3: Schedule a Visit
1. On home page, scroll to "Schedule a Visit" section
2. Fill in the form:
   - **Visit Type**: Select "New Visit"
   - **Department**: Select "OP Nurse" (or any department)
   - **Symptoms**: "Headache and fever for 2 days"
   - **Additional Details**: "Started after traveling"
3. Click "Schedule Visit"
4. **Expected Result**:
   - ✅ Success message appears
   - ✅ Hospital Navigation card appears with:
     - Room Number (e.g., A001)
     - Floor (e.g., Ground Floor)
     - Department (OP Nurse)
     - Estimated Wait Time (e.g., 25 minutes)
     - Step-by-step directions
   - ✅ Redirects to navigation page after 3 seconds

### Step 4: View Real-time Navigation
1. On the navigation page, verify:
   - ✅ Connection status shows "Real-time updates connected"
   - ✅ Room number displayed prominently
   - ✅ Floor and department information
   - ✅ Estimated wait time shown
   - ✅ Step-by-step directions visible
   - ✅ Status badge shows "scheduled"
   - ✅ Last updated timestamp visible

### Step 5: Test Real-time Updates
1. Keep the navigation page open
2. Open browser console (F12)
3. **Observe**:
   - ✅ WebSocket connection message in console
   - ✅ Wait time updates every few seconds
   - ✅ Last updated timestamp changes
   - ✅ No page refresh needed

### Step 6: Test Multiple Visits
1. Go back to home page
2. Schedule another visit with different department:
   - **Department**: "Cardiology"
   - **Symptoms**: "Chest pain"
3. **Expected Result**:
   - ✅ New room number generated
   - ✅ Different floor assigned (1st Floor)
   - ✅ Different wait time range (20-60 minutes)
   - ✅ New directions generated

### Step 7: Test Logout & Login
1. Click logout button
2. Go to `http://localhost:3000/patient/signin`
3. Login with credentials:
   - **Username**: `testpatient1`
   - **Password**: `password123`
4. **Expected Result**:
   - ✅ Successfully logged in
   - ✅ Redirects to home page
   - ✅ Patient ID and QR code visible
   - ✅ Previous visit data preserved

## 🔍 Backend Testing (Using Postman/cURL)

### Test 1: Signup API
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testpatient2",
    "email": "test2@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "role": "patient",
    "age": 28,
    "sex": "female",
    "phone": "9876543211",
    "occupation": "Doctor",
    "address": "456 Oak Ave"
  }'
```

**Expected Response**:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "testpatient2",
    "email": "test2@example.com",
    "role": "patient",
    "name": "Jane Smith",
    "patientId": "P1729123456789",
    "qrCode": "{\"patientId\":\"P1729123456789\",...}"
  }
}
```

### Test 2: Schedule Visit API
```bash
curl -X POST http://localhost:5000/api/visits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "visitType": "new",
    "symptoms": "Severe headache",
    "description": "Persistent for 3 days",
    "department": "Neurology"
  }'
```

**Expected Response**:
```json
{
  "message": "Visit created successfully",
  "visit": { ... },
  "hospitalNavigation": {
    "roomNumber": "F-105",
    "floor": "2nd Floor",
    "department": "Neurology",
    "directions": "Turn right from the main entrance → Go straight ahead → Take the elevator to your floor",
    "estimatedWaitTime": 45,
    "status": "scheduled",
    "lastUpdated": "2024-10-23T..."
  }
}
```

### Test 3: Get Navigation API
```bash
curl -X GET http://localhost:5000/api/visits/navigation/P1729123456789 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 4: Get Real-time Navigation API
```bash
curl -X GET http://localhost:5000/api/visits/navigation/realtime/P1729123456789 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔌 WebSocket Testing

### Using Browser Console
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000');

// Listen for messages
ws.onmessage = (event) => {
  console.log('Message:', JSON.parse(event.data));
};

// Register for updates
ws.send(JSON.stringify({
  type: 'register',
  patientId: 'P1729123456789'
}));

// Send ping
ws.send(JSON.stringify({ type: 'ping' }));
```

## 📊 Expected Wait Time Ranges

| Department | Min | Max |
|-----------|-----|-----|
| OP Nurse | 15 | 45 |
| Emergency | 5 | 30 |
| Cardiology | 20 | 60 |
| Orthopedics | 25 | 50 |
| Pediatrics | 10 | 40 |
| Neurology | 30 | 75 |
| General Surgery | 40 | 90 |
| Radiology | 15 | 45 |

## 🎯 Verification Checklist

### Frontend
- [ ] Signup form works
- [ ] QR code displays
- [ ] Patient ID generated
- [ ] Home page loads
- [ ] Visit form submits
- [ ] Hospital navigation displays
- [ ] Real-time updates work
- [ ] Connection status shows
- [ ] Navigation page updates
- [ ] Logout works
- [ ] Login works
- [ ] Data persists after logout

### Backend
- [ ] Signup endpoint works
- [ ] QR code generated
- [ ] Patient ID unique
- [ ] MongoDB stores data
- [ ] Login endpoint works
- [ ] Token generated
- [ ] Visit endpoint works
- [ ] Navigation generated
- [ ] WebSocket connects
- [ ] Real-time updates sent
- [ ] Navigation API works
- [ ] All endpoints secured

### Database
- [ ] Patient document created
- [ ] User document created
- [ ] Visit document created
- [ ] QR code stored
- [ ] Navigation data stored
- [ ] Timestamps correct
- [ ] Indexes working

## 🐛 Troubleshooting

### Issue: "Invalid credentials" on login
- **Solution**: Verify username and password are correct
- Check MongoDB has the user document

### Issue: WebSocket not connecting
- **Solution**: Check backend is running
- Verify WebSocket port is accessible
- Check browser console for errors

### Issue: Navigation not displaying
- **Solution**: Verify visit was scheduled successfully
- Check token is valid
- Verify patient ID is correct

### Issue: Wait time not updating
- **Solution**: Check WebSocket connection status
- Verify browser console shows no errors
- Refresh page to reconnect

## 📝 Notes

- All tests should be performed in order
- Use different usernames for each test
- Keep browser console open to see WebSocket messages
- Wait times update every few seconds
- Room numbers are randomly generated each time
- Directions are randomly selected from a pool

## ✅ Success Criteria

All tests pass when:
1. ✅ Patient can signup with QR code
2. ✅ Patient ID is unique and generated
3. ✅ Hospital navigation displays correctly
4. ✅ Real-time updates work via WebSocket
5. ✅ Wait times update automatically
6. ✅ All data persists in MongoDB
7. ✅ Frontend and backend communicate properly
8. ✅ No console errors
9. ✅ All endpoints return correct responses
10. ✅ User experience is smooth and responsive

