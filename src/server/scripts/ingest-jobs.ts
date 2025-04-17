"use server"
import { db } from '../db';
import { embed } from "ai"
import { eq } from 'drizzle-orm';
import { jobList } from '../db/schema';
import type { JobsResponse } from '~/types/jobs';
import { stripHtml } from '~/lib/strip-html';
import { env } from '~/env';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  compatibility: 'compatible', // strict mode, enable when using the OpenAI API
  apiKey: env.EMBEDDED_OPENAI_KEY,
});

// Initial state type
type IngestState = {
  success: boolean
  message: string
  stats: {
    total: number
    ingested: number
    skipped: number
  }
  error: Error | null
}

export async function ingestJobs(prevState: IngestState, apiUrl: string): Promise<IngestState> {
  try {
    const processingState: IngestState = {
      ...prevState,
      message: "Fetching jobs...",
      stats: {
        total: 0,
        ingested: 0,
        skipped: 0,
      },
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`)
    }
    const arrayResponse = await response.json() as JobsResponse;
    const jobs = arrayResponse.jobs;


    processingState.stats.total = jobs.length
    processingState.message = `Processing ${jobs.length} jobs...`


    let ingestedCount = 0
    let skippedCount = 0

    for (const job of jobs) {
      const jobText = `${job.title} with category ${job.category}: ${stripHtml(job.description ?? "")}`;

      const existing = await db
        .select()
        .from(jobList)
        .where(eq(jobList.jobId, job.id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`Duplicate job ID: ${job.id}, skipping.`)
        skippedCount++
        continue;
      }

      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3'),
        value: jobText,
      });

      await db.insert(jobList).values({
        jobId: Number(job.id),
        title: job.title,
        companyName: job.company_name,
        companyLogo: job.company_logo,
        category: job.category,
        jobType: job.job_type,
        publicationDate: new Date(job.publication_date),
        location: job.candidate_required_location,
        salary: job.salary,
        url: job.url,
        description: job.description,
        embedding,
      });

      ingestedCount++;
    }

    return {
      success: true,
      message: `Successfully processed ${jobs.length} job(s): ${ingestedCount} ingested, ${skippedCount} skipped.`,
      stats: {
        total: jobs.length,
        ingested: ingestedCount,
        skipped: skippedCount,
      },
      error: null,
    };
  } catch (error) {
    console.error("Ingestion failed:", error);
    return {
      success: false,
      message: "Failed to ingest jobs. Please try again.",
      stats: prevState.stats,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

