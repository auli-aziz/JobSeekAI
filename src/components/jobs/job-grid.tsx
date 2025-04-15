"use client"

import type React from "react"

import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Dialog, DialogContent } from "../ui/dialog"
import { Briefcase, DollarSign, MapPin, Building, Clock, Star } from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Job } from "~/types/jobs"
import JobDetail from "./job-detail"

interface JobGridProps {
  jobs: Job[]
}

export default function JobGrid({ jobs }: JobGridProps) {
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleSaved = (jobId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const newSavedJobs = new Set(savedJobs)
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const openJobDetail = (job: Job) => {
    setSelectedJob(job)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="overflow-hidden hover:shadow-md transition-all border-slate-300 cursor-pointer"
            onClick={() => openJobDetail(job)}
          >
            <CardContent className="p-0">
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <div className="text-sm font-medium leading-none">{job.company_name}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      {formatDate(job.publication_date)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={(e) => toggleSaved(job.id, e)}
                >
                  <Star
                    className="h-4 w-4"
                    fill={savedJobs.has(job.id) ? "currentColor" : "none"}
                    color={savedJobs.has(job.id) ? "#f59e0b" : "#94a3b8"}
                  />
                  <span className="sr-only">Save job</span>
                </Button>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{job.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.candidate_required_location || "Location not specified"}</span>
                  </div>

                  {job.job_type && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Briefcase className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
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
                      <DollarSign className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 border-t border-slate-100 bg-background flex justify-between items-center">
                <Badge variant="outline" className="bg-background">
                  {job.category}
                </Badge>
                <div className="text-xs text-slate-600 font-medium">View Details →</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedJob && <JobDetail job={selectedJob} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

