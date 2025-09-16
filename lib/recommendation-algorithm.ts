// Multi-Criteria Ranking Algorithm for PM Internship Recommendations
// Criteria weights: Skills Match (40%), Education Fit (20%), Sector Match (20%), Location (20%)

interface UserProfile {
  educationLevel: string
  skills: string[]
  sectors: string[]
  locationPreference: string
}

interface Internship {
  id: string
  title: string
  organization: string
  sector: string
  location: string
  description: string
  requiredSkills: string[]
  educationRequirement: string
  matchScore?: number
  skillsMatched?: string[]
  skillsGap?: string[]
}

// Mock internship data - in real app, this would come from database
const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "1",
    title: "Software Development Intern",
    organization: "TechCorp India",
    sector: "Technology & IT",
    location: "Karnataka",
    description:
      "Work on web applications using modern JavaScript frameworks. Learn full-stack development and agile methodologies.",
    requiredSkills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "2",
    title: "Digital Marketing Intern",
    organization: "Marketing Solutions Ltd",
    sector: "Media & Communications",
    location: "Maharashtra",
    description: "Assist in creating digital marketing campaigns, social media management, and content creation.",
    requiredSkills: ["Digital Marketing", "Social Media", "Content Writing", "Analytics", "Communication"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "3",
    title: "Data Analysis Intern",
    organization: "DataTech Solutions",
    sector: "Technology & IT",
    location: "Karnataka",
    description: "Analyze business data, create reports, and support data-driven decision making using Python and SQL.",
    requiredSkills: ["Python", "SQL", "Data Analysis", "Excel", "Statistics"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "4",
    title: "Healthcare Administration Intern",
    organization: "City General Hospital",
    sector: "Healthcare",
    location: "Tamil Nadu",
    description: "Support hospital administration, patient records management, and healthcare operations.",
    requiredSkills: ["Administration", "Communication", "Healthcare Knowledge", "Computer Skills", "Organization"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "5",
    title: "Financial Analysis Intern",
    organization: "National Bank",
    sector: "Finance & Banking",
    location: "Maharashtra",
    description: "Assist in financial analysis, risk assessment, and investment research for banking operations.",
    requiredSkills: ["Finance", "Excel", "Analysis", "Mathematics", "Communication"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "6",
    title: "Teaching Assistant Intern",
    organization: "State Education Board",
    sector: "Education",
    location: "Delhi",
    description: "Support teachers in classroom activities, curriculum development, and student assessment.",
    requiredSkills: ["Teaching", "Communication", "Subject Knowledge", "Patience", "Organization"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "7",
    title: "Manufacturing Process Intern",
    organization: "Industrial Manufacturing Co",
    sector: "Manufacturing",
    location: "Gujarat",
    description: "Learn manufacturing processes, quality control, and production optimization techniques.",
    requiredSkills: ["Engineering", "Quality Control", "Process Improvement", "Technical Skills", "Problem Solving"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "8",
    title: "Government Policy Research Intern",
    organization: "Ministry of Rural Development",
    sector: "Government",
    location: "Delhi",
    description: "Research policy impacts, analyze government programs, and support policy development initiatives.",
    requiredSkills: ["Research", "Policy Analysis", "Writing", "Communication", "Critical Thinking"],
    educationRequirement: "PG (Postgraduate)",
  },
  {
    id: "9",
    title: "NGO Program Coordinator Intern",
    organization: "Rural Development Foundation",
    sector: "Non-Profit",
    location: "Rajasthan",
    description:
      "Coordinate community development programs, organize events, and support rural development initiatives.",
    requiredSkills: ["Project Management", "Communication", "Community Work", "Organization", "Leadership"],
    educationRequirement: "UG (Undergraduate)",
  },
  {
    id: "10",
    title: "E-commerce Operations Intern",
    organization: "Online Retail Hub",
    sector: "Retail & E-commerce",
    location: "Karnataka",
    description: "Support online store operations, inventory management, and customer service for e-commerce platform.",
    requiredSkills: ["E-commerce", "Customer Service", "Inventory Management", "Computer Skills", "Communication"],
    educationRequirement: "UG (Undergraduate)",
  },
]

function calculateSkillsMatch(userSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 0

  const matchedSkills = userSkills.filter((skill) =>
    requiredSkills.some(
      (required) =>
        required.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(required.toLowerCase()),
    ),
  )

  return matchedSkills.length / requiredSkills.length
}

function calculateEducationFit(userEducation: string, requiredEducation: string): number {
  // Exact match gets full score
  if (userEducation === requiredEducation) return 1.0

  // Education level hierarchy scoring
  const educationLevels = {
    Other: 1,
    Diploma: 2,
    "UG (Undergraduate)": 3,
    "PG (Postgraduate)": 4,
  }

  const userLevel = educationLevels[userEducation as keyof typeof educationLevels] || 1
  const requiredLevel = educationLevels[requiredEducation as keyof typeof educationLevels] || 1

  // If user education is higher than required, give partial credit
  if (userLevel >= requiredLevel) return 0.8

  // If user education is lower, give reduced credit
  return Math.max(0.3, userLevel / requiredLevel)
}

function calculateSectorMatch(userSectors: string[], internshipSector: string): number {
  return userSectors.includes(internshipSector) ? 1.0 : 0.0
}

function calculateLocationMatch(userLocation: string, internshipLocation: string): number {
  return userLocation === internshipLocation ? 1.0 : 0.3 // Partial credit for different locations
}

export function calculateRecommendations(userProfile: UserProfile): Internship[] {
  const scoredInternships = MOCK_INTERNSHIPS.map((internship) => {
    // Calculate individual criteria scores
    const skillsScore = calculateSkillsMatch(userProfile.skills, internship.requiredSkills)
    const educationScore = calculateEducationFit(userProfile.educationLevel, internship.educationRequirement)
    const sectorScore = calculateSectorMatch(userProfile.sectors, internship.sector)
    const locationScore = calculateLocationMatch(userProfile.locationPreference, internship.location)

    // Apply weights: Skills (40%), Education (20%), Sector (20%), Location (20%)
    const matchScore = skillsScore * 0.4 + educationScore * 0.2 + sectorScore * 0.2 + locationScore * 0.2

    // Calculate matched and gap skills
    const skillsMatched = userProfile.skills.filter((skill) =>
      internship.requiredSkills.some(
        (required) =>
          required.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(required.toLowerCase()),
      ),
    )

    const skillsGap = internship.requiredSkills.filter(
      (required) =>
        !userProfile.skills.some(
          (skill) =>
            required.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(required.toLowerCase()),
        ),
    )

    return {
      ...internship,
      matchScore,
      skillsMatched,
      skillsGap,
    }
  })

  // Sort by match score (highest first) and return top 5
  return scoredInternships.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 5)
}
