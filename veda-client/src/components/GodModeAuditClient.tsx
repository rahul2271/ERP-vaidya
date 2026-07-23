"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Fingerprint, ShieldAlert, Lock, 
  Database, UserCheck, ArrowRight, ShieldCheck, 
  Search, AlertTriangle, Eye, Check, MessageCircle
} from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function GodModeAuditPage() {
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // 🚀 LUXURY SCROLL REVEAL ENGINE
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || '0';
          setTimeout(() => {
            entry.target.classList.add('is-revealed');
          }, parseInt(delay));
        }
      });
    }, observerOptions);

    document.querySelectorAll('.luxury-reveal').forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const branding = DEFAULT_BRANDING || { brandName: "VAIDYA ERP" };

  const handleWhatsAppSubscribe = () => {
    const phoneNumber = "917009646377"; 
    const message = encodeURIComponent(`Hi Rahul! I want to secure my clinic's data. I'd like to book a demo to see the God Mode Audit Trail in VAIDYA ERP.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { 
      setContactSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => { setContactForm({ name: "", email: "", message: "" }); setContactSubmitted(false); }, 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 font-sans text-slate-800 bg-[#FAFAFA] selection:bg-primary-100 selection:text-primary-900">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .luxury-reveal {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .luxury-reveal.is-revealed { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        
        .glass-nav { 
          background: rgba(250, 250, 250, 0.85); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px); 
        }
      `}} />

      {/* FLOATING WHATSAPP CTA */}
      <button onClick={() => handleWhatsAppSubscribe()} className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center group">
        <MessageCircle size={28} />
      </button>

      {/* =========================================
          CLINICAL NAVBAR
      ========================================= */}
      

      {/* =========================================
          HERO SECTION (Medical Trust Blue/Teal)
      ========================================= */}
      <section className="pt-32 md:pt-48 pb-20 overflow-hidden relative bg-white border-b border-slate-200/60">
        {/* Clinical Ambient Glows */}
        <div className="absolute top-[-10%] left-[10%] w-[60%] h-[60%] bg-primary-50/80 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[0%] w-[50%] h-[50%] bg-primary-50/60 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 luxury-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-primary-100 shadow-sm">
            <Fingerprint size={16} className="text-primary-600" /> Absolute Peace of Mind
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.15] mb-8 tracking-tight">
            Catch every deleted bill. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-600">Instantly.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
            VAIDYA ERP acts as an unblinking security camera for your clinic's data. Every login, logout, edit, and deletion is permanently logged with the exact user and IP address.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleWhatsAppSubscribe()} className="px-10 py-5 bg-primary-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg">
              Secure your clinic <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          THE PROBLEM VS SOLUTION (Clinical UI)
      ========================================= */}
      <section className="py-24 bg-[#FAFAFA] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Clinical Visual Mockup */}
            <div className="relative flex justify-center luxury-reveal">
              {/* Clean clinical drop shadow behind card */}
              <div className="absolute inset-0 bg-primary-900/5 rounded-[3rem] blur-2xl transform scale-90 -z-10"></div>
              
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-[420px] aspect-[4/5] flex flex-col z-10 hover:-translate-y-2 transition-transform duration-700">
                <div className="w-full flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><ShieldAlert size={20}/></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Log</p>
                      <p className="text-lg font-extrabold text-slate-900">Master Audit Trail</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100"><Search size={16} className="text-slate-400"/></div>
                </div>

                {/* Audit Log List Mockup */}
                <div className="flex flex-col gap-4 flex-1">
                  {/* Alert Item (Deleted) - Intentionally kept Rose for UI Context */}
                  <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 flex gap-4 items-start shadow-sm">
                    <div className="mt-1 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle size={14}/></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-rose-700 mb-1">Invoice #4092 Deleted</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1.5"><UserCheck size={12}/> Rajesh (Front Desk)</span>
                        <span>14:32 PM</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">IP: 192.168.1.10</p>
                    </div>
                  </div>

                  {/* Normal Item (Edited) */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white flex gap-4 items-start shadow-sm">
                    <div className="mt-1 w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Lock size={14}/></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">Patient History Altered</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1.5"><UserCheck size={12}/> Dr. Sharma</span>
                        <span>10:15 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Normal Item (Login) */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white flex gap-4 items-start shadow-sm">
                    <div className="mt-1 w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Check size={14}/></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">System Login Success</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1.5"><UserCheck size={12}/> Reception_PC_1</span>
                        <span>08:50 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification (Authentic Success Teal) */}
                <div className="absolute -right-8 bottom-12 bg-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float-slow z-20">
                   <ShieldCheck size={24} className="text-primary-600" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immutable</p>
                     <p className="text-sm font-black text-slate-800">Log Secured</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="luxury-reveal" data-delay="200">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Total visibility into your clinic's operations.</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Have you ever wondered who deleted a bill or altered a patient record when you weren't looking? Or why the pharmacy register doesn't match the cash drawer?
                <br/><br/>
                End the mystery. VAIDYA's God Mode gives clinic owners an unalterable, behind-the-scenes look at exactly what is happening in their business.
              </p>

              <ul className="space-y-6 border-t border-slate-200 pt-8">
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Database size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Immutable Data</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Audit logs cannot be edited, paused, or deleted by anyone—not even by the clinic administrators.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Eye size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Network & IP Tracking</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Know exactly which device and Wi-Fi network was used to make an alteration to prevent remote unauthorized access.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><UserCheck size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Staff Accountability</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Eliminates finger-pointing. When an error occurs, you will know exactly who was logged in and responsible.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS (Step by Step)
      ========================================= */}
      <section className="py-32 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20 luxury-reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How the magic happens.</h2>
            <p className="text-xl text-slate-500 mt-4 font-medium">Zero finger-pointing. Just undeniable facts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="0">
              <div className="text-5xl font-black text-slate-200 mb-8">01</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Action is Taken</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">A staff member logs into the system and performs an action, such as deleting an old invoice, editing a prescription, or applying a massive discount.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="150">
              <div className="text-5xl font-black text-slate-200 mb-8">02</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Secret Record Created</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">Behind the scenes, the VAIDYA backend instantly generates an encrypted audit row capturing the exact timestamp, the user's ID, and their network IP address.</p>
            </div>

            {/* Step 3 (Highlight) */}
            <div className="bg-primary-600 p-10 rounded-[2rem] shadow-2xl border border-primary-500 luxury-reveal text-white" data-delay="300">
              <div className="text-5xl font-black text-primary-400 mb-8">03</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Full Admin Control</h3>
              <p className="text-primary-100 leading-relaxed font-medium text-base">As the clinic owner, you open the 'God Mode' dashboard. You can instantly filter the master log by date, user, or action type to find exactly what happened.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION
      ========================================= */}
      <section className="py-32 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center luxury-reveal">
          <div className="w-24 h-24 bg-white border border-slate-200 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
            <Lock size={40} />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Ready to lock down your clinic's data?</h2>
          <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Stop losing sleep over missing inventory and untracked discounts. Protect your revenue today.
          </p>
          <button onClick={() => handleWhatsAppSubscribe()} className="px-12 py-5 bg-primary-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 text-lg">
            See the Audit Trail Live
          </button>
        </div>
      </section>

      {/* =========================================
          PREMIUM DARK FOOTER
      ========================================= */}
      

    </div>
  );
}