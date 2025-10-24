"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DoctorHeader from "@/components/doctor/doctor-header"

interface PatientData {
  _id: string
  patientId: string
  userId: {
    name: string
    email: string
  }
  age: number
  sex: string
  occupation?: string
  address?: string
  medicalHistory?: string
  allergies?: string
}

interface Prescription {
  _id: string
  medicine: string
  route: string
  dose: string
  frequency: string
  duration: string
  status: string
}

interface LabTest {
  _id: string
  testName: string
  sampleType: string
  status: string
  result?: string
}

interface Injection {
  _id: string
  injectionName: string
  injectionType: string
  dose: string
  frequency: string
  status: string
}

interface Visit {
  _id: string
  diagnosis: string
  advice: string
  remarks: string
  vitals?: any
}

interface Symptom {
  symptom: string
  description: string
  recordedAt: string
}

export default function PatientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, loading } = useAuth()
  const patientId = params.id as string

  const [patient, setPatient] = useState<PatientData | null>(null)
  const [patientVitals, setPatientVitals] = useState<any[]>([])
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([])
  const [patientLabTests, setPatientLabTests] = useState<LabTest[]>([])
  const [patientInjections, setPatientInjections] = useState<Injection[]>([])
  const [patientVisits, setPatientVisits] = useState<Visit[]>([])
  const [patientSymptoms, setPatientSymptoms] = useState<Symptom[]>([])

  const [diagnosis, setDiagnosis] = useState("")
  const [remarks, setRemarks] = useState("")
  const [vitals, setVitals] = useState({
    height: "",
    weight: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
  })
  const [medicines, setMedicines] = useState([{ medicine: "", route: "", dose: "", frequency: "", duration: "7 days" }])
  const [advice, setAdvice] = useState("")

  const [needsInjection, setNeedsInjection] = useState(false)
  const [injectionDetails, setInjectionDetails] = useState("")
  const [needsLabTest, setNeedsLabTest] = useState(false)
  const [labTestDetails, setLabTestDetails] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [pageLoading, setPageLoading] = useState(true)

  // Fetch patient data from backend
  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/doctor/signin")
        return
      }

      const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch patient data")
      }

      const data = await response.json()
      setPatient(data.patient)
      setPatientVitals(data.vitals || [])
      setPatientPrescriptions(data.prescriptions || [])
      setPatientLabTests(data.labTests || [])
      setPatientInjections(data.injections || [])
      setPatientVisits(data.visits || [])
      setPatientSymptoms(data.patient?.symptoms || [])

      // Pre-fill form with latest visit data if available
      if (data.visits && data.visits.length > 0) {
        const latestVisit = data.visits[0]
        if (latestVisit.diagnosis) setDiagnosis(latestVisit.diagnosis)
        if (latestVisit.advice) setAdvice(latestVisit.advice)
        if (latestVisit.remarks) setRemarks(latestVisit.remarks)
        if (latestVisit.vitals) setVitals(latestVisit.vitals)
      }

      setPageLoading(false)
    } catch (error) {
      console.error("Error fetching patient data:", error)
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/doctor/signin")
    } else if (!loading && isAuthenticated && patientId) {
      fetchPatientData()
    }
  }, [isAuthenticated, loading, router, patientId])

  if (loading || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading patient details...</div>
  }

  if (!isAuthenticated || user?.role !== "doctor") {
    return null
  }

  if (!patient) {
    return <div className="flex items-center justify-center min-h-screen">Patient not found</div>
  }

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVitals((prev) => ({ ...prev, [name]: value }))
  }

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMedicines = [...medicines]
    newMedicines[index] = { ...newMedicines[index], [field]: value }
    setMedicines(newMedicines)
  }

  const addMedicine = () => {
    setMedicines([...medicines, { medicine: "", route: "", dose: "", frequency: "", duration: "7 days" }])
  }

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage("")

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setSaveMessage("❌ Authentication token not found")
        setSaving(false)
        return
      }

      // Validate required fields
      if (!diagnosis.trim()) {
        setSaveMessage("❌ Please enter diagnosis")
        setSaving(false)
        return
      }

      const response = await fetch(`http://localhost:5000/api/patients/${patient.patientId}/save-record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diagnosis,
          remarks,
          advice,
          medicines,
          vitals,
          needsInjection,
          injectionDetails: needsInjection ? injectionDetails : null,
          needsLabTest,
          labTestDetails: needsLabTest ? labTestDetails : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setSaveMessage(`❌ Error: ${errorData.message || "Failed to save patient record"}`)
        setSaving(false)
        return
      }

      const data = await response.json()
      setSaveMessage(`✅ Patient record saved successfully! (${data.prescriptions} prescriptions, ${data.injections} injections, ${data.labTests} lab tests)`)

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/doctor/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error saving patient record:", error)
      setSaveMessage("❌ Error saving patient record")
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Patient Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient.userId?.name || "N/A"}</p>
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
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">{patient.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{patient.userId?.email || "N/A"}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-gray-600">Medical History</p>
                <p className="font-medium">{patient.medicalHistory || "No history recorded"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Symptoms from Chatbot */}
        {patientSymptoms && patientSymptoms.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">📋 Symptoms from Health Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientSymptoms.map((symptom, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{symptom.symptom}</p>
                        {symptom.description && (
                          <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 ml-2">
                        {new Date(symptom.recordedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Diagnosis & Vitals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnosis */}
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter additional remarks or notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Height (cm)</label>
                    <Input
                      type="number"
                      name="height"
                      value={vitals.height}
                      onChange={handleVitalsChange}
                      placeholder="Height"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <Input
                      type="number"
                      name="weight"
                      value={vitals.weight}
                      onChange={handleVitalsChange}
                      placeholder="Weight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
                    <Input
                      type="number"
                      name="temperature"
                      value={vitals.temperature}
                      onChange={handleVitalsChange}
                      placeholder="Temperature"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                    <Input
                      type="text"
                      name="bloodPressure"
                      value={vitals.bloodPressure}
                      onChange={handleVitalsChange}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                    <Input
                      type="number"
                      name="heartRate"
                      value={vitals.heartRate}
                      onChange={handleVitalsChange}
                      placeholder="Heart Rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Respiratory Rate</label>
                    <Input
                      type="number"
                      name="respiratoryRate"
                      value={vitals.respiratoryRate}
                      onChange={handleVitalsChange}
                      placeholder="Respiratory Rate"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicines */}
            <Card>
              <CardHeader>
                <CardTitle>Prescribe Medicines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicines.map((med, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Medicine Name</label>
                        <Input
                          value={med.medicine}
                          onChange={(e) => handleMedicineChange(idx, "medicine", e.target.value)}
                          placeholder="Medicine name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Route</label>
                        <select
                          value={med.route}
                          onChange={(e) => handleMedicineChange(idx, "route", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select route</option>
                          <option value="Oral">Oral</option>
                          <option value="IV">IV</option>
                          <option value="IM">IM</option>
                          <option value="Topical">Topical</option>
                          <option value="Inhalation">Inhalation</option>
                          <option value="Rectal">Rectal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Dose</label>
                        <Input
                          value={med.dose}
                          onChange={(e) => handleMedicineChange(idx, "dose", e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <Input
                          value={med.duration || "7 days"}
                          onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                      {medicines.length > 1 && (
                        <div className="flex items-end">
                          <Button
                            onClick={() => removeMedicine(idx)}
                            variant="destructive"
                            className="w-full"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button onClick={addMedicine} variant="outline" className="w-full bg-transparent">
                  + Add Another Medicine
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Injection/IV Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="needsInjection"
                      checked={needsInjection}
                      onChange={(e) => setNeedsInjection(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="needsInjection" className="text-sm font-medium cursor-pointer">
                      Patient needs Injection / IV
                    </label>
                  </div>
                  {needsInjection && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Injection/IV Details</label>
                      <Input
                        value={injectionDetails}
                        onChange={(e) => setInjectionDetails(e.target.value)}
                        placeholder="e.g., Saline IV, Antibiotic injection"
                      />
                    </div>
                  )}
                </div>

                {/* Lab Test Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="needsLabTest"
                      checked={needsLabTest}
                      onChange={(e) => setNeedsLabTest(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="needsLabTest" className="text-sm font-medium cursor-pointer">
                      Patient needs Lab Tests
                    </label>
                  </div>
                  {needsLabTest && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Lab Test Details</label>
                      <Input
                        value={labTestDetails}
                        onChange={(e) => setLabTestDetails(e.target.value)}
                        placeholder="e.g., Blood test, X-ray, Ultrasound"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Advice & Actions */}
          <div className="space-y-6">
            {/* Advice */}
            <Card>
              <CardHeader>
                <CardTitle>Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Enter medical advice for the patient"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Previous Vitals */}
            {patientVitals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Vitals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {patientVitals.slice(0, 5).map((vital) => (
                    <div key={vital._id} className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">BP: {vital.bloodPressure || "N/A"}</p>
                      <p>HR: {vital.heartRate || "N/A"} bpm</p>
                      <p className="text-xs text-gray-600">{new Date(vital.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Previous Prescriptions */}
            {patientPrescriptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {patientPrescriptions.slice(0, 5).map((prescription) => (
                    <div key={prescription._id} className="p-2 bg-green-50 rounded border border-green-200">
                      <p className="font-medium text-green-900">{prescription.medicine}</p>
                      <p className="text-xs text-green-700">
                        {prescription.dose} - {prescription.frequency}
                      </p>
                      <p className="text-xs text-green-700">Route: {prescription.route}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {patientLabTests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lab Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {patientLabTests.slice(0, 5).map((test) => (
                    <div key={test._id} className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="font-medium text-blue-900">{test.testName}</p>
                      <p className="text-xs text-blue-700">Sample: {test.sampleType}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Status: <span className="font-semibold capitalize">{test.status}</span>
                      </p>
                      {test.result && <p className="text-xs text-blue-700 mt-1">Result: {test.result}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Previous Injections */}
            {patientInjections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Injections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {patientInjections.slice(0, 5).map((injection) => (
                    <div key={injection._id} className="p-2 bg-orange-50 rounded border border-orange-200">
                      <p className="font-medium text-orange-900">{injection.injectionName}</p>
                      <p className="text-xs text-orange-700">Type: {injection.injectionType}</p>
                      <p className="text-xs text-orange-700">
                        {injection.dose} - {injection.frequency}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {saveMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    saveMessage.includes("✅")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {saveMessage}
                </div>
              )}
              <Button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Patient Record"}
              </Button>
              <Button onClick={() => router.push("/doctor/dashboard")} variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
