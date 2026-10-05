"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  LoaderCircle,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { firebaseAuth, firestore } from "@/lib/firebase/client";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        fullName: fullName.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      router.replace("/onboarding");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create your account.";

      if (message.includes("auth/email-already-in-use")) {
        setError("An account already exists with this email address.");
      } else if (message.includes("auth/invalid-email")) {
        setError("Please enter a valid email address.");
      } else if (message.includes("auth/weak-password")) {
        setError("Choose a stronger password with at least 6 characters.");
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
            <UserPlus className="h-6 w-6" />
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
            Create your household workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start preparing essential household routines, trusted contacts, and
            continuity plans before an emergency happens.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="full-name"
                className="text-sm font-bold text-slate-800"
              >
                Full name
              </label>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-800"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-bold text-slate-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-indigo-900">
              <ShieldCheck className="h-4 w-4" />
              Prototype safety reminder
            </p>
            <p className="mt-2 text-sm leading-6 text-indigo-800">
              Use a test email and demo household information only. Do not add
              real medical, banking, password, or private family data.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-700 hover:text-indigo-900"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}