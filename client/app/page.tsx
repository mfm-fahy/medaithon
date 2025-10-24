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
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Secondary Glowing Circles */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-2xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-400 rounded-full blur-2xl opacity-10 animate-pulse animation-delay-1000"></div>
      
      {/* Medical Cross Symbols */}
      <div className="absolute top-10 right-40 text-6xl text-blue-200 opacity-30 animate-float">+</div>
      <div className="absolute bottom-20 right-60 text-5xl text-teal-200 opacity-30 animate-float animation-delay-1000">+</div>
      <div className="absolute top-1/3 left-20 text-7xl text-green-200 opacity-30 animate-float animation-delay-2000">+</div>
      <div className="absolute bottom-40 left-1/2 text-6xl text-cyan-200 opacity-30 animate-float animation-delay-3000">+</div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-12 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border-b-4 border-gradient-to-r from-blue-600 via-teal-600 to-green-600 animate-slideDown">
          <Logo />
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-16 animate-fadeIn animation-delay-300">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 animate-pulse-slow">{t("hospitalManagement")}</h1>
          <p className="text-xl text-gray-700 font-medium">{t("selectRole")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Patient */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-300"
            onClick={() => router.push("/patient/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">👤 {t("patient")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("signInOrCreate")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Doctor */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-400"
            onClick={() => router.push("/doctor/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">👨‍⚕️ {t("doctor")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("accessPatientRecords")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Nurse */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-500"
            onClick={() => router.push("/nurse/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">👩‍⚕️ {t("nurse")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("recordVitals")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-600"
            onClick={() => router.push("/admin/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">⚙️ {t("admin")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("manageStaff")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Pharmacist */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-700"
            onClick={() => router.push("/pharmacist/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">💊 {t("pharmacist")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("medicineManagement")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>

          {/* Lab Technician */}
          <Card
            className="group relative bg-white/95 backdrop-blur-sm border-2 border-white/60 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer animate-fadeInUp animation-delay-800"
            onClick={() => router.push("/lab-technician/signin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-teal-500/10 rounded-lg transition-all duration-500"></div>
            <CardHeader className="relative">
              <CardTitle className="text-3xl group-hover:scale-110 transition-transform duration-300">🧪 {t("labTechnician")}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base">{t("labTests")}</CardDescription>
              <Button className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-white font-semibold group-hover:animate-shine">{t("submit")}</Button>
            </CardContent>
          </Card>
        </div>
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
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .group-hover\\:animate-shine:hover {
          background-size: 200% auto;
          animation: shine 2s linear infinite;
        }
        
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
      `}</style>
    </div>
  )
}