import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";

export type FirestoreTaskCategory =
  | "childcare"
  | "pet_care"
  | "bills"
  | "medication"
  | "emergency_contact";

export type FirestoreDelegateRole =
  | "owner"
  | "childcare_delegate"
  | "finance_delegate";

export type FirestoreTaskStatus =
  | "pending"
  | "completed"
  | "needs_confirmation";

export type FirestoreTask = {
  householdId: string;
  title: string;
  description: string;
  category: FirestoreTaskCategory;
  priority: number;
  deadlineText: string | null;
  assignedRole: FirestoreDelegateRole | null;
  sensitivity: "normal" | "restricted" | "private";
  confidence: number;
  whyImportant: string;
  status: FirestoreTaskStatus;
  sourceName: string;
  createdAt?: unknown;
  completedAt?: unknown;
};

export type NewFirestoreTask = Omit<
  FirestoreTask,
  "householdId" | "createdAt" | "completedAt"
>;

export async function saveTask(task: FirestoreTask) {
  return addDoc(collection(firestore, "tasks"), {
    ...task,
    createdAt: serverTimestamp(),
  });
}

export async function saveTasksForHousehold(
  householdId: string,
  tasks: NewFirestoreTask[],
) {
  const batch = writeBatch(firestore);

  tasks.forEach((task) => {
    const taskReference = doc(collection(firestore, "tasks"));

    batch.set(taskReference, {
      ...task,
      householdId,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export async function getTasksForHousehold(householdId: string) {
  const tasksQuery = query(
    collection(firestore, "tasks"),
    where("householdId", "==", householdId),
  );

  const snapshot = await getDocs(tasksQuery);

  return snapshot.docs
    .map((taskDocument) => ({
      id: taskDocument.id,
      ...taskDocument.data(),
    }))
    .sort((firstTask, secondTask) => {
      const firstPriority =
        typeof firstTask.priority === "number" ? firstTask.priority : 0;

      const secondPriority =
        typeof secondTask.priority === "number" ? secondTask.priority : 0;

      return secondPriority - firstPriority;
    });
}

export async function markTaskCompleted(taskId: string) {
  return updateDoc(doc(firestore, "tasks", taskId), {
    status: "completed",
    completedAt: serverTimestamp(),
  });
}

export async function getTaskById(taskId: string) {
  const taskDocument = await getDoc(doc(firestore, "tasks", taskId));

  if (!taskDocument.exists()) {
    return null;
  }

  return {
    id: taskDocument.id,
    ...taskDocument.data(),
  };
}