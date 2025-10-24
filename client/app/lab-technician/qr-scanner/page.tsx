"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import QRScanner from "@/components/qr-scanner"

interface PatientData {
  _id: string
  patientId: string
  userId: {
    name: string
    email: string
  }
  age: number
  sex: string
}

export default function LabTechnicianQRScanner() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, isAuthenticated, loading } = useAuth()
  const [scannedData, setScannedData] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/lab-technician/signin")
      } else if (user?.role !== "labTechnician") {
        router.push("/lab-technician/dashboard")
      }
    }
  }, [loading, isAuthenticated, user?.role, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "labTechnician") {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
  }

  // Fetch patient by QR code (patient ID)
  const fetchPatientByQR = async (patientId: string) => {
    try {
      setScanning(true)
      setError("")
      setMessage("")

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setError("❌ Authentication token not found")
        setScanning(false)
        return
      }

      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Patient not found")
      }

      const data = await response.json()
      setSelectedPatient(data.patient)
      setScannedData(patientId)
      setMessage(`✅ Patient found: ${data.patient.userId.name}`)
      setManualInput("")
    } catch (err) {
      setError(`❌ ${err instanceof Error ? err.message : "Failed to fetch patient"}`)
      setSelectedPatient(null)
      setScannedData("")
    } finally {
      setScanning(false)
    }
  }

  const handleManualScan = () => {
    if (manualInput.trim()) {
      fetchPatientByQR(manualInput.trim())
    } else {
      setError("❌ Please enter a patient ID")
    }
  }

  const handleQRScan = (patientId: string) => {
    setShowScanner(false)
    fetchPatientByQR(patientId)
  }

  const handleProceed = () => {
    if (selectedPatient) {
      router.push(`/lab-technician/tests/${selectedPatient._id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button onClick={() => router.push("/lab-technician/dashboard")} variant="outline" className="mb-6">
          ← {t("back")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>📱 {t("scanPatientQR")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Scanner Component */}
            {showScanner ? (
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
                title="Scan Patient QR Code"
                description="Point camera at patient's QR code or wristband"
              />
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg text-center border-2 border-dashed border-gray-400">
                <p className="text-gray-600 mb-4">🔍 {t("scanPatientWristband")}</p>
                <div className="w-48 h-48 bg-white border-2 border-dashed border-cyan-400 rounded-lg mx-auto flex items-center justify-center flex-col mb-4">
                  <div className="text-3xl mb-2">📱</div>
                  <p className="text-gray-400 text-center">QR Scanner Ready</p>
                </div>
                <Button
                  onClick={() => setShowScanner(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                >
                  📷 Start Camera Scanner
                </Button>
              </div>
            )}

            {/* Manual Input */}
            <div className="space-y-3 border-t pt-4">
              <p className="font-semibold text-sm">Or Enter Patient ID Manually:</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter patient ID (e.g., PAT001)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualScan()}
                  className="flex-1"
                />
                <Button
                  onClick={handleManualScan}
                  disabled={scanning || !manualInput.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {scanning ? "Scanning..." : "Scan"}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}

            {/* Patient Details */}
            {selectedPatient && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                <p className="font-semibold text-blue-900">✓ Patient Details:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Patient ID:</p>
                    <p className="font-medium">{selectedPatient.patientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-medium">{selectedPatient.userId.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age:</p>
                    <p className="font-medium">{selectedPatient.age}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sex:</p>
                    <p className="font-medium capitalize">{selectedPatient.sex}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{selectedPatient.userId.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              disabled={!selectedPatient || scanning}
            >
              {scanning ? "Scanning..." : "Proceed to Tests"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
