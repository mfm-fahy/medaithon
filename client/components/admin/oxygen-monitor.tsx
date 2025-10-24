"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Zap, Droplet } from "lucide-react"

interface OxygenCylinder {
  id: string
  location: string
  pressure: number
  maxPressure: number
  status: "normal" | "low" | "critical"
  lastUpdated: Date
}

export default function OxygenMonitor() {
  const [cylinders, setCylinders] = useState<OxygenCylinder[]>([
    { id: "O2-001", location: "ICU Ward A", pressure: 85, maxPressure: 100, status: "normal", lastUpdated: new Date() },
    { id: "O2-002", location: "ICU Ward B", pressure: 45, maxPressure: 100, status: "low", lastUpdated: new Date() },
    { id: "O2-003", location: "Emergency Room", pressure: 92, maxPressure: 100, status: "normal", lastUpdated: new Date() },
    { id: "O2-004", location: "Operation Theater", pressure: 15, maxPressure: 100, status: "critical", lastUpdated: new Date() },
    { id: "O2-005", location: "General Ward", pressure: 78, maxPressure: 100, status: "normal", lastUpdated: new Date() },
    { id: "O2-006", location: "Pediatric Ward", pressure: 38, maxPressure: 100, status: "low", lastUpdated: new Date() },
  ])

  // Simulate pressure updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCylinders((prev) =>
        prev.map((cylinder) => {
          const change = (Math.random() - 0.5) * 3
          const newPressure = Math.max(0, Math.min(100, cylinder.pressure + change))
          
          let status: "normal" | "low" | "critical" = "normal"
          if (newPressure <= 20) status = "critical"
          else if (newPressure <= 40) status = "low"

          return {
            ...cylinder,
            pressure: Math.round(newPressure * 10) / 10,
            status,
            lastUpdated: new Date(),
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "from-red-500 to-red-600"
      case "low":
        return "from-yellow-500 to-orange-500"
      default:
        return "from-green-500 to-emerald-500"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "low":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-green-50 border-green-200"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-700"
      case "low":
        return "text-yellow-700"
      default:
        return "text-green-700"
    }
  }

  const criticalCount = cylinders.filter((c) => c.status === "critical").length
  const lowCount = cylinders.filter((c) => c.status === "low").length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Cylinders */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-blue-200/50 hover:shadow-blue-400/30 transition-all duration-700 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm text-gray-600 font-semibold">Total Cylinders</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {cylinders.length}
            </p>
          </CardContent>
        </Card>

        {/* Low Pressure */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-yellow-200/50 hover:shadow-yellow-400/30 transition-all duration-700 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm text-gray-600 font-semibold">Low Pressure</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {lowCount}
            </p>
          </CardContent>
        </Card>

        {/* Critical Alert */}
        <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-2 border-red-200/50 hover:shadow-red-400/30 transition-all duration-700 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm text-gray-600 font-semibold">Critical Alert</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {criticalCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Monitor Card */}
      <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-white/60">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="w-6 h-6 text-blue-600" />
                Live Oxygen Cylinder Monitor
              </CardTitle>
              <CardDescription>Real-time pressure monitoring with automatic updates</CardDescription>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cylinders.map((cylinder) => (
              <div
                key={cylinder.id}
                className={`p-4 rounded-xl border-2 transition-all duration-500 ${getStatusBgColor(
                  cylinder.status
                )} hover:shadow-lg hover:scale-[1.02]`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{cylinder.id}</h3>
                    <p className="text-sm text-gray-600">{cylinder.location}</p>
                  </div>
                  {cylinder.status === "critical" && (
                    <div className="animate-pulse">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                </div>

                {/* Pressure Display */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Pressure</span>
                    <span className={`text-2xl font-bold ${getStatusTextColor(cylinder.status)}`}>
                      {cylinder.pressure}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStatusColor(
                        cylinder.status
                      )} transition-all duration-500 rounded-full shadow-lg`}
                      style={{ width: `${cylinder.pressure}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600">
                      {cylinder.pressure > 60 ? "Optimal" : cylinder.pressure > 40 ? "Adequate" : "Low"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cylinder.status === "critical"
                        ? "bg-red-200 text-red-800"
                        : cylinder.status === "low"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {cylinder.status.toUpperCase()}
                  </span>
                </div>

                {/* Alert Message */}
                {cylinder.status === "critical" && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-xs text-red-700 font-semibold">⚠️ CRITICAL: Replace immediately!</p>
                  </div>
                )}
                {cylinder.status === "low" && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-xs text-yellow-700 font-semibold">⚡ LOW: Schedule replacement</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Status Legend</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <span className="text-sm text-gray-600">Normal (60-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <span className="text-sm text-gray-600">Low (20-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                <span className="text-sm text-gray-600">Critical (0-20%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

