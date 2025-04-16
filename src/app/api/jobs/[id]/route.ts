import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { jobList } from "~/server/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }
    
    const job = await db
      .select()
      .from(jobList)
      .where(eq(jobList.jobId, jobId))
      .limit(1);
    
    if (job.length === 0) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job[0]);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
} 