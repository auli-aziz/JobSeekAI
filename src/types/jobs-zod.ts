// src/schemas/jobsResponse.schema.ts

import { z } from "zod";

export const JobSchema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  // Add more fields as needed
});

export const JobsResponseSchema = z.object({
  "0-legal-notice": z.string(),
  "job-count": z.number(),
  jobs: z.array(JobSchema),
});

// Optional: export inferred types
export type Job = z.infer<typeof JobSchema>;
export type JobsResponse = z.infer<typeof JobsResponseSchema>;

