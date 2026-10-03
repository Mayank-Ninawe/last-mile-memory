"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  Clock3,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  PawPrint,
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
  getDelegateMembershipForUser,
  type FirestoreDelegateDocument,
} from "@/lib/firebase/delegates";
import {
  getTasksForHousehold,
  markTaskCompleted,
  markTaskPending,
  type FirestoreTaskCategory,
  type FirestoreTaskDocument,
} from "@/lib/firebase/firestore";
import { getHouseholdById } from "@/lib/firebase/households";

const categoryIcons = {
  childcare: UsersRound,
  pet_care: PawPrint,
  bills: ReceiptText,
  medication: HeartPulse,
  emergency_contact: BellRing,
};

const allowedCategoriesByRole: Record<
  FirestoreDelegateDocument["role"],
  FirestoreTaskCategory[]
> = {
  childcare_delegate: ["childcare", "pet_care", "emergency_contact"],
  finance_delegate: ["bills", "emergency_contact"],
};

function getRoleLabel(role: FirestoreDelegateDocument["role"]) {
  return role === "childcare_delegate"
    ? "Childcare Delegate"
    : "Finance & Admin Delegate";
}

function getRoleDescription(role: FirestoreDelegateDocument["role"]) {
  return role === "childcare_delegate"
    ? "You can access child-care, pet-care, and approved emergency-contact tasks."
    : "You can access bills, finance administration, and approved emergency-contact tasks.";
}

function getUrgencyLabel(task: FirestoreTaskDocument) {
  if (task.status === "needs_confirmation") {
    return "Confirm first";
  }

  if (task.priority >= 4) {
    return "Do now";
  }

  if (task.priority >= 3) {
    return "Due today";
  }

  return "Upcoming";
}

function getUrgencyStyle(label: string) {
  if (label === "Do now") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (label === "Due today") {
    return "border-orange-200 bg-orange-50 text-orange-800";
  }

  if (label === "Confirm first") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function DelegateContent() {
  const { user } = useAuth();

  const [membership, setMembership] =
    useState<FirestoreDelegateDocument | null>(null);
  const [householdName, setHouseholdName] = useState("Household");
  const [tasks, setTasks] = useState<FirestoreTaskDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTaskId, setIsUpdatingTaskId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDelegateWorkspace() {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const delegateMembership = await getDelegateMembershipForUser(user.uid);

        if (!delegateMembership) {
          setMembership(null);
          setTasks([]);
          return;
        }

        const [household, householdTasks] = await Promise.all([
          getHouseholdById(delegateMembership.householdId),
          getTasksForHousehold(delegateMembership.householdId),
        ]);

        if (!household) {
          throw new Error("The household for this delegate account was not found.");
        }

        const allowedCategories =
          allowedCategoriesByRole[delegateMembership.role];

        const permittedTasks = householdTasks.filter((task) =>
          allowedCategories.includes(task.category),
        );

        setMembership(delegateMembership);
        setHouseholdName(household.name);
        setTasks(permittedTasks);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load delegate tasks.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDelegateWorkspace();
  }, [user]);

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== "completed")
        .sort((firstTask, secondTask) => secondTask.priority - firstTask.priority),
    [tasks],
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks],
  );

  async function toggleTask(task: FirestoreTaskDocument) {
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
          : "Unable to update this task.",
      );
    } finally {
      setIsUpdatingTaskId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          Loading delegate workspace...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <TriangleAlert className="mx-auto h-8 w-8 text-red-600" />
          <h1 className="mt-4 text-xl font-black text-slate-900">
            Delegate workspace unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!membership) {
    return (
      <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Last Mile Memory
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="mx-auto grid max-w-2xl place-items-center px-4 py-20">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <LockKeyhole className="mx-auto h-10 w-10 text-slate-400" />
            <h1 className="mt-4 text-2xl font-black text-slate-900">
              No delegate access assigned
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This account is not currently assigned as a household delegate.
              Ask the household owner to add your Firebase Auth UID in their
              delegate settings.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Last Mile Memory
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              Limited delegate access
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-cyan-800 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-cyan-100">
                <UsersRound className="h-4 w-4" />
                {getRoleLabel(membership.role)}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                {householdName} action board
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                {getRoleDescription(membership.role)} Private household
                information outside these task categories is not shown here.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">
                Your assigned tasks
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                {activeTasks.length}
              </p>
              <p className="mt-1 text-sm text-indigo-100">Still active</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-cyan-100 p-2.5 text-cyan-700">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-black text-cyan-950">
                Privacy boundary is active
              </h2>
              <p className="mt-1 text-sm leading-6 text-cyan-900">
                You can only view tasks in your approved role categories.
                Medication tasks, private details, and unrelated household
                responsibilities stay hidden.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
                Your permitted actions
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Active tasks
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mark a task complete only after you have confirmed the action
                has been done.
              </p>
            </div>

            {activeTasks.length > 0 ? (
              <div className="mt-6 space-y-4">
                {activeTasks.map((task) => {
                  const Icon = categoryIcons[task.category];
                  const urgency = getUrgencyLabel(task);
                  const isUpdating = isUpdatingTaskId === task.id;

                  return (
                    <article
                      key={task.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => void toggleTask(task)}
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
                              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getUrgencyStyle(
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

                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              {task.deadlineText ?? "No explicit deadline"}
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-slate-400" />
                              Priority {task.priority} of 5
                            </span>
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
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h3 className="mt-3 text-lg font-black text-slate-900">
                  No active tasks in your role
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Either all permitted tasks are complete, or the household
                  owner has not assigned any tasks in your categories.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                  <LockKeyhole className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-slate-900">
                    Information you cannot access
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The household owner has not shared private records,
                    medication information, or tasks outside your assigned role.
                  </p>
                </div>
              </div>
            </section>

            {completedTasks.length > 0 ? (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                  <div>
                    <p className="font-black text-emerald-950">
                      {completedTasks.length} task
                      {completedTasks.length === 1 ? "" : "s"} completed
                    </p>
                    <p className="mt-1 text-sm text-emerald-800">
                      Completion is visible to the household owner.
                    </p>
                  </div>
                </div>
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function DelegatePage() {
  return (
    <ProtectedRoute>
      <DelegateContent />
    </ProtectedRoute>
  );
}