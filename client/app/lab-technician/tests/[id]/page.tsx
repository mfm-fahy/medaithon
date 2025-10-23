"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"

interface LabTest {
  id: string
  testName: string
  sampleType: string
  status: "pending" | "in-progress" | "completed"
  estimatedTime?: string
  result?: string
  uploadedFile?: {
    name: string
    type: string
    size: number
    uploadedAt: string
    data: string
  }
}

export default function LabTechnicianTests() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const { user } = useAuth()
  const patientId = params.id as string

  const [tests, setTests] = useState<LabTest[]>([
    {
      id: "test_001",
      testName: "Complete Blood Count",
      sampleType: "Blood",
      status: "pending",
    },
    {
      id: "test_002",
      testName: "Urinalysis",
      sampleType: "Urine",
      status: "pending",
    },
  ])

  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [estimatedHours, setEstimatedHours] = useState("")
  const [estimatedMinutes, setEstimatedMinutes] = useState("")
  const [resultValue, setResultValue] = useState("")
  const [showResultForm, setShowResultForm] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)

  if (!user || user.role !== "labTechnician") {
    router.push("/lab-technician/signin")
    return null
  }

  const handleEstimateTime = (testId: string) => {
    if (estimatedHours || estimatedMinutes) {
      setTests(
        tests.map((test) =>
          test.id === testId
            ? {
                ...test,
                estimatedTime: `${estimatedHours || "0"}h ${estimatedMinutes || "0"}m`,
                status: "in-progress",
              }
            : test,
        ),
      )
      setEstimatedHours("")
      setEstimatedMinutes("")
      setSelectedTest(null)
    }
  }

  const handleAddResult = (testId: string) => {
    if (resultValue) {
      setTests(
        tests.map((test) =>
          test.id === testId
            ? {
                ...test,
                result: resultValue,
                status: "completed",
              }
            : test,
        ),
      )
      setResultValue("")
      setShowResultForm(false)
      setSelectedTest(null)
    }
  }

  const handleFileUpload = (testId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = e.target?.result as string
      setTests(
        tests.map((test) =>
          test.id === testId
            ? {
                ...test,
                uploadedFile: {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  uploadedAt: new Date().toLocaleString(),
                  data: fileData,
                },
                status: "completed",
              }
            : test,
        ),
      )
      setShowFileUpload(false)
      setSelectedTest(null)
    }
    reader.readAsDataURL(file)
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
        <Button onClick={() => router.push("/lab-technician/dashboard")} variant="outline" className="mb-6">
          {t("back")}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {t("labTests")} - Patient ID: {patientId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.length === 0 ? (
                <p className="text-gray-600">{t("noTestsFound")}</p>
              ) : (
                tests.map((test) => (
                  <Card key={test.id} className="border">
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
                            {test.status === "pending" && t("pending")}
                            {test.status === "in-progress" && t("inProgress")}
                            {test.status === "completed" && t("completed")}
                          </p>
                        </div>
                        {test.estimatedTime && (
                          <div>
                            <p className="text-sm text-gray-600">{t("estimatedResultTime")}</p>
                            <p className="font-semibold">{test.estimatedTime}</p>
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
                            {selectedTest === test.id && !showResultForm && !showFileUpload ? (
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
                                    onClick={() => handleEstimateTime(test.id)}
                                    className="bg-cyan-600 hover:bg-cyan-700"
                                  >
                                    {t("estimateTime")}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test.id)
                                  setShowResultForm(false)
                                  setShowFileUpload(false)
                                }}
                                variant="outline"
                                className="text-cyan-600 border-cyan-600"
                              >
                                {t("estimateTime")}
                              </Button>
                            )}
                          </>
                        )}

                        {test.status === "in-progress" && (
                          <>
                            {selectedTest === test.id && showResultForm ? (
                              <div className="w-full space-y-2">
                                <Input
                                  type="text"
                                  placeholder={t("resultValue")}
                                  value={resultValue}
                                  onChange={(e) => setResultValue(e.target.value)}
                                />
                                <Button
                                  onClick={() => handleAddResult(test.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {t("addResult")}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test.id)
                                  setShowResultForm(true)
                                  setShowFileUpload(false)
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {t("addResult")}
                              </Button>
                            )}

                            {selectedTest === test.id && showFileUpload ? (
                              <div className="w-full space-y-2">
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      handleFileUpload(test.id, file)
                                    }
                                  }}
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  className="w-full"
                                />
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedTest(test.id)
                                  setShowFileUpload(true)
                                  setShowResultForm(false)
                                }}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {t("uploadResultFile")}
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
