"use client";

import { TabsContent } from "~/components/ui/tabs";
import JobCompatibility from "~/components/jobs/job-compatibility";
import type { Job } from "~/types/jobs";

interface CompatibilityTabProps {
  job: any; // Use any type to avoid type issues with the server component
  similarity: number;
}

export default function CompatibilityTab({ job, similarity }: CompatibilityTabProps) {
  // Calculate the match score from similarity
  const matchScore = Number(Math.min((similarity ?? 0) * 100 + 25, 100).toFixed(1));

  // Sample compatibility data - in a real app this would come from API
  const compatibilityData = [
    {
      category: "skills" as const,
      pros: ["Strong JavaScript experience", "React expertise matches job requirements"],
      cons: ["No experience with GraphQL mentioned in resume"]
    },
    {
      category: "experience" as const,
      pros: ["3+ years in software development", "Experience in agile environments"],
      cons: ["Limited leadership experience"]
    }
  ];

  const skillMatches = [
    { skill: "JavaScript", matchScore: 90 },
    { skill: "React", matchScore: 85 },
    { skill: "TypeScript", matchScore: 75 },
    { skill: "GraphQL", matchScore: 40 }
  ];

  const experienceMatches = [
    { area: "Software Development", actual: 3, required: 2 },
    { area: "Team Leadership", actual: 1, required: 2 },
    { area: "Agile Methodology", actual: 2, required: 1 }
  ];

  return (
    <TabsContent value="compatibility" className="pt-6">
      <JobCompatibility
        job={job}
        matchScore={matchScore}
        compatibilityData={compatibilityData}
        skillMatches={skillMatches}
        experienceMatches={experienceMatches}
      />
    </TabsContent>
  );
} 