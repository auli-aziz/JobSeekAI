import { db } from '~/server/db';
import { jobList, resumeVector } from '~/server/db/schema';
import { sql, eq, ilike, and, cosineDistance, desc } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const jobType = searchParams.get('jobType');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') ?? '10');


    // eslint-disable-next-line prefer-const
    let filterConditions = [];
    if (category && category.trim() !== '') {
      filterConditions.push(`category ILIKE '${category}'`);
    }

    if (jobType && jobType.trim() !== '') {
      filterConditions.push(`"job_type" = '${jobType}'`);
    }

    if (location && location.trim() !== '') {
      filterConditions.push(`location ILIKE '%${location}%'`);
    }
    const conditions = []

    if (category && category.trim() !== '') {
      conditions.push(ilike(jobList.category, category));
    }

    if (jobType && jobType.trim() !== '') {
      conditions.push(eq(jobList.jobType, jobType));
    }

    if (location && location.trim() !== '') {
      conditions.push(ilike(jobList.location, `%${location}%`));
    }

    // Regular search without resume matching
    if (!userId) {
      const jobs = await db
        .select({
          id: jobList.id,
          job_id: jobList.jobId,
          title: jobList.title,
          company_name: jobList.companyName,
          company_logo: jobList.companyLogo,
          category: jobList.category,
          job_type: jobList.jobType,
          publication_date: jobList.publicationDate,
          location: jobList.location,
          salary: jobList.salary,
          url: jobList.url,
          description: jobList.description,
        })
        .from(jobList)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
      return NextResponse.json({ jobs });
    }

    // Try to get resume embedding
    const resume = await db
      .select({
        embedding: resumeVector.embedding
      })
      .from(resumeVector)
      .where(eq(resumeVector.userId, userId))
      .limit(1);

    // Resume found, do vector search - make sure embedding exists
    const embedding = resume[0]?.embedding;
    if (!embedding) {
      throw new Error("Resume embedding not found");
    }
    const similarityScore = sql<number>`1 - (${cosineDistance(jobList.embedding, embedding)})`;

    const jobs = await db
      .select({
        id: jobList.id,
        job_id: jobList.jobId,
        title: jobList.title,
        company_name: jobList.companyName,
        company_logo: jobList.companyLogo,
        category: jobList.category,
        job_type: jobList.jobType,
        publication_date: jobList.publicationDate,
        location: jobList.location,
        salary: jobList.salary,
        url: jobList.url,
        description: jobList.description,
        similarityScore,
      })
      .from(jobList)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy((t) => desc(t.similarityScore))
      .limit(limit)
    return NextResponse.json({ jobs });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs', details: String(error) }, { status: 500 });
  }
}

