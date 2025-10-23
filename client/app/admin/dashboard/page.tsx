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
    return <div className="flex items-center justify-center min-h-screen">{t("loading")}</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{t("totalPatients")}</p>
              <p className="text-3xl font-bold text-blue-600">{mockPatients.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{t("totalDoctors")}</p>
              <p className="text-3xl font-bold text-green-600">{mockDoctors.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{t("totalNurses")}</p>
              <p className="text-3xl font-bold text-purple-600">{mockNurses.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{t("totalStaff")}</p>
              <p className="text-3xl font-bold text-orange-600">{mockDoctors.length + mockNurses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctors Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t("doctors")}</CardTitle>
              <CardDescription>{t("manageDoctorAccounts")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {mockDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.designation}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/admin/add-doctor")}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t("addNewDoctor")}
              </button>
            </CardContent>
          </Card>

          {/* Nurses Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t("nurses")}</CardTitle>
              <CardDescription>{t("manageNurseAccounts")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {mockNurses.map((nurse) => (
                  <div key={nurse.id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{nurse.name}</p>
                    <p className="text-sm text-gray-600">{nurse.department || "General"}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/admin/add-nurse")}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {t("addNewNurse")}
              </button>
            </CardContent>
          </Card>
        </div>

        <DiseaseMonitor />
      </main>
    </div>
  )
}
