// Authentication utilities for PM Internship Recommendation Engine
import { DatabaseService } from "./database"
import { InputValidator, RateLimiter, PasswordSecurity } from "./security"

export interface AuthUser {
  id: number
  fullName: string
  email?: string
  phone?: string
  role: "student" | "admin"
  profile?: any
}

export async function hashPassword(password: string): Promise<string> {
  return await PasswordSecurity.hashPassword(password)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await PasswordSecurity.verifyPassword(password, hash)
}

export async function registerUser(
  userData: {
    fullName: string
    email?: string
    phone?: string
    password: string
  },
  clientIP?: string,
): Promise<AuthUser> {
  const identifier = clientIP || "unknown"

  if (!RateLimiter.checkRateLimit(`register:${identifier}`, 3, 15 * 60 * 1000)) {
    throw new Error("Too many registration attempts. Please try again later.")
  }

  // Validate inputs
  if (!InputValidator.validateName(userData.fullName)) {
    throw new Error("Invalid name format")
  }

  if (userData.email && !InputValidator.validateEmail(userData.email)) {
    throw new Error("Invalid email format")
  }

  if (userData.phone && !InputValidator.validatePhone(userData.phone)) {
    throw new Error("Invalid phone number format")
  }

  const passwordValidation = InputValidator.validatePassword(userData.password)
  if (!passwordValidation.isValid) {
    throw new Error(`Password requirements not met: ${passwordValidation.errors.join(", ")}`)
  }

  // Sanitize inputs
  const sanitizedData = {
    fullName: InputValidator.sanitizeString(userData.fullName),
    email: userData.email ? InputValidator.sanitizeString(userData.email) : undefined,
    phone: userData.phone ? InputValidator.sanitizeString(userData.phone) : undefined,
    password: userData.password,
  }

  // Check if user already exists
  const existingUser = await DatabaseService.getUserByEmailOrPhone(sanitizedData.email || sanitizedData.phone || "")
  if (existingUser) {
    throw new Error("User already exists with this email or phone number")
  }

  // Create new user
  const passwordHash = await hashPassword(sanitizedData.password)
  const dbUser = await DatabaseService.createUser({
    fullName: sanitizedData.fullName,
    email: sanitizedData.email,
    phone: sanitizedData.phone,
    passwordHash,
    role: "student",
  })

  // Log registration event
  await DatabaseService.logUserAction(dbUser.id, "register", undefined, { ip: clientIP })

  return {
    id: dbUser.id,
    fullName: dbUser.full_name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role as "student" | "admin",
  }
}

export async function loginUser(emailOrPhone: string, password: string, clientIP?: string): Promise<AuthUser> {
  const identifier = clientIP || emailOrPhone

  if (!RateLimiter.checkRateLimit(`login:${identifier}`, 5, 15 * 60 * 60 * 1000)) {
    const resetTime = RateLimiter.getResetTime(`login:${identifier}`)
    const remainingMinutes = resetTime ? Math.ceil((resetTime - Date.now()) / (60 * 1000)) : 15
    throw new Error(`Too many login attempts. Please try again in ${remainingMinutes} minutes.`)
  }

  // Sanitize input
  const sanitizedEmailOrPhone = InputValidator.sanitizeString(emailOrPhone)

  // Find user
  const dbUser = await DatabaseService.getUserByEmailOrPhone(sanitizedEmailOrPhone)
  if (!dbUser) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  if (!(await verifyPassword(password, dbUser.password_hash))) {
    throw new Error("Invalid credentials")
  }

  // Get user profile
  const profile = await DatabaseService.getUserProfile(dbUser.id)

  // Log login event
  await DatabaseService.logUserAction(dbUser.id, "login", undefined, { ip: clientIP })

  return {
    id: dbUser.id,
    fullName: dbUser.full_name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role as "student" | "admin",
    profile,
  }
}

export async function getCurrentUser(userId: number): Promise<AuthUser | null> {
  const dbUser = await DatabaseService.getUserById(userId)
  if (!dbUser) return null

  const profile = await DatabaseService.getUserProfile(dbUser.id)

  return {
    id: dbUser.id,
    fullName: dbUser.full_name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role as "student" | "admin",
    profile,
  }
}

export function generateJWT(user: AuthUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

export function verifyJWT(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    return {
      id: payload.id,
      fullName: "",
      email: payload.email,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export function requireRole(userRole: string, requiredRole: "student" | "admin"): boolean {
  if (requiredRole === "admin" && userRole !== "admin") {
    return false
  }
  return true
}
