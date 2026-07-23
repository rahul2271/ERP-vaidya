"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { 
  ArrowLeft, Brain, Clock, Languages, Activity, 
  ArrowRight, Smartphone, Zap, ShieldCheck, CheckCircle2,
  MessageCircle
} from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function AIPrakritiPage() {
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
    const message = encodeURIComponent(`Hi Rahul! I was looking at the AI Prakriti feature on the website. I'd like to book a demo to see how it works!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-28 font-sans text-slate-800 bg-[#FCFDFD] selection:bg-primary-100 selection:text-primary-900">
      
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
        {/* Background Gradients (Matched to Homepage Blue/Emerald) */}
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-100/60 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/60 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 luxury-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-primary-100/50 shadow-sm">
            <Brain size={16} className="text-primary-600" /> The Best EMR for Ayurveda
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Stop wasting 10 minutes <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-sky-600">on paper clipboards.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
            We send a beautiful, bilingual AYUSH questionnaire directly to your patient's WhatsApp before they even step into your clinic. 
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleWhatsAppSubscribe()} className="px-10 py-5 bg-primary-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg">
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
            
            {/* Left: Visual Mockup */}
            <div className="relative flex justify-center luxury-reveal">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-sky-50 rounded-full blur-[80px] opacity-70 transform scale-90 -z-10"></div>
              
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[450px] aspect-[4/5] flex flex-col items-center justify-center z-10 hover:-translate-y-2 transition-transform duration-700">
                <div className="w-full flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center"><Activity size={24}/></div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Patient Report</p>
                      <p className="text-lg font-extrabold text-slate-800">Rahul Sharma</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Analyzed</div>
                </div>

                {/* CSS Radar Chart Mockup */}
                <div className="relative w-48 h-48 rounded-full border-2 border-slate-100 flex items-center justify-center mb-8">
                  <div className="absolute w-32 h-32 rounded-full border border-slate-100"></div>
                  <div className="absolute w-16 h-16 rounded-full border border-slate-100"></div>
                  <div className="absolute w-0 h-full border-l border-slate-100"></div>
                  <div className="absolute w-full h-0 border-t border-slate-100 rotate-60"></div>
                  <div className="absolute w-full h-0 border-t border-slate-100 -rotate-60"></div>
                  
                  {/* Fake Data Polygon (Matched to Blue brand) */}
                  <svg className="absolute inset-0 w-full h-full text-primary-500/20 fill-current drop-shadow-md" viewBox="0 0 100 100">
                    <polygon points="50,15 85,75 25,80" stroke="rgba(37, 99, 235, 0.5)" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  
                  <span className="absolute -top-6 text-xs font-bold text-slate-500">VATA (45%)</span>
                  <span className="absolute -bottom-6 right-0 text-xs font-bold text-slate-500">PITTA (35%)</span>
                  <span className="absolute -bottom-6 left-0 text-xs font-bold text-slate-500">KAPHA (20%)</span>
                </div>

                <div className="w-full space-y-3 mt-4">
                  <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                  <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                </div>

                {/* Floating Notification */}
                <div className="absolute -right-8 top-32 bg-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow z-20">
                   <Smartphone size={20} className="text-emerald-500" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">WhatsApp</p>
                     <p className="text-sm font-bold text-slate-800">Quiz Completed</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="luxury-reveal" data-delay="200">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">By the time they sit down, your diagnosis has already begun.</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Traditional clinics waste precious consultation time asking routine questions. "How is your digestion? Are you sleeping well? Do you feel cold easily?"
                <br/><br/>
                We automated it. When a patient books an appointment, VAIDYA ERP automatically sends them a highly interactive, easy-to-use AYUSH questionnaire directly to their WhatsApp. 
              </p>

              <ul className="space-y-6 border-t border-slate-100 pt-8">
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Clock size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Save 10 Minutes Per Patient</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Skip the basic questions. Focus immediately on deep pulse diagnosis and treatment plans.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center shrink-0 mt-0.5"><Languages size={18} className="text-sky-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Fully Bilingual (Hindi & English)</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Breaks the language barrier. Patients answer in their preferred language, and the data syncs to your dashboard in English.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><Activity size={18} className="text-emerald-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Instant Prakriti Radar Charts</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">The system calculates the exact Vata, Pitta, and Kapha ratios and displays them visually on the doctor's screen.</p>
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How the magic happens.</h2>
            <p className="text-xl text-slate-500 mt-4 font-medium">Three simple steps. Zero extra work for your front desk.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="0">
              <div className="text-5xl font-black text-slate-100 mb-8">01</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Appointment Booked</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base">Your receptionist books the appointment in VAIDYA. Instantly, an automated WhatsApp message fires off to the patient's phone welcoming them to the clinic.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="150">
              <div className="text-5xl font-black text-slate-100 mb-8">02</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Patient Takes Quiz</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-base">They click a secure link (no app download required) and answer a highly visual, 15-question AYUSH standard questionnaire about their body, habits, and digestion.</p>
            </div>

            {/* Step 3 (Highlight) */}
            <div className="bg-slate-900 p-10 rounded-[2rem] shadow-xl border border-slate-800 luxury-reveal text-white" data-delay="300">
              <div className="text-5xl font-black text-primary-500 mb-8">03</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Doctor Gets Insights</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-base">The moment the patient submits the form, a beautiful radar chart detailing their exact Dosha imbalance pops up on the doctor's screen. Diagnosis begins instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION
      ========================================= */}
      <section className="py-32 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center luxury-reveal">
          <div className="w-24 h-24 bg-primary-50 border border-primary-100 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
            <Zap size={40} />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Ready to modernize your consultations?</h2>
          <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Stop losing time on clipboards. Give your Vaidyas the AI tools they need to focus purely on healing.
          </p>
          <button onClick={() => handleWhatsAppSubscribe()} className="px-12 py-5 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-primary-600 transition-all duration-300 text-lg flex items-center gap-3 mx-auto">
            See the AI Dashboard Live <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* =========================================
          FOOTER (Reused from Homepage)
      ========================================= */}
      

    </div>
  );
}