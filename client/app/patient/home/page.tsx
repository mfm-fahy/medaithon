"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"
import PatientNavigation from "@/components/patient/patient-navigation"
import QRCodeDisplay from "@/components/patient/qr-code-display"
import VisitForm from "@/components/patient/visit-form"

export default function PatientHome() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [visitScheduled, setVisitScheduled] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* QR Code Section */}
        {(user as any)?.patientId && (
          <div className="mb-8">
            <QRCodeDisplay patientId={(user as any).patientId} patientName={user?.name} showDownload={true} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your medical information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => router.push("/patient/appointments")}
                className="bg-green-600 hover:bg-green-700 h-20 text-base"
              >
                View Appointments
              </Button>
              <Button
                onClick={() => router.push("/patient/prescriptions")}
                className="bg-purple-600 hover:bg-purple-700 h-20 text-base"
              >
                My Prescriptions
              </Button>
              <Button
                onClick={() => router.push("/patient/lab-reports")}
                className="bg-orange-600 hover:bg-orange-700 h-20 text-base"
              >
                Lab Reports
              </Button>
              <Button
                onClick={() => router.push("/patient/navigation")}
                className="bg-indigo-600 hover:bg-indigo-700 h-20 text-base"
              >
                Medical Records
              </Button>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> {user?.name}
              </div>
              <div>
                <span className="font-medium">Patient ID:</span> {(user as any)?.patientId}
              </div>
              <div>
                <span className="font-medium">Age:</span> {(user as any)?.age}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {(user as any)?.phone}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visit Form Section */}
        <div className="mb-8">
          <VisitForm
            patientId={(user as any)?.patientId}
            onSuccess={() => setVisitScheduled(true)}
          />
        </div>

        <PatientNavigation visitScheduled={visitScheduled} />
      </main>
    </div>
  )
}
