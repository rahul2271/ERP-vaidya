"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; 
import { DEFAULT_BRANDING } from "@/config/branding.config";
import { MessageCircle, Sparkles, ArrowRight, Menu, X, Play, ChevronDown } from "lucide-react";

export default function Header() {
  const pathname = usePathname(); 
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const branding = DEFAULT_BRANDING || { brandName: "VAIDYA ERP" };

  const isHiddenPage = pathname === "/login" || pathname === "/signup" || pathname?.startsWith("/dashboard");
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleWhatsAppSubscribe = () => {
    const phoneNumber = "917009646377"; 
    const message = encodeURIComponent(`Hi Rahul! I'm tired of my clinic's messy workflow. I'd like to book a VAIDYA ERP demo.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleMobileNavClick = (targetId: string) => {
    setIsMobileMenuOpen(false);
    
    if (!isHomePage) {
      window.location.href = `/#${targetId}`;
      return;
    }

    setTimeout(() => {
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
    }, 300);
  };

  if (isHiddenPage) return null;

  // Global styling locked to the Premium Dark Theme
  const navBgClass = 'bg-[#040814]/95 backdrop-blur-xl border-b border-white/5 shadow-sm py-2';
  const linkContainerClass = 'bg-white/5 border-white/5';
  const linkTextClass = 'text-ink-300 hover:text-white font-medium';
  const btnClass = 'bg-white text-ink-900 hover:bg-ink-100 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]';
  const menuIconColor = 'text-white';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-menu-glass {
          background: rgba(4, 8, 20, 0.95); 
          backdrop-filter: blur(30px); 
          -webkit-backdrop-filter: blur(30px); 
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient-x 6s linear infinite;
        }
      `}} />

      <button onClick={handleWhatsAppSubscribe} className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border border-[#25D366]/40 hover:bg-[#20bd5a]">
        <span className="absolute right-full mr-4 bg-ink-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-lg hidden md:block">
          Talk to our Team
        </span>
        <MessageCircle size={24} />
      </button>

      <header className="fixed top-0 left-0 w-full z-50 flex flex-col">
        
        <div className={`w-full relative overflow-hidden transition-all duration-500 ease-in-out ${scrolled ? 'h-0 opacity-0' : 'h-[40px] opacity-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 via-sky-600/90 to-primary-600/90 bg-[length:200%_auto] animate-gradient"></div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 cursor-pointer hover:bg-white/5 transition-colors group" onClick={handleWhatsAppSubscribe}>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-white tracking-wide">
              <Sparkles size={14} className="text-primary-200 shrink-0" />
              <span>We only onboard <strong className="font-bold border-b border-primary-200 border-dashed pb-0.5">15 clinics per month</strong>. 4 slots remaining.</span>
              <ArrowRight size={14} className="ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:block" />
            </div>
          </div>
        </div>

        <nav className={`w-full transition-all duration-500 ease-in-out relative z-50 ${navBgClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center relative">
            
            {/* LOGO SECTION: Natural sizing, white logo, dark background */}
            <Link href="/" className="flex items-center group cursor-pointer shrink-0 z-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <Image 
                  src="/logo.png" 
                  alt={`${branding.brandName} Logo`}
                  width={180} 
                  height={48} 
                  className="object-contain object-left transition-all duration-300" 
                  priority 
                />
              </div>
            </Link>

            <button 
              className={`md:hidden p-2 z-50 ${menuIconColor}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} />}
            </button>
            
            <div className={`hidden md:flex gap-8 items-center px-6 py-2.5 rounded-full border backdrop-blur-md ml-auto mr-8 transition-colors ${linkContainerClass}`}>
              <button onClick={() => handleMobileNavClick('dashboards')} className={`text-xs tracking-wide transition-colors ${linkTextClass}`}>Platform</button>
              <button onClick={() => handleMobileNavClick('features')} className={`text-xs tracking-wide transition-colors ${linkTextClass}`}>Features</button>

              <div className="relative group">
                <button className={`text-xs tracking-wide transition-colors flex items-center gap-1 ${linkTextClass}`}>
                  Solutions <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200/60 p-2">
                    {[
                      { href: "/ai-prakriti", label: "AI Prakriti Dashboard" },
                      { href: "/digital-emr", label: "1-Click Digital EMR" },
                      { href: "/whatsapp-crm", label: "WhatsApp CRM" },
                      { href: "/pharmacy-pos", label: "Pharmacy POS" },
                      { href: "/god-mode-audit", label: "God Mode Security Audit" },
                      { href: "/nabh-compliance", label: "NABH Alignment" },
                    ].map(item => (
                      <Link key={item.href} href={item.href} className="block px-4 py-2.5 rounded-xl text-xs font-medium text-ink-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => handleMobileNavClick('compare')} className={`text-xs tracking-wide transition-colors ${linkTextClass}`}>Why Us</button>
              <button onClick={() => handleMobileNavClick('pricing')} className={`text-xs tracking-wide transition-colors ${linkTextClass}`}>Pricing</button>
              <Link href="/blog" className={`text-xs tracking-wide transition-colors ${linkTextClass}`}>Blog</Link>
            </div>
            
            <div className="hidden md:flex gap-4 items-center shrink-0">
              <Link href="/login" className={`px-4 py-2 text-xs tracking-wide transition-colors ${linkTextClass}`}>
                Log in
              </Link>
              <button onClick={handleWhatsAppSubscribe} className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${btnClass}`}>
                Book Demo
              </button>
            </div>

          </div>
        </nav>

        <div className={`md:hidden fixed inset-0 z-40 mobile-menu-glass transition-all duration-500 ease-in-out flex flex-col ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex-1 flex flex-col pt-32 px-6 pb-10 overflow-y-auto">
            
            <div className="flex flex-col gap-6 text-center mt-auto mb-auto">
              <button onClick={() => handleMobileNavClick('dashboards')} className="text-2xl font-bold text-white tracking-tight">Platform</button>
              <button onClick={() => handleMobileNavClick('features')} className="text-2xl font-bold text-white tracking-tight">Features</button>

              <div className="pt-2 pb-1">
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">Solutions</p>
                <div className="flex flex-col gap-4">
                  {[
                    { href: "/ai-prakriti", label: "AI Prakriti Dashboard" },
                    { href: "/digital-emr", label: "1-Click Digital EMR" },
                    { href: "/whatsapp-crm", label: "WhatsApp CRM" },
                    { href: "/pharmacy-pos", label: "Pharmacy POS" },
                    { href: "/god-mode-audit", label: "God Mode Security Audit" },
                    { href: "/nabh-compliance", label: "NABH Alignment" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} className="text-base font-semibold text-white/80 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <button onClick={() => handleMobileNavClick('compare')} className="text-2xl font-bold text-white tracking-tight">Why Us</button>
              <button onClick={() => handleMobileNavClick('pricing')} className="text-2xl font-bold text-white tracking-tight">Pricing</button>
              <Link href="/blog" className="text-2xl font-bold text-white tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            </div>

            <div className="mt-auto space-y-4">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-4 rounded-xl border border-slate-700 text-white font-semibold text-lg"
              >
                Log into Clinic
              </Link>
              <button 
                onClick={handleWhatsAppSubscribe} 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
              >
                <Play size={18} fill="currentColor"/> Book a Demo
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}