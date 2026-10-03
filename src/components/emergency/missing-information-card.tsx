import { CircleAlert, FileWarning } from "lucide-react";

interface MissingInformationCardProps {
  items: string[];
}

export function MissingInformationCard({
  items,
}: MissingInformationCardProps) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
          <FileWarning className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-amber-950">
            Missing or unverified information
          </h2>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Review these items before relying on them in an emergency.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-xl border border-amber-200 bg-white/70 p-3 text-sm leading-6 text-amber-950"
          >
            <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}