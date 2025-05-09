export interface Job {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string | null;
  job_type: string | null;
  publication_date: string;
  candidate_required_location?: string;
  location?: string;
  salary: string | null;
  url: string | null;
  description: string | null;
  similarityScore?: number;
}

export interface JobsResponse {
  "0-legal-notice": string;
  "job-count": number;
  jobs: Job[];
}

export interface ApiJobsResponse {
  jobs: Job[];
}

export interface CompatibilityCategoryGroup {
  category: "skills" | "experience" | "education" | "other";
  pros: string[];
  cons: string[];
}

export interface SkillMatch {
  skill: string;
  matchScore: number;
}

export interface ExperienceMatch {
  area: string;
  actual: number;
  required: number;
}

export interface JobCompatibilityProps {
  job: Job;
  matchScore: number;
  compatibilityData: CompatibilityCategoryGroup[];
  skillMatches: SkillMatch[];
  experienceMatches: ExperienceMatch[];
}
export interface AiRecommendation {
  recommendation: string;
}


export interface JobCompatibilty {
  compatibilityData: CompatibilityCategoryGroup[];
  skillMatches: SkillMatch[];
  experienceMatches: ExperienceMatch[];
  aiRecommendation: AiRecommendation;
}
