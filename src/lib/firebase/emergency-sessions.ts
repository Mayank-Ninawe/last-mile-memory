import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";

export type FirestoreEmergencySessionStatus = "active" | "inactive";

export type FirestoreEmergencySession = {
  householdId: string;
  status: FirestoreEmergencySessionStatus;
  activatedByUserId: string;
  activatedAt?: unknown;
  deactivatedAt?: unknown;
};

export type FirestoreEmergencySessionDocument = FirestoreEmergencySession & {
  id: string;
};

export async function getActiveEmergencySession(
  householdId: string,
): Promise<FirestoreEmergencySessionDocument | null> {
  const sessionsQuery = query(
    collection(firestore, "emergencySessions"),
    where("householdId", "==", householdId),
    where("status", "==", "active"),
    limit(1),
  );

  const snapshot = await getDocs(sessionsQuery);

  if (snapshot.empty) {
    return null;
  }

  const sessionDocument = snapshot.docs[0];

  return {
    id: sessionDocument.id,
    ...(sessionDocument.data() as FirestoreEmergencySession),
  };
}

export async function activateEmergencySession(
  householdId: string,
  activatedByUserId: string,
) {
  const existingSession = await getActiveEmergencySession(householdId);

  if (existingSession) {
    return existingSession;
  }

  const sessionReference = await addDoc(
    collection(firestore, "emergencySessions"),
    {
      householdId,
      status: "active",
      activatedByUserId,
      activatedAt: serverTimestamp(),
    },
  );

  return {
    id: sessionReference.id,
    householdId,
    status: "active" as const,
    activatedByUserId,
  };
}

export async function deactivateEmergencySession(sessionId: string) {
  return updateDoc(doc(firestore, "emergencySessions", sessionId), {
    status: "inactive",
    deactivatedAt: serverTimestamp(),
  });
}