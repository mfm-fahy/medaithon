"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPatients } from "@/lib/mock-data"
import DoctorHeader from "@/components/doctor/doctor-header"

export default function DoctorDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [waitingPatients, setWaitingPatients] = useState(mockPatients)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/doctor/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "doctor") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Doctor Name</p>
              <p className="text-xl font-bold">{user?.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Designation</p>
              <p className="text-xl font-bold">{(user as any)?.designation}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-xl font-bold">{new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Waiting Patients</p>
              <p className="text-xl font-bold text-green-600">{waitingPatients.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Waiting Patients</CardTitle>
            <CardDescription>Click on a patient to view details and manage their care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {waitingPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => router.push(`/doctor/patient/${patient.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">Age: {patient.age}</p>
                      <p className="text-xs text-gray-500">{patient.sex}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
