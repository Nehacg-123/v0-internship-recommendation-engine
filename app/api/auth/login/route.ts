import { type NextRequest, NextResponse } from "next/server"
import { loginUser, generateJWT } from "@/lib/auth"
import { CSRFProtection } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    const body = await request.json()
    const { emailOrPhone, password, csrfToken } = body

    // Validate CSRF token if provided
    const storedCSRFToken = request.headers.get("x-csrf-token")
    if (storedCSRFToken && !CSRFProtection.validateToken(csrfToken, storedCSRFToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    // Validate input
    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    // Login user with enhanced security
    const user = await loginUser(emailOrPhone, password, clientIP)
    const token = generateJWT(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
      },
      token,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
