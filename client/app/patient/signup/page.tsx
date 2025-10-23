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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <QRCodeDisplay patientId={(signupData as any).patientId} patientName={signupData.name} showDownload={true} />
          <Button
            onClick={handleContinueToHome}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-base"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Patient Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Occupation</label>
              <Input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/patient/signin" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
