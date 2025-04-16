import { db } from '~/server/db';
import { resumeVector } from '~/server/db/schema';
import { sql, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const jobType = searchParams.get('jobType');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    console.log('Filters:', { category, jobType, location, userId });

    // eslint-disable-next-line prefer-const
    let filterConditions = [];
    if (category && category.trim() !== '') {
      filterConditions.push(`category = '${category}'`);
    }

    if (jobType && jobType.trim() !== '') {
      filterConditions.push(`"job_type" = '${jobType}'`);
    }

    if (location && location.trim() !== '') {
      filterConditions.push(`location ILIKE '%${location}%'`);
    }

    // Regular search without resume matching
    if (!userId) {
      // Prepare a SQL query for regular search
      const regularQuery = `
        SELECT 
          id, "job_id", title, "company_name", "company_logo", 
          category, "job_type", "publication_date", location, 
          salary, url, description
        FROM ajf_job_list
        ${filterConditions.length > 0 ? 'WHERE ' + filterConditions.join(' AND ') : ''}
        ORDER BY "publication_date" DESC
        LIMIT ${limit}
      `;

      console.log('Regular query:', regularQuery);
      const jobs = await db.execute(sql.raw(regularQuery));
      return NextResponse.json({ jobs });
    }

    // Try to get resume embedding
    const resume = await db
      .select()
      .from(resumeVector)
      .where(eq(resumeVector.userId, userId))
      .limit(1);

    // If no resume found, do regular search
    if (resume.length === 0 || !resume[0]?.embedding) {
      // Prepare a SQL query for regular search
      const regularQuery = `
        SELECT 
          id, "job_id", title, "company_name", "company_logo", 
          category, "job_type", "publication_date", location, 
          salary, url, description
        FROM ajf_job_list
        ${filterConditions.length > 0 ? 'WHERE ' + filterConditions.join(' AND ') : ''}
        ORDER BY "publication_date" DESC
        LIMIT ${limit}
      `;

      console.log('Regular query (no resume):', regularQuery);
      const jobs = await db.execute(sql.raw(regularQuery));
      return NextResponse.json({ jobs });
    }

    // Resume found, do vector search - make sure embedding exists
    const embedding = resume[0]?.embedding;
    if (!embedding || !Array.isArray(embedding)) {
      // Prepare a SQL query for regular search
      const regularQuery = `
        SELECT 
          id, "job_id", title, "company_name", "company_logo", 
          category, "job_type", "publication_date", location, 
          salary, url, description
        FROM ajf_job_list
        ${filterConditions.length > 0 ? 'WHERE ' + filterConditions.join(' AND ') : ''}
        ORDER BY "publication_date" DESC
        LIMIT ${limit}
      `;

      console.log('Regular query (embedding issue):', regularQuery);
      const jobs = await db.execute(sql.raw(regularQuery));
      return NextResponse.json({ jobs });
    }

    const embedArray = embedding.join(',');

    // Using simple textual SQL for vector operations
    const vectorQuery = `
      SELECT 
        id, "job_id", title, "company_name", "company_logo", 
        category, "job_type", "publication_date", location, 
        salary, url, description,
        (1 - (embedding <-> '[${embedArray}]'::vector)) AS "similarityScore"
      FROM ajf_job_list
      ${filterConditions.length > 0 ? 'WHERE ' + filterConditions.join(' AND ') : ''}
      ORDER BY embedding <-> '[${embedArray}]'::vector
      LIMIT ${limit}
    `;

    console.log('Vector query:', vectorQuery);
    const jobs = await db.execute(sql.raw(vectorQuery));
    return NextResponse.json({ jobs });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs', details: String(error) }, { status: 500 });
  }
}

