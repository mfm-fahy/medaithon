"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Pill, Clock } from "lucide-react"

interface Prescription {
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

interface Patient {
  _id: string
  patientId: string
  userId: {
    name: string
    email: string
  }
  age: number
  sex: string
  phone: string
  prescriptions?: Prescription[]
}

export default function PharmacistQueue() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pharmacist/signin")
    }
  }, [isAuthenticated, loading, router])

  // Fetch patients with prescriptions
  useEffect(() => {
    if (isAuthenticated && user?.role === "pharmacist") {
      fetchPatients()
    }
  }, [isAuthenticated, user])

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true)
      setError("")
      const token = localStorage.getItem("auth_token")

      // Fetch all patients
      const patientsResponse = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!patientsResponse.ok) {
        throw new Error("Failed to fetch patients")
      }

      const patientsData = await patientsResponse.json()
      console.log("✅ Patients fetched:", patientsData.length)

      // Fetch prescriptions for each patient
      const patientsWithPrescriptions = await Promise.all(
        patientsData.map(async (patient: Patient) => {
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
            console.error("Error fetching prescriptions for patient:", err)
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

      setPatients(patientsWithMedicines)
      setFilteredPatients(patientsWithMedicines)
      console.log("✅ Patients with prescriptions:", patientsWithMedicines.length)
    } catch (err) {
      console.error("Error fetching patients:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch patients")
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = patients.filter(
      (patient) =>
        patient.userId.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredPatients(filtered)
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const handleCloseDetails = () => {
    setSelectedPatient(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "pharmacist") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">💊 Patient Queue</h1>
            <p className="text-gray-600">View patients with prescribed medicines</p>
          </div>
          <Button
            onClick={() => router.push("/pharmacist/dashboard")}
            variant="outline"
            className="bg-white"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Patients</CardTitle>
            <CardDescription>Find patients by name or patient ID</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patients with Prescriptions</CardTitle>
                <CardDescription>
                  {loadingPatients ? "Loading..." : `${filteredPatients.length} patients found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPatients ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading patients...</p>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No patients with prescriptions found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => handleViewDetails(patient)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{patient.userId.name}</h3>
                            <p className="text-sm text-gray-600">
                              ID: {patient.patientId} | Age: {patient.age} | {patient.sex}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{patient.phone}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-orange-100 text-orange-800 mb-2">
                              <Pill className="w-3 h-3 mr-1" />
                              {patient.prescriptions?.length || 0} medicines
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 w-full mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(patient)
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-1">
            {selectedPatient ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Patient Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseDetails}
                      className="text-gray-500"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Patient Info */}
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-lg">{selectedPatient.userId.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-semibold">{selectedPatient.patientId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-semibold">{selectedPatient.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sex</p>
                      <p className="font-semibold capitalize">{selectedPatient.sex}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-sm">{selectedPatient.userId.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{selectedPatient.phone}</p>
                  </div>

                  {/* Prescriptions */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      💊 Prescribed Medicines ({selectedPatient.prescriptions?.length || 0})
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 ? (
                        selectedPatient.prescriptions.map((prescription) => (
                          <div
                            key={prescription._id}
                            className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-semibold text-gray-900">{prescription.medicine}</p>
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                {prescription.route}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p>
                                <span className="font-medium">Dose:</span> {prescription.dose}
                              </p>
                              <p>
                                <span className="font-medium">Frequency:</span> {prescription.frequency}
                              </p>
                              <p>
                                <span className="font-medium">Duration:</span> {prescription.duration}
                              </p>
                              {prescription.advice && (
                                <p>
                                  <span className="font-medium">Advice:</span> {prescription.advice}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 pt-2 border-t border-orange-200 text-xs text-gray-600">
                              Prescribed by: {prescription.doctorId?.userId?.name || prescription.doctorId?.name || "Unknown"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No prescriptions found</p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => {
                      // Pass patient and prescriptions data to billing page
                      const prescriptionData = selectedPatient.prescriptions || []
                      const queryParams = new URLSearchParams({
                        patientId: selectedPatient._id,
                        patientName: selectedPatient.userId.name,
                        patientPhone: selectedPatient.phone,
                        prescriptions: JSON.stringify(prescriptionData),
                      })
                      router.push(`/pharmacist/billing?${queryParams.toString()}`)
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                  >
                    Manage Medicines
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Select a patient to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {patients.length > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {patients.reduce((sum, p) => sum + (p.prescriptions?.length || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Medicines/Patient</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(
                      patients.reduce((sum, p) => sum + (p.prescriptions?.length || 0), 0) /
                      patients.length
                    ).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900">Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

