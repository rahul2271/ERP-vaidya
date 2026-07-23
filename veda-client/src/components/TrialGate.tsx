"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "@/utils/axiosConfig";
import Link from "next/link";
import { Sparkles, Lock, ArrowRight, X } from "lucide-react";

interface PlanStatus {
  subscriptionStatus: string;
  plan: string;
  trialEndsAt: string | null;
  daysLeft: number;
  isBlocked: boolean;
}

export default function TrialGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<PlanStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role")?.toUpperCase();
    // Super Admin manages every hospital's plan — this gate is for hospital-side
    // roles only, so it never blocks the person who runs the platform.
    if (role === "SUPER_ADMIN") return;

    axios.get("/hospitals/my-plan")
      .then(res => setStatus(res.data))
      .catch(() => { /* fail open — don't block the UI if this check fails */ });
  }, [pathname]);

  const isUpgradePage = pathname === "/dashboard/upgrade";

  if (status?.isBlocked && !isUpgradePage) {
    return (
      <div className="fixed inset-0 z-[200] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock size={24} className="text-amber-600" />
          </div>
          <h2 className="font-display text-xl font-bold text-ink-900 mb-2">Your trial has ended</h2>
          <p className="text-sm text-ink-500 mb-6 leading-relaxed">
            Your 15-day Premium trial is over. Choose a plan to keep your team, patients, and data active — nothing is deleted while you decide.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
          >
            Choose a plan <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {status?.subscriptionStatus === "TRIALING" && !dismissed && !isUpgradePage && (
        <div className="bg-primary-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={15} className="shrink-0" />
            <span className="truncate">
              <strong>{status.daysLeft} day{status.daysLeft === 1 ? "" : "s"}</strong> left in your Premium trial.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard/upgrade" className="font-semibold underline underline-offset-2 hover:no-underline">
              Upgrade now
            </Link>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
              <X size={15} />
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
