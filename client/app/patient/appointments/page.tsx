"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"

export default function AppointmentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  const appointments = [
    { id: 1, type: "Doctor", name: "Dr. Smith", time: "10:30 AM", status: "Scheduled" },
    { id: 2, type: "Lab", name: "Blood Test", time: "11:00 AM", status: "Scheduled" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>View your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{apt.type}</p>
                      <p className="text-sm text-gray-600">{apt.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">{apt.time}</p>
                      <p className="text-sm text-green-600">{apt.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => router.push("/patient/home")} variant="outline" className="w-full mt-6">
          Back to Home
        </Button>
      </main>
    </div>
  )
}
