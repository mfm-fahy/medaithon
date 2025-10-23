"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"

export default function QRScanner() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanned, setScanned] = useState(false)
  const [disease, setDisease] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (!scanned && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.error("Camera access denied:", err))
    }
  }, [scanned])

  const handleSimulateQRScan = () => {
    setScanned(true)
  }

  const handleDiseaseSubmit = () => {
    if (disease) {
      router.push(`/patient/navigation?disease=${encodeURIComponent(disease)}`)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Scan the QR code on your wristband</CardDescription>
          </CardHeader>
          <CardContent>
            {!scanned ? (
              <div className="space-y-4">
                <div className="bg-black rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <Button onClick={handleSimulateQRScan} className="w-full bg-blue-600 hover:bg-blue-700">
                  Simulate QR Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900">QR Code Scanned Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">Patient ID: {(user as any)?.patientId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">What is your reason for visit?</label>
                  <select
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a reason</option>
                    <option value="General Checkup">General Checkup</option>
                    <option value="Fever">Fever</option>
                    <option value="Cough">Cough</option>
                    <option value="Headache">Headache</option>
                    <option value="Injury">Injury</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Button
                  onClick={handleDiseaseSubmit}
                  disabled={!disease}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continue to Navigation
                </Button>

                <Button onClick={() => setScanned(false)} variant="outline" className="w-full">
                  Scan Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
