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
  const [formData, setFormData] = useState({
    chemicalName: "",
    brandName: "",
    quantity: "",
  })

  useEffect(() => {
    if (!user || user.role !== "pharmacist") {
      router.push("/")
      return
    }

    // Load medicines from localStorage or use mock data
    const stored = localStorage.getItem("medicines")
    if (stored) {
      setMedicines(JSON.parse(stored))
    } else {
      setMedicines(mockMedicines)
      localStorage.setItem("medicines", JSON.stringify(mockMedicines))
    }
  }, [user, router])

  const saveMedicines = (updatedMedicines: Medicine[]) => {
    setMedicines(updatedMedicines)
    localStorage.setItem("medicines", JSON.stringify(updatedMedicines))
  }

  const handleAddMedicine = () => {
    if (!formData.chemicalName || !formData.brandName || !formData.quantity) {
      alert("Please fill all fields")
      return
    }

    if (editingId) {
      // Update existing medicine
      const updated = medicines.map((med) =>
        med.id === editingId
          ? {
              ...med,
              chemicalName: formData.chemicalName,
              brandName: formData.brandName,
              quantity: Number.parseInt(formData.quantity),
            }
          : med,
      )
      saveMedicines(updated)
      setEditingId(null)
    } else {
      // Add new medicine
      const newMedicine: Medicine = {
        id: `med_${Date.now()}`,
        chemicalName: formData.chemicalName,
        brandName: formData.brandName,
        quantity: Number.parseInt(formData.quantity),
        addedAt: new Date().toISOString(),
      }
      saveMedicines([...medicines, newMedicine])
    }

    setFormData({ chemicalName: "", brandName: "", quantity: "" })
    setShowForm(false)
  }

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      chemicalName: medicine.chemicalName,
      brandName: medicine.brandName,
      quantity: medicine.quantity.toString(),
    })
    setEditingId(medicine.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      saveMedicines(medicines.filter((med) => med.id !== id))
    }
  }

  const handleReduceQuantity = (id: string, amount: number) => {
    const updated = medicines.map((med) =>
      med.id === id ? { ...med, quantity: Math.max(0, med.quantity - amount) } : med,
    )
    saveMedicines(updated)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ chemicalName: "", brandName: "", quantity: "" })
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

        {/* Add Medicine Form */}
        {showForm && (
          <Card className="mb-6 border-2 border-orange-300">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chemical Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Paracetamol"
                    value={formData.chemicalName}
                    onChange={(e) => setFormData({ ...formData, chemicalName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Crocin"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="flex items-end gap-2">
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
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine.id} className="border-b border-gray-100 hover:bg-orange-50">
                        <td className="py-3 px-4 text-gray-900">{medicine.chemicalName}</td>
                        <td className="py-3 px-4 text-gray-900">{medicine.brandName}</td>
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
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => handleEdit(medicine)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleReduceQuantity(medicine.id, 1)}
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                              title="Reduce quantity by 1 (when medicine is bought)"
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
                    ))}
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
