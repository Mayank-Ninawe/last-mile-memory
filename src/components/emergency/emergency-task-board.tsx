"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleHelp, Siren } from "lucide-react";

import { MissingInformationCard } from "@/components/emergency/missing-information-card";
import { TaskList } from "@/components/tasks/task-list";
import {
  getTaskUrgencyLabel,
  sortTasksByPriority,
} from "@/lib/rules/priority-engine";
import type { HouseholdTask } from "@/types/task";

interface EmergencyTaskBoardProps {
  initialTasks: HouseholdTask[];
  missingInformation: string[];
}

export function EmergencyTaskBoard({
  initialTasks,
  missingInformation,
}: EmergencyTaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const sortedTasks = useMemo(() => sortTasksByPriority(tasks), [tasks]);

  const doNowTasks = sortedTasks.filter(
    (task) =>
      task.status !== "completed" && getTaskUrgencyLabel(task) === "Do now",
  );

  const dueTodayTasks = sortedTasks.filter(
    (task) =>
      task.status !== "completed" &&
      getTaskUrgencyLabel(task) === "Due today",
  );

  const needsConfirmationTasks = sortedTasks.filter(
    (task) => task.status === "needs_confirmation",
  );

  const completedTasks = sortedTasks.filter(
    (task) => task.status === "completed",
  );

  function handleComplete(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: "completed" } : task,
      ),
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <Siren className="h-5 w-5" />
            <p className="font-bold">Do now</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-950">
            {doNowTasks.length}
          </p>
          <p className="mt-1 text-sm text-red-800">Urgent pending actions</p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2 text-orange-700">
            <CircleHelp className="h-5 w-5" />
            <p className="font-bold">Needs confirmation</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-orange-950">
            {needsConfirmationTasks.length}
          </p>
          <p className="mt-1 text-sm text-orange-800">
            Verify before taking action
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-bold">Completed</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-950">
            {completedTasks.length}
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Confirmed household actions
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Do now</h2>
          <p className="mt-1 text-sm text-slate-600">
            Complete these time-sensitive actions first.
          </p>
        </div>

        <TaskList
          tasks={doNowTasks}
          onComplete={handleComplete}
          emptyMessage="No immediate tasks are pending."
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Due today</h2>
          <p className="mt-1 text-sm text-slate-600">
            Important actions that should be handled today.
          </p>
        </div>

        <TaskList
          tasks={dueTodayTasks}
          onComplete={handleComplete}
          emptyMessage="No additional tasks are due today."
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Needs confirmation
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The system found this information but needs a trusted person to
            confirm it.
          </p>
        </div>

        <TaskList
          tasks={needsConfirmationTasks}
          onComplete={handleComplete}
          emptyMessage="No tasks need confirmation."
        />
      </section>

      <MissingInformationCard items={missingInformation} />

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Completed</h2>
          <p className="mt-1 text-sm text-slate-600">
            Actions marked complete in this local demo session.
          </p>
        </div>

        <TaskList
          tasks={completedTasks}
          emptyMessage="No tasks have been marked complete yet."
        />
      </section>
    </div>
  );
}