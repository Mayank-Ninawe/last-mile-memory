import type { DelegateRole } from "@/types/delegate";
import type { TaskCategory } from "@/types/task";

export const ROLE_LABELS: Record<DelegateRole, string> = {
    owner: "Household Owner",
    childcare_delegate: "Childcare Delegate",
    finance_delegate: "Finance & Admin Delegate",
};

export const ROLE_ALLOWED_CATEGORIES: Record<
    DelegateRole,
    TaskCategory[]
> = {
    owner: [
        "childcare",
        "pet_care",
        "bills",
        "medication",
        "emergency_contact",
    ],
    childcare_delegate: [
        "childcare",
        "pet_care",
        "emergency_contact",
    ],
    finance_delegate: ["bills", "emergency_contact"],
};