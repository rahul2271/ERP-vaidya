"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import {
  CreditCard, TrendingUp, Zap, Building2, RefreshCw, Crown, ArrowRightLeft, ShieldCheck, Lock
} from "lucide-react";

export default function SubscriptionsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role")?.toUpperCase();
    if (role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
      return;
    }
    setIsAuthorized(true);
    fetchHospitals();
  }, [router]);

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/hospitals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(res.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
      toast.error("Couldn't load tenant list.");
    } finally {
      setLoading(false);
    }
  };

  // This is an internal admin control, not a customer checkout — Super Admin can
  // set a hospital's plan directly in either direction. (Billing/payment collection,
  // if any, happens outside this screen — this just grants or revokes access.)
  const handleChangePlan = async (hospitalId: string, currentPlan: string, hospitalName: string) => {
    const goingTo = currentPlan === 'PREMIUM' ? 'BASIC' : 'PREMIUM';
    const confirmMsg = goingTo === 'BASIC'
      ? `Downgrade ${hospitalName} to Basic? They'll lose access to premium features immediately.`
      : `Upgrade ${hospitalName} to Premium? This grants access immediately — make sure payment has been arranged separately.`;

    if (!window.confirm(confirmMsg)) return;
    await processPlanUpdate(hospitalId, goingTo, hospitalName);
  };

  const processPlanUpdate = async (hospitalId: string, newPlan: string, hospitalName: string) => {
    setUpdating(hospitalId);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/hospitals/${hospitalId}`, { plan: newPlan }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(prev => prev.map(h => h._id === hospitalId ? { ...h, plan: newPlan } : h));
      toast.success(`${hospitalName} is now on the ${newPlan} plan.`);
    } catch (error: any) {
      console.error("Plan update failed:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Failed to update plan. Check console for details.");
    } finally {
      setUpdating(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F6F9F8] flex flex-col items-center justify-center text-ink-400">
        <Lock size={40} className="mb-4 opacity-30" />
        <h2 className="text-base font-semibold text-ink-600">Access denied</h2>
        <p className="text-sm mt-1">Redirecting…</p>
      </div>
    );
  }

  const totalPremium = hospitals.filter(h => h.plan === 'PREMIUM').length;
  const totalBasic = hospitals.filter(h => h.plan === 'BASIC' || !h.plan).length;
  const mrr = (totalPremium * 5999) + (totalBasic * 2499);

  if (loading && hospitals.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6 animate-pulse bg-[#F6F9F8] min-h-screen">
        <div className="h-16 bg-ink-100 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-ink-100 rounded-2xl" />)}
        </div>
        <div className="h-[420px] bg-ink-100 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9F8] p-6 md:p-10 text-ink-800 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header — plain, no gradient text, no fake "gateway" status */}
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
            <CreditCard size={22} className="text-primary-600" strokeWidth={2} />
            Subscriptions
          </h1>
          <p className="text-sm text-ink-500 mt-1">Manage each clinic's plan. Changes take effect immediately.</p>
        </div>

        {/* Metrics — three plain cards, one accent each, no glow/blur decoration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-ink-100">
            <div className="flex items-center gap-2.5 text-amber-600 mb-3">
              <Crown size={16} strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Premium tenants</span>
            </div>
            <p className="text-3xl font-bold text-ink-900">{totalPremium}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ink-100">
            <div className="flex items-center gap-2.5 text-ink-500 mb-3">
              <ShieldCheck size={16} strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Basic tenants</span>
            </div>
            <p className="text-3xl font-bold text-ink-900">{totalBasic}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ink-100">
            <div className="flex items-center gap-2.5 text-primary-600 mb-3">
              <TrendingUp size={16} strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Est. monthly revenue</span>
            </div>
            <p className="text-3xl font-bold text-ink-900">₹{mrr.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Tenant table */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="p-5 border-b border-ink-100">
            <h3 className="font-semibold text-ink-900 flex items-center gap-2 text-sm">
              <Building2 size={16} className="text-ink-400" /> All clinics
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink-100 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
                  <th className="p-4 pl-6">Clinic</th>
                  <th className="p-4 text-center">Plan</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {hospitals.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-16 text-center text-ink-400">
                      <Building2 size={28} className="mx-auto mb-3 text-ink-200" />
                      <p className="text-sm font-medium">No clinics yet</p>
                    </td>
                  </tr>
                ) : hospitals.map((h) => (
                  <tr key={h._id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {h.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 text-sm">{h.name}</p>
                          <p className="text-xs text-ink-400 mt-0.5">{h.domain}.vaidyaerp.in</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        h.plan === 'PREMIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-ink-100 text-ink-600'
                      }`}>
                        {h.plan === 'PREMIUM' ? <Crown size={11} /> : <Zap size={11} />}
                        {h.plan || 'BASIC'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleChangePlan(h._id, h.plan || 'BASIC', h.name)}
                        disabled={updating === h._id}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 min-w-[150px] ${
                          h.plan === 'PREMIUM'
                            ? 'bg-white border border-ink-200 text-ink-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {updating === h._id ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <ArrowRightLeft size={13} />
                        )}
                        {updating === h._id ? 'Updating…' : h.plan === 'PREMIUM' ? 'Downgrade to Basic' : 'Upgrade to Premium'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
