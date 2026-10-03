"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  BrainCircuit,
  ClipboardList,
  FileText,
  HeartPulse,
  LoaderCircle,
  PawPrint,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import { LogoutButton } from "@/components/providers/logout-button";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/constants/categories";
import {
  getTasksForHousehold,
  type FirestoreTask,
} from "@/lib/firebase/firestore";
import {
  getHouseholdForOwner,
  type FirestoreHousehold,
} from "@/lib/firebase/households";

const categoryIcons = {
  childcare: UsersRound,
  pet_care: PawPrint,
  bills: ReceiptText,
  medication: HeartPulse,
  emergency_contact: BellRing,
};

type HouseholdDocument = FirestoreHousehold & {
  id: string;
};

type TaskDocument = FirestoreTask & {
  id: string;
};

function getUrgencyLabel(task: TaskDocument) {
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

function getReadinessScore(
  taskCount: number,
  needsConfirmationCount: number,
) {
  if (taskCount === 0) {
    return 35;
  }

  const score = 70 + Math.min(taskCount * 4, 20) - needsConfirmationCount * 5;

  return Math.max(35, Math.min(score, 95));
}

function DashboardContent() {
  const { user } = useAuth();

  const [household, setHousehold] = useState<HouseholdDocument | null>(null);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) {
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const loadedHousehold = await getHouseholdForOwner(user.uid);

        if (!loadedHousehold) {
          window.location.href = "/onboarding";
          return;
        }

        const loadedTasks = await getTasksForHousehold(loadedHousehold.id);

        setHousehold(loadedHousehold as HouseholdDocument);
        setTasks(loadedTasks as TaskDocument[]);
      } catch (caughtError) {
        setLoadError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load your household workspace.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [user]);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status !== "completed"),
    [tasks],
  );

  const urgentTasks = useMemo(
    () => pendingTasks.filter((task) => task.priority >= 4),
    [pendingTasks],
  );

  const needsConfirmationTasks = useMemo(
    () => tasks.filter((task) => task.status === "needs_confirmation"),
    [tasks],
  );

  const readinessScore = getReadinessScore(
    tasks.length,
    needsConfirmationTasks.length,
  );

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          Loading your household workspace...
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <TriangleAlert className="mx-auto h-8 w-8 text-red-600" />
          <h1 className="mt-4 text-xl font-black text-slate-900">
            Unable to load household
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{loadError}</p>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Go to onboarding
          </Link>
        </div>
      </main>
    );
  }

  const firstName =
    user?.displayName?.split(" ")[0] ??
    household?.name.split("'")[0] ??
    "there";

  const displayedTasks = tasks.slice(0, 5);

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
            <div className="hidden max-w-52 truncate items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {household?.name ?? "Household workspace"}
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                <BrainCircuit className="h-4 w-4" />
                Household continuity dashboard
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                <span className="font-semibold text-white">
                  {household?.name}
                </span>{" "}
                has {tasks.length} saved task
                {tasks.length === 1 ? "" : "s"} that can support your
                household during an unexpected disruption.
              </p>
            </div>

            <Link
              href="/emergency"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400"
            >
              <TriangleAlert className="h-4 w-4" />
              Open Hospitalization Mode
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Readiness score
              </p>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="mt-3 text-4xl font-black text-slate-900">
              {readinessScore}
              <span className="text-xl text-slate-400">%</span>
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Based on stored tasks and confirmation gaps.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Saved tasks
              </p>
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>

            <p className="mt-3 text-4xl font-black text-slate-900">
              {tasks.length}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Gemini-extracted tasks saved in Firestore.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Need confirmation
              </p>
              <TriangleAlert className="h-5 w-5 text-amber-600" />
            </div>

            <p className="mt-3 text-4xl font-black text-slate-900">
              {needsConfirmationTasks.length}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Low-confidence tasks should be reviewed.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Urgent tasks
              </p>
              <TriangleAlert className="h-5 w-5 text-rose-600" />
            </div>

            <p className="mt-3 text-4xl font-black text-slate-900">
              {urgentTasks.length}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Tasks marked priority 4 or 5.
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
                  Saved household tasks
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Your latest emergency-ready actions
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tasks below are saved from Gemini extraction and remain
                  available after refresh.
                </p>
              </div>

              <Link
                href="/upload"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
              >
                Add a note
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {displayedTasks.length > 0 ? (
              <div className="mt-6 space-y-3">
                {displayedTasks.map((task) => {
                  const Icon = categoryIcons[task.category];

                  return (
                    <article
                      key={task.id}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <span className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900">
                            {task.title}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                              CATEGORY_COLORS[task.category]
                            }`}
                          >
                            {CATEGORY_LABELS[task.category]}
                          </span>

                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              getUrgencyLabel(task) === "Do now"
                                ? "bg-red-100 text-red-700"
                                : getUrgencyLabel(task) === "Due today"
                                  ? "bg-orange-100 text-orange-700"
                                  : getUrgencyLabel(task) ===
                                      "Needs confirmation"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {getUrgencyLabel(task)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {task.description}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                          <span>
                            Deadline:{" "}
                            {task.deadlineText ?? "No explicit deadline"}
                          </span>
                          <span>
                            Confidence: {Math.round(task.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <FileText className="mx-auto h-7 w-7 text-slate-400" />
                <p className="mt-3 font-bold text-slate-800">
                  No saved tasks yet
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add a household note, run Gemini extraction, review the
                  result, and save approved tasks here.
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

          <div className="space-y-6">
            <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                  <ClipboardList className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-indigo-950">
                    Real persistence is active
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-indigo-900">
                    Your saved task records now persist in Firestore and are
                    available after refresh or a new login.
                  </p>
                </div>
              </div>

              <Link
                href="/upload"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-900 hover:text-indigo-700"
              >
                Add another note
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <TriangleAlert className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-amber-950">
                    Next important step
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    Emergency Mode will next load these saved tasks, prioritize
                    them, and let you mark actions complete.
                  </p>
                </div>
              </div>

              <Link
                href="/emergency"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-950 hover:text-amber-700"
              >
                Open Emergency Mode
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
                <ClipboardList className="h-4 w-4" />
                Next build phase
              </div>

              <h2 className="mt-2 text-2xl font-black text-indigo-950">
                Turn saved tasks into a live emergency action plan.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-900">
                Emergency Mode will use your real Firestore tasks, sort them by
                urgency, and persist completion status.
              </p>
            </div>

            <Link
              href="/emergency"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
            >
              Open Emergency Mode
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DashboardClient() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}