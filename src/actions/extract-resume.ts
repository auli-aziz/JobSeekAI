"use server"

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ProfileSchema } from "~/types/profile-zod-ai";


export interface ActionResponse {
  success: boolean;
  message: string;
}


export const extractDataFromResume = async (
  prevState: ActionResponse | null,
  buffer: Uint8Array
): Promise<ActionResponse> => {
  try {
    const result = await generateObject({
      model: openai("gpt-4.1-mini"),
      system: `You will receive a resume. Please extract the data from the resume. If data doesn't exist, just write "data doesn't exist".`,
      schema: ProfileSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: buffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });

    // You can access the parsed profile object here:
    const profileData = result.object;
    console.log(profileData)

    // Optionally, save `profileData` to your DB with `userId` here

    return {
      success: true,
      message: "Resume data extracted successfully.",
    };
  } catch (err) {
    console.error("❌ Error extracting resume:", err);
    return {
      success: false,
      message: "Failed to extract data from resume.",
    };
  }
};
