"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLabReports } from "@/lib/mock-data"
import PatientHeader from "@/components/patient/patient-header"

export default function LabReportsPage() {
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

  const patientReports = mockLabReports.filter((r) => r.patientId === (user as any)?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Lab Reports</CardTitle>
            <CardDescription>View your laboratory test results</CardDescription>
          </CardHeader>
          <CardContent>
            {patientReports.length === 0 ? (
              <p className="text-gray-600">No lab reports found</p>
            ) : (
              <div className="space-y-4">
                {patientReports.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{report.testName}</p>
                        <p className="text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            report.status === "completed" ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {report.status === "completed" ? "Completed" : "Pending"}
                        </p>
                        <p className="text-sm text-gray-600">{report.result}</p>
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
