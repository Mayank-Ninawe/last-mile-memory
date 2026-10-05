import { z } from "zod";

export const AI_TASK_CATEGORIES = [
  "childcare",
  "pet_care",
  "bills",
  "medication",
  "emergency_contact",
] as const;

export const AI_DELEGATE_ROLES = [
  "owner",
  "childcare_delegate",
  "finance_delegate",
] as const;

export const extractedTaskSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().min(1).max(800),
  category: z.enum(AI_TASK_CATEGORIES).default("emergency_contact"),
  priority: z.number().int().min(1).max(5).default(3),
  deadlineText: z.string().max(180).nullable().optional().default(null),
  assignedRole: z.enum(AI_DELEGATE_ROLES).nullable().optional().default(null),
  sensitivity: z.enum(["normal", "restricted", "private"]).default("normal"),
  confidence: z.number().min(0).max(1).optional().default(0.65),
  whyImportant: z
    .string()
    .min(1)
    .max(500)
    .optional()
    .default("Review this extracted household action before acting."),
});

export const aiExtractionResponseSchema = z.object({
  tasks: z.array(extractedTaskSchema).max(12),
  missingInformation: z.array(z.string().min(1).max(300)).max(10),
  safetyNote: z.string().min(1).max(500),
});

export type ExtractedTask = z.infer<typeof extractedTaskSchema>;
export type AIExtractionResponse = z.infer<
  typeof aiExtractionResponseSchema
>;