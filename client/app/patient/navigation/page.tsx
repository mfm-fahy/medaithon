"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"
import { MapPin, Clock, DoorOpen, AlertCircle, RefreshCw, Navigation, Zap } from "lucide-react"

interface HospitalNavigation {
  roomNumber: string
  floor: string
  department: string
  directions: string
  estimatedWaitTime: number
  status: string
  lastUpdated: string
}

interface InjectionDetails {
  required: boolean
  details: string
  roomNumber: string
  floor: string
  status: string
  updatedAt: string
}

interface LabTestDetails {
  required: boolean
  details: string
  roomNumber: string
  floor: string
  status: string
  updatedAt: string
}

interface PrescribedMedicine {
  medicine: string
  route: string
  dose: string
  frequency: string
  prescribedAt: string
}

export default function NavigationPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [navigation, setNavigation] = useState<HospitalNavigation | null>(null)
  const [realtimeWaitTime, setRealtimeWaitTime] = useState<number | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [showUpdateAnimation, setShowUpdateAnimation] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const [injectionDetails, setInjectionDetails] = useState<InjectionDetails | null>(null)
  const [labTestDetails, setLabTestDetails] = useState<LabTestDetails | null>(null)
  const [prescribedMedicines, setPrescribedMedicines] = useState<PrescribedMedicine[]>([])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  // Fetch initial navigation data
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const patientId = (user as any)?.patientId

        if (!token || !patientId) return

        const response = await fetch(`http://localhost:5000/api/visits/navigation/${patientId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setNavigation(data.hospitalNavigation)
          setRealtimeWaitTime(data.hospitalNavigation.estimatedWaitTime)
        }
      } catch (error) {
        console.error("Failed to fetch navigation:", error)
      }
    }

    if (user && (user as any)?.patientId) {
      fetchNavigation()
    }
  }, [user])

  // Setup WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//localhost:5000`

    try {
      console.log('🔌 Connecting to WebSocket:', wsUrl)
      const websocket = new WebSocket(wsUrl)

      websocket.onopen = () => {
        console.log('✅ WebSocket connected for real-time updates')
        setIsConnected(true)
        // Register patient for real-time updates
        websocket.send(JSON.stringify({
          type: 'register',
          patientId: (user as any)?.patientId,
        }))
      }

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('🔌 WebSocket message received:', data)

        if (data.type === 'wait-time-update') {
          console.log('⏱️ Wait time updated:', data.estimatedWaitTime)
          setRealtimeWaitTime(data.estimatedWaitTime)
          setLastUpdate(new Date())
          setUpdateMessage('⏱️ Wait time updated!')
          setShowUpdateAnimation(true)
          setTimeout(() => setShowUpdateAnimation(false), 3000)
        } else if (data.type === 'navigation-update') {
          console.log('📍 Navigation updated:', data.data)
          setNavigation(data.data)
          setRealtimeWaitTime(data.data.estimatedWaitTime)
          setLastUpdate(new Date())
          setUpdateMessage('📍 Your appointment location has been updated!')
          setShowUpdateAnimation(true)
          setTimeout(() => setShowUpdateAnimation(false), 3000)
        } else if (data.type === 'navigation-update' && data.data) {
          // Handle injection and lab test updates
          if (data.data.injection) {
            console.log('💉 Injection details updated:', data.data.injection)
            setInjectionDetails(data.data.injection)
            setUpdateMessage('💉 You need to go for injection!')
            setShowUpdateAnimation(true)
            setTimeout(() => setShowUpdateAnimation(false), 3000)
          }
          if (data.data.labTest) {
            console.log('🧪 Lab test details updated:', data.data.labTest)
            setLabTestDetails(data.data.labTest)
            setUpdateMessage('🧪 You need to go for lab test!')
            setShowUpdateAnimation(true)
            setTimeout(() => setShowUpdateAnimation(false), 3000)
          }
          if (data.data.prescribedMedicines) {
            console.log('💊 Prescribed medicines updated:', data.data.prescribedMedicines)
            setPrescribedMedicines(data.data.prescribedMedicines)
          }
        }
      }

      websocket.onclose = () => {
        setIsConnected(false)
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }

      setWs(websocket)

      return () => {
        websocket.close()
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }, [user])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Connection Status */}
        <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
          isConnected ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse`}></div>
          <p className={`text-sm ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
            {isConnected ? '🔌 Real-time updates connected' : '⏳ Connecting to real-time updates...'}
          </p>
        </div>

        {/* Update Animation */}
        {showUpdateAnimation && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg flex items-center gap-3 animate-pulse">
            <Zap className="w-5 h-5 text-blue-600 animate-bounce" />
            <p className="text-sm font-semibold text-blue-700">{updateMessage}</p>
          </div>
        )}

        {/* Main Navigation Card */}
        {navigation ? (
          <Card className="mb-6 border-2 border-blue-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-6 h-6 text-blue-600" />
                    Your Hospital Navigation
                  </CardTitle>
                  <CardDescription>Real-time directions to your appointment</CardDescription>
                </div>
                {lastUpdate && (
                  <div className="text-right text-xs text-gray-600">
                    <p>Last updated</p>
                    <p className="font-semibold">{lastUpdate.toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Room Number */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DoorOpen className="w-5 h-5 text-blue-600" />
                    <p className="text-xs font-semibold text-gray-600">ROOM NUMBER</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{navigation.roomNumber}</p>
                </div>

                {/* Floor */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <p className="text-xs font-semibold text-gray-600">FLOOR</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">{navigation.floor}</p>
                </div>

                {/* Department / Doctor Category */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    <p className="text-xs font-semibold text-gray-600">DOCTOR CATEGORY</p>
                  </div>
                  <p className="text-sm font-bold text-green-600">{navigation.department}</p>
                  <p className="text-xs text-green-600 mt-1">Assigned by Nurse</p>
                </div>

                {/* Wait Time */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <p className="text-xs font-semibold text-gray-600">WAIT TIME</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{realtimeWaitTime || navigation.estimatedWaitTime}</p>
                  <p className="text-xs text-gray-600">minutes</p>
                </div>
              </div>

              {/* Directions */}
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  📍 Step-by-Step Directions:
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {navigation.directions}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">APPOINTMENT STATUS</p>
                  <p className="text-lg font-bold text-blue-600 capitalize">{navigation.status}</p>
                </div>
                <div className="text-3xl">
                  {navigation.status === 'scheduled' && '✅'}
                  {navigation.status === 'in-progress' && '⏳'}
                  {navigation.status === 'completed' && '🎉'}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-2 border-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-yellow-700">
                <AlertCircle className="w-6 h-6" />
                <p>No active appointment. Please schedule a visit from the home page.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Injection Details */}
        {injectionDetails && injectionDetails.required && (
          <Card className="mb-6 border-2 border-red-500 bg-red-50">
            <CardHeader className="bg-red-100">
              <CardTitle className="flex items-center gap-2 text-red-700">
                💉 Injection Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">INJECTION DETAILS</p>
                  <p className="text-sm font-medium text-red-700">{injectionDetails.details}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">ROOM NUMBER</p>
                  <p className="text-2xl font-bold text-red-600">{injectionDetails.roomNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">STATUS</p>
                <p className="text-sm font-medium capitalize text-red-700">{injectionDetails.status}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lab Test Details */}
        {labTestDetails && labTestDetails.required && (
          <Card className="mb-6 border-2 border-cyan-500 bg-cyan-50">
            <CardHeader className="bg-cyan-100">
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                🧪 Lab Test Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-cyan-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">LAB TEST DETAILS</p>
                  <p className="text-sm font-medium text-cyan-700">{labTestDetails.details}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-cyan-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">ROOM NUMBER</p>
                  <p className="text-2xl font-bold text-cyan-600">{labTestDetails.roomNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">STATUS</p>
                <p className="text-sm font-medium capitalize text-cyan-700">{labTestDetails.status}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescribed Medicines */}
        {prescribedMedicines.length > 0 && (
          <Card className="mb-6 border-2 border-green-500 bg-green-50">
            <CardHeader className="bg-green-100">
              <CardTitle className="flex items-center gap-2 text-green-700">
                💊 Prescribed Medicines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {prescribedMedicines.map((medicine, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">MEDICINE NAME</p>
                      <p className="text-sm font-medium text-green-700">{medicine.medicine}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">ROUTE</p>
                      <p className="text-sm font-medium text-green-700">{medicine.route}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">DOSE</p>
                      <p className="text-sm font-medium text-green-700">{medicine.dose}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">FREQUENCY</p>
                      <p className="text-sm font-medium text-green-700">{medicine.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p><strong>✓ QR Code:</strong> Keep your QR code visible at all times for quick check-in</p>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p><strong>✓ Early Arrival:</strong> Arrive 5-10 minutes before your scheduled time</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <p><strong>✓ Real-time Updates:</strong> Wait times update automatically as you navigate</p>
            </div>
            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <p><strong>✓ Assistance:</strong> Ask any staff member if you need help finding your way</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => router.push("/patient/home")}
            variant="outline"
            className="flex-1"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Updates
          </Button>
        </div>
      </main>
    </div>
  )
}
