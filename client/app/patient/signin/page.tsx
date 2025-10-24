"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function PatientSignIn() {
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
      router.push("/patient/home")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large Blue-Cyan Orb */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
        
        {/* Large Green-Emerald Orb */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Large Teal-Blue Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Secondary Purple Orb with Pulse */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        
        {/* Secondary Pink Orb with Pulse */}
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
        
        {/* Medical Cross Symbols */}
        <div className="absolute top-10 left-10 text-6xl text-blue-200 opacity-10">+</div>
        <div className="absolute top-32 right-32 text-5xl text-teal-200 opacity-10">+</div>
        <div className="absolute bottom-40 left-40 text-7xl text-green-200 opacity-10">+</div>
        <div className="absolute bottom-20 right-40 text-4xl text-cyan-200 opacity-10">+</div>
        <div className="absolute top-1/2 right-10 text-6xl text-emerald-200 opacity-10">+</div>
      </div>

      {/* Sign In Card */}
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/60 hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in-up">
        <CardHeader className="p-8 border-b-4 border-gradient-to-r from-blue-600 via-teal-600 to-green-600">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-fade-in-up">
            Patient Sign In
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2 animate-fade-in-up animation-delay-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-in-up animation-delay-400">
              <label className="block text-sm font-bold mb-2 text-gray-700">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-500">
              <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-200 focus:outline-none transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-fade-in-up">
                {error}
              </div>
            )}

            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white font-bold rounded-lg hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fade-in-up animation-delay-600 relative overflow-hidden group"
              disabled={loading}
            >
              <span className="relative z-10">{loading ? "Signing in..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </div>

          <div className="mt-6 text-center animate-fade-in-up animation-delay-700">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link 
                href="/patient/signup" 
                className="text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text font-bold hover:from-teal-600 hover:to-green-600 transition-all duration-300 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
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

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out backwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  )
}