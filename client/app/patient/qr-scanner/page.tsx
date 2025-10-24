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

      <main className="max-w-2xl mx-auto p-4 md:p-6 relative z-10">
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-500 animate-fade-in-up animation-delay-300">
          <CardHeader className="bg-gradient-to-r from-blue-50/80 via-teal-50/80 to-green-50/80 backdrop-blur-sm rounded-t-xl border-b-2 border-transparent" style={{borderImage: "linear-gradient(to right, rgb(37, 99, 235), rgb(20, 184, 166), rgb(34, 197, 94)) 1"}}>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-teal-600 hover:to-green-600 transition-all duration-300 flex items-center gap-2">
              📱 QR Code Scanner
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600 hover:text-teal-600 transition-colors duration-300 font-medium">Scan the QR code on your wristband</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!scanned ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-2xl border-4 border-blue-300/50 hover:border-teal-300/70 transition-all duration-500 relative group animate-fade-in-up animation-delay-400">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Scanner overlay effect */}
                  <div className="absolute inset-0 border-4 border-blue-400/30 rounded-2xl animate-pulse pointer-events-none"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-scan"></div>
                </div>
                <Button onClick={handleSimulateQRScan} className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group shadow-xl animate-fade-in-up animation-delay-500">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    📸 Simulate QR Scan
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-400">
                  <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 flex items-center gap-2">
                    ✅ QR Code Scanned Successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-2 font-semibold flex items-center gap-2">
                    👤 Patient ID: <span className="font-bold text-green-900">{(user as any)?.patientId}</span>
                  </p>
                </div>

                <div className="animate-fade-in-up animation-delay-500">
                  <label className="block text-base font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    🏥 What is your reason for visit?
                  </label>
                  <select
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base font-medium bg-white/90 backdrop-blur-sm shadow-md hover:border-teal-400 hover:shadow-xl hover:-translate-y-1 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select a reason</option>
                    <option value="General Checkup">🩺 General Checkup</option>
                    <option value="Fever">🌡️ Fever</option>
                    <option value="Cough">🤧 Cough</option>
                    <option value="Headache">🤕 Headache</option>
                    <option value="Injury">🩹 Injury</option>
                    <option value="Other">📋 Other</option>
                  </select>
                </div>

                <Button
                  onClick={handleDiseaseSubmit}
                  disabled={!disease}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group shadow-xl animate-fade-in-up animation-delay-600"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🚀 Continue to Navigation
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </Button>

                <Button onClick={() => setScanned(false)} variant="outline" className="w-full py-6 text-lg font-bold border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-fade-in-up animation-delay-700">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🔄 Scan Again
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes slideInTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-slide-in-top {
          animation: slideInTop 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}