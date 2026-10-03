import type { TaskCategory } from "@/types/task";

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
    childcare: "Childcare",
    pet_care: "Pet Care",
    bills: "Bills & Home Admin",
    medication: "Medication Routine",
    emergency_contact: "Emergency Contact",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
    childcare: "bg-blue-100 text-blue-800 border-blue-200",
    pet_care: "bg-amber-100 text-amber-800 border-amber-200",
    bills: "bg-purple-100 text-purple-800 border-purple-200",
    medication: "bg-rose-100 text-rose-800 border-rose-200",
    emergency_contact: "bg-emerald-100 text-emerald-800 border-emerald-200",
};