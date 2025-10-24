"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import ChatbotModal from "./chatbot-modal"

interface ChatbotFloatingButtonProps {
  patientId: string
  token: string
}

export default function ChatbotFloatingButton({ patientId, token }: ChatbotFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Pulse animation when closed - behind button */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-75 animate-pulse pointer-events-none" />
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative rounded-full w-14 h-14 shadow-lg transition-all duration-300 z-50 ${
            isOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Chat Modal */}
      <ChatbotModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        patientId={patientId}
        token={token}
      />
    </>
  )
}

