"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Eye, EyeOff, ArrowLeft, CheckCircle, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SecurityNotice } from "@/components/security-notice"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegistrationSuccess(true)
      setTimeout(() => setShowRegistrationSuccess(false), 5000)
    }

    // Fetch CSRF token
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
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.emailOrPhone.trim() || !formData.password.trim()) {
      setError(t("auth.fillAllFields") || "Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
          csrfToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error.includes("Too many")) {
          setRemainingAttempts(0)
        }
        throw new Error(data.error)
      }

      if (data.success) {
        login(data.user, data.token)

        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push("/admin")
        } else if (data.user.profile?.profileCompleted) {
          router.push("/dashboard")
        } else {
          router.push("/profile-setup")
        }
      }
    } catch (error: any) {
      setError(error.message || t("auth.loginFailed") || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              {t("common.backToHome") || "Back to Home"}
            </Link>
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PM Internship</h1>
          </div>
        </div>

        {showRegistrationSuccess && (
          <Alert className="mb-6 border-green-500/50 text-green-700 bg-green-50">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>{t("auth.registrationSuccess")}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("auth.welcomeBack") || "Welcome Back"}</CardTitle>
            <CardDescription>
              {t("auth.loginDescription") || "Sign in to access your personalized internship recommendations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-destructive/50 text-destructive">
                <AlertDescription>
                  {error}
                  {remainingAttempts === 0 && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Account temporarily locked for security</span>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">
                  {t("common.email")} or {t("common.phone")}
                </Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  placeholder={t("auth.emailPhonePlaceholder") || "Enter your email or phone number"}
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
                  className="text-base"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("common.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder") || "Enter your password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="text-base pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  {t("auth.forgotPassword")}
                </Link>
              </div>

              <input type="hidden" name="csrfToken" value={csrfToken} />

              <Button type="submit" className="w-full text-base py-6" disabled={isLoading || remainingAttempts === 0}>
                {isLoading ? t("auth.signingIn") || "Signing In..." : t("auth.loginButton") || "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t("auth.dontHaveAccount")}{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  {t("auth.createAccount") || "Create one here"}
                </Link>
              </p>
            </div>

            {/* Security notice */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Protected by CSRF tokens, rate limiting, and secure authentication</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6">
          <SecurityNotice />
        </div>
      </div>
    </div>
  )
}
