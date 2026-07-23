"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DEFAULT_BRANDING } from "@/config/branding.config";
import { 
  ArrowRight, Mail, Phone, MapPin, 
  ShieldCheck, LockKeyhole, Fingerprint, Database,
  CheckCircle2, Instagram, Linkedin, Twitter
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const branding = DEFAULT_BRANDING || { brandName: "VAIDYA ERP" };
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => { setEmail(""); setSubscribed(false); }, 4000);
    }
  };

  // Same rule as Header: no marketing chrome on auth pages or inside the app shell.
  // Must come after all hooks above (Rules of Hooks — no early return before hooks run).
  const isHiddenPage = pathname === "/login" || pathname === "/signup" || pathname?.startsWith("/dashboard");
  if (isHiddenPage) return null;

  return (
    <footer className="bg-[#090E17] text-ink-400 pt-24 pb-12 relative z-10 overflow-hidden border-t border-slate-800/80">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* =========================================
            NEWSLETTER SECTION
        ========================================= */}
        <div className="bg-ink-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
          
          <div className="max-w-xl relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Join 50+ clinics upgrading their tech.</h3>
            <p className="text-ink-400 text-sm md:text-base leading-relaxed">
              Get our weekly newsletter packed with strategies on how to scale your Ayurvedic hospital, plug inventory leaks, and automate patient follow-ups.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0 relative z-10">
            {subscribed ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl">
                <CheckCircle2 size={20} />
                <span className="font-bold text-sm tracking-wide">Successfully Subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="doctor@clinic.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-80 bg-ink-900/50 border border-slate-800 text-white pl-12 pr-16 py-4 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-500 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center">
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* =========================================
            MAIN LINKS GRID
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            
            {/* 🚀 Updated Logo Implementation */}
            <Link href="/" className="inline-block group cursor-pointer mb-6">
              <div className="relative w-[150px] h-[100px] md:w-[400px] md:h-[150px] flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <Image 
                  src="/logo.png" 
                  alt={`${branding.brandName} Logo`}
                  fill
                  className="object-contain object-left scale-110 origin-left" 
                  priority 
                  onError={(e) => {
                    // Fallback to text if image is missing
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback element */}
                <div className="hidden w-full h-full items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">V</div>
                  <span className="text-2xl font-bold text-white tracking-tight">{branding.brandName}</span>
                </div>
              </div>
            </Link>

            <p className="text-ink-400 text-sm leading-relaxed font-medium mb-8">
              The ultimate command center for modern Ayurvedic & Wellness centers. Stop the chaos, own your data, and focus purely on healing.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-ink-900 border border-slate-800 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/company/vaidya-erp/" className="w-10 h-10 bg-ink-900 border border-slate-800 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/vaidya.erp/" className="w-10 h-10 bg-ink-900 border border-slate-800 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-3">
            <h4 className="text-ink-300 font-bold mb-6 text-xs uppercase tracking-widest">Platform Features</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/ai-prakriti" className="hover:text-white hover:translate-x-1 inline-block transition-all">AI Prakriti Dashboard</Link></li>
              <li><Link href="/whatsapp-crm" className="hover:text-white hover:translate-x-1 inline-block transition-all">Bring Your Own API</Link></li>
              <li><Link href="/god-mode-audit" className="hover:text-white hover:translate-x-1 inline-block transition-all">God Mode Security Audit</Link></li>
              <li><Link href="/pharmacy-pos" className="hover:text-white hover:translate-x-1 inline-block transition-all">Leak-Proof Pharmacy POS</Link></li>
              <li><Link href="/digital-emr" className="hover:text-white hover:translate-x-1 inline-block transition-all">1-Click Digital EMR (Rx)</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="text-ink-300 font-bold mb-6 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#compare" className="hover:text-white transition-colors">Why VAIDYA?</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/nabh-compliance" className="hover:text-white transition-colors">NABH Alignment</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors text-primary-400">Staff Login →</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-ink-300 font-bold mb-6 text-xs uppercase tracking-widest">Contact Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-ink-500" />
                <a href="mailto:hello@vaidyaerp.com" className="hover:text-white transition-colors">hello@vaidyaerp.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-ink-500" />
                <a href="tel:+917009646377" className="hover:text-white transition-colors">+91 70096 46377</a>
              </li>
              <li className="flex items-start gap-3 mt-2">
                <MapPin size={16} className="text-ink-500 shrink-0 mt-0.5" />
                <span className="text-ink-500 leading-relaxed text-xs">Sahibzada Ajit Singh Nagar,<br/>Punjab, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================
            CERTIFICATIONS & TRUST BADGES
        ========================================= */}
        <div className="py-8 border-y border-slate-800/60 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary-500" />
            <span className="text-[10px] font-bold text-ink-300 tracking-widest uppercase">NABH-Aligned Records</span>
          </div>
          <div className="flex items-center gap-2">
            <LockKeyhole size={20} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-ink-300 tracking-widest uppercase">HIPAA Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <Fingerprint size={20} className="text-sky-500" />
            <span className="text-[10px] font-bold text-ink-300 tracking-widest uppercase">ISO 27001 Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={20} className="text-amber-500" />
            <span className="text-[10px] font-bold text-ink-300 tracking-widest uppercase">256-Bit Encryption</span>
          </div>
        </div>

        {/* =========================================
            BOTTOM LEGAL BAR
        ========================================= */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-ink-500">
          <p>&copy; {new Date().getFullYear()} {branding.brandName}. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
             <Link href="/refund" className="hover:text-ink-300 transition-colors">Refund Policy</Link>
             <Link href="/terms" className="hover:text-ink-300 transition-colors">Terms of Service</Link>
             <Link href="/privacy" className="hover:text-ink-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
