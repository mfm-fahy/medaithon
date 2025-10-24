# 🏥 Insurance Billing Feature - Implementation Guide

## ✅ Feature Overview

A complete **Insurance Billing System** has been implemented in the pharmacist app. Pharmacists can now:
- Check if patient has insurance
- Select insurance type (Private or Government)
- Upload insurance card
- Automatically apply 25% discount to the bill

---

## 🎯 What Was Implemented

### Frontend (Pharmacist App) ✅
1. **Insurance Checkbox** - "Patient has Insurance" option
2. **Insurance Type Selection** - Private or Government dropdown
3. **Insurance Card Upload** - File upload for insurance card (JPEG, PNG, PDF)
4. **Discount Display** - Shows 25% insurance discount in bill summary
5. **Real-time Calculation** - Updates bill total with insurance discount

### Backend (Server) ✅
1. **Billing Model Updates** - Added insurance fields
2. **Insurance Service** - File handling and validation
3. **API Endpoints** - Upload and update insurance information
4. **Automatic Discount** - 25% discount applied on save

---

## 📋 Insurance Fields Added to Billing Model

```javascript
{
  hasInsurance: Boolean,           // Is patient insured?
  insuranceType: String,           // 'private' or 'government'
  insuranceCardPath: String,       // Path to uploaded card
  insuranceCardFileName: String,   // Uploaded file name
  insuranceDiscount: Number,       // 25% discount amount
}
```

---

## 🚀 How to Use

### For Pharmacists

#### Step 1: Create New Bill
1. Login to pharmacist app
2. Click "New Bill"
3. Enter patient details
4. Add medicines

#### Step 2: Enable Insurance
1. Check "🏥 Patient has Insurance" checkbox
2. Select insurance type:
   - **Private Insurance** - Private health insurance
   - **Government Insurance** - Government health scheme

#### Step 3: Upload Insurance Card
1. Click "📄 Upload Insurance Card"
2. Select file (JPEG, PNG, or PDF)
3. Max file size: 5MB

#### Step 4: Review Discount
1. See "✅ 25% discount will be applied" message
2. Bill summary shows:
   - Subtotal
   - Discount (includes 25% insurance)
   - Tax
   - **Final Total** (reduced by 25%)

#### Step 5: Create Bill
1. Click "Create Bill"
2. Insurance card uploads automatically
3. 25% discount applied to final amount
4. Success message shows new total

---

## 💰 Discount Calculation

### Without Insurance
```
Subtotal: ₹1000
Manual Discount: 10% = ₹100
Taxable Amount: ₹900
Tax (5%): ₹45
Total: ₹945
```

### With Insurance (25% discount)
```
Subtotal: ₹1000
Manual Discount: 10% = ₹100
Insurance Discount: 25% = ₹250
Total Discount: 35% = ₹350
Taxable Amount: ₹650
Tax (5%): ₹32.50
Total: ₹682.50
```

---

## 🔌 API Endpoints

### Upload Insurance Card
```
POST /api/billing/:billId/upload-insurance
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- insuranceCard: File (JPEG, PNG, PDF)
- insuranceType: 'private' | 'government'

Response:
{
  success: true,
  message: "Insurance card uploaded successfully",
  bill: { ... },
  insuranceDiscount: 25,
  newTotal: 682.50
}
```

### Update Insurance Information
```
PUT /api/billing/:billId/insurance
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  hasInsurance: true,
  insuranceType: 'private'
}

Response:
{
  success: true,
  message: "Insurance information updated",
  bill: { ... },
  insuranceDiscount: 25,
  newTotal: 682.50
}
```

---

## 📁 Files Created/Modified

### Created
- `server/src/services/insuranceService.js` - Insurance file handling
- `INSURANCE_BILLING_FEATURE.md` - This documentation

### Modified
- `server/src/models/Billing.js` - Added insurance fields
- `server/src/routes/billing.js` - Added insurance endpoints
- `client/app/pharmacist/billing/page.tsx` - Added insurance UI

---

## ✨ Features

✅ **Insurance Checkbox** - Easy toggle for insurance
✅ **Type Selection** - Private or Government options
✅ **File Upload** - Secure insurance card upload
✅ **Validation** - File type and size validation
✅ **Auto Discount** - 25% discount applied automatically
✅ **Real-time Calculation** - Bill updates instantly
✅ **Discount Breakdown** - Shows insurance discount separately
✅ **File Storage** - Organized by bill ID
✅ **Error Handling** - Clear error messages
✅ **Success Feedback** - Confirmation with new total

---

## 🧪 Testing

### Test 1: Create Bill with Insurance
1. Create new bill
2. Check "Patient has Insurance"
3. Select "Private Insurance"
4. Upload insurance card (JPEG/PNG/PDF)
5. Verify 25% discount in summary
6. Click "Create Bill"
7. ✅ Bill created with discount applied

### Test 2: Discount Calculation
1. Create bill with:
   - Subtotal: ₹1000
   - Manual Discount: 10%
   - Insurance: Yes
2. Verify:
   - Total Discount: 35% (10% + 25%)
   - Discount Amount: ₹350
   - Final Total: ₹650 (before tax)

### Test 3: File Upload Validation
1. Try uploading file > 5MB
2. ✅ Error: "File size exceeds 5MB limit"
3. Try uploading .txt file
4. ✅ Error: "Invalid file type"
5. Upload valid PDF
6. ✅ File accepted

### Test 4: Insurance Types
1. Select "Private Insurance"
2. ✅ Discount applied
3. Change to "Government Insurance"
4. ✅ Discount still applied (25%)

---

## 📊 Database Schema

```javascript
{
  billNumber: String,
  patientId: ObjectId,
  patientName: String,
  items: Array,
  subtotal: Number,
  discount: Number,
  discountPercentage: Number,
  tax: Number,
  taxPercentage: Number,
  totalAmount: Number,
  
  // Insurance fields
  hasInsurance: Boolean,
  insuranceType: String,
  insuranceCardPath: String,
  insuranceCardFileName: String,
  insuranceDiscount: Number,
  
  paymentMethod: String,
  paymentStatus: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

✅ **File Validation** - Only JPEG, PNG, PDF allowed
✅ **Size Limit** - Max 5MB per file
✅ **Authentication** - Requires valid token
✅ **Authorization** - Pharmacist role required
✅ **Organized Storage** - Files stored by bill ID
✅ **Error Handling** - No sensitive data in errors

---

## 📞 Troubleshooting

### Issue: Insurance discount not applied
- Check if "Patient has Insurance" is checked
- Verify insurance type is selected
- Ensure insurance card is uploaded
- Check browser console for errors

### Issue: File upload fails
- Verify file size < 5MB
- Check file format (JPEG, PNG, PDF only)
- Ensure backend is running
- Check network connection

### Issue: Bill total not updating
- Refresh page
- Clear browser cache
- Check if insurance is properly selected
- Verify backend calculation

---

## 🎉 Implementation Complete!

The insurance billing feature is now fully implemented and ready for use. Pharmacists can easily manage patient insurance and apply automatic discounts.

**Status: READY FOR TESTING** ✅

---

## 📈 Next Steps

1. ✅ Implementation complete
2. ⏳ Test all features
3. ⏳ Verify discount calculations
4. ⏳ Test file uploads
5. ⏳ Deploy to production

**Ready to test the insurance billing system!** 🚀

