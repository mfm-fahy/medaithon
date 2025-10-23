export function generateQRCode(text: string): string {
  // Using a QR code API service
  const encodedText = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`
}

export function generatePatientQRCode(patientId: string, name: string): string {
  const data = JSON.stringify({ patientId, name, timestamp: new Date().toISOString() })
  return generateQRCode(data)
}
