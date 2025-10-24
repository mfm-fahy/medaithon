"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPatients, mockDoctors, mockNurses } from "@/lib/mock-data"
import AdminHeader from "@/components/admin/admin-header"
import DiseaseMonitor from "@/components/admin/disease-monitor"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-600 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Advanced Glowing Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Primary glowing orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Secondary glowing elements */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>

        {/* Medical cross patterns */}
        <div className="absolute top-1/4 right-1/3 text-blue-200/10 text-9xl animate-pulse">+</div>
        <div className="absolute bottom-1/3 left-1/4 text-green-200/10 text-9xl animate-pulse animation-delay-2000">+</div>
      </div>

      {/* Animated Header Wrapper */}
      <div className="relative z-20 animate-in slide-in-from-top-8 fade-in duration-1000">
        <div className="backdrop-blur-md bg-white/80 shadow-xl border-b-4 border-gradient-to-r from-blue-400 via-teal-400 to-green-400">
          <AdminHeader user={user} />
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Patients Card */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 hover:shadow-blue-400/30 transition-all duration-700 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <CardContent className="pt-6 relative z-10">
              <p className="text-sm text-gray-600 font-semibold">{t("totalPatients")}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{mockPatients.length}</p>
            </CardContent>
          </Card>

          {/* Total Doctors Card */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 hover:shadow-green-400/30 transition-all duration-700 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <CardContent className="pt-6 relative z-10">
              <p className="text-sm text-gray-600 font-semibold">{t("totalDoctors")}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{mockDoctors.length}</p>
            </CardContent>
          </Card>

          {/* Total Nurses Card */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 hover:shadow-purple-400/30 transition-all duration-700 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <CardContent className="pt-6 relative z-10">
              <p className="text-sm text-gray-600 font-semibold">{t("totalNurses")}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{mockNurses.length}</p>
            </CardContent>
          </Card>

          {/* Total Staff Card */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 hover:shadow-orange-400/30 transition-all duration-700 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <CardContent className="pt-6 relative z-10">
              <p className="text-sm text-gray-600 font-semibold">{t("totalStaff")}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{mockDoctors.length + mockNurses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctors Management */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 hover:shadow-green-400/30 transition-all duration-700 hover:scale-[1.01] animate-in fade-in slide-in-from-left-8 duration-1000 delay-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

            <CardHeader className="border-b border-gradient-to-r from-green-200/50 via-teal-200/50 to-blue-200/50 relative z-10">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">{t("doctors")}</CardTitle>
              <CardDescription className="text-gray-600">{t("manageDoctorAccounts")}</CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="space-y-3 mb-4">
                {mockDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 border-2 border-green-200/50 rounded-lg bg-gradient-to-r from-green-50/50 to-teal-50/50 hover:from-green-100/50 hover:to-teal-100/50 transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-300/30">
                    <p className="font-semibold text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.designation}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/admin/add-doctor")}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 via-teal-500 to-green-600 hover:from-green-600 hover:via-teal-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl hover:shadow-green-400/60 transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 border-green-300/50 hover:border-green-200 overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="animate-pulse">+</span>
                  {t("addNewDoctor")}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </CardContent>
          </Card>

          {/* Nurses Management */}
          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 hover:shadow-purple-400/30 transition-all duration-700 hover:scale-[1.01] animate-in fade-in slide-in-from-right-8 duration-1000 delay-600 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

            <CardHeader className="border-b border-gradient-to-r from-purple-200/50 via-pink-200/50 to-purple-200/50 relative z-10">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">{t("nurses")}</CardTitle>
              <CardDescription className="text-gray-600">{t("manageNurseAccounts")}</CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="space-y-3 mb-4">
                {mockNurses.map((nurse) => (
                  <div key={nurse.id} className="p-3 border-2 border-purple-200/50 rounded-lg bg-gradient-to-r from-purple-50/50 to-pink-50/50 hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-300/30">
                    <p className="font-semibold text-gray-800">{nurse.name}</p>
                    <p className="text-sm text-gray-600">{nurse.department || "General"}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/admin/add-nurse")}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 hover:from-purple-600 hover:via-pink-450 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl hover:shadow-purple-400/60 transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 border-purple-300/50 hover:border-purple-200 overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="animate-pulse">+</span>
                  {t("addNewNurse")}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </CardContent>
          </Card>
        </div>

        <DiseaseMonitor />
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}