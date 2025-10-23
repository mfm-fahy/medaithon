"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"

export default function LabTechnicianSignIn() {
  const router = useRouter()
  const { t } = useLanguage()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(username, password)
      router.push("/lab-technician/dashboard")
    } catch (err) {
      setError(t("invalidCredentials"))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t("labTechnicianSignIn")}</CardTitle>
          <CardDescription>{t("enterCredentials")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("username")}</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lab_tech_john"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm mt-2 mb-2">{error}</div>}

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loading}>
              {loading ? t("signingIn") : t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
