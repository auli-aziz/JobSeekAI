import 'server-only'
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import { env } from '~/env';
import { db } from '.';
import { resumeVector } from './schema';
import { eq } from 'drizzle-orm';

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


