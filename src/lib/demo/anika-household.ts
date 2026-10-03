import type { Household } from "@/types/household";

export const anikaHousehold: Household = {
    id: "household-anika-001",
    name: "Anika Sharma's Home",
    ownerName: "Anika Sharma",
    emergencyModeActive: true,
    emergencyMode: "hospitalization",

    delegates: [
        {
            id: "delegate-meera-001",
            name: "Meera Sharma",
            relationship: "Sister",
            role: "childcare_delegate",
            allowedCategories: ["childcare", "pet_care", "emergency_contact"],
            phone: "+91 98765 43210",
            isActive: true,
        },
        {
            id: "delegate-rohan-001",
            name: "Rohan Sharma",
            relationship: "Uncle",
            role: "finance_delegate",
            allowedCategories: ["bills", "emergency_contact"],
            phone: "+91 98765 43211",
            isActive: true,
        },
    ],

    tasks: [
        {
            id: "task-school-pickup",
            title: "Pick up Kabir from Green Valley School",
            description:
                "Kabir must be picked up from the school gate before pickup closes.",
            category: "childcare",
            priority: 5,
            deadline: "Today, 2:00 PM",
            assignedRole: "childcare_delegate",
            sourceName: "School Pickup Routine",
            whyImportant:
                "Kabir's pickup window closes soon, and Anika is unavailable.",
            confidence: 0.98,
            status: "pending",
        },
        {
            id: "task-call-meera",
            title: "Confirm backup childcare with Meera",
            description:
                "Call Meera Sharma to confirm she can take responsibility for Kabir after school.",
            category: "childcare",
            priority: 4,
            deadline: "Today, 12:30 PM",
            assignedRole: "childcare_delegate",
            sourceName: "Emergency Contacts Note",
            whyImportant:
                "A backup caregiver must be confirmed before school pickup.",
            confidence: 0.96,
            status: "pending",
        },
        {
            id: "task-feed-bruno",
            title: "Feed Bruno",
            description:
                "Give Bruno his evening meal from the top kitchen cabinet.",
            category: "pet_care",
            priority: 3,
            deadline: "Today, 7:00 PM",
            assignedRole: "childcare_delegate",
            sourceName: "Pet Care Routine",
            whyImportant:
                "Bruno's feeding routine should continue while Anika is unavailable.",
            confidence: 0.94,
            status: "pending",
        },
        {
            id: "task-electricity-bill",
            title: "Review electricity bill due tomorrow",
            description:
                "Contact the landlord before 5:00 PM to confirm the approved payment route.",
            category: "bills",
            priority: 3,
            deadline: "Tomorrow",
            assignedRole: "finance_delegate",
            sourceName: "Electricity Bill Note",
            whyImportant:
                "Late payment could affect essential household services.",
            confidence: 0.91,
            status: "pending",
        },
        {
            id: "task-call-landlord",
            title: "Call landlord before 5:00 PM",
            description:
                "Ask the landlord for electricity bill payment instructions and confirmation.",
            category: "bills",
            priority: 4,
            deadline: "Today, 5:00 PM",
            assignedRole: "finance_delegate",
            sourceName: "Electricity Bill Note",
            whyImportant:
                "The landlord needs to confirm the correct payment process.",
            confidence: 0.93,
            status: "pending",
        },
        {
            id: "task-grandmother-medication",
            title: "Confirm grandmother's evening medicine",
            description:
                "Confirm that grandmother has access to her already prescribed evening medicine.",
            category: "medication",
            priority: 4,
            deadline: "Today, 8:00 PM",
            assignedRole: "owner",
            sourceName: "Medication Routine Note",
            whyImportant:
                "The medicine routine needs confirmation during the emergency.",
            confidence: 0.72,
            status: "needs_confirmation",
        },
        {
            id: "task-vet-contact",
            title: "Keep City Pet Clinic contact available",
            description:
                "City Pet Clinic is Bruno's listed emergency veterinary contact.",
            category: "emergency_contact",
            priority: 2,
            deadline: null,
            assignedRole: "childcare_delegate",
            sourceName: "Pet Care Routine",
            whyImportant:
                "A verified vet contact is needed if Bruno has an emergency.",
            confidence: 0.9,
            status: "pending",
        },
    ],

    missingInformation: [
        "School pickup authorization document has not been uploaded.",
        "Electricity bill payment method is not saved.",
        "Grandmother's medicine instructions need confirmation from an authorized adult.",
    ],
};