import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";

export type FirestoreDelegateRole =
  | "childcare_delegate"
  | "finance_delegate";

export type FirestoreDelegate = {
  householdId: string;
  userId: string;
  role: FirestoreDelegateRole;
  displayName: string;
  createdAt?: unknown;
};

export type FirestoreDelegateDocument = FirestoreDelegate & {
  id: string;
};

export async function getDelegatesForHousehold(
  householdId: string,
): Promise<FirestoreDelegateDocument[]> {
  const delegatesQuery = query(
    collection(firestore, "delegates"),
    where("householdId", "==", householdId),
  );

  const snapshot = await getDocs(delegatesQuery);

  return snapshot.docs.map((delegateDocument) => ({
    id: delegateDocument.id,
    ...(delegateDocument.data() as FirestoreDelegate),
  }));
}

export async function getDelegateMembershipForUser(
  userId: string,
): Promise<FirestoreDelegateDocument | null> {
  const membershipQuery = query(
    collection(firestore, "delegates"),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(membershipQuery);

  if (snapshot.empty) {
    return null;
  }

  const delegateDocument = snapshot.docs[0];

  return {
    id: delegateDocument.id,
    ...(delegateDocument.data() as FirestoreDelegate),
  };
}

export async function createDelegate(
  householdId: string,
  userId: string,
  displayName: string,
  role: FirestoreDelegateRole,
) {
  return addDoc(collection(firestore, "delegates"), {
    householdId,
    userId,
    displayName,
    role,
    createdAt: serverTimestamp(),
  });
}