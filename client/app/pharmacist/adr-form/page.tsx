"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowLeft, Download, Printer } from "lucide-react"

interface ADRFormData {
  patientName: string
  patientAge: string
  patientGender: string
  medicineNames: string
  adverseReaction: string
  severity: string
  dateOfOnset: string
  actionTaken: string
  outcome: string
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  additionalNotes: string
}

export default function ADRForm() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [formData, setFormData] = useState<ADRFormData>({
    patientName: "",
    patientAge: "",
    patientGender: "",
    medicineNames: "",
    adverseReaction: "",
    severity: "mild",
    dateOfOnset: "",
    actionTaken: "",
    outcome: "ongoing",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    additionalNotes: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pharmacist/signin")
    }
  }, [loading, isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate required fields
    if (!formData.patientName || !formData.medicineNames || !formData.adverseReaction) {
      setError("❌ Please fill in all required fields")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/adr/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          submittedBy: user?.id,
          submittedByName: user?.name,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit ADR form")
      }

      const data = await response.json()
      setSuccess("✅ ADR form submitted successfully!")
      setSubmitted(true)

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          patientName: "",
          patientAge: "",
          patientGender: "",
          medicineNames: "",
          adverseReaction: "",
          severity: "mild",
          dateOfOnset: "",
          actionTaken: "",
          outcome: "ongoing",
          reporterName: "",
          reporterPhone: "",
          reporterEmail: "",
          additionalNotes: "",
        })
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      console.error("Error submitting ADR form:", err)
      setError("❌ Failed to submit ADR form. Please try again.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const content = `
ADVERSE DRUG REACTION (ADR) FORM
================================

PATIENT INFORMATION
-------------------
Patient Name: ${formData.patientName}
Age: ${formData.patientAge}
Gender: ${formData.patientGender}

MEDICINE INFORMATION
--------------------
Medicine Names: ${formData.medicineNames}

ADVERSE REACTION DETAILS
------------------------
Adverse Reaction: ${formData.adverseReaction}
Severity: ${formData.severity}
Date of Onset: ${formData.dateOfOnset}
Action Taken: ${formData.actionTaken}
Outcome: ${formData.outcome}

REPORTER INFORMATION
--------------------
Reporter Name: ${formData.reporterName}
Phone: ${formData.reporterPhone}
Email: ${formData.reporterEmail}

ADDITIONAL NOTES
----------------
${formData.additionalNotes}

Submitted on: ${new Date().toLocaleString()}
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `ADR_Form_${formData.patientName}_${new Date().getTime()}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">⚠️ Adverse Drug Reaction (ADR) Form</h1>
          <p className="text-gray-600 mt-2">Report any adverse drug reactions to ensure patient safety</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-800">{success}</p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>ADR Report Details</CardTitle>
            <CardDescription>Fill in all required fields marked with *</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">👤 Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name *
                    </label>
                    <Input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <Input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medicine Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">💊 Medicine Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Names *
                  </label>
                  <textarea
                    name="medicineNames"
                    value={formData.medicineNames}
                    onChange={handleInputChange}
                    placeholder="Enter medicine names (comma separated)"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Adverse Reaction Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">⚠️ Adverse Reaction Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adverse Reaction Description *
                    </label>
                    <textarea
                      name="adverseReaction"
                      value={formData.adverseReaction}
                      onChange={handleInputChange}
                      placeholder="Describe the adverse reaction in detail"
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="life-threatening">Life-threatening</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Onset
                      </label>
                      <Input
                        type="date"
                        name="dateOfOnset"
                        value={formData.dateOfOnset}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Taken
                    </label>
                    <textarea
                      name="actionTaken"
                      value={formData.actionTaken}
                      onChange={handleInputChange}
                      placeholder="Describe the action taken in response to the ADR"
                      className="w-full px-3 py-2 border rounded-md"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outcome
                    </label>
                    <select
                      name="outcome"
                      value={formData.outcome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="recovered">Recovered</option>
                      <option value="recovering">Recovering</option>
                      <option value="not-recovered">Not Recovered</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reporter Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">👨‍⚕️ Reporter Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reporter Name
                    </label>
                    <Input
                      type="text"
                      name="reporterName"
                      value={formData.reporterName}
                      onChange={handleInputChange}
                      placeholder="Enter reporter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="reporterPhone"
                      value={formData.reporterPhone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="reporterEmail"
                      value={formData.reporterEmail}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information about the ADR"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  📤 Submit ADR Form
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  className="flex-1"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

