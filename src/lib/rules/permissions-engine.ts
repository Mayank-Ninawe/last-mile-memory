import type { DelegateRole } from "@/types/delegate";
import type { HouseholdTask, TaskCategory } from "@/types/task";
import { ROLE_ALLOWED_CATEGORIES } from "@/lib/constants/roles";

export function canRoleViewCategory(
    role: DelegateRole,
    category: TaskCategory,
): boolean {
    return ROLE_ALLOWED_CATEGORIES[role].includes(category);
}

export function getTasksForRole(
    tasks: HouseholdTask[],
    role: DelegateRole,
): HouseholdTask[] {
    return tasks.filter((task) => canRoleViewCategory(role, task.category));
}