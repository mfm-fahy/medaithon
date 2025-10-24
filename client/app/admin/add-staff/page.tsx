"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminHeader from "@/components/admin/admin-header"
import { Users, UserPlus, AlertCircle } from "lucide-react"

type StaffRole = "doctor" | "nurse" | "pharmacist" | "labTechnician" | "biomedical"

interface StaffFormData {
  name: string
  username: string
  email: string
  password: string
  role: StaffRole
  designation?: string
  specialization?: string
  department?: string
  licenseNumber?: string
  yearsOfExperience?: string
}

export default function AddStaffPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<StaffRole>("doctor")
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "doctor",
    designation: "",
    specialization: "",
    department: "",
    licenseNumber: "",
    yearsOfExperience: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/signin")
    }
  }, [isAuthenticated, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (role: StaffRole) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, role }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.username.trim()) {
      setError("Username is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.password.trim()) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (selectedRole === "doctor" && !formData.designation?.trim()) {
      setError("Designation is required for doctors")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          designation: formData.designation,
          specialization: formData.specialization,
          department: formData.department,
          licenseNumber: formData.licenseNumber,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        }),
      })

      if (response.ok) {
        setSuccess(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} added successfully!`)
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          role: selectedRole,
          designation: "",
          specialization: "",
          department: "",
          licenseNumber: "",
          yearsOfExperience: "",
        })
        setTimeout(() => router.push("/admin/dashboard"), 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to add staff")
      }
    } catch (err) {
      setError("Error adding staff. Please try again.")
    }
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

  const staffRoles: { id: StaffRole; label: string; icon: string; color: string }[] = [
    { id: "doctor", label: "Doctor", icon: "👨‍⚕️", color: "from-green-400 to-emerald-500" },
    { id: "nurse", label: "Nurse", icon: "👩‍⚕️", color: "from-purple-400 to-pink-500" },
    { id: "pharmacist", label: "Pharmacist", icon: "💊", color: "from-blue-400 to-cyan-500" },
    { id: "labTechnician", label: "Lab Technician", icon: "🔬", color: "from-orange-400 to-red-500" },
    { id: "biomedical", label: "Biomedical Engineer", icon: "⚙️", color: "from-indigo-400 to-purple-500" },
  ]

  const currentRole = staffRoles.find((r) => r.id === selectedRole)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 animate-in slide-in-from-top-8 fade-in duration-1000">
        <div className="backdrop-blur-md bg-white/80 shadow-xl border-b-4 border-gradient-to-r from-blue-400 via-teal-400 to-green-400">
          <AdminHeader user={user} />
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-6 relative z-10">
        {/* Title */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Add New Staff
            </h1>
          </div>
          <p className="text-gray-600">Register a new staff member to the hospital system</p>
        </div>

        {/* Role Selection */}
        <Card className="mb-6 backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Staff Role
            </CardTitle>
            <CardDescription>Choose the type of staff member you want to add</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {staffRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? `border-blue-500 bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-3xl mb-2">{role.icon}</div>
                  <div className={`text-sm font-semibold ${selectedRole === role.id ? "text-white" : "text-gray-700"}`}>
                    {role.label}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-white/60 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <CardHeader className={`bg-gradient-to-r ${currentRole?.color} text-white`}>
            <CardTitle>Add {currentRole?.label}</CardTitle>
            <CardDescription className="text-white/90">Fill in the details below</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-700 font-semibold">✅ {success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 characters)"
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === "doctor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Designation *</label>
                    <Input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g., Senior Doctor, Consultant"
                      className="border-2 border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                    <Input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, Neurology"
                      className="border-2 border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology Department"
                      className="border-2 border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                    <Input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      className="border-2 border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {(selectedRole === "nurse" || selectedRole === "labTechnician") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., ICU, General Ward"
                      className="border-2 border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                    <Input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="e.g., LIC123456"
                      className="border-2 border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "pharmacist" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Pharmacy"
                      className="border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                    <Input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="e.g., PHARM123456"
                      className="border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "biomedical" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Biomedical Engineering"
                      className="border-2 border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                    <Input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g., Equipment Maintenance"
                      className="border-2 border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${currentRole?.color} hover:shadow-lg text-white font-bold py-3 rounded-lg transition-all duration-300`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add {currentRole?.label}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

