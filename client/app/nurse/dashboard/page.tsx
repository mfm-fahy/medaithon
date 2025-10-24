"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NurseHeader from "@/components/nurse/nurse-header"

export default function NurseDashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/qr-scanner")}
          >
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>Scan patient wristband to get patient details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center mb-4">📱</div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Scanning</Button>
            </CardContent>
          </Card>

          {/* Vitals Entry */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/vitals-entry")}
          >
            <CardHeader>
              <CardTitle>Record Vitals</CardTitle>
              <CardDescription>Enter patient vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center mb-4">📊</div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Record Vitals</Button>
            </CardContent>
          </Card>

          {/* View Medicines */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/medicines")}
          >
            <CardHeader>
              <CardTitle>Prescribed Medicines</CardTitle>
              <CardDescription>View medicines prescribed by doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center mb-4">💊</div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Medicines</Button>
            </CardContent>
          </Card>

          {/* Patient History */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/patient-history")}
          >
            <CardHeader>
              <CardTitle>Patient History</CardTitle>
              <CardDescription>View recent patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center mb-4">📋</div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View History</Button>
            </CardContent>
          </Card>

          {/* Injections Management */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/nurse/injections")}
          >
            <CardHeader>
              <CardTitle>Injections</CardTitle>
              <CardDescription>Update injection status for patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center mb-4">💉</div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage Injections</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
