"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader, Search } from "lucide-react"

interface Patient {
  _id: string
  patientId: string
  userId: { name: string; email: string }
  age: number
  sex: string
  phone: string
  medicalHistory?: string
  allergies?: string[]
}

export default function AdminPatients() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPatients()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  const fetchPatients = async () => {
    setLoadingPatients(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch patients")
      const data = await response.json()
      setPatients(data)
      setFilteredPatients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching patients")
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleUpdatePatient = async (updates: any) => {
    if (!selectedPatient) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/patients/qr/${selectedPatient.patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update patient")
      const data = await response.json()
      setSelectedPatient(data.patient)
      
      // Update patients list
      setPatients(patients.map(p => p._id === data.patient._id ? data.patient : p))
      setSuccess("Patient updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating patient")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-600 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Advanced Glowing Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Primary glowing orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        {/* Secondary glowing elements */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
        
        {/* Medical cross patterns */}
        <div className="absolute top-1/4 right-1/3 text-blue-200/10 text-9xl animate-pulse">+</div>
        <div className="absolute bottom-1/3 left-1/4 text-green-200/10 text-9xl animate-pulse animation-delay-2000">+</div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 animate-in fade-in slide-in-from-top-8 duration-1000">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">Patient Management</h1>
            <p className="text-gray-600 mt-1">View and manage all patients in the system</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50/90 backdrop-blur-sm border-2 border-green-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-1 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 hover:shadow-blue-400/30 transition-all duration-700 relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                
                <CardHeader className="border-b border-gradient-to-r from-blue-200/50 via-teal-200/50 to-green-200/50 relative z-10">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Patients</CardTitle>
                  <CardDescription className="text-gray-600">Total: {filteredPatients.length}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3 relative z-10">
                  {/* Search */}
                  <div className="relative group/search">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, ID, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-300/30"
                    />
                  </div>

                  {/* Patient List */}
                  {loadingPatients ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredPatients.map((patient, index) => (
                        <button
                          key={patient._id}
                          onClick={() => setSelectedPatient(patient)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all animate-in fade-in slide-in-from-left-4 duration-500 ${
                            selectedPatient?._id === patient._id
                              ? "border-blue-600 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg shadow-blue-300/50"
                              : "border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 hover:border-blue-400 hover:shadow-md hover:shadow-blue-300/30"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="font-semibold text-sm text-gray-800">{patient.userId.name}</div>
                          <div className="text-xs text-gray-600">{patient.patientId}</div>
                          <div className="text-xs text-gray-500">{patient.phone}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Patient Details and Update Form */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-8 duration-1000">
              {selectedPatient ? (
                <AdminPatientDetailsCard patient={selectedPatient} onUpdate={handleUpdatePatient} />
              ) : (
                <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                  <CardContent className="pt-6 relative z-10">
                    <p className="text-center text-gray-500 py-8">Select a patient to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

function AdminPatientDetailsCard({ patient, onUpdate }: { patient: Patient; onUpdate: (updates: any) => void }) {
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || "")
  const [allergies, setAllergies] = useState(patient.allergies?.join(", ") || "")
  const [updating, setUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      await onUpdate({
        medicalHistory,
        allergies: allergies.split(",").map((a) => a.trim()),
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60 hover:shadow-teal-400/30 transition-all duration-700 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
      
      <CardHeader className="border-b border-gradient-to-r from-teal-200/50 via-cyan-200/50 to-blue-200/50 relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">Patient Details</CardTitle>
        <CardDescription className="text-gray-600">View and update patient information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/50">
            <p className="text-sm text-gray-600 font-semibold">Name</p>
            <p className="font-bold text-gray-800">{patient.userId.name}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
            <p className="text-sm text-gray-600 font-semibold">Patient ID</p>
            <p className="font-bold text-gray-800">{patient.patientId}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-green-50 border border-cyan-200/50">
            <p className="text-sm text-gray-600 font-semibold">Age</p>
            <p className="font-bold text-gray-800">{patient.age}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 border border-green-200/50">
            <p className="text-sm text-gray-600 font-semibold">Sex</p>
            <p className="font-bold text-gray-800 capitalize">{patient.sex}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50">
            <p className="text-sm text-gray-600 font-semibold">Phone</p>
            <p className="font-bold text-gray-800">{patient.phone}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/50">
            <p className="text-sm text-gray-600 font-semibold">Email</p>
            <p className="font-bold text-gray-800">{patient.userId.email}</p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t-2 border-gradient-to-r from-teal-200/50 to-blue-200/50 pt-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Medical History</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-200 min-h-24 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-300/30"
              placeholder="Enter medical history..."
              disabled={updating}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Allergies (comma-separated)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-300/30"
              placeholder="e.g., Penicillin, Peanuts"
              disabled={updating}
            />
          </div>

          <Button
            type="submit"
            disabled={updating}
            className="w-full relative bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-2xl hover:shadow-teal-400/60 transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 border-teal-300/50 hover:border-teal-200 overflow-hidden group"
          >
            <span className="relative z-10">
              {updating ? "Updating..." : "Update Patient"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}