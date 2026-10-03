import type { Delegate } from "@/types/delegate";
import type { HouseholdTask } from "@/types/task";

export interface Household {
    id: string;
    name: string;
    ownerName: string;
    emergencyModeActive: boolean;
    emergencyMode: "hospitalization" | null;
    delegates: Delegate[];
    tasks: HouseholdTask[];
    missingInformation: string[];
}