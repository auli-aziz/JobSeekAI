"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "~/components/ui/skeleton"
import { Building, ExternalLink } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { Job, JobsResponse } from "~/types/jobs"
import Image from "next/image"

interface RelatedJobsProps {
  currentJobId: number
  category: string
}

export default function RelatedJobs({ currentJobId, category }: RelatedJobsProps) {
  const router = useRouter()
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        setIsLoading(true)

        // In a real app, we would have an API endpoint to fetch related jobs
        // For this demo, we'll fetch jobs in the same category
        const response = await fetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=20`)

        if (!response.ok) {
          throw new Error("Failed to fetch related jobs")
        }

        const data = await response.json() as JobsResponse

        // Filter out the current job and limit to 3 related jobs
        const filtered = data.jobs.filter((job: Job) => job.id !== currentJobId).slice(0, 3)

        setRelatedJobs(filtered)
      } catch (error) {
        console.error("Error fetching related jobs:", error)
        setRelatedJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedJobs()
  }, [currentJobId, category])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedJobs.length === 0) {
    return <p className="text-sm text-slate-500">No related jobs found.</p>
  }

  return (
    <div className="space-y-4">
      {relatedJobs.map((job) => (
        <div key={job.id} className="group">
          <button
            className="flex items-start gap-3 text-left w-full hover:bg-slate-50 p-2 rounded-md transition-colors"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              {job.company_logo ? (
                <Image
                  src={job.company_logo}
                  alt={`${job.company_name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{job.company_name}</p>
            </div>
          </button>
        </div>
      ))}

      <Button
        variant="link"
        className="w-full text-sm text-primary"
        onClick={() => router.push(`/?category=${category}`)}
      >
        View all {category} jobs
        <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
  )
}
