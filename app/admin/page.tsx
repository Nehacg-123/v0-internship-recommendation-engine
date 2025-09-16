"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  FileText,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Target,
  LogOut,
  BarChart3,
  PieChartIcon,
  Activity,
  Shield,
  Download,
  RefreshCw,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

interface AdminStats {
  totalUsers: number
  resumesUploaded: number
  totalFeedback: number
  positiveFeedback: number
  negativeFeedback: number
  commonSkills: { skill: string; count: number }[]
  topInternships: { title: string; views: number; saves: number }[]
  userRegistrations: { date: string; count: number }[]
  sectorDistribution: { sector: string; count: number }[]
  recentActivity: { action: string; user: string; timestamp: string }[]
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.role === "admin") {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()

      // Enhanced mock data with more realistic analytics
      const enhancedStats: AdminStats = {
        ...data.data,
        userRegistrations: [
          { date: "2024-01-01", count: 12 },
          { date: "2024-01-02", count: 18 },
          { date: "2024-01-03", count: 15 },
          { date: "2024-01-04", count: 22 },
          { date: "2024-01-05", count: 28 },
          { date: "2024-01-06", count: 25 },
          { date: "2024-01-07", count: 31 },
        ],
        sectorDistribution: [
          { sector: "Technology & IT", count: 35 },
          { sector: "Healthcare", count: 18 },
          { sector: "Finance & Banking", count: 15 },
          { sector: "Education", count: 12 },
          { sector: "Manufacturing", count: 10 },
          { sector: "Government", count: 8 },
          { sector: "Other", count: 12 },
        ],
        recentActivity: [
          { action: "User registered", user: "Priya Sharma", timestamp: "2 minutes ago" },
          { action: "Resume uploaded", user: "Rahul Kumar", timestamp: "5 minutes ago" },
          { action: "Internship saved", user: "Anita Patel", timestamp: "8 minutes ago" },
          { action: "Positive feedback", user: "Vikram Singh", timestamp: "12 minutes ago" },
          { action: "Profile completed", user: "Meera Reddy", timestamp: "15 minutes ago" },
        ],
      }

      setStats(enhancedStats)
    } catch (error: any) {
      setError(error.message || "Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    if (!stats) return

    const exportData = {
      timestamp: new Date().toISOString(),
      stats: stats,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pm-internship-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLogout = () => {
    logout()
  }

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  const COLORS = ["#0891b2", "#d97706", "#059669", "#dc2626", "#7c3aed", "#db2777", "#ea580c"]

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  {t("admin.title")} - {user?.fullName}
                </h1>
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">{t("common.admin")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportData} disabled={!stats}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("common.logout")}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {error && (
            <Alert className="mb-6 border-destructive/50 text-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.totalUsers")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.resumesUploaded")}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.resumesUploaded.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats ? Math.round((stats.resumesUploaded / stats.totalUsers) * 100) : 0}% of users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positive {t("admin.feedback")}</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.positiveFeedback.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats ? Math.round((stats.positiveFeedback / stats.totalFeedback) * 100) : 0}% positive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total {t("admin.feedback")}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalFeedback.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">User interactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Common Skills Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t("admin.commonSkills")}
                </CardTitle>
                <CardDescription>Skills mentioned most frequently by students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.commonSkills}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0891b2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest user actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Sector Interest Distribution
                </CardTitle>
                <CardDescription>Student preferences by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.sectorDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats?.sectorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Registrations Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Registration Trend
                </CardTitle>
                <CardDescription>Daily user registrations over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#0891b2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Internships */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.topInternships")}</CardTitle>
                <CardDescription>Based on views and saves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topInternships.map((internship, index) => (
                    <div key={internship.title} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{internship.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {internship.views} views • {internship.saves} saves
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
                <CardDescription>User satisfaction with recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats?.positiveFeedback}</div>
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Positive</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stats?.negativeFeedback}</div>
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <ThumbsDown className="w-4 h-4" />
                      <span>Negative</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stats ? Math.round((stats.positiveFeedback / stats.totalFeedback) * 100) : 0}%
                    </div>
                    <div className="text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
