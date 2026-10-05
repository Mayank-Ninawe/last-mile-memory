"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import {
  createHousehold,
  getHouseholdForOwner,
} from "@/lib/firebase/households";

function OnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [householdName, setHouseholdName] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingHousehold() {
      if (!user) {
        return;
      }

      try {
        const existingHousehold = await getHouseholdForOwner(user.uid);

        if (existingHousehold) {
          router.replace("/dashboard");
          return;
        }

        const firstName = user.displayName?.split(" ")[0];

        if (firstName) {
          setHouseholdName(`${firstName}'s Household`);
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to check your household workspace.",
        );
      } finally {
        setIsChecking(false);
      }
    }

    void checkExistingHousehold();
  }, [router, user]);

  async function handleCreateHousehold(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (householdName.trim().length < 2) {
      setError("Please enter a household name.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createHousehold(user.uid, householdName.trim());

      router.replace("/dashboard");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create your household.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          Preparing your household workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
            <Home className="h-6 w-6" />
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Step 1 of 3
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              Create your household workspace
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              This workspace holds your emergency-ready routines, trusted
              people, household notes, and AI-extracted action plans.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleCreateHousehold}>
            <div>
              <label
                htmlFor="household-name"
                className="text-sm font-bold text-slate-800"
              >
                Household name
              </label>

              <input
                id="household-name"
                type="text"
                value={householdName}
                onChange={(event) => {
                  setHouseholdName(event.target.value);
                  setError(null);
                }}
                placeholder="Example: Anika Sharma's Home"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />

              <p className="mt-2 text-sm text-slate-500">
                Use a demo household name for the hackathon prototype.
              </p>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating household...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create household workspace
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-indigo-900">
              <ShieldCheck className="h-4 w-4" />
              Privacy design
            </p>

            <p className="mt-2 text-sm leading-6 text-indigo-800">
              Your household document is associated with your Firebase user ID.
              Firestore rules prevent other signed-in users from reading or
              editing it.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}