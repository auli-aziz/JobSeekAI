import { z } from 'zod';

const CompatibilityCategoryGroupSchema = z.object({
  category: z
    .enum(['skills', 'experience', 'education', 'other'])
    .describe('Type of compatibility aspect being evaluated (skills, experience, education, or other)'),
  pros: z
    .array(z.string())
    .describe('Strengths or good matches between resume and job for this category'),
  cons: z
    .array(z.string())
    .describe('Weaknesses or mismatches between resume and job for this category'),
});

const SkillMatchSchema = z.object({
  skill: z.string().describe('Name of the skill being compared'),
  matchScore: z
    .number()
    .describe('Score from 0 to 100 indicating how well the skill from the resume matches the job'),
});

const ExperienceMatchSchema = z.object({
  area: z.string().describe('The area or domain of experience (e.g., software development)'),
  actual: z.number().describe('Years of experience the candidate has in this area'),
  required: z.number().describe('Years of experience required by the job in this area'),
});

export const JobCompatibilitySchema = z.object({
  compatibilityData: z
    .array(CompatibilityCategoryGroupSchema)
    .describe('Breakdown of compatibility by category, showing strengths and weaknesses'),
  skillMatches: z
    .array(SkillMatchSchema)
    .describe('List of skills with their match scores between the resume and job requirements'),
  experienceMatches: z
    .array(ExperienceMatchSchema)
    .describe('Comparison of candidate vs required experience across relevant areas'),
});

