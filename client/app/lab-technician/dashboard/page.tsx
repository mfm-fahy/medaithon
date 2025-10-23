"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import LanguageSwitcher from "@/components/language-switcher"

export default function LabTechnicianDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const [scannedPatientId, setScannedPatientId] = useState("")

  if (!user || user.role !== "labTechnician") {
    router.push("/lab-technician/signin")
    return null
  }

  const handleScanClick = () => {
    router.push("/lab-technician/qr-scanner")
  }

  const handleViewTests = () => {
    if (scannedPatientId) {
      router.push(`/lab-technician/tests/${scannedPatientId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="flex justify-between items-center p-6 bg-white shadow">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("labTechnicianDashboard")}</h1>
          <p className="text-gray-600">Welcome, {user.name}</p>
        </div>
        <div className="flex gap-4">
          <LanguageSwitcher />
          <Button onClick={logout} variant="outline">
            {t("logout")}
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Scanner Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔍 {t("scanPatientQR")}</CardTitle>
              <CardDescription>{t("scanPatientWristband")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleScanClick} className="w-full bg-cyan-600 hover:bg-cyan-700">
                {t("qrCodeScanner")}
              </Button>
            </CardContent>
          </Card>

          {/* Lab Tests Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧬 {t("labTests")}</CardTitle>
              <CardDescription>{t("viewMedicinesPrescribedByDoctors")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  value={scannedPatientId}
                  onChange={(e) => setScannedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <Button
                  onClick={handleViewTests}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  disabled={!scannedPatientId}
                >
                  {t("labTests")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
