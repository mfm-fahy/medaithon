"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QRScanner from "@/components/qr-scanner"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface Patient {
  _id: string
  patientId: string
  userId: { name: string; email: string }
  age: number
  sex: string
  phone: string
  medicalHistory?: string
  allergies?: string[]
}

export default function DoctorPatients() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/doctor/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "doctor") {
      fetchPatients()
    }
  }, [isAuthenticated, user])

  const fetchPatients = async () => {
    setLoadingPatients(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch patients")
      const data = await response.json()
      setPatients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching patients")
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleQRScan = async (patientId: string) => {
    setError("")
    setSuccess("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Patient not found")
      const data = await response.json()
      setSelectedPatient(data.patient)
      setShowScanner(false)
      setSuccess(`Patient found: ${data.patient.userId.name}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error scanning patient")
    }
  }

  const handleUpdatePatient = async (updates: any) => {
    if (!selectedPatient) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/patients/qr/${selectedPatient.patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update patient")
      const data = await response.json()
      setSelectedPatient(data.patient)
      setSuccess("Patient updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating patient")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "doctor") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
          <p className="text-gray-600">Scan QR code or select patient to view and update details</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Scanner and Patient List */}
          <div className="lg:col-span-1 space-y-4">
            {showScanner ? (
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
                title="Scan Patient QR Code"
                description="Point camera at patient's QR code"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Find Patient</CardTitle>
                  <CardDescription>Scan QR code or select from list</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                  >
                    Scan QR Code
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Patient List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPatients ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {patients.map((patient) => (
                      <button
                        key={patient._id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedPatient?._id === patient._id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{patient.userId.name}</div>
                        <div className="text-xs text-gray-600">{patient.patientId}</div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Details and Update Form */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <PatientDetailsCard patient={selectedPatient} onUpdate={handleUpdatePatient} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Select a patient to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PatientDetailsCard({ patient, onUpdate }: { patient: Patient; onUpdate: (updates: any) => void }) {
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || "")
  const [allergies, setAllergies] = useState(patient.allergies?.join(", ") || "")
  const [updating, setUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      await onUpdate({
        medicalHistory,
        allergies: allergies.split(",").map((a) => a.trim()),
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <CardDescription>View and update patient information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{patient.userId.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Patient ID</p>
            <p className="font-medium">{patient.patientId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-medium">{patient.age}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sex</p>
            <p className="font-medium capitalize">{patient.sex}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{patient.userId.email}</p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Medical History</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              placeholder="Enter medical history..."
              disabled={updating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Allergies (comma-separated)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Penicillin, Peanuts"
              disabled={updating}
            />
          </div>

          <Button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {updating ? "Updating..." : "Update Patient"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

