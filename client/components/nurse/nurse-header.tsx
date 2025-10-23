"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import type { User } from "@/lib/types"

export default function NurseHeader({ user }: { user: User | null }) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex-1 ml-6">
          <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </header>
  )
}
