"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import QRCodeDisplay from "@/components/patient/qr-code-display"

export default function PatientSignUp() {
  const router = useRouter()
  const { signup, user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    sex: "male",
    phone: "",
    occupation: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [signupData, setSignupData] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Watch for user changes and show QR code when user is updated
  useEffect(() => {
    if (showQRCode && user && (user as any).patientId) {
      console.log("✅ User state updated with patientId, showing QR code...")
      setSignupData(user)
    }
  }, [user, showQRCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    console.log("🔵 Signup form submitted")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      console.error("❌ Passwords do not match")
      return
    }

    setLoading(true)
    console.log("📝 Sending signup data:", { ...formData, password: "***" })

    try {
      console.log("🚀 Calling signup function...")
      await signup({
        name: formData.name,
        email: formData.email,
        age: formData.age,
        sex: formData.sex,
        phone: formData.phone,
        occupation: formData.occupation,
        address: formData.address,
        username: formData.username,
        password: formData.password,
        role: "patient",
      })

      console.log("✅ Signup successful!")
      console.log("👤 Current user:", user)

      // Store signup data and show QR code
      // We use the user from context which should be updated by now
      if (user && (user as any).patientId) {
        console.log("✅ User has patientId, showing QR code...")
        setSignupData(user)
        setShowQRCode(true)
      } else {
        console.log("⏱️ Waiting for user state to update...")
        // Wait a bit for state to update, then show QR code
        setTimeout(() => {
          console.log("⏱️ Showing QR code after delay...")
          setShowQRCode(true)
        }, 500)
      }
    } catch (err: any) {
      console.error("❌ Signup error:", err)
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToHome = () => {
    router.push("/patient/home")
  }

  // Show QR code after successful signup
  if (showQRCode && signupData && (signupData as any).patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-10 left-10 text-6xl text-blue-200 opacity-10">+</div>
          <div className="absolute top-32 right-32 text-5xl text-teal-200 opacity-10">+</div>
          <div className="absolute bottom-40 left-40 text-7xl text-green-200 opacity-10">+</div>
          <div className="absolute bottom-20 right-40 text-4xl text-cyan-200 opacity-10">+</div>
          <div className="absolute top-1/2 right-10 text-6xl text-emerald-200 opacity-10">+</div>
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <QRCodeDisplay patientId={(signupData as any).patientId} patientName={signupData.name} showDownload={true} />
          <Button
            onClick={handleContinueToHome}
            className="w-full mt-6 h-12 text-base bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white font-bold rounded-lg hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Continue to Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Button>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -20px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(20px, 20px) scale(1.05); }
          }
          @keyframes fade-in-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out backwards; }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-10 left-10 text-6xl text-blue-200 opacity-10">+</div>
        <div className="absolute top-32 right-32 text-5xl text-teal-200 opacity-10">+</div>
        <div className="absolute bottom-40 left-40 text-7xl text-green-200 opacity-10">+</div>
        <div className="absolute bottom-20 right-40 text-4xl text-cyan-200 opacity-10">+</div>
        <div className="absolute top-1/2 right-10 text-6xl text-emerald-200 opacity-10">+</div>
      </div>

      <Card className="w-full max-w-2xl relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/60 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
        <CardHeader className="p-8 border-b-4 border-gradient-to-r from-blue-600 via-teal-600 to-green-600">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
            Patient Sign Up
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up animation-delay-300">
              <label className="block text-sm font-bold mb-2 text-gray-700">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-200 focus:outline-none transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in-up animation-delay-500">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Age</label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-600">
              <label className="block text-sm font-bold mb-2 text-gray-700">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 focus:outline-none transition-all duration-300 hover:border-cyan-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-700">
              <label className="block text-sm font-bold mb-2 text-gray-700">Occupation</label>
              <Input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-800">
              <label className="block text-sm font-bold mb-2 text-gray-700">Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition-all duration-300 hover:border-pink-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-900">
              <label className="block text-sm font-bold mb-2 text-gray-700">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-1000">
              <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-200 focus:outline-none transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1 bg-white"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-1100">
              <label className="block text-sm font-bold mb-2 text-gray-700">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 bg-white"
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
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white font-bold rounded-lg hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fade-in-up animation-delay-1200 relative overflow-hidden group"
              disabled={loading}
            >
              <span className="relative z-10">{loading ? "Creating account..." : "Sign Up"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </div>

          <div className="mt-6 text-center animate-fade-in-up animation-delay-1300">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/patient/signin" 
                className="text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text font-bold hover:from-teal-600 hover:to-green-600 transition-all duration-300 hover:underline"
              >
                Sign in here
              </Link>
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
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out backwards; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1100 { animation-delay: 1100ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-1300 { animation-delay: 1300ms; }
      `}</style>
    </div>
  )
}