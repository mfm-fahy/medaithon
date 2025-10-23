import type {
  Patient,
  Doctor,
  Nurse,
  Admin,
  Vitals,
  Prescription,
  LabReport,
  Pharmacist,
  Medicine,
  LabTechnician,
  LabTest,
} from "./types"

export const mockPatients: Patient[] = [
  {
    id: "pat_001",
    role: "patient",
    username: "john_doe",
    password: "password123",
    name: "John Doe",
    age: 35,
    sex: "male",
    phone: "+1234567890",
    occupation: "Engineer",
    address: "123 Main St, City",
    patientId: "P001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pat_002",
    role: "patient",
    username: "jane_smith",
    password: "password123",
    name: "Jane Smith",
    age: 28,
    sex: "female",
    phone: "+1234567891",
    occupation: "Teacher",
    address: "456 Oak Ave, City",
    patientId: "P002",
    createdAt: new Date().toISOString(),
  },
]

export const mockDoctors: Doctor[] = [
  {
    id: "doc_001",
    role: "doctor",
    username: "dr_smith",
    password: "password123",
    name: "Dr. Smith",
    designation: "General Practitioner",
    specialization: "Internal Medicine",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc_002",
    role: "doctor",
    username: "dr_johnson",
    password: "password123",
    name: "Dr. Johnson",
    designation: "Cardiologist",
    specialization: "Cardiology",
    createdAt: new Date().toISOString(),
  },
]

export const mockNurses: Nurse[] = [
  {
    id: "nurse_001",
    role: "nurse",
    username: "nurse_alice",
    password: "password123",
    name: "Alice Brown",
    department: "General Ward",
    createdAt: new Date().toISOString(),
  },
]

export const mockAdmins: Admin[] = [
  {
    id: "admin_001",
    role: "admin",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    createdAt: new Date().toISOString(),
  },
]

export const mockPharmacists: Pharmacist[] = [
  {
    id: "pharm_001",
    role: "pharmacist",
    username: "pharmacist_john",
    password: "password123",
    name: "John Pharmacy",
    license: "PH123456",
    createdAt: new Date().toISOString(),
  },
]

export const mockMedicines: Medicine[] = [
  {
    id: "med_001",
    chemicalName: "Paracetamol",
    brandName: "Crocin",
    quantity: 150,
    addedAt: new Date().toISOString(),
  },
  {
    id: "med_002",
    chemicalName: "Ibuprofen",
    brandName: "Brufen",
    quantity: 85,
    addedAt: new Date().toISOString(),
  },
  {
    id: "med_003",
    chemicalName: "Amoxicillin",
    brandName: "Amoxil",
    quantity: 45,
    addedAt: new Date().toISOString(),
  },
  {
    id: "med_004",
    chemicalName: "Aspirin",
    brandName: "Disprin",
    quantity: 200,
    addedAt: new Date().toISOString(),
  },
]

export const mockVitals: Vitals[] = [
  {
    id: "vital_001",
    patientId: "pat_001",
    height: 180,
    weight: 75,
    temperature: 98.6,
    bloodPressure: "120/80",
    heartRate: 72,
    respiratoryRate: 16,
    pulse: 72,
    recordedAt: new Date().toISOString(),
    recordedBy: "nurse_001",
  },
]

export const mockPrescriptions: Prescription[] = [
  {
    id: "presc_001",
    patientId: "pat_001",
    doctorId: "doc_001",
    medicine: "Aspirin",
    route: "Oral",
    dose: "500mg",
    frequency: "Twice daily",
    duration: "7 days",
    advice: "Take with food",
    createdAt: new Date().toISOString(),
  },
]

export const mockLabReports: LabReport[] = [
  {
    id: "lab_001",
    patientId: "pat_001",
    testName: "Blood Test",
    result: "Normal",
    date: new Date().toISOString(),
    status: "completed",
  },
]

export const mockMedicinePurchases: Array<{
  id: string
  prescriptionId: string
  patientId: string
  quantity: number
  quantityDispensed: number
  purchased: boolean
  purchasedAt?: string
}> = [
  {
    id: "med_purchase_001",
    prescriptionId: "presc_001",
    patientId: "pat_001",
    quantity: 10,
    quantityDispensed: 0,
    purchased: false,
  },
  {
    id: "med_purchase_002",
    prescriptionId: "presc_001",
    patientId: "pat_001",
    quantity: 5,
    quantityDispensed: 0,
    purchased: false,
  },
]

export const mockDiseaseConsultations = [
  {
    id: "cons_001",
    patientId: "pat_001",
    doctorId: "doc_001",
    disease: "Fever",
    visitDate: new Date().toISOString(),
  },
  {
    id: "cons_002",
    patientId: "pat_002",
    doctorId: "doc_002",
    disease: "Hypertension",
    visitDate: new Date().toISOString(),
  },
  {
    id: "cons_003",
    patientId: "pat_001",
    doctorId: "doc_001",
    disease: "Fever",
    visitDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "cons_004",
    patientId: "pat_002",
    doctorId: "doc_001",
    disease: "Cough",
    visitDate: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "cons_005",
    patientId: "pat_001",
    doctorId: "doc_002",
    disease: "Hypertension",
    visitDate: new Date(Date.now() - 259200000).toISOString(),
  },
]

export const mockLabTechnicians: LabTechnician[] = [
  {
    id: "lab_tech_001",
    role: "labTechnician",
    username: "lab_tech_john",
    password: "password123",
    name: "John Lab Tech",
    department: "Laboratory",
    createdAt: new Date().toISOString(),
  },
]

export const mockLabTests: LabTest[] = [
  {
    id: "test_001",
    patientId: "pat_001",
    testName: "Complete Blood Count",
    sampleType: "Blood",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test_002",
    patientId: "pat_001",
    testName: "Urinalysis",
    sampleType: "Urine",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test_003",
    patientId: "pat_002",
    testName: "Blood Sugar Test",
    sampleType: "Blood",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
]
