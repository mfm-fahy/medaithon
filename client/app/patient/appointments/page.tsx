"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"

export default function AppointmentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  const appointments = [
    { id: 1, type: "Doctor", name: "Dr. Smith", time: "10:30 AM", status: "Scheduled" },
    { id: 2, type: "Lab", name: "Blood Test", time: "11:00 AM", status: "Scheduled" },
  ]

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

      <div className="relative z-10">
        <div className="animate-slideDown">
          <PatientHeader user={user} />
        </div>

        <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeInUp animation-delay-300">
          <Card className="bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 animate-fadeInUp animation-delay-400">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white rounded-t-lg border-b-4 border-gradient-to-r from-blue-700 via-teal-700 to-green-700">
              <CardTitle className="text-3xl font-bold animate-fadeIn">My Appointments</CardTitle>
              <CardDescription className="text-blue-50 text-lg animate-fadeIn animation-delay-200">View your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {appointments.map((apt, index) => (
                  <div 
                    key={apt.id} 
                    className="group relative p-6 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${500 + index * 150}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-500"></div>
                    
                    <div className="relative flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                            {apt.type === "Doctor" ? "👨‍⚕️" : "🧪"}
                          </div>
                          <div>
                            <p className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{apt.type}</p>
                            <p className="text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{apt.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-lg shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                          {apt.time}
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg group-hover:shadow-green-500/50 group-hover:scale-105 transition-all duration-300">
                          ✓ {apt.status}
                        </div>
                      </div>
                    </div>

                    {/* Glowing effect on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => router.push("/patient/home")} 
            variant="outline" 
            className="w-full mt-8 h-14 text-lg font-semibold border-2 border-blue-300 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:via-teal-600 hover:to-green-600 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-500 animate-fadeInUp animation-delay-700"
          >
            ← Back to Home
          </Button>
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
        
        .animation-delay-150 { animation-delay: 0.15s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}