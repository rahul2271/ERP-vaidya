"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Pill, Receipt, ShoppingCart, 
  ArrowRight, ShieldCheck, AlertCircle, IndianRupee,
  CheckCircle2, Clock, Check, MessageCircle,
  Database
} from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export default function PharmacyPOSPage() {
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
    const message = encodeURIComponent(`Hi Rahul! I want to plug inventory leaks in my clinic. I'd like to book a demo to see the Pharmacy POS in VAIDYA ERP.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
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
            <Pill size={16} className="text-primary-600" /> Pharmacy Billing & Inventory
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Stop bleeding money <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-600">on untracked inventory.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
            VAIDYA integrates your doctor's digital prescriptions directly into a lightning-fast Pharmacy POS. Generate GST invoices, track expiring medicines, and protect your profit margins.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleWhatsAppSubscribe()} className="px-10 py-5 bg-primary-600 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg">
              Plug your inventory leaks <ArrowRight size={20} />
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
                <div className="w-full flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><ShoppingCart size={20}/></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pharmacy Queue</p>
                      <p className="text-lg font-extrabold text-slate-900">Rx: Rajesh Kumar</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black border border-amber-200 uppercase tracking-widest">Pending</div>
                </div>

                {/* Cart Items Mockup */}
                <div className="flex flex-col gap-4 flex-1">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                    <div>
                      <p className="text-base font-bold text-slate-800">Ashwagandha Churna</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Batch: B-1092 • Qty: 2</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">₹450</p>
                  </div>

                  {/* Item 2 (Medical Alert Red) */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-rose-200 bg-rose-50 shadow-sm">
                    <div>
                      <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                        Triphala Guggulu 
                        <AlertCircle size={16} className="text-rose-600"/>
                      </p>
                      <p className="text-[11px] font-bold text-rose-600 mt-1 uppercase tracking-wider">Low Stock: 4 remaining • Qty: 1</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">₹120</p>
                  </div>
                </div>

                {/* Checkout Section */}
                <div className="w-full border-t border-slate-100 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total (Inc. GST)</p>
                    <p className="text-3xl font-black text-slate-900">₹570</p>
                  </div>
                  <div className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-base shadow-[0_10px_20px_rgba(37,99,235,0.2)] cursor-pointer transition-colors">
                    <Receipt size={20}/> Generate GST Bill
                  </div>
                </div>

                {/* Floating Notification (Authentic Success Green) */}
                <div className="absolute -right-8 top-32 bg-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3 animate-float-slow z-20">
                   <ShieldCheck size={24} className="text-primary-600" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Auto-Synced</p>
                     <p className="text-sm font-black text-slate-800">From Doctor's Rx</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="luxury-reveal" data-delay="200">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Close the gap between prescription and payment.</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                In most clinics, a doctor writes a prescription on paper, the patient walks to the pharmacy, and the pharmacist manually types the medicines into a separate billing software.
                <br/><br/>
                This double data entry causes delays, human error, and stolen inventory. VAIDYA fixes this instantly. When your doctor hits "Prescribe", the exact medicines are instantly waiting in the Pharmacy POS cart.
              </p>

              <ul className="space-y-6 border-t border-slate-200 pt-8">
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><IndianRupee size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Lightning-Fast Checkout</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Generate beautiful, fully compliant GST invoices in one click. Reduce patient wait times at the billing counter.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5"><Pill size={18} className="text-primary-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Live Auto-Deduction</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">The moment a bill is generated, the exact medicine quantities are deducted from your master inventory. Zero discrepancies.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle size={18} className="text-rose-600"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Smart Expiry & Low Stock Alerts</h4>
                    <p className="text-slate-500 text-base font-medium mt-1">Never throw away expired medicine again. The system actively tracks batch dates and warns you before items expire.</p>
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How the workflow operates.</h2>
            <p className="text-xl text-slate-500 mt-4 font-medium">A perfectly synchronized process from the doctor to the pharmacist.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="0">
              <div className="text-5xl font-black text-slate-200 mb-8">01</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Doctor Prescribes</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">The doctor completes the digital EMR and selects medicines from the clinic's live database. They click "Send to Pharmacy".</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-sm luxury-reveal" data-delay="150">
              <div className="text-5xl font-black text-slate-200 mb-8">02</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Stock Auto-Reserves</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">The prescription instantly appears on the Pharmacist's POS screen. The required medicines are temporarily reserved in the inventory system.</p>
            </div>

            {/* Step 3 (Highlight) */}
            <div className="bg-primary-600 p-10 rounded-[2rem] shadow-2xl border border-primary-500 luxury-reveal text-white" data-delay="300">
              <div className="text-5xl font-black text-primary-400 mb-8">03</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Fast Checkout</h3>
              <p className="text-primary-100 leading-relaxed font-medium text-base">The pharmacist collects payment, clicks "Generate Bill", and hands over the medicines. Stock is permanently deducted, and the clinic owner's revenue vault is updated live.</p>
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
            <Database size={40} />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Ready to protect your inventory?</h2>
          <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Stop losing money on expired batches and unbilled medicines. Take control of your pharmacy today.
          </p>
          <button onClick={() => handleWhatsAppSubscribe()} className="px-12 py-5 bg-slate-900 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-primary-600 transition-all duration-300 text-lg">
            See the Pharmacy POS Live
          </button>
        </div>
      </section>

      {/* =========================================
          FOOTER (Premium Dark)
      ========================================= */}
      

    </div>
  );
}