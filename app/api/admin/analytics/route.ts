import { type NextRequest, NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/middleware"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  return withAdminAuth(async (user) => {
    try {
      const analyticsData = await DatabaseService.getAnalyticsData()
      return NextResponse.json({
        success: true,
        data: analyticsData,
      })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })(request)
}
