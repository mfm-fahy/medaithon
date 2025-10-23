"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPrescriptions } from "@/lib/mock-data"
import PatientHeader from "@/components/patient/patient-header"

export default function PrescriptionsPage() {
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

  const patientPrescriptions = mockPrescriptions.filter((p) => p.patientId === (user as any)?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Prescriptions</CardTitle>
            <CardDescription>View all your prescribed medicines</CardDescription>
          </CardHeader>
          <CardContent>
            {patientPrescriptions.length === 0 ? (
              <p className="text-gray-600">No prescriptions found</p>
            ) : (
              <div className="space-y-4">
                {patientPrescriptions.map((presc) => (
                  <div key={presc.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Medicine</p>
                        <p className="font-medium">{presc.medicine}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dose</p>
                        <p className="font-medium">{presc.dose}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frequency</p>
                        <p className="font-medium">{presc.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-medium">{presc.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{presc.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Advice</p>
                        <p className="font-medium">{presc.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={() => router.push("/patient/home")} variant="outline" className="w-full mt-6">
          Back to Home
        </Button>
      </main>
    </div>
  )
}
