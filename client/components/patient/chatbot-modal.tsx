"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Loader, AlertCircle, Pill, Stethoscope, Save } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  token: string
}

export default function ChatbotModal({ isOpen, onClose, patientId, token }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sessionId, setSessionId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeSession()
    }
  }, [isOpen])

  const initializeSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chatbot/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const session = await response.json()
        setSessionId(session._id)
        setMessages(
          session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        )
      }
    } catch (err) {
      setError("Failed to initialize chat session")
      console.error(err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !sessionId) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = input
    setInput("")
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageToSend,
          sessionId: sessionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        setError("Failed to get response from chatbot")
      }
    } catch (err) {
      setError("Error sending message")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    const prompts: { [key: string]: string } = {
      symptoms: "I want to tell you about my symptoms. Can you help me understand what might be wrong?",
      medicines: "Can you tell me about the medicines I'm taking and their side effects?",
      advice: "What general health advice can you give me?",
    }
    setInput(prompts[action] || "")
  }

  const handleSaveSymptoms = async () => {
    if (!sessionId) return

    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/chatbot/save-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symptoms: messages
            .filter((m) => m.role === "user")
            .map((m) => m.content),
        }),
      })

      if (response.ok) {
        setError("")
        alert("✅ Symptoms saved successfully! Your doctor will see them during your visit.")
      } else {
        setError("Failed to save symptoms")
      }
    } catch (err) {
      setError("Error saving symptoms")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <Card className="w-full max-w-md h-[600px] flex flex-col rounded-lg shadow-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex flex-row items-center justify-between p-4">
          <div>
            <CardTitle className="text-lg">Health Assistant</CardTitle>
            <p className="text-xs text-blue-100 mt-1">Ask about symptoms, medicines & health</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="font-medium mb-2">👋 Welcome to Health Assistant</p>
              <p className="text-sm">
                Ask me about your symptoms, medicines, or any health concerns. I'm here to help!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="border-t p-3 bg-gray-100 space-y-2">
            <p className="text-xs font-medium text-gray-600 px-1">Quick Actions:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("symptoms")}
                className="text-xs h-8"
              >
                <Stethoscope className="w-3 h-3 mr-1" />
                Symptoms
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("medicines")}
                className="text-xs h-8"
              >
                <Pill className="w-3 h-3 mr-1" />
                Medicines
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction("advice")}
                className="text-xs h-8"
              >
                💡 Advice
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 bg-white rounded-b-lg space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Save Symptoms Button */}
          {messages.length > 0 && (
            <Button
              type="button"
              onClick={handleSaveSymptoms}
              disabled={loading}
              variant="outline"
              className="w-full text-xs"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Symptoms for Doctor
            </Button>
          )}
        </form>
      </Card>
    </div>
  )
}

