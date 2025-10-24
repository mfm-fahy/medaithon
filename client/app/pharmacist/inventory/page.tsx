"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import type { Medicine } from "@/lib/types"
import { mockMedicines } from "@/lib/mock-data"

export default function MedicineInventory() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [formData, setFormData] = useState({
    chemicalName: "",
    brandName: "",
    quantity: "",
    price: "",
    expiryDate: "",
    manufacturer: "",
    batchNumber: "",
  })

  // Fetch medicines from backend
  useEffect(() => {
    if (!user || user.role !== "pharmacist") {
      router.push("/")
      return
    }

    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch("http://localhost:5000/api/medicines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setMedicines(data)
        } else {
          // Fallback to mock data
          setMedicines(mockMedicines)
        }
      } catch (err) {
        console.error("Error fetching medicines:", err)
        setMedicines(mockMedicines)
      }
    }

    fetchMedicines()
  }, [user, router])

  // WebSocket for real-time medicine updates
  useEffect(() => {
    if (!user || user.role !== "pharmacist") return

    const pharmacistId = (user as any)._id || (user as any)?.id
    const token = localStorage.getItem("auth_token")

    const ws = new WebSocket(`ws://localhost:5000?pharmacistId=${pharmacistId}&token=${token}`)

    ws.onopen = () => {
      console.log("✅ WebSocket connected for pharmacist")
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("📨 WebSocket message received:", message)

        if (message.type === "medicine-added" || message.type === "medicine-updated" || message.type === "medicine-dispensed") {
          // Refresh medicines list
          const fetchMedicines = async () => {
            try {
              const token = localStorage.getItem("auth_token")
              const response = await fetch("http://localhost:5000/api/medicines", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              if (response.ok) {
                const data = await response.json()
                setMedicines(data)
              }
            } catch (err) {
              console.error("Error fetching medicines:", err)
            }
          }

          fetchMedicines()
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setWsConnected(false)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setWsConnected(false)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [user])

  const saveMedicines = (updatedMedicines: Medicine[]) => {
    setMedicines(updatedMedicines)
    localStorage.setItem("medicines", JSON.stringify(updatedMedicines))
  }

  const handleAddMedicine = async () => {
    if (!formData.chemicalName || !formData.brandName || !formData.quantity || !formData.expiryDate) {
      alert("Please fill all required fields (including expiry date)")
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:5000/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chemicalName: formData.chemicalName,
          brandName: formData.brandName,
          quantity: Number.parseInt(formData.quantity),
          price: formData.price ? Number.parseFloat(formData.price) : 0,
          expiryDate: formData.expiryDate,
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert("Medicine added successfully!")
        setFormData({ chemicalName: "", brandName: "", quantity: "", price: "", expiryDate: "", manufacturer: "", batchNumber: "" })
        setShowForm(false)
        setEditingId(null)

        // Refresh medicines list
        const medicinesResponse = await fetch("http://localhost:5000/api/medicines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (medicinesResponse.ok) {
          const medicinesData = await medicinesResponse.json()
          setMedicines(medicinesData)
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (err) {
      console.error("Error adding medicine:", err)
      alert("Failed to add medicine")
    }
  }

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      chemicalName: medicine.chemicalName,
      brandName: medicine.brandName,
      quantity: medicine.quantity.toString(),
      price: ((medicine as any).price || "").toString(),
      expiryDate: (medicine as any).expiryDate ? new Date((medicine as any).expiryDate).toISOString().split('T')[0] : "",
      manufacturer: (medicine as any).manufacturer || "",
      batchNumber: (medicine as any).batchNumber || "",
    })
    setEditingId(medicine.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      saveMedicines(medicines.filter((med) => med.id !== id))
    }
  }

  const handleReduceQuantity = async (id: string, amount: number) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:5000/api/medicines/${id}/reduce-quantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: amount }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Medicine dispensed successfully! Remaining: ${data.remainingQuantity}`)

        // Refresh medicines list
        const medicinesResponse = await fetch("http://localhost:5000/api/medicines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (medicinesResponse.ok) {
          const medicinesData = await medicinesResponse.json()
          setMedicines(medicinesData)
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (err) {
      console.error("Error dispensing medicine:", err)
      alert("Failed to dispense medicine")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ chemicalName: "", brandName: "", quantity: "", price: "", expiryDate: "", manufacturer: "", batchNumber: "" })
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{t("medicineManagement")}</h1>
            <p className="text-gray-600 mt-1">
              {t("pharmacist")}: <strong>{user?.name}</strong>
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/pharmacist/dashboard")} variant="outline" className="bg-white">
              {t("back")}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="bg-white">
              {t("logout")}
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-600">
            {wsConnected ? "Real-time updates active" : "Connecting..."}
          </span>
        </div>

        {/* Add Medicine Form */}
        {showForm && (
          <Card className="mb-6 border-2 border-orange-300">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chemical Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Paracetamol"
                    value={formData.chemicalName}
                    onChange={(e) => setFormData({ ...formData, chemicalName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Crocin"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                  <Input
                    type="text"
                    placeholder="e.g., GSK"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                  <Input
                    type="text"
                    placeholder="e.g., BATCH123"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3 flex items-end gap-2">
                  <Button onClick={handleAddMedicine} className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update" : "Add"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Medicine Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-6 bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Medicine
          </Button>
        )}

        {/* Medicines Table */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
            <CardDescription>Total medicines: {medicines.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {medicines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Chemical Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Brand Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Expiry Date</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => {
                      const isExpired = (medicine as any).isExpired || new Date() > new Date((medicine as any).expiryDate);
                      const expiryDate = (medicine as any).expiryDate ? new Date((medicine as any).expiryDate).toLocaleDateString() : "N/A";

                      return (
                      <tr key={medicine.id} className={`border-b border-gray-100 ${isExpired ? "bg-red-50 hover:bg-red-100" : "hover:bg-orange-50"}`}>
                        <td className={`py-3 px-4 ${isExpired ? "text-red-900 font-semibold" : "text-gray-900"}`}>{medicine.chemicalName}</td>
                        <td className={`py-3 px-4 ${isExpired ? "text-red-900 font-semibold" : "text-gray-900"}`}>{medicine.brandName}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-semibold ${
                              medicine.quantity > 50
                                ? "bg-green-100 text-green-800"
                                : medicine.quantity > 20
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {medicine.quantity}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-center ${isExpired ? "text-red-600 font-semibold" : "text-gray-900"}`}>
                          {expiryDate}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            isExpired
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {isExpired ? "EXPIRED" : "ACTIVE"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => handleEdit(medicine)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-800"
                              disabled={isExpired}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleReduceQuantity(medicine.id, 1)}
                              size="sm"
                              className={`text-white ${isExpired ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}`}
                              title={isExpired ? "Cannot dispense expired medicine" : "Reduce quantity by 1 (when medicine is bought)"}
                              disabled={isExpired}
                            >
                              -1
                            </Button>
                            <Button
                              onClick={() => handleDelete(medicine.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No medicines in inventory</p>
                <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Medicine
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
