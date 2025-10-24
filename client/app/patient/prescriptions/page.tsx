"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPrescriptions } from "@/lib/mock-data"
import PatientHeader from "@/components/patient/patient-header"

export default function PrescriptionsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 animate-pulse">Loading...</div>
    </div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  const patientPrescriptions = mockPrescriptions.filter((p) => p.patientId === (user as any)?.id)

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
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-500 animate-fade-in-up animation-delay-300">
          <CardHeader className="bg-gradient-to-r from-blue-50/80 via-teal-50/80 to-green-50/80 backdrop-blur-sm rounded-t-xl border-b-2 border-transparent" style={{borderImage: "linear-gradient(to right, rgb(37, 99, 235), rgb(20, 184, 166), rgb(34, 197, 94)) 1"}}>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-teal-600 hover:to-green-600 transition-all duration-300">💊 My Prescriptions</CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600 hover:text-teal-600 transition-colors duration-300 font-medium">View all your prescribed medicines</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {patientPrescriptions.length === 0 ? (
              <p className="text-gray-600 text-center text-lg py-8 font-semibold">No prescriptions found</p>
            ) : (
              <div className="space-y-5">
                {patientPrescriptions.map((presc, index) => (
                  <div key={presc.id} className="p-5 border-2 border-white/60 bg-gradient-to-br from-white/90 to-blue-50/30 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-teal-300/50 hover:-translate-y-1 transition-all duration-500 group animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-blue-600 transition-colors duration-300">💊 MEDICINE</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{presc.medicine}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-teal-600 transition-colors duration-300">💉 DOSE</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">{presc.dose}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-green-600 transition-colors duration-300">⏰ FREQUENCY</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">{presc.frequency}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-purple-600 transition-colors duration-300">🚑 ROUTE</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">{presc.route}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-orange-600 transition-colors duration-300">📅 DURATION</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800">{presc.duration}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p className="text-xs text-gray-600 font-bold mb-1 group-hover:text-pink-600 transition-colors duration-300">📝 ADVICE</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-800">{presc.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={() => router.push("/patient/home")} variant="outline" className="w-full mt-8 py-6 text-lg font-bold border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-fade-in-up animation-delay-800">
          <span className="relative z-10">Back to Home</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        </Button>
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
        
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}