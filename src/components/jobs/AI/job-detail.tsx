"use client"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { ExternalLink, X, MapPin, Briefcase, DollarSign, Building, Calendar, FileText } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import type { Job } from "~/types/jobs"

interface JobDetailProps {
  job: Job
}

export default function JobDetail({ job }: JobDetailProps) {
  // Format date helper function
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown date"
    try {
      return format(new Date(dateString), "PPP")
    } catch {
      return "Invalid date"
    }
  }

  const locationDisplay = job.location ?? "unspecified"

  // Handler for apply button
  const handleApply = () => {
    if (job.url) {
      window.open(job.url, '_blank')
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(90vh-2rem)]">
      {/* Header */}
      <div className="pb-4 mb-4 border-b flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded bg-slate-100 flex items-center justify-center overflow-hidden mr-4">
            {job.company_logo ? (
              <Image
                src={job.company_logo}
                alt={`${job.company_name || 'Company'} logo`}
                className="h-full w-full object-contain"
                width={56}
                height={56}
              />
            ) : (
              <Building className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-slate-600">{job.company_name}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-slate-500">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(job.publication_date)}
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="outline" className="flex items-center gap-1 py-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {locationDisplay}
        </Badge>

        {job.job_type && (
          <Badge variant="outline" className="flex items-center gap-1 py-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {job.job_type === "full_time"
              ? "Full-time"
              : job.job_type === "part_time"
                ? "Part-time"
                : job.job_type}
          </Badge>
        )}

        {job.salary && (
          <Badge variant="outline" className="flex items-center gap-1 py-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            {job.salary}
          </Badge>
        )}

        {job.similarityScore !== undefined && (
          <Badge variant="outline" className="flex items-center gap-1 py-1.5 bg-green-50">
            <FileText className="h-3.5 w-3.5" />
            Match: {Math.round(job.similarityScore * 100)}%
          </Badge>
        )}
      </div>

      {/* Job Description */}
      <div className="flex-1 overflow-hidden">
        <h3 className="font-medium mb-2">Job Description</h3>
        <ScrollArea className="h-[calc(100%-2rem)] pr-4">
          {job.description ? (
            <div
              className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : (
            <p className="text-slate-500 italic">No description available for this job posting.</p>
          )}
        </ScrollArea>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t flex justify-between">
        {/* Im not yet add onclick*/}
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <X className="h-4 w-4" />
          Close
        </Button>

        {job.url ? (
          <Button
            className="flex items-center gap-1.5"
            size="sm"
            onClick={handleApply}
          >
            <ExternalLink className="h-4 w-4" />
            Apply Now
          </Button>
        ) : (
          <Button
            className="flex items-center gap-1.5"
            size="sm"
            disabled
          >
            <ExternalLink className="h-4 w-4" />
            Application Link Unavailable
          </Button>
        )}
      </div>
    </div>
  )
}

