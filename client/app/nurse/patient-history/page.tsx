"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPatients, mockVitals } from "@/lib/mock-data"
import NurseHeader from "@/components/nurse/nurse-header"

export default function PatientHistoryPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "nurse") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NurseHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient History</CardTitle>
            <CardDescription>View recent patient records and vitals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPatients.map((patient) => {
                const patientVitals = mockVitals.filter((v) => v.patientId === patient.id)
                return (
                  <div key={patient.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="mb-3">
                      <p className="font-medium text-lg">{patient.name}</p>
                      <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
                    </div>

                    {patientVitals.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {patientVitals.map((vital) => (
                          <div key={vital.id} className="p-2 bg-gray-50 rounded">
                            <p className="text-gray-600">BP</p>
                            <p className="font-medium">{vital.bloodPressure}</p>
                            <p className="text-xs text-gray-500">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No vitals recorded</p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => router.push("/nurse/dashboard")} variant="outline" className="w-full mt-6">
          Back to Dashboard
        </Button>
      </main>
    </div>
  )
}
