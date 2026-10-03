export type TaskCategory =
    | "childcare"
    | "pet_care"
    | "bills"
    | "medication"
    | "emergency_contact";

export type TaskStatus = "pending" | "completed" | "needs_confirmation";

export type TaskPriority = 1 | 2 | 3 | 4 | 5;

export interface HouseholdTask {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    deadline: string | null;
    assignedRole: string | null;
    sourceName: string;
    whyImportant: string;
    confidence: number;
    status: TaskStatus;
}