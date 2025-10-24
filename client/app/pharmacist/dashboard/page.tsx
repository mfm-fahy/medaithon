"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockPatients, mockPrescriptions } from "@/lib/mock-data"
import { Pill, Clock, AlertCircle, CheckCircle, Search, Users } from "lucide-react"
import type { Patient, Prescription } from "@/lib/types"

interface PatientWithPrescriptions extends Patient {
  prescriptions: Prescription[]
}

interface ApiPatient {
  _id: string
  patientId: string
  userId: {
    name: string
    email: string
  }
  age: number
  sex: string
  phone: string
  prescriptions?: ApiPrescription[]
}

interface ApiPrescription {
  _id: string
  patientId: string
  doctorId: {
    _id: string
    userId?: {
      name: string
    }
  }
  medicine: string
  route: string
  dose: string
  frequency: string
  duration: string
  advice?: string
  status?: string
  createdAt: string
  updatedAt: string
}

export default function PharmacistDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const [patients, setPatients] = useState<PatientWithPrescriptions[]>([])
  const [apiPatients, setApiPatients] = useState<ApiPatient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [error, setError] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<ApiPatient | null>(null)
  const [showQueueSection, setShowQueueSection] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pharmacist/signin")
      return
    }

    if (!loading && isAuthenticated && user?.role === "pharmacist") {
      // Try to fetch from API first
      fetchPatientsFromAPI()
    }
  }, [isAuthenticated, loading, user, router])

  const fetchPatientsFromAPI = async () => {
    try {
      setLoadingPatients(true)
      setError("")
      const token = localStorage.getItem("token")

      if (!token) {
        console.log("No token found, using mock data")
        loadMockData()
        return
      }

      // Fetch all patients
      const patientsResponse = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!patientsResponse.ok) {
        console.log("Failed to fetch from API, using mock data")
        loadMockData()
        return
      }

      const patientsData = await patientsResponse.json()
      console.log("✅ Patients fetched from API:", patientsData.length)

      // Fetch prescriptions for each patient
      const patientsWithPrescriptions = await Promise.all(
        patientsData.map(async (patient: ApiPatient) => {
          try {
            const prescResponse = await fetch(
              `http://localhost:5000/api/prescriptions?patientId=${patient._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            if (prescResponse.ok) {
              const prescriptions = await prescResponse.json()
              return {
                ...patient,
                prescriptions: prescriptions || [],
              }
            }
            return {
              ...patient,
              prescriptions: [],
            }
          } catch (err) {
            console.error("Error fetching prescriptions:", err)
            return {
              ...patient,
              prescriptions: [],
            }
          }
        })
      )

      // Filter patients with prescriptions
      const patientsWithMedicines = patientsWithPrescriptions.filter(
        (p) => p.prescriptions && p.prescriptions.length > 0
      )

      setApiPatients(patientsWithMedicines)
      console.log("✅ Patients with prescriptions:", patientsWithMedicines.length)
    } catch (err) {
      console.error("Error fetching patients from API:", err)
      loadMockData()
    } finally {
      setLoadingPatients(false)
    }
  }

  const loadMockData = () => {
    // Get all patients with their prescriptions from mock data
    const patientsWithPrescriptions = mockPatients.map((patient) => ({
      ...patient,
      prescriptions: mockPrescriptions.filter((p) => p.patientId === patient.id),
    }))

    setPatients(patientsWithPrescriptions)
  }

  const filteredApiPatients = apiPatients.filter(
    (patient) =>
      patient.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Use API patients if available, otherwise use mock data
  const displayPatients = apiPatients.length > 0 ? filteredApiPatients : filteredPatients
  const isUsingApi = apiPatients.length > 0

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Calculate statistics
  const totalPatients = displayPatients.length
  const totalPrescriptions = displayPatients.reduce(
    (sum, p) => sum + (p.prescriptions?.length || 0),
    0
  )
  const avgMedicinesPerPatient = totalPatients > 0 ? (totalPrescriptions / totalPatients).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
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
            <Button onClick={() => router.push("/pharmacist/billing")} className="bg-purple-600 hover:bg-purple-700">
              💳 Billing
            </Button>
            <Button onClick={handleLogout} variant="outline" className="bg-white">
              {t("logout")}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-green-600">{totalPatients}</p>
                </div>
                <Users className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Prescriptions</p>
                  <p className="text-3xl font-bold text-blue-600">{totalPrescriptions}</p>
                </div>
                <Pill className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Medicines/Patient</p>
                  <p className="text-3xl font-bold text-orange-600">{avgMedicinesPerPatient}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Patient Queue
            </h2>
            <Button
              onClick={() => router.push("/pharmacist/queue")}
              className="bg-green-600 hover:bg-green-700"
            >
              View Full Queue
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loadingPatients && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">Loading patients...</p>
              </CardContent>
            </Card>
          )}

          {/* Patients List */}
          {!loadingPatients && (
            <div className="grid gap-4">
              {displayPatients.length > 0 ? (
                displayPatients.slice(0, 5).map((patient) => (
                  <Card
                    key={isUsingApi ? patient._id : patient.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-400"
                    onClick={() => {
                      if (isUsingApi) {
                        setSelectedPatient(patient as ApiPatient)
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {isUsingApi ? patient.userId.name : patient.name}
                          </CardTitle>
                          <CardDescription>
                            {t("patientId")}: {patient.patientId} | Age:{" "}
                            {isUsingApi ? patient.age : patient.age} | {isUsingApi ? patient.sex : patient.sex}
                          </CardDescription>
                          {isUsingApi && patient.userId.email && (
                            <CardDescription className="text-xs mt-1">
                              📧 {patient.userId.email}
                            </CardDescription>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-orange-100 text-orange-800 mb-2">
                            {patient.prescriptions?.length || 0} Medicines
                          </Badge>
                          <p className="text-sm text-gray-600 mt-2">
                            {patient.prescriptions?.length || 0} prescription{(patient.prescriptions?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Prescriptions Preview */}
                      {patient.prescriptions && patient.prescriptions.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Prescribed Medicines:</p>
                          <div className="space-y-2">
                            {patient.prescriptions.slice(0, 3).map((prescription, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <Pill className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{prescription.medicine}</p>
                                  <p className="text-xs text-gray-600">
                                    {prescription.dose} • {prescription.frequency} • {prescription.route}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {patient.prescriptions.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{patient.prescriptions.length - 3} more medicine{patient.prescriptions.length - 3 !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
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

              {displayPatients.length > 5 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <p className="text-center text-blue-600">
                      Showing 5 of {displayPatients.length} patients.{" "}
                      <Button
                        variant="link"
                        className="text-blue-600 underline p-0 h-auto"
                        onClick={() => router.push("/pharmacist/queue")}
                      >
                        View all patients
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Patient Details Sidebar */}
        {selectedPatient && (
          <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg overflow-y-auto z-50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Patient Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {/* Patient Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{selectedPatient.userId.name}</CardTitle>
                  <CardDescription>ID: {selectedPatient.patientId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <strong>Age:</strong> {selectedPatient.age} years
                  </p>
                  <p className="text-sm">
                    <strong>Sex:</strong> {selectedPatient.sex}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {selectedPatient.userId.email}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {selectedPatient.phone}
                  </p>
                </CardContent>
              </Card>

              {/* Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prescribed Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPatient.prescriptions.map((prescription, idx) => (
                        <div key={idx} className="border-b pb-4 last:border-b-0">
                          <p className="font-semibold text-gray-800">{prescription.medicine}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                            <p>
                              <strong>Dose:</strong> {prescription.dose}
                            </p>
                            <p>
                              <strong>Route:</strong> {prescription.route}
                            </p>
                            <p>
                              <strong>Frequency:</strong> {prescription.frequency}
                            </p>
                            <p>
                              <strong>Duration:</strong> {prescription.duration}
                            </p>
                          </div>
                          {prescription.advice && (
                            <p className="text-xs text-gray-600 mt-2">
                              <strong>Advice:</strong> {prescription.advice}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No prescriptions found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
