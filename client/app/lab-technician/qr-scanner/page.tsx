"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"

export default function LabTechnicianQRScanner() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [scannedData, setScannedData] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  if (!user || user.role !== "labTechnician") {
    router.push("/lab-technician/signin")
    return null
  }

  const mockPatients = [
    { id: "P001", name: "John Doe" },
    { id: "P002", name: "Jane Smith" },
  ]

  const handleSimulateScan = (patientId: string) => {
    setSelectedPatient(patientId)
    setScannedData(patientId)
  }

  const handleProceed = () => {
    if (selectedPatient) {
      router.push(`/lab-technician/tests/${selectedPatient}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button onClick={() => router.push("/lab-technician/dashboard")} variant="outline" className="mb-6">
          {t("back")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t("scanPatientQR")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">{t("scanPatientWristband")}</p>
              <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-400 rounded-lg mx-auto flex items-center justify-center">
                <p className="text-gray-400">📱 QR Scanner</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Simulate QR Scan:</p>
              <div className="grid grid-cols-2 gap-2">
                {mockPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    onClick={() => handleSimulateScan(patient.id)}
                    variant={selectedPatient === patient.id ? "default" : "outline"}
                    className={selectedPatient === patient.id ? "bg-cyan-600" : ""}
                  >
                    {patient.name} ({patient.id})
                  </Button>
                ))}
              </div>
            </div>

            {scannedData && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800">✓ Patient ID Scanned: {scannedData}</p>
              </div>
            )}

            <Button
              onClick={handleProceed}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              disabled={!selectedPatient}
            >
              {t("submit")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
