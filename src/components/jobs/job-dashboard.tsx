"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Search,
  Briefcase,
  FilterIcon,
  X,
  RefreshCw,
  LayoutList,
  LayoutGrid,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import JobListing from "./job-list";
import JobGrid from "./job-grid";
import FilterSidebar from "./filter-sidebar";
import { useDebounce } from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";
import type { Job } from "~/types/jobs";
import { Switch } from "~/components/ui/switch";
import Link from "next/link";
import { ResumeUploadDialog } from "~/components/resume-uploader";

type ApiJobsResponse = {
  jobs: Job[];
};

export default function JobDashboard({
  hasResumeVector,
  userId,
}: {
  hasResumeVector: boolean;
  userId: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("all");
  const [showSalaryOnly, setShowSalaryOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [useResumeMatch, setUseResumeMatch] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Fetch jobs from our custom API
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters for API
      const params = new URLSearchParams();

      // Search term will be handled by backend search
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);

      // Add category filter
      if (category && category !== "all-others")
        params.append("category", category);

      // Add job type filter
      if (jobType && jobType !== "all") params.append("jobType", jobType);

      // Add location filter
      if (location && location !== "all") params.append("location", location);

      // Add company name filter
      if (companyName) params.append("companyName", companyName);

      if (useResumeMatch) params.append("userId", userId);

      // Add limit
      params.append("limit", "100");

      console.log(
        "Fetching jobs with params:",
        Object.fromEntries(params.entries()),
      );

      const response = await fetch(`/api/jobs?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = (await response.json()) as ApiJobsResponse;
      console.log("API response:", data);

      // Set jobs from API response
      setJobs(data.jobs || []);
      setFilteredJobs(data.jobs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [
    category,
    debouncedSearchTerm,
    jobType,
    location,
    companyName,
    useResumeMatch,
    userId,
  ]);

  // Fetch jobs when API parameters change
  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  // (other filters are handled by the API)
  useEffect(() => {
    let result = jobs;

    // Apply salary filter
    if (showSalaryOnly) {
      result = result.filter((job) => job.salary && job.salary.trim() !== "");
    }

    setFilteredJobs(result);
  }, [jobs, showSalaryOnly]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCategory("");
    setCompanyName("");
    setJobType("all");
    setLocation("all");
    setShowSalaryOnly(false);
    setUseResumeMatch(false);
  }, []);

  // Filter counts for UI
  const activeFilterCount = [
    debouncedSearchTerm !== "",
    category !== "",
    companyName !== "",
    jobType !== "all",
    location !== "all",
    showSalaryOnly,
    useResumeMatch,
  ].filter(Boolean).length;

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background flex h-full min-h-screen">
      {/* Filter Sidebar */}
      <FilterSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        category={category}
        setCategory={setCategory}
        companyName={companyName}
        setCompanyName={setCompanyName}
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
        {/* Header */}
        <header className="bg-background border-border-primary top-0 z-10 border-t border-b backdrop-blur-md">
          <div className="container px-4 py-4">
            <div className="mt-1 mb-2">
              <div
                className={`rounded-xl ${
                  useResumeMatch
                    ? "border border-[#8A2BE2]/20 bg-gradient-to-r from-[#8A2BE2]/10 via-[#1E90FF]/10 to-[#00CED1]/10"
                    : "bg-muted/40"
                } p-6 transition-all duration-500`}
              >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full p-3"
                      style={{
                        background: useResumeMatch
                          ? "linear-gradient(to right, rgba(138,43,226,0.2), rgba(30,144,255,0.2))"
                          : "#f5f5f5", // fallback muted
                      }}
                    >
                      <Sparkles
                        className="h-6 w-6"
                        style={{
                          color: useResumeMatch ? "#8A2BE2" : "#6B7280", // fallback for muted-foreground
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        AI Resume Matching
                      </h3>
                      <p className="text-sm" style={{ color: "#6B7280" }}>
                        {useResumeMatch
                          ? "Jobs are ranked based on your skills and experience"
                          : "Enable to find jobs that match your skills and experience"}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-3 sm:w-auto">
                    {!hasResumeVector ? (
                      <ResumeUploadDialog>
                        <Button
                          variant={useResumeMatch ? "default" : "outline"}
                          className={`group pulse-on-hover relative overflow-hidden rounded-xl transition-all duration-500 ${
                            useResumeMatch ? "text-white" : ""
                          }`}
                          style={
                            useResumeMatch
                              ? {
                                  background:
                                    "linear-gradient(to right, #8A2BE2, #1E90FF)",
                                }
                              : {
                                  borderColor: "#8A2BE2",
                                }
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Resume
                          {!useResumeMatch && (
                            <span
                              className="absolute inset-0 h-full w-full -translate-x-full transform transition-transform duration-500 group-hover:translate-x-0"
                              style={{
                                background:
                                  "linear-gradient(to right, rgba(138,43,226,0.2), rgba(30,144,255,0.2))",
                              }}
                            ></span>
                          )}
                        </Button>
                      </ResumeUploadDialog>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Switch
                          id="resume-match"
                          checked={useResumeMatch}
                          onCheckedChange={setUseResumeMatch}
                          className="border-gray-200 bg-purple-600"
                          style={
                            useResumeMatch
                              ? {
                                  background:
                                    "linear-gradient(to right, #8A2BE2, #1E90FF)",
                                }
                              : undefined
                          }
                        />
                        <label
                          htmlFor="resume-match"
                          className="flex cursor-pointer items-center text-sm"
                        >
                          <span>Match to my resume</span>
                        </label>
                      </div>
                    )}

                    {hasResumeVector && (
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          style={{
                            color: "#8A2BE2",
                            backgroundColor: "rgba(138, 43, 226, 0.1)",
                          }}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          View Resume
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search job titles, skills, or keywords..."
                  className="h-10 pl-10"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10"
                  onClick={toggleSidebar}
                >
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                <div className="bg-background-secondary flex items-center rounded-md">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={fetchJobs}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="bg-background border-border-secondary border-b">
            <div className="container flex flex-wrap items-center gap-2 px-4 py-2">
              <span className="text-xs text-slate-500">Active filters:</span>
              {category !== "" && (
                <Badge variant="outline" className="text-xs">
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace("-", " ")}
                  <button className="ml-1" onClick={() => setCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {debouncedSearchTerm && (
                <Badge variant="outline" className="text-xs">
                  Search: {debouncedSearchTerm}
                  <Button
                    className="ml-1"
                    onClick={() => {
                      setSearchTerm("");
                      setDebouncedSearchTerm("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
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
                  <button
                    className="ml-1"
                    onClick={() => setShowSalaryOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {useResumeMatch && (
                <Badge variant="outline" className="bg-blue-50 text-xs">
                  Resume matching
                  <button
                    className="ml-1"
                    onClick={() => setUseResumeMatch(false)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                className="flex items-center text-xs text-slate-500 hover:text-slate-700"
                onClick={resetFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="bg-background border-border-secondary container border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {isLoading ? (
                "Loading jobs..."
              ) : error ? (
                "Error loading jobs"
              ) : (
                <>
                  <span className="font-medium">{filteredJobs.length}</span>{" "}
                  jobs found
                  {useResumeMatch && (
                    <span className="ml-1 text-blue-600">
                      {" "}
                      matched to your resume
                    </span>
                  )}
                </>
              )}
            </div>
            {error && (
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchJobs}
                className="text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-background container px-4 py-6">
          {isLoading ? (
            // Loading state
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-4",
              )}
            >
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "rounded-lg",
                      viewMode === "grid" ? "h-[280px]" : "h-[120px]",
                    )}
                  />
                ))}
            </div>
          ) : error ? (
            // Error state
            <div className="rounded-lg border border-red-100 bg-red-50 p-10 text-center">
              <p className="mb-4 text-red-600">{error}</p>
              <Button onClick={fetchJobs}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            // No results state
            <div className="border-border-secondary rounded-lg border p-10 text-center">
              <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <h3 className="mb-1 text-lg font-medium text-slate-900">
                No jobs found
              </h3>
              <p className="mb-4 text-slate-500">
                Try changing your search or filters
              </p>
              <Button onClick={resetFilters}>Clear All Filters</Button>
            </div>
          ) : // Results
          viewMode === "grid" ? (
            <JobGrid jobs={filteredJobs} />
          ) : (
            <JobListing jobs={filteredJobs} />
          )}
        </div>
      </div>
    </div>
  );
}
