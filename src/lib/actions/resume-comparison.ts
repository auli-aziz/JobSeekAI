"use server"
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { JobCompatibilitySchema } from "~/types/resume-comparison";
import type { JobCompatibilty } from "~/types/jobs";


export interface ActionResponse {
  success: boolean;
  message: string;
  data: JobCompatibilty | null;
}

export const resumeCompare = async (
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> => {

  const resumeText = formData.get('resume') as string;
  const jobDescription = formData.get('desc') as string;
  try {
    const result = await generateObject({
      model: openai("gpt-4.1-mini"),
      system: `You will receive job description and resume description. Compare them and extract compatibility information.`,
      schema: JobCompatibilitySchema,
      prompt: `
Resume:
${resumeText}

Job Description:
${jobDescription}
      `,
    });

    const data = result.object;
    console.log("✅ Extracted compatibility data:", data);

    return {
      success: true,
      message: "Resume data extracted successfully.",
      data,
    };
  } catch (err) {
    console.error("❌ Error extracting resume:", err);
    return {
      success: false,
      message: "Failed to extract data from resume.",
      data: null,
    };
  }
};
