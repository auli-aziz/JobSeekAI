import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Briefcase, BrainCircuit, FileText, Globe, Search, Filter, LayoutGrid } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            About WorkWiz
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Your intelligent platform for discovering and applying to the best opportunities worldwide.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <Globe className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Global Remote Jobs</CardTitle>
              <CardDescription>Access thousands of remote positions from companies around the world.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">
                Our platform aggregates remote job listings from multiple sources, ensuring you have access to the
                widest range of opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <BrainCircuit className="h-6 w-6 text-primary mb-2" />
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>Upload your resume and let our AI find the perfect matches.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">
                Our advanced AI analyzes your skills and experience to identify jobs that align with your profile,
                saving you time in your job search.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <Filter className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Advanced Filtering</CardTitle>
              <CardDescription>Narrow down results with powerful search and filter options.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">
                Filter by job category, company, location preferences, salary information, and more to find exactly what
                you&apos;re looking for.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Search and Filter</h3>
                <p className="text-slate-600">
                  Use our powerful search functionality to find jobs by title, skills, or company. Apply filters to
                  narrow down results based on your preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Your Resume</h3>
                <p className="text-slate-600">
                  Upload your resume to enable AI-powered job matching. Our system will analyze your skills and
                  experience to find the most relevant opportunities.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Get Personalized Matches</h3>
                <p className="text-slate-600">
                  Receive job recommendations tailored to your profile. Each job listing includes a match score
                  indicating how well it aligns with your skills and experience.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Apply with Confidence</h3>
                <p className="text-slate-600">
                  Review detailed job descriptions, company information, and compatibility analyses before applying
                  directly to positions that interest you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg border border-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Next Job?</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Start exploring thousands of opportunities from companies around the world and find the perfect match
            for your skills and experience.
          </p>
          <Button asChild size="lg">
            <Link href="/jobs">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
