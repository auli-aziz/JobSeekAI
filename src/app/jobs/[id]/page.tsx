
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
import Image from "next/image";
import Link from "next/link";
import MatchScore from "~/components/jobs/match-score";
import { getJobAndResume } from "~/server/db/queries";



export default async function JobDetailsPage({ params }: {
  params: Promise<{ id: number }>
}) {
  const jobId = (await params).id
  const userId = "402c091e-db8c-45f4-9b31-a5f13260ef96"
  const something = false
  console.log(jobId)

  const jobWithScore = await getJobAndResume(jobId, userId)
  //
  // const handleShare = async () => {
  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: jobWithScore?.title,
  //         text: `Check out this job: ${jobWithScore?.title} at ${jobWithScore?.company_name}`,
  //         url: window.location.href,
  //       })
  //       .catch((err) => console.error("Error sharing:", err));
  //   } else {
  //     // Fallback for browsers that don't support the Web Share API
  //     await navigator.clipboard.writeText(window.location.href);
  //     alert("Link copied to clipboard!");
  //   }
  // };


  if (something) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="w-full px-4 py-8 lg:px-20">
          <Button
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          <div className="rounded-lg border border-red-100 bg-red-50 p-8 text-center">
            <h1 className="mb-4 text-xl font-semibold text-red-700">
              Error Loading Job
            </h1>
            <p className="mb-6 text-red-600">{"Job not found"}</p>
            <Button >
              Return to Job Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header */}
      <header className="top-0 z-10">
        <div className="w-full px-4 py-8 lg:px-20">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Link href={"joburl"}>
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
                  <h1 className="mb-2 text-2xl font-bold">{jobWithScore?.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {jobWithScore?.company_name}
                    </div>
                    <span className="text-slate-500">•</span>
                    <div className="text-sm">
                      Posted {jobWithScore?.publication_date?.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <MatchScore
                    score={Number(Math.min((jobWithScore?.similarity ?? 0) * 100 + 25, 100).toFixed(1))}
                    size="lg"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {jobWithScore?.location ?? "Location not specified"}
                </Badge>

                {jobWithScore?.job_type && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {jobWithScore.job_type === "full_time"
                      ? "Full-time"
                      : jobWithScore.job_type === "part_time"
                        ? "Part-time"
                        : jobWithScore.job_type}
                  </Badge>
                )}

                {jobWithScore?.salary && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {jobWithScore.salary}
                  </Badge>
                )}

                <Badge variant="secondary">{jobWithScore?.category}</Badge>
              </div>
            </div>

            {/* Job Content */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-slate-200 grid w-full grid-cols-2">
                  <TabsTrigger value="description">Job Description</TabsTrigger>
                  <TabsTrigger value="compatibility">
                    Match Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6">
                  <div
                    className="prose prose-slate max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: jobWithScore?.description ?? "" }}
                  />
                </TabsContent>

                <TabsContent value="compatibility" className="pt-6">
                  {/*
                  <JobCompatibility
                    job={job}
                    matchScore={compatibility!.matchScore}
                    compatibilityData={compatibility!.compatibilityData}
                    skillMatches={compatibility!.skillMatches}
                    experienceMatches={compatibility!.experienceMatches}
                  />
                  */
                  }
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mobile Match Score */}
            <div className="mb-4 flex justify-center sm:hidden">
              {typeof jobWithScore?.similarity === "number" && (
                <MatchScore
                  score={Math.min(jobWithScore.similarity * 100 + 25, 100)}
                  size="sm"
                />
              )}

            </div>

            {/* Apply Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-button mb-4 text-lg font-semibold">
                Ready to Apply?
              </h2>
              <p className="mb-6 text-sm text-slate-600">
                This job is a {Number(
                  Math.min(jobWithScore!.similarity * 100 + 25, 100).toFixed(1)
                )}% match for your profile. Apply now to
                connect with {jobWithScore?.company_name}.
              </p>
              <div className="flex flex-col space-y-3">
                <Link href={jobWithScore?.url ?? ""}>
                  <Button variant="secondary" className="w-full">
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
              <h2 className="text-button mb-4 text-lg font-semibold">
                About the Company
              </h2>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                  {jobWithScore?.company_logo ? (
                    <Image
                      src={jobWithScore.company_logo}
                      alt={`${jobWithScore.company_name} logo`}
                      className="h-full w-full object-contain"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <Building className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">
                    {jobWithScore?.company_name}
                  </h3>
                  <p className="text-sm text-slate-500">{jobWithScore?.category}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View All Jobs from this Company
              </Button>
            </div>

            {/* Related Jobs */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-button mb-4 text-lg font-semibold">
                Similar Jobs
              </h2>
              {
                /*
                                 <RelatedJobs
                currentJobId={job.id}
                category={job.category ?? "unspecified"}
              />
                 */
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


