"use client";

import type React from "react";

import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Building,
  Clock,
  Star,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Job } from "~/types/jobs";
import JobDetail from "./job-detail";

interface JobGridProps {
  jobs: Job[];
}

export default function JobGrid({ jobs }: JobGridProps) {
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleSaved = (jobId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatDate = (dateString: string) => {
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
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="border-border-primary cursor-pointer overflow-hidden transition-all hover:shadow-md"
          >
            <CardContent className="p-0">
              <Link href={`/jobs/${job.id}`}>
                {/* Card Header */}
                <div className="border-border-secondary flex justify-between border-b  p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-slate-100">
                      {job.company_logo ? (
                        <Image
                          src={job.company_logo}
                          alt={job.company_name}
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
                      fill={savedJobs.has(job.id) ? "#e7e032" : "none"}
                      color={savedJobs.has(job.id) ? "#f1c232" : "#94a3b8"}
                    />
                    <span className="sr-only">Save job</span>
                  </Button>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 font-semibold">
                    {job.title}
                  </h3>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="truncate text-slate-600">
                        {job.candidate_required_location ||
                          "Location not specified"}
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
              </Link>

              {/* Card Footer */}
              <div className="border-border-secondary bg-background flex items-center justify-between border-t px-4 py-3">
                <Badge variant="outline" className="bg-background">
                  {job.category}
                </Badge>
                <div
                  onClick={() => openJobDetail(job)}
                  className="text-xs font-medium"
                >
                  View Details →
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
