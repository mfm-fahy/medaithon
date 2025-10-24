# 🎯 Triage Color Prediction System - Implementation Guide

## Overview
A complete triage color prediction system has been implemented in the hospital management system. The system uses the `triage_model.onnx` machine learning model to predict patient priority levels (Red, Yellow, Green, Blue) based on vital signs entered by nurses.

---

## 🏗️ Architecture

### Backend Components

#### 1. **Triage Service** (`server/src/services/triageService.js` & `.ts`)
- Loads and manages the ONNX triage model
- Provides triage color prediction based on vitals
- Implements fallback prediction using vital thresholds
- Normalizes input data for model inference

**Key Methods:**
- `initialize()` - Loads the ONNX model
- `predictTriageColor(vitals)` - Predicts triage color using ML model
- `getFallbackTriageColor(vitals)` - Fallback prediction using thresholds

#### 2. **Vitals Model Updates** (`server/src/models/Vitals.ts` & `.js`)
- Added `triageColor` field to store predicted color
- Enum values: `['red', 'yellow', 'green', 'blue']`
- Default value: `null`

#### 3. **Vitals Routes** (`server/src/routes/vitals.ts` & `.js`)
- **POST `/api/vitals`** - Records vitals with automatic triage prediction
- **POST `/api/vitals/predict-triage`** - Predicts triage color for given vitals

### Frontend Components

#### 1. **Nurse Vitals Page** (`client/app/nurse/vitals/page.tsx`)
- Added triage color prediction UI
- Features:
  - "🎯 Predict Triage Color" button
  - Color selection buttons (Red, Yellow, Green, Blue)
  - Visual feedback with color indicators
  - Prevents form submission without triage color selection

#### 2. **Patient Home Page** (`client/app/patient/home/page.tsx`)
- Displays latest triage color status
- Shows priority level with emoji indicators
- Fetches latest vitals from backend
- Color-coded display card

---

## 🔄 Data Flow

### Vitals Recording with Triage Prediction

```
Nurse enters vitals
    ↓
Clicks "Predict Triage Color" button
    ↓
Frontend sends vitals to /api/vitals/predict-triage
    ↓
Backend loads ONNX model (if not loaded)
    ↓
Model predicts triage color
    ↓
Frontend displays color options
    ↓
Nurse selects/confirms color
    ↓
Nurse submits vitals with selected color
    ↓
Backend saves vitals with triageColor
    ↓
Patient app fetches and displays triage color
```

---

## 📊 Triage Color Meanings

| Color | Priority | Meaning | Response Time |
|-------|----------|---------|----------------|
| 🔴 Red | Critical | Immediate attention required | Immediate |
| 🟡 Yellow | Urgent | High priority | Within 30 mins |
| 🟢 Green | Non-Urgent | Routine care | Within 2 hours |
| 🔵 Blue | Semi-Urgent | Moderate priority | Within 1 hour |

---

## 🔧 Installation & Setup

### 1. Install ONNX Runtime
```bash
cd server
npm install onnxruntime-node
```

### 2. Ensure Model File Exists
- File: `server/triage_model.onnx`
- Should be in the server root directory

### 3. Start Backend
```bash
cd server
npm run dev
```

The triage service will automatically initialize when the first prediction is requested.

---

## 📝 API Endpoints

### Predict Triage Color
```
POST /api/vitals/predict-triage
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "height": 170,
  "weight": 70,
  "temperature": 37,
  "bloodPressure": "120/80",
  "heartRate": 72,
  "respiratoryRate": 16,
  "pulse": 72
}

Response:
{
  "triageColor": "green"
}
```

### Record Vitals with Triage
```
POST /api/vitals
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "patientId": "ObjectId",
  "height": 170,
  "weight": 70,
  "temperature": 37,
  "bloodPressure": "120/80",
  "heartRate": 72,
  "respiratoryRate": 16,
  "pulse": 72,
  "triageColor": "green"  // Optional - auto-predicted if not provided
}

Response:
{
  "message": "Vitals recorded successfully",
  "vitals": { ... }
}
```

---

## 🎨 UI Features

### Nurse App
- Triage prediction button with loading state
- Color selection buttons with visual feedback
- Selected color indicator
- Form submission disabled until color is selected

### Patient App
- Triage status card on home page
- Color-coded priority display
- Priority level description
- Last update timestamp

---

## ⚙️ Configuration

### Model Input Normalization
The model expects normalized input (0-1 range):
- Height: divided by 200 cm
- Weight: divided by 150 kg
- Temperature: divided by 42°C
- Systolic BP: divided by 200
- Diastolic BP: divided by 120
- Heart Rate: divided by 200 bpm
- Respiratory Rate: divided by 50
- Pulse: divided by 200 bpm

### Fallback Prediction Logic
If ONNX model fails to load, uses threshold-based prediction:
- **Red (Critical)**: Severity score ≥ 6
- **Yellow (Urgent)**: Severity score ≥ 4
- **Blue (Semi-Urgent)**: Severity score ≥ 2
- **Green (Non-Urgent)**: Severity score < 2

---

## 🧪 Testing

### Manual Testing Steps

1. **Login as Nurse**
   - Navigate to nurse dashboard
   - Scan patient QR code

2. **Enter Vitals**
   - Fill in all vital fields
   - Click "Predict Triage Color"
   - Verify color prediction appears

3. **Select Color**
   - Click on predicted color to confirm
   - Or select different color if needed

4. **Submit Vitals**
   - Click "Record Vitals"
   - Verify success message

5. **Check Patient App**
   - Login as patient
   - Go to home page
   - Verify triage color displays

---

## 📋 Files Modified/Created

### Created Files
- `server/src/services/triageService.js`
- `server/src/services/triageService.ts`

### Modified Files
- `server/src/models/Vitals.ts` - Added triageColor field
- `server/src/models/Vitals.js` - Added triageColor field
- `server/src/routes/vitals.ts` - Added triage endpoints
- `server/src/routes/vitals.js` - Added triage endpoints
- `client/app/nurse/vitals/page.tsx` - Added triage UI
- `client/app/patient/home/page.tsx` - Added triage display

### Dependencies Added
- `onnxruntime-node` - ONNX model inference

---

## ✅ Implementation Status

- [x] ONNX runtime installed
- [x] Triage service created
- [x] Vitals model updated with triageColor field
- [x] Backend API endpoints created
- [x] Nurse app UI for triage prediction
- [x] Patient app triage display
- [x] Fallback prediction logic
- [x] Error handling

---

## 🚀 Next Steps

1. **Test the complete workflow** with real patient data
2. **Monitor model performance** and adjust thresholds if needed
3. **Add triage history** to patient records
4. **Implement triage alerts** for critical patients
5. **Add triage reports** for hospital analytics

---

## 📞 Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify ONNX model file exists at `server/triage_model.onnx`
3. Ensure onnxruntime-node is properly installed
4. Check backend is running on port 5000

---

**Implementation Complete! 🎉**

