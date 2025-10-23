"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockPatients } from "@/lib/mock-data"
import NurseHeader from "@/components/nurse/nurse-header"

export default function VitalsEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading } = useAuth()
  const patientId = searchParams.get("patientId")

  const patient = mockPatients.find((p) => p.id === patientId)

  const [vitals, setVitals] = useState({
    height: "",
    weight: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    pulse: "",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVitals((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Vitals recorded successfully!")
    router.push("/nurse/dashboard")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "nurse") {
    return null
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NurseHeader user={user} />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">No patient selected. Please scan a QR code first.</p>
              <Button onClick={() => router.push("/nurse/qr-scanner")} className="mt-4 w-full">
                Go to Scanner
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NurseHeader user={user} />

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Patient Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">{patient.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sex</p>
                <p className="font-medium capitalize">{patient.sex}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vitals Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Vital Signs</CardTitle>
            <CardDescription>Enter the patient's vital measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <Input
                    type="number"
                    name="height"
                    value={vitals.height}
                    onChange={handleChange}
                    placeholder="Height"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleChange}
                    placeholder="Weight"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
                  <Input
                    type="number"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleChange}
                    placeholder="Temperature"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                  <Input
                    type="text"
                    name="bloodPressure"
                    value={vitals.bloodPressure}
                    onChange={handleChange}
                    placeholder="e.g., 120/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    name="heartRate"
                    value={vitals.heartRate}
                    onChange={handleChange}
                    placeholder="Heart Rate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Respiratory Rate</label>
                  <Input
                    type="number"
                    name="respiratoryRate"
                    value={vitals.respiratoryRate}
                    onChange={handleChange}
                    placeholder="Respiratory Rate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pulse (bpm)</label>
                  <Input
                    type="number"
                    name="pulse"
                    value={vitals.pulse}
                    onChange={handleChange}
                    placeholder="Pulse"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Save Vitals
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/nurse/dashboard")}
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
