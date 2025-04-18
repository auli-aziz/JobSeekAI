import { z } from 'zod';


export const CompatibilityCategoryGroupSchema = z.object({
  category: z.enum(['skills', 'experience', 'education', 'other']).describe(
    'The specific category being evaluated for compatibility between the resume and job listing.'
  ),
  pros: z
    .array(z.string())
    .max(1)
    .describe(
      'strengths where the resume content aligns well with the job requirements in this category. Can be omitted if there are no strengths.'
    ),
  cons: z
    .array(z.string())
    .max(1)
    .describe(
      'areas where the resume may fall short or differ from job expectations in this category. Can be omitted if there are no weaknesses.'
    ),
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


const AiRecommendationSchema = z.object({
  recommendation: z
    .string()
    .max(500)
    .describe('Speak directly to the user as "you". Provide one concise recommendation that would most improve the alignment between their resume and the job listing.'),
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
  aiRecommendation: AiRecommendationSchema.describe(
    'A concise AI-generated recommendation to help improve the resume or job alignment'
  ),
});

