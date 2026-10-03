"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardPaste,
  FileText,
  Lightbulb,
  LoaderCircle,
  Save,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";

import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import {
  saveTasksForHousehold,
  type NewFirestoreTask,
} from "@/lib/firebase/firestore";
import { getHouseholdForOwner } from "@/lib/firebase/households";
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

type AIExtractedTask = {
  title: string;
  description: string;
  category: TaskCategory;
  priority: number;
  deadlineText: string | null;
  assignedRole:
    | "owner"
    | "childcare_delegate"
    | "finance_delegate"
    | null;
  sensitivity: "normal" | "restricted" | "private";
  confidence: number;
  whyImportant: string;
};

type AIExtractionResult = {
  tasks: AIExtractedTask[];
  missingInformation: string[];
  safetyNote: string;
};

function getRoleLabel(role: AIExtractedTask["assignedRole"]) {
  if (role === "childcare_delegate") {
    return "Childcare Delegate";
  }

  if (role === "finance_delegate") {
    return "Finance & Admin Delegate";
  }

  if (role === "owner") {
    return "Household Owner";
  }

  return "Needs owner review";
}

function UploadContent() {
  const { user } = useAuth();

  const [note, setNote] = useState("");
  const [category, setCategory] = useState<TaskCategory>("childcare");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHousehold, setIsLoadingHousehold] = useState(true);

  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [result, setResult] = useState<AIExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHousehold() {
      if (!user) {
        return;
      }

      try {
        const household = await getHouseholdForOwner(user.uid);

        if (!household) {
          window.location.href = "/onboarding";
          return;
        }

        setHouseholdId(household.id);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to find your household workspace.",
        );
      } finally {
        setIsLoadingHousehold(false);
      }
    }

    void loadHousehold();
  }, [user]);

  function loadExampleNote() {
    setNote(exampleNote);
    setCategory("childcare");
    setResult(null);
    setError(null);
    setSaveMessage(null);
  }

  async function handleExtraction() {
    if (!note.trim()) {
      setError("Please paste a household note before extracting tasks.");
      return;
    }

    setIsExtracting(true);
    setResult(null);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note,
          selectedCategory: category,
        }),
      });

      const responseBody: unknown = await response.json();

      if (!response.ok) {
        const apiError =
          typeof responseBody === "object" &&
          responseBody !== null &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : "The extraction request could not be completed.";

        throw new Error(apiError);
      }

      if (
        typeof responseBody !== "object" ||
        responseBody === null ||
        !("data" in responseBody)
      ) {
        throw new Error("The server returned an unexpected response.");
      }

      setResult(responseBody.data as AIExtractionResult);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while extracting tasks.",
      );
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleSaveTasks() {
    if (!result || !householdId) {
      return;
    }

    if (result.tasks.length === 0) {
      setError("There are no extracted tasks to save.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const tasksToSave: NewFirestoreTask[] = result.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        deadlineText: task.deadlineText,
        assignedRole: task.assignedRole,
        sensitivity: task.sensitivity,
        confidence: task.confidence,
        whyImportant: task.whyImportant,
        status:
          task.confidence < 0.8 ? "needs_confirmation" : "pending",
        sourceName: "Gemini household note extraction",
      }));

      await saveTasksForHousehold(householdId, tasksToSave);

      setSaveMessage(
        `${tasksToSave.length} task${
          tasksToSave.length === 1 ? "" : "s"
        } saved to your household workspace.`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save extracted tasks.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoadingHousehold) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          Loading your household workspace...
        </div>
      </main>
    );
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
            Private household workspace
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
                <BrainCircuit className="h-4 w-4" />
                AI household information intake
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Turn a household note into an emergency-ready plan.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Gemini extracts practical tasks from the text. You review the
                results, then save approved tasks into your private household
                workspace.
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
                setResult(null);
                setError(null);
                setSaveMessage(null);
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
                  setResult(null);
                  setError(null);
                  setSaveMessage(null);
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

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-bold">Action failed</p>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            ) : null}

            {saveMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-bold">Tasks saved</p>
                <p className="mt-1 leading-6">{saveMessage}</p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleExtraction}
                disabled={!note.trim() || isExtracting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isExtracting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Gemini is extracting tasks...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Extract tasks with Gemini
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
                    Review before saving
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-cyan-900">
                    Gemini provides structured decision support. You should
                    verify every task and only save results that are accurate
                    for your household.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "Tasks are extracted only from supplied text",
                  "Deadlines and categories are explicitly displayed",
                  "Low-confidence tasks require confirmation",
                  "Saved tasks belong to your Firebase household",
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
                    Do not upload real medical records, passwords, bank
                    details, government documents, or sensitive personal
                    information.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </section>

        {result ? (
          <section className="mt-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  Gemini extraction complete
                </div>

                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  Review extracted tasks
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These tasks are not saved yet. Review them, then save the
                  approved results to your household workspace.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {result.tasks.length} task
                {result.tasks.length === 1 ? "" : "s"} found
              </span>
            </div>

            {result.tasks.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {result.tasks.map((task, index) => (
                  <article
                    key={`${task.title}-${index}`}
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

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {task.description}
                    </p>

                    <dl className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-bold text-slate-600">Deadline:</dt>
                        <dd className="text-slate-700">
                          {task.deadlineText ?? "No explicit deadline found"}
                        </dd>
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-bold text-slate-600">Suggested:</dt>
                        <dd className="text-slate-700">
                          {getRoleLabel(task.assignedRole)}
                        </dd>
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-bold text-slate-600">Priority:</dt>
                        <dd className="text-slate-700">
                          {task.priority} / 5
                        </dd>
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-bold text-slate-600">
                          Visibility:
                        </dt>
                        <dd className="capitalize text-slate-700">
                          {task.sensitivity}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                        Why this matters
                      </p>
                      <p className="mt-1 text-sm leading-6 text-indigo-950">
                        {task.whyImportant}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                Gemini did not find an explicit actionable task in this note.
              </div>
            )}

            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="h-5 w-5 text-amber-700" />
                  <h3 className="font-black text-amber-950">
                    Missing or unclear information
                  </h3>
                </div>

                {result.missingInformation.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {result.missingInformation.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex gap-2 text-sm leading-6 text-amber-950"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-amber-900">
                    No obvious missing information was identified from this
                    note. Review the note manually before taking action.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-slate-700" />
                  <h3 className="font-black text-slate-900">Safety note</h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {result.safetyNote}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveTasks}
                disabled={
                  isSaving || !householdId || result.tasks.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving tasks...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save approved tasks
                  </>
                )}
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Back to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError(null);
                  setSaveMessage(null);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Extract another note
              </button>
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
          <UploadCloud className="mx-auto h-7 w-7 text-slate-400" />
          <p className="mt-3 font-bold text-slate-800">
            Text-first extraction is active
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            The MVP securely processes pasted text. PDF/image upload and OCR
            are optional next-stage features, after task storage and
            delegate-access rules are complete.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadContent />
    </ProtectedRoute>
  );
}