"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockPatients, mockPrescriptions, mockMedicinePurchases } from "@/lib/mock-data"
import type { Patient, Prescription } from "@/lib/types"

interface MedicinePurchase {
  id: string
  prescriptionId: string
  patientId: string
  quantity: number
  quantityDispensed: number
  purchased: boolean
  purchasedAt?: string
}

export default function PharmacistPatientDetails() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { t } = useLanguage()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [medicinePurchases, setMedicinePurchases] = useState<MedicinePurchase[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ quantity: number; dispensed: number }>({ quantity: 0, dispensed: 0 })

  useEffect(() => {
    if (!user || user.role !== "pharmacist") {
      router.push("/")
      return
    }

    const foundPatient = mockPatients.find((p) => p.id === patientId)
    if (foundPatient) {
      setPatient(foundPatient)
      const patientPrescriptions = mockPrescriptions.filter((p) => p.patientId === patientId)
      setPrescriptions(patientPrescriptions)

      // Get or create medicine purchases for this patient's prescriptions
      const purchases = patientPrescriptions.map((presc) => {
        const existing = mockMedicinePurchases.find((mp) => mp.prescriptionId === presc.id)
        return (
          existing || {
            id: `med_purchase_${presc.id}`,
            prescriptionId: presc.id,
            patientId: patientId,
            quantity: 10,
            quantityDispensed: 0,
            purchased: false,
          }
        )
      })
      setMedicinePurchases(purchases)
    }
  }, [patientId, user, router])

  const handleEditClick = (purchase: MedicinePurchase) => {
    setEditingId(purchase.id)
    setEditValues({ quantity: purchase.quantity, dispensed: purchase.quantityDispensed })
  }

  const handleSaveEdit = (purchaseId: string) => {
    setMedicinePurchases((prev) =>
      prev.map((p) =>
        p.id === purchaseId
          ? {
              ...p,
              quantity: editValues.quantity,
              quantityDispensed: editValues.dispensed,
            }
          : p,
      ),
    )
    setEditingId(null)
  }

  const handleMarkAsPurchased = (purchaseId: string) => {
    setMedicinePurchases((prev) =>
      prev.map((p) =>
        p.id === purchaseId
          ? {
              ...p,
              purchased: true,
              purchasedAt: new Date().toISOString(),
            }
          : p,
      ),
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button onClick={() => router.back()} variant="outline" className="mb-4">
              {t("back")}
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{t("medicineManagement")}</h1>
            <p className="text-gray-600 mt-2">
              {t("patientId")}: {patient.patientId} | {patient.name}
            </p>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("patientInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t("fullName")}</p>
                <p className="font-semibold">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("age")}</p>
                <p className="font-semibold">{patient.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("sex")}</p>
                <p className="font-semibold">{patient.sex}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("phone")}</p>
                <p className="font-semibold">{patient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescribed Medicines */}
        <Card>
          <CardHeader>
            <CardTitle>{t("prescribedMedicines")}</CardTitle>
            <CardDescription>Edit quantities and mark medicines as purchased</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Medicine</th>
                    <th className="text-left py-3 px-4 font-semibold">Route</th>
                    <th className="text-left py-3 px-4 font-semibold">Dose</th>
                    <th className="text-left py-3 px-4 font-semibold">{t("totalQuantity")}</th>
                    <th className="text-left py-3 px-4 font-semibold">{t("quantityDispensed")}</th>
                    <th className="text-left py-3 px-4 font-semibold">{t("purchaseStatus")}</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicinePurchases.map((purchase, index) => {
                    const prescription = prescriptions.find((p) => p.id === purchase.prescriptionId)
                    if (!prescription) return null

                    return (
                      <tr key={purchase.id} className="border-b hover:bg-orange-50">
                        <td className="py-3 px-4">{prescription.medicine}</td>
                        <td className="py-3 px-4">{prescription.route}</td>
                        <td className="py-3 px-4">{prescription.dose}</td>
                        <td className="py-3 px-4">
                          {editingId === purchase.id ? (
                            <Input
                              type="number"
                              value={editValues.quantity}
                              onChange={(e) =>
                                setEditValues((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 0 }))
                              }
                              className="w-20"
                            />
                          ) : (
                            purchase.quantity
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingId === purchase.id ? (
                            <Input
                              type="number"
                              value={editValues.dispensed}
                              onChange={(e) =>
                                setEditValues((prev) => ({ ...prev, dispensed: Number.parseInt(e.target.value) || 0 }))
                              }
                              className="w-20"
                            />
                          ) : (
                            purchase.quantityDispensed
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              purchase.purchased ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {purchase.purchased ? t("purchased") : t("notPurchased")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {editingId === purchase.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(purchase.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {t("save")}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                  {t("cancel")}
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleEditClick(purchase)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {t("editQuantity")}
                                </Button>
                                {!purchase.purchased && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkAsPurchased(purchase.id)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    {t("markAsPurchased")}
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
