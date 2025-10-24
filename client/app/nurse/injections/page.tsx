"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import NurseHeader from "@/components/nurse/nurse-header"
import QRScanner from "@/components/qr-scanner"
import { CheckCircle, Clock, AlertCircle, Trash2, Edit2, Scan, X } from "lucide-react"

interface PatientData {
  _id: string
  patientId: string
  userId: { name: string; email: string }
  age: number
  sex: string
  phone: string
  medicalHistory?: string
}

interface Injection {
  _id: string
  patientId: {
    _id: string
    patientId: string
    userId?: {
      name: string
    }
  }
  doctorId: {
    _id: string
    userId?: {
      name: string
    }
  }
  injectionName: string
  injectionType: string
  dose: string
  frequency: string
  duration?: string
  route?: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function NurseInjections() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [injections, setInjections] = useState<Injection[]>([])
  const [filteredInjections, setFilteredInjections] = useState<Injection[]>([])
  const [loadingInjections, setLoadingInjections] = useState(false)
  const [searchPatient, setSearchPatient] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({})

  // QR Scanner states
  const [showScanner, setShowScanner] = useState(false)
  const [scannedPatient, setScannedPatient] = useState<PatientData | null>(null)
  const [patientInjections, setPatientInjections] = useState<Injection[]>([])
  const [loadingPatient, setLoadingPatient] = useState(false)
  const [scanError, setScanError] = useState("")
  const [scanSuccess, setScanSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/nurse/signin")
    }
  }, [isAuthenticated, loading, router])

  // Fetch injections
  useEffect(() => {
    if (isAuthenticated && user?.role === "nurse") {
      fetchInjections()
    }
  }, [isAuthenticated, user])

  const fetchInjections = async () => {
    try {
      setLoadingInjections(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:5000/api/injections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInjections(data)
        filterInjections(data, searchPatient, selectedStatus)
      }
    } catch (error) {
      console.error("Error fetching injections:", error)
    } finally {
      setLoadingInjections(false)
    }
  }

  const filterInjections = (data: Injection[], search: string, status: string) => {
    let filtered = data

    if (search) {
      filtered = filtered.filter(
        (inj) =>
          inj.patientId.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          inj.patientId.patientId?.toLowerCase().includes(search.toLowerCase()) ||
          inj.injectionName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((inj) => inj.status === status)
    }

    setFilteredInjections(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchPatient(value)
    filterInjections(injections, value, selectedStatus)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    filterInjections(injections, searchPatient, status)
  }

  const handleUpdateStatus = async (injectionId: string, newStatus: string) => {
    try {
      setUpdatingId(injectionId)
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:5000/api/injections/${injectionId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          notes: editingNotes[injectionId] || "",
        }),
      })

      if (response.ok) {
        const updatedInjection = await response.json()
        alert(`✅ Injection marked as ${newStatus}!`)
        fetchInjections()
        setEditingNotes((prev) => {
          const newNotes = { ...prev }
          delete newNotes[injectionId]
          return newNotes
        })
      } else {
        alert("Error updating injection status")
      }
    } catch (error) {
      console.error("Error updating injection:", error)
      alert("Failed to update injection")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleQRScan = async (patientId: string) => {
    console.log("🔵 QR Code scanned:", patientId)
    setScanError("")
    setScanSuccess("")
    setLoadingPatient(true)

    try {
      const token = localStorage.getItem("auth_token")
      console.log("📝 Fetching patient data for:", patientId)

      const response = await fetch(`http://localhost:5000/api/patients/qr/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("📊 Response status:", response.status)

      if (!response.ok) {
        throw new Error("Patient not found")
      }

      const data = await response.json()
      console.log("✅ Patient data received:", data)

      if (!data.patient) {
        throw new Error("Invalid patient data received")
      }

      const patientName = data.patient.userId?.name || "Unknown Patient"
      setScannedPatient(data.patient)
      setShowScanner(false)
      setScanSuccess(`Patient found: ${patientName}`)

      // Fetch injections for this patient
      await fetchPatientInjections(data.patient._id)
    } catch (err) {
      console.error("❌ Error scanning patient:", err)
      setScanError(err instanceof Error ? err.message : "Error scanning patient")
    } finally {
      setLoadingPatient(false)
    }
  }

  const fetchPatientInjections = async (patientMongoId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:5000/api/injections/patient/${patientMongoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPatientInjections(data)
        console.log("✅ Patient injections fetched:", data.length)
      }
    } catch (error) {
      console.error("Error fetching patient injections:", error)
    }
  }

  const handleClearScannedPatient = () => {
    setScannedPatient(null)
    setPatientInjections([])
    setScanError("")
    setScanSuccess("")
  }

  const handleScanAgain = () => {
    handleClearScannedPatient()
    setShowScanner(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "nurse") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NurseHeader user={user} />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💉 Injection Management</h1>
          <p className="text-gray-600">Update injection status and track patient injections</p>
        </div>

        {/* Error Message */}
        {scanError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{scanError}</p>
          </div>
        )}

        {/* Success Message */}
        {scanSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{scanSuccess}</p>
          </div>
        )}

        {/* QR Scanner Section */}
        {scannedPatient ? (
          <Card className="mb-6 border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>📱 Scanned Patient Details</CardTitle>
                  <CardDescription>Patient information from QR code scan</CardDescription>
                </div>
                <Button
                  onClick={handleClearScannedPatient}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-lg">{scannedPatient.userId?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patient ID</p>
                  <p className="font-semibold">{scannedPatient.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{scannedPatient.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sex</p>
                  <p className="font-semibold capitalize">{scannedPatient.sex}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{scannedPatient.userId?.email || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{scannedPatient.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleScanAgain}
                  variant="outline"
                  className="flex-1"
                  disabled={loadingPatient}
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Another Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : showScanner ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📱 QR Code Scanner</CardTitle>
              <CardDescription>Point camera at patient's wristband QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
                title="Scan Patient QR Code"
                description="Point camera at patient's wristband QR code"
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📱 Quick Patient Lookup</CardTitle>
              <CardDescription>Scan patient QR code to view their injections</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loadingPatient}
              >
                <Scan className="w-4 h-4 mr-2" />
                Start QR Scanner
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient</label>
                <Input
                  type="text"
                  placeholder="Search by patient name, ID, or injection name..."
                  value={searchPatient}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "in-progress", "completed", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      variant={selectedStatus === status ? "default" : "outline"}
                      className={selectedStatus === status ? "bg-purple-600" : ""}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Injections List */}
        <div className="space-y-4">
          {loadingInjections ? (
            <div className="text-center py-8">Loading injections...</div>
          ) : filteredInjections.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No injections found
              </CardContent>
            </Card>
          ) : (
            filteredInjections.map((injection) => (
              <Card key={injection._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Left Column */}
                    <div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Patient</p>
                        <p className="font-semibold text-lg">{injection.patientId.userId?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-500">ID: {injection.patientId.patientId}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Injection Name</p>
                        <p className="font-semibold">{injection.injectionName}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Type</p>
                        <Badge className="bg-blue-100 text-blue-800">{injection.injectionType}</Badge>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Dose & Frequency</p>
                        <p className="font-semibold">{injection.dose}</p>
                        <p className="text-sm text-gray-500">{injection.frequency}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(injection.status)}
                          <Badge className={getStatusColor(injection.status)}>
                            {injection.status.charAt(0).toUpperCase() + injection.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={editingNotes[injection._id] || injection.notes || ""}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({
                          ...prev,
                          [injection._id]: e.target.value,
                        }))
                      }
                      placeholder="Add notes about the injection..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {injection.status !== "completed" && injection.status !== "cancelled" && (
                      <>
                        {injection.status === "pending" && (
                          <Button
                            onClick={() => handleUpdateStatus(injection._id, "in-progress")}
                            disabled={updatingId === injection._id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Start Injection
                          </Button>
                        )}
                        <Button
                          onClick={() => handleUpdateStatus(injection._id, "completed")}
                          disabled={updatingId === injection._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Done
                        </Button>
                      </>
                    )}
                    {injection.status !== "cancelled" && (
                      <Button
                        onClick={() => handleUpdateStatus(injection._id, "cancelled")}
                        disabled={updatingId === injection._id}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Scanned Patient Injections */}
        {scannedPatient && patientInjections.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💊 Injections for {scannedPatient.userId?.name}
            </h2>
            <div className="space-y-4">
              {patientInjections.map((injection) => (
                <Card key={injection._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Left Column */}
                      <div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Injection Name</p>
                          <p className="font-semibold text-lg">{injection.injectionName}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Type</p>
                          <Badge className="bg-blue-100 text-blue-800">{injection.injectionType}</Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Dose & Frequency</p>
                          <p className="font-semibold">{injection.dose}</p>
                          <p className="text-sm text-gray-500">{injection.frequency}</p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(injection.status)}
                            <Badge className={getStatusColor(injection.status)}>
                              {injection.status.charAt(0).toUpperCase() + injection.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Prescribed by</p>
                          <p className="font-semibold">{injection.doctorId.userId?.name || "Unknown"}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="text-sm text-gray-500">
                            {new Date(injection.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={editingNotes[injection._id] || injection.notes || ""}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({
                            ...prev,
                            [injection._id]: e.target.value,
                          }))
                        }
                        placeholder="Add notes about the injection..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {injection.status !== "completed" && injection.status !== "cancelled" && (
                        <>
                          {injection.status === "pending" && (
                            <Button
                              onClick={() => handleUpdateStatus(injection._id, "in-progress")}
                              disabled={updatingId === injection._id}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Start Injection
                            </Button>
                          )}
                          <Button
                            onClick={() => handleUpdateStatus(injection._id, "completed")}
                            disabled={updatingId === injection._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Done
                          </Button>
                        </>
                      )}
                      {injection.status !== "cancelled" && (
                        <Button
                          onClick={() => handleUpdateStatus(injection._id, "cancelled")}
                          disabled={updatingId === injection._id}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {injections.length > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{injections.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {injections.filter((i) => i.status === "pending").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {injections.filter((i) => i.status === "in-progress").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {injections.filter((i) => i.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

