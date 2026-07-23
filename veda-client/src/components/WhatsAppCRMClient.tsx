"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { 
  ArrowLeft, MessageCircle, PhoneCall, FileText, 
  ArrowRight, Smartphone, Zap, CheckCircle2, Clock, Users
} from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function WhatsAppCRMPage() {
  const [scrolled, setScrolled] = useState(false);

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
    const message = encodeURIComponent(`Hi Rahul! I was looking at the WhatsApp CRM feature on the website. I'd like to book a demo to see how it works!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-28 font-sans text-slate-800 bg-[#FCFDFD] selection:bg-emerald-100 selection:text-emerald-900">
      
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
        .glass-nav { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      `}} />

      {/* FLOATING WHATSAPP CTA */}
      <button onClick={() => handleWhatsAppSubscribe()} className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center group">
        <MessageCircle size={28} />
      </button>

      {/* =========================================
          NAVBAR (Matched to Homepage)
      ========================================= */}
     

      {/* =========================================
          HERO SECTION 
      ========================================= */}
      <section className="pt-32 md:pt-48 pb-20 overflow-hidden relative border-b border-slate-100">
        {/* Background Gradients (Emerald & Blue mix for WhatsApp vibe) */}
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-50/60 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 luxury-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-emerald-100/50 shadow-sm">
            <MessageCircle size={16} className="text-emerald-600" /> Smart Clinic Marketing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Stop juggling three <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary-600">different mobile phones.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
            VAIDYA integrates a powerful dialing and WhatsApp system right into your browser. Convert casual inquiries into loyal, paying patients without the chaos.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleWhatsAppSubscribe()} className="px-10 py-5 bg-emerald-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg">
              Book a Live Demo <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          THE PROBLEM VS SOLUTION 
      ========================================= */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Visual Mockup (Chat UI) */}
            <div className="relative flex justify-center luxury-reveal">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-primary-50 rounded-full blur-[80px] opacity-70 transform scale-90 -z-10"></div>
              
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[400px] flex flex-col z-10 hover:-translate-y-2 transition-transform duration-700">
                
                {/* Chat Header */}
                <div className="w-full flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-lg">R</div>
                  <div className="flex-1">
                    <p className="text-base font-extrabold text-slate-800">Rahul Sharma</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center"><PhoneCall size={14}/></div>
                </div>

                {/* Chat Body */}
                <div className="flex flex-col gap-4 mb-6">
                  {/* Received Message */}
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">R</div>
                    <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                      <div className="h-2 w-full bg-slate-300 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Sent Message (PDF) */}
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 shrink-0 flex items-center justify-center"><img src="/logo.png" alt="V" className="w-4 h-4 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} /></div>
                    <div className="bg-emerald-500 rounded-2xl rounded-br-none p-4 max-w-[80%] shadow-md">
                      <div className="flex items-center gap-3 mb-3 bg-emerald-600/30 p-2.5 rounded-xl border border-emerald-400/30">
                        <FileText size={20} className="text-white"/>
                        <div>
                          <p className="text-xs font-bold text-white">Diet_Chart.pdf</p>
                          <p className="text-[9px] text-emerald-100">1.2 MB</p>
                        </div>
                      </div>
                      <div className="h-2 w-3/4 bg-emerald-200/50 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="w-full bg-slate-50 border border-slate-200 rounded-full h-12 flex items-center px-4 mt-auto">
                  <p className="text-xs text-slate-400 font-medium">Type a message...</p>
                  <div className="ml-auto w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <ArrowRight size={14} className="text-white"/>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className="absolute -right-8 top-1/2 bg-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow z-20">
                   <CheckCircle2 size={20} className="text-emerald-500" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Delivered</p>
                     <p className="text-sm font-bold text-slate-800">Diet Chart Sent</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="luxury-reveal" data-delay="200">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Centralize your clinic's communication instantly.</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Are your telecallers typing out the same messages over and over? Missing follow-ups because a clinic phone was dead or disconnected from WhatsApp Web? 
                <br/><br/>
                We put an end to that. Send diet charts, prescriptions, and appointment reminders automatically without ever picking up a physical device.
              </p>

              <ul className="space-y-6 border-t border-slate-100 pt-8">
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><Smartphone size={18} className="text-emerald-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">No Physical Phone Required</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Powered by official Cloud APIs. Your staff can chat directly from their computer screens without scanning QR codes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Clock size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Automated Appointment Reminders</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Slash your no-show rates. The system automatically messages patients a day before their scheduled visit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5"><FileText size={18} className="text-purple-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">1-Click Documents & Prescriptions</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">When the doctor finishes the consultation, the prescription PDF is instantly dropped into the patient's WhatsApp.</p>
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
      <section className="py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20 luxury-reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Turn inquiries into patients.</h2>
            <p className="text-xl text-slate-500 mt-4 font-medium">A seamless pipeline for your front desk and telecallers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="0">
              <div className="text-5xl font-black text-emerald-100 mb-8">01</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Lead Arrives</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base">A new inquiry comes in from your website, social media, or a walk-in. They instantly drop into the VAIDYA telecaller pipeline.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="150">
              <div className="text-5xl font-black text-emerald-100 mb-8">02</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1-Click Engage</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base">Your telecaller hits 'Call' to trigger the browser dialer, or clicks 'Message' to open the built-in WhatsApp chat interface.</p>
            </div>

            {/* Step 3 (Highlight) */}
            <div className="bg-slate-900 p-10 rounded-[2rem] shadow-xl border border-slate-800 luxury-reveal text-white" data-delay="300">
              <div className="text-5xl font-black text-emerald-500 mb-8">03</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Automated Follow-ups</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-base">Once converted, the system takes over. It sends appointment reminders, clinic location pins, and follow-up care instructions automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION
      ========================================= */}
      <section className="py-32 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center luxury-reveal">
          <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
            <Users size={40} />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Ready to fix your patient communication?</h2>
          <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Stop losing leads to disorganized spreadsheets and dead phones. Give your team the ultimate clinic marketing tool.
          </p>
          <button onClick={() => handleWhatsAppSubscribe()} className="px-12 py-5 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-emerald-600 transition-all duration-300 text-lg flex items-center gap-3 mx-auto">
            See the CRM Dashboard Live <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* =========================================
          FOOTER (Reused from Homepage)
      ========================================= */}
   

    </div>
  );
}