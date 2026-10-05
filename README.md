# Last Mile Memory

**AI-assisted household continuity when the primary organizer is unexpectedly unavailable.**

Last Mile Memory helps households turn scattered notes, routines, and responsibilities into a structured, reviewable emergency action plan. It uses Gemini to extract actionable tasks from owner-provided household notes, stores approved tasks in Firestore, prioritizes them in Emergency Mode, and provides trusted delegates with role-limited action boards.

**Live demo:** [last-mile-memory-85fa.vercel.app](https://last-mile-memory-85fa.vercel.app)  
**Dashboard:** [last-mile-memory-85fa.vercel.app/dashboard](https://last-mile-memory-85fa.vercel.app/dashboard)

---

## Problem

Many households depend on one person to remember critical operational details:

- School pickup times and approved backup caregivers
- Pet feeding routines and veterinary contacts
- Utility bills, rent, landlord follow-ups, and deadlines
- Emergency contacts and service providers
- Important routines that others may not know during a sudden disruption

If the primary household organizer is hospitalized or suddenly unavailable, this knowledge is often fragmented across memory, chats, notes, calendars, and informal documents. Family members may need to act quickly while still protecting private information.

---

## Solution

Last Mile Memory converts unstructured household notes into a structured continuity plan.

```text
Owner signs in
      ↓
Creates a household workspace
      ↓
Pastes a household note
      ↓
Gemini extracts candidate tasks
      ↓
Owner reviews before saving
      ↓
Approved tasks persist in Firestore
      ↓
Emergency Mode prioritizes actions
      ↓
Trusted delegates receive role-limited task views
```

The system is designed as **review-first AI decision support**. Gemini suggests structured tasks, but the owner reviews results before anything is saved or acted upon.

---

## Features

### Household workspace

- Firebase Authentication with email/password signup and login
- Protected routes for authenticated users
- Persistent household onboarding
- User profile records stored under Firestore `users`
- Household ownership linked to the Firebase Auth UID

### Gemini task extraction

- Paste a household note into the application
- Gemini extracts structured candidate tasks
- Each task includes:
  - Title
  - Description
  - Category
  - Priority
  - Deadline text
  - Suggested delegate role
  - Sensitivity level
  - Confidence score
  - Why the task matters
- Missing AI fields are normalized safely before validation
- Low-confidence tasks are marked as requiring confirmation
- Owners review extraction results before saving

### Persistent Firestore tasks

- Approved Gemini tasks are stored in Cloud Firestore
- Tasks remain available after refresh and future logins
- Dashboard loads real household-specific task data
- Task records include household ownership, category, priority, status, confidence, and source metadata

### Emergency Mode

- Firestore-backed emergency session activation
- Active emergency state persists after page refresh
- Saved household tasks are sorted by urgency and priority
- Tasks can be marked complete
- Completion state persists in Firestore
- Completed tasks can be reopened if needed
- Low-confidence tasks are visibly flagged for confirmation

### Delegated household access

- Owners can add trusted delegates
- Supported MVP roles:
  - Childcare Delegate
  - Finance & Admin Delegate
- Childcare delegates can view:
  - Childcare tasks
  - Pet-care tasks
  - Emergency-contact tasks
- Finance delegates can view:
  - Bills tasks
  - Emergency-contact tasks
- Delegates use a dedicated `/delegate` action board
- Task completion is shared back to the owner’s household workspace

---

## How it works

### Owner workflow

1. Create an account or sign in.
2. Create a household workspace.
3. Open the household-note upload page.
4. Paste a demo household note.
5. Run Gemini extraction.
6. Review tasks, confidence, deadlines, and safety notes.
7. Save approved tasks to Firestore.
8. View the saved tasks in the dashboard.
9. Activate Emergency Mode if household continuity is needed.
10. Mark verified actions as completed.

### Delegate workflow

1. A trusted person creates a Firebase email/password account.
2. The household owner adds that Firebase user as a delegate.
3. The owner assigns either the childcare or finance role.
4. The delegate signs in and opens `/delegate`.
5. The delegate sees only the categories permitted for their role.
6. The delegate can mark permitted tasks complete.

---

## Example household note

```text
School pickup:
Kabir Sharma must be picked up from Green Valley School by 2:00 PM today.
Approved backup pickup contact: Meera Sharma.
School office: +91 98765 00123.

Pet care:
Bruno must be fed at 7:00 PM. Food is in the top kitchen cabinet.
Emergency veterinary contact: City Pet Clinic.

Bills:
Call the landlord before 5:00 PM today to confirm electricity bill payment instructions.
The electricity bill is due tomorrow.
```

Gemini can convert this into reviewable childcare, pet-care, bill, and emergency-contact tasks.

---

## Technology stack

| Area | Technology |
|---|---|
| Frontend | Next.js, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| AI extraction | Google Gemini API |
| Validation | Zod |
| Deployment | Vercel |
| Source control | GitHub |

---

## Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         Next.js Frontend                        │
│                                                               │
│  Landing │ Signup │ Login │ Onboarding │ Dashboard │ Upload   │
│           Emergency Mode │ Delegates │ Delegate Board          │
└───────────────────────┬───────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
┌───────────────────────┐   ┌────────────────────────────┐
│ Firebase Authentication│   │      Next.js API Route      │
│                       │   │   /api/ai/extract           │
│ Email/password users  │   │                              │
└───────────┬───────────┘   │ Server-side Gemini API call  │
            │               └──────────────┬───────────────┘
            │                              │
            ▼                              ▼
┌───────────────────────────────────────────────────────────────┐
│                         Cloud Firestore                         │
│                                                               │
│ users              User profile documents                      │
│ households         Owner household workspaces                  │
│ tasks              Gemini-extracted approved tasks             │
│ delegates          Trusted delegate memberships                 │
│ emergencySessions  Persistent Emergency Mode state             │
└───────────────────────────────────────────────────────────────┘
```

---

## Firestore data model

### `users/{userId}`

```ts
{
  fullName: string;
  email: string;
  createdAt: Timestamp;
}
```

### `households/{householdId}`

```ts
{
  ownerId: string;
  name: string;
  emergencyModeActive: boolean;
  activeEmergencyMode: "hospitalization" | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `tasks/{taskId}`

```ts
{
  householdId: string;
  title: string;
  description: string;
  category:
    | "childcare"
    | "pet_care"
    | "bills"
    | "medication"
    | "emergency_contact";
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
  status: "pending" | "completed" | "needs_confirmation";
  sourceName: string;
  createdAt: Timestamp;
  completedAt?: Timestamp | null;
}
```

### `delegates/{delegateId}`

```ts
{
  householdId: string;
  userId: string;
  displayName: string;
  role: "childcare_delegate" | "finance_delegate";
  createdAt: Timestamp;
}
```

### `emergencySessions/{sessionId}`

```ts
{
  householdId: string;
  status: "active" | "inactive";
  activatedByUserId: string;
  activatedAt: Timestamp;
  deactivatedAt?: Timestamp;
}
```

---

## AI safety and responsible use

Last Mile Memory treats AI as **decision support**, not autonomous authority.

- Gemini processes only owner-supplied text.
- The owner reviews extracted tasks before saving.
- The app displays task confidence and missing/unclear information.
- Lower-confidence tasks are marked for confirmation.
- The prototype does not automatically send messages, make payments, administer medication, or perform other irreversible actions.
- Users should verify household instructions before acting.
- Do not use real medical records, passwords, bank details, government documents, or highly sensitive personal data in this prototype.

---

## Privacy and access boundaries

The MVP demonstrates role-scoped delegate views:

| Role | Permitted task categories |
|---|---|
| Household Owner | All tasks in the household workspace |
| Childcare Delegate | Childcare, pet care, emergency contact |
| Finance & Admin Delegate | Bills, emergency contact |

### Prototype limitation

The delegate experience is role-filtered in the application. A production version should further harden least-privilege access by enforcing role-specific task visibility directly in Firestore Security Rules, through explicit per-task access lists, custom claims, or a trusted server-side authorization layer.

The prototype intentionally avoids storing real sensitive household information.

---

## Local setup

### Prerequisites

- Node.js 18 or later
- npm
- Firebase project with:
  - Firebase Authentication enabled
  - Email/Password authentication enabled
  - Cloud Firestore created
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Mayank-Ninawe/last-mile-memory
cd last-mile-memory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a file named:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Run production build

```bash
npm run build
npm start
```

---

## Firebase configuration

### Enable authentication

In Firebase Console:

```text
Authentication
→ Sign-in method
→ Email/Password
→ Enable
```

### Configure Firestore rules

Deploy or publish the project’s Firestore Security Rules.

The rules should protect:

- User profiles so users access only their own `users/{uid}` document
- Households so only owners access their household
- Tasks so household owners access their household tasks
- Delegates so owners manage memberships and delegates can read their own membership
- Emergency sessions so only authorized household owners manage the session

### Add authorized domains

For Vercel deployment, add the production hostname in:

```text
Firebase Console
→ Authentication
→ Settings
→ Authorized domains
```

Example:

```text
last-mile-memory-85fa.vercel.app
```

Do not include `https://` or a trailing slash.

---

## Vercel deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Confirm Vercel detects **Next.js**.
4. Add all Firebase public variables from `.env.local`.
5. Add `GEMINI_API_KEY` as a server-side variable.
6. Select Production, Preview, and Development environments as needed.
7. Deploy.
8. Add the Vercel domain to Firebase Authentication Authorized Domains.
9. Test signup, onboarding, Gemini extraction, task persistence, Emergency Mode, and delegates on the deployed app.

### Environment variable security

Variables beginning with `NEXT_PUBLIC_` are intentionally available to browser-side Firebase initialization.

Never use:

```env
NEXT_PUBLIC_GEMINI_API_KEY=...
```

Keep the Gemini key server-side only:

```env
GEMINI_API_KEY=...
```

---

## Demo flow

For a complete demonstration:

```text
1. Owner signs in
2. Owner creates a household
3. Owner pastes a demo household note
4. Gemini extracts structured task candidates
5. Owner reviews and saves approved tasks
6. Dashboard loads real Firestore tasks
7. Emergency Mode prioritizes active tasks
8. Owner marks a task complete
9. Completion persists after refresh
10. Owner creates a trusted delegate
11. Delegate signs in
12. Delegate sees only permitted task categories
```

---

## Future improvements

- Email-based delegate invitations
- Production-grade role enforcement in Firestore rules
- Explicit task-level access control lists
- Audit log for task completion and emergency-session activity
- PDF/image upload with OCR
- Document encryption and secret-management improvements
- Notifications for trusted delegates
- Configurable task categories and custom roles
- Emergency contact communication workflows
- Household readiness recommendations

---

## Built for

Built for **ForgeHacks Online 2026**.

Last Mile Memory demonstrates how AI can transform fragmented household knowledge into a practical, reviewable, privacy-aware continuity plan during moments when families need clarity most.