"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, MapPin, Bookmark, User, Settings, BookmarkCheck, Lightbulb, LogOut } from "lucide-react"
import { InternshipCard } from "@/components/internship-card"
import { calculateRecommendations } from "@/lib/recommendation-algorithm"
import { AIChatbot } from "@/components/ai-chatbot"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [savedInternships, setSavedInternships] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (!userData.profile?.profileCompleted) {
      router.push("/profile-setup")
      return
    }

    setCurrentUser(userData)

    // Load saved internships
    const saved = localStorage.getItem(`savedInternships_${userData.id}`) || "[]"
    setSavedInternships(JSON.parse(saved))

    // Calculate recommendations
    const recs = calculateRecommendations(userData.profile)
    setRecommendations(recs)
    setIsLoading(false)
  }, [router])

  const handleSaveInternship = (internshipId: string) => {
    const newSaved = savedInternships.includes(internshipId)
      ? savedInternships.filter((id) => id !== internshipId)
      : [...savedInternships, internshipId]

    setSavedInternships(newSaved)
    localStorage.setItem(`savedInternships_${currentUser.id}`, JSON.stringify(newSaved))
  }

  const handleFeedback = (internshipId: string, rating: "up" | "down") => {
    // Store feedback
    const feedback = {
      userId: currentUser.id,
      internshipId,
      rating,
      timestamp: new Date().toISOString(),
    }

    const existingFeedback = JSON.parse(localStorage.getItem("internshipFeedback") || "[]")
    const updatedFeedback = existingFeedback.filter(
      (f: any) => !(f.userId === currentUser.id && f.internshipId === internshipId),
    )
    updatedFeedback.push(feedback)

    localStorage.setItem("internshipFeedback", JSON.stringify(updatedFeedback))
  }

  const handleShare = (internship: any) => {
    const shareText = `Check out this internship opportunity: ${internship.title} at ${internship.organization} in ${internship.location}`

    if (navigator.share) {
      navigator.share({
        title: internship.title,
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Internship details copied to clipboard!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">PM Internship</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Button variant="outline" size="sm" onClick={() => router.push("/profile-setup")}>
                <Settings className="w-4 h-4 mr-2" />
                {t("profile.edit") || "Edit Profile"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard.welcome")}, {currentUser.fullName}!
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("dashboard.welcomeMessage") ||
              "Here are your personalized internship recommendations based on your profile"}
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Education</p>
                <p className="font-medium">{currentUser.profile.educationLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Skills</p>
                <p className="font-medium">{currentUser.profile.skills.length} skills</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interests</p>
                <p className="font-medium">{currentUser.profile.sectors.length} sectors</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-medium">{currentUser.profile.locationPreference}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Your Top Recommendations ({recommendations.length})
          </h3>

          {recommendations.length === 0 ? (
            <Alert>
              <Lightbulb className="w-4 h-4" />
              <AlertDescription>
                No internships match your current profile. Try updating your skills or expanding your sector interests.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-6">
              {recommendations.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  userSkills={currentUser.profile.skills}
                  isSaved={savedInternships.includes(internship.id)}
                  onSave={() => handleSaveInternship(internship.id)}
                  onFeedback={(rating) => handleFeedback(internship.id, rating)}
                  onShare={() => handleShare(internship)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved Internships */}
        {savedInternships.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BookmarkCheck className="w-6 h-6" />
              Your Saved Internships ({savedInternships.length})
            </h3>
            <div className="grid gap-4">
              {recommendations
                .filter((internship) => savedInternships.includes(internship.id))
                .map((internship) => (
                  <Card key={internship.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{internship.title}</h4>
                          <p className="text-muted-foreground">{internship.organization}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {internship.location}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleSaveInternship(internship.id)}>
                          <Bookmark className="w-4 h-4 mr-2 fill-current" />
                          Saved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {t("dashboard.tips") || "Tips to Improve Your Matches"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• {t("dashboard.tip1") || "Add more skills to your profile to get better matches"}</li>
              <li>• {t("dashboard.tip2") || "Consider expanding your sector interests"}</li>
              <li>• {t("dashboard.tip3") || "Upload your resume for automatic skill extraction"}</li>
              <li>• {t("dashboard.tip4") || "Provide feedback on recommendations to improve future suggestions"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Chatbot Widget */}
      <AIChatbot userProfile={currentUser?.profile} />
    </div>
  )
}
