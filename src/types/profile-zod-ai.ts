import { z } from "zod";
export const ProfileSchema = z.object({
  profileDetails: z.object({
    id: z.number().describe("Primary key ID of the profile"),
    userId: z.string().describe("ID of the user who owns this profile"),
    title: z.string().nullable().describe("Job title or headline"),
    location: z.string().nullable().describe("Location of the user"),
    phone: z.string().nullable().describe("Phone number"),
    joinDate: z.string().datetime().describe("Date the profile was created or joined"),
    about: z.string().nullable().describe("Short bio or about section"),
  }),
  skills: z.array(
    z.object({
      id: z.number().describe("Skill ID"),
      profileDetailsId: z.number().describe("Reference to profileDetails.id"),
      name: z.string().describe("Skill name"),
    })
  ).describe("List of skills the user has"),
  experiences: z.array(
    z.object({
      id: z.number().describe("Experience ID"),
      profileDetailsId: z.number().describe("Reference to profileDetails.id"),
      role: z.string().describe("Role or job title"),
      company: z.string().describe("Company name"),
      period: z.string().describe("Duration of employment (e.g. Jan 2020 - Dec 2022)"),
      description: z.string().nullable().describe("Job responsibilities or achievements"),
    })
  ).describe("List of work experiences"),
  educations: z.array(
    z.object({
      id: z.number().describe("Education ID"),
      profileDetailsId: z.number().describe("Reference to profileDetails.id"),
      degree: z.string().describe("Degree obtained"),
      institution: z.string().describe("Institution or university name"),
      period: z.string().describe("Study period (e.g. 2015 - 2019)"),
    })
  ).describe("List of educational backgrounds"),
  certifications: z.array(
    z.object({
      id: z.number().describe("Certification ID"),
      profileDetailsId: z.number().describe("Reference to profileDetails.id"),
      name: z.string().describe("Certification name"),
      issuer: z.string().nullable().describe("Issuer of the certification"),
      date: z.string().nullable().describe("Date of certification (can be formatted string or timestamp)"),
    })
  ).describe("List of certifications"),
}).describe("Extracted data from resume, if data doenst exist write data doenst exist");

