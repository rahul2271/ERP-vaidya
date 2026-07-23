"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, FileText, ArrowRight, ShieldCheck, 
  CheckCircle2, Clock, MessageCircle, Stethoscope, 
  Activity, FileSignature, Send, HeartPulse, Pill, ShoppingCart, Download
} from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function DigitalEMRPage() {
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
    const message = encodeURIComponent(`Hi Rahul! My doctors hate typing and we are losing pharmacy sales to outside chemists. I'd like to book a demo to see the 1-Click EMR in VAIDYA ERP.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-28 font-sans text-slate-800 bg-[#FAFAFA] selection:bg-cyan-100 selection:text-cyan-900">
      
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
          HERO SECTION (Medical Trust Blue/Cyan)
      ========================================= */}
      <section className="pt-32 md:pt-48 pb-20 overflow-hidden relative bg-white border-b border-slate-200/60">
        {/* Clinical Ambient Glows */}
        <div className="absolute top-[-10%] left-[10%] w-[60%] h-[60%] bg-primary-50/80 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[0%] w-[50%] h-[50%] bg-cyan-50/60 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 luxury-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-primary-100 shadow-sm">
            <ShieldCheck size={16} className="text-primary-600" /> Stops Pharmacy Leakage
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Doctors hate typing. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-600">Let them focus on healing.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop losing medicine sales to the chemist down the street. Our 1-Click EMR pushes prescriptions directly to your internal pharmacy and sends a beautiful PDF to the patient's WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleWhatsAppSubscribe()} className="px-10 py-5 bg-primary-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg">
              See the EMR in action <ArrowRight size={20} />
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
              
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-[420px] flex flex-col z-10 hover:-translate-y-2 transition-transform duration-700">
                
                <div className="w-full flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><Stethoscope size={20}/></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">New Consultation</p>
                      <p className="text-lg font-extrabold text-slate-900">Rajesh Kumar, 34M</p>
                    </div>
                  </div>
                </div>

                {/* EMR Form Mockup */}
                <div className="flex flex-col gap-4 flex-1 mb-6">
                  
                  {/* Diagnosis Auto-complete */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnosis / Impression</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">Hyperacidity</span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">Amlapitta</span>
                    </div>
                  </div>

                  {/* 1-Click Template Selected */}
                  <div className="mt-2 p-4 rounded-2xl border border-cyan-100 bg-cyan-50/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-bold text-slate-800">Favorite Rx: Gastric Relief</p>
                      <CheckCircle2 size={16} className="text-cyan-600"/>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-600 flex items-center gap-2"><Pill size={12}/> Avipattikar Churna (1 tsp, BD)</p>
                      <p className="text-[11px] font-bold text-slate-600 flex items-center gap-2"><Pill size={12}/> Kamdudha Ras (1 tab, SOS)</p>
                    </div>
                  </div>

                  {/* 🚀 NEW: Push to Pharmacy Mockup Button */}
                  <div className="mt-2 flex gap-2">
                     <div className="flex-1 bg-purple-50 text-purple-700 border border-purple-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm">
                       <ShoppingCart size={14} /> Push to Pharmacy
                     </div>
                     <div className="w-12 bg-slate-100 text-slate-600 border border-slate-200 py-3 rounded-xl flex items-center justify-center shadow-sm">
                       <Download size={14} />
                     </div>
                  </div>

                </div>

                {/* Action Button */}
                <div className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-base shadow-[0_10px_20px_rgba(37,99,235,0.2)] cursor-pointer transition-colors">
                  <FileSignature size={20}/> Sign & WhatsApp PDF
                </div>

                {/* Floating Notification */}
                <div className="absolute -right-8 top-1/2 bg-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3 animate-float-slow z-20">
                   <ShoppingCart size={24} className="text-purple-500" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pharmacy POS</p>
                     <p className="text-sm font-black text-slate-800">Meds Packed & Billed</p>
                   </div>
                </div>

              </div>
            </div>

            {/* Right: Copy */}
            <div className="luxury-reveal" data-delay="200">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Your diagnosis, digitized in seconds.</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                We understand that every minute a doctor spends staring at a keyboard is a minute taken away from the patient. 
                <br/><br/>
                VAIDYA's predictive EMR is designed to stay out of your way. Save your most common drug combinations and generate legally compliant prescriptions instantly—while ensuring the sale stays inside your clinic.
              </p>

              <ul className="space-y-6 border-t border-slate-200 pt-8">
                {/* 🚀 NEW: Pharmacy Leakage Feature Highlight */}
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5"><ShoppingCart size={18} className="text-purple-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Stop Pharmacy Leakage</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Don't let patients walk out with a paper slip to the local chemist. Hit 'Push to Pharmacy', and your internal POS rings instantly so medicines are packed before the patient leaves the cabin.</p>
                  </div>
                </li>
                
                {/* 🚀 NEW: WhatsApp & PDF Feature Highlight */}
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5"><MessageCircle size={18} className="text-green-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Instant WhatsApp PDFs</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Patients love digital records. Generate a beautiful, branded PDF prescription and send it directly to their WhatsApp with a single click.</p>
                  </div>
                </li>

                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Clock size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Predictive Typing & Templates</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Don't type the same prescription 50 times a day. Save your favorite treatment protocols and load them instantly.</p>
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">The ultimate clinical workflow.</h2>
            <p className="text-xl text-slate-500 mt-4 font-medium">No paper. No lost medicine sales. Just speed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="0">
              <div className="text-5xl font-black text-slate-200 mb-8">01</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Vitals Pre-Loaded</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">When the doctor opens the file, the patient's vitals (BP, Weight) and their AI Prakriti quiz results are already on the screen.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="150">
              <div className="text-5xl font-black text-slate-200 mb-8">02</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1-Click Prescribe</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">The doctor selects a pre-saved treatment template or uses fast auto-complete to add medicines, dosages, and diet instructions.</p>
            </div>

            {/* Step 3 (Highlight) */}
            <div className="bg-primary-600 p-10 rounded-[2rem] shadow-2xl border border-primary-500 luxury-reveal text-white" data-delay="300">
              <div className="text-5xl font-black text-primary-400 mb-8">03</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Instant Dispatch</h3>
              <p className="text-primary-100 leading-relaxed font-medium text-base">Click "Sign". The beautiful PDF prescription is instantly sent to the patient's WhatsApp, and the medicines are reserved at your Pharmacy POS.</p>
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
            <Stethoscope size={40} />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Ready to stop pharmacy leaks?</h2>
          <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Stop losing sales to outside chemists and give your doctors the software they actually want to use.
          </p>
          <button onClick={() => handleWhatsAppSubscribe()} className="px-12 py-5 bg-slate-900 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-primary-600 transition-all duration-300 text-lg">
            See the EMR Dashboard Live
          </button>
        </div>
      </section>

    </div>
  );
}