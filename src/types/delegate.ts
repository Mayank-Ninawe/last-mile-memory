import type { TaskCategory } from "@/types/task";

export type DelegateRole =
    | "owner"
    | "childcare_delegate"
    | "finance_delegate";

export interface Delegate {
    id: string;
    name: string;
    relationship: string;
    role: DelegateRole;
    allowedCategories: TaskCategory[];
    phone: string | null;
    isActive: boolean;
}