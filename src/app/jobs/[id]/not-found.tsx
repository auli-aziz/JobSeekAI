import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container max-w-md px-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Job Not Found</h1>
        <p className="text-slate-600 mb-8">The job listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Search
          </Link>
        </Button>
      </div>
    </div>
  )
}
