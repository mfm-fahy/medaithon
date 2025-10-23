"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDiseaseConsultations, mockDoctors } from "@/lib/mock-data"

export default function DiseaseMonitor() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const diseaseStats = useMemo(() => {
    const stats: Record<string, { count: number; doctors: Set<string> }> = {}

    mockDiseaseConsultations.forEach((consultation) => {
      if (!stats[consultation.disease]) {
        stats[consultation.disease] = { count: 0, doctors: new Set() }
      }
      stats[consultation.disease].count += 1
      stats[consultation.disease].doctors.add(consultation.doctorId)
    })

    return stats
  }, [])

  const filteredDiseases = useMemo(() => {
    return Object.entries(diseaseStats)
      .filter(([disease]) => disease.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort(([, a], [, b]) => b.count - a.count)
  }, [searchQuery, diseaseStats])

  const getDoctorNames = (doctorIds: Set<string>) => {
    return Array.from(doctorIds)
      .map((id) => mockDoctors.find((doc) => doc.id === id)?.name || "Unknown")
      .join(", ")
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t("diseaseMonitoring")}</CardTitle>
        <CardDescription>Search and monitor diseases by patient visits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            type="text"
            placeholder={t("searchByDiseaseName")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredDiseases.length > 0 ? (
          <div className="space-y-3">
            {filteredDiseases.map(([disease, stats]) => (
              <div key={disease} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{disease}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-blue-600">{stats.count}</span> {t("patientsVisited")}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">{t("consultedDoctors")}:</span> {getDoctorNames(stats.doctors)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{stats.count}</div>
                    <div className="text-xs text-gray-500">visits</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("noResultsFound")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
