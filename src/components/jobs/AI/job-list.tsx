"use client";

import type React from "react";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Building,
  Clock,
  ChevronRight,
  Star,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Job } from "~/types/jobs";
import JobDetail from "./job-detail";
import MatchScore from "../match-score";

interface JobListProps {
  jobs: Job[];
}

export default function JobListing({ jobs }: JobListProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleSaved = (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatDate = (dateString: string | null) => {
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
      <div className="space-y-4">
        {jobs.map((job) => {
          const jobId = job.job_id || job.id || "";
          const locationDisplay = job.location ?? "Location not specified";

          return (
            <Card
              key={jobId}
              className="border-border-primary cursor-pointer overflow-hidden transition-all hover:shadow-md"
              onClick={() => openJobDetail(job)}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  {/* Company Logo */}
                  <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-slate-100">
                    {job.company_logo ? (
                      <Image
                        src={job.company_logo}
                        alt={`${job.company_name || "Company"} logo`}
                        className="h-full w-full object-contain"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <Building className="h-6 w-6 text-slate-400" />
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {job.company_name || "Unknown Company"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {job.similarityScore !== undefined && (
                          <MatchScore
                            score={Math.round(job.similarityScore * 100)}
                            size="sm"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={(e) => toggleSaved(jobId.toString(), e)}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={
                              savedJobs.has(jobId.toString())
                                ? "currentColor"
                                : "none"
                            }
                            color={
                              savedJobs.has(jobId.toString())
                                ? "#f59e0b"
                                : "#94a3b8"
                            }
                          />
                          <span className="sr-only">Save job</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Button>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-slate-400" />
                        {locationDisplay}
                      </div>

                      {job.job_type && (
                        <div className="flex items-center">
                          <Briefcase className="mr-1 h-4 w-4 text-slate-400" />
                          {job.job_type === "full_time"
                            ? "Full-time"
                            : job.job_type === "part_time"
                              ? "Part-time"
                              : job.job_type}
                        </div>
                      )}

                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4 text-slate-400" />
                          {job.salary}
                        </div>
                      )}

                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-slate-400" />
                        {formatDate(job.publication_date)}
                      </div>

                      {job.similarityScore !== undefined && (
                        <div className="flex items-center">
                          <FileText className="mr-1 h-4 w-4 text-slate-400" />
                          Match: {Math.round(job.similarityScore * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-background">
                        {job.category ?? "Uncategorized"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl">
          {selectedJob && <JobDetail job={selectedJob} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
