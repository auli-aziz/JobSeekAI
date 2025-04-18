
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { JobCompatibilitySchema } from "~/types/resume-comparison";
import { type z } from "zod";


export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const extractDataFromResume = async (
  prevState: ActionResponse | null,
  resumeText: string,
  jobDescription: string,
): Promise<ActionResponse<z.infer<typeof JobCompatibilitySchema>>> => {
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
    };
  }
};
