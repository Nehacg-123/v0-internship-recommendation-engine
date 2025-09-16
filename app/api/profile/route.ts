import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, educationLevel, skills, sectors, locationPreference, resumeUploaded } = body

    // Validate input
    if (!userId || !educationLevel || !skills || !sectors || !locationPreference) {
      return NextResponse.json({ error: "All profile fields are required" }, { status: 400 })
    }

    // Save profile
    const profile = await DatabaseService.createOrUpdateProfile(userId, {
      educationLevel,
      skills,
      sectors,
      locationPreference,
      resumeUploaded: resumeUploaded || false,
    })

    // Log profile completion
    await DatabaseService.logUserAction(userId, "profile_complete")

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const profile = await DatabaseService.getUserProfile(Number.parseInt(userId))

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
