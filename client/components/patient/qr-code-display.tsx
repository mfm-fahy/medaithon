"use client"

import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"

interface QRCodeDisplayProps {
  patientId: string
  patientName?: string
  showDownload?: boolean
}

export default function QRCodeDisplay({ patientId, patientName, showDownload = true }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `patient-qr-${patientId}.png`
      link.click()
    }
  }

  const handlePrint = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const printWindow = window.open("", "", "height=400,width=400")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Patient QR Code - ${patientId}</title>
              <style>
                body {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  text-align: center;
                }
                h2 {
                  margin-bottom: 20px;
                  color: #333;
                }
                .patient-id {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  color: #666;
                }
                img {
                  max-width: 300px;
                  border: 2px solid #ddd;
                  padding: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Patient QR Code</h2>
                <div class="patient-id">ID: ${patientId}</div>
                ${patientName ? `<div class="patient-id">Name: ${patientName}</div>` : ""}
                <img src="${canvas.toDataURL("image/png")}" alt="QR Code" />
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Patient QR Code</CardTitle>
        <CardDescription>Use this QR code for quick identification at the hospital</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* QR Code Display */}
        <div
          ref={qrRef}
          className="p-6 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center"
        >
          <QRCodeCanvas
            value={patientId}
            size={256}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        {/* Patient ID Display */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Patient ID:</p>
          <p className="text-2xl font-bold text-blue-600">{patientId}</p>
          {patientName && <p className="text-sm text-gray-600 mt-2">Name: {patientName}</p>}
        </div>

        {/* Action Buttons */}
        {showDownload && (
          <div className="flex gap-3 w-full">
            <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Download QR Code
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              Print QR Code
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
          <p className="text-sm text-gray-700">
            <strong>How to use:</strong> Show this QR code to hospital staff for quick access to your medical records.
            You can download or print it for convenience.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

