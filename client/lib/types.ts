export type UserRole = "patient" | "doctor" | "nurse" | "admin" | "pharmacist" | "labTechnician"

export interface User {
  id: string
  role: UserRole
  username: string
  password: string
  name: string
  createdAt: string
}

export interface Patient extends User {
  role: "patient"
  age: number
  sex: "male" | "female" | "other"
  phone: string
  occupation: string
  address: string
  patientId: string
}

export interface Doctor extends User {
  role: "doctor"
  designation: string
  specialization?: string
}

export interface Nurse extends User {
  role: "nurse"
  department?: string
}

export interface Admin extends User {
  role: "admin"
}

export interface Pharmacist extends User {
  role: "pharmacist"
  license?: string
}

export interface LabTechnician extends User {
  role: "labTechnician"
  department?: string
}

export interface Medicine {
  id: string
  chemicalName: string
  brandName: string
  quantity: number
  addedAt: string
}

export interface Vitals {
  id: string
  patientId: string
  height: number
  weight: number
  temperature: number
  bloodPressure: string
  heartRate: number
  respiratoryRate: number
  pulse: number
  recordedAt: string
  recordedBy: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medicine: string
  route: string
  dose: string
  frequency: string
  duration: string
  advice: string
  createdAt: string
}

export interface LabReport {
  id: string
  patientId: string
  testName: string
  result: string
  date: string
  status: "pending" | "completed"
}

export interface Appointment {
  id: string
  patientId: string
  doctorId?: string
  type: "doctor" | "lab" | "injection"
  status: "pending" | "completed" | "cancelled"
  createdAt: string
  scheduledAt?: string
}

export interface LabTest {
  id: string
  patientId: string
  testName: string
  sampleType: string
  status: "pending" | "in-progress" | "completed"
  estimatedTime?: string
  result?: string
  uploadedFile?: {
    name: string
    type: string
    size: number
    uploadedAt: string
    data: string // base64 encoded file data
  }
  resultDate?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
