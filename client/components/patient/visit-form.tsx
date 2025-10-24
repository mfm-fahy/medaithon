"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, MapPin, Clock, DoorOpen } from "lucide-react"
import PaymentModal from "./payment-modal"

interface VisitFormProps {
  patientId: string
  onSuccess?: () => void
}

interface HospitalNavigation {
  roomNumber: string
  floor: string
  department: string
  directions: string
  estimatedWaitTime: number
  status: string
}

export default function VisitForm({ patientId, onSuccess }: VisitFormProps) {
  const router = useRouter()
  const [visitType, setVisitType] = useState<"new" | "follow-up" | "">("")
  const [symptoms, setSymptoms] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("OP Nurse")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hospitalNavigation, setHospitalNavigation] = useState<HospitalNavigation | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<{ method: string; transactionId: string } | null>(null)
  const [pendingVisitData, setPendingVisitData] = useState<any>(null)

  // Setup WebSocket connection (optional - for real-time updates)
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//localhost:5000`

    try {
      console.log('🔌 Attempting WebSocket connection:', wsUrl)
      const websocket = new WebSocket(wsUrl)

      websocket.onopen = () => {
        console.log('✅ WebSocket connected')
        // Register patient for real-time updates
        websocket.send(JSON.stringify({
          type: 'register',
          patientId: patientId,
        }))
      }

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'navigation-update') {
            setHospitalNavigation(data.data)
          } else if (data.type === 'wait-time-update') {
            setHospitalNavigation(prev => prev ? {
              ...prev,
              estimatedWaitTime: data.estimatedWaitTime,
            } : null)
          }
        } catch (parseError) {
          console.warn('Failed to parse WebSocket message:', parseError)
        }
      }

      websocket.onerror = (error) => {
        console.warn('⚠️ WebSocket error (non-critical):', error)
        // WebSocket errors are non-critical - payment flow still works
      }

      websocket.onclose = () => {
        console.log('ℹ️ WebSocket closed')
      }

      setWs(websocket)

      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close()
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to connect WebSocket (non-critical):', error)
      // WebSocket connection failure is non-critical - payment flow still works
    }
  }, [patientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!visitType) {
      setError("Please select visit type")
      return
    }

    if (!symptoms.trim()) {
      setError("Please describe what you are suffering from")
      return
    }

    // Store visit data and show payment modal
    setPendingVisitData({
      visitType,
      symptoms,
      description,
      department,
    })
    setShowPayment(true)
  }

  const handlePaymentComplete = async (paymentMethod: string, transactionId: string) => {
    setShowPayment(false)
    setLoading(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const response = await fetch("http://localhost:5000/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...pendingVisitData,
          paymentMethod,
          transactionId,
          paymentStatus: paymentMethod === "cash" ? "pending" : "completed",
          amount: 200,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create visit")
      }

      const responseData = await response.json()

      // Set hospital navigation from response
      if (responseData.hospitalNavigation) {
        setHospitalNavigation(responseData.hospitalNavigation)
      }

      setPaymentData({ method: paymentMethod, transactionId })
      setSuccess(true)
      setVisitType("")
      setSymptoms("")
      setDescription("")
      setPendingVisitData(null)

      // Call onSuccess callback immediately to update navigation
      if (onSuccess) {
        onSuccess()
      }

      // Navigate to navigation page after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        router.push("/patient/navigation")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setPendingVisitData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Visit</CardTitle>
          <CardDescription>Tell us about your visit and what you're experiencing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Are you visiting for:</label>
              <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisitType("new")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  visitType === "new"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-sm">New Visit</div>
                <div className="text-xs text-gray-600">First time consultation</div>
              </button>
              <button
                type="button"
                onClick={() => setVisitType("follow-up")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  visitType === "follow-up"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-sm">Follow-up Visit</div>
                <div className="text-xs text-gray-600">Continuing treatment</div>
              </button>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">
              Select Department *
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="OP Nurse">OP Nurse</option>
              <option value="Emergency">Emergency</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Radiology">Radiology</option>
            </select>
          </div>

          {/* Symptoms Input */}
          <div className="space-y-2">
            <label htmlFor="symptoms" className="text-sm font-medium">
              What are you suffering from? *
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms or health concerns..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              disabled={!visitType || loading}
            />
            <p className="text-xs text-gray-500">
              {symptoms.length}/500 characters
            </p>
          </div>

          {/* Additional Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Additional Details (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional information that might help the doctor..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
              disabled={!visitType || loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">Visit scheduled successfully! A doctor will review your case soon.</p>
            </div>
          )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !visitType || !symptoms.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base"
            >
              {loading ? "Scheduling..." : "Schedule Visit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Hospital Navigation Display */}
      {hospitalNavigation && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">🏥 Your Hospital Navigation</CardTitle>
            <CardDescription>Real-time directions to your appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Room Number */}
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <DoorOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Room Number</p>
                  <p className="text-lg font-bold text-blue-600">{hospitalNavigation.roomNumber}</p>
                </div>
              </div>

              {/* Floor & Department */}
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="text-sm font-semibold">{hospitalNavigation.floor}</p>
                  <p className="text-xs text-gray-600">{hospitalNavigation.department}</p>
                </div>
              </div>

              {/* Wait Time */}
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Estimated Wait Time</p>
                  <p className="text-lg font-bold text-orange-600">{hospitalNavigation.estimatedWaitTime} min</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-sm font-semibold capitalize text-green-600">{hospitalNavigation.status}</p>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm font-semibold mb-2">📍 Directions:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{hospitalNavigation.directions}</p>
            </div>

            {/* Real-time Update Notice */}
            <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-xs text-blue-700">
                ℹ️ This information updates in real-time. Your wait time may change based on current hospital status.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        amount={200}
        onPaymentComplete={handlePaymentComplete}
        onClose={() => {
          setShowPayment(false)
          setPendingVisitData(null)
        }}
      />
    </div>
  )
}

