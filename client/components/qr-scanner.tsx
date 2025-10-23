"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Camera, X } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (patientId: string) => void
  onClose?: () => void
  title?: string
  description?: string
}

export default function QRScanner({ onScan, onClose, title = "Scan Patient QR Code", description = "Point your camera at the patient's QR code" }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [scannedId, setScannedId] = useState("")
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!scanning) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          scanQRCode()
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.")
        setScanning(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [scanning])

  const scanQRCode = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = decodeQRCode(imageData)

          if (code) {
            // Extract patient ID from QR code (format: P{timestamp})
            const patientIdMatch = code.match(/P\d+/)
            if (patientIdMatch) {
              const patientId = patientIdMatch[0]
              setScannedId(patientId)
              setSuccess(true)
              setScanning(false)
              clearInterval(scanInterval)
              onScan(patientId)
            }
          }
        } catch (err) {
          // Continue scanning
        }
      }
    }, 100)

    return () => clearInterval(scanInterval)
  }

  const decodeQRCode = (imageData: ImageData): string | null => {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        console.log("✅ QR Code detected:", code.data)
        return code.data
      }
      return null
    } catch (err) {
      console.error("Error decoding QR code:", err)
      return null
    }
  }

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const patientId = formData.get("patientId") as string

    if (patientId.match(/^P\d+$/)) {
      setScannedId(patientId)
      setSuccess(true)
      onScan(patientId)
    } else {
      setError("Invalid Patient ID format. Expected format: P{timestamp}")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera View */}
        {scanning && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-2 border-blue-500 m-8 rounded-lg pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Position QR code in frame</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setScanning(false)}
              variant="outline"
              className="w-full"
            >
              Cancel Scanning
            </Button>
          </div>
        )}

        {/* Start Scanning Button */}
        {!scanning && !success && (
          <Button
            onClick={() => {
              setError("")
              setScanning(true)
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 h-11"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Camera Scan
          </Button>
        )}

        {/* Manual Input */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Or enter Patient ID manually:</p>
          <form onSubmit={handleManualInput} className="space-y-3">
            <input
              type="text"
              name="patientId"
              placeholder="e.g., P1761240184117"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={scanning}
            />
            <Button
              type="submit"
              disabled={scanning}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Search Patient
            </Button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">Patient found: {scannedId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

