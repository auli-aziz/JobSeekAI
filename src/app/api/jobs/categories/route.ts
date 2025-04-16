import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { jobList } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select({ category: jobList.category })
      .from(jobList)
      .where(sql`${jobList.category} IS NOT NULL`)
      .groupBy(jobList.category);
    
    return NextResponse.json({
      categories: categories.map(c => c.category).filter(Boolean)
    });
  } catch (error) {
    console.error("Error fetching job categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch job categories" },
      { status: 500 }
    );
  }
} 