import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { desc, eq, like, sql } from "drizzle-orm";
import { jobList } from "~/server/db/schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    const offset = (page - 1) * limit;
    
    // Build conditions for both queries
    const conditions = [];
    if (category) {
      conditions.push(eq(jobList.category, category));
    }
    if (search) {
      conditions.push(like(jobList.title, `%${search}%`));
    }
    
    // Get total count for pagination
    const countQuery = db.select({
      count: sql`count(*)::int`
    }).from(jobList);
    
    // Apply the same conditions to count query
    const countResult = conditions.length 
      ? await countQuery.where(sql.join(conditions, sql` AND `))
      : await countQuery;
    
    const total = Number(countResult[0]?.count || 0);
    
    // Main query with pagination
    const jobsQuery = db.select().from(jobList);
    
    // Apply the same conditions to main query
    const jobsWithConditions = conditions.length 
      ? jobsQuery.where(sql.join(conditions, sql` AND `))
      : jobsQuery;
    
    // Execute query with pagination
    const jobs = await jobsWithConditions
      .orderBy(desc(jobList.publicationDate))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
} 