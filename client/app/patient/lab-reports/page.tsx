"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLabReports } from "@/lib/mock-data"
import PatientHeader from "@/components/patient/patient-header"

export default function LabReportsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 animate-pulse">Loading...</div>
    </div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  const patientReports = mockLabReports.filter((r) => r.patientId === (user as any)?.id)

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

      {/* Header with slide-in animation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-lg border-b-2 border-transparent bg-clip-padding animate-slide-in-top" style={{borderImage: "linear-gradient(to right, rgb(37, 99, 235), rgb(20, 184, 166), rgb(34, 197, 94)) 1"}}>
        <PatientHeader />
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Title Section with fade and slide */}
        <div className="mb-8 text-center animate-fade-in-up animation-delay-300">
          <h1 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:scale-105 transition-transform duration-300">
            Lab Reports
          </h1>
          <p className="text-gray-600 text-lg hover:text-teal-600 transition-colors duration-300">
            View your laboratory test results
          </p>
        </div>

        {/* Reports Section */}
        <div className="space-y-6">
          {patientReports.length === 0 ? (
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-400">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 text-lg">No lab reports found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {patientReports.map((report, index) => (
                <Card 
                  key={report.id} 
                  className="bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.03] hover:border-teal-300/50 transition-all duration-500 group cursor-pointer animate-fade-in-up"
                  style={{animationDelay: `${500 + index * 100}ms`}}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 group-hover:from-teal-600 group-hover:to-green-600 transition-all duration-300">
                        {report.testName}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform">
                        {new Date(report.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${
                        report.status === "completed" 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600" 
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                      }`}>
                        {report.status === "completed" ? "Completed" : "Pending"}
                      </span>
                      <span className="text-lg font-semibold text-gray-700 group-hover:text-teal-600 transition-colors duration-300 hover:scale-105 transform">
                        {report.result}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Back Button with shine effect */}
        <div className="mt-8 animate-fade-in-up animation-delay-700">
          <Button 
            onClick={() => router.push("/patient/home")} 
            variant="outline" 
            className="w-full py-6 text-lg font-semibold border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <span className="relative z-10">Back to Home</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          </Button>
        </div>
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
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}