"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockPatients, mockPrescriptions } from "@/lib/mock-data"
import type { Patient, Prescription } from "@/lib/types"

export default function PharmacistDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [patients, setPatients] = useState<(Patient & { prescriptions: Prescription[] })[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user || user.role !== "pharmacist") {
      router.push("/")
      return
    }

    // Get all patients with their prescriptions
    const patientsWithPrescriptions = mockPatients.map((patient) => ({
      ...patient,
      prescriptions: mockPrescriptions.filter((p) => p.patientId === patient.id),
    }))

    setPatients(patientsWithPrescriptions)
  }, [user, router])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("pharmacistDashboard")}</h1>
            <p className="text-gray-600 mt-1">
              {t("pharmacist")}: <strong>{user?.name}</strong>
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/pharmacist/inventory")} className="bg-blue-600 hover:bg-blue-700">
              {t("medicineManagement")}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="bg-white">
              {t("logout")}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("patientQueue")}</CardTitle>
            <CardDescription>Search for patients to view their prescribed medicines</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid gap-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/pharmacist/patient/${patient.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{patient.name}</CardTitle>
                      <CardDescription>
                        {t("patientId")}: {patient.patientId} | Age: {patient.age} | {patient.sex}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {patient.prescriptions.length} {t("prescribedMedicines")}
                      </p>
                      <Button className="mt-2 bg-orange-600 hover:bg-orange-700">{t("viewPrescribedMedicines")}</Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No patients found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
