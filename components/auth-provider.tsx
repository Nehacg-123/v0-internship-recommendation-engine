"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { AuthUser } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem("auth_user")
    const storedToken = localStorage.getItem("auth_token")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem("auth_user")
        localStorage.removeItem("auth_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (user: AuthUser, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem("auth_user", JSON.stringify(user))
    localStorage.setItem("auth_token", token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
