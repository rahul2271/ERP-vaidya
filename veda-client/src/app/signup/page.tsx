"use client";

import { useState, useEffect, Suspense } from "react";
import api from "@/utils/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import toast from "react-hot-toast";
import { Building2, Mail, Lock, User, Phone, MapPin, ArrowRight, Loader, AlertCircle, Sparkles, Check, CreditCard } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chosenPlan = searchParams.get('plan'); // 'BASIC' | 'PREMIUM' | null
  const chosenCycle = (searchParams.get('cycle') as 'monthly' | 'annually') || 'monthly';

  const [form, setForm] = useState({
    hospitalName: "", hospitalEmail: "", phone: "", city: "", state: "",
    adminName: "", adminEmail: "", adminPassword: "", adminMobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [payingAfterSignup, setPayingAfterSignup] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  // Once the account exists and they're logged in, immediately open checkout
  // for the plan they picked on the homepage — "choose plan, pay, and play"
  // in one continuous flow instead of a separate later step.
  const startDirectCheckout = async () => {
    if (!chosenPlan || !(window as any).Razorpay) {
      router.push("/dashboard");
      return;
    }
    setPayingAfterSignup(true);
    try {
      const token = localStorage.getItem("token");
      const order = await api.post(
        "/payments/create-subscription",
        { plan: chosenPlan, billingCycle: chosenCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { id, amount, currency, razorpayKeyId } = order.data;
      if (!razorpayKeyId) {
        toast("Payment isn't configured yet — you're all set on your free trial for now.");
        router.push("/dashboard");
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: "VAIDYA ERP",
        description: `${chosenPlan} plan subscription`,
        order_id: id,
        handler: function () {
          toast.success("Payment received! Redirecting to your dashboard…");
          setTimeout(() => router.push("/dashboard"), 1500);
        },
        modal: {
          // If they close the checkout without paying, don't block them —
          // they still have the full-Premium trial to fall back on.
          ondismiss: () => router.push("/dashboard"),
        },
        theme: { color: "#25786f" },
      });
      rzp.on("payment.failed", function () {
        toast.error("Payment failed — no charge was made. You can try again from your dashboard any time.");
        router.push("/dashboard");
      });
      rzp.open();
    } catch (err) {
      router.push("/dashboard");
    } finally {
      setPayingAfterSignup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      const { access_token, role, subscriptionTier, user } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("subscriptionTier", subscriptionTier || "premium");
      localStorage.setItem("hospitalName", user?.hospitalName || form.hospitalName);
      localStorage.setItem("hospitalPlan", user?.hospitalPlan || "PREMIUM");
      localStorage.setItem("userId", user?.id || "");
      localStorage.setItem("name", user?.name || form.adminName);
      localStorage.setItem("email", user?.email || form.adminEmail);

      if (chosenPlan) {
        await startDirectCheckout();
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptReady(true)} />

      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-primary-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-[480px] h-[480px] bg-secondary-100/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16 relative z-10">

        {/* Left — value prop */}
        <div className="hidden lg:flex w-full lg:w-[38%] flex-col justify-center py-12">
          {chosenPlan ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[11px] font-bold mb-8 w-fit tracking-wide">
              <CreditCard size={13} /> {chosenPlan} PLAN · {chosenCycle === 'annually' ? 'BILLED YEARLY' : 'BILLED MONTHLY'}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary-50 border border-secondary-200 text-secondary-700 rounded-full text-[11px] font-bold mb-8 w-fit tracking-wide">
              <Sparkles size={13} /> 15-DAY FREE PREMIUM TRIAL
            </div>
          )}
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 mb-4">
            {chosenPlan ? "Almost there — create your account" : "Start running your clinic today"}
          </h1>
          <p className="text-ink-600 mb-10 leading-relaxed">
            {chosenPlan
              ? "Right after this, you'll go straight to secure checkout to complete your subscription — no separate steps."
              : "No card required. Full Premium access for 15 days — patients, appointments, pharmacy, billing, and WhatsApp, all in one place."}
          </p>
          <div className="space-y-4">
            {[
              "Every Premium feature unlocked from day one",
              "Your own team, your own data, your own domain",
              chosenPlan ? "Secure payment via Razorpay" : "Cancel or downgrade any time before day 15",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-primary-600" strokeWidth={3} />
                </div>
                <p className="text-sm text-ink-600">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:w-[62%] max-w-xl mx-auto">
          <div className="bg-white rounded-3xl shadow-[0_1px_2px_rgba(20,30,25,0.04),0_12px_32px_-8px_rgba(20,30,25,0.08)] p-7 sm:p-9 border border-ink-100">
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-1">Create your clinic account</h2>
            <p className="text-ink-500 mb-7 text-sm">
              {chosenPlan ? `You'll pay for the ${chosenPlan} plan right after this.` : "Takes about a minute."}
            </p>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2.5">Clinic details</p>
                <div className="space-y-3">
                  <Field icon={Building2} placeholder="Clinic / hospital name" value={form.hospitalName} onChange={v => update("hospitalName", v)} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Mail} type="email" placeholder="Clinic email" value={form.hospitalEmail} onChange={v => update("hospitalEmail", v)} required />
                    <Field icon={Phone} placeholder="Clinic phone" value={form.phone} onChange={v => update("phone", v)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={MapPin} placeholder="City" value={form.city} onChange={v => update("city", v)} required />
                    <Field icon={MapPin} placeholder="State" value={form.state} onChange={v => update("state", v)} required />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2.5">Your admin login</p>
                <div className="space-y-3">
                  <Field icon={User} placeholder="Your full name" value={form.adminName} onChange={v => update("adminName", v)} required />
                  <Field icon={Mail} type="email" placeholder="Your email (used to log in)" value={form.adminEmail} onChange={v => update("adminEmail", v)} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Phone} placeholder="Your mobile" value={form.adminMobile} onChange={v => update("adminMobile", v)} required />
                    <Field icon={Lock} type="password" placeholder="Choose a password" value={form.adminPassword} onChange={v => update("adminPassword", v)} required />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || payingAfterSignup}
                className="w-full py-3.5 mt-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader className="animate-spin" size={18} /> Setting up your clinic…</>
                ) : payingAfterSignup ? (
                  <><Loader className="animate-spin" size={18} /> Opening secure checkout…</>
                ) : chosenPlan ? (
                  <>Continue to payment <ArrowRight size={17} /></>
                ) : (
                  <>Start my free trial <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, type = "text", placeholder, value, onChange, required }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={17} />
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 bg-ink-50/60 border border-ink-100 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-ink-900 text-sm font-medium transition-all placeholder:text-ink-300 placeholder:font-normal"
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
