"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, TrendingUp, DollarSign, FileText, Package } from "lucide-react"

interface Bill {
  _id: string
  billNumber: string
  patientName: string
  patientPhone: string
  pharmacistName: string
  items: any[]
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

interface SalesReport {
  totalRevenue: number
  totalBills: number
  totalItems: number
  averageBillValue: number
}

interface MedicineStats {
  name: string
  totalQuantity: number
  totalRevenue: number
  totalSales: number
}

export default function SalesReport() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [bills, setBills] = useState<Bill[]>([])
  const [medicineStats, setMedicineStats] = useState<MedicineStats[]>([])
  const [report, setReport] = useState<SalesReport | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchSalesReport()
    }
  }, [isAuthenticated, user])

  const fetchSalesReport = async (start?: string, end?: string) => {
    try {
      setLoadingData(true)
      setError("")
      const token = localStorage.getItem("auth_token")

      // Fetch sales report
      const reportParams = new URLSearchParams()
      if (start) reportParams.append("startDate", start)
      if (end) reportParams.append("endDate", end)

      const reportResponse = await fetch(
        `http://localhost:5000/api/billing/report/sales?${reportParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!reportResponse.ok) throw new Error("Failed to fetch sales report")
      const reportData = await reportResponse.json()
      setReport(reportData.summary)
      setBills(reportData.bills || [])

      // Fetch medicine report
      const medicineResponse = await fetch(
        `http://localhost:5000/api/billing/report/medicines?${reportParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (medicineResponse.ok) {
        const medicineData = await medicineResponse.json()
        setMedicineStats(medicineData.medicineReport || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching report")
    } finally {
      setLoadingData(false)
    }
  }

  const handleFilterByDate = () => {
    fetchSalesReport(startDate, endDate)
  }

  const handleExportCSV = () => {
    if (!bills || bills.length === 0) {
      setError("No data to export")
      return
    }

    const headers = ["Bill Number", "Patient Name", "Pharmacist", "Total Amount", "Payment Status", "Date"]
    const rows = bills.map((bill) => [
      bill.billNumber,
      bill.patientName,
      bill.pharmacistName || "N/A",
      bill.totalAmount.toFixed(2),
      bill.paymentStatus,
      new Date(bill.createdAt).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Sales Report</h1>
          <p className="text-gray-600 mt-2">View pharmacy sales and medicine statistics</p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Date Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleFilterByDate} className="bg-blue-600 hover:bg-blue-700">
                Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                  fetchSalesReport()
                }}
              >
                Reset
              </Button>
              <Button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{report.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Bills</p>
                    <p className="text-2xl font-bold text-green-600">{report.totalBills}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Items</p>
                    <p className="text-2xl font-bold text-purple-600">{report.totalItems}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Bill Value</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{report.averageBillValue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Medicine Statistics */}
        {medicineStats.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Selling Medicines</CardTitle>
              <CardDescription>Medicine sales statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Medicine Name</th>
                      <th className="text-right py-3 px-4 font-semibold">Quantity Sold</th>
                      <th className="text-right py-3 px-4 font-semibold">Total Sales</th>
                      <th className="text-right py-3 px-4 font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStats.map((medicine, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{medicine.name}</td>
                        <td className="text-right py-3 px-4">{medicine.totalQuantity}</td>
                        <td className="text-right py-3 px-4">{medicine.totalSales}</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          ₹{medicine.totalRevenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bills List */}
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
            <CardDescription>{bills.length} bills found</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-center py-8">Loading...</div>
            ) : bills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bills found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Bill Number</th>
                      <th className="text-left py-3 px-4 font-semibold">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold">Pharmacist</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{bill.billNumber}</td>
                        <td className="py-3 px-4">{bill.patientName}</td>
                        <td className="py-3 px-4">{bill.pharmacistName || "N/A"}</td>
                        <td className="text-right py-3 px-4 font-bold">
                          ₹{bill.totalAmount.toFixed(2)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge
                            variant={bill.paymentStatus === "completed" ? "default" : "secondary"}
                          >
                            {bill.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

