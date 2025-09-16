"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page
    router.push("/admin")
  }, [router])

  return null
}
