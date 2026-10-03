import {
  addDoc,
  collection,
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

export async function createHousehold(
  household: FirestoreHousehold,
) {
  return addDoc(collection(firestore, "households"), {
    ...household,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getHouseholdForOwner(ownerId: string) {
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
    ...householdDocument.data(),
  };
}