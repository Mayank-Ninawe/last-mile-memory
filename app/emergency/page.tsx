"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  PawPrint,
  Phone,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import { LogoutButton } from "@/components/providers/logout-button";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import {
  getTasksForHousehold,
  markTaskCompleted,
  markTaskPending,
  type FirestoreTaskDocument,
} from "@/lib/firebase/firestore";
import { getHouseholdForOwner } from "@/lib/firebase/households";

const categoryIcons = {
  childcare: UsersRound,
  pet_care: PawPrint,
  bills: ReceiptText,
  medication: HeartPulse,
  emergency_contact: BellRing,
};

type Urgency = "Do now" | "Due today" | "Upcoming" | "Needs confirmation";

function getUrgency(task: FirestoreTaskDocument): Urgency {
  if (task.status === "needs_confirmation") {
    return "Needs confirmation";
  }

  if (task.priority >= 4) {
    return "Do now";
  }

  if (task.priority >= 3) {
    return "Due today";
  }

  return "Upcoming";
}

function urgencyStyles(urgency: Urgency) {
  if (urgency === "Do now") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (urgency === "Due today") {
    return "border-orange-200 bg-orange-50 text-orange-800";
  }

  if (urgency === "Needs confirmation") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function urgencyWeight(task: FirestoreTaskDocument) {
  if (task.status === "needs_confirmation") {
    return 5;
  }

  return task.priority;
}

function EmergencyContent() {
  const { user } = useAuth();

  const [householdName, setHouseholdName] = useState("Your household");
  const [tasks, setTasks] = useState<FirestoreTaskDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTaskId, setIsUpdatingTaskId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    async function loadEmergencyBoard() {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const household = await getHouseholdForOwner(user.uid);

        if (!household) {
          window.location.href = "/onboarding";
          return;
        }

        const householdTasks = await getTasksForHousehold(household.id);

        setHouseholdName("Your household");
        setTasks(householdTasks);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load your emergency action board.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadEmergencyBoard();
  }, [user]);

  const pendingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== "completed")
        .sort((firstTask, secondTask) => {
          return urgencyWeight(secondTask) - urgencyWeight(firstTask);
        }),
    [tasks],
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks],
  );

  const doNowTasks = useMemo(
    () => pendingTasks.filter((task) => getUrgency(task) === "Do now"),
    [pendingTasks],
  );

  const confirmationTasks = useMemo(
    () =>
      pendingTasks.filter(
        (task) => getUrgency(task) === "Needs confirmation",
      ),
    [pendingTasks],
  );

  async function toggleTaskCompletion(task: FirestoreTaskDocument) {
    setIsUpdatingTaskId(task.id);
    setError(null);

    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? {
              ...currentTask,
              status:
                currentTask.status === "completed" ? "pending" : "completed",
            }
          : currentTask,
      ),
    );

    try {
      if (task.status === "completed") {
        await markTaskPending(task.id);
      } else {
        await markTaskCompleted(task.id);
      }
    } catch (caughtError) {
      setTasks(previousTasks);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update this task. Please try again.",
      );
    } finally {
      setIsUpdatingTaskId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-rose-600" />
          Loading your emergency action board...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-rose-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              Private household workspace
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-rose-700 via-red-700 to-orange-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-rose-50">
                  <TriangleAlert className="h-4 w-4" />
                  Hospitalization Mode
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Emergency action board
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-50 sm:text-base">
                  {householdName} has {pendingTasks.length} active task
                  {pendingTasks.length === 1 ? "" : "s"}. Complete verified
                  actions here; completion is saved to Firestore immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergencyActive((current) => !current)}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition ${
                  isEmergencyActive
                    ? "bg-white text-rose-700 hover:bg-rose-50"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {isEmergencyActive ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Emergency mode active
                  </>
                ) : (
                  <>
                    <TriangleAlert className="h-4 w-4" />
                    Activate emergency mode
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-bold text-rose-700">Do now</p>
              <p className="mt-2 text-3xl font-black text-rose-950">
                {doNowTasks.length}
              </p>
              <p className="mt-1 text-sm text-rose-800">
                High-priority actions
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-700">
                Confirm first
              </p>
              <p className="mt-2 text-3xl font-black text-amber-950">
                {confirmationTasks.length}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Low-confidence records
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-700">Completed</p>
              <p className="mt-2 text-3xl font-black text-emerald-950">
                {completedTasks.length}
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Saved as completed
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-bold">Action failed</p>
            <p className="mt-1 leading-6">{error}</p>
          </section>
        ) : null}

        {confirmationTasks.length > 0 ? (
          <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <LockKeyhole className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-black text-amber-950">
                  Confirmation required before acting
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  These tasks had lower extraction confidence. Check the
                  original household information or contact the owner before
                  taking action.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-600">
                  Priority sequence
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Work through active tasks
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tasks are sorted by urgency and priority. Mark a task
                  complete only after you have verified that it is done.
                </p>
              </div>

              <Link
                href="/upload"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
              >
                Add household note
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="mt-6 space-y-4">
                {pendingTasks.map((task) => {
                  const Icon = categoryIcons[task.category];
                  const urgency = getUrgency(task);
                  const isUpdating = isUpdatingTaskId === task.id;

                  return (
                    <article
                      key={task.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => void toggleTaskCompletion(task)}
                          disabled={isUpdating}
                          aria-label={`Mark ${task.title} complete`}
                          className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-slate-300 bg-white text-transparent transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-wait disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                              <Icon className="h-4 w-4" />
                            </span>

                            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              {CATEGORY_LABELS[task.category]}
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${urgencyStyles(
                                urgency,
                              )}`}
                            >
                              {urgency}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-black text-slate-900">
                            {task.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description}
                          </p>

                          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              <span>
                                {task.deadlineText ??
                                  "No explicit deadline found"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600">
                              <ShieldCheck className="h-4 w-4 text-slate-400" />
                              <span>
                                Priority {task.priority} of 5 ·{" "}
                                {Math.round(task.confidence * 100)}% confidence
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                              Why it matters
                            </p>
                            <p className="mt-1 text-sm leading-6 text-indigo-950">
                              {task.whyImportant}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <ClipboardCheck className="mx-auto h-8 w-8 text-emerald-600" />
                <h3 className="mt-3 text-lg font-black text-slate-900">
                  All active tasks are complete
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Add another household note if you need to capture more
                  emergency-ready instructions.
                </p>
                <Link
                  href="/upload"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Add household note
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700">
                  <Phone className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-indigo-950">
                    Keep decision-makers informed
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-indigo-900">
                    Confirm instructions directly with the household owner or
                    approved contact when details are unclear, particularly for
                    medication, money, and child-care decisions.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-cyan-100 p-2.5 text-cyan-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-cyan-950">
                    Completion is persistent
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-cyan-900">
                    Every checked task is updated in Firestore. Return to the
                    dashboard or refresh this page to verify the status
                    remains saved.
                  </p>
                </div>
              </div>
            </section>

            {completedTasks.length > 0 ? (
              <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowCompleted((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
                      Progress
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      {completedTasks.length} completed task
                      {completedTasks.length === 1 ? "" : "s"}
                    </h2>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 transition ${
                      showCompleted ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCompleted ? (
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                    {completedTasks.map((task) => {
                      const isUpdating = isUpdatingTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3"
                        >
                          <button
                            type="button"
                            onClick={() => void toggleTaskCompletion(task)}
                            disabled={isUpdating}
                            aria-label={`Reopen ${task.title}`}
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-white disabled:cursor-wait disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>

                          <div>
                            <p className="text-sm font-bold text-emerald-950 line-through">
                              {task.title}
                            </p>
                            <p className="mt-1 text-xs text-emerald-800">
                              Click the checkmark to reopen.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyContent />
    </ProtectedRoute>
  );
}