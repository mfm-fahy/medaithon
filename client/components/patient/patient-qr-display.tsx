"use client"

import { generatePatientQRCode } from "@/lib/qr-generator"
import type { Patient } from "@/lib/types"

export default function PatientQRDisplay({ patient }: { patient: Patient }) {
  const qrCodeUrl = generatePatientQRCode(patient.patientId, patient.name)

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="font-medium text-lg">Patient Wristband QR Code</h3>
      <img src={qrCodeUrl || "/placeholder.svg"} alt="Patient QR Code" className="w-48 h-48" />
      <div className="text-center">
        <p className="font-medium">{patient.name}</p>
        <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
      </div>
      <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Print Wristband
      </button>
    </div>
  )
}
