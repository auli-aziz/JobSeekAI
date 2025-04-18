"use server"

import { db } from "~/server/db"
import { skills, experiences, educations, certifications, profileDetails } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Profile actions
export async function updateProfileDetails(
  userId: string,
  data: {
    title?: string
    location?: string
    phone?: string
    about?: string
  },
) {
  await db.update(profileDetails).set(data).where(eq(profileDetails.userId, userId))
  revalidatePath("/profile")
  return { success: true }
}

// Skills actions
export async function addSkill(profileId: number, name: string) {
  await db.insert(skills).values({
    profileDetailsId: profileId,
    name,
  })
  revalidatePath("/profile")
  return { success: true }
}

export async function deleteSkill(skillId: number) {
  await db.delete(skills).where(eq(skills.id, skillId))
  revalidatePath("/profile")
  return { success: true }
}

// Experience actions
export async function addExperience(
  profileId: number,
  data: {
    role: string
    company: string
    period: string
    description?: string
  },
) {
  await db.insert(experiences).values({
    profileDetailsId: profileId,
    ...data,
  })
  revalidatePath("/profile")
  return { success: true }
}

export async function updateExperience(
  experienceId: number,
  data: {
    role?: string
    company?: string
    period?: string
    description?: string
  },
) {
  await db.update(experiences).set(data).where(eq(experiences.id, experienceId))
  revalidatePath("/profile")
  return { success: true }
}

export async function deleteExperience(experienceId: number) {
  await db.delete(experiences).where(eq(experiences.id, experienceId))
  revalidatePath("/profile")
  return { success: true }
}

// Education actions
export async function addEducation(
  profileId: number,
  data: {
    degree: string
    institution: string
    period: string
  },
) {
  await db.insert(educations).values({
    profileDetailsId: profileId,
    ...data,
  })
  revalidatePath("/profile")
  return { success: true }
}

export async function updateEducation(
  educationId: number,
  data: {
    degree?: string
    institution?: string
    period?: string
  },
) {
  await db.update(educations).set(data).where(eq(educations.id, educationId))
  revalidatePath("/profile")
  return { success: true }
}

export async function deleteEducation(educationId: number) {
  await db.delete(educations).where(eq(educations.id, educationId))
  revalidatePath("/profile")
  return { success: true }
}

// Certification actions
export async function addCertification(
  profileId: number,
  data: {
    name: string
    issuer?: string
    date?: string
  },
) {
  await db.insert(certifications).values({
    profileDetailsId: profileId,
    ...data,
  })
  revalidatePath("/profile")
  return { success: true }
}

export async function updateCertification(
  certificationId: number,
  data: {
    name?: string
    issuer?: string
    date?: string
  },
) {
  await db.update(certifications).set(data).where(eq(certifications.id, certificationId))
  revalidatePath("/profile")
  return { success: true }
}

export async function deleteCertification(certificationId: number) {
  await db.delete(certifications).where(eq(certifications.id, certificationId))
  revalidatePath("/profile")
  return { success: true }
}
