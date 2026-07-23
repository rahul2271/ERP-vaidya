"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import axios from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { Check, Crown, Zap, Loader2 } from "lucide-react";

const PLANS = [
  {
    id: "BASIC",
    name: "Basic",
    price: { monthly: 2499, annually: 24990 },
    icon: Zap,
    features: ["Up to 6 staff accounts", "Patients, appointments & billing", "Pharmacy POS", "Email support"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: { monthly: 5999, annually: 59990 },
    icon: Crown,
    features: ["Unlimited staff accounts", "Everything in Basic", "WhatsApp CRM & automation", "Analytics & priority support"],
  },
];

export default function UpgradePage() {
  const [subInfo, setSubInfo] = useState<{ plan: string; subscriptionStatus: string; daysLeft: number } | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  useEffect(() => {
    axios.get("/hospitals/my-plan").then(res => setSubInfo(res.data)).catch(() => {});
  }, []);

  // Only a genuinely PAID, active subscription counts as "current" — during a
  // trial, `plan` is PREMIUM too (trials grant full features), but nothing has
  // been paid for yet, so both cards must stay actionable so they can pay early.
  const isPaidAndActive = subInfo?.subscriptionStatus === 'ACTIVE';
  const isTrialing = subInfo?.subscriptionStatus === 'TRIALING';

  const handleUpgrade = async (plan: string) => {
    if (!scriptReady || !(window as any).Razorpay) {
      toast.error("Payment gateway is still loading — try again in a moment.");
      return;
    }
    setPaying(plan);
    try {
      const token = localStorage.getItem("token");
      const order = await axios.post(
        "/payments/create-subscription",
        { plan, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id, amount, currency, razorpayKeyId } = order.data;
      if (!razorpayKeyId) {
        toast.error("Payment gateway isn't configured yet. Contact support.");
        setPaying(null);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: "VAIDYA ERP",
        description: `${plan} plan subscription`,
        order_id: id,
        handler: function () {
          toast.success("Payment received! Your plan will update within a minute.");
          setTimeout(() => window.location.reload(), 2000);
        },
        modal: {
          ondismiss: () => setPaying(null),
        },
        theme: { color: "#25786f" },
      });

      rzp.on("payment.failed", function () {
        toast.error("Payment failed. No charge was made — try again.");
        setPaying(null);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Upgrade failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Couldn't start checkout. Try again.");
      setPaying(null);
    }
  };

  return (
    <div className="space-y-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />

      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Choose your plan</h1>
        <p className="text-sm text-ink-500 mt-1">
          {isTrialing
            ? `You're on a free Premium trial (${subInfo?.daysLeft ?? 0} day${subInfo?.daysLeft === 1 ? '' : 's'} left) — pay any time to keep going without interruption.`
            : "Cancel or switch any time — no long-term contracts."}
        </p>
      </div>

      <div className="inline-flex items-center gap-1 bg-ink-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}
        >
          Pay Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annually')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === 'annually' ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-500'}`}
        >
          Pay Annually <span className="text-secondary-400">· save ~17%</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
        {PLANS.map(plan => {
          const isCurrentPaid = isPaidAndActive && subInfo?.plan === plan.id;
          const isTrialingThisPlan = isTrialing && subInfo?.plan === plan.id;
          const price = plan.price[billingCycle];

          let label = `Upgrade to ${plan.name}`;
          if (isCurrentPaid) label = "Current plan";
          else if (isTrialingThisPlan) label = `Subscribe to ${plan.name} now`;
          else if (isTrialing && plan.id === "BASIC") label = "Switch to Basic";

          return (
            <div key={plan.id} className={`bg-white rounded-2xl border p-6 flex flex-col ${plan.id === "PREMIUM" ? "border-primary-300" : "border-ink-100"}`}>
              <div className="flex items-center gap-2.5 mb-1">
                <plan.icon size={18} className={plan.id === "PREMIUM" ? "text-amber-600" : "text-primary-600"} />
                <h3 className="font-semibold text-ink-900">{plan.name}</h3>
                {isTrialingThisPlan && (
                  <span className="ml-auto bg-amber-50 text-amber-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">On trial</span>
                )}
              </div>
              <p className="text-3xl font-bold text-ink-900 mb-1">
                ₹{price.toLocaleString('en-IN')}<span className="text-sm font-medium text-ink-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </p>
              {billingCycle === 'annually' && (
                <p className="text-xs text-secondary-600 font-semibold mb-4">≈ ₹{Math.round(price / 12).toLocaleString('en-IN')}/month, billed yearly</p>
              )}
              <ul className={`space-y-2.5 mb-6 flex-1 ${billingCycle === 'monthly' ? 'mt-4' : ''}`}>
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <Check size={15} className="text-primary-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPaid || paying === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                  plan.id === "PREMIUM" ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-ink-900 text-white hover:bg-ink-800"
                }`}
              >
                {paying === plan.id ? <Loader2 size={16} className="animate-spin" /> : null}
                {paying === plan.id ? "Opening checkout…" : label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
