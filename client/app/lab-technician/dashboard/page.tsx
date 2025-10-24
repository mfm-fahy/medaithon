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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20 animate-blob-delayed-2"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob-delayed-4"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-300 rounded-full blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full blur-2xl opacity-15 animate-pulse"></div>
        
        {/* Medical cross symbols */}
        <div className="absolute top-32 left-1/4 text-blue-200 text-6xl opacity-10 font-light">+</div>
        <div className="absolute top-2/3 right-1/3 text-teal-200 text-8xl opacity-10 font-light">+</div>
        <div className="absolute bottom-1/3 left-1/2 text-green-200 text-5xl opacity-10 font-light">+</div>
        <div className="absolute top-1/4 right-1/4 text-cyan-200 text-7xl opacity-10 font-light">+</div>
      </div>

      <div className="relative z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-gradient animate-slide-down">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              🧬
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">{t("labTechnicianDashboard")}</h1>
          </div>
          <p className="text-gray-600 ml-15">Welcome, <span className="font-semibold text-teal-600">{user.name}</span></p>
        </div>
        <div className="flex gap-4 animate-fade-in-up-delay-300">
          <LanguageSwitcher />
          <Button onClick={logout} variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300">
            {t("logout")}
          </Button>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Scanner Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in-up-delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">🔍 {t("scanPatientQR")}</CardTitle>
              <CardDescription className="text-gray-600">{t("scanPatientWristband")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleScanClick} className="w-full bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-2xl text-white font-semibold py-6 relative overflow-hidden group">
                <span className="relative z-10">{t("qrCodeScanner")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </CardContent>
          </Card>

          {/* Lab Tests Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in-up-delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">🧬 {t("labTests")}</CardTitle>
              <CardDescription className="text-gray-600">{t("viewMedicinesPrescribedByDoctors")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  value={scannedPatientId}
                  onChange={(e) => setScannedPatientId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5"
                />
                <Button
                  onClick={handleViewTests}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-2xl text-white font-semibold py-6 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={!scannedPatientId}
                >
                  <span className="relative z-10">{t("labTests")}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }

        .animate-blob-delayed-2 {
          animation: blob 7s infinite ease-in-out 2s;
        }

        .animate-blob-delayed-4 {
          animation: blob 7s infinite ease-in-out 4s;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .animate-fade-in-up-delay-300 {
          animation: fadeInUp 0.6s ease-out 0.3s backwards;
        }

        .animate-fade-in-up-delay-400 {
          animation: fadeInUp 0.6s ease-out 0.4s backwards;
        }

        .animate-fade-in-up-delay-500 {
          animation: fadeInUp 0.6s ease-out 0.5s backwards;
        }

        .border-gradient {
          border-image: linear-gradient(to right, #2563eb, #0d9488, #16a34a) 1;
        }
      `}</style>
    </div>
  )
}