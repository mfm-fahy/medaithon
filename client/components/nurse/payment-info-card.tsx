"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle, Clock, Banknote, Smartphone } from "lucide-react"

interface PaymentInfoCardProps {
  visitId: string
  paymentMethod?: string
  paymentStatus?: string
  transactionId?: string
  amount?: number
  onPaymentCollected?: (visitId: string) => void
}

export default function PaymentInfoCard({
  visitId,
  paymentMethod = "cash",
  paymentStatus = "pending",
  transactionId,
  amount = 200,
  onPaymentCollected,
}: PaymentInfoCardProps) {
  const [collecting, setCollecting] = useState(false)

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "phonepay":
        return <Smartphone className="w-5 h-5 text-purple-600" />
      case "gpay":
        return <Smartphone className="w-5 h-5 text-blue-600" />
      case "creditcard":
        return <CreditCard className="w-5 h-5 text-orange-600" />
      case "cash":
        return <Banknote className="w-5 h-5 text-green-600" />
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "phonepay":
        return "PhonePe"
      case "gpay":
        return "Google Pay"
      case "creditcard":
        return "Credit Card"
      case "cash":
        return "Cash"
      default:
        return method
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleMarkAsCollected = async () => {
    if (paymentMethod !== "cash" || paymentStatus === "completed") {
      return
    }

    setCollecting(true)
    try {
      // Call the callback if provided
      if (onPaymentCollected) {
        await onPaymentCollected(visitId)
      }
    } finally {
      setCollecting(false)
    }
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment Information
          </CardTitle>
          <Badge className={`${getStatusColor(paymentStatus)} flex items-center gap-1`}>
            {getStatusIcon(paymentStatus)}
            {paymentStatus === "completed" ? "Paid" : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
          <p className="text-3xl font-bold text-blue-600">₹{amount}</p>
        </div>

        {/* Payment Method */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Payment Method</p>
            <div className="flex items-center gap-2">
              {getPaymentMethodIcon(paymentMethod)}
              <p className="font-medium text-sm">{getPaymentMethodLabel(paymentMethod)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Status</p>
            <p className="font-medium text-sm capitalize">{paymentStatus}</p>
          </div>
        </div>

        {/* Transaction ID */}
        {transactionId && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
            <p className="font-mono text-xs text-gray-700 break-all">{transactionId}</p>
          </div>
        )}

        {/* Cash Collection Button */}
        {paymentMethod === "cash" && paymentStatus === "pending" && (
          <Button
            onClick={handleMarkAsCollected}
            disabled={collecting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {collecting ? "Collecting..." : "✓ Mark Payment Collected"}
          </Button>
        )}

        {/* Payment Completed Message */}
        {paymentStatus === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Payment Completed</p>
              <p className="text-xs text-green-700">
                {paymentMethod === "cash"
                  ? "Cash payment has been collected"
                  : "Payment received via " + getPaymentMethodLabel(paymentMethod)}
              </p>
            </div>
          </div>
        )}

        {/* Info Message */}
        {paymentMethod === "cash" && paymentStatus === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Awaiting Cash Payment</p>
              <p className="text-xs text-yellow-700">
                Please collect ₹{amount} from the patient and mark as collected
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

