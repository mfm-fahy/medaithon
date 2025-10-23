"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface PatientNavigationProps {
  visitScheduled?: boolean
}

export default function PatientNavigation({ visitScheduled = false }: PatientNavigationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Navigation</CardTitle>
        <CardDescription>Your current location and next destination</CardDescription>
      </CardHeader>
      <CardContent>
        {!visitScheduled ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">Schedule a visit to see directions to the OP Nurse</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <p className="font-medium text-blue-900">Current Location: Reception</p>
              </div>
              <p className="text-sm text-blue-700 ml-7">Please proceed to the registration desk</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-900">Next: OP Nurse</p>
              </div>
              <p className="text-sm text-green-700 ml-7">Wing A, Ground Floor - Room 102</p>
              <p className="text-xs text-green-600 ml-7 mt-2">Follow the green arrows on the floor</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
