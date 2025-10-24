"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader, RefreshCw, Clock, User, Pill } from "lucide-react"
import PatientHeader from "@/components/patient/patient-header"

interface QueueItem {
  _id: string
  patientId: string
  queuePosition: number
  assignedDoctor?: {
    doctorId: string
    doctorName: string
  }
  hospitalNavigation?: {
    roomNumber: string
    floor: string
    department: string
    estimatedWaitTime: number
  }
}

interface Prescription {
  _id: string
  medicine: string
  dose: string
  frequency: string
  route: string
  duration: string
  advice?: string
  status: string
}

export default function PatientQueuePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [queueData, setQueueData] = useState<QueueItem | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loadingQueue, setLoadingQueue] = useState(false)
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false)
  const [error, setError] = useState("")
  const [wsConnected, setWsConnected] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  // Fetch patient queue data
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "patient") return

    const fetchQueueData = async () => {
      setLoadingQueue(true)
      setError("")
      try {
        const token = localStorage.getItem("auth_token")
        const patientId = (user as any)?.patientId || (user as any)?._id

        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setQueueData(data)
          setLastUpdate(new Date())
        }
      } catch (err) {
        console.error("Error fetching queue data:", err)
        setError("Failed to fetch queue data")
      } finally {
        setLoadingQueue(false)
      }
    }

    fetchQueueData()
  }, [isAuthenticated, user])

  // Fetch prescriptions when queue data is available
  useEffect(() => {
    if (!queueData || !isAuthenticated) return

    const fetchPrescriptions = async () => {
      setLoadingPrescriptions(true)
      try {
        const token = localStorage.getItem("auth_token")
        const patientId = (user as any)?.patientId || (user as any)?._id

        const response = await fetch(`http://localhost:5000/api/prescriptions?patientId=${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPrescriptions(Array.isArray(data) ? data : data.prescriptions || [])
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err)
      } finally {
        setLoadingPrescriptions(false)
      }
    }

    fetchPrescriptions()
  }, [queueData, isAuthenticated, user])

  // WebSocket for real-time updates
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "patient") return

    const patientId = (user as any)?.patientId || (user as any)?._id
    const token = localStorage.getItem("auth_token")

    const ws = new WebSocket(`ws://localhost:5000?patientId=${patientId}&token=${token}`)

    ws.onopen = () => {
      console.log("✅ WebSocket connected for patient queue updates")
      setWsConnected(true)
      ws.send(JSON.stringify({
        type: "register",
        patientId: patientId,
      }))
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("📨 WebSocket message received:", message)

        if (message.type === "navigation-update" || message.type === "queue-update") {
          setQueueData((prev) => prev ? {
            ...prev,
            hospitalNavigation: message.data,
          } : null)
          setLastUpdate(new Date())
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Queue Status</h1>
          <p className="text-gray-600">View your position in queue and prescribed medicines</p>
        </div>

        {/* Connection Status */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-600">
            {wsConnected ? "Real-time updates active" : "Connecting..."}
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-500 ml-auto">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue Status */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Queue Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingQueue ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : queueData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600">Queue Position</p>
                      <p className="text-3xl font-bold text-blue-600">{queueData.queuePosition || "N/A"}</p>
                    </div>

                    {queueData.assignedDoctor && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Assigned Doctor
                        </p>
                        <p className="font-medium text-green-900">{queueData.assignedDoctor.doctorName}</p>
                      </div>
                    )}

                    {queueData.hospitalNavigation && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-gray-600">Room Number</p>
                        <p className="text-2xl font-bold text-purple-600">{queueData.hospitalNavigation.roomNumber}</p>
                        <p className="text-xs text-gray-600 mt-2">{queueData.hospitalNavigation.department}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No queue data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prescribed Medicines */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Prescribed Medicines
                </CardTitle>
                <CardDescription>Click on a medicine to view details</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPrescriptions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : prescriptions.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No prescriptions available</p>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((presc) => (
                      <button
                        key={presc._id}
                        onClick={() => setSelectedPrescription(presc)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedPrescription?._id === presc._id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{presc.medicine}</p>
                            <p className="text-sm text-gray-600">{presc.dose} - {presc.frequency}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            presc.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {presc.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medicine Details */}
            {selectedPrescription && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Medicine Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Medicine Name</p>
                      <p className="font-medium">{selectedPrescription.medicine}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dose</p>
                      <p className="font-medium">{selectedPrescription.dose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="font-medium">{selectedPrescription.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-medium">{selectedPrescription.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{selectedPrescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium capitalize">{selectedPrescription.status}</p>
                    </div>
                    {selectedPrescription.advice && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Advice</p>
                        <p className="font-medium">{selectedPrescription.advice}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Button onClick={() => router.push("/patient/home")} variant="outline" className="w-full mt-6">
          Back to Home
        </Button>
      </main>
    </div>
  )
}

