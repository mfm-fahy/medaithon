# Hospital Management System - Data Models

## 📊 Database Schema

All data is stored in MongoDB with the following collections and schemas:

---

## 1. User Collection

Base user model for all system users.

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  email: String (unique, required),
  name: String (required),
  role: String (enum: ['patient', 'doctor', 'nurse', 'admin', 'pharmacist', 'labTechnician']),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: username, email, role

---

## 2. Patient Collection

Patient-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  patientId: String (unique, required),
  age: Number (required),
  sex: String (enum: ['male', 'female', 'other'], required),
  phone: String (required),
  occupation: String (required),
  address: String (required),
  medicalHistory: String,
  allergies: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, patientId

---

## 3. Doctor Collection

Doctor-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  designation: String (required),
  specialization: String,
  licenseNumber: String (unique),
  department: String,
  yearsOfExperience: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, licenseNumber

---

## 4. Nurse Collection

Nurse-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  department: String,
  licenseNumber: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, licenseNumber

---

## 5. Pharmacist Collection

Pharmacist-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  license: String,
  licenseNumber: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, licenseNumber

---

## 6. LabTechnician Collection

Lab technician-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  department: String,
  licenseNumber: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, licenseNumber

---

## 7. Admin Collection

Admin-specific information linked to User.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId

---

## 8. Prescription Collection

Medicine prescriptions created by doctors for patients.

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  medicine: String (required),
  route: String (required),
  dose: String (required),
  frequency: String (required),
  duration: String (required),
  advice: String,
  status: String (enum: ['active', 'completed', 'cancelled'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: patientId, doctorId, status

---

## 9. Vitals Collection

Patient vital signs recorded by nurses.

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  nurseId: ObjectId (ref: Nurse, required),
  height: Number (required),
  weight: Number (required),
  temperature: Number (required),
  bloodPressure: String (required),
  heartRate: Number (required),
  respiratoryRate: Number (required),
  pulse: Number (required),
  recordedAt: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: patientId, nurseId, recordedAt

---

## 10. Medicine Collection

Medicine inventory managed by pharmacists.

```javascript
{
  _id: ObjectId,
  chemicalName: String (required),
  brandName: String (required),
  quantity: Number (required, default: 0),
  price: Number,
  expiryDate: Date,
  manufacturer: String,
  batchNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: chemicalName, brandName, batchNumber

---

## 11. LabTest Collection

Lab tests created by doctors and managed by lab technicians.

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  labTechnicianId: ObjectId (ref: LabTechnician),
  testName: String (required),
  sampleType: String (required),
  status: String (enum: ['pending', 'in-progress', 'completed'], default: 'pending'),
  estimatedTime: String,
  result: String,
  resultDate: Date,
  uploadedFile: {
    name: String,
    type: String,
    size: Number,
    uploadedAt: Date,
    data: String (base64)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: patientId, labTechnicianId, status

---

## 📊 Relationships

```
User (1) ──→ (1) Patient
         ──→ (1) Doctor
         ──→ (1) Nurse
         ──→ (1) Pharmacist
         ──→ (1) LabTechnician
         ──→ (1) Admin

Patient (1) ──→ (Many) Prescription
        ──→ (Many) Vitals
        ──→ (Many) LabTest

Doctor (1) ──→ (Many) Prescription

Nurse (1) ──→ (Many) Vitals

LabTechnician (1) ──→ (Many) LabTest
```

---

## 🔍 Query Examples

### Get Patient with All Related Data
```javascript
const patient = await Patient.findById(patientId)
  .populate('userId')
  .exec();

const vitals = await Vitals.find({ patientId });
const prescriptions = await Prescription.find({ patientId })
  .populate('doctorId');
const labTests = await LabTest.find({ patientId });
```

### Get Doctor's Prescriptions
```javascript
const prescriptions = await Prescription.find({ doctorId })
  .populate('patientId')
  .populate('doctorId');
```

### Get Recent Vitals
```javascript
const recentVitals = await Vitals.find({ patientId })
  .sort({ recordedAt: -1 })
  .limit(10);
```

### Get Active Prescriptions
```javascript
const activePrescriptions = await Prescription.find({
  patientId,
  status: 'active'
});
```

---

## 📈 Data Validation

### Patient
- Age: 0-150
- Sex: male, female, other
- Phone: Valid phone format
- Address: Non-empty string

### Prescription
- Dose: Non-empty string
- Frequency: Non-empty string
- Duration: Non-empty string
- Status: active, completed, cancelled

### Vitals
- Height: 50-300 cm
- Weight: 10-500 kg
- Temperature: 35-42°C
- Heart Rate: 30-200 bpm
- Respiratory Rate: 5-50 breaths/min

### Medicine
- Quantity: >= 0
- Price: >= 0
- Expiry Date: Future date

---

## 🔐 Data Security

1. **Passwords**: Hashed with bcryptjs (salt rounds: 10)
2. **Sensitive Data**: Not exposed in API responses
3. **Access Control**: Role-based access to data
4. **Timestamps**: All records have createdAt and updatedAt
5. **Soft Deletes**: Consider implementing for audit trail

---

## 📝 Notes

- All ObjectIds are automatically generated by MongoDB
- All timestamps are in ISO 8601 format
- Passwords are never returned in API responses
- User IDs are used for authentication, not usernames
- All collections have automatic indexing on common query fields

