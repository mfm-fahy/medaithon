"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthState } from "./types"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("hospital_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        })
      } catch (error) {
        setAuthState({ user: null, isAuthenticated: false, loading: false })
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, loading: false })
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      console.log("🔵 Auth context: Starting login...")
      console.log("📝 Username:", username)

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      console.log("📊 Response status:", response.status)
      console.log("📊 Response ok:", response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Login failed:", errorData)
        throw new Error(errorData.message || "Login failed")
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("❌ Failed to parse response JSON:", parseError)
        console.log("📝 Response text:", await response.text())
        throw new Error("Failed to parse login response")
      }

      console.log("✅ Login response received:", data)
      const { token, user } = data

      if (!token || !user) {
        console.error("❌ Missing token or user in response:", { token: !!token, user: !!user })
        throw new Error("Invalid response format: missing token or user")
      }

      // Store both token and user
      localStorage.setItem("auth_token", token)
      localStorage.setItem("hospital_user", JSON.stringify(user))
      console.log("✅ Token and user stored in localStorage")

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      })
      console.log("✅ Auth state updated")
    } catch (error: any) {
      console.error("❌ Login error:", error)
      throw error
    }
  }

  const signup = async (data: any) => {
    try {
      console.log("🔵 Auth context: Starting signup...")
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      console.log("📡 Auth context: Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Auth context: Response not ok:", errorData)
        throw new Error(errorData.message || "Signup failed")
      }

      const responseData = await response.json()
      console.log("✅ Auth context: Response data:", responseData)
      const { token, user } = responseData

      console.log("💾 Auth context: Storing token and user...")
      // Store both token and user
      localStorage.setItem("auth_token", token)
      localStorage.setItem("hospital_user", JSON.stringify(user))

      console.log("🔄 Auth context: Updating auth state...")
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      })
      console.log("✅ Auth context: Auth state updated!")
    } catch (error: any) {
      console.error("❌ Auth context signup error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("hospital_user")
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    })
  }

  return <AuthContext.Provider value={{ ...authState, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
