"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"
import PatientNavigation from "@/components/patient/patient-navigation"
import QRCodeDisplay from "@/components/patient/qr-code-display"
import VisitForm from "@/components/patient/visit-form"
import ChatbotFloatingButton from "@/components/patient/chatbot-floating-button"

export default function PatientHome() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [visitScheduled, setVisitScheduled] = useState(false)
  const [latestTriageColor, setLatestTriageColor] = useState<string | null>(null)
  const [loadingTriage, setLoadingTriage] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && (user as any)?.patientId) {
      fetchLatestTriageColor()
    }
  }, [isAuthenticated, user])

  const fetchLatestTriageColor = async () => {
    setLoadingTriage(true)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:5000/api/patients/${(user as any)?.patientId}/vitals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const vitals = await response.json()
        if (vitals.length > 0) {
          const latest = vitals[0]
          setLatestTriageColor(latest.triageColor || null)
        }
      }
    } catch (error) {
      console.error("Error fetching triage color:", error)
    } finally {
      setLoadingTriage(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-teal-400 rounded-full animate-spin animation-delay-150"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-green-400 rounded-full animate-spin animation-delay-300"></div>
      </div>
    </div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Secondary Glowing Circles */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-2xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-400 rounded-full blur-2xl opacity-10 animate-pulse animation-delay-1000"></div>
      
      {/* Medical Cross Symbols */}
      <div className="absolute top-20 right-40 text-6xl text-blue-200 opacity-20 animate-float">+</div>
      <div className="absolute bottom-32 right-60 text-5xl text-teal-200 opacity-20 animate-float animation-delay-1000">+</div>
      <div className="absolute top-1/3 left-20 text-7xl text-green-200 opacity-20 animate-float animation-delay-2000">+</div>
      <div className="absolute bottom-20 right-1/4 text-6xl text-cyan-200 opacity-20 animate-float animation-delay-3000">+</div>

      <div className="relative z-10">
        <div className="animate-slideDown">
          <PatientHeader user={user} />
        </div>

        {/* Chatbot Floating Button */}
        {(user as any)?.patientId && (
          <ChatbotFloatingButton
            patientId={(user as any).patientId}
            token={localStorage.getItem("auth_token") || ""}
          />
        )}

        <main className="max-w-7xl mx-auto p-4 md:p-8">
          {/* QR Code Section */}
          {(user as any)?.patientId && (
            <div className="mb-10 animate-fadeInUp animation-delay-300">
              <QRCodeDisplay patientId={(user as any).patientId} patientName={user?.name} showDownload={true} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Quick Actions */}
            <Card className="md:col-span-2 bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 animate-fadeInUp animation-delay-400">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white rounded-t-lg border-b-4 border-gradient-to-r from-blue-700 via-teal-700 to-green-700">
                <CardTitle className="text-2xl font-bold">⚡ Quick Actions</CardTitle>
                <CardDescription className="text-blue-50">Access your medical information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-5 p-8">
                <Button
                  onClick={() => router.push("/patient/queue")}
                  className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-24 text-lg font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">🔄 Queue Status</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Button>
                <Button
                  onClick={() => router.push("/patient/appointments")}
                  className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-24 text-lg font-semibold shadow-lg hover:shadow-green-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">📅 View Appointments</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Button>
                <Button
                  onClick={() => router.push("/patient/prescriptions")}
                  className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-24 text-lg font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">💊 My Prescriptions</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Button>
                <Button
                  onClick={() => router.push("/patient/lab-reports")}
                  className="group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 h-24 text-lg font-semibold shadow-lg hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">🧪 Lab Reports</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Button>
                <Button
                  onClick={() => router.push("/patient/navigation")}
                  className="group relative bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 h-24 text-lg font-semibold shadow-lg hover:shadow-indigo-500/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden col-span-2"
                >
                  <span className="relative z-10">📋 Medical Records</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Button>
              </CardContent>
            </Card>

            {/* Patient Info */}
            <Card className="bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-500 animate-fadeInUp animation-delay-500">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold">👤 Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-base">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <span className="font-bold text-gray-700">Name:</span> 
                  <span className="ml-2 text-gray-900">{user?.name}</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <span className="font-bold text-gray-700">Patient ID:</span> 
                  <span className="ml-2 text-gray-900">{(user as any)?.patientId}</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <span className="font-bold text-gray-700">Age:</span> 
                  <span className="ml-2 text-gray-900">{(user as any)?.age}</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-500 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <span className="font-bold text-gray-700">Phone:</span> 
                  <span className="ml-2 text-gray-900">{(user as any)?.phone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Triage Status Card */}
          {latestTriageColor && (
            <div className="mb-10 animate-fadeInUp animation-delay-600">
              <Card className="bg-white/95 backdrop-blur-md border-4 shadow-2xl hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]" style={{
                borderColor: latestTriageColor === "red" ? "#ef4444" : 
                            latestTriageColor === "yellow" ? "#eab308" : 
                            latestTriageColor === "green" ? "#22c55e" : "#3b82f6"
              }}>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2" style={{
                  borderBottomColor: latestTriageColor === "red" ? "#ef4444" : 
                                    latestTriageColor === "yellow" ? "#eab308" : 
                                    latestTriageColor === "green" ? "#22c55e" : "#3b82f6"
                }}>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                    🎯 Your Triage Status
                  </CardTitle>
                  <CardDescription className="text-base">Latest vital assessment</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl animate-pulse-slow ${
                        latestTriageColor === "red"
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50"
                          : latestTriageColor === "yellow"
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 shadow-yellow-500/50"
                          : latestTriageColor === "green"
                          ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/50"
                          : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/50"
                      }`}
                    >
                      {latestTriageColor.toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-base text-gray-600 font-semibold">Priority Level:</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {latestTriageColor === "red"
                          ? "🔴 Critical - Immediate Attention"
                          : latestTriageColor === "yellow"
                          ? "🟡 Urgent - High Priority"
                          : latestTriageColor === "green"
                          ? "🟢 Non-Urgent - Routine Care"
                          : "🔵 Semi-Urgent - Moderate Priority"}
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        Based on your latest vital signs recorded by the nurse
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Visit Form Section */}
          <div className="mb-10 animate-fadeInUp animation-delay-700">
            <VisitForm
              patientId={(user as any)?.patientId}
              onSuccess={() => setVisitScheduled(true)}
            />
          </div>

          <div className="animate-fadeInUp animation-delay-800">
            <PatientNavigation visitScheduled={visitScheduled} />
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .animation-delay-150 { animation-delay: 0.15s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}