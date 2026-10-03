import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Prepare privately",
    description:
      "Save essential household routines, approved contacts, key deadlines, and practical instructions before an emergency happens.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Activate emergency mode",
    description:
      "When a primary household organizer is suddenly unavailable, activate a guided continuity plan.",
    icon: HeartPulse,
  },
  {
    number: "03",
    title: "Give only necessary access",
    description:
      "Trusted people see only the tasks and information needed for their assigned responsibilities.",
    icon: LockKeyhole,
  },
  {
    number: "04",
    title: "Keep life moving",
    description:
      "Prioritized actions help protect childcare, pets, bills, routines, and essential communication during disruption.",
    icon: CheckCircle2,
  },
];

const problems = [
  "Important routines live in one person's memory, messages, calendars, and paper notes.",
  "During a medical or family emergency, calls can be incomplete, stressful, or impossible.",
  "Family members may have good intentions but lack the right permission, context, or documents.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50 via-white to-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
          <div className="absolute left-0 top-72 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
        </div>

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-200">
              <ShieldCheck className="h-5 w-5 text-white" />
            </span>

            <span>
              <span className="block text-base font-bold tracking-tight text-slate-900">
                Last Mile Memory
              </span>
              <span className="block text-xs text-slate-500">
                Household continuity, safely shared
              </span>
            </span>
          </Link>

          <Link
            href="/emergency"
            className="hidden items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 sm:inline-flex"
          >
            View demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
                AI-powered emergency continuity support
              </div>

              <h1 className="mt-7 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                When life is disrupted,{" "}
                <span className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  the household should not collapse.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Last Mile Memory turns approved household notes into a
                privacy-safe emergency action plan. When the person who keeps
                daily life running becomes unavailable, trusted people know
                what needs to happen next—without seeing everything private.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/emergency"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  Open emergency demo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  AI extracts practical tasks
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Role-based privacy
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Clear emergency priorities
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/70 via-cyan-100/70 to-rose-100/70 blur-2xl" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-indigo-100 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Hospitalization Mode
                      </p>
                      <p className="text-xs text-slate-500">
                        Anika Sharma&apos;s household
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-700">
                    Do now
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    Pick up Kabir from school
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Deadline: Today, 2:00 PM · Assigned to Meera
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                      Needs confirmation
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      Grandmother&apos;s medicine routine
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Verify instructions with an authorized adult.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-700">
                      Privacy protected
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      Meera sees childcare only
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Financial and unrelated private details stay hidden.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                    Missing information detected
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    School pickup authorization document is not uploaded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <article
              key={problem}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-rose-600">
                0{index + 1}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {problem}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            A calm, private handoff when normal life is not possible.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            This is not a replacement for family communication. It is a
            structured backup when calls are incomplete, information is
            scattered, or the household organizer cannot coordinate everyone.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-indigo-600">
                    {step.number}
                  </span>
                  <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-indigo-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <LockKeyhole className="h-4 w-4" />
              Privacy is the product—not an afterthought
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Help without handing over someone&apos;s entire private life.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              A childcare delegate can see pickup details and pet care. A
              finance delegate can see bill-related tasks. Neither should
              automatically access private medical records, bank statements,
              messages, or unrelated documents.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <UsersRound className="h-6 w-6" />
              </span>

              <div>
                <p className="font-bold text-slate-900">
                  Minimum necessary access
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  The right person sees the right task.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
                <span className="font-bold text-cyan-700">Meera:</span>{" "}
                childcare, school contact, pet-care routine
              </div>

              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-slate-700">
                <span className="font-bold text-violet-700">Rohan:</span>{" "}
                electricity bill, landlord contact, admin tasks
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <span className="font-bold">Hidden by default:</span> private
                records, messages, and unrelated financial information
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold text-slate-900">
              Build preparedness before chaos starts.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Prototype created for a real-world AI hackathon use case.
            </p>
          </div>

          <Link
            href="/emergency"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Explore the emergency flow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}