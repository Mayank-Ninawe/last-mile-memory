import { Activity, ShieldAlert } from "lucide-react";

interface EmergencyBannerProps {
  ownerName: string;
  mode: string;
}

export function EmergencyBanner({ ownerName, mode }: EmergencyBannerProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-linear-to-br from-rose-600 via-red-600 to-orange-500 p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            <Activity className="h-4 w-4" />
            Emergency mode active
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {ownerName} is currently unavailable
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-50 sm:text-base">
            {mode} mode is active. Complete urgent tasks, verify uncertain
            information, and only access the information you are authorized to
            view.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium">
          <ShieldAlert className="h-5 w-5" />
          Privacy protected
        </div>
      </div>
    </section>
  );
}