import { createOpenAI } from '@ai-sdk/openai';
import { env } from '~/env';
import { dummyResume } from '~/data/dummy-resume';
import { db } from '~/server/db';
import { embed } from "ai"
import { resumeVector } from '~/server/db/schema';
import { eq } from 'drizzle-orm';



const openai = createOpenAI({
  compatibility: 'compatible', // strict mode, enable when using the OpenAI API
  apiKey: env.EMBEDDED_OPENAI_KEY,
});


export default async function Page() {
  const userId = "402c091e-db8c-45f4-9b31-a5f13260ef96"
  const existingResume = await db
    .select()
    .from(resumeVector)
    .where(eq(resumeVector.userId, userId))
    .limit(1);

  if (existingResume.length === 0) {
    try {

      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: dummyResume,
      });

      await db.insert(resumeVector).values({
        userId,
        embeddingText: dummyResume,
        embedding,
      })

      return (
        <h1>Resume saved successfully and vector embedded!</h1>
      );
    } catch (error) {
      console.error('Error embedding resume:', error);
      return (
        <h1>There was an error saving the resume and embedding the vector.</h1>
      );
    }
  } else {
    return (
      <h1>Resume already exists for this user!</h1>
    );
  }
}
