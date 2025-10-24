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
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 animate-pulse">Loading...</div>
    </div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Secondary glowing circles */}
        <div className="absolute top-[60%] right-[20%] w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[60%] w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
        
        {/* Medical cross symbols */}
        <div className="absolute top-[15%] left-[15%] text-6xl text-blue-200 opacity-10">+</div>
        <div className="absolute top-[70%] left-[70%] text-6xl text-teal-200 opacity-10">+</div>
        <div className="absolute top-[40%] right-[25%] text-6xl text-green-200 opacity-10">+</div>
        <div className="absolute bottom-[30%] left-[45%] text-6xl text-blue-200 opacity-10">+</div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-lg animate-slide-in-top" style={{borderBottom: "2px solid transparent", borderImage: "linear-gradient(to right, rgb(37, 99, 235), rgb(20, 184, 166), rgb(34, 197, 94)) 1"}}>
        <PatientHeader user={user} />
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-6 relative z-10">
        {/* Connection Status */}
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-300 ${
          isConnected ? 'bg-green-100/90 border-green-400' : 'bg-yellow-100/90 border-yellow-400'
        }`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse shadow-lg`}></div>
          <p className={`text-sm font-semibold ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
            {isConnected ? '🔌 Real-time updates connected' : '⏳ Connecting to real-time updates...'}
          </p>
        </div>

        {/* Update Animation */}
        {showUpdateAnimation && (
          <div className="mb-6 p-5 bg-blue-50/95 backdrop-blur-sm border-2 border-blue-400 rounded-xl flex items-center gap-3 animate-pulse shadow-xl hover:shadow-2xl transition-all duration-300">
            <Zap className="w-6 h-6 text-blue-600 animate-bounce" />
            <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">{updateMessage}</p>
          </div>
        )}

        {/* Main Navigation Card */}
        {navigation ? (
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-500 animate-fade-in-up animation-delay-400 group">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 via-teal-50/80 to-green-50/80 backdrop-blur-sm rounded-t-xl border-b-2 border-transparent" style={{borderImage: "linear-gradient(to right, rgb(37, 99, 235), rgb(20, 184, 166), rgb(34, 197, 94)) 1"}}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 group-hover:from-teal-600 group-hover:to-green-600 transition-all duration-300">
                    <Navigation className="w-7 h-7 text-blue-600 group-hover:text-teal-600 transition-colors duration-300 hover:rotate-12 transform" />
                    Your Hospital Navigation
                  </CardTitle>
                  <CardDescription className="text-base mt-1 text-gray-600 group-hover:text-teal-600 transition-colors duration-300">Real-time directions to your appointment</CardDescription>
                </div>
                {lastUpdate && (
                  <div className="text-right text-xs text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform">
                    <p className="font-semibold">Last updated</p>
                    <p className="font-bold text-sm">{lastUpdate.toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Room Number */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group/card animate-fade-in-up animation-delay-500">
                  <div className="flex items-center gap-2 mb-2">
                    <DoorOpen className="w-5 h-5 text-blue-600 group-hover/card:rotate-12 transition-transform duration-300" />
                    <p className="text-xs font-bold text-gray-600 group-hover/card:text-blue-600 transition-colors duration-300">ROOM NUMBER</p>
                  </div>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{navigation.roomNumber}</p>
                </div>

                {/* Floor */}
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group/card animate-fade-in-up animation-delay-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600 group-hover/card:scale-110 transition-transform duration-300" />
                    <p className="text-xs font-bold text-gray-600 group-hover/card:text-purple-600 transition-colors duration-300">FLOOR</p>
                  </div>
                  <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">{navigation.floor}</p>
                </div>

                {/* Department / Doctor Category */}
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group/card animate-fade-in-up animation-delay-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-green-600 group-hover/card:rotate-180 transition-transform duration-500" />
                    <p className="text-xs font-bold text-gray-600 group-hover/card:text-green-600 transition-colors duration-300">DOCTOR CATEGORY</p>
                  </div>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">{navigation.department}</p>
                  <p className="text-xs text-green-700 mt-1 font-semibold">Assigned by Nurse</p>
                </div>

                {/* Wait Time */}
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group/card animate-fade-in-up animation-delay-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600 group-hover/card:animate-spin" />
                    <p className="text-xs font-bold text-gray-600 group-hover/card:text-orange-600 transition-colors duration-300">WAIT TIME</p>
                  </div>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800">{realtimeWaitTime || navigation.estimatedWaitTime}</p>
                  <p className="text-sm text-gray-700 font-semibold">minutes</p>
                </div>
              </div>

              {/* Directions */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in-up animation-delay-900">
                <p className="text-base font-bold mb-3 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  📍 Step-by-Step Directions:
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {navigation.directions}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 via-teal-50 to-green-50 rounded-xl border-2 border-blue-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-1000">
                <div>
                  <p className="text-xs text-gray-600 font-bold mb-1">APPOINTMENT STATUS</p>
                  <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 capitalize">{navigation.status}</p>
                </div>
                <div className="text-5xl hover:scale-125 transition-transform duration-300">
                  {navigation.status === 'scheduled' && '✅'}
                  {navigation.status === 'in-progress' && '⏳'}
                  {navigation.status === 'completed' && '🎉'}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-yellow-50/95 backdrop-blur-sm border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up animation-delay-400">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-yellow-700 font-semibold">
                <AlertCircle className="w-6 h-6 animate-pulse" />
                <p>No active appointment. Please schedule a visit from the home page.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Injection Details */}
        {injectionDetails && injectionDetails.required && (
          <Card className="mb-6 bg-red-50/95 backdrop-blur-sm border-2 border-red-400 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-fade-in-up animation-delay-500">
            <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-red-700">
                💉 Injection Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="text-xs text-gray-600 font-bold mb-2">INJECTION DETAILS</p>
                  <p className="text-sm font-semibold text-red-700">{injectionDetails.details}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="text-xs text-gray-600 font-bold mb-2">ROOM NUMBER</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">{injectionDetails.roomNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-gray-600 font-bold mb-2">STATUS</p>
                <p className="text-sm font-semibold capitalize text-red-700">{injectionDetails.status}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lab Test Details */}
        {labTestDetails && labTestDetails.required && (
          <Card className="mb-6 bg-cyan-50/95 backdrop-blur-sm border-2 border-cyan-400 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-fade-in-up animation-delay-600">
            <CardHeader className="bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-cyan-700">
                🧪 Lab Test Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border-2 border-cyan-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="text-xs text-gray-600 font-bold mb-2">LAB TEST DETAILS</p>
                  <p className="text-sm font-semibold text-cyan-700">{labTestDetails.details}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-cyan-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="text-xs text-gray-600 font-bold mb-2">ROOM NUMBER</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-800">{labTestDetails.roomNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border-2 border-cyan-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-gray-600 font-bold mb-2">STATUS</p>
                <p className="text-sm font-semibold capitalize text-cyan-700">{labTestDetails.status}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescribed Medicines */}
        {prescribedMedicines.length > 0 && (
          <Card className="mb-6 bg-green-50/95 backdrop-blur-sm border-2 border-green-400 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-fade-in-up animation-delay-700">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-green-700">
                💊 Prescribed Medicines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {prescribedMedicines.map((medicine, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${800 + idx * 100}ms`}}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="hover:scale-105 transition-transform duration-300">
                      <p className="text-xs text-gray-600 font-bold mb-1">MEDICINE NAME</p>
                      <p className="text-sm font-semibold text-green-700">{medicine.medicine}</p>
                    </div>
                    <div className="hover:scale-105 transition-transform duration-300">
                      <p className="text-xs text-gray-600 font-bold mb-1">ROUTE</p>
                      <p className="text-sm font-semibold text-green-700">{medicine.route}</p>
                    </div>
                    <div className="hover:scale-105 transition-transform duration-300">
                      <p className="text-xs text-gray-600 font-bold mb-1">DOSE</p>
                      <p className="text-sm font-semibold text-green-700">{medicine.dose}</p>
                    </div>
                    <div className="hover:scale-105 transition-transform duration-300">
                      <p className="text-xs text-gray-600 font-bold mb-1">FREQUENCY</p>
                      <p className="text-sm font-semibold text-green-700">{medicine.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Important Information */}
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-fade-in-up animation-delay-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600">📋 Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <p className="font-semibold text-blue-700"><strong>✓ QR Code:</strong> Keep your QR code visible at all times for quick check-in</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animation-delay-100">
              <p className="font-semibold text-green-700"><strong>✓ Early Arrival:</strong> Arrive 5-10 minutes before your scheduled time</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animation-delay-200">
              <p className="font-semibold text-purple-700"><strong>✓ Real-time Updates:</strong> Wait times update automatically as you navigate</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animation-delay-300">
              <p className="font-semibold text-orange-700"><strong>✓ Assistance:</strong> Ask any staff member if you need help finding your way</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 animate-fade-in-up animation-delay-1000">
          <Button
            onClick={() => router.push("/patient/home")}
            variant="outline"
            className="flex-1 py-6 text-base font-bold border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <span className="relative z-10">Back to Home</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>