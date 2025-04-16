"use client"
import { useActionState, startTransition } from 'react'
import { Button } from '~/components/ui/button'
import { ingestJobs } from '~/server/scripts/ingest-jobs'
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Database } from 'lucide-react'
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'



const initialState = {
  success: false,
  message: "",
  stats: {
    total: 0,
    ingested: 0,
    skipped: 0,
  },
  error: null,
}


export default function Page() {
  const [ingestState, ingestAction, ingestIsPending] = useActionState(ingestJobs, initialState)
  const url = "https://remotive.com/api/remote-jobs?limit=20"
  const handleIngest = async () => {
    startTransition(() => {
      ingestAction(url)
    })

  }


  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Job Ingestion Dashboard</CardTitle>
          <CardDescription className="text-center">Import and process remote job listings</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">API Endpoint: {url}</div>
          </div>

          {ingestIsPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing jobs...</span>
              </div>
            </div>
          )}

          {ingestState.stats.total > 0 && !ingestIsPending && (
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col items-center p-3 bg-gray-100 rounded-md">
                <span className="text-lg font-bold">{ingestState.stats.total}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-md">
                <span className="text-lg font-bold text-green-600">{ingestState.stats.ingested}</span>
                <span className="text-xs text-muted-foreground">Ingested</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-md">
                <span className="text-lg font-bold text-amber-600">{ingestState.stats.skipped}</span>
                <span className="text-xs text-muted-foreground">Skipped</span>
              </div>
            </div>
          )}

          {ingestState.message && (
            <div
              className={`flex items-center p-3 rounded-md ${ingestState.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
            >
              {ingestState.success ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
              <p className="text-sm font-medium">{ingestState.message}</p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleIngest}
            disabled={ingestIsPending}
            className="w-full"
            variant={ingestIsPending ? "outline" : "default"}
          >
            {ingestIsPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Ingesting Jobs...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Ingest Jobs
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {ingestState.stats.skipped > 0 && (
        <Badge variant="outline" className="mt-4">
          {ingestState.stats.skipped} duplicate job{ingestState.stats.skipped !== 1 ? "s" : ""} skipped
        </Badge>
      )}
    </div>

  )
}
