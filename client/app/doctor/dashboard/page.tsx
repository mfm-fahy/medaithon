"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPatients } from "@/lib/mock-data"
import DoctorHeader from "@/components/doctor/doctor-header"
import { AlertCircle, Loader, RefreshCw, CheckCircle, Clock } from "lucide-react"

interface Patient {
  _id: string
  patientId: string
  userId?: { name: string; email: string }
  age: number
  sex: string
  phone: string
  queuePosition?: number
  assignedDoctor?: {
    doctorName: string
    specialization: string
    roomNumber: string
    floor: string
  }
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [error, setError] = useState("")
  const [wsConnected, setWsConnected] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [completedPatients, setCompletedPatients] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/doctor/signin")
    }
  }, [isAuthenticated, loading, router])

  // Fetch patients assigned to this doctor
  useEffect(() => {
    if (isAuthenticated && user?.role === "doctor" && ((user as any)?._id || (user as any)?.id)) {
      fetchPatientQueue()
    }
  }, [isAuthenticated, user])

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "doctor" || (!(user as any)?._id && !(user as any)?.id)) return

    const doctorId = (user as any)._id || (user as any)?.id
    const token = localStorage.getItem("auth_token")

    const ws = new WebSocket(`ws://localhost:5000?doctorId=${doctorId}&token=${token}`)

    ws.onopen = () => {
      console.log("✅ WebSocket connected for doctor:", doctorId)
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("📨 WebSocket message received:", message)

        if (message.type === "patient-added-to-queue") {
          console.log("👤 New patient added to queue:", message.patient)
          setWaitingPatients((prev) => [...prev, message.patient])
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (event) => {
      console.error("❌ WebSocket error occurred")
      console.error("📊 Error details:", {
        type: event.type,
        message: event.message,
        timestamp: new Date().toISOString(),
        readyState: ws.readyState,
        url: ws.url
      })
      console.warn("⚠️ WebSocket connection failed. Possible causes:")
      console.warn("1. Server not running on port 5000")
      console.warn("2. Firewall or proxy blocking connection")
      console.warn("3. Network connectivity issue")
      console.warn("4. CORS or protocol mismatch")
      setWsConnected(false)
    }

    ws.onclose = (event) => {
      console.log("❌ WebSocket disconnected")
      console.log("📊 Close details:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      })
      setWsConnected(false)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [isAuthenticated, user])

  const fetchPatientQueue = async () => {
    setLoadingPatients(true)
    setError("")
    try {
      const token = localStorage.getItem("auth_token")
      const doctorId = (user as any)._id || (user as any)?.id

      console.log("🔵 Fetching patient queue for doctor:", doctorId)
      console.log("🔵 Token:", token ? "Present" : "Missing")

      const response = await fetch(`http://localhost:5000/api/patients/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("🔵 Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Error response:", errorData)
        throw new Error("Failed to fetch patient queue")
      }

      const data = await response.json()
      console.log("✅ Patient queue fetched:", data.patients)
      setWaitingPatients(data.patients || [])
    } catch (err) {
      console.error("❌ Error fetching patient queue:", err)
      setError(err instanceof Error ? err.message : "Error fetching patient queue")
      // Fallback to mock data if backend fails
      setWaitingPatients(mockPatients)
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPatientQueue()
    setRefreshing(false)
  }

  const handleCompletePatient = async (patientId: string) => {
    try {
      const token = localStorage.getItem("auth_token")

      // Remove from queue
      setWaitingPatients((prev) => prev.filter((p) => p._id !== patientId))
      setCompletedPatients((prev) => [...prev, patientId])

      console.log("✅ Patient marked as completed:", patientId)
    } catch (err) {
      console.error("❌ Error completing patient:", err)
      setError("Failed to complete patient")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "doctor") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* WebSocket Status */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-600" : "bg-red-600"}`} />
          <p className="text-sm text-blue-700">
            {wsConnected ? "✅ Real-time updates connected" : "⏳ Connecting to real-time updates..."}
          </p>
        </div>

        {/* Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Doctor Name</p>
              <p className="text-xl font-bold">{user?.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="text-xl font-bold">{(user as any)?.specialization || "General Medicine"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-xl font-bold">{new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Waiting Patients</p>
              <p className="text-xl font-bold text-green-600">{waitingPatients.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Patients List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Patient Queue</CardTitle>
              <CardDescription>Patients assigned to you. Click on a patient to view details and manage their care</CardDescription>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loadingPatients}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Queue
            </button>
          </CardHeader>
          <CardContent>
            {loadingPatients ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <p className="text-gray-600">Loading patient queue...</p>
              </div>
            ) : waitingPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No patients in queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {waitingPatients.map((patient, index) => (
                  <div
                    key={patient._id || patient.patientId}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {patient.queuePosition || index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-lg">{patient.userId?.name || "Unknown"}</p>
                          <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
                          {patient.assignedDoctor?.roomNumber && (
                            <p className="text-sm text-gray-500">Room: {patient.assignedDoctor.roomNumber} | Floor: {patient.assignedDoctor.floor}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">Age: {patient.age}</p>
                          <p className="text-xs text-gray-500 capitalize">{patient.sex}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/doctor/patient/${patient._id}`)}
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleCompletePatient(patient._id)}
                            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Patients */}
        {completedPatients.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Patients ({completedPatients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {completedPatients.length} patient{completedPatients.length !== 1 ? "s" : ""} completed in this session
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
