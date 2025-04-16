export interface Job {
  id: number
  job_id: number
  title: string
  company_name: string
  company_logo: string | null
  category: string | null
  job_type: string | null
  publication_date: string
  candidate_required_location?: string
  location?: string
  salary: string | null
  url: string | null
  description: string | null
  similarityScore?: number
}

export interface JobsResponse {
  "0-legal-notice": string
  "job-count": number
  jobs: Job[]
}

export interface ApiJobsResponse {
  jobs: Job[]
}

