"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  Plus,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import { LogoutButton } from "@/components/providers/logout-button";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import {
  createDelegate,
  getDelegatesForHousehold,
  type FirestoreDelegateDocument,
  type FirestoreDelegateRole,
} from "@/lib/firebase/delegates";
import { getHouseholdForOwner } from "@/lib/firebase/households";

function getRoleLabel(role: FirestoreDelegateRole) {
  return role === "childcare_delegate"
    ? "Childcare Delegate"
    : "Finance & Admin Delegate";
}

function getRoleDescription(role: FirestoreDelegateRole) {
  return role === "childcare_delegate"
    ? "Can later view child-care, school, and approved pickup tasks."
    : "Can later view bills, landlord, and finance administration tasks.";
}

function DelegatesContent() {
  const { user } = useAuth();

  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [householdName, setHouseholdName] = useState("Your household");
  const [delegates, setDelegates] = useState<FirestoreDelegateDocument[]>([]);
  const [delegateUid, setDelegateUid] = useState("");
  const [delegateName, setDelegateName] = useState("");
  const [delegateRole, setDelegateRole] =
    useState<FirestoreDelegateRole>("childcare_delegate");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDelegates() {
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

        const householdDelegates = await getDelegatesForHousehold(household.id);

        setHouseholdId(household.id);
        setHouseholdName(household.name);
        setDelegates(householdDelegates);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load household delegates.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDelegates();
  }, [user]);

  async function handleCreateDelegate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!householdId) {
      return;
    }

    if (!delegateUid.trim() || !delegateName.trim()) {
      setError("Enter both the delegate name and Firebase Auth UID.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const existingDelegate = delegates.find(
        (delegate) => delegate.userId === delegateUid.trim(),
      );

      if (existingDelegate) {
        throw new Error("This Firebase user is already a household delegate.");
      }

      const delegateReference = await createDelegate(
        householdId,
        delegateUid.trim(),
        delegateName.trim(),
        delegateRole,
      );

      const createdDelegate: FirestoreDelegateDocument = {
        id: delegateReference.id,
        householdId,
        userId: delegateUid.trim(),
        displayName: delegateName.trim(),
        role: delegateRole,
      };

      setDelegates((currentDelegates) => [
        ...currentDelegates,
        createdDelegate,
      ]);

      setSuccessMessage(
        `${createdDelegate.displayName} was added as a ${getRoleLabel(
          createdDelegate.role,
        )}.`,
      );
      setDelegateUid("");
      setDelegateName("");
      setDelegateRole("childcare_delegate");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add the delegate.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          Loading household delegates...
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

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              Owner controls
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-cyan-800 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-cyan-100">
                <UsersRound className="h-4 w-4" />
                Least-privilege delegation
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Household delegates
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Add trusted people to {householdName}. In the next phase,
                each delegate will receive only the task categories required
                for their role.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white">
              <ShieldCheck className="h-4 w-4" />
              Owner-managed access
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={handleCreateDelegate}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <UserRoundPlus className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Add a delegate
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The delegate must create a Firebase account first. Use their
                  Firebase Authentication UID for this MVP.
                </p>
              </div>
            </div>

            <label
              htmlFor="delegate-name"
              className="mt-6 block text-sm font-bold text-slate-800"
            >
              Delegate display name
            </label>

            <input
              id="delegate-name"
              value={delegateName}
              onChange={(event) => setDelegateName(event.target.value)}
              placeholder="Example: Meera Sharma"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            <label
              htmlFor="delegate-uid"
              className="mt-5 block text-sm font-bold text-slate-800"
            >
              Firebase Auth UID
            </label>

            <input
              id="delegate-uid"
              value={delegateUid}
              onChange={(event) => setDelegateUid(event.target.value)}
              placeholder="Example: A1b2C3d4..."
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            <label
              htmlFor="delegate-role"
              className="mt-5 block text-sm font-bold text-slate-800"
            >
              Delegate role
            </label>

            <select
              id="delegate-role"
              value={delegateRole}
              onChange={(event) =>
                setDelegateRole(
                  event.target.value as FirestoreDelegateRole,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="childcare_delegate">Childcare Delegate</option>
              <option value="finance_delegate">
                Finance & Admin Delegate
              </option>
            </select>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {getRoleDescription(delegateRole)}
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-bold">Unable to save delegate</p>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-bold">Delegate added</p>
                <p className="mt-1 leading-6">{successMessage}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:bg-slate-300"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Adding delegate...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add household delegate
                </>
              )}
            </button>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700">
                <UsersRound className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Current delegates
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  These memberships are stored in Firestore and will control
                  the filtered delegate action board.
                </p>
              </div>
            </div>

            {delegates.length > 0 ? (
              <div className="mt-6 space-y-3">
                {delegates.map((delegate) => (
                  <article
                    key={delegate.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {delegate.displayName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {getRoleDescription(delegate.role)}
                        </p>
                      </div>

                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                        {getRoleLabel(delegate.role)}
                      </span>
                    </div>

                    <p className="mt-3 break-all rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-500">
                      UID: {delegate.userId}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <UsersRound className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-bold text-slate-800">
                  No delegates yet
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Add one childcare or finance delegate to demonstrate
                  privacy-aware emergency coordination.
                </p>
              </div>
            )}
          </section>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-black text-amber-950">
                MVP access boundary
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900">
                This phase stores delegate membership. The next phase applies
                role-based task filtering in the delegate dashboard. For a
                production app, replace UID entry with email invitations and
                enforce household membership checks directly in Firestore rules.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DelegatesPage() {
  return (
    <ProtectedRoute>
      <DelegatesContent />
    </ProtectedRoute>
  );
}