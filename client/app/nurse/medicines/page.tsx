"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPrescriptions, mockPatients } from "@/lib/mock-data"
import NurseHeader from "@/components/nurse/nurse-header"

export default function MedicinesPage() {
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

  const getPatientName = (patientId: string) => {
    return mockPatients.find((p) => p.id === patientId)?.name || "Unknown"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NurseHeader user={user} />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Prescribed Medicines</CardTitle>
            <CardDescription>View all medicines prescribed by doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPrescriptions.map((presc) => (
                <div key={presc.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="mb-3">
                    <p className="font-medium text-lg">{getPatientName(presc.patientId)}</p>
                    <p className="text-sm text-gray-600">Patient ID: {presc.patientId}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Medicine</p>
                      <p className="font-medium">{presc.medicine}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Route</p>
                      <p className="font-medium">{presc.route}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dose</p>
                      <p className="font-medium">{presc.dose}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frequency</p>
                      <p className="font-medium">{presc.frequency}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Advice</p>
                      <p className="font-medium">{presc.advice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{presc.duration}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Mark as Administered
                    </Button>
                  </div>
                </div>
              ))}
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
