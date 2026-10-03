import type { HouseholdTask } from "@/types/task";
import { TaskCard } from "@/components/tasks/task-card";

interface TaskListProps {
  tasks: HouseholdTask[];
  onComplete?: (taskId: string) => void;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onComplete,
  emptyMessage = "No tasks are available in this section.",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={onComplete} />
      ))}
    </div>
  );
}