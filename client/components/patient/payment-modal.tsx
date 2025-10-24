"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Smartphone, CreditCard, Banknote, Loader } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  amount: number
  onPaymentComplete: (paymentMethod: string, transactionId: string) => void
  onClose: () => void
}

export default function PaymentModal({
  isOpen,
  amount,
  onPaymentComplete,
  onClose,
}: PaymentModalProps) {
  const [step, setStep] = useState<"method" | "processing" | "success">("method")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState("")

  const paymentMethods = [
    {
      id: "phonepay",
      name: "PhonePe",
      icon: Smartphone,
      color: "from-purple-500 to-purple-600",
      description: "Fast & Secure",
    },
    {
      id: "gpay",
      name: "Google Pay",
      icon: Smartphone,
      color: "from-blue-500 to-blue-600",
      description: "Quick Payment",
    },
    {
      id: "creditcard",
      name: "Credit Card",
      icon: CreditCard,
      color: "from-orange-500 to-orange-600",
      description: "Visa, Mastercard",
    },
    {
      id: "cash",
      name: "Cash",
      icon: Banknote,
      color: "from-green-500 to-green-600",
      description: "Pay at Counter",
    },
  ]

  const handlePaymentSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      const txnId = `TXN${Date.now()}`
      setTransactionId(txnId)
      setStep("success")

      // Auto complete after 2 seconds
      setTimeout(() => {
        onPaymentComplete(methodId, txnId)
        resetModal()
      }, 2000)
    }, 2000)
  }

  const resetModal = () => {
    setStep("method")
    setSelectedMethod(null)
    setTransactionId("")
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-center">Payment Required</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm mb-2">Amount to Pay</p>
            <div className="text-4xl font-bold text-blue-600">₹{amount}</div>
            <p className="text-gray-500 text-xs mt-2">Consultation Fee</p>
          </div>

          {/* Step 1: Payment Method Selection */}
          {step === "method" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-4">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentSelect(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                        selectedMethod === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-2`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-sm">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <p className="text-center text-gray-700 font-medium">Processing Payment...</p>
              <p className="text-center text-gray-500 text-sm mt-2">
                {selectedMethod === "cash"
                  ? "Payment will be collected at counter"
                  : "Please complete the payment on your device"}
              </p>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="text-center text-gray-700 font-medium">Payment Successful!</p>
              <p className="text-center text-gray-500 text-sm mt-2">
                Transaction ID: <span className="font-mono text-xs">{transactionId}</span>
              </p>
              <p className="text-center text-gray-500 text-xs mt-4">
                Proceeding to schedule your visit...
              </p>
            </div>
          )}

          {/* Close Button */}
          {step === "method" && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full mt-6"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

