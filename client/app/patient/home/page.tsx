"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PatientHeader from "@/components/patient/patient-header"
import PatientNavigation from "@/components/patient/patient-navigation"
import QRCodeDisplay from "@/components/patient/qr-code-display"
import VisitForm from "@/components/patient/visit-form"
import ChatbotFloatingButton from "@/components/patient/chatbot-floating-button"
import FeedbackModal from "@/components/patient/feedback-modal"

export default function PatientHome() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [visitScheduled, setVisitScheduled] = useState(false)
  const [latestTriageColor, setLatestTriageColor] = useState<string | null>(null)
  const [loadingTriage, setLoadingTriage] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/patient/signin")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && (user as any)?.patientId) {
      fetchLatestTriageColor()
    }
  }, [isAuthenticated, user])

  const fetchLatestTriageColor = async () => {
    setLoadingTriage(true)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:5000/api/patients/${(user as any)?.patientId}/vitals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const vitals = await response.json()
        if (vitals.length > 0) {
          const latest = vitals[0]
          setLatestTriageColor(latest.triageColor || null)
        }
      }
    } catch (error) {
      console.error("Error fetching triage color:", error)
    } finally {
      setLoadingTriage(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader user={user} />

      {/* Chatbot Floating Button */}
      {(user as any)?.patientId && (
        <ChatbotFloatingButton
          patientId={(user as any).patientId}
          token={localStorage.getItem("auth_token") || ""}
        />
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* QR Code Section */}
        {(user as any)?.patientId && (
          <div className="mb-8">
            <QRCodeDisplay patientId={(user as any).patientId} patientName={user?.name} showDownload={true} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your medical information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => router.push("/patient/queue")}
                className="bg-blue-600 hover:bg-blue-700 h-20 text-base"
              >
                Queue Status
              </Button>
              <Button
                onClick={() => router.push("/patient/appointments")}
                className="bg-green-600 hover:bg-green-700 h-20 text-base"
              >
                View Appointments
              </Button>
              <Button
                onClick={() => router.push("/patient/prescriptions")}
                className="bg-purple-600 hover:bg-purple-700 h-20 text-base"
              >
                My Prescriptions
              </Button>
              <Button
                onClick={() => router.push("/patient/lab-reports")}
                className="bg-orange-600 hover:bg-orange-700 h-20 text-base"
              >
                Lab Reports
              </Button>
              <Button
                onClick={() => router.push("/patient/navigation")}
                className="bg-indigo-600 hover:bg-indigo-700 h-20 text-base"
              >
                Medical Records
              </Button>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> {user?.name}
              </div>
              <div>
                <span className="font-medium">Patient ID:</span> {(user as any)?.patientId}
              </div>
              <div>
                <span className="font-medium">Age:</span> {(user as any)?.age}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {(user as any)?.phone}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Triage Status Card */}
        {latestTriageColor && (
          <div className="mb-8">
            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Your Triage Status
                </CardTitle>
                <CardDescription>Latest vital assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      latestTriageColor === "red"
                        ? "bg-red-500"
                        : latestTriageColor === "yellow"
                        ? "bg-yellow-400 text-gray-900"
                        : latestTriageColor === "green"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {latestTriageColor.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Priority Level:</p>
                    <p className="text-lg font-semibold">
                      {latestTriageColor === "red"
                        ? "🔴 Critical - Immediate Attention"
                        : latestTriageColor === "yellow"
                        ? "🟡 Urgent - High Priority"
                        : latestTriageColor === "green"
                        ? "🟢 Non-Urgent - Routine Care"
                        : "🔵 Semi-Urgent - Moderate Priority"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Based on your latest vital signs recorded by the nurse
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visit Form Section */}
        <div className="mb-8">
          <VisitForm
            patientId={(user as any)?.patientId}
            onSuccess={() => setVisitScheduled(true)}
          />
        </div>

        {/* Feedback Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>📝 Share Your Feedback</CardTitle>
              <CardDescription>Help us improve our hospital services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Your feedback is valuable to us. Please share your experience and suggestions to help us provide better healthcare services.
              </p>
              <Button
                onClick={() => setFeedbackModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                💬 Give Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        <PatientNavigation visitScheduled={visitScheduled} />
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        patientId={(user as any)?.patientId}
        patientName={user?.name}
      />
    </div>
  )
}
