"use client"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { ExternalLink, MapPin, Briefcase, DollarSign, Building } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Job } from "~/types/jobs"
import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import Image from "next/image"

interface JobDetailProps {
  job: Job
}

export default function JobDetail({ job }: JobDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  return (
    <>
      <DialogHeader className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
            {job.company_logo ? (
              <Image
                src={job.company_logo}
                alt={job.company_name}
                className="h-full w-full object-contain"
                width={40}
                height={40}
              />
            ) : (
              <Building className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <DialogTitle className="text-xl leading-tight">{job.title}</DialogTitle>
            <DialogDescription className=" text-sm mt-1">
              {job.company_name} · Posted {formatDate(job.publication_date)}
            </DialogDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex gap-1 items-center">
            <MapPin className="h-3 w-3" />
            {job.candidate_required_location || "Location not specified"}
          </Badge>

          {job.job_type && (
            <Badge variant="outline" className="flex gap-1 items-center">
              <Briefcase className="h-3 w-3" />
              {job.job_type === "full_time" ? "Full-time" : job.job_type === "part_time" ? "Part-time" : job.job_type}
            </Badge>
          )}

          {job.salary && (
            <Badge variant="outline" className="flex gap-1 items-center">
              <DollarSign className="h-3 w-3" />
              {job.salary}
            </Badge>
          )}
        </div>
      </DialogHeader>

      <ScrollArea className="h-[calc(70vh-180px)] pr-4">
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
      </ScrollArea>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline">Close</Button>
        <Button onClick={() => window.open(job.url, "_blank")} className="bg-secondary">
          Apply Now
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </>
  )
}

