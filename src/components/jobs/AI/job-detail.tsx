"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  MapPin,
  Briefcase,
  DollarSign,
  Building,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs";
import JobCompatibility from "../job-compatibility";
import { processProfile } from "~/lib/actions/process-profile";
import { dummyResume } from "~/data/dummy-resume";
import type { Job, JobCompatibilityProps } from "~/types/jobs";

export default function JobDetail({ job }: { job: Job }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compatibility, setCompatibility] =
    useState<JobCompatibilityProps | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchCompatibility = async () => {
      if (!job.similarityScore) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await processProfile(dummyResume, job);
        setCompatibility(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCompatibility();
  }, [job]);

  const showMatchTab = job.similarityScore != null;

  return (
    <>
      <DialogHeader className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded bg-slate-100">
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
            <DialogTitle className="text-xl leading-tight">
              {job.title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              {job.company_name} · Posted {formatDate(job.publication_date)}
            </DialogDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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
        </div>
      </DialogHeader>

      <ScrollArea className="mt-4 h-[calc(70vh-180px)] pr-4">
        <Tabs defaultValue="description" className="w-full">
          <TabsList
            className={`grid w-full ${
              showMatchTab ? "grid-cols-2" : "grid-cols-1"
            } bg-slate-200`}
          >
            <TabsTrigger value="description">Job Description</TabsTrigger>
            {showMatchTab && (
              <TabsTrigger value="compatibility">Match Analysis</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div
              className="prose prose-slate max-w-none text-slate-600"
              dangerouslySetInnerHTML={{ __html: job.description ?? "" }}
            />
          </TabsContent>

          {showMatchTab && (
            <TabsContent value="compatibility" className="pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-32 text-sm text-slate-500">
                  Checking compatibility...
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              ) : compatibility ? (
                <JobCompatibility
                  job={job}
                  matchScore={Number(
                    Math.min(job.similarityScore! * 100 + 70, 100).toFixed(1)
                  )}
                  compatibilityData={compatibility.compatibilityData}
                  skillMatches={compatibility.skillMatches}
                  experienceMatches={compatibility.experienceMatches}
                />
              ) : (
                <div className="text-slate-500 text-sm text-center">
                  No compatibility data found.
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </ScrollArea>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline">Close</Button>
        <Button className="bg-secondary">
          Apply Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
