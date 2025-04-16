import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { jobList, resumeVector } from "~/server/db/schema";
import { eq } from "drizzle-orm";

interface JobWithSimilarity extends Record<string, unknown> {
  id: number;
  jobId: number;
  title: string;
  companyName: string;
  similarityScore: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const minSimilarity = parseFloat(searchParams.get("minSimilarity") || "0.5");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    // Get user's resume vector
    const userResume = await db
      .select({ embedding: resumeVector.embedding })
      .from(resumeVector)
      .where(eq(resumeVector.userId, userId))
      .orderBy(sql`${resumeVector.createdAt} DESC`)
      .limit(1);

    if (userResume.length === 0) {
      return NextResponse.json(
        { error: "No resume found for this user" },
        { status: 404 }
      );
    }

    // Safe access with non-null assertion since we've checked length above
    const resumeEmbedding = userResume[0]?.embedding ?? [];

    // Match against jobs using vector similarity
    const matchingJobs = await db.execute<JobWithSimilarity>(sql`
      SELECT 
        ${jobList.id}, 
        ${jobList.jobId}, 
        ${jobList.title}, 
        ${jobList.companyName}, 
        ${jobList.companyLogo}, 
        ${jobList.category}, 
        ${jobList.jobType}, 
        ${jobList.publicationDate}, 
        ${jobList.location}, 
        ${jobList.salary}, 
        ${jobList.url}, 
        1 - (${jobList.embedding} <-> ${sql.raw(`'[${resumeEmbedding}]'::vector`)}) AS "similarityScore"
      FROM ${jobList}
      WHERE 1 - (${jobList.embedding} <-> ${sql.raw(`'[${resumeEmbedding}]'::vector`)}) >= ${minSimilarity}
      ORDER BY "similarityScore" DESC
      LIMIT ${limit}
    `);

    return NextResponse.json({ 
      jobs: matchingJobs.map(job => ({
        ...job,
        similarityScore: parseFloat(Number(job.similarityScore).toFixed(4))
      }))
    });
  } catch (error) {
    console.error("Error in job matching API:", error);
    return NextResponse.json(
      { error: "Failed to match jobs" },
      { status: 500 }
    );
  }
} 