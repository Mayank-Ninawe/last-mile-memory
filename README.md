# Last Mile Memory

Last Mile Memory is an AI-assisted household continuity workspace for moments when a primary household organizer is unexpectedly unavailable.

It turns unstructured household notes into reviewable emergency tasks, stores approved tasks securely in Firebase, prioritizes them in Emergency Mode, and gives trusted delegates role-limited action boards.

## Problem

When a household organizer is hospitalized or suddenly unavailable, important operational knowledge is often scattered across memory, messages, and informal notes:

- School pickups and caregiver instructions
- Pet feeding and veterinary contacts
- Utility bills and landlord follow-ups
- Important contacts and time-sensitive routines

Family members may need to act quickly while avoiding unnecessary exposure of private information.

## Solution

Last Mile Memory helps households prepare a structured, review-first continuity plan.

1. An owner pastes a household note.
2. Gemini extracts candidate tasks, categories, deadlines, priorities, and uncertainty.
3. The owner reviews results before saving.
4. Tasks persist in Firestore under the household workspace.
5. Emergency Mode prioritizes saved actions and persists completion status.
6. Trusted delegates receive role-limited task views.

## Features

- Firebase Authentication with protected routes
- Household onboarding and persistent Firestore workspaces
- Gemini-powered household-note extraction
- Explicit review before task storage
- Firestore-backed task persistence
- Emergency Mode with persistent active/inactive sessions
- Persistent task completion tracking
- Childcare and finance delegate memberships
- Role-limited delegate task board
- Low-confidence task confirmation indicators

## AI Use

Gemini is used only to convert owner-supplied notes into structured candidate tasks.

The system does not automatically perform irreversible actions. Users review AI output before saving, and lower-confidence tasks are labelled for confirmation.

## Technology

- Next.js
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Google Gemini API
- Vercel

## Architecture

```text
Browser
  ├─ Firebase Auth
  ├─ Firestore
  │   ├─ households
  │   ├─ tasks
  │   ├─ delegates
  │   └─ emergencySessions
  └─ Next.js API route
        └─ Gemini extraction
```

## Local setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   GEMINI_API_KEY=
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Demo accounts

To demonstrate delegation, create two Firebase email/password accounts:

- Owner account: creates household, uploads notes, saves tasks, activates Emergency Mode, and adds delegates.
- Delegate account: is assigned a childcare or finance role and opens `/delegate`.

## Prototype boundaries

- Use demo information only. Do not upload medical records, passwords, banking details, government documents, or sensitive personal information.
- AI output is decision support and must be reviewed before saving or acting.
- The prototype demonstrates role-scoped views. Production deployment should enforce role permissions at the Firestore rules or trusted server layer.
- Email invitation and production-grade delegate verification are future work.

## Hackathon

Built for ForgeHacks Online 2026.