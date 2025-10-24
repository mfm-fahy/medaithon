# 💉 Nurse Injections API Reference

## Base URL
```
http://localhost:5000/api/injections
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Injections
**GET** `/api/injections`

**Authorization**: admin, doctor, nurse

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "patientId": {
      "_id": "507f1f77bcf86cd799439012",
      "patientId": "PAT001",
      "userId": {
        "name": "John Doe"
      }
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {
        "name": "Dr. Rajesh Kumar"
      }
    },
    "injectionName": "Penicillin 500mg",
    "injectionType": "IV",
    "dose": "500mg",
    "frequency": "Twice daily",
    "duration": "7 days",
    "route": "Intravenous",
    "status": "pending",
    "notes": "Administer after meals",
    "createdAt": "2024-10-24T10:30:00Z",
    "updatedAt": "2024-10-24T10:30:00Z"
  }
]
```

---

### 2. Get Patient Injections
**GET** `/api/injections/patient/:patientId`

**Authorization**: all authenticated users

**Parameters**:
- `patientId` (string, required) - MongoDB ObjectId of patient

**Response**: Array of injections for the patient

---

### 3. Get Single Injection
**GET** `/api/injections/:id`

**Authorization**: all authenticated users

**Parameters**:
- `id` (string, required) - MongoDB ObjectId of injection

**Response**: Single injection object

---

### 4. Create Injection
**POST** `/api/injections`

**Authorization**: doctor, admin

**Request Body**:
```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439013",
  "injectionName": "Penicillin 500mg",
  "injectionType": "IV",
  "dose": "500mg",
  "frequency": "Twice daily",
  "duration": "7 days",
  "route": "Intravenous",
  "notes": "Administer after meals"
}
```

**Required Fields**:
- patientId
- doctorId
- injectionName
- injectionType
- dose
- frequency

**Optional Fields**:
- duration
- route
- notes

**Response**:
```json
{
  "message": "Injection created successfully",
  "injection": { ... }
}
```

---

### 5. Update Injection Status (Nurse Action)
**PUT** `/api/injections/:id/status`

**Authorization**: nurse, admin

**Parameters**:
- `id` (string, required) - MongoDB ObjectId of injection

**Request Body**:
```json
{
  "status": "completed",
  "notes": "Injection administered successfully"
}
```

**Valid Status Values**:
- `pending` - Waiting to be administered
- `in-progress` - Currently being administered
- `completed` - Injection completed
- `cancelled` - Injection cancelled

**Response**:
```json
{
  "message": "Injection status updated successfully",
  "injection": { ... }
}
```

---

### 6. Update Injection (Full Update)
**PUT** `/api/injections/:id`

**Authorization**: doctor, nurse, admin

**Parameters**:
- `id` (string, required) - MongoDB ObjectId of injection

**Request Body**: Any injection fields to update
```json
{
  "dose": "1000mg",
  "frequency": "Three times daily",
  "notes": "Updated notes"
}
```

**Response**:
```json
{
  "message": "Injection updated successfully",
  "injection": { ... }
}
```

---

### 7. Delete Injection
**DELETE** `/api/injections/:id`

**Authorization**: doctor, admin

**Parameters**:
- `id` (string, required) - MongoDB ObjectId of injection

**Response**:
```json
{
  "message": "Injection deleted successfully",
  "injection": { ... }
}
```

---

## Status Transitions

### Valid Status Transitions:
```
pending → in-progress → completed
pending → cancelled
in-progress → completed
in-progress → cancelled
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Injection not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error updating injection status",
  "error": { ... }
}
```

---

## cURL Examples

### Get All Injections
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/injections
```

### Get Patient Injections
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/injections/patient/507f1f77bcf86cd799439012
```

### Update Injection Status
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Injection administered successfully"
  }' \
  http://localhost:5000/api/injections/507f1f77bcf86cd799439011/status
```

### Create Injection
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439012",
    "doctorId": "507f1f77bcf86cd799439013",
    "injectionName": "Penicillin 500mg",
    "injectionType": "IV",
    "dose": "500mg",
    "frequency": "Twice daily"
  }' \
  http://localhost:5000/api/injections
```

---

## Response Headers

All responses include:
```
Content-Type: application/json
```

---

## Rate Limiting

No rate limiting currently implemented. Consider adding for production.

---

## Pagination

No pagination currently implemented. Consider adding for large datasets.

---

## Sorting

Results are sorted by `createdAt` in descending order (newest first).

---

## Filtering

Frontend filters by:
- Patient name
- Patient ID
- Injection name
- Status

Backend supports filtering via query parameters (can be extended).

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- MongoDB ObjectIds are 24-character hex strings
- Status updates trigger real-time updates in the UI
- Notes are optional but recommended for tracking


