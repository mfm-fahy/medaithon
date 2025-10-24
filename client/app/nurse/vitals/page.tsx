"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NurseHeader from "@/components/nurse/nurse-header"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface Patient {
  _id: string
  patientId: string
  userId?: { name: string; email: string }
  age: number
  sex: string
  phone: string
  medicalHistory?: string
  prescribedMedicines?: Array<{
    medicine: string
    route: string
    dose: string
    frequency: string
    prescribedAt: string
  }>
  injectionDetails?: {
    required: boolean
    details: string
    roomNumber: string
    floor: string
    status: string
    updatedAt: string
  }
  labTestDetails?: {
    required: boolean
    details: string
    roomNumber: string
    floor: string
    status: string
    updatedAt: string
  }
}

interface Vital {
  _id: string
  height: number
  weight: number
  temperature: number
  bloodPressure: string
  heartRate: number
  respiratoryRate: number
  pulse: number
  recordedAt: string
}

interface Prescription {
  _id: string
  medicine: string
  route: string
  dose: string
  frequency: string
  duration: string
  advice?: string
  status: string
}

export default function NurseVitalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading } = useAuth()
  const patientId = searchParams.get("patientId")

  const [patient, setPatient] = useState<Patient | null>(null)
  const [vitals, setVitals] = useState<Vital[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    pulse: "",
  })
  const [predictedTriageColor, setPredictedTriageColor] = useState<string | null>(null)
  const [selectedTriageColor, setSelectedTriageColor] = useState<string | null>(null)
  const [predictingTriage, setPredictingTriage] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "nurse" && patientId) {
      fetchPatientData()
    }
  }, [isAuthenticated, user, patientId])

  const fetchPatientData = async () => {
    setLoadingData(true)
    setError("")
    try {
      const token = localStorage.getItem("auth_token")
      console.log("🔵 Fetching patient data for:", patientId)

      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch patient data")

      const data = await response.json()
      console.log("✅ Patient data received:", data)
      setPatient(data.patient)
      setVitals(data.vitals || [])
      setPrescriptions(data.prescriptions || [])
    } catch (err) {
      console.error("❌ Error fetching patient data:", err)
      setError(err instanceof Error ? err.message : "Error fetching patient data")
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const predictTriageColor = async () => {
    if (!formData.height || !formData.weight || !formData.temperature || !formData.bloodPressure ||
        !formData.heartRate || !formData.respiratoryRate || !formData.pulse) {
      setError("Please fill in all vital fields before predicting triage color")
      return
    }

    setPredictingTriage(true)
    setError("")
    try {
      const token = localStorage.getItem("auth_token")
      console.log("🔵 Predicting triage color...")

      const response = await fetch("http://localhost:5000/api/vitals/predict-triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          temperature: parseFloat(formData.temperature),
          bloodPressure: formData.bloodPressure,
          heartRate: parseFloat(formData.heartRate),
          respiratoryRate: parseFloat(formData.respiratoryRate),
          pulse: parseFloat(formData.pulse),
        }),
      })

      if (!response.ok) throw new Error("Failed to predict triage color")

      const data = await response.json()
      console.log("✅ Triage color predicted:", data.triageColor)
      setPredictedTriageColor(data.triageColor)
      setSelectedTriageColor(data.triageColor)
    } catch (err) {
      console.error("❌ Error predicting triage color:", err)
      setError(err instanceof Error ? err.message : "Error predicting triage color")
    } finally {
      setPredictingTriage(false)
    }
  }

  const handleSubmitVitals = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("auth_token")
      console.log("🔵 Submitting vitals for patient:", patientId)

      const response = await fetch("http://localhost:5000/api/vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: patient?._id,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          temperature: parseFloat(formData.temperature),
          bloodPressure: formData.bloodPressure,
          heartRate: parseFloat(formData.heartRate),
          respiratoryRate: parseFloat(formData.respiratoryRate),
          pulse: parseFloat(formData.pulse),
          triageColor: selectedTriageColor,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit vitals")

      const data = await response.json()
      console.log("✅ Vitals submitted successfully:", data)
      setSuccess(`Vitals recorded successfully! Triage Color: ${selectedTriageColor?.toUpperCase()}`)
      setFormData({
        height: "",
        weight: "",
        temperature: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        pulse: "",
      })
      setPredictedTriageColor(null)
      setSelectedTriageColor(null)
      // Refresh vitals list
      fetchPatientData()
    } catch (err) {
      console.error("❌ Error submitting vitals:", err)
      setError(err instanceof Error ? err.message : "Error submitting vitals")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "nurse") {
    return null
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NurseHeader user={user} />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">No patient selected. Please scan a QR code first.</p>
              <Button onClick={() => router.push("/nurse/qr-scanner")} className="mt-4 w-full">
                Go to Scanner
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NurseHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
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

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : patient ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Patient Info & Vitals Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{patient.userId?.name || "N/A"}</p>
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
                  </div>
                </CardContent>
              </Card>

              {/* Assign Doctor Button */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-900">Assign Doctor Category</CardTitle>
                  <CardDescription>Select which doctor specialization the patient needs to visit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push(`/nurse/assign-doctor?patientId=${patientId}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Select Doctor & Assign Room
                  </Button>
                </CardContent>
              </Card>

              {/* Vitals Entry Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Record Vitals</CardTitle>
                  <CardDescription>Enter patient vital signs</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitVitals} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          placeholder="170"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="70"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
                        <input
                          type="number"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          placeholder="37"
                          step="0.1"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          name="bloodPressure"
                          value={formData.bloodPressure}
                          onChange={handleInputChange}
                          placeholder="120/80"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                        <input
                          type="number"
                          name="heartRate"
                          value={formData.heartRate}
                          onChange={handleInputChange}
                          placeholder="72"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Respiratory Rate</label>
                        <input
                          type="number"
                          name="respiratoryRate"
                          value={formData.respiratoryRate}
                          onChange={handleInputChange}
                          placeholder="16"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pulse (bpm)</label>
                        <input
                          type="number"
                          name="pulse"
                          value={formData.pulse}
                          onChange={handleInputChange}
                          placeholder="72"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Triage Color Prediction */}
                    <div className="border-t pt-4">
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          onClick={predictTriageColor}
                          disabled={predictingTriage}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                          {predictingTriage ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Predicting...
                            </>
                          ) : (
                            "🎯 Predict Triage Color"
                          )}
                        </Button>
                      </div>

                      {predictedTriageColor && (
                        <div className="mb-4 p-4 rounded-lg border-2 bg-gray-50">
                          <p className="text-sm font-medium text-gray-700 mb-3">Predicted Triage Color:</p>
                          <div className="flex gap-2 flex-wrap">
                            {["red", "yellow", "green", "blue"].map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedTriageColor(color)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                  selectedTriageColor === color
                                    ? "ring-2 ring-offset-2 ring-gray-400 scale-105"
                                    : "opacity-70 hover:opacity-100"
                                } ${
                                  color === "red"
                                    ? "bg-red-500 text-white"
                                    : color === "yellow"
                                    ? "bg-yellow-400 text-gray-900"
                                    : color === "green"
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-500 text-white"
                                }`}
                              >
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                                {predictedTriageColor === color && " ✓"}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Selected: <strong>{selectedTriageColor?.toUpperCase()}</strong>
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !selectedTriageColor}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? "Recording..." : "Record Vitals"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: History & Prescriptions */}
            <div className="space-y-6">
              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {patient.medicalHistory || "No medical history recorded"}
                  </p>
                </CardContent>
              </Card>

              {/* Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prescriptions</CardTitle>
                  <CardDescription>{prescriptions.length} active</CardDescription>
                </CardHeader>
                <CardContent>
                  {prescriptions.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {prescriptions.map((prescription) => (
                        <div key={prescription._id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-medium text-sm">{prescription.medicine}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>Dose:</strong> {prescription.dose}
                          </p>
                          <p className="text-xs text-gray-600">
                            <strong>Frequency:</strong> {prescription.frequency}
                          </p>
                          <p className="text-xs text-gray-600">
                            <strong>Duration:</strong> {prescription.duration}
                          </p>
                          <p className="text-xs text-gray-600">
                            <strong>Route:</strong> {prescription.route}
                          </p>
                          {prescription.advice && (
                            <p className="text-xs text-gray-600 mt-1">
                              <strong>Advice:</strong> {prescription.advice}
                            </p>
                          )}
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No prescriptions</p>
                  )}
                </CardContent>
              </Card>

              {/* Doctor Prescribed Medicines */}
              {patient?.prescribedMedicines && patient.prescribedMedicines.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💊 Doctor Prescribed Medicines</CardTitle>
                    <CardDescription>{patient.prescribedMedicines.length} medicines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient.prescribedMedicines.map((medicine, idx) => (
                        <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="font-medium text-sm text-green-700">{medicine.medicine}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            <p className="text-gray-600"><strong>Route:</strong> {medicine.route}</p>
                            <p className="text-gray-600"><strong>Dose:</strong> {medicine.dose}</p>
                            <p className="text-gray-600 col-span-2"><strong>Frequency:</strong> {medicine.frequency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Injection Details */}
              {patient?.injectionDetails && patient.injectionDetails.required && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💉 Injection Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Details:</strong> {patient.injectionDetails.details}</p>
                      <p><strong>Room:</strong> {patient.injectionDetails.roomNumber}</p>
                      <p><strong>Status:</strong> <span className="capitalize font-medium text-red-600">{patient.injectionDetails.status}</span></p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lab Test Details */}
              {patient?.labTestDetails && patient.labTestDetails.required && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧪 Lab Test Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Details:</strong> {patient.labTestDetails.details}</p>
                      <p><strong>Room:</strong> {patient.labTestDetails.roomNumber}</p>
                      <p><strong>Status:</strong> <span className="capitalize font-medium text-cyan-600">{patient.labTestDetails.status}</span></p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  {vitals.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {vitals.slice(0, 5).map((vital) => (
                        <div key={vital._id} className="text-xs p-2 bg-gray-50 rounded">
                          <p className="font-medium">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                          <p className="text-gray-600">BP: {vital.bloodPressure} | HR: {vital.heartRate} bpm | Temp: {vital.temperature}°C</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No vitals recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

