"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Target, Upload, X, User, BookOpen, Briefcase, MapPin, FileText, ArrowRight } from "lucide-react"

const EDUCATION_LEVELS = ["UG (Undergraduate)", "PG (Postgraduate)", "Diploma", "Other"]

const SECTORS = [
  "Technology & IT",
  "Healthcare",
  "Finance & Banking",
  "Education",
  "Manufacturing",
  "Government",
  "Non-Profit",
  "Media & Communications",
  "Retail & E-commerce",
  "Agriculture",
  "Tourism & Hospitality",
  "Other",
]

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    educationLevel: "",
    skills: [] as string[],
    sectors: [] as string[],
    locationPreference: "",
    skillsInput: "",
    resumeFile: null as File | null,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(JSON.parse(user))
  }, [router])

  const handleSkillAdd = () => {
    if (formData.skillsInput.trim() && !formData.skills.includes(formData.skillsInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.skillsInput.trim()],
        skillsInput: "",
      }))
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSectorChange = (sector: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sectors: checked ? [...prev.sectors, sector] : prev.sectors.filter((s) => s !== sector),
    }))
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setErrors(["Please upload a PDF or Word document"])
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(["File size must be less than 2MB"])
      return
    }

    setResumeUploading(true)
    setFormData((prev) => ({ ...prev, resumeFile: file }))

    try {
      // Simulate resume parsing - in real app, this would extract skills and education
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted data
      const extractedSkills = ["JavaScript", "React", "Node.js", "Python", "Communication"]
      const extractedEducation = "UG (Undergraduate)"

      setFormData((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...extractedSkills])],
        educationLevel: prev.educationLevel || extractedEducation,
      }))

      setErrors([])
    } catch (error) {
      setErrors(["Failed to process resume. Please try again."])
    } finally {
      setResumeUploading(false)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.educationLevel) newErrors.push("Education level is required")
    if (formData.skills.length === 0) newErrors.push("Please add at least one skill")
    if (formData.sectors.length === 0) newErrors.push("Please select at least one sector of interest")
    if (!formData.locationPreference) newErrors.push("Location preference is required")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data in localStorage
      const updatedUser = {
        ...currentUser,
        profile: {
          educationLevel: formData.educationLevel,
          skills: formData.skills,
          sectors: formData.sectors,
          locationPreference: formData.locationPreference,
          resumeUploaded: !!formData.resumeFile,
          profileCompleted: true,
          completedAt: new Date().toISOString(),
        },
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      router.push("/dashboard")
    } catch (error) {
      setErrors(["Failed to save profile. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">PM Internship</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome {currentUser.fullName}!</h2>
          <p className="text-lg text-muted-foreground">
            Please complete your profile to get personalized internship recommendations
          </p>
        </div>

        {errors.length > 0 && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Upload (Optional)
              </CardTitle>
              <CardDescription>
                Upload your resume to auto-fill your profile. We'll extract your skills and education details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {formData.resumeFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">{formData.resumeFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData((prev) => ({ ...prev, resumeFile: null }))}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-foreground mb-2">Upload Your Resume</p>
                      <p className="text-muted-foreground mb-4">PDF or Word document, max 2MB</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                        disabled={resumeUploading}
                      />
                      <Button type="button" asChild disabled={resumeUploading}>
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          {resumeUploading ? "Processing..." : "Choose File"}
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Education Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, educationLevel: value }))}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Skills
              </CardTitle>
              <CardDescription>
                Add your skills one by one. These will help us match you with relevant internships.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a skill (e.g., JavaScript, Communication, Marketing)"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skillsInput: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleSkillAdd())}
                  className="text-base"
                />
                <Button type="button" onClick={handleSkillAdd} disabled={!formData.skillsInput.trim()}>
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Skills:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 hover:bg-transparent"
                          onClick={() => handleSkillRemove(skill)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sector Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Sector Interests
              </CardTitle>
              <CardDescription>
                Select the sectors you're interested in working in (you can select multiple).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SECTORS.map((sector) => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      id={sector}
                      checked={formData.sectors.includes(sector)}
                      onCheckedChange={(checked) => handleSectorChange(sector, checked as boolean)}
                    />
                    <Label htmlFor={sector} className="text-sm font-normal cursor-pointer">
                      {sector}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Preference
              </CardTitle>
              <CardDescription>Select your preferred state for internship opportunities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.locationPreference}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, locationPreference: value }))}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your preferred state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" size="lg" className="text-lg px-8 py-6" disabled={isLoading}>
              {isLoading ? "Saving Profile..." : "Save & Continue"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
