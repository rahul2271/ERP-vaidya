"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DEFAULT_BRANDING } from "@/config/branding.config";
import { 
  Check, X, Shield, BarChart3, Heart, Lock, Mic,
  Mail, Phone, MapPin, Users, Timer, Stethoscope, Store, 
  Building, PhoneCall, Pill, Activity, MessageCircle, Gift, 
  Sparkles, LayoutDashboard, ChevronDown, ChevronUp, Star, 
  Play, ZoomIn, ShieldCheck, Cloud, Award, Zap, TrendingUp,
  ArrowRight, Code, CheckCircle2, ChevronRight, FileText, VideoIcon,
  Radio, UserPlus, LockKeyhole, IndianRupee, LayoutGrid, HeartHandshake, Quote,
  Languages, ClipboardCheck, BellRing, Brain, Target, ArrowUpRight, Database, Clock, 
  Fingerprint, FileSpreadsheet, UserCheck, Globe, ActivitySquare, ShieldAlert,
  Microscope, Bed, Headphones, PlusCircle, ScanLine, Network, MousePointer2, PieChart, LineChart, BarChart
} from "lucide-react";

// --- Pricing (Strategically Adjusted for India Market) ---
const pricing = {
  basic: { monthly: 2499, annually: 24990, save: 4998 },    // ~₹80/day (Sweet spot for solo)
  premium: { monthly: 5999, annually: 59990, save: 11998 }  // ~₹200/day (Polyclinics)
};

// --- Data Arrays ---
const DASHBOARDS = [
  { id: "admin", role: "Clinic Owner", icon: BarChart3, color: "text-primary-500", bg: "bg-primary-500/10", border: "border-primary-500/20", desc: "The 'God Mode' view. Spot silent inventory leaks, match your daily UPI & Cash down to the last rupee, and finally sleep peacefully knowing your clinic is secure.", img: "/admin_dashboard.png" },
  { id: "doctor", role: "Vaidya / Doctor", icon: Stethoscope, color: "text-primary-500", bg: "bg-primary-500/10", border: "border-primary-500/20", desc: "Focus on the Nadi, not the paperwork. Instantly view patient history and generate beautiful, readable PDF prescriptions in under 60 seconds.", img: "/doctor_dashboard.png" },
  { id: "reception", role: "Front Desk", icon: Users, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20", desc: "End the waiting room chaos. Process walk-ins with a smile, generate GST bills instantly, and see which Panchakarma rooms are free without shouting.", img: "/reception_dashboard.png" },
  { id: "pharma", role: "Pharmacy", icon: Pill, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Stop throwing away expired Bhasmas and expensive oils. Our POS deducts stock the exact second a doctor prescribes it, tracking expiry dates for you.", img: "/pharma_dashboard.png" },
  { id: "telecaller", role: "Telecaller", icon: PhoneCall, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", desc: "Stop letting your staff pass around a shared clinic mobile phone. Dial patients, record calls for quality, and send WhatsApp diet charts straight from the screen.", img: "/telecaller_w_dashbaord.png" },
  { id: "therapist", role: "Panchakarma", icon: Heart, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "No more double-booking massage tables. Track complex 7-day therapy packages perfectly and mark sessions complete right from the treatment room.", img: "/therapist_dashboard.png" },
];

const FAQS = [
  { q: "Do you charge per WhatsApp message or take a cut of my bookings?", a: "Never. This is our biggest difference. Other softwares force you to use their APIs and mark up the price by 300%. VAIDYA uses a 'Bring Your Own API' model. You plug in your own Meta WhatsApp or SMS API key. You pay the base rate directly to Meta. We don't take a single paisa of markup. Total transparency." },
  { q: "We have thousands of old paper files. Is switching going to be a nightmare?", a: "This is the fear of every clinic owner, and the answer is no. You don't have to lift a finger. Send us your messy Excel sheets or old software exports, and our engineering team does a complete 'White-Glove Migration' for you at zero extra cost. You log in on Monday, and everyone is there." },
  { q: "Who actually owns my patient data?", a: "You do. 100%. Aggregators give you 'free' software because they mine your patient data to sell ads or redirect them to competitors. With VAIDYA, your data is 256-bit encrypted and locked to your clinic. You can export it to a CSV with one click whenever you want." },
  { q: "Will this handle my messy pharmacy inventory too?", a: "Yes. VAIDYA ERP isn't just an appointment diary. It includes a heavy-duty Pharmacy POS that tracks batch numbers, alerts you before expensive medicines expire, generates proper GST invoices, and automatically deducts stock when doctors hit 'Prescribe'." },
];

const FEATURE_COMPARISON = [
  { feature: "Unlimited Patients & Digital Prescriptions", basic: true, premium: true },
  { feature: "Role-Based Staff Access Controls", basic: "Up to 6 Staff", premium: "Unlimited Staff" },
  { feature: "Staff Directory & Roster", basic: true, premium: true },
  { feature: "Admin-Approved Notice Board & Secure Chat", basic: true, premium: true },
  { feature: "Bring-Your-Own API (0% Message Markup)", basic: true, premium: true },
  { feature: "Digital AYUSH Prakriti Quiz", basic: true, premium: true },
  { feature: "Panchakarma Therapy & Room Management", basic: true, premium: true },
  { feature: "GST-Compliant Billing & Invoicing", basic: true, premium: true },
  { feature: "Ayurvedic Pharmacy POS & Inventory Mgmt.", basic: true, premium: true },
  { feature: "Zero-Conflict Smart Booking Engine", basic: true, premium: true },
  { feature: "OPD/IPD/Day Care Registers (NABH-aligned)", basic: true, premium: true },
  { feature: "Embedded Cloud Dialer (Record Calls)", basic: false, premium: true },
  { feature: "Embedded WhatsApp Web CRM", basic: false, premium: true },
  { feature: "Video Consult Links (bring your own Zoom/Meet)", basic: false, premium: true },
  { feature: "Tally Export for Accounting", basic: false, premium: true },
  { feature: "God Mode Security & Anti-Theft Audit Logs", basic: false, premium: true },
  { feature: "Custom Clinic Logo & White-label", basic: false, premium: true },
];

const TESTIMONIALS = [
  { quote: "Honestly, VAIDYA gave me my evenings back. We used to spend hours tallying the pharmacy register and matching it with front-desk cash. Now, I just open my phone at 8 PM, look at the dashboard, and I know exactly where every rupee went.", name: "Dr. Ananya Sharma", title: "Chief Vaidya", clinic: "Prakriti Wellness Retreat", avatar: "A" },
  { quote: "We were literally giving away 15% of our hard-earned consultation fees to an aggregator app. Moving to VAIDYA ERP was the best financial decision we made. We own our patients again.", name: "Dr. Vikram Joshi", title: "Medical Director", clinic: "Sanjeevani Ayurved Hospital", avatar: "V" },
  { quote: "Tracking Panchakarma therapies on WhatsApp groups and whiteboards was a disaster. Double bookings happened constantly. VAIDYA cleared up the chaos in two days. It just works.", name: "Dr. Meera Patel", title: "Founder", clinic: "Dhanvantari Holistic Care", avatar: "M" },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<"basic" | "premium">("premium");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [activeDashboard, setActiveDashboard] = useState(DASHBOARDS[0]);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0); 
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Intersection Observer Reveal
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || '0';
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.s-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Performance: Aura Effect
  useEffect(() => {
    const aura = document.getElementById("mouse-aura");
    if (!aura) return;
    const handleMouseMove = (e: MouseEvent) => {
      aura.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(37, 99, 235, 0.05), transparent 70%)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSlowScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition - 80;
      const duration = 1000; 
      let start: number | null = null;
      
      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };
      
      const easeInOutQuart = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
      };
      requestAnimationFrame(animation);
    }
  };

  const handleWhatsAppSubscribe = (planName?: string, cycle?: string) => {
    const phoneNumber = "917009646377"; 
    let message = planName && cycle
      ? encodeURIComponent(`Hi Rahul! I'm tired of my clinic's messy workflow. I'm interested in the ${planName} (${cycle}) for VAIDYA ERP.`)
      : encodeURIComponent(`Hi Rahul! We need a transparent system to manage our clinic operations. I'd like to book a VAIDYA ERP demo.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Direct pay-and-play: takes the chosen plan straight into signup, which
  // (once the account is created) immediately opens Razorpay checkout for that
  // exact plan/cycle — no separate "talk to sales" step required.
  const handleDirectSubscribe = (plan: "BASIC" | "PREMIUM", cycle: "monthly" | "annually") => {
    router.push(`/signup?plan=${plan}&cycle=${cycle}`);
  };

  // --- SHEETDB INTEGRATION ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual SheetDB API URL
      const SHEETDB_URL = "https://sheetdb.io/api/v1/4p7q1oammo7cz";

      const response = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              Name: contactForm.name,
              Phone: contactForm.phone,
              Message: contactForm.message,
              Date: new Date().toLocaleString(),
            },
          ],
        }),
      });

      if (response.ok) {
        setContactSubmitted(true);
        // Clear the form
        setContactForm({ name: "", phone: "", message: "" });
        
        // Hide the success message after 4 seconds
        setTimeout(() => { 
          setContactSubmitted(false); 
        }, 4000);
      } else {
        console.error("Failed to save data to SheetDB");
        alert("Something went wrong. Please try again or contact us directly.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-500/30 selection:text-primary-900 bg-[#FAFAFA] text-ink-900 overflow-x-hidden">
      
      <div id="mouse-aura" className="pointer-events-none fixed inset-0 z-[99] transition-opacity duration-300 hidden lg:block mix-blend-multiply" />

      <style dangerouslySetInnerHTML={{ __html: `
        .text-balance { text-wrap: balance; }
        
        .s-reveal {
          opacity: 0;
          transform: translateY(20px);
          will-change: opacity, transform;
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .s-reveal.is-visible { opacity: 1; transform: translateY(0); }

        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 40s linear infinite; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        
        @keyframes scaleUp { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scaleUp 0.4s ease-out forwards; }

        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        
        @keyframes float-slower { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float-slower { animation: float-slower 6s ease-in-out infinite; }

        .bg-dots {
          background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Bar chart animation for ROI */
        @keyframes grow-height { from { height: 0%; } to { height: var(--target-height); } }
        .animate-grow { animation: grow-height 1s ease-out forwards; animation-delay: 0.5s; }
      `}} />

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/90 backdrop-blur-md p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl animate-scale-up ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxImg} alt="Expanded View" width={1920} height={1080} className="w-full h-auto max-h-[90vh] object-contain bg-[#0F141F]" />
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP CTA */}
      <button onClick={() => handleWhatsAppSubscribe()} className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group ring-4 ring-[#25D366]/20 hover:bg-[#20bd5a]">
        <span className="absolute right-full mr-4 bg-ink-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-lg">
          Talk to Sales
        </span>
        <MessageCircle size={24} />
      </button>

      {/* =========================================
          HERO SECTION (Ultra Premium Dark Mode) 
      ========================================= */}
      <div className="bg-[#040814] bg-dots relative overflow-hidden border-b border-slate-800/60 text-white">
        
        {/* Deep, rich cinematic gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_60%)] pointer-events-none mix-blend-screen"></div>

        {/* Hero Content */}
        <section className="relative pt-[160px] md:pt-[200px] pb-20 px-6 z-10 text-center max-w-5xl mx-auto s-reveal is-visible">
            
            <div className="inline-flex items-center justify-center gap-2.5 mb-8 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 backdrop-blur-md cursor-default shadow-sm shadow-black/20">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-primary-500 ring-2 ring-[#040814] z-30 flex items-center justify-center text-[8px] font-bold">V</div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#040814] z-20 flex items-center justify-center text-[8px] font-bold">S</div>
                <div className="w-5 h-5 rounded-full bg-amber-500 ring-2 ring-[#040814] z-10 flex items-center justify-center text-[8px] font-bold">P</div>
              </div>
              <p className="text-[11px] font-medium text-ink-300 tracking-wide">Trusted by 50+ Top Vaidyas in India</p>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white mb-6 tracking-tighter leading-[1.02] text-balance mx-auto drop-shadow-sm">
              Focus on the Nadi.<br className="hidden md:block"/>
              <span className="bg-gradient-to-b from-slate-400 to-slate-600 bg-clip-text text-transparent font-normal">
                Let VAIDYA run the clinic.
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium text-balance">
              Stop losing 20% to aggregators. Stop paying 300% markups on WhatsApp APIs. VAIDYA is the transparent, elegant command center built for modern Ayurveda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => handleWhatsAppSubscribe()} className="w-full sm:w-auto px-8 py-3.5 bg-white text-ink-900 rounded-xl font-bold hover:bg-ink-100 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-0.5">
                 Start Your Free Trial <ArrowRight size={16} />
              </button>
              <a href="#dashboards" onClick={(e) => handleSlowScroll(e, 'dashboards')} className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-center text-sm gap-2">
                <Play size={14} className="text-ink-300 fill-slate-300" /> See Platform
              </a>
            </div>
        </section>

        {/* 🚀 Hero Dashboard with Animated CSS Graphs */}
        <section className="relative pb-24 px-4 z-10 text-center max-w-6xl mx-auto s-reveal is-visible" style={{ transitionDelay: '0.2s' }}>
          
          {/* Floating Graph Element (Left) */}
          <div className="absolute -left-8 top-16 z-30 bg-[#0F141F]/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl animate-float-slow hidden lg:flex flex-col gap-3">
            <div className="flex items-center justify-between gap-6">
              <div className="text-left">
                <p className="text-[9px] text-ink-400 font-bold uppercase tracking-widest">Monthly Revenue</p>
                <p className="text-base font-bold text-white">₹8.4L <span className="text-emerald-400 text-[10px] ml-1">+14%</span></p>
              </div>
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            {/* Pure CSS Bar Chart */}
            <div className="flex items-end gap-1.5 h-12 mt-2">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} className="w-3 bg-primary-500/80 rounded-sm hover:bg-primary-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Floating Status Element (Right) */}
          <div className="absolute -right-8 bottom-32 z-30 bg-[#0F141F]/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl animate-float-slower hidden lg:flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 ring-1 ring-purple-500/30 rounded-xl flex items-center justify-center text-purple-400"><Fingerprint size={20}/></div>
            <div className="text-left">
              <p className="text-[9px] text-ink-400 font-bold uppercase tracking-widest">Security Status</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">God Mode Active <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span></p>
            </div>
          </div>

          {/* Main Dashboard Image */}
          <div className="relative cursor-zoom-in group" onClick={() => setLightboxImg("/admin_dashboard.png")}>
            <div className="rounded-xl md:rounded-2xl border border-slate-800/80 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden bg-[#0F141F] relative z-10 ring-1 ring-white/5 group-hover:ring-white/10 transition-all duration-500">
              <div className="bg-[#0F141F] h-8 w-full border-b border-slate-800/80 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div><div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div><div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              </div>
              <Image src="/admin_dashboard.png" alt="VAIDYA ERP Interface" width={1200} height={800} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" priority />
            </div>
          </div>
        </section>

        {/* Premium Trust Marquee */}
        <div className="border-t border-slate-800/50 bg-[#040814] py-5 relative z-10">
          <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-12 md:gap-20 px-6 md:px-10 shrink-0 text-ink-500 text-xs md:text-sm font-medium tracking-wide">
                <span className="flex items-center gap-2"><Globe className="text-ink-400" size={16}/> Bring Your Own API</span>
                <span className="flex items-center gap-2"><ShieldCheck className="text-ink-400" size={16}/> Bank-Grade Security</span>
                <span className="flex items-center gap-2"><Database className="text-ink-400" size={16}/> 100% Data Ownership</span>
                <span className="flex items-center gap-2"><MessageCircle className="text-ink-400" size={16}/> Direct WhatsApp Web</span>
                <span className="flex items-center gap-2"><Network className="text-ink-400" size={16}/> Zero-Conflict Booking</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          BENTO BOX FEATURES GRID (High-End Graphics)
      ========================================= */}
      <section id="features" className="py-24 md:py-32 px-4 md:px-6 border-b border-ink-200 overflow-hidden relative bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 s-reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-ink-900 mb-4 tracking-tight">The clinic that runs itself.</h2>
            <p className="text-sm md:text-base text-ink-500 font-medium">Everything you need to scale, engineered into one seamless ecosystem. Drop the 5 separate apps your staff is fighting with.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[auto]">
            
            {/* Box 1: BYO API / WhatsApp */}
            <div className="s-reveal md:col-span-2 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group flex flex-col relative overflow-hidden h-[340px]">
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-5 ring-1 ring-green-100"><MessageCircle size={18}/></div>
                <h3 className="text-lg font-bold text-ink-900 tracking-tight mb-2">0% Markup API (BYO)</h3>
                <p className="text-ink-500 text-sm leading-relaxed font-normal">
                  Aggregators mark up WhatsApp messages by 300%. We let you plug in your own Meta API key. Pay base rates directly to Meta. Total transparency.
                </p>
              </div>
              
              {/* CSS UI Mockup: WhatsApp Bubbles */}
              <div className="absolute right-[-20px] bottom-[-20px] w-64 bg-ink-50/80 backdrop-blur-md ring-1 ring-slate-200 rounded-tl-2xl p-5 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
                <div className="flex flex-col gap-3">
                  <div className="bg-green-500 text-white text-[10px] py-2 px-3 rounded-2xl rounded-br-sm w-fit ml-auto shadow-sm font-medium">Diet chart sent via Meta API</div>
                  <div className="bg-white ring-1 ring-slate-200 text-ink-600 text-[10px] py-2 px-3 rounded-2xl rounded-bl-sm flex items-center gap-2 shadow-sm font-medium w-fit">
                    <FileText size={12} className="text-primary-500"/> Patient_Diet_Vata.pdf
                  </div>
                  <div className="text-[8px] text-ink-400 text-center uppercase tracking-widest mt-1 font-bold">Cost: ₹0.30 (Zero Markup)</div>
                </div>
              </div>
            </div>

            {/* Box 2: Telemedicine */}
            <div className="s-reveal delay-100 md:col-span-2 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group flex flex-col relative overflow-hidden h-[340px]">
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-5 ring-1 ring-sky-100"><VideoIcon size={18}/></div>
                <h3 className="text-lg font-bold text-ink-900 tracking-tight mb-2">Video Consult Links</h3>
                <p className="text-ink-500 text-sm leading-relaxed font-normal">
                  Attach a Zoom, Meet, or any video link to an online appointment. Patients get a clean, branded link on WhatsApp instantly — no separate video app for your team to manage.
                </p>
              </div>
              
              {/* CSS UI Mockup: Video Call */}
              <div className="absolute right-[-20px] bottom-[-20px] w-64 h-48 bg-[#040814] ring-4 ring-slate-100 rounded-tl-3xl shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hidden sm:flex flex-col p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent"></div>
                <div className="flex justify-between items-start mb-auto relative z-10">
                  <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase ring-1 ring-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> REC
                  </div>
                  <div className="text-[9px] text-white/70 font-mono bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">04:12</div>
                </div>
                <div className="flex justify-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md ring-1 ring-white/20 hover:bg-white/20 transition-colors"><Mic size={14} className="text-white"/></div>
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"><Phone size={14} className="text-white fill-white transform rotate-[135deg]"/></div>
                </div>
              </div>
            </div>

            {/* Box 3: GOD MODE SECURITY (Dark) */}
            <div className="s-reveal md:col-span-2 bg-[#090E17] rounded-[2rem] p-8 ring-1 ring-slate-800 text-white hover:ring-slate-700 transition-all duration-300 group relative overflow-hidden h-[340px]">
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="w-10 h-10 bg-white/5 ring-1 ring-white/10 rounded-xl flex items-center justify-center mb-5"><Fingerprint size={18} className="text-purple-400"/></div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">God Mode Audit Trail</h3>
                <p className="text-ink-400 text-sm leading-relaxed font-normal mb-6">Never wonder "who deleted that bill?" again. Our immutable audit log catches every user, action, and exact IP Address in real-time.</p>
              </div>

               {/* CSS UI Mockup: Terminal Log */}
               <div className="absolute right-[-10px] bottom-[-10px] w-[300px] bg-[#040814] ring-1 ring-slate-800 rounded-tl-2xl p-5 shadow-2xl font-mono text-[10px] text-emerald-400 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
                  <div className="flex gap-1.5 mb-4 border-b border-slate-800 pb-3">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div><div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  </div>
                  <p className="mb-2 leading-relaxed"><span className="text-ink-500">[08:42:11]</span> AUTH: <span className="text-white font-semibold">Dr_Sharma</span></p>
                  <p className="text-rose-400 mb-2 leading-relaxed"><span className="text-ink-500">[08:45:02]</span> ACTION: <span className="bg-rose-500/20 px-1 py-0.5 rounded text-rose-300">DELETE_INVOICE #902</span></p>
                  <p className="text-primary-400 mb-2 leading-relaxed"><span className="text-ink-500">[08:45:02]</span> IP_TRACE: 192.168.1.45</p>
                </div>
            </div>

            {/* Box 4: Pharmacy */}
            <div className="s-reveal delay-100 md:col-span-2 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group relative h-[340px] overflow-hidden">
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="w-10 h-10 bg-purple-50 ring-1 ring-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-5"><Pill size={18}/></div>
                <h3 className="text-lg font-bold text-ink-900 tracking-tight mb-2">Pharmacy POS & Inventory</h3>
                <p className="text-ink-500 text-sm leading-relaxed font-normal">Stop finding out you're out of stock when a patient asks. Stock is automatically deducted when doctors prescribe. Track expiries effortlessly.</p>
              </div>

              {/* CSS UI Mockup: Inventory List */}
              <div className="absolute right-[-10px] bottom-[-10px] w-[280px] bg-white ring-1 ring-slate-200 rounded-tl-2xl shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block overflow-hidden">
                <div className="p-4 border-b border-ink-100 bg-ink-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Live Inventory</span>
                  <Activity size={14} className="text-emerald-500"/>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex justify-between items-center bg-rose-50/50 ring-1 ring-rose-100 p-2.5 rounded-lg">
                    <span className="text-xs font-semibold text-ink-900">Ashwagandha</span><span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase">Low: 2 Btls</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50/50 ring-1 ring-emerald-100 p-2.5 rounded-lg">
                    <span className="text-xs font-semibold text-ink-900">Triphala</span><span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">Stock: 45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 5 (Smart Front Desk & Beds) */}
            <div className="s-reveal md:col-span-2 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group relative overflow-hidden h-[280px]">
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="w-10 h-10 bg-primary-50 ring-1 ring-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4"><Bed size={18}/></div>
                <h3 className="text-lg font-bold text-ink-900 tracking-tight mb-2">Live Ward & Bed Mgmt</h3>
                <p className="text-ink-500 text-sm leading-relaxed font-normal">Your receptionist shouldn't be shouting down the hall. Track live <strong>Panchakarma Bed Occupancy</strong> instantly on screen.</p>
              </div>
              
              {/* CSS UI Mockup: Bed Matrix */}
              <div className="absolute right-[-10px] bottom-[-10px] p-5 bg-ink-50 ring-1 ring-slate-200 rounded-tl-[2rem] shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
                 <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Ward Matrix</div>
                 <div className="grid grid-cols-4 gap-3">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${i%3===0 ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'}`}>B{i}</div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Box 6 (Zero-Conflict Booking) */}
            <div className="s-reveal delay-100 md:col-span-1 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group relative overflow-hidden h-[280px]">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-amber-50 ring-1 ring-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4"><Network size={18}/></div>
                <h3 className="text-base font-bold text-ink-900 tracking-tight mb-2">Zero-Conflict Engine</h3>
                <p className="text-ink-500 text-xs leading-relaxed font-normal">No double bookings. Our smart database locks slots the millisecond they are clicked by anyone.</p>
              </div>
              
              {/* CSS UI Mockup: Fake Cursors */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-10 right-14 flex items-center gap-1 group-hover:-translate-y-3 group-hover:-translate-x-2 transition-transform duration-700 ease-out">
                  <MousePointer2 size={18} className="text-rose-500 fill-rose-500"/>
                  <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded shadow-sm font-bold">Reception</span>
                </div>
                <div className="absolute bottom-20 right-4 flex items-center gap-1 group-hover:-translate-x-4 transition-transform duration-1000 ease-out">
                  <MousePointer2 size={18} className="text-primary-500 fill-primary-500"/>
                  <span className="bg-primary-500 text-white text-[9px] px-2 py-0.5 rounded shadow-sm font-bold">Telecaller</span>
                </div>
              </div>
            </div>

            {/* Box 7 (Live Attendance) */}
            <div className="s-reveal delay-200 md:col-span-1 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group relative overflow-hidden h-[280px]">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-emerald-50 ring-1 ring-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><UserCheck size={18}/></div>
                <h3 className="text-base font-bold text-ink-900 tracking-tight mb-2">Live Roster</h3>
                <p className="text-ink-500 text-xs leading-relaxed font-normal">See exactly who is online, busy, or offline before assigning patients to staff.</p>
              </div>
               
               {/* CSS UI Mockup: Avatar Stack */}
               <div className="absolute right-6 bottom-8 flex -space-x-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-full ring-2 ring-white bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-700 relative shadow-md">
                    Dr.A <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 ring-2 ring-white rounded-full"></span>
                  </div>
                  <div className="w-12 h-12 rounded-full ring-2 ring-white bg-rose-100 flex items-center justify-center text-sm font-bold text-rose-700 relative shadow-md">
                    Dr.R <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 ring-2 ring-white rounded-full"></span>
                  </div>
                  <div className="w-12 h-12 rounded-full ring-2 ring-white bg-ink-100 flex items-center justify-center text-sm font-bold text-ink-500 relative shadow-md">
                    S <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 ring-2 ring-white rounded-full"></span>
                  </div>
                </div>
            </div>

            {/* Box 8 (EMR/Prescriptions) - Span Full Width */}
            <div className="s-reveal md:col-span-4 bg-white rounded-[2rem] p-8 md:p-12 ring-1 ring-slate-200/60 shadow-sm transition-all duration-500 flex flex-col md:flex-row items-center justify-between group hover:shadow-lg overflow-hidden relative">
              <div className="md:w-1/2 mb-8 md:mb-0 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-md text-[10px] font-bold mb-4 ring-1 ring-cyan-200 uppercase tracking-widest">
                  <Stethoscope size={12}/> Doctor's Workspace
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4 tracking-tight leading-tight">Digital EMR & <br/>1-Click Prescriptions</h3>
                <p className="text-ink-500 text-sm md:text-base leading-relaxed font-normal max-w-xl">Stop writing the exact same Vata-pacifying diet chart 20 times a day. Our predictive EMR remembers your favorite drug combos. Push therapies to the Panchakarma therapist's queue in a single click.</p>
              </div>
               
               {/* CSS UI Mockup: Digital Rx */}
               <div className="md:w-1/2 flex justify-end relative z-10 w-full mt-4 md:mt-0">
                  <div className="w-[340px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-200 p-6 transform rotate-2 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-500">
                    <div className="flex justify-between border-b border-ink-100 pb-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">Rx</div>
                        <div><div className="h-2 w-20 bg-slate-800 rounded mb-1.5"></div><div className="h-1.5 w-12 bg-slate-400 rounded"></div></div>
                      </div>
                      <div className="text-right"><div className="h-1.5 w-14 bg-ink-100 rounded mb-1.5 ml-auto"></div><div className="h-1.5 w-10 bg-ink-100 rounded ml-auto"></div></div>
                    </div>
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div><div className="h-2 w-40 bg-ink-100 rounded"></div></div>
                       <div className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div><div className="h-2 w-28 bg-ink-100 rounded"></div></div>
                       <div className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div><div className="h-2 w-32 bg-ink-100 rounded"></div></div>
                    </div>
                    <div className="pt-4 border-t border-ink-50 flex justify-between items-center">
                       <div className="h-4 w-20 bg-primary-100 rounded"></div>
                       <div className="px-4 py-2 bg-ink-900 rounded-lg text-[10px] text-white font-bold shadow-md hover:bg-slate-800 transition-colors cursor-pointer">Generate PDF</div>
                    </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          WHY CHOOSE US SECTION
      ========================================= */}
      <section id="compare" className="py-24 bg-white border-t border-ink-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 s-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 tracking-tight mb-4">Why clinics choose VAIDYA over the alternatives</h2>
            <p className="text-ink-500 max-w-xl mx-auto">Not another generic hospital system repackaged for Ayurveda. Built for how Indian clinics actually run.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "0% commission, ever",
                desc: "Aggregator apps take a cut of every booking. VAIDYA charges one flat subscription — what you earn is what you keep.",
              },
              {
                icon: MessageCircle,
                title: "Bring your own WhatsApp API",
                desc: "No per-message markup hidden in a 'communication credits' wallet. Connect your own Meta Business API and pay Meta directly.",
              },
              {
                icon: ShieldCheck,
                title: "Built for how records actually get audited",
                desc: "Separate OPD/IPD/Day Care registers, UHID continuity, and full discharge summaries — aligned to NABH record-keeping, not bolted on after.",
              },
              {
                icon: Zap,
                title: "Panchakarma-specific, not generic",
                desc: "Room and therapist scheduling built around multi-day therapy packages — something generic OPD software treats as an afterthought.",
              },
              {
                icon: Cloud,
                title: "Your data, exportable, always",
                desc: "Full patient and billing data export to Tally and CSV whenever you want it. No lock-in, no held-hostage exports.",
              },
              {
                icon: Award,
                title: "Priced for Indian clinics",
                desc: "Built and priced in India, for India — not a US SaaS price converted at the exchange rate.",
              },
            ].map((item, i) => (
              <div key={i} className="p-7 rounded-2xl border border-ink-100 hover:border-primary-200 hover:shadow-sm transition-all s-reveal" data-delay={i * 80}>
                <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-5">
                  <item.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          ROI / VALUE PROPOSITION SECTION (Graphs Added)
      ========================================= */}
      <section id="roi" className="py-24 bg-white border-t border-ink-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 s-reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-ink-900 mb-4 tracking-tight">How VAIDYA pays for itself.</h2>
            <p className="text-base text-ink-500 font-normal">Software shouldn't be an expense. It should be your highest-performing employee.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* ROI Card 1: CSS Bar Chart */}
            <div className="bg-ink-50 p-8 rounded-2xl ring-1 ring-slate-200 transition-all duration-300 s-reveal hover:bg-white hover:shadow-lg hover:-translate-y-1 group" data-delay="0">
              <div className="h-20 w-full mb-6 flex items-end gap-3 border-b border-ink-200 pb-2 relative">
                <div className="absolute top-0 right-0 text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded ring-1 ring-rose-200 group-hover:scale-105 transition-transform">-300% Markup</div>
                {/* Aggregator Cost Bar */}
                <div className="w-12 bg-rose-200 rounded-t-md relative flex flex-col justify-end group-hover:bg-rose-300 transition-colors" style={{ height: '90%' }}>
                   <span className="text-[9px] font-bold text-rose-700 text-center mb-1">Them</span>
                </div>
                {/* VAIDYA Cost Bar */}
                <div className="w-12 bg-emerald-500 rounded-t-md relative flex flex-col justify-end group-hover:bg-emerald-400 transition-colors" style={{ height: '30%' }}>
                   <span className="text-[9px] font-bold text-white text-center mb-1">VAIDYA</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-2 tracking-tight">Stop Paying API Taxes</h3>
              <p className="text-ink-500 text-sm font-normal leading-relaxed">Aggregators mark up WhatsApp fees by 300%. We let you plug in your own API keys. Pay the base rate directly. Zero markup.</p>
            </div>
            
            {/* ROI Card 2: Saved Time Metric */}
            <div className="bg-ink-50 p-8 rounded-2xl ring-1 ring-slate-200 transition-all duration-300 s-reveal hover:bg-white hover:shadow-lg hover:-translate-y-1 group" data-delay="100">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm"><Clock size={28}/></div>
                <div className="px-2.5 py-1 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-md uppercase tracking-wider group-hover:scale-105 transition-transform">3 Hrs Saved / Day</div>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-2 tracking-tight">Give Doctors Time</h3>
              <p className="text-ink-500 text-sm font-normal leading-relaxed">Your time is worth ₹1000+/hr. Stop spending it writing duplicate notes. Let the EMR auto-fill histories and generate PDFs instantly.</p>
            </div>

            {/* ROI Card 3: Shield Pulse */}
            <div className="bg-ink-50 p-8 rounded-2xl ring-1 ring-slate-200 transition-all duration-300 s-reveal hover:bg-white hover:shadow-lg hover:-translate-y-1 group" data-delay="200">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center ring-4 ring-white shadow-sm relative">
                  <ShieldCheck size={28} className="relative z-10" />
                  <div className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20"></div>
                </div>
                <div className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md uppercase tracking-wider group-hover:scale-105 transition-transform">0 Leaks</div>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-2 tracking-tight">Plug Inventory Leaks</h3>
              <p className="text-ink-500 text-sm font-normal leading-relaxed">Missing bottles add up. Track expiry dates and stop silent theft automatically with our deeply connected POS system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          INTERACTIVE COMMAND CENTER (Roles)
      ========================================= */}
      <section id="dashboards" className="py-24 bg-ink-50 border-t border-ink-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 s-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4 tracking-tight">Zero unauthorized access.</h2>
            <p className="text-base text-ink-500 font-normal">Empower your team without compromising privacy. Receptionists can't see financials. Everyone gets exactly what they need.</p>
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[500px] s-reveal">
            
            {/* Sidebar Controls (Mac-style) */}
            <div className="w-full lg:w-1/4 bg-ink-50/50 border-b lg:border-b-0 lg:border-r border-ink-200 p-4 flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
              <p className="hidden lg:block text-[10px] font-semibold text-ink-400 uppercase tracking-widest px-3 mb-2">Workspaces</p>
              {DASHBOARDS.map((dash) => (
                <button 
                  key={dash.id}
                  onClick={() => setActiveDashboard(dash)}
                  className={`flex-shrink-0 lg:w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors duration-200 ${activeDashboard.id === dash.id ? 'bg-white shadow-sm ring-1 ring-slate-200/50' : 'hover:bg-ink-100/50 opacity-70 hover:opacity-100'}`}
                >
                  <dash.icon size={16} className={`${activeDashboard.id === dash.id ? dash.color : 'text-ink-400'}`} />
                  <h4 className={`font-medium text-sm tracking-tight ${activeDashboard.id === dash.id ? 'text-ink-900' : 'text-ink-500'}`}>{dash.role}</h4>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-3/4 p-6 md:p-12 bg-white flex flex-col justify-center relative">
              <div className="mb-8 animate-fade-in-up" key={`text-${activeDashboard.id}`}>
                <h3 className="text-xl md:text-2xl font-bold text-ink-900 leading-snug mb-2 tracking-tight">{activeDashboard.role} View</h3>
                <p className="text-sm text-ink-500 font-normal leading-relaxed max-w-lg">{activeDashboard.desc}</p>
              </div>
              
              <div 
                className="relative rounded-xl ring-1 ring-slate-200/80 shadow-lg overflow-hidden cursor-zoom-in group bg-[#0F141F] animate-scale-up" 
                key={`img-${activeDashboard.id}`}
                onClick={() => setLightboxImg(activeDashboard.img)}
              >
                <div className="absolute inset-0 bg-ink-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm duration-300">
                   <ZoomIn size={32} className="text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                </div>
                {/* Fake Mac Window Header */}
                <div className="bg-[#1A1F2B] h-6 w-full border-b border-slate-800 flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div><div className="w-2 h-2 rounded-full bg-slate-600"></div><div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <Image src={activeDashboard.img} alt={`${activeDashboard.role} UI`} width={800} height={600} className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          OUR MISSION (EMOTIONAL STORY) - Restored & Beautified
      ========================================= */}
      <section id="story" className="py-24 md:py-32 bg-white overflow-hidden relative border-t border-ink-200">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            <div className="md:col-span-5 relative s-reveal">
              <div className="aspect-[4/5] w-full max-w-sm mx-auto bg-ink-100 rounded-[2rem] overflow-hidden relative shadow-2xl ring-1 ring-slate-200 -rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image src="/rahul.jpeg" alt="Rahul Chauhan - Founder" fill className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" sizes="(max-w-768px) 100vw, 50vw" />
              </div>
              {/* Floating Promise Tag */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white p-5 rounded-2xl shadow-xl ring-1 ring-slate-100 z-10 animate-float-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600"><HeartHandshake size={24} /></div>
                  <div className="pr-4">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">My Promise</p>
                      <p className="text-sm font-bold text-ink-900">0% Commission. Forever.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 s-reveal" data-delay="100">
              <h3 className="text-4xl md:text-5xl font-bold text-ink-900 mb-8 leading-tight tracking-tight text-balance">
                I saw doctors burning out from management, <span className="text-ink-400 font-medium italic">not medicine.</span>
              </h3>
              
              <div className="space-y-6 text-base md:text-lg text-ink-500 leading-relaxed font-normal">
                <p>Hi, I'm <strong className="text-ink-900 font-bold">Rahul Chauhan.</strong> As an engineer, I build complex systems. But when I sat in the clinics of brilliant Vaidyas, I saw something heartbreaking.</p>
                <p>Highly educated doctors were buried under messy Excel sheets, stressing over tallying the pharmacy drawer, and paying a massive <strong className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded ring-1 ring-rose-200">20% "tax"</strong> to corporate aggregators just to exist online.</p>
                <p>What made me angriest? Software companies forcing clinics to use *their* messaging APIs, marking up the cost of a simple WhatsApp reminder by 300%. It’s a hidden tax on your growth.</p>
                <p>I built VAIDYA ERP to be completely transparent. You plug in your own Meta API keys. You pay Meta directly. No investors pushing for higher fees. Just pure, honest technology built to give you your evenings back.</p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-ink-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-ink-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-slate-100">RC</div>
                <div>
                  <p className="font-bold text-ink-900 text-lg tracking-tight">Rahul Chauhan</p>
                  <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mt-1">Founder & Lead Engineer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          TESTIMONIALS SECTION
      ========================================= */}
      <section className="py-24 bg-ink-50 border-t border-ink-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 s-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 tracking-tight">What clinic owners are saying</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl ring-1 ring-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 s-reveal" data-delay={idx * 100}>
                <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center text-sm font-bold mb-6 ring-1 ring-sky-100">
                  {testimonial.avatar}
                </div>
                <p className="text-ink-500 text-sm leading-relaxed italic mb-6 font-normal">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-ink-50 pt-4">
                  <h4 className="text-sm font-bold text-ink-900 mb-0.5">{testimonial.name}</h4>
                  <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">{testimonial.title} · {testimonial.clinic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          NABH ALIGNMENT SECTION
      ========================================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 s-reveal">
        <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-primary-900 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/10 text-white rounded-full text-[11px] font-bold mb-6 w-fit tracking-wide">
              <ShieldCheck size={13} /> BUILT AROUND NABH RECORD-KEEPING PRINCIPLES
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4 max-w-2xl">
              Registration and discharge, the way accreditation actually expects it
            </h2>
            <p className="text-ink-300 max-w-2xl mb-10 leading-relaxed">
              Most clinic software treats every visit the same. VAIDYA ERP separates OPD, IPD, and Day Care as distinct registers with their own sequential numbering — because that's how a real hospital filing system, and NABH assessors, expect patient records to be organized.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "One UHID, for life", desc: "A single Unique Health ID follows the patient across every visit, permanently." },
                { title: "Separate OPD/IPD/Day Care registers", desc: "Each with its own sequential registration number, resetting yearly." },
                { title: "Full discharge summaries", desc: "Condition at discharge, advice given, and complete episode history in one document." },
                { title: "Traceable admissions", desc: "Every OPD→IPD conversion is logged: who, when, and the exact number change." },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-sm font-bold text-white mb-1.5">{item.title}</p>
                  <p className="text-xs text-ink-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-ink-400 mt-8">
              This describes the record-keeping structure VAIDYA ERP implements — it is not a claim of NABH certification for your facility, which remains a separate accreditation process.
            </p>
            <Link href="/nabh-compliance" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white mt-6 hover:underline">
              See the full breakdown <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          PRICING SECTION (Elegant Redesign)
      ========================================= */}
      <section id="pricing" className="bg-[#FAFAFA] max-w-6xl mx-auto px-6 py-24 md:py-32 border-t border-ink-200">
        <div className="text-center max-w-2xl mx-auto mb-16 s-reveal">
          <h2 className="text-3xl md:text-5xl font-bold text-ink-900 mb-4 tracking-tight">Indian Pricing. Global Standard.</h2>
          <p className="text-base text-ink-500 font-normal">No hidden API fees. No aggregator taxes. Upgrade anytime.</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-12 s-reveal delay-100">
          <div className="bg-ink-100/50 p-1.5 rounded-full inline-flex items-center ring-1 ring-slate-200 shadow-inner">
            <button onClick={() => setBillingCycle("monthly")} className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all duration-300 ${billingCycle === "monthly" ? "bg-white text-ink-900 shadow-sm ring-1 ring-slate-200" : "text-ink-500 hover:text-ink-900"}`}>Pay Monthly</button>
            <button onClick={() => setBillingCycle("annually")} className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-2 ${billingCycle === "annually" ? "bg-ink-900 text-white shadow-md" : "text-ink-500 hover:text-ink-900"}`}>
              Pay Annually <span className={billingCycle === "annually" ? "text-emerald-300 bg-emerald-900/50 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold" : "text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold"}>Save 2 Months</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Basic Plan */}
          <div className="s-reveal delay-200 h-full">
            <div className={`h-full p-8 md:p-10 rounded-[2rem] ring-1 transition-all duration-300 flex flex-col bg-white ${selectedTier === "basic" ? "ring-primary-400 shadow-xl md:scale-[1.02] z-10" : "ring-slate-200 hover:ring-slate-300 cursor-pointer shadow-sm"}`} onClick={() => setSelectedTier("basic")}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-ink-900 mb-1 tracking-tight">Starter Clinic</h3>
                <p className="text-ink-500 font-medium text-sm">Perfect for solo doctors & new clinics.</p>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-ink-900 tracking-tighter">₹{billingCycle === "monthly" ? pricing.basic.monthly.toLocaleString('en-IN') : pricing.basic.annually.toLocaleString('en-IN')}</span>
                <span className="text-ink-500 font-medium text-sm">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              <p className="text-xs font-bold text-primary-600 mb-6 bg-primary-50 w-fit px-3 py-1 rounded-md ring-1 ring-primary-100">~ ₹{Math.round((billingCycle === "monthly" ? pricing.basic.monthly : pricing.basic.annually / 12) / 30)} / day</p>

              <div className="pb-6 border-b border-ink-100"></div>
              
              <ul className="mt-6 space-y-4 flex-1">
                {FEATURE_COMPARISON.map((f, i) => (
                  <li key={i} className={`flex items-start gap-3 font-medium text-sm ${f.basic ? 'text-ink-600' : 'text-ink-400'}`}>
                    {f.basic ? <Check size={18} className="text-ink-900 shrink-0 mt-0.5" strokeWidth={3} /> : <X size={18} className="text-ink-300 shrink-0 mt-0.5" strokeWidth={3} />} 
                    <span className={!f.basic ? 'line-through decoration-slate-300 decoration-1 opacity-70' : ''}>
                      {typeof f.basic === 'string' ? f.basic : f.feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button onClick={(e) => { e.stopPropagation(); handleDirectSubscribe("BASIC", billingCycle); }} className={`w-full py-4 mt-8 rounded-xl font-bold transition-all text-sm tracking-wide ${selectedTier === "basic" ? "bg-ink-900 text-white hover:bg-slate-800 shadow-md hover:-translate-y-0.5" : "bg-ink-50 ring-1 ring-slate-200 text-ink-600 hover:bg-ink-100"}`}>
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="s-reveal delay-300 h-full">
            <div className={`h-full p-8 md:p-10 rounded-[2rem] ring-1 relative transition-all duration-300 flex flex-col overflow-hidden ${selectedTier === "premium" ? "ring-slate-800 bg-[#040814] shadow-2xl md:scale-[1.05] z-20 text-white" : "ring-slate-200 bg-white hover:ring-slate-300 cursor-pointer shadow-sm"}`} onClick={() => setSelectedTier("premium")}>
              
              {selectedTier === "premium" && (
                <>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-b-lg text-[9px] font-bold uppercase tracking-widest shadow-md">Most Popular</div>
                </>
              )}
              
              <div className="mb-6 mt-4 relative z-10">
                <h3 className={`text-2xl font-bold mb-1 tracking-tight ${selectedTier === "premium" ? "text-white" : "text-ink-900"}`}>Polyclinic / Pro</h3>
                <p className={`text-sm font-medium ${selectedTier === "premium" ? "text-ink-400" : "text-ink-500"}`}>For multi-doctor hospitals wanting full control.</p>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2 relative z-10">
                <span className={`text-5xl font-bold tracking-tighter ${selectedTier === "premium" ? "text-white" : "text-ink-900"}`}>₹{billingCycle === "monthly" ? pricing.premium.monthly.toLocaleString('en-IN') : pricing.premium.annually.toLocaleString('en-IN')}</span>
                <span className={`font-medium text-sm ${selectedTier === "premium" ? "text-ink-500" : "text-ink-500"}`}>/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              <p className={`text-xs font-bold mb-6 w-fit px-3 py-1 rounded-md relative z-10 ring-1 ${selectedTier === "premium" ? "bg-primary-500/10 text-primary-400 ring-primary-500/30" : "bg-primary-50 text-primary-600 ring-primary-100"}`}>~ ₹{Math.round((billingCycle === "monthly" ? pricing.premium.monthly : pricing.premium.annually / 12) / 30)} / day</p>

              <div className={`pb-6 border-b ${selectedTier === "premium" ? "border-slate-800" : "border-ink-100"} relative z-10`}></div>
              
              <ul className="mt-6 space-y-4 flex-1 relative z-10">
                {FEATURE_COMPARISON.map((f, i) => (
                  <li key={i} className={`flex items-start gap-3 font-medium text-sm ${selectedTier === "premium" ? "text-ink-300" : "text-ink-600"}`}>
                    <Check size={18} className={`shrink-0 mt-0.5 ${selectedTier === "premium" ? "text-white" : "text-ink-900"}`} strokeWidth={3} />
                    {typeof f.premium === 'string' ? f.premium : f.feature}
                  </li>
                ))}
              </ul>
              
              <button onClick={(e) => { e.stopPropagation(); handleDirectSubscribe("PREMIUM", billingCycle); }} className={`w-full py-4 mt-8 rounded-xl font-bold transition-all text-sm tracking-wide relative z-10 ${selectedTier === "premium" ? "bg-white text-ink-900 hover:bg-ink-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5" : "bg-ink-50 ring-1 ring-slate-200 text-ink-600 hover:bg-ink-100"}`}>
                Claim 3 Months Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white border-t border-ink-200 px-6">
        <div className="max-w-3xl mx-auto s-reveal">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4 tracking-tight">Got Questions?</h2>
          </div>
          
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#FAFAFA] ring-1 ring-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:ring-slate-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left font-semibold text-ink-900 flex justify-between items-center text-sm md:text-base hover:text-ink-900 transition-colors"
                >
                  {faq.q}
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openFaq === i ? 'bg-ink-100 text-ink-900' : 'bg-transparent text-ink-400'}`}>
                    {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-ink-500 font-normal text-sm leading-relaxed border-t border-ink-100 pt-4 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 border-t border-ink-200 bg-[#FAFAFA]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="s-reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-ink-900 mb-6 tracking-tight leading-tight text-balance">Let's upgrade your clinic's workflow.</h2>
            <p className="text-base md:text-lg text-ink-500 mb-10 font-normal leading-relaxed text-balance">Need a custom plan for a massive hospital? Drop us a message below or call us directly. Real humans, no bots.</p>
            <div className="space-y-4">
              <a href="mailto:hello@vaidyaerp.com" className="flex items-center gap-5 p-5 bg-white ring-1 ring-slate-200 rounded-2xl hover:ring-primary-300 transition-all duration-300 group hover:shadow-md">
                <div className="w-12 h-12 bg-ink-50 shadow-sm text-ink-600 rounded-xl flex items-center justify-center ring-1 ring-slate-100 group-hover:text-primary-600 transition-colors duration-300"><Mail className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-ink-900 text-base">Email Us</h3><p className="text-ink-500 font-medium text-sm mt-0.5">hello@vaidyaerp.com</p></div>
              </a>
              <a href="tel:+917009646377" className="flex items-center gap-5 p-5 bg-white ring-1 ring-slate-200 rounded-2xl hover:ring-primary-300 transition-all duration-300 group hover:shadow-md">
                <div className="w-12 h-12 bg-ink-50 shadow-sm text-ink-600 rounded-xl flex items-center justify-center ring-1 ring-slate-100 group-hover:text-primary-600 transition-colors duration-300"><Phone className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-ink-900 text-base">Call Our Team</h3><p className="text-ink-500 font-medium text-sm mt-0.5">+91 7009646377</p></div>
              </a>
            </div>
          </div>

          <div className="bg-[#040814] text-white shadow-2xl rounded-[2rem] p-8 md:p-12 relative overflow-hidden s-reveal delay-100 ring-1 ring-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none"></div>
            <h3 className="text-3xl font-bold mb-8 relative z-10 tracking-tight">Request a Callback</h3>
            {contactSubmitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center relative z-10 animate-fade-in-up">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 rounded-full flex items-center justify-center mb-6"><Check className="w-10 h-10" /></div>
                <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Message Received!</h4>
                <p className="text-ink-400 font-medium text-sm">Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-[10px] font-bold text-ink-400 mb-2 uppercase tracking-widest">Name / Clinic</label>
                  <input type="text" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} required disabled={isSubmitting} className="w-full px-5 py-4 bg-white/5 ring-1 ring-white/10 rounded-xl focus:ring-primary-500 focus:outline-none transition-colors text-white placeholder-slate-600 text-sm disabled:opacity-50" placeholder="Dr. Rajesh Sharma" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-400 mb-2 uppercase tracking-widest">Phone Number</label>
                  {/* Note: Updated from 'email' to 'phone' to correctly match the state mapping */}
                  <input type="text" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} required disabled={isSubmitting} className="w-full px-5 py-4 bg-white/5 ring-1 ring-white/10 rounded-xl focus:ring-primary-500 focus:outline-none transition-colors text-white placeholder-slate-600 text-sm disabled:opacity-50" placeholder="+91 98765 XXXXX" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-400 mb-2 uppercase tracking-widest">How can we help?</label>
                  <textarea value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} required disabled={isSubmitting} rows={3} className="w-full px-5 py-4 bg-white/5 ring-1 ring-white/10 rounded-xl focus:ring-primary-500 focus:outline-none transition-colors text-white placeholder-slate-600 text-sm resize-none disabled:opacity-50" placeholder="I run a polyclinic..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-white text-ink-900 font-bold text-sm rounded-xl hover:bg-ink-100 transition-all duration-300 disabled:opacity-70 flex items-center justify-center hover:-translate-y-0.5 shadow-lg">
                  {isSubmitting ? "Sending..." : "Request Callback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
