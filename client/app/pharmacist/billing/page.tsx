"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, Trash2, DollarSign, FileText, Download, Printer, ArrowLeft, Edit2, Save, X } from "lucide-react"

interface BillItem {
  medicineName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  prescriptionId?: string
  route?: string
  dose?: string
  frequency?: string
}

interface Bill {
  _id: string
  billNumber: string
  patientName: string
  patientPhone: string
  items: BillItem[]
  subtotal: number
  discount: number
  discountPercentage: number
  tax: number
  taxPercentage: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

export default function PharmacistBilling() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading } = useAuth()
  const [bills, setBills] = useState<Bill[]>([])
  const [loadingBills, setLoadingBills] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showNewBill, setShowNewBill] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [patientIdFromQueue, setPatientIdFromQueue] = useState<string | null>(null)
  const [editingBillId, setEditingBillId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<{
    items: BillItem[]
    discountPercentage: number
    taxPercentage: number
    paymentMethod: string
  } | null>(null)

  // New bill form state
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    items: [{ medicineName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
    discountPercentage: 0,
    taxPercentage: 0,
    paymentMethod: "cash",
    notes: "",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pharmacist/signin")
    }
  }, [isAuthenticated, loading, router])

  // Pre-fill data from queue if coming from queue page
  useEffect(() => {
    const patientName = searchParams.get("patientName")
    const patientPhone = searchParams.get("patientPhone")
    const patientId = searchParams.get("patientId")
    const prescriptionsJson = searchParams.get("prescriptions")

    if (patientName && patientPhone && prescriptionsJson) {
      setPatientIdFromQueue(patientId)
      setShowNewBill(true)

      try {
        const prescriptions = JSON.parse(prescriptionsJson)
        const billItems = prescriptions.map((prescription: any) => ({
          medicineName: prescription.medicine,
          quantity: 1,
          unitPrice: 0, // Will be filled by pharmacist
          totalPrice: 0,
          prescriptionId: prescription._id,
          route: prescription.route,
          dose: prescription.dose,
          frequency: prescription.frequency,
        }))

        setFormData({
          patientName,
          patientPhone,
          items: billItems.length > 0 ? billItems : [{ medicineName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
          discountPercentage: 0,
          taxPercentage: 0,
          paymentMethod: "cash",
          notes: "",
        })
      } catch (err) {
        console.error("Error parsing prescriptions:", err)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated && user?.role === "pharmacist") {
      fetchBills()
    }
  }, [isAuthenticated, user])

  const fetchBills = async () => {
    try {
      setLoadingBills(true)
      setError("")
      const token = localStorage.getItem("auth_token")

      const response = await fetch("http://localhost:5000/api/billing/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch bills")
      const data = await response.json()
      setBills(data.bills || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching bills")
    } finally {
      setLoadingBills(false)
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { medicineName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice
    }
    setFormData({ ...formData, items: newItems })
  }

  const handleCreateBill = async () => {
    try {
      setError("")

      // Validate patient name
      if (!formData.patientName || formData.patientName.trim() === "") {
        setError("❌ Patient name is required")
        return
      }

      // Validate items
      if (formData.items.length === 0) {
        setError("❌ At least one medicine is required")
        return
      }

      // Validate that all items have medicine name and price
      const invalidItems = formData.items.filter(item => !item.medicineName || item.medicineName.trim() === "")
      if (invalidItems.length > 0) {
        setError("❌ All medicines must have a name")
        return
      }

      const zeropriceItems = formData.items.filter(item => item.unitPrice <= 0)
      if (zeropriceItems.length > 0) {
        setError("❌ All medicines must have a price greater than 0")
        return
      }

      const token = localStorage.getItem("auth_token")

      console.log('📝 Sending bill creation request...')
      const response = await fetch("http://localhost:5000/api/billing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: patientIdFromQueue || "mock-patient-id",
          patientName: formData.patientName,
          patientPhone: formData.patientPhone,
          items: formData.items,
          discountPercentage: formData.discountPercentage,
          taxPercentage: formData.taxPercentage,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      })

      console.log('📝 Response status:', response.status)

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        console.error('❌ Response content-type:', contentType)

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.details || errorData.error || "Failed to create bill")
        } else {
          const errorText = await response.text()
          console.error('❌ Error response:', errorText)
          throw new Error("Server error: " + response.statusText)
        }
      }

      const data = await response.json()
      console.log('✅ Bill created:', data)

      // If coming from queue, remove patient from queue
      if (patientIdFromQueue) {
        try {
          await fetch(`http://localhost:5000/api/queue/remove/${patientIdFromQueue}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        } catch (err) {
          console.error("Error removing patient from queue:", err)
        }
      }

      // Create sales record
      try {
        console.log('📊 Creating sales record for bill:', data.bill._id)
        await fetch(`http://localhost:5000/api/sales/create-from-bill/${data.bill._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('✅ Sales record created')
      } catch (err) {
        console.error("Error creating sales record:", err)
      }

      setSuccess("Bill created successfully!")
      setSelectedBill(data.bill)
      setShowNewBill(false)
      setFormData({
        patientName: "",
        patientPhone: "",
        items: [{ medicineName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
        discountPercentage: 0,
        taxPercentage: 0,
        paymentMethod: "cash",
        notes: "",
      })
      setPatientIdFromQueue(null)
      fetchBills()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating bill")
    }
  }

  const calculateBillTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const discount = (subtotal * formData.discountPercentage) / 100
    const taxableAmount = subtotal - discount
    const tax = (taxableAmount * formData.taxPercentage) / 100
    return {
      subtotal,
      discount,
      tax,
      total: taxableAmount + tax,
    }
  }

  const calculateEditBillTotal = () => {
    if (!editFormData) return { subtotal: 0, discount: 0, tax: 0, total: 0 }
    const subtotal = editFormData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const discount = (subtotal * editFormData.discountPercentage) / 100
    const taxableAmount = subtotal - discount
    const tax = (taxableAmount * editFormData.taxPercentage) / 100
    return {
      subtotal,
      discount,
      tax,
      total: taxableAmount + tax,
    }
  }

  const handleEditBill = (bill: Bill) => {
    setEditingBillId(bill._id)
    setEditFormData({
      items: bill.items,
      discountPercentage: bill.discountPercentage,
      taxPercentage: bill.taxPercentage,
      paymentMethod: bill.paymentMethod,
    })
  }

  const handleEditItemChange = (index: number, field: string, value: any) => {
    if (!editFormData) return
    const newItems = [...editFormData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice
    }
    setEditFormData({ ...editFormData, items: newItems })
  }

  const handleRemoveEditItem = (index: number) => {
    if (!editFormData) return
    setEditFormData({
      ...editFormData,
      items: editFormData.items.filter((_, i) => i !== index),
    })
  }

  const handleSaveEditBill = async () => {
    try {
      if (!editingBillId || !editFormData) return

      const token = localStorage.getItem("auth_token")
      const editBillTotal = calculateEditBillTotal()

      const response = await fetch(`http://localhost:5000/api/billing/${editingBillId}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: editFormData.items,
          discountPercentage: editFormData.discountPercentage,
          taxPercentage: editFormData.taxPercentage,
          paymentMethod: editFormData.paymentMethod,
          subtotal: editBillTotal.subtotal,
          discount: editBillTotal.discount,
          tax: editBillTotal.tax,
          totalAmount: editBillTotal.total,
        }),
      })

      if (!response.ok) throw new Error("Failed to update bill")

      setSuccess("Bill updated successfully!")
      setEditingBillId(null)
      setEditFormData(null)
      fetchBills()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating bill")
    }
  }

  const handleCancelEdit = () => {
    setEditingBillId(null)
    setEditFormData(null)
  }

  const handlePrintBill = (bill: Bill) => {
    const printWindow = window.open("", "", "height=600,width=800")
    if (printWindow) {
      const billHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bill - ${bill.billNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #333; }
            .header p { margin: 5px 0; color: #666; }
            .bill-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .bill-info div { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background-color: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .totals { width: 100%; max-width: 400px; margin-left: auto; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 Hospital Pharmacy Bill</h1>
            <p>Bill Number: ${bill.billNumber}</p>
          </div>

          <div class="bill-info">
            <div>
              <strong>Patient Name:</strong> ${bill.patientName}<br/>
              <strong>Phone:</strong> ${bill.patientPhone}<br/>
              <strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Payment Method:</strong> ${bill.paymentMethod.toUpperCase()}<br/>
              <strong>Payment Status:</strong> ${bill.paymentStatus.toUpperCase()}<br/>
              <strong>Bill Status:</strong> ${bill.status.toUpperCase()}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.medicineName}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unitPrice.toFixed(2)}</td>
                  <td>₹${item.totalPrice.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${bill.subtotal.toFixed(2)}</span>
            </div>
            ${bill.discount > 0 ? `
              <div class="totals-row">
                <span>Discount (${bill.discountPercentage}%):</span>
                <span>-₹${bill.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${bill.tax > 0 ? `
              <div class="totals-row">
                <span>Tax (${bill.taxPercentage}%):</span>
                <span>₹${bill.tax.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row total">
              <span>Total Amount:</span>
              <span>₹${bill.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Printed on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `
      printWindow.document.write(billHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "pharmacist") {
    return null
  }

  const billTotals = calculateBillTotal()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {patientIdFromQueue && (
              <Button
                onClick={() => router.push("/pharmacist/queue")}
                variant="outline"
                className="border-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Queue
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💊 Billing System</h1>
              <p className="text-gray-600 mt-2">Manage medicine billing and sales</p>
            </div>
          </div>
          {!patientIdFromQueue && (
            <Button
              onClick={() => setShowNewBill(!showNewBill)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Bill
            </Button>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* New Bill Form */}
        {showNewBill && (
          <Card className="mb-8 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>Create New Bill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <Input
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Phone
                  </label>
                  <Input
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Medicine Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Medicines * (Name and Price required)
                </label>
                <div className="space-y-3">
                  {formData.items.map((item, index) => {
                    const hasName = item.medicineName && item.medicineName.trim() !== ""
                    const hasPrice = item.unitPrice > 0
                    return (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Input
                            placeholder="Medicine name *"
                            value={item.medicineName}
                            onChange={(e) => handleItemChange(index, "medicineName", e.target.value)}
                            className={`${!hasName && item.medicineName !== "" ? "border-red-500" : ""}`}
                          />
                          {!hasName && item.medicineName !== "" && (
                            <p className="text-xs text-red-500 mt-1">Medicine name required</p>
                          )}
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Unit Price *"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            className={`${!hasPrice && item.unitPrice !== 0 ? "border-red-500" : ""}`}
                            min="0"
                            step="0.01"
                          />
                          {!hasPrice && item.unitPrice !== 0 && (
                            <p className="text-xs text-red-500 mt-1">Price required</p>
                          )}
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Total"
                            value={item.totalPrice}
                            onChange={(e) => handleItemChange(index, "totalPrice", parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="font-semibold bg-blue-50"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddItem}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </div>

              {/* Discount & Tax */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount %
                  </label>
                  <Input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })
                    }
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax %
                  </label>
                  <Input
                    type="number"
                    value={formData.taxPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, taxPercentage: parseFloat(e.target.value) || 0 })
                    }
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{billTotals.subtotal.toFixed(2)}</span>
                </div>
                {billTotals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{billTotals.discount.toFixed(2)}</span>
                  </div>
                )}
                {billTotals.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{billTotals.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{billTotals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateBill}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Bill
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewBill(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bills List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bills</h2>
          {loadingBills ? (
            <div className="text-center py-8">Loading bills...</div>
          ) : bills.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No bills created yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bills.map((bill) => (
                <div key={bill._id}>
                  {editingBillId === bill._id && editFormData ? (
                    // Edit Mode
                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle>Edit Bill - {bill.billNumber}</CardTitle>
                        <CardDescription>Update bill items and amounts</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Edit Items */}
                        <div>
                          <h3 className="font-semibold mb-4">Bill Items</h3>
                          <div className="space-y-3">
                            {editFormData.items.map((item, index) => (
                              <div key={index} className="flex gap-3 items-end">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">Medicine</label>
                                  <Input
                                    value={item.medicineName}
                                    onChange={(e) =>
                                      handleEditItemChange(index, "medicineName", e.target.value)
                                    }
                                    placeholder="Medicine name"
                                  />
                                </div>
                                <div className="w-20">
                                  <label className="text-xs text-gray-600">Qty</label>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleEditItemChange(index, "quantity", parseInt(e.target.value) || 1)
                                    }
                                    min="1"
                                  />
                                </div>
                                <div className="w-24">
                                  <label className="text-xs text-gray-600">Unit Price</label>
                                  <Input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      handleEditItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)
                                    }
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                                <div className="w-24">
                                  <label className="text-xs text-gray-600">Total Price</label>
                                  <Input
                                    type="number"
                                    value={item.totalPrice}
                                    onChange={(e) =>
                                      handleEditItemChange(index, "totalPrice", parseFloat(e.target.value) || 0)
                                    }
                                    min="0"
                                    step="0.01"
                                    className="font-semibold"
                                  />
                                </div>
                                <Button
                                  onClick={() => handleRemoveEditItem(index)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Discount & Tax */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount %
                            </label>
                            <Input
                              type="number"
                              value={editFormData.discountPercentage}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  discountPercentage: parseFloat(e.target.value) || 0,
                                })
                              }
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tax %
                            </label>
                            <Input
                              type="number"
                              value={editFormData.taxPercentage}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  taxPercentage: parseFloat(e.target.value) || 0,
                                })
                              }
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>

                        {/* Bill Summary */}
                        {(() => {
                          const totals = calculateEditBillTotal()
                          return (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{totals.subtotal.toFixed(2)}</span>
                              </div>
                              {totals.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount:</span>
                                  <span>-₹{totals.discount.toFixed(2)}</span>
                                </div>
                              )}
                              {totals.tax > 0 && (
                                <div className="flex justify-between">
                                  <span>Tax:</span>
                                  <span>₹{totals.tax.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>₹{totals.total.toFixed(2)}</span>
                              </div>
                            </div>
                          )
                        })()}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSaveEditBill}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // View Mode
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{bill.billNumber}</h3>
                            <p className="text-gray-600">{bill.patientName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ₹{bill.totalAmount.toFixed(2)}
                            </div>
                            <Badge variant={bill.paymentStatus === "completed" ? "default" : "secondary"}>
                              {bill.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {bill.items.length} items • {new Date(bill.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditBill(bill)}
                              variant="outline"
                              size="sm"
                              className="border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handlePrintBill(bill)}
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

