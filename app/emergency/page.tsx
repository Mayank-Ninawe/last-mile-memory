import Link from "next/link";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";

import { EmergencyBanner } from "@/components/emergency/emergency-banner";
import { EmergencyTaskBoard } from "@/components/emergency/emergency-task-board";
import { anikaHousehold } from "@/lib/demo/anika-household";

export default function EmergencyPage() {
  const activeDelegates = anikaHousehold.delegates.filter(
    (delegate) => delegate.isActive,
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            Demo data only — no real household information
          </div>
        </div>

        <EmergencyBanner
          ownerName={anikaHousehold.ownerName}
          mode="Hospitalization"
        />

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Emergency action plan
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                What needs to happen next
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Tasks are prioritized using deadlines, household category,
                urgency, and confidence in the saved information.
              </p>
            </div>

            <EmergencyTaskBoard
              initialTasks={anikaHousehold.tasks}
              missingInformation={anikaHousehold.missingInformation}
            />
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900">
                Active trusted people
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Each person should only receive information required for their
              assigned role.
            </p>

            <div className="mt-5 space-y-3">
              {activeDelegates.map((delegate) => (
                <article
                  key={delegate.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-bold text-slate-900">{delegate.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {delegate.relationship} ·{" "}
                    {delegate.role === "childcare_delegate"
                      ? "Childcare Delegate"
                      : "Finance & Admin Delegate"}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Authorized for
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {delegate.allowedCategories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800"
                      >
                        {category.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm font-bold text-indigo-950">
                Privacy principle
              </p>
              <p className="mt-1 text-sm leading-6 text-indigo-900">
                Delegates should receive the minimum information necessary to
                complete authorized tasks. They should not automatically see
                personal records, private messages, or unrelated financial
                details.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
