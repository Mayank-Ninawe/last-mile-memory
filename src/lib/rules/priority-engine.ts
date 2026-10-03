import type { HouseholdTask } from "@/types/task";

export function getPriorityScore(task: HouseholdTask): number {
    let score = task.priority * 10;

    if (task.category === "childcare") {
        score += 15;
    }

    if (task.category === "medication") {
        score += 12;
    }

    if (task.deadline?.toLowerCase().includes("today")) {
        score += 10;
    }

    if (task.status === "needs_confirmation") {
        score -= 5;
    }

    if (task.confidence < 0.8) {
        score -= 3;
    }

    return score;
}

export function sortTasksByPriority(tasks: HouseholdTask[]): HouseholdTask[] {
    return [...tasks].sort(
        (firstTask, secondTask) =>
            getPriorityScore(secondTask) - getPriorityScore(firstTask),
    );
}

export function getTaskUrgencyLabel(task: HouseholdTask): string {
    const score = getPriorityScore(task);

    if (score >= 60) {
        return "Do now";
    }

    if (score >= 35) {
        return "Due today";
    }

    return "Upcoming";
}