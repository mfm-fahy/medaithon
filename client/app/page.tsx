"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import Logo from "@/components/logo"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("hospitalManagement")}</h1>
          <p className="text-lg text-gray-600">{t("selectRole")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Biomedical App */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-400"
            onClick={() => router.push("/biomedical/login")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">🏥 Biomedical</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Equipment & Waste Management</CardDescription>
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Patient */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/patient/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">👤 {t("patient")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("signInOrCreate")}</CardDescription>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Doctor */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/doctor/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">👨‍⚕️ {t("doctor")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("accessPatientRecords")}</CardDescription>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Nurse */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">👩‍⚕️ {t("nurse")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("recordVitals")}</CardDescription>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">⚙️ {t("admin")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("manageStaff")}</CardDescription>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Pharmacist */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/pharmacist/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">💊 {t("pharmacist")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("medicineManagement")}</CardDescription>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Lab Technician */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/lab-technician/signin")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">🧪 {t("labTechnician")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("labTests")}</CardDescription>
              <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">{t("submit")}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
