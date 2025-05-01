"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import Link from "next/link";

import {
  Briefcase,
  DollarSign,
  MapPin,
  Building,
  Clock,
  Star,
} from "lucide-react";

import type { Job } from "~/types/jobs";
import JobDetail from "./job-detail";
import MatchScore from "./match-score";

interface JobGridProps {
  jobs: Job[];
}

export default function JobGrid({ jobs }: JobGridProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  const toggleSaved = (jobId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId.toString())) {
      newSavedJobs.delete(jobId.toString());
    } else {
      newSavedJobs.add(jobId.toString());
    }
    setSavedJobs(newSavedJobs);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date not specified";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const openJobDetail = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.map((job) => (
          <Card
            key={job.id}
            className="border-border-primary cursor-pointer overflow-hidden transition-all hover:shadow-md"
          >
            <CardContent className="p-0">
              <div onClick={() => openJobDetail(job)}>
                <div className="border-border-secondary flex justify-between border-b p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-slate-100">
                      {job.company_logo ? (
                        <Image
                          src={job.company_logo}
                          alt={job.company_name || "Company logo"}
                          className="h-full w-full object-contain"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Building className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm leading-none font-medium">
                        {job.company_name}
                      </div>
                      <div className="mt-1 flex items-center text-xs text-slate-500">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {formatDate(job.publication_date)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={(e) => toggleSaved(job.id, e)}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={
                        savedJobs.has(job.id.toString()) ? "#e7e032" : "none"
                      }
                      color={
                        savedJobs.has(job.id.toString()) ? "#f1c232" : "#94a3b8"
                      }
                    />
                    <span className="sr-only">Save job</span>
                  </Button>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="mb-2 line-clamp-2 font-semibold">
                      {job.title}
                    </h3>
                    <div className="flex-shrink-0">
                      {job.similarityScore !== undefined && (
                        <MatchScore
                          score={Number(
                            Math.min(
                              job.similarityScore * 100 + 25,
                              100,
                            ).toFixed(1),
                          )}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="truncate text-slate-600">
                        {job.location ?? "Location not specified"}
                      </span>
                    </div>

                    {job.job_type && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Briefcase className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span>
                          {job.job_type === "full_time"
                            ? "Full-time"
                            : job.job_type === "part_time"
                              ? "Part-time"
                              : job.job_type}
                        </span>
                      </div>
                    )}

                    {job.salary && (
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-border-secondary bg-background flex items-center justify-between border-t px-4 py-3">
                <Badge variant="outline" className="bg-background">
                  {job.category ?? "Uncategorized"}
                </Badge>
                <Link href={`/jobs/${job.job_id}`}>
                  <div className="text-xs font-medium">View Details →</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-muted-foreground flex items-center px-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl">
          {selectedJob && <JobDetail job={selectedJob} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
