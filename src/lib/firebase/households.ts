import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";

export type FirestoreHousehold = {
  ownerId: string;
  name: string;
  emergencyModeActive: boolean;
  activeEmergencyMode: "hospitalization" | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type FirestoreHouseholdDocument = FirestoreHousehold & {
  id: string;
};

export async function createHousehold(
  ownerId: string,
  name: string,
) {
  const householdReference = await addDoc(
    collection(firestore, "households"),
    {
      ownerId,
      name,
      emergencyModeActive: false,
      activeEmergencyMode: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return householdReference;
}

export async function getHouseholdForOwner(
  ownerId: string,
): Promise<FirestoreHouseholdDocument | null> {
  const householdQuery = query(
    collection(firestore, "households"),
    where("ownerId", "==", ownerId),
    limit(1),
  );

  const snapshot = await getDocs(householdQuery);

  if (snapshot.empty) {
    return null;
  }

  const householdDocument = snapshot.docs[0];

  return {
    id: householdDocument.id,
    ...(householdDocument.data() as FirestoreHousehold),
  };
}

export async function getHouseholdById(
  householdId: string,
): Promise<FirestoreHouseholdDocument | null> {
  const householdDocument = await getDoc(
    doc(firestore, "households", householdId),
  );

  if (!householdDocument.exists()) {
    return null;
  }

  return {
    id: householdDocument.id,
    ...(householdDocument.data() as FirestoreHousehold),
  };
}