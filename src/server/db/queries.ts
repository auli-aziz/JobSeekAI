import 'server-only'
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import { env } from '~/env';
import { db } from '.';
import { resumeVector } from './schema';
import { eq } from 'drizzle-orm';
import {
  profileDetails,
  skills,
  experiences,
  educations,
  certifications,
} from "./schema";
// import { get } from 'http';

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

export async function getResumebyProfileId(profileId: number) {
  try {
    const profile = await db.select().from(profileDetails).where(eq(profileDetails.id, profileId)).limit(1);

    const [skillsList, experienceList, educationList, certificationList] = await Promise.all([
      db.select().from(skills).where(eq(skills.profileDetailsId, profileId)),
      db.select().from(experiences).where(eq(experiences.profileDetailsId, profileId)),
      db.select().from(educations).where(eq(educations.profileDetailsId, profileId)),
      db.select().from(certifications).where(eq(certifications.profileDetailsId, profileId)),
    ]);

    const fullProfile = {
      ...profile[0],
      skills: skillsList,
      experiences: experienceList,
      educations: educationList,
      certifications: certificationList,
    };
    return fullProfile;
  } catch (error) {
    console.error(error)
  }
}

export async function getProfileByUserId(userId: string) {
  try {
    const profile = await db
      .select()
      .from(profileDetails)
      .where(eq(profileDetails.userId, userId))
      .limit(1);
    
    // return profile[0]?.id;  // Return the id if available, otherwise undefined
    return profile[0]; 
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving profile');
  }
}

export async function updateProfileDetails(userId: string, data: {
  title?: string
  location?: string
  phone?: string
  about?: string
}) {
  return db
    .update(profileDetails)
    .set(data)
    .where(eq(profileDetails.userId, userId))
}

