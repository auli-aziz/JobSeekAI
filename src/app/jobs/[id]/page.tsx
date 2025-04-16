"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import {
  ArrowLeft,
  Briefcase,
  Building,
  DollarSign,
  ExternalLink,
  FileText,
  MapPin,
  Share2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Job, JobsResponse } from "~/types/jobs";
import JobCompatibility from "~/components/jobs/job-compatibility";
import RelatedJobs from "~/components/jobs/related-jobs";
import MatchScore from "~/components/jobs/match-score";
import Image from "next/image";
import Link from "next/link";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, we would fetch the specific job by ID
        // For this demo, we'll fetch all jobs and find the one with matching ID
        const response = await fetch(
          "https://remotive.com/api/remote-jobs?limit=100",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = (await response.json()) as JobsResponse;
        const foundJob = data.jobs.find(
          (j: Job) => j.id.toString() === params.id,
        );

        if (!foundJob) {
          throw new Error("Job not found");
        }

        setJob(foundJob);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJob();
  }, [params.id]);

  // Generate a consistent but random-looking match score based on job ID
  const generateMatchScore = (jobId: number): number => {
    // Use the job ID as a seed to generate a consistent score
    const seed = jobId % 100;
    // Generate a score between 55 and 95
    return Math.floor(55 + (seed % 41));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator
        .share({
          title: job?.title ?? "Job Opportunity",
          text: `Check out this job: ${job?.title} at ${job?.company_name}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <JobDetailsPageSkeleton />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="w-full px-4 py-8 lg:px-20">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          <div className="rounded-lg border border-red-100 bg-red-50 p-8 text-center">
            <h1 className="mb-4 text-xl font-semibold text-red-700">
              Error Loading Job
            </h1>
            <p className="mb-6 text-red-600">{error ?? "Job not found"}</p>
            <Button onClick={() => router.push("/")}>
              Return to Job Search
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const matchScore = generateMatchScore(job.id);

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header */}
      <header className="top-0 z-10">
        <div className="w-full px-4 py-8 lg:px-20">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              className="gap-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Link href={job.url ?? ""}>
                <Button variant="secondary" size="sm">
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-2xl font-bold">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {job.company_name}
                    </div>
                    <span className="text-slate-500">•</span>
                    <div className="text-sm ">
                      Posted {formatDate(job.publication_date)}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <MatchScore score={matchScore} size="lg" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.candidate_required_location ?? "Location not specified"}
                </Badge>

                {job.job_type && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {job.job_type === "full_time"
                      ? "Full-time"
                      : job.job_type === "part_time"
                        ? "Part-time"
                        : job.job_type}
                  </Badge>
                )}

                {job.salary && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {job.salary}
                  </Badge>
                )}

                <Badge variant="secondary">{job.category}</Badge>
              </div>
            </div>

            {/* Job Content */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background">
                  <TabsTrigger value="description">Job Description</TabsTrigger>
                  <TabsTrigger value="compatibility">
                    Match Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6">
                  <div
                    className="prose prose-slate max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: job.description ?? "" }}
                  />
                </TabsContent>

                <TabsContent value="compatibility" className="pt-6">
                  <JobCompatibility job={job} matchScore={matchScore} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mobile Match Score */}
            <div className="mb-4 flex justify-center sm:hidden">
              <MatchScore score={matchScore} size="lg" />
            </div>

            {/* Apply Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-button">Ready to Apply?</h2>
              <p className="mb-6 text-sm text-slate-600">
                This job is a {matchScore}% match for your profile. Apply now to
                connect with {job.company_name}.
              </p>
              <div className="space-y-3">
                <Link href={job.url ?? ""}>
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    Apply on Company Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                </Link>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Resume
                </Button>
              </div>
            </div>

            {/* Company Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg text-button font-semibold">About the Company</h2>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                  {job.company_logo ? (
                    <Image
                      src={job.company_logo}
                      alt={`${job.company_name} logo`}
                      className="h-full w-full object-contain"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <Building className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">{job.company_name}</h3>
                  <p className="text-sm text-slate-500">{job.category}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View All Jobs from this Company
              </Button>
            </div>

            {/* Related Jobs */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg text-button font-semibold">Similar Jobs</h2>
              <RelatedJobs currentJobId={job.id} category={job.category ?? "unspecified"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="w-full px-4 py-8 lg:px-20">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="mb-6">
              <Skeleton className="mb-2 h-8 w-3/4" />
              <Skeleton className="mb-4 h-5 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>

            {/* Job Content */}
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-[180px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
