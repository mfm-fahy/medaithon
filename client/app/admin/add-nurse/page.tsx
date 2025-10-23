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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Nurse</CardTitle>
            <CardDescription>Create a new nurse account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter nurse's full name"
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
                  placeholder="Enter username"
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
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., General Ward"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Add Nurse
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                  className="flex-1"
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
