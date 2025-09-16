import { type NextRequest, NextResponse } from "next/server"
import { registerUser, generateJWT } from "@/lib/auth"
import { CSRFProtection } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    const body = await request.json()
    const { fullName, email, phone, password, csrfToken } = body

    // Validate CSRF token if provided
    const storedCSRFToken = request.headers.get("x-csrf-token")
    if (storedCSRFToken && !CSRFProtection.validateToken(csrfToken, storedCSRFToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    // Validate input
    if (!fullName || !password) {
      return NextResponse.json({ error: "Full name and password are required" }, { status: 400 })
    }

    if (!email && !phone) {
      return NextResponse.json({ error: "Either email or phone is required" }, { status: 400 })
    }

    // Register user with enhanced security
    const user = await registerUser({ fullName, email, phone, password }, clientIP)
    const token = generateJWT(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
