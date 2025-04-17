"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from "lucide-react"
import type { JobCompatibilityProps } from "~/types/jobs"
import MatchScore from "~/components/jobs/match-score"

export default function JobCompatibility({
  job,
  matchScore,
  compatibilityData,
  skillMatches,
  experienceMatches,
}: JobCompatibilityProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  const pros = compatibilityData.filter((item) => item.type === "pro")
  const cons = compatibilityData.filter((item) => item.type === "con")

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
