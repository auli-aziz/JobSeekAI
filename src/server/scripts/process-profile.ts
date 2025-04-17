"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";
import type {
  Job,
  JobCompatibilityProps,
  CompatibilityItem,
  SkillMatch,
  ExperienceMatch,
} from "~/types/jobs";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY as string,
});

export async function processProfile(
  profileText: string,
  job: Job,
): Promise<JobCompatibilityProps> {
  const prompt = `
You are a job compatibility assistant. Given the user's profile and a job description, analyze and return:

- An overall compatibility score (0 to 100).
- AI recommendation in a short sentence
- A list of pros and cons in categories: skills, experience, education, other.
- Skill match score for each of the user's skill (0-100).
- Experience match information with required vs. actual years.

Respond only in valid JSON using the following structure:

{
  "matchScore": number,
  "AIRecommendation": string,
  "compatibilityData": CompatibilityItem[],
  "skillMatches": SkillMatch[],
  "experienceMatches": ExperienceMatch[]
}

User Profile:
${profileText}

Job Description:
Title: ${job.title}
Company: ${job.company_name}
Category: ${job.category}
Type: ${job.job_type}
Location: ${job.candidate_required_location}
Salary: ${job.salary ?? "N/A"}

Description:
${job.description}
  `.trim();

  const { text } = await generateText({
    model: openai.chat("gpt-4.5-turbo"),
    messages: [{ role: "user", content: prompt }],
  });

  const parsed = JSON.parse(text) as {
    matchScore: number;
    compatibilityData: CompatibilityItem[];
    skillMatches: SkillMatch[];
    experienceMatches: ExperienceMatch[];
  };

  return {
    job,
    matchScore: parsed.matchScore,
    compatibilityData: parsed.compatibilityData,
    skillMatches: parsed.skillMatches,
    experienceMatches: parsed.experienceMatches,
  };
}
