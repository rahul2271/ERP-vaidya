"use client";

import { useState } from "react";
import api from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, CheckCircle2, Loader, MessageCircle, ArrowRight, Activity, ShieldCheck, Leaf } from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const branding = DEFAULT_BRANDING;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(`/auth/login`, { email, password });
      const { access_token, role, subscriptionTier, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("subscriptionTier", subscriptionTier || 'basic');
      localStorage.setItem("hospitalName", user?.hospitalName || '');
      localStorage.setItem("hospitalPlan", user?.hospitalPlan || 'BASIC');
      localStorage.setItem("userId", user?.id || '');
      localStorage.setItem("name", user?.name || '');
      localStorage.setItem("email", user?.email || email);

      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSignup = () => {
    const phoneNumber = "917009646377";
    const message = encodeURIComponent("Hi there! 👋 I'd like to claim my 7-Day Free Trial of VAIDYA ERP and set up my clinic's account.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">

      {/* Soft ambient washes — calm, not moody */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-primary-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-[480px] h-[480px] bg-secondary-100/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16 relative z-10">

        {/* Left — Brand & trust signals */}
        <div className="hidden lg:flex w-full lg:w-[46%] flex-col justify-center py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[11px] font-bold mb-10 w-fit tracking-wide">
            <ShieldCheck size={13} /> ABDM COMPLIANT · 256-BIT ENCRYPTED
          </div>

          <div className="flex items-center gap-3.5 mb-7">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <Leaf size={22} />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">{branding.brandName}</h1>
          </div>

          <p className="text-xl text-ink-600 mb-14 leading-relaxed max-w-md font-medium">
            Welcome back. Everything your clinic needs — patients, therapies, billing, pharmacy — in one calm, secure place.
          </p>

          <div className="space-y-7">
            {[
              { icon: Shield, title: "Enterprise-grade security", desc: "Patient data is encrypted at rest and in transit, backed up daily." },
              { icon: Lock, title: "Role-based access", desc: "Every staff member sees exactly what their role needs — nothing more." },
              { icon: Activity, title: "Built for uptime", desc: "Redundant infrastructure keeps your front desk running, always." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-ink-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <feature.icon className="w-5 h-5 text-primary-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-900 mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sign-in card */}
        <div className="w-full lg:w-[54%] max-w-md mx-auto flex flex-col justify-center">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Leaf size={18} />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-900 tracking-tight">{branding.brandName}</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_1px_2px_rgba(20,30,25,0.04),0_12px_32px_-8px_rgba(20,30,25,0.08)] p-8 sm:p-10 border border-ink-100">
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-1.5">Sign in</h2>
            <p className="text-ink-500 mb-8 text-sm">Access your clinic's dashboard.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">{error}</p>
                  <p className="text-xs text-red-500 mt-0.5">Check your email and password and try again.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-300" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3.5 bg-ink-50/60 border border-ink-100 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-ink-900 font-medium transition-all disabled:opacity-50 placeholder:text-ink-300 placeholder:font-normal"
                    placeholder="you@clinic.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-300" size={18} />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-11 py-3.5 bg-ink-50/60 border border-ink-100 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-ink-900 font-medium transition-all disabled:opacity-50 placeholder:text-ink-300 placeholder:font-normal"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader className="w-4.5 h-4.5 animate-spin" size={18} /> Signing in…
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-ink-400 font-semibold uppercase tracking-wide text-[10px]">New to VAIDYA</span>
              </div>
            </div>

            <Link
              href="/signup"
              className="w-full py-3.5 bg-primary-50 border border-primary-200 text-primary-700 font-semibold rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all flex items-center justify-center gap-2"
            >
              Start your 15-day free trial <ArrowRight size={16} />
            </Link>

            <button
              onClick={handleWhatsAppSignup}
              className="w-full py-3.5 mt-3 bg-secondary-50 border border-secondary-200 text-secondary-700 font-semibold rounded-xl hover:bg-secondary-100 hover:border-secondary-300 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} className="text-secondary-600" />
              Talk to us on WhatsApp instead
            </button>

            <div className="mt-7 pt-6 border-t border-ink-100 flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-900 mb-0.5">End-to-end encrypted</p>
                <p className="text-[11px] text-ink-500 leading-relaxed">Credentials and patient data are never stored in plain text.</p>
              </div>
            </div>
          </div>

          <div className="mt-7 text-center text-sm text-ink-400">
            <p>Need help accessing your dashboard?</p>
            <a href="mailto:hello@vaidyaerp.com" className="text-primary-600 hover:text-primary-700 font-semibold mt-1 inline-block">
              Contact support &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
