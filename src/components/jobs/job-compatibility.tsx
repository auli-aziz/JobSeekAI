"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Code, Briefcase, GraduationCap, Award } from "lucide-react";
import type { JobCompatibilityProps } from "~/types/jobs";
import MatchScore from "~/components/jobs/match-score";

export default function JobCompatibility({
  job,
  matchScore,
  compatibilityData,
  skillMatches,
  experienceMatches,
}: JobCompatibilityProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const pros = compatibilityData.flatMap((item) =>
    item.pros.map((text) => ({ category: item.category, text })),
  );

  const cons = compatibilityData.flatMap((item) =>
    item.cons.map((text) => ({ category: item.category, text })),
  );

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
        <h3 className="text-lg font-semibold text-slate-900">
          Compatibility Analysis
        </h3>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Pros Card */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium text-green-700">Strengths</h4>
                </div>
                <ul className="space-y-3">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex gap-2">
                      <div className="mt-0.5 text-green-500">{getCategoryIcon(pro.category)}</div>
                      <div>
                        <p className="text-sm text-slate-700">{pro.text}</p>
                        <Badge
                          variant="outline"
                          className="mt-1 border-green-200 bg-green-50 text-xs text-green-700"
                        >
                          {pro.category.charAt(0).toUpperCase() +
                            pro.category.slice(1)}
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
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium text-amber-700">
                    Areas to Improve
                  </h4>
                </div>
                <ul className="space-y-3">
                  {cons.map((con, index) => (
                    <li key={index} className="flex gap-2">
                      <div className="mt-0.5 text-amber-500">{getCategoryIcon(con.category)}</div>
                      <div>
                        <p className="text-sm text-slate-700">{con.text}</p>
                        <Badge
                          variant="outline"
                          className="mt-1 border-amber-200 bg-amber-50 text-xs text-amber-700"
                        >
                          {con.category.charAt(0).toUpperCase() +
                            con.category.slice(1)}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <h4 className="font-medium text-slate-900">AI Recommendation</h4>
            </div>
            <p className="text-sm text-slate-700">
              Based on your profile, you&apos;re a strong candidate for this
              position. Consider highlighting your
              {job.title.toLowerCase().includes("developer")
                ? " development experience and technical skills"
                : " relevant experience"}
              in your application. Prepare to discuss how you&apos;ve overcome
              challenges related to
              {job.title.toLowerCase().includes("remote")
                ? " remote collaboration"
                : " team coordination"}
              .
            </p>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-4 font-medium text-slate-900">
                Skills Analysis
              </h4>
              <div className="space-y-4">
                {skillMatches.map((skill, index) => (
                  <div key={index}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {skill.skill}
                      </span>
                      <span className="text-sm text-slate-500">
                        {skill.match}% match
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${skill.match}%`,
                          backgroundColor:
                            skill.match >= 80
                              ? "#10b981"
                              : skill.match >= 60
                                ? "#22c55e"
                                : "#f59e0b",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-600">
                  <strong>Tip:</strong> Your skills in JavaScript and React are
                  particularly strong matches for this role.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-4 font-medium text-slate-900">
                Experience Analysis
              </h4>
              <div className="space-y-4">
                {experienceMatches.map((exp, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {exp.area}
                      </span>
                      <div className="flex items-center">
                        {exp.years >= exp.required ? (
                          <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="mr-1 h-4 w-4 text-amber-500" />
                        )}
                        <span className="text-sm text-slate-500">
                          {exp.years} yr{exp.years !== 1 ? "s" : ""} /{" "}
                          {exp.required} yr{exp.required !== 1 ? "s" : ""}{" "}
                          required
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (exp.years / exp.required) * 100)}%`,
                          backgroundColor:
                            exp.years >= exp.required ? "#10b981" : "#f59e0b",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
