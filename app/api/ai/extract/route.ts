import { NextResponse } from "next/server";
import { z } from "zod";

import { extractHouseholdTasks } from "@/lib/ai/extraction-service";
import { AI_TASK_CATEGORIES } from "@/schemas/ai-extraction.schema";

const extractRequestSchema = z.object({
  note: z
    .string()
    .trim()
    .min(20, "Please enter at least 20 characters of household information.")
    .max(12000, "The note is too long. Please keep it below 12,000 characters."),
  selectedCategory: z.enum(AI_TASK_CATEGORIES),
});

export async function POST(request: Request) {
  try {
    const requestBody: unknown = await request.json();

    const parsedRequest = extractRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
          details: parsedRequest.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }

    const { note, selectedCategory } = parsedRequest.data;

    const extraction = await extractHouseholdTasks(note, selectedCategory);

    return NextResponse.json({
      success: true,
      data: extraction,
    });
  } catch (error) {
    console.error("AI extraction error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to extract household tasks right now.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}