import 'server-only'
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import { env } from '~/env';
import { db } from '.';
import { jobList, resumeVector } from './schema';
import { eq, sql, cosineDistance } from 'drizzle-orm';


const openai = createOpenAI({
  compatibility: 'compatible', // strict mode, enable when using the OpenAI API
  apiKey: env.EMBEDDED_OPENAI_KEY,
});


export async function embeddingResume(userId: string, embeddedText: string) {
  // This function check existing embedded resume based on userId, if exist it will insert. otherwise will be update
  try {
    //Check existing embedded resume based on userId
    const existingResume = await db
      .select()
      .from(resumeVector)
      .where(eq(resumeVector.userId, userId))
      .limit(1)

    if (existingResume.length === 0) {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: embeddedText,
      });
      await db.insert(resumeVector).values({
        userId,
        embeddingText: embeddedText,
        embedding,
      })
    } else {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: embeddedText,
      });
      await db.update(resumeVector)
        .set({
          embeddingText: embeddedText,
          embedding,
        })
        .where(eq(resumeVector.userId, userId))
    }
  } catch (error) {
    console.error(error)
  }
}


export async function hasResume(userId: string): Promise<boolean> {
  const result = await db
    .select()
    .from(resumeVector)
    .where(eq(resumeVector.userId, userId))
    .limit(1)
  return result.length > 0
}

export async function getJobAndResume(jobId: number, userId: string) {
  const getResumeVector = await db
    .select({
      embedding: resumeVector.embedding
    })
    .from(resumeVector)
    .where(eq(resumeVector.userId, userId))
    .limit(1)

  const resumeEmbedding = getResumeVector[0]?.embedding;

  if (!resumeEmbedding) {
    throw new Error("Resume embedding not found");
  }

  const similarity = sql<number>`1 - (${cosineDistance(jobList.embedding, resumeEmbedding)})`;

  const result = await db
    .select({
      similarity,
    }
    )
    .from(jobList)
    .where(eq(jobList.jobId, jobId))
  return result
}
