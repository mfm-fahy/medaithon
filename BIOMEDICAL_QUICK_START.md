# 🏥 Biomedical App - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start Backend (Terminal 1)
```bash
cd d:\med\v3\server
node src/index.js
```

**Expected Output:**
```
✅ Server is running on port 5000
✅ MongoDB connected successfully
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd d:\med\v3\client
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.0
- Local: http://localhost:3000
```

### Step 3: Access Biomedical App
```
URL: http://localhost:3000/biomedical/login
```

### Step 4: Login
```
Username: biomedical_admin
Password: admin123
```

---

## 🎯 Main Features

### 1. Equipment Management
- **Location**: http://localhost:3000/biomedical/equipment
- **Features**:
  - View all equipment
  - Check maintenance status
  - Track service history
  - Monitor equipment health

### 2. Waste Management
- **Location**: http://localhost:3000/biomedical/waste
- **Features**:
  - View waste statistics
  - Check collection tasks
  - View dispatch schedule
  - Track waste by color

---

## 📊 Dashboard Overview

### Home Page
```
┌─────────────────────────────────────┐
│  🏥 BioMedical Management System    │
│  Equipment Maintenance & Waste Mgmt │
└─────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐
│ ⚙️ Equipment     │  │ ♻️ Waste         │
│ Maintenance     │  │ Management       │
│                 │  │                  │
│ [Go to Module]  │  │ [Go to Module]   │
└──────────────────┘  └──────────────────┘
```

### Equipment Page
```
Stats:
- Total Equipment: 0
- Active: 0
- Due Soon: 0
- Overdue: 0

Equipment List (Empty - Add first equipment)
```

### Waste Page
```
Waste Stats:
- 🟡 Yellow: 0 kg
- 🔴 Red: 0 kg
- 🔵 Blue: 0 kg
- ⚪ White: 0 kg

Daily Collection Tasks (Empty)
Weekly Dispatch Schedule (Empty)
```

---

## 🔑 Login Credentials

```
Username: biomedical_admin
Password: admin123
```

---

## 📱 Navigation

```
Login Page
    ↓
Home Page
    ├─→ Equipment Management
    │   ├─→ View Equipment
    │   ├─→ Add Equipment
    │   └─→ View Details
    │
    └─→ Waste Management
        ├─→ View Waste Stats
        ├─→ Collection Tasks
        └─→ Dispatch Schedule
```

---

## 🎨 UI Features

### Color Scheme
- **Equipment**: Blue gradient
- **Waste**: Green gradient
- **Status**: Color-coded badges
- **Background**: Light gray

### Status Indicators
- 🟢 Active (Green)
- 🟡 Due Soon (Yellow)
- 🔴 Overdue (Red)
- ⚪ Pending (Gray)

---

## 🧪 Quick Test

### Test 1: Login
```
1. Go to: http://localhost:3000/biomedical/login
2. Enter: biomedical_admin
3. Enter: admin123
4. Click: Login
Expected: Redirect to home page
```

### Test 2: Equipment Page
```
1. Click: "Go to Equipment Management"
2. Expected: Equipment list page loads
3. Check: Stats show 0 equipment
```

### Test 3: Waste Page
```
1. Click: "Go to Waste Management"
2. Expected: Waste management page loads
3. Check: Waste stats show 0 kg
```

### Test 4: Logout
```
1. Click: Logout button
2. Expected: Redirect to login page
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend
```
✓ Check: Backend running on port 5000
✓ Check: MongoDB connected
✓ Try: Restart backend
```

### Issue: Login fails
```
✓ Check: Username is "biomedical_admin"
✓ Check: Password is "admin123"
✓ Try: Clear browser cache
```

### Issue: Pages not loading
```
✓ Check: Frontend running on port 3000
✓ Check: No console errors
✓ Try: Refresh page
```

---

## 📊 API Endpoints

### Equipment
```
GET  /api/biomedical/equipment
POST /api/biomedical/equipment
```

### Waste
```
GET  /api/biomedical/waste
POST /api/biomedical/waste
```

### Collection Tasks
```
GET  /api/biomedical/collection-tasks
POST /api/biomedical/collection-tasks
```

### Dispatch
```
GET  /api/biomedical/dispatch
POST /api/biomedical/dispatch
```

---

## 🎯 Next Steps

1. ✅ Login to the app
2. ✅ Explore Equipment Management
3. ✅ Explore Waste Management
4. ✅ Test navigation
5. ✅ Check responsive design

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend terminal
3. Verify credentials
4. Restart both services
5. Clear browser cache

---

**Ready to use the Biomedical App!** 🏥✨

