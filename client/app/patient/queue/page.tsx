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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="animate-spin">
          <Loader className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large Blue-Cyan Orb */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
        
        {/* Large Green-Emerald Orb */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Large Teal-Blue Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Secondary Purple Orb with Pulse */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        
        {/* Secondary Pink Orb with Pulse */}
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
        
        {/* Medical Cross Symbols */}
        <div className="absolute top-10 left-10 text-6xl text-blue-200 opacity-10">+</div>
        <div className="absolute top-32 right-32 text-5xl text-teal-200 opacity-10">+</div>
        <div className="absolute bottom-40 left-40 text-7xl text-green-200 opacity-10">+</div>
        <div className="absolute bottom-20 right-40 text-4xl text-cyan-200 opacity-10">+</div>
        <div className="absolute top-1/2 right-10 text-6xl text-emerald-200 opacity-10">+</div>
      </div>

      {/* Header with Animation */}
      <div className="relative animate-slide-in-top">
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-gradient-to-r from-blue-600 via-teal-600 to-green-600">
          <PatientHeader user={user} />
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
            My Queue Status
          </h1>
          <p className="text-gray-600 mt-2">View your position in queue and prescribed medicines</p>
        </div>

        {/* Connection Status */}
        <div className="mb-4 flex items-center gap-2 animate-fade-in-up animation-delay-300">
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${wsConnected ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"}`}></div>
          <span className="text-sm text-gray-600 font-medium">
            {wsConnected ? "Real-time updates active" : "Connecting..."}
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-500 ml-auto">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-2 animate-fade-in-up animation-delay-400 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue Status Card */}
          <div className="lg:col-span-1 animate-fade-in-up animation-delay-500">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="p-6 border-b-2 border-gradient-to-r from-blue-400 to-teal-400">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Queue Status
                </h2>
              </div>
              <div className="p-6">
                {loadingQueue ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : queueData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Queue Position</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{queueData.queuePosition || "N/A"}</p>
                    </div>

                    {queueData.assignedDoctor && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                          <User className="w-4 h-4 text-green-600" />
                          Assigned Doctor
                        </p>
                        <p className="font-bold text-green-900 mt-1">{queueData.assignedDoctor.doctorName}</p>
                      </div>
                    )}

                    {queueData.hospitalNavigation && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <p className="text-sm text-gray-600 font-medium">Room Number</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{queueData.hospitalNavigation.roomNumber}</p>
                        <p className="text-xs text-gray-600 mt-2">{queueData.hospitalNavigation.department}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No queue data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Prescribed Medicines Card */}
          <div className="lg:col-span-2 animate-fade-in-up animation-delay-600">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-white/60 hover:shadow-2xl transition-all duration-300">
              <div className="p-6 border-b-2 border-gradient-to-r from-teal-400 to-green-400">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Prescribed Medicines
                </h2>
                <p className="text-sm text-gray-600 mt-1">Click on a medicine to view details</p>
              </div>
              <div className="p-6">
                {loadingPrescriptions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-teal-600" />
                  </div>
                ) : prescriptions.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No prescriptions available</p>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((presc, index) => (
                      <button
                        key={presc._id}
                        onClick={() => setSelectedPrescription(presc)}
                        style={{ animationDelay: `${700 + index * 100}ms` }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up ${
                          selectedPrescription?._id === presc._id
                            ? "border-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg shadow-blue-200/50"
                            : "border-gray-200 hover:border-teal-400 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{presc.medicine}</p>
                            <p className="text-sm text-gray-600 mt-1">{presc.dose} - {presc.frequency}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                            presc.status === "active"
                              ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}>
                            {presc.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Medicine Details */}
            {selectedPrescription && (
              <div className="mt-6 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-white/60 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
                <div className="p-6 border-b-2 border-gradient-to-r from-blue-400 to-purple-400">
                  <h2 className="text-xl font-bold text-gray-800">Medicine Details</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Medicine Name</p>
                      <p className="font-bold text-gray-900 mt-1">{selectedPrescription.medicine}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-teal-50 to-green-50 rounded-lg border-2 border-teal-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Dose</p>
                      <p className="font-bold text-gray-900 mt-1">{selectedPrescription.dose}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Frequency</p>
                      <p className="font-bold text-gray-900 mt-1">{selectedPrescription.frequency}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Route</p>
                      <p className="font-bold text-gray-900 mt-1">{selectedPrescription.route}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Duration</p>
                      <p className="font-bold text-gray-900 mt-1">{selectedPrescription.duration}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <p className="text-sm text-gray-600 font-medium">Status</p>
                      <p className="font-bold text-gray-900 mt-1 capitalize">{selectedPrescription.status}</p>
                    </div>
                    {selectedPrescription.advice && (
                      <div className="col-span-2 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <p className="text-sm text-gray-600 font-medium">Advice</p>
                        <p className="font-bold text-gray-900 mt-1">{selectedPrescription.advice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => router.push("/patient/home")} 
          className="w-full mt-6 px-6 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-800 relative overflow-hidden group"
        >
          <span className="relative z-10">Back to Home</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes slide-in-top {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-slide-in-top {
          animation: slide-in-top 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out backwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  )
}