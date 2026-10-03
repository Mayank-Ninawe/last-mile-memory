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
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";

export type FirestoreTask = {
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
  assignedRole: "owner" | "childcare_delegate" | "finance_delegate" | null;
  sensitivity: "normal" | "restricted" | "private";
  confidence: number;
  whyImportant: string;
  status: "pending" | "completed" | "needs_confirmation";
  createdAt?: unknown;
  completedAt?: unknown;
};

export async function saveTask(task: FirestoreTask) {
  return addDoc(collection(firestore, "tasks"), {
    ...task,
    createdAt: serverTimestamp(),
  });
}

export async function getTasksForHousehold(householdId: string) {
  const tasksQuery = query(
    collection(firestore, "tasks"),
    where("householdId", "==", householdId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(tasksQuery);

  return snapshot.docs.map((taskDocument) => ({
    id: taskDocument.id,
    ...taskDocument.data(),
  }));
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