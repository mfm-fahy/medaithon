"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"

interface LabTest {
  _id: string
  testName: string
  sampleType: string
  status: "pending" | "in-progress" | "completed"
  estimatedTime?: string
  result?: string
  resultDate?: string
  uploadedFile?: {
    name: string
    type: string
    size: number
    uploadedAt: string
    data: string
  }
}

interface PatientData {
  _id: string
  patientId: string
  userId: {
    name: string
    email: string
  }
  age: number
  sex: string
}

export default function LabTechnicianTests() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const { user, isAuthenticated, loading } = useAuth()
  const patientId = params.id as string

  const [tests, setTests] = useState<LabTest[]>([])
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [estimatedHours, setEstimatedHours] = useState("")
  const [estimatedMinutes, setEstimatedMinutes] = useState("")
  const [resultValue, setResultValue] = useState("")
  const [showResultForm, setShowResultForm] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  // Fetch patient and lab tests
  const fetchPatientAndTests = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/lab-technician/signin")
        return
      }

      // Fetch patient details
      const patientRes = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!patientRes.ok) {
        throw new Error("Failed to fetch patient")
      }

      const patientData = await patientRes.json()
      setPatient(patientData.patient)

      // Fetch lab tests for this patient
      const testsRes = await fetch(`http://localhost:5000/api/patients/${patientId}/lab-tests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!testsRes.ok) {
        throw new Error("Failed to fetch lab tests")
      }

      const testsData = await testsRes.json()
      setTests(testsData)
      setPageLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/lab-technician/signin")
    } else if (!loading && isAuthenticated && patientId) {
      fetchPatientAndTests()
    }
  }, [isAuthenticated, loading, router, patientId])

  if (loading || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "labTechnician") {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
  }

  const handleEstimateTime = async (testId: string) => {
    try {
      if (!estimatedHours && !estimatedMinutes) {
        setMessage("❌ Please enter estimated time")
        return
      }

      setSubmitting(true)
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setMessage("❌ Authentication token not found")
        setSubmitting(false)
        return
      }

      const estimatedTime = `${estimatedHours || "0"}h ${estimatedMinutes || "0"}m`

      const response = await fetch(`http://localhost:5000/api/lab-tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "in-progress",
          estimatedTime: estimatedTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update test")
      }

      const data = await response.json()
      setTests(
        tests.map((test) =>
          test._id === testId
            ? {
                ...test,
                estimatedTime: estimatedTime,
                status: "in-progress",
              }
            : test,
        ),
      )
      setMessage("✅ Estimated time updated successfully")
      setEstimatedHours("")
      setEstimatedMinutes("")
      setSelectedTest(null)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : "Failed to update test"}`)
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddResult = async (testId: string) => {
    try {
      if (!resultValue.trim()) {
        setMessage("❌ Please enter a result value")
        return
      }

      setSubmitting(true)
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setMessage("❌ Authentication token not found")
        setSubmitting(false)
        return
      }

      const response = await fetch(`http://localhost:5000/api/lab-tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
          result: resultValue,
          resultDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add result")
      }

      const data = await response.json()
      setTests(
        tests.map((test) =>
          test._id === testId
            ? {
                ...test,
                result: resultValue,
                resultDate: new Date().toISOString(),
                status: "completed",
              }
            : test,
        ),
      )
      setMessage("✅ Result added successfully and sent to doctor & patient")
      setResultValue("")
      setShowResultForm(false)
      setSelectedTest(null)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : "Failed to add result"}`)
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileUpload = async (testId: string, file: File) => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setMessage("❌ Authentication token not found")
        setSubmitting(false)
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const fileData = e.target?.result as string

          const response = await fetch(`http://localhost:5000/api/lab-tests/${testId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "completed",
              uploadedFile: {
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                data: fileData,
              },
              resultDate: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to upload file")
          }

          const data = await response.json()
          setTests(
            tests.map((test) =>
              test._id === testId
                ? {
                    ...test,
                    uploadedFile: {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      uploadedAt: new Date().toLocaleString(),
                      data: fileData,
                    },
                    resultDate: new Date().toISOString(),
                    status: "completed",
                  }
                : test,
            ),
          )
          setMessage("✅ File uploaded successfully and sent to doctor & patient")
          setShowFileUpload(false)
          setSelectedTest(null)
          setTimeout(() => setMessage(""), 3000)
        } catch (error) {
          setMessage(`❌ ${error instanceof Error ? error.message : "Failed to upload file"}`)
          setTimeout(() => setMessage(""), 3000)
        } finally {
          setSubmitting(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : "Failed to process file"}`)
      setSubmitting(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDownloadFile = (uploadedFile: LabTest["uploadedFile"]) => {
    if (!uploadedFile) return
    const link = document.createElement("a")
    link.href = uploadedFile.data
    link.download = uploadedFile.name
    link.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => router.push("/lab-technician/qr-scanner")} variant="outline" className="mb-6">
          ← {t("back")}
        </Button>

        {/* Patient Info Card */}
        {patient && (
          <Card className="mb-6 border-l-4 border-l-cyan-600">
            <CardHeader>
              <CardTitle className="text-cyan-900">👤 Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient ID</p>
                  <p className="font-semibold">{patient.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{patient.userId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{patient.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sex</p>
                  <p className="font-semibold capitalize">{patient.sex}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.includes("✅") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className={message.includes("✅") ? "text-green-800" : "text-red-800"}>{message}</p>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              🧪 {t("labTests")} ({tests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.length === 0 ? (
                <p className="text-gray-600">{t("noTestsFound")}</p>
              ) : (
                tests.map((test) => (
                  <Card key={test._id} className="border">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">{t("testName")}</p>
                          <p className="font-semibold">{test.testName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t("sampleType")}</p>
                          <p className="font-semibold">{test.sampleType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t("testStatus")}</p>
                          <p
                            className={`font-semibold ${test.status === "completed" ? "text-green-600" : test.status === "in-progress" ? "text-yellow-600" : "text-gray-600"}`}
                          >
                            {test.status === "pending" && "⏳ Pending"}
                            {test.status === "in-progress" && "⏱️ In Progress"}
                            {test.status === "completed" && "✅ Completed"}
                          </p>
                        </div>
                        {test.estimatedTime && (
                          <div>
                            <p className="text-sm text-gray-600">{t("estimatedResultTime")}</p>
                            <p className="font-semibold">⏰ {test.estimatedTime}</p>
                          </div>
                        )}
                      </div>

                      {test.result && (
                        <div className="bg-green-50 p-3 rounded mb-4 border border-green-200">
                          <p className="text-sm text-gray-600">{t("resultValue")}</p>
                          <p className="font-semibold text-green-700">{test.result}</p>
                        </div>
                      )}

                      {test.uploadedFile && (
                        <div className="bg-blue-50 p-3 rounded mb-4 border border-blue-200">
                          <p className="text-sm text-gray-600 mb-2">{t("uploadedFile")}</p>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-semibold">{t("fileName")}:</span> {test.uploadedFile.name}
                            </p>
                            <p>
                              <span className="font-semibold">{t("fileSize")}:</span>{" "}
                              {formatFileSize(test.uploadedFile.size)}
                            </p>
                            <p>
                              <span className="font-semibold">{t("uploadedAt")}:</span> {test.uploadedFile.uploadedAt}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDownloadFile(test.uploadedFile)}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            {t("downloadResult")}
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {test.status !== "completed" && (
                          <>
                            {selectedTest === test._id && !showResultForm && !showFileUpload ? (
                              <div className="w-full space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder={t("hours")}
                                    value={estimatedHours}
                                    onChange={(e) => setEstimatedHours(e.target.value)}
                                    className="w-20"
                                  />
                                  <Input
                                    type="number"
                                    placeholder={t("minutes")}
                                    value={estimatedMinutes}
                                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                                    className="w-20"
                                  />
                                  <Button
                                    onClick={() => handleEstimateTime(test._id)}
                                    disabled={submitting}
                                    className="bg-cyan-600 hover:bg-cyan-700"
                                  >
                                    {submitting ? "Updating..." : "Set Time"}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test._id)
                                  setShowResultForm(false)
                                  setShowFileUpload(false)
                                }}
                                variant="outline"
                                className="text-cyan-600 border-cyan-600"
                              >
                                ⏱️ Set Estimate Time
                              </Button>
                            )}
                          </>
                        )}

                        {test.status === "in-progress" && (
                          <>
                            {selectedTest === test._id && showResultForm ? (
                              <div className="w-full space-y-2">
                                <Input
                                  type="text"
                                  placeholder={t("resultValue")}
                                  value={resultValue}
                                  onChange={(e) => setResultValue(e.target.value)}
                                />
                                <Button
                                  onClick={() => handleAddResult(test._id)}
                                  disabled={submitting}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {submitting ? "Submitting..." : "✅ Submit Result"}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test._id)
                                  setShowResultForm(true)
                                  setShowFileUpload(false)
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                ✅ Add Result
                              </Button>
                            )}

                            {selectedTest === test._id && showFileUpload ? (
                              <div className="w-full space-y-2">
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      handleFileUpload(test._id, file)
                                    }
                                  }}
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  className="w-full"
                                  disabled={submitting}
                                />
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test._id)
                                  setShowFileUpload(true)
                                  setShowResultForm(false)
                                }}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                📄 Upload Result File
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
