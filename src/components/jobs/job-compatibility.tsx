"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Award, Briefcase, GraduationCap, Code } from "lucide-react"
import type { Job } from "~/types/jobs"
import MatchScore from "~/components/jobs/match-score"

interface JobCompatibilityProps {
  job: Job
  matchScore: number
}

interface CompatibilityItem {
  type: "pro" | "con"
  category: "skills" | "experience" | "education" | "other"
  text: string
}

export default function JobCompatibility({ job, matchScore }: JobCompatibilityProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Generate dummy compatibility data based on job
  const generateCompatibilityData = (job: Job): CompatibilityItem[] => {
    // This would normally come from an AI analysis of the resume and job
    const data: CompatibilityItem[] = []

    // Add some pros based on job title and category
    if (job.title.toLowerCase().includes("developer") || job.title.toLowerCase().includes("engineer")) {
      data.push({
        type: "pro",
        category: "skills",
        text: "Your programming skills in JavaScript and React match the job requirements",
      })
      data.push({
        type: "pro",
        category: "experience",
        text: "You have 3+ years of experience in software development",
      })
    }

    if (job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("lead")) {
      data.push({
        type: "pro",
        category: "experience",
        text: "Your leadership experience aligns with this senior role",
      })
    }

    if (job.title.toLowerCase().includes("frontend")) {
      data.push({
        type: "pro",
        category: "skills",
        text: "Your UI/UX design skills are a great match for this position",
      })
    }

    // Add some generic pros
    data.push({
      type: "pro",
      category: "education",
      text: "Your educational background meets the requirements",
    })

    // Add some cons
    if (job.title.toLowerCase().includes("backend")) {
      data.push({
        type: "con",
        category: "skills",
        text: "You may need to strengthen your database optimization skills",
      })
    }

    if (job.title.toLowerCase().includes("manager")) {
      data.push({
        type: "con",
        category: "experience",
        text: "You have less management experience than required",
      })
    }

    // Add some generic cons
    data.push({
      type: "con",
      category: "skills",
      text: "Consider improving your knowledge of industry-specific tools",
    })

    // Ensure we have at least 3 pros and 2 cons
    if (data.filter((item) => item.type === "pro").length < 3) {
      data.push({
        type: "pro",
        category: "other",
        text: "Your communication skills are well-suited for this role",
      })
    }

    if (data.filter((item) => item.type === "con").length < 2) {
      data.push({
        type: "con",
        category: "other",
        text: "The job requires more experience with remote collaboration tools",
      })
    }

    return data
  }

  const compatibilityData = generateCompatibilityData(job)
  const pros = compatibilityData.filter((item) => item.type === "pro")
  const cons = compatibilityData.filter((item) => item.type === "con")

  // Generate skill match data
  const skillMatches = [
    { skill: "JavaScript", match: 95 },
    { skill: "React", match: 90 },
    { skill: "TypeScript", match: 85 },
    { skill: "Node.js", match: 75 },
    { skill: "UI/UX Design", match: 70 },
  ]

  // Generate experience match data
  const experienceMatches = [
    { area: "Software Development", years: 4, required: 3 },
    { area: "Team Leadership", years: 2, required: 3 },
    { area: "Remote Work", years: 3, required: 1 },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "skills":
        return <Code className="h-4 w-4" />
      case "experience":
        return <Briefcase className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Compatibility Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Your match:</span>
          <MatchScore score={matchScore} size="md" showLabel={false} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pros Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium text-green-700">Strengths</h4>
                </div>
                <ul className="space-y-3">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex gap-2">
                      <div className="mt-0.5 text-green-500">{getCategoryIcon(pro.category)}</div>
                      <div>
                        <p className="text-sm text-slate-700">{pro.text}</p>
                        <Badge variant="outline" className="mt-1 text-xs bg-green-50 text-green-700 border-green-200">
                          {pro.category.charAt(0).toUpperCase() + pro.category.slice(1)}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cons Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium text-amber-700">Areas to Improve</h4>
                </div>
                <ul className="space-y-3">
                  {cons.map((con, index) => (
                    <li key={index} className="flex gap-2">
                      <div className="mt-0.5 text-amber-500">{getCategoryIcon(con.category)}</div>
                      <div>
                        <p className="text-sm text-slate-700">{con.text}</p>
                        <Badge variant="outline" className="mt-1 text-xs bg-amber-50 text-amber-700 border-amber-200">
                          {con.category.charAt(0).toUpperCase() + con.category.slice(1)}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-slate-900">AI Recommendation</h4>
            </div>
            <p className="text-sm text-slate-700">
              Based on your profile, you&apos;re a strong candidate for this position. Consider highlighting your
              {job.title.toLowerCase().includes("developer")
                ? " development experience and technical skills"
                : " relevant experience"}
              in your application. Prepare to discuss how you&apos;ve overcome challenges related to
              {job.title.toLowerCase().includes("remote") ? " remote collaboration" : " team coordination"}.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-900 mb-4">Skills Analysis</h4>
              <div className="space-y-4">
                {skillMatches.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{skill.skill}</span>
                      <span className="text-sm text-slate-500">{skill.match}% match</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${skill.match}%`,
                          backgroundColor: skill.match >= 80 ? "#10b981" : skill.match >= 60 ? "#22c55e" : "#f59e0b",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong>Tip:</strong> Your skills in JavaScript and React are particularly strong matches for this
                  role.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-900 mb-4">Experience Analysis</h4>
              <div className="space-y-4">
                {experienceMatches.map((exp, index) => (
                  <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{exp.area}</span>
                      <div className="flex items-center">
                        {exp.years >= exp.required ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-amber-500 mr-1" />
                        )}
                        <span className="text-sm text-slate-500">
                          {exp.years} yr{exp.years !== 1 ? "s" : ""} / {exp.required} yr{exp.required !== 1 ? "s" : ""}{" "}
                          required
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (exp.years / exp.required) * 100)}%`,
                          backgroundColor: exp.years >= exp.required ? "#10b981" : "#f59e0b",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong>Insight:</strong> Your software development experience exceeds requirements, but you may want
                  to highlight any team leadership experience in your application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
