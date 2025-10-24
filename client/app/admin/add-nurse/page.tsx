"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminHeader from "@/components/admin/admin-header"

export default function AddNursePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    department: "",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/signin")
    }
  }, [isAuthenticated, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Nurse added successfully!")
    router.push("/admin/dashboard")
  }

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

      <main className="max-w-2xl mx-auto p-4 md:p-6 relative z-10">
        <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 hover:shadow-blue-400/30 transition-all duration-700 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 duration-1000 relative overflow-hidden group">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-teal-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
          
          <CardHeader className="space-y-1 pb-6 border-b border-gradient-to-r from-blue-200/50 via-teal-200/50 to-green-200/50 relative z-10">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-1000">
              Add New Nurse
            </CardTitle>
            <CardDescription className="text-base text-gray-600 animate-in fade-in delay-200 duration-1000">
              Create a new nurse account for the hospital system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Animated Input: Full Name */}
              <div className="group animate-in fade-in slide-in-from-left-6 duration-1000 delay-300 relative">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-blue-600 transition-all duration-300 transform group-hover:translate-x-1">
                  <span className="inline-block">Full Name</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter nurse's full name"
                    required
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-500 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-300/50 bg-white/90 backdrop-blur-sm relative z-10 transform hover:translate-y-[-2px] focus:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md blur-sm"></div>
                </div>
              </div>

              {/* Animated Input: Username */}
              <div className="group animate-in fade-in slide-in-from-right-6 duration-1000 delay-400 relative">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-teal-600 transition-all duration-300 transform group-hover:translate-x-1">
                  <span className="inline-block">Username</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    className="border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 transition-all duration-500 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-300/50 bg-white/90 backdrop-blur-sm relative z-10 transform hover:translate-y-[-2px] focus:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/20 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md blur-sm"></div>
                </div>
              </div>

              {/* Animated Input: Password */}
              <div className="group animate-in fade-in slide-in-from-left-6 duration-1000 delay-500 relative">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-green-600 transition-all duration-300 transform group-hover:translate-x-1">
                  <span className="inline-block">Password</span>
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-500 hover:border-green-400 hover:shadow-xl hover:shadow-green-300/50 bg-white/90 backdrop-blur-sm relative z-10 transform hover:translate-y-[-2px] focus:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md blur-sm"></div>
                </div>
              </div>

              {/* Animated Input: Department */}
              <div className="group animate-in fade-in slide-in-from-right-6 duration-1000 delay-600 relative">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-purple-600 transition-all duration-300 transform group-hover:translate-x-1">
                  <span className="inline-block">Department</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., General Ward"
                    className="border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-500 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-300/50 bg-white/90 backdrop-blur-sm relative z-10 transform hover:translate-y-[-2px] focus:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md blur-sm"></div>
                </div>
              </div>

              {/* Animated Buttons */}
              <div className="flex gap-4 pt-4 animate-in fade-in zoom-in duration-1000 delay-700">
                <Button 
                  type="submit" 
                  className="flex-1 relative bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 hover:from-purple-600 hover:via-pink-450 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-400/60 transition-all duration-500 hover:scale-110 active:scale-95 border-2 border-purple-300/50 hover:border-purple-200 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="animate-pulse">+</span>
                    Add Nurse
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-white/10 blur-2xl group-hover:bg-white/30 transition-all duration-500"></div>
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                  className="flex-1 relative border-2 border-gray-300 hover:border-blue-500 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 hover:text-blue-700 font-bold shadow-lg hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden group"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Floating animated medical symbols */}
        <div className="absolute top-0 right-0 text-blue-300/20 text-7xl font-bold animate-bounce">+</div>
        <div className="absolute bottom-0 left-0 text-green-300/20 text-7xl font-bold animate-bounce animation-delay-1000">+</div>
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