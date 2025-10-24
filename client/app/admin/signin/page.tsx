"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminSignIn() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      router.push("/admin/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20 animate-blob-delayed-2"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob-delayed-4"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-300 rounded-full blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full blur-2xl opacity-15 animate-pulse"></div>
        
        {/* Medical cross symbols */}
        <div className="absolute top-32 left-1/4 text-blue-200 text-6xl opacity-10 font-light">+</div>
        <div className="absolute top-2/3 right-1/3 text-teal-200 text-8xl opacity-10 font-light">+</div>
        <div className="absolute bottom-1/3 left-1/2 text-green-200 text-5xl opacity-10 font-light">+</div>
        <div className="absolute top-1/4 right-1/4 text-cyan-200 text-7xl opacity-10 font-light">+</div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
        <CardHeader className="animate-fade-in-up-delay-300">
          
          <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent font-bold">
            Admin Sign In
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-in-up-delay-400">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>

            <div className="animate-fade-in-up-delay-500">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>

            {error && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">{error}</div>}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-2xl text-white font-semibold py-6 relative overflow-hidden group animate-fade-in-up-delay-600" 
              disabled={loading}
            >
              <span className="relative z-10">{loading ? "Signing in..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
          </form>

          <div className="mt-6 text-center animate-fade-in-up-delay-700">
            <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
              Demo credentials: username: <strong className="text-blue-600">admin</strong>, password: <strong className="text-teal-600">admin123</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }

        .animate-blob-delayed-2 {
          animation: blob 7s infinite ease-in-out 2s;
        }

        .animate-blob-delayed-4 {
          animation: blob 7s infinite ease-in-out 4s;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .animate-fade-in-up-delay-300 {
          animation: fadeInUp 0.6s ease-out 0.3s backwards;
        }

        .animate-fade-in-up-delay-400 {
          animation: fadeInUp 0.6s ease-out 0.4s backwards;
        }

        .animate-fade-in-up-delay-500 {
          animation: fadeInUp 0.6s ease-out 0.5s backwards;
        }

        .animate-fade-in-up-delay-600 {
          animation: fadeInUp 0.6s ease-out 0.6s backwards;
        }

        .animate-fade-in-up-delay-700 {
          animation: fadeInUp 0.6s ease-out 0.7s backwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}