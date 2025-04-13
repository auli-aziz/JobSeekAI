"use client"

import { useState, useCallback, useEffect } from "react"
import type { Job, JobsResponse } from "~/types/jobs"

interface UseInfiniteJobsOptions {
  search: string
  category: string
  companyName: string
  jobType: string
  location: string
  showSalaryOnly: boolean
}

interface UseInfiniteJobsResult {
  jobs: Job[]
  isLoading: boolean
  error: string | null
  fetchNextPage: () => Promise<void>
  hasNextPage: boolean
  totalJobs: number
  isFetchingNextPage: boolean
  reset: () => void
}

// Items per page
const LIMIT = 12

export function useInfiniteJobs({
  search,
  category,
  companyName,
  jobType,
  location,
  showSalaryOnly,
}: UseInfiniteJobsOptions): UseInfiniteJobsResult {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [totalJobs, setTotalJobs] = useState(0)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

  // This function fetches jobs based on the current filters
  const fetchJobs = useCallback(
    async (currentPage: number, isNextPage = false) => {
      try {
        // Set appropriate loading state
        if (isNextPage) {
          setIsFetchingNextPage(true)
        } else {
          setIsLoading(true)
          setError(null)
        }

        // Build query parameters for API
        const params = new URLSearchParams()
        params.append("category", category)
        if (search) params.append("search", search)
        if (companyName) params.append("company_name", companyName)

        // Add limit parameter to only get a specific number of results at a time
        params.append("limit", `${LIMIT * currentPage}`)

        const response = await fetch(`https://remotive.com/api/remote-jobs?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data: JobsResponse = await response.json()

        // Apply client-side filters (since the API doesn't support these filters)
        let filteredJobs = [...data.jobs]

        if (jobType !== "all") {
          filteredJobs = filteredJobs.filter((job) => job.job_type === jobType)
        }

        if (location !== "all") {
          filteredJobs = filteredJobs.filter((job) =>
            job.candidate_required_location.toLowerCase().includes(location.toLowerCase()),
          )
        }

        if (showSalaryOnly) {
          filteredJobs = filteredJobs.filter((job) => job.salary && job.salary.trim() !== "")
        }

        // Set total count of jobs after filtering
        setTotalJobs(filteredJobs.length)

        // Slice the array to simulate pagination since we're client-side filtering
        const paginatedJobs = filteredJobs.slice(0, LIMIT * currentPage)

        // Determine if there are more jobs to load
        setHasNextPage(paginatedJobs.length < filteredJobs.length)

        // Update jobs state
        if (isNextPage) {
          setJobs(paginatedJobs)
        } else {
          setJobs(paginatedJobs)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
        setIsFetchingNextPage(false)
      }
    },
    [search, category, companyName, jobType, location, showSalaryOnly],
  )

  // Initial fetch when filters change
  useEffect(() => {
    setPage(1)
    fetchJobs(1)
  }, [search, category, companyName, jobType, location, showSalaryOnly, fetchJobs])

  // Function to fetch next page
  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return

    const nextPage = page + 1
    setPage(nextPage)
    await fetchJobs(nextPage, true)
  }, [fetchJobs, hasNextPage, isFetchingNextPage, page])

  // Reset function
  const reset = useCallback(() => {
    setPage(1)
    fetchJobs(1)
  }, [fetchJobs])

  return {
    jobs,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    totalJobs,
    isFetchingNextPage,
    reset,
  }
}

