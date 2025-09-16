"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Building, ThumbsUp, ThumbsDown, Bookmark, Share2, Lightbulb, Star } from "lucide-react"

interface InternshipCardProps {
  internship: {
    id: string
    title: string
    organization: string
    sector: string
    location: string
    description: string
    requiredSkills: string[]
    matchScore: number
    skillsMatched: string[]
    skillsGap: string[]
  }
  userSkills: string[]
  isSaved: boolean
  onSave: () => void
  onFeedback: (rating: "up" | "down") => void
  onShare: () => void
}

export function InternshipCard({ internship, userSkills, isSaved, onSave, onFeedback, onShare }: InternshipCardProps) {
  const matchPercentage = Math.round(internship.matchScore * 100)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{internship.title}</CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {matchPercentage}% match
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4 text-base">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {internship.organization}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {internship.location}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-muted-foreground">{internship.description}</p>

        {/* Skills Matched */}
        {internship.skillsMatched.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-2">Your Matching Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {internship.skillsMatched.map((skill) => (
                <Badge key={skill} variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Gap */}
        {internship.skillsGap.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <Lightbulb className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Skill Gap:</strong> This internship requires{" "}
              <span className="font-medium">{internship.skillsGap.join(", ")}</span>. Consider learning these skills
              online to improve your chances.
            </AlertDescription>
          </Alert>
        )}

        {/* Required Skills */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className={
                  userSkills.includes(skill) ? "border-green-500 text-green-700" : "border-gray-300 text-gray-600"
                }
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onFeedback("up")} className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              Helpful
            </Button>
            <Button variant="outline" size="sm" onClick={() => onFeedback("down")} className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" />
              Not Relevant
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-1 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              onClick={onSave}
              className="flex items-center gap-1"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
