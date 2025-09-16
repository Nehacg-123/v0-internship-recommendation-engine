// Security utilities for PM Internship Recommendation Engine

// Input validation and sanitization
export class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential XSS characters
      .substring(0, 1000) // Limit length
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/
    return phoneRegex.test(phone)
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/
    return nameRegex.test(name)
  }
}

// Rate limiting
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map()

  static checkRateLimit(identifier: string, maxAttempts = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxAttempts) {
      return false
    }

    record.count++
    return true
  }

  static getRemainingAttempts(identifier: string, maxAttempts = 5): number {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return maxAttempts
    }
    return Math.max(0, maxAttempts - record.count)
  }

  static getResetTime(identifier: string): number | null {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return null
    }
    return record.resetTime
  }
}

export class CSRFProtection {
  static generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken || token.length !== storedToken.length) return false

    // Simple constant-time comparison
    let result = 0
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i)
    }
    return result === 0
  }
}

// Content Security Policy
export const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
    "frame-ancestors 'none'",
  ].join("; "),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

export class PasswordSecurity {
  static async hashPassword(password: string): Promise<string> {
    // Generate salt
    const saltArray = new Uint8Array(16)
    crypto.getRandomValues(saltArray)
    const salt = Array.from(saltArray, (byte) => byte.toString(16).padStart(2, "0")).join("")

    // Create hash using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = new Uint8Array(hashBuffer)
    const hash = Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("")

    return `${salt}:${hash}`
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(":")
    if (!salt || !hash) return false

    // Create hash with same salt
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = new Uint8Array(hashBuffer)
    const verifyHash = Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("")

    return hash === verifyHash
  }
}

export class SessionSecurity {
  static generateSessionId(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  static isSessionExpired(timestamp: number, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    return Date.now() - timestamp > maxAge
  }
}

// File upload security
export class FileUploadSecurity {
  static readonly ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  static validateFileType(mimeType: string): boolean {
    return this.ALLOWED_MIME_TYPES.includes(mimeType)
  }

  static validateFileSize(size: number): boolean {
    return size <= this.MAX_FILE_SIZE
  }

  static sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 255)
  }
}
