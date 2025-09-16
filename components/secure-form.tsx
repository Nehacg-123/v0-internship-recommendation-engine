"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface SecureFormProps {
  onSubmit: (data: any, csrfToken: string) => Promise<void>
  children: React.ReactNode
  className?: string
}

export function SecureForm({ onSubmit, children, className }: SecureFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch CSRF token on component mount
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("/api/csrf")
        const data = await response.json()
        if (data.success) {
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }

    fetchCSRFToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      await onSubmit(data, csrfToken)
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && (
        <Alert className="mb-4 border-destructive/50 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {children}

      <input type="hidden" name="csrfToken" value={csrfToken} />

      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
        <Shield className="w-3 h-3" />
        <span>This form is protected by CSRF tokens and rate limiting</span>
      </div>
    </form>
  )
}
