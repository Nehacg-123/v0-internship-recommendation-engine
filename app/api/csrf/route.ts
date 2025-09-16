import { NextResponse } from "next/server"
import { CSRFProtection } from "@/lib/security"

export async function GET() {
  try {
    const csrfToken = CSRFProtection.generateToken()

    const response = NextResponse.json({
      success: true,
      csrfToken,
    })

    // Set CSRF token in header for validation
    response.headers.set("x-csrf-token", csrfToken)

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
