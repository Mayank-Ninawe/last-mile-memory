"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardPaste,
  FileText,
  Lightbulb,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/constants/categories";
import type { TaskCategory } from "@/types/task";

const exampleNote = `School pickup:
Kabir Sharma must be picked up from Green Valley School by 2:00 PM today.
Approved backup pickup contact: Meera Sharma.
School office: +91 98765 00123.

Pet care:
Bruno must be fed at 7:00 PM. Food is in the top kitchen cabinet.
Emergency veterinary contact: City Pet Clinic.

Bills:
Call the landlord before 5:00 PM today to confirm electricity bill payment instructions.
The electricity bill is due tomorrow.`;

const categoryOptions: Array<{
  value: TaskCategory;
  description: string;
}> = [
  {
    value: "childcare",
    description: "School pickups, routines, caregivers, and children.",
  },
  {
    value: "pet_care",
    description: "Feeding, walking, vet contacts, and pet instructions.",
  },
  {
    value: "bills",
    description: "Rent, utility bills, payments, and landlord contacts.",
  },
  {
    value: "medication",
    description: "Existing medicine routines that require confirmation.",
  },
  {
    value: "emergency_contact",
    description: "Approved contacts, schools, clinics, and service providers.",
  },
];

interface PreviewTask {
  title: string;
  category: TaskCategory;
  deadline: string;
  delegate: string;
  confidence: number;
}

export default function UploadPage() {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<TaskCategory>("childcare");
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);

  const previewTasks = useMemo<PreviewTask[]>(() => {
    const sourceText = note.toLowerCase();

    const detectedTasks: PreviewTask[] = [];

    if (
      sourceText.includes("school") ||
      sourceText.includes("pickup") ||
      category === "childcare"
    ) {
      detectedTasks.push({
        title: "Pick up Kabir from Green Valley School",
        category: "childcare",
        deadline: "Today, 2:00 PM",
        delegate: "Childcare Delegate",
        confidence: 0.98,
      });
    }

    if (
      sourceText.includes("bruno") ||
      sourceText.includes("pet") ||
      sourceText.includes("feed") ||
      category === "pet_care"
    ) {
      detectedTasks.push({
        title: "Feed Bruno",
        category: "pet_care",
        deadline: "Today, 7:00 PM",
        delegate: "Childcare Delegate",
        confidence: 0.94,
      });
    }

    if (
      sourceText.includes("bill") ||
      sourceText.includes("landlord") ||
      category === "bills"
    ) {
      detectedTasks.push({
        title: "Call landlord about electricity bill",
        category: "bills",
        deadline: "Today, before 5:00 PM",
        delegate: "Finance & Admin Delegate",
        confidence: 0.93,
      });
    }

    if (
      sourceText.includes("medicine") ||
      sourceText.includes("medication") ||
      category === "medication"
    ) {
      detectedTasks.push({
        title: "Confirm existing evening medicine routine",
        category: "medication",
        deadline: "Today, 8:00 PM",
        delegate: "Household Owner",
        confidence: 0.72,
      });
    }

    if (detectedTasks.length === 0) {
      detectedTasks.push({
        title: "Review household note and confirm instructions",
        category,
        deadline: "No deadline detected",
        delegate: "Household Owner",
        confidence: 0.55,
      });
    }

    return detectedTasks;
  }, [note, category]);

  function loadExampleNote() {
    setNote(exampleNote);
    setCategory("childcare");
    setHasPreview(false);
  }

  function handlePreview() {
    if (!note.trim()) {
      return;
    }

    setIsExtracting(true);
    setHasPreview(false);

    window.setTimeout(() => {
      setIsExtracting(false);
      setHasPreview(true);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
            <ShieldCheck className="h-4 w-4" />
            Private demo workspace
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
                <BrainCircuit className="h-4 w-4" />
                Household information intake
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Turn a household note into an emergency-ready plan.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Paste a routine, reminder, bill note, or contact information.
                In the next phase, Gemini will extract tasks, deadlines,
                categories, and possible delegate assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={loadExampleNote}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              <ClipboardPaste className="h-4 w-4" />
              Load example
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileText className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Add a household note
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Use demo data only. Do not enter real medical, banking, or
                  private information in this prototype.
                </p>
              </div>
            </div>

            <label
              htmlFor="household-note"
              className="mt-6 block text-sm font-bold text-slate-800"
            >
              Note content
            </label>

            <textarea
              id="household-note"
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setHasPreview(false);
              }}
              placeholder="Example: Kabir must be picked up from Green Valley School by 2 PM today. Meera is approved as backup pickup contact..."
              className="mt-2 min-h-72 w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            <div className="mt-6">
              <label
                htmlFor="category"
                className="block text-sm font-bold text-slate-800"
              >
                Main category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value as TaskCategory);
                  setHasPreview(false);
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {CATEGORY_LABELS[option.value]}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-slate-500">
                {
                  categoryOptions.find((option) => option.value === category)
                    ?.description
                }
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!note.trim() || isExtracting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isExtracting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Preparing preview...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Preview extraction
                  </>
                )}
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-cyan-100 p-2.5 text-cyan-700">
                  <Lightbulb className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-cyan-950">
                    What AI will do
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-cyan-900">
                    The final Gemini integration will extract clear household
                    tasks, identify deadlines, suggest categories, and flag
                    uncertainty rather than inventing information.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "Extract tasks from unstructured notes",
                  "Identify dates, times, contacts, and categories",
                  "Suggest the appropriate delegate role",
                  "Flag unclear or missing information",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-cyan-950"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                  <TriangleAlert className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="font-black text-amber-950">
                    Prototype safety note
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    This hackathon version uses simulated data. Do not upload
                    real medical records, passwords, banking details, or
                    sensitive personal documents.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </section>

        {hasPreview ? (
          <section className="mt-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  Demo extraction preview
                </div>

                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  Structured tasks detected
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This is placeholder local logic. In the next phase, these
                  values will come from the Gemini API through a secure backend
                  route.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Ready for review
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {previewTasks.map((task) => (
                <article
                  key={`${task.title}-${task.category}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {CATEGORY_LABELS[task.category]}
                    </span>

                    <span className="text-xs font-bold text-emerald-700">
                      {Math.round(task.confidence * 100)}% confidence
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-900">
                    {task.title}
                  </h3>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-bold text-slate-600">Deadline:</dt>
                      <dd className="text-slate-700">{task.deadline}</dd>
                    </div>

                    <div className="flex gap-2">
                      <dt className="font-bold text-slate-600">Suggested:</dt>
                      <dd className="text-slate-700">{task.delegate}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Back to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setHasPreview(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Edit note
              </button>
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
          <UploadCloud className="mx-auto h-7 w-7 text-slate-400" />
          <p className="mt-3 font-bold text-slate-800">
            File upload comes after AI extraction
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            For the first AI integration, we will send pasted text securely to
            Gemini. PDF/image file handling and OCR are optional future
            improvements.
          </p>
        </section>
      </div>
    </main>
  );
}