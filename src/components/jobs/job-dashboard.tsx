"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Button from "../Button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Search, Briefcase, FilterIcon, X, RefreshCw, LayoutList, LayoutGrid } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import JobList from "@/components/job-list"
import JobGrid from "@/components/job-grid"
import FilterSidebar from "@/components/filter-sidebar"
import { useDebounce } from "@/hooks/use-debounce"
import { useInfiniteJobs } from "@/hooks/use-infinite-jobs"
import { useIntersection } from "@/hooks/use-intersection"
import { cn } from "~/lib/utils"

export default function JobDashboard() {
  // State
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [category, setCategory] = useState("software-dev")
  const [companyName, setCompanyName] = useState("")
  const [debouncedCompanyName, setDebouncedCompanyName] = useState("")
  const [jobType, setJobType] = useState("all")
  const [location, setLocation] = useState("all")
  const [showSalaryOnly, setShowSalaryOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null)

  // Debounce search terms
  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value)
  }, 500)

  const debouncedCompany = useDebounce((value: string) => {
    setDebouncedCompanyName(value)
  }, 500)

  // Handle input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleCompanyChange = (value: string) => {
    setCompanyName(value)
    debouncedCompany(value)
  }

  // Setup intersection observer for infinite loading
  const { isIntersecting } = useIntersection(bottomRef, {
    threshold: 1.0,
    rootMargin: "200px",
  })

  // Fetch jobs with pagination
  const { jobs, isLoading, error, fetchNextPage, hasNextPage, totalJobs, isFetchingNextPage, reset } = useInfiniteJobs({
    search: debouncedSearchTerm,
    category,
    companyName: debouncedCompanyName,
    jobType,
    location,
    showSalaryOnly,
  })

  // Load more jobs when the user scrolls to the bottom
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage])

  // Filter counts for UI
  const activeFilterCount = [
    debouncedSearchTerm !== "",
    category !== "software-dev",
    debouncedCompanyName !== "",
    jobType !== "all",
    location !== "all",
    showSalaryOnly,
  ].filter(Boolean).length

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setCategory("software-dev")
    setCompanyName("")
    setDebouncedCompanyName("")
    setJobType("all")
    setLocation("all")
    setShowSalaryOnly(false)
    reset()
  }, [reset])

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen">
      {/* Filter Sidebar */}
      <FilterSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        category={category}
        setCategory={setCategory}
        companyName={companyName}
        setCompanyName={handleCompanyChange}
        jobType={jobType}
        setJobType={setJobType}
        location={location}
        setLocation={setLocation}
        showSalaryOnly={showSalaryOnly}
        setShowSalaryOnly={setShowSalaryOnly}
        resetFilters={resetFilters}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container px-4 py-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Remote Jobs</h1>
              <p className="text-sm text-slate-500">Find your next remote opportunity from top companies</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search job titles, skills, or keywords..."
                  className="pl-10 h-10"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-10" onClick={toggleSidebar}>
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                <div className="flex items-center bg-slate-100 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="bg-slate-50 border-b border-slate-100">
            <div className="container px-4 py-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Active filters:</span>
              {category !== "software-dev" && (
                <Badge variant="outline" className="text-xs">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                  <button className="ml-1" onClick={() => setCategory("software-dev")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {debouncedSearchTerm && (
                <Badge variant="outline" className="text-xs">
                  Search: {debouncedSearchTerm}
                  <button
                    className="ml-1"
                    onClick={() => {
                      setSearchTerm("")
                      setDebouncedSearchTerm("")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {debouncedCompanyName && (
                <Badge variant="outline" className="text-xs">
                  Company: {debouncedCompanyName}
                  <button
                    className="ml-1"
                    onClick={() => {
                      setCompanyName("")
                      setDebouncedCompanyName("")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {jobType !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Type: {jobType.replace("_", " ")}
                  <button className="ml-1" onClick={() => setJobType("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {location !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Location: {location}
                  <button className="ml-1" onClick={() => setLocation("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {showSalaryOnly && (
                <Badge variant="outline" className="text-xs">
                  With salary only
                  <button className="ml-1" onClick={() => setShowSalaryOnly(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center" onClick={resetFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="container px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {isLoading && jobs.length === 0 ? (
                "Loading jobs..."
              ) : error ? (
                "Error loading jobs"
              ) : (
                <>
                  <span className="font-medium text-slate-700">{totalJobs}</span> jobs found
                </>
              )}
            </div>
            {error && (
              <Button variant="outline" size="sm" onClick={reset} className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="container px-4 py-6">
          {isLoading && jobs.length === 0 ? (
            // Initial loading state
            <div
              className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4")}
            >
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className={cn("rounded-lg", viewMode === "grid" ? "h-[280px]" : "h-[120px]")} />
                ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center p-10 border border-red-100 rounded-lg bg-red-50">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            // No results state
            <div className="text-center p-10 border border-slate-200 rounded-lg">
              <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs found</h3>
              <p className="text-slate-500 mb-4">Try changing your search or filters</p>
              <Button onClick={resetFilters}>Clear All Filters</Button>
            </div>
          ) : (
            // Results
            <>
              {viewMode === "grid" ? <JobGrid jobs={jobs} /> : <JobList jobs={jobs} />}

              {/* Loading indicator at bottom for infinite scroll */}
              <div ref={bottomRef} className="h-10 mt-8 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-500">Loading more jobs...</span>
                  </div>
                )}
                {!hasNextPage && jobs.length > 0 && <p className="text-sm text-slate-500">No more jobs to load</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

