"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NurseHeader from "@/components/nurse/nurse-header"
import QRScanner from "@/components/qr-scanner"
import { AlertCircle, CheckCircle } from "lucide-react"

interface PatientData {
  _id: string
  patientId: string
  userId: { name: string; email: string }
  age: number
  sex: string
  phone: string
  medicalHistory?: string
}

export default function NurseQRScanner() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [scannedPatient, setScannedPatient] = useState<PatientData | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loadingPatient, setLoadingPatient] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  const handleQRScan = async (patientId: string) => {
    console.log("🔵 QR Code scanned:", patientId)
    setError("")
    setSuccess("")
    setLoadingPatient(true)

    try {
      const token = localStorage.getItem("auth_token")
      console.log("📝 Fetching patient data for:", patientId)

      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("📊 Response status:", response.status)

      if (!response.ok) {
        throw new Error("Patient not found")
      }

      const data = await response.json()
      console.log("✅ Patient data received:", data)

      if (!data.patient) {
        throw new Error("Invalid patient data received")
      }

      const patientName = data.patient.userId?.name || "Unknown Patient"
      setScannedPatient(data.patient)
      setShowScanner(false)
      setSuccess(`Patient found: ${patientName}`)
    } catch (err) {
      console.error("❌ Error scanning patient:", err)
      setError(err instanceof Error ? err.message : "Error scanning patient")
    } finally {
      setLoadingPatient(false)
    }
  }

  const handleViewDetails = () => {
    if (scannedPatient) {
      router.push(`/nurse/vitals?patientId=${scannedPatient.patientId}`)
    }
  }

  const handleScanAgain = () => {
    setScannedPatient(null)
    setShowScanner(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "nurse") {
    return null
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div>
            {showScanner ? (
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
                title="Scan Patient QR Code"
                description="Point camera at patient's wristband QR code"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Scanner</CardTitle>
                  <CardDescription>Scan patient wristband QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Start Scanning
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Patient Details Section */}
          <div>
            {scannedPatient ? (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Details</CardTitle>
                  <CardDescription>Scanned patient information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{scannedPatient.userId?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patient ID</p>
                      <p className="font-medium">{scannedPatient.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-medium">{scannedPatient.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sex</p>
                      <p className="font-medium capitalize">{scannedPatient.sex}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{scannedPatient.userId?.email || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{scannedPatient.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      onClick={handleViewDetails}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loadingPatient}
                    >
                      Update Vitals & View History
                    </Button>
                    <Button
                      onClick={handleScanAgain}
                      variant="outline"
                      className="w-full"
                      disabled={loadingPatient}
                    >
                      Scan Another Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Scan a patient QR code to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
