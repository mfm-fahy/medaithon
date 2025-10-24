"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NurseHeader from "@/components/nurse/nurse-header"
import { AlertCircle, CheckCircle, Loader, Stethoscope } from "lucide-react"

interface Patient {
  _id: string
  patientId: string
  userId?: { name: string; email: string }
  age: number
  sex: string
  phone: string
}

interface Doctor {
  _id: string
  userId: { name: string; email: string }
  specialization: string
  designation: string
}

const DOCTOR_CATEGORIES = [
  { name: "General Medicine", icon: "🏥", floor: "Ground Floor" },
  { name: "Cardiology", icon: "❤️", floor: "1st Floor" },
  { name: "Orthopedics", icon: "🦴", floor: "1st Floor" },
  { name: "Pediatrics", icon: "👶", floor: "2nd Floor" },
  { name: "Neurology", icon: "🧠", floor: "2nd Floor" },
  { name: "General Surgery", icon: "🔪", floor: "3rd Floor" },
  { name: "Radiology", icon: "📸", floor: "Basement" },
  { name: "Emergency", icon: "🚨", floor: "Ground Floor" },
]

function AssignDoctorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading } = useAuth()
  const patientId = searchParams.get("patientId")

  const [patient, setPatient] = useState<Patient | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([])
  const [roomNumber, setRoomNumber] = useState<string>("")
  const [loadingData, setLoadingData] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    console.log("🔵 useEffect triggered:", {
      isAuthenticated,
      userRole: user?.role,
      patientId,
      loading,
    })
    if (isAuthenticated && user?.role === "nurse" && patientId) {
      console.log("🔵 Fetching patient data...")
      fetchPatientData()
    }
  }, [isAuthenticated, user, patientId])

  const fetchPatientData = async () => {
    setLoadingData(true)
    setError("")
    try {
      const token = localStorage.getItem("auth_token")
      console.log("🔵 Fetching patient data for:", patientId)
      console.log("🔵 Token:", token ? "Present" : "Missing")

      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("🔵 Response status:", response.status)

      if (!response.ok) {
        try {
          const errorData = await response.json()
          console.error("❌ Error response:", errorData)
          throw new Error(errorData.message || `Failed to fetch patient data (Status: ${response.status})`)
        } catch (parseError) {
          console.error("❌ Error parsing response:", parseError)
          throw new Error(`Failed to fetch patient data (Status: ${response.status})`)
        }
      }

      const data = await response.json()
      console.log("✅ Patient data received:", data)
      setPatient(data.patient)
    } catch (err) {
      console.error("❌ Error fetching patient data:", err)
      setError(err instanceof Error ? err.message : "Error fetching patient data")
    } finally {
      setLoadingData(false)
    }
  }

  const fetchDoctorsBySpecialization = async (specialization: string) => {
    setLoadingDoctors(true)
    setError("")
    setSelectedDoctor("")
    try {
      const token = localStorage.getItem("auth_token")
      console.log("🔵 Fetching doctors for specialization:", specialization)

      const response = await fetch(`http://localhost:5000/api/doctors?specialization=${encodeURIComponent(specialization)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch doctors")
      }

      const data = await response.json()
      console.log("✅ Doctors fetched:", data.doctors)
      setAvailableDoctors(data.doctors || [])
    } catch (err) {
      console.error("❌ Error fetching doctors:", err)
      setError(err instanceof Error ? err.message : "Error fetching doctors")
      setAvailableDoctors([])
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleAssignDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    if (!selectedCategory || !selectedDoctor || !roomNumber) {
      setError("Please select a doctor category, choose a doctor, and enter a room number")
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const selectedDept = DOCTOR_CATEGORIES.find(d => d.name === selectedCategory)
      const doctor = availableDoctors.find(d => d._id === selectedDoctor)

      console.log("🔵 Assigning doctor to patient:", {
        patientId,
        doctorId: selectedDoctor,
        doctorName: doctor?.userId?.name,
        doctorCategory: selectedCategory,
        roomNumber,
      })

      const response = await fetch(`http://localhost:5000/api/patients/navigation/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          doctorName: doctor?.userId?.name,
          doctorCategory: selectedCategory,
          roomNumber,
          floor: selectedDept?.floor || "Ground Floor",
          department: selectedCategory,
        }),
      })

      console.log("🔵 Response status:", response.status)

      if (!response.ok) {
        try {
          const errorData = await response.json()
          console.error("❌ Error response:", errorData)
          throw new Error(errorData.message || `Failed to assign doctor (Status: ${response.status})`)
        } catch (parseError) {
          console.error("❌ Error parsing response:", parseError)
          throw new Error(`Failed to assign doctor (Status: ${response.status})`)
        }
      }

      const data = await response.json()
      console.log("✅ Doctor assigned successfully:", data)
      setSuccess(`Patient assigned to ${doctor?.userId?.name} (${selectedCategory}) - Room ${roomNumber}`)

      // Redirect back to vitals page after 2 seconds
      setTimeout(() => {
        router.push(`/nurse/vitals?patientId=${patientId}`)
      }, 2000)
    } catch (err) {
      console.error("❌ Error assigning doctor:", err)
      setError(err instanceof Error ? err.message : "Error assigning doctor")
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

      <main className="max-w-4xl mx-auto p-4 md:p-6">
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
          <div className="space-y-6">
            {/* Patient Info Card */}
            <Card>
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

            {/* Doctor Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Select Doctor Category
                </CardTitle>
                <CardDescription>Choose which doctor specialization the patient needs to visit</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignDoctor} className="space-y-6">
                  {/* Category Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DOCTOR_CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.name)
                          fetchDoctorsBySpecialization(category.name)
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          selectedCategory === category.name
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <p className="text-sm font-medium">{category.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{category.floor}</p>
                      </button>
                    ))}
                  </div>

                  {/* Doctor Selection */}
                  {selectedCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Doctor</label>
                      {loadingDoctors ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                          <p className="text-sm text-gray-600">Loading doctors...</p>
                        </div>
                      ) : availableDoctors.length === 0 ? (
                        <p className="text-sm text-red-600">No doctors available for this specialization</p>
                      ) : (
                        <select
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Choose a doctor...</option>
                          {availableDoctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                              {doctor.userId?.name} - {doctor.designation}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Room Number Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Number</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g., A101, B205, C310"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the room number where the patient should go</p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting || !selectedCategory || !selectedDoctor || !roomNumber}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? "Assigning..." : "Assign Doctor & Update Navigation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default function AssignDoctorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AssignDoctorContent />
    </Suspense>
  )
}
