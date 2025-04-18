import { sql } from "drizzle-orm";
import { createOpenAI } from '@ai-sdk/openai';
import { env } from '~/env';
import { db } from "~/server/db";
import { embed } from "ai"
import { jobList } from "~/server/db/schema";


interface JobResult extends Record<string, unknown> {
  jobId: string;
  title: string;
  companyName: string;
  similarityScore: number;
}


const openai = createOpenAI({
  compatibility: 'compatible', // strict mode, enable when using the OpenAI API
  apiKey: env.EMBEDDED_OPENAI_KEY,
});




export async function findJobsMatchingResume(resumeText: string, limit = 5) {
  try {

    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: resumeText,
    });
    const embeddingArray = Array.isArray(embedding) ? embedding : Object.values(embedding);


    // Query using cosine similarity
    // Lower distance means higher similarity, so we need to invert the score
    // or multiply by -1 to get highest similarity first
    const results = await db.execute<JobResult>(sql`
      SELECT 
        "job_id" AS "jobId",
        title,
        company_name AS "companyName",
        (embedding <-> ${sql.raw(`'[${embeddingArray.join(',')}]'::vector`)}) AS "similarityScore"
      FROM 
        ${jobList}
      ORDER BY embedding <-> ${sql.raw(`'[${embeddingArray.join(',')}]'::vector`)}
      LIMIT ${limit}
    `);

    return results.map(job => ({
      jobId: job.jobId,
      title: job.title,
      companyName: job.companyName,
      similarityScore: parseFloat(job.similarityScore.toFixed(4)),
    }));
  } catch (error) {
    console.error('Error matching resume to jobs:', error);
    throw error;
  }
}

