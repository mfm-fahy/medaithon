# ⚡ Queue to Billing - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Clear Cache (30 seconds)
```
1. Press F12 (DevTools)
2. Right-click refresh button
3. Select "Empty cache and hard refresh"
```

### Step 2: Restart Frontend (30 seconds)
```bash
# Stop current frontend (Ctrl+C)
cd client
npm run dev
```

### Step 3: Test Complete Workflow (4 minutes)

#### Part 1: Access Queue (1 minute)
```
1. Go to http://localhost:3000
2. Login as pharmacist
3. Navigate to queue page
4. Select a patient with prescriptions
5. View prescriptions
```

#### Part 2: Manage Medicines (1 minute)
```
1. Click "Manage Medicines" button
2. Automatically redirected to billing page
3. Form pre-filled with:
   - Patient name ✅
   - Patient phone ✅
   - Prescribed medicines ✅
```

#### Part 3: Create Bill (1 minute)
```
1. Edit medicine quantities (optional)
2. Enter unit prices for each medicine
3. Apply discount/tax (optional)
4. Select payment method
5. Click "Create Bill"
6. Bill created successfully ✅
7. Patient removed from queue ✅
```

#### Part 4: Print Bill (1 minute)
```
1. Click "Print" button on bill
2. Print dialog opens
3. Print or save as PDF
4. Professional bill format ✅
```

---

## 📋 Test Users

### Pharmacist
- **Username**: pharmacist
- **Password**: password123

### Doctor (for creating prescriptions)
- **Username**: doctor
- **Password**: password123

---

## ✅ Verification Checklist

- [ ] Queue page loads patients
- [ ] Can select patient
- [ ] Prescriptions display
- [ ] "Manage Medicines" button visible
- [ ] Click navigates to billing
- [ ] Billing form pre-filled
- [ ] Medicines appear in bill
- [ ] Can edit quantities
- [ ] Can edit prices
- [ ] Totals calculate
- [ ] Can apply discount
- [ ] Can apply tax
- [ ] Bill creates successfully
- [ ] Patient removed from queue
- [ ] Can print bill
- [ ] Print format looks good

---

## 🎯 Key Features

### Queue Page
- View all patients
- Select patient
- View prescriptions
- Click "Manage Medicines"

### Billing Page
- Pre-filled patient data
- Pre-filled medicines
- Edit quantities
- Edit prices
- Remove medicines
- Apply discount/tax
- Create bill
- Print bill

### Bill Printing
- Professional format
- All details included
- Print-friendly layout
- Save as PDF option

---

## 🔗 Navigation

### From Queue to Billing
```
Queue Page
    ↓
[Click "Manage Medicines"]
    ↓
Billing Page (Pre-filled)
```

### From Billing Back to Queue
```
Billing Page
    ↓
[Click "Back to Queue"]
    ↓
Queue Page
```

---

## 💡 Tips

1. **Pre-filled Data**: All patient and medicine data auto-fills
2. **Edit Prices**: Enter unit prices for each medicine
3. **Quantities**: Edit quantities as needed
4. **Remove**: Click trash icon to remove medicine
5. **Discount**: Apply percentage-based discount
6. **Tax**: Apply percentage-based tax
7. **Print**: Click print button for professional bill
8. **Queue**: Patient auto-removed after billing

---

## 🐛 Troubleshooting

### Billing page not pre-filled
- Clear cache and refresh
- Check browser console for errors
- Verify patient has prescriptions

### Can't print bill
- Try different browser
- Check if pop-ups are blocked
- Try "Save as PDF" option

### Patient not removed from queue
- Check backend logs
- Verify API endpoint exists
- Check authentication token

---

## 📞 Support

See `QUEUE_TO_BILLING_INTEGRATION.md` for detailed documentation.

---

## 🎉 Ready to Go!

Your queue to billing integration is ready! 🚀

**Start managing medicines now!** 💊

