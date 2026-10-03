import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  PawPrint,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/constants/categories";
import { anikaHousehold } from "@/lib/demo/anika-household";
import {
  getTaskUrgencyLabel,
  sortTasksByPriority,
} from "@/lib/rules/priority-engine";

const categoryIcons = {
  childcare: UsersRound,
  pet_care: PawPrint,
  bills: ReceiptText,
  medication: HeartPulse,
  emergency_contact: BellRing,
};

export default function DashboardPage() {
  const totalTasks = anikaHousehold.tasks.length;
  const pendingTasks = anikaHousehold.tasks.filter(
    (task) => task.status !== "completed",
  );
  const urgentTasks = sortTasksByPriority(pendingTasks).filter(
    (task) => getTaskUrgencyLabel(task) === "Do now",
  );
  const readinessScore = 78;

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

          <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
            <ShieldCheck className="h-4 w-4" />
            Demo Household
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
                Welcome back, {anikaHousehold.ownerName.split(" ")[0]}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep essential household routines organized before a disruption
                happens. This demo shows a prepared household with approved
                delegates and emergency-ready tasks.
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
              3 items still need review.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Saved routines
              </p>
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {totalTasks}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Household tasks and instructions are structured.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Trusted delegates
              </p>
              <UsersRound className="h-5 w-5 text-violet-600" />
            </div>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {anikaHousehold.delegates.length}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Each person has limited role-based access.
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
              Tasks that would need immediate action.
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
                  Prepared household information
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Key routines and responsibilities
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These are the important tasks the app can organize during an
                  emergency. AI extraction will be added later in the project.
                </p>
              </div>

              <Link
                href="/emergency"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
              >
                View action plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {anikaHousehold.tasks.slice(0, 5).map((task) => {
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
                        <p className="font-bold text-slate-900">{task.title}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                            CATEGORY_COLORS[task.category]
                          }`}
                        >
                          {CATEGORY_LABELS[task.category]}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        Source: {task.sourceName}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-violet-600" />
                <h2 className="text-xl font-black text-slate-900">
                  Trusted delegates
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                {anikaHousehold.delegates.map((delegate) => (
                  <article
                    key={delegate.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {delegate.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {delegate.relationship}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Active
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Authorized categories
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {delegate.allowedCategories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800"
                        >
                          {CATEGORY_LABELS[category]}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <TriangleAlert className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-amber-950">
                    Readiness gaps
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    Complete these before relying on the emergency plan.
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                {anikaHousehold.missingInformation.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-amber-950"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
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
                Turn real notes into structured household tasks.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-900">
                Next, we will build the upload page and connect Gemini so that
                pasted notes can be extracted into tasks, categories, deadlines,
                and delegated roles.
              </p>
            </div>

            <Link
              href="/emergency"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
            >
              Review emergency plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}