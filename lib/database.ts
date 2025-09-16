// Database utility functions for PM Internship Recommendation Engine
// This would typically use a real database connection in production

interface DatabaseUser {
  id: number
  full_name: string
  email?: string
  phone?: string
  password_hash: string
  role: "student" | "admin" // Added role field
  created_at: string
  profile?: UserProfile
}

interface UserProfile {
  id: number
  user_id: number
  education_level: string
  location_preference: string
  resume_uploaded: boolean
  profile_completed: boolean
  skills: string[]
  sectors: string[]
}

interface DatabaseInternship {
  id: number
  title: string
  organization: string
  sector: string
  location: string
  description: string
  education_requirement: string
  required_skills: string[]
  is_active: boolean
}

// Mock database functions - in production, these would use actual SQL queries
export class DatabaseService {
  // User management
  static async createUser(userData: {
    fullName: string
    email?: string
    phone?: string
    passwordHash: string
    role?: "student" | "admin" // Added optional role parameter
  }): Promise<DatabaseUser> {
    // In production: INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (...)
    const user: DatabaseUser = {
      id: Date.now(),
      full_name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password_hash: userData.passwordHash,
      role: userData.role || "student", // Default to student role
      created_at: new Date().toISOString(),
    }

    // Store in localStorage for demo
    const users = JSON.parse(localStorage.getItem("db_users") || "[]")
    users.push(user)
    localStorage.setItem("db_users", JSON.stringify(users))

    return user
  }

  static async getUserByEmailOrPhone(emailOrPhone: string): Promise<DatabaseUser | null> {
    // In production: SELECT * FROM users WHERE email = ? OR phone = ?
    const users = JSON.parse(localStorage.getItem("db_users") || "[]")
    return users.find((u: DatabaseUser) => u.email === emailOrPhone || u.phone === emailOrPhone) || null
  }

  static async getUserById(id: number): Promise<DatabaseUser | null> {
    // In production: SELECT * FROM users WHERE id = ?
    const users = JSON.parse(localStorage.getItem("db_users") || "[]")
    return users.find((u: DatabaseUser) => u.id === id) || null
  }

  // Profile management
  static async createOrUpdateProfile(
    userId: number,
    profileData: {
      educationLevel: string
      skills: string[]
      sectors: string[]
      locationPreference: string
      resumeUploaded: boolean
    },
  ): Promise<UserProfile> {
    // In production: INSERT/UPDATE user_profiles, user_skills, user_sectors tables
    const profile: UserProfile = {
      id: Date.now(),
      user_id: userId,
      education_level: profileData.educationLevel,
      location_preference: profileData.locationPreference,
      resume_uploaded: profileData.resumeUploaded,
      profile_completed: true,
      skills: profileData.skills,
      sectors: profileData.sectors,
    }

    // Store in localStorage for demo
    const profiles = JSON.parse(localStorage.getItem("db_profiles") || "[]")
    const existingIndex = profiles.findIndex((p: UserProfile) => p.user_id === userId)

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile
    } else {
      profiles.push(profile)
    }

    localStorage.setItem("db_profiles", JSON.stringify(profiles))

    return profile
  }

  static async getUserProfile(userId: number): Promise<UserProfile | null> {
    // In production: Complex JOIN query to get profile with skills and sectors
    const profiles = JSON.parse(localStorage.getItem("db_profiles") || "[]")
    return profiles.find((p: UserProfile) => p.user_id === userId) || null
  }

  // Internship management
  static async getActiveInternships(): Promise<DatabaseInternship[]> {
    // In production: SELECT internships with JOINs to get skills and sector names
    // For demo, return mock data that matches our seed data
    return [
      {
        id: 1,
        title: "Software Development Intern",
        organization: "TechCorp India",
        sector: "Technology & IT",
        location: "Karnataka",
        description:
          "Work on web applications using modern JavaScript frameworks. Learn full-stack development and agile methodologies.",
        education_requirement: "UG (Undergraduate)",
        required_skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
        is_active: true,
      },
      {
        id: 2,
        title: "Digital Marketing Intern",
        organization: "Marketing Solutions Ltd",
        sector: "Media & Communications",
        location: "Maharashtra",
        description: "Assist in creating digital marketing campaigns, social media management, and content creation.",
        education_requirement: "UG (Undergraduate)",
        required_skills: ["Digital Marketing", "Social Media", "Content Writing", "Analytics", "Communication"],
        is_active: true,
      },
      // ... other internships would be loaded from database
    ]
  }

  // Feedback management
  static async saveFeedback(userId: number, internshipId: number, rating: "up" | "down"): Promise<void> {
    // In production: INSERT INTO internship_feedback (user_id, internship_id, rating) VALUES (...)
    const feedback = {
      id: Date.now(),
      user_id: userId,
      internship_id: internshipId,
      rating,
      created_at: new Date().toISOString(),
    }

    const allFeedback = JSON.parse(localStorage.getItem("db_feedback") || "[]")
    // Remove existing feedback for this user-internship pair
    const filteredFeedback = allFeedback.filter((f: any) => !(f.user_id === userId && f.internship_id === internshipId))
    filteredFeedback.push(feedback)
    localStorage.setItem("db_feedback", JSON.stringify(filteredFeedback))
  }

  // Saved internships management
  static async saveInternship(userId: number, internshipId: number): Promise<void> {
    // In production: INSERT INTO saved_internships (user_id, internship_id) VALUES (...)
    const saved = {
      id: Date.now(),
      user_id: userId,
      internship_id: internshipId,
      created_at: new Date().toISOString(),
    }

    const allSaved = JSON.parse(localStorage.getItem("db_saved") || "[]")
    allSaved.push(saved)
    localStorage.setItem("db_saved", JSON.stringify(allSaved))
  }

  static async unsaveInternship(userId: number, internshipId: number): Promise<void> {
    // In production: DELETE FROM saved_internships WHERE user_id = ? AND internship_id = ?
    const allSaved = JSON.parse(localStorage.getItem("db_saved") || "[]")
    const filtered = allSaved.filter((s: any) => !(s.user_id === userId && s.internship_id === internshipId))
    localStorage.setItem("db_saved", JSON.stringify(filtered))
  }

  static async getUserSavedInternships(userId: number): Promise<number[]> {
    // In production: SELECT internship_id FROM saved_internships WHERE user_id = ?
    const allSaved = JSON.parse(localStorage.getItem("db_saved") || "[]")
    return allSaved.filter((s: any) => s.user_id === userId).map((s: any) => s.internship_id)
  }

  // Analytics
  static async logUserAction(userId: number, action: string, internshipId?: number, metadata?: any): Promise<void> {
    // In production: INSERT INTO user_analytics (user_id, action, internship_id, metadata) VALUES (...)
    const analyticsEntry = {
      id: Date.now(),
      user_id: userId,
      action,
      internship_id: internshipId || null,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    }

    const analytics = JSON.parse(localStorage.getItem("db_analytics") || "[]")
    analytics.push(analyticsEntry)
    localStorage.setItem("db_analytics", JSON.stringify(analytics))
  }

  // Admin analytics
  static async getAnalyticsData(): Promise<{
    totalUsers: number
    resumesUploaded: number
    totalFeedback: number
    positiveFeedback: number
    negativeFeedback: number
    commonSkills: { skill: string; count: number }[]
    topInternships: { title: string; views: number; saves: number }[]
  }> {
    // In production: Complex analytics queries across multiple tables
    const users = JSON.parse(localStorage.getItem("db_users") || "[]")
    const profiles = JSON.parse(localStorage.getItem("db_profiles") || "[]")
    const feedback = JSON.parse(localStorage.getItem("db_feedback") || "[]")
    const analytics = JSON.parse(localStorage.getItem("db_analytics") || "[]")

    const resumesUploaded = profiles.filter((p: UserProfile) => p.resume_uploaded).length
    const positiveFeedback = feedback.filter((f: any) => f.rating === "up").length
    const negativeFeedback = feedback.filter((f: any) => f.rating === "down").length

    // Calculate common skills from profiles
    const skillCounts: { [key: string]: number } = {}
    profiles.forEach((profile: UserProfile) => {
      profile.skills.forEach((skill: string) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    })

    const commonSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    // Mock top internships data
    const topInternships = [
      { title: "Software Development Intern", views: 156, saves: 45 },
      { title: "Digital Marketing Intern", views: 134, saves: 38 },
      { title: "Data Analysis Intern", views: 128, saves: 42 },
      { title: "Financial Analysis Intern", views: 98, saves: 28 },
      { title: "Healthcare Administration Intern", views: 87, saves: 22 },
    ]

    return {
      totalUsers: users.length + 100, // Add some mock users
      resumesUploaded: resumesUploaded + 60, // Add some mock resumes
      totalFeedback: feedback.length + 250, // Add some mock feedback
      positiveFeedback: positiveFeedback + 200,
      negativeFeedback: negativeFeedback + 50,
      commonSkills,
      topInternships,
    }
  }
}
