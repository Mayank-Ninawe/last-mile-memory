import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/constants/categories";
import { getTaskUrgencyLabel } from "@/lib/rules/priority-engine";
import type { HouseholdTask } from "@/types/task";

interface TaskCardProps {
  task: HouseholdTask;
  onComplete?: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const urgency = getTaskUrgencyLabel(task);
  const isCompleted = task.status === "completed";
  const needsConfirmation = task.status === "needs_confirmation";

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        isCompleted ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              CATEGORY_COLORS[task.category]
            }`}
          >
            {CATEGORY_LABELS[task.category]}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              urgency === "Do now"
                ? "bg-red-100 text-red-700"
                : urgency === "Due today"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {urgency}
          </span>
        </div>

        {needsConfirmation ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <CircleAlert className="h-4 w-4" />
            Needs confirmation
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            {Math.round(task.confidence * 100)}% confidence
          </span>
        )}
      </div>

      <h3
        className={`mt-4 text-lg font-bold text-slate-900 ${
          isCompleted ? "line-through" : ""
        }`}
      >
        {task.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {task.description}
      </p>

      <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
        {task.deadline ? (
          <p className="flex items-center gap-2 font-medium text-slate-700">
            <CalendarClock className="h-4 w-4 text-indigo-600" />
            Deadline: {task.deadline}
          </p>
        ) : (
          <p className="flex items-center gap-2 text-slate-600">
            <Clock3 className="h-4 w-4 text-slate-500" />
            No fixed deadline
          </p>
        )}

        <p className="flex items-start gap-2 text-slate-600">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          Source: {task.sourceName}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
          Why this matters
        </p>
        <p className="mt-1 text-sm leading-6 text-indigo-950">
          {task.whyImportant}
        </p>
      </div>

      {onComplete && !isCompleted ? (
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark as completed
        </button>
      ) : null}
    </article>
  );
}