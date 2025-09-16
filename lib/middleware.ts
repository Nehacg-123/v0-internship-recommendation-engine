// Middleware for role-based route protection
import { type AuthUser, verifyJWT } from "./auth"

export function withAuth(handler: (user: AuthUser) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const token = authHeader.substring(7)
    const user = verifyJWT(token)

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(user)
  }
}

export function withAdminAuth(handler: (user: AuthUser) => Promise<Response>) {
  return withAuth(async (user: AuthUser) => {
    if (user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
    return handler(user)
  })
}
