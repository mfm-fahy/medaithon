# 💳 Payment Gateway - Quick Start Guide

## 🚀 Quick Test (2 minutes)

### Patient Side - Schedule Visit with Payment

**Step 1: Login as Patient**
```
URL: http://localhost:3000/patient/signin
Username: patient_john
Password: password123
```

**Step 2: Go to Home**
```
URL: http://localhost:3000/patient/home
```

**Step 3: Schedule Visit**
```
1. Scroll down to "Schedule a Visit"
2. Select: "New Visit"
3. Describe symptoms: "I have a headache"
4. Click: "Schedule Visit"
```

**Step 4: Payment Modal**
```
The payment modal will open with 4 options:

💜 PhonePe
   - Fast & Secure
   - Instant completion

💙 Google Pay
   - Quick Payment
   - Instant completion

🟠 Credit Card
   - Visa, Mastercard
   - Instant completion

💚 Cash
   - Pay at Counter
   - Pending until collected
```

**Step 5: Select Payment Method**
```
Click any payment method:
- PhonePe, Google Pay, Credit Card → Instant ✅
- Cash → Pending ⏳

Watch the animation:
- Loading spinner (2 seconds)
- Success message with Transaction ID
- Auto-redirect to navigation page
```

---

### Nurse Side - Collect Payment

**Step 1: Login as Nurse**
```
URL: http://localhost:3000/nurse/patients
Username: nurse_sarah
Password: password123
```

**Step 2: Find Patient**
```
Option A: Scan QR Code
- Click "Scan QR Code"
- Point at patient's QR code

Option B: Select from List
- Click patient name from list
```

**Step 3: View Payment Info**
```
Payment Info Card displays:
- Amount: ₹200
- Payment Method: PhonePe / Google Pay / Credit Card / Cash
- Status: Paid ✅ or Pending ⏳
- Transaction ID (if online payment)
```

**Step 4: Collect Cash (if applicable)**
```
If Cash Payment:
1. Collect ₹200 from patient
2. Click "✓ Mark Payment Collected"
3. Status changes to "Paid ✅"
```

---

## 🎨 UI Components

### Payment Modal
- **Location**: `client/components/patient/payment-modal.tsx`
- **Features**:
  - 4 payment method cards
  - Animated processing
  - Success confirmation
  - Transaction ID display

### Payment Info Card
- **Location**: `client/components/nurse/payment-info-card.tsx`
- **Features**:
  - Payment method with icon
  - Status badge (Paid/Pending)
  - Amount display
  - Collection button for cash
  - Color-coded indicators

---

## 💾 Data Flow

### Patient Creates Visit
```
Patient Form
    ↓
Payment Modal Opens
    ↓
Select Payment Method
    ↓
Processing (2 seconds)
    ↓
Success Message
    ↓
Backend: Create Visit with Payment Data
    ↓
Visit Document Saved:
{
  paymentMethod: "phonepay" | "gpay" | "creditcard" | "cash",
  paymentStatus: "completed" | "pending",
  transactionId: "TXN1729...",
  amount: 200
}
```

### Nurse Views Payment
```
Nurse App
    ↓
Scan Patient QR
    ↓
Fetch Patient Data
    ↓
Load Current Visit
    ↓
Display Payment Info Card
    ↓
If Cash:
  - Show "Mark Collected" Button
  - Nurse collects money
  - Click button
  - Status → Completed
```

---

## 🔧 Configuration

### Default Amount
```javascript
// In visit-form.tsx
const CONSULTATION_FEE = 200; // ₹200
```

### Payment Methods
```javascript
const paymentMethods = [
  { id: "phonepay", name: "PhonePe" },
  { id: "gpay", name: "Google Pay" },
  { id: "creditcard", name: "Credit Card" },
  { id: "cash", name: "Cash" }
]
```

### Processing Time
```javascript
// Simulated processing time
setTimeout(() => {
  // Complete payment after 2 seconds
}, 2000)
```

---

## 📊 Payment Status

### Online Payments (PhonePe, Google Pay, Credit Card)
```
Status: COMPLETED ✅
- Immediately marked as paid
- Nurse sees: "Payment Completed"
- No action needed from nurse
```

### Cash Payment
```
Status: PENDING ⏳
- Marked as pending initially
- Nurse collects ₹200
- Nurse clicks "Mark Collected"
- Status changes to: COMPLETED ✅
```

---

## 🎯 Test Scenarios

### Scenario 1: Online Payment
```
1. Patient selects PhonePe
2. Payment processes (2 sec)
3. Success message shows
4. Visit scheduled
5. Nurse sees "Payment Completed"
6. No action needed
```

### Scenario 2: Cash Payment
```
1. Patient selects Cash
2. Payment processes (2 sec)
3. Success message shows
4. Visit scheduled
5. Nurse sees "Awaiting Cash Payment"
6. Nurse collects ₹200
7. Nurse clicks "Mark Collected"
8. Status → "Payment Completed"
```

### Scenario 3: Multiple Patients
```
1. Patient 1 pays via PhonePe → Completed
2. Patient 2 pays via Cash → Pending
3. Patient 3 pays via Google Pay → Completed
4. Nurse sees all 3 with different statuses
5. Nurse collects from Patient 2
6. All marked as completed
```

---

## 🐛 Troubleshooting

### Payment Modal Not Opening
```
✓ Check: Visit form validation passes
✓ Check: Browser console for errors
✓ Check: PaymentModal component imported
```

### Payment Info Not Showing in Nurse App
```
✓ Check: Patient has active visit
✓ Check: Visit has payment data
✓ Check: PaymentInfoCard component imported
✓ Check: Patient interface includes currentVisit
```

### Transaction ID Not Generating
```
✓ Check: Payment processing completes
✓ Check: Transaction ID format: TXN{timestamp}
✓ Check: Backend receives transactionId
```

---

## 📱 Responsive Design

- ✅ Mobile: Full width payment modal
- ✅ Tablet: Optimized layout
- ✅ Desktop: Centered modal with max-width
- ✅ All payment method cards responsive
- ✅ Payment info card adapts to screen size

---

## 🎨 Color Scheme

| Payment Method | Color | Icon |
|---|---|---|
| PhonePe | Purple (#A855F7) | 💜 |
| Google Pay | Blue (#3B82F6) | 💙 |
| Credit Card | Orange (#F97316) | 🟠 |
| Cash | Green (#22C55E) | 💚 |
| Paid | Green (#16A34A) | ✅ |
| Pending | Yellow (#EAB308) | ⏳ |

---

## ✨ Features Summary

✅ 4 Payment Methods
✅ Animated UI
✅ Transaction ID Generation
✅ Status Tracking
✅ Cash Collection Workflow
✅ Nurse Payment Display
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Success Confirmation

**Ready to use!** 🚀

