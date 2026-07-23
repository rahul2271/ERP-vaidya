"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/utils/axiosConfig";
import { 
  LayoutDashboard, BarChart3, Users, Calendar, Pill, 
  FileText, Settings, Stethoscope, LogOut, 
  ShieldAlert, Building2, Activity, ShoppingCart, 
  Package, PhoneCall, Lock, Sparkles, UserCog, CreditCard, X, Crown, MessageCircle, Tags, Menu, FileSpreadsheet
} from "lucide-react";

interface SidebarProps {
  role?: string;
}

// 1. Comprehensive Menus for ALL Roles 
const ROLE_MENUS: Record<string, { name: string; href: string; icon: any; isPremium?: boolean; requiresFinancials?: boolean }[]> = {
  SUPER_ADMIN: [
    { name: "Master Control", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Hospitals", href: "/dashboard/hospitals", icon: Building2 },
    { name: "Staff Directory", href: "/dashboard/staff", icon: UserCog },
    { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
    { name: "Blog", href: "/dashboard/blog", icon: FileText },
    { name: "Global Settings", href: "/dashboard/settings", icon: Settings },
  ],
  ADMIN: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/dashboard/patients", icon: Users },
    { name: "Staff Directory", href: "/dashboard/staff", icon: UserCog },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Records (OPD/IPD)", href: "/dashboard/records", icon: FileText },
    { name: "Therapies & Rates", href: "/dashboard/admin/rates", icon: Tags }, 
    { name: "Pharmacy", href: "/dashboard/inventory", icon: Pill, requiresFinancials: true }, 
    { name: "Analytics Dashboard", href: "/dashboard/analytics", icon: BarChart3, requiresFinancials: true }, 
    { name: "Lead Management", href: "/dashboard/leads", icon: PhoneCall, isPremium: true }, 
    { name: "Tally Export", href: "/dashboard/tally-export", icon: FileSpreadsheet, isPremium: true, requiresFinancials: true },
    { name: "Advanced Reports", href: "/dashboard/billing", icon: FileText, isPremium: true, requiresFinancials: true }, 
    { name: "Clinic Settings", href: "/dashboard/clinic-settings", icon: Settings },
  ],
  DOCTOR: [
    { name: "Doctor's Console", href: "/dashboard", icon: Activity },
    { name: "My Patients", href: "/dashboard/patients", icon: Users },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Records (OPD/IPD)", href: "/dashboard/records", icon: FileText },
    { name: "Treatment Plans", href: "/dashboard/treatments", icon: Stethoscope },
  ],
  RECEPTIONIST: [
    { name: "Front Desk", href: "/dashboard", icon: LayoutDashboard },
    { name: "Scheduler", href: "/dashboard/appointments", icon: Calendar },
    { name: "Patient Registration", href: "/dashboard/patients", icon: Users },
    { name: "Records (OPD/IPD)", href: "/dashboard/records", icon: FileText },
    { name: "Therapies & Rates", href: "/dashboard/admin/rates", icon: Tags },
    { name: "Billing & Invoices", href: "/dashboard/billing", icon: FileText, requiresFinancials: true }, 
  ],
  THERAPIST: [
    { name: "My Schedule", href: "/dashboard", icon: Calendar },
    { name: "Treatment Records", href: "/dashboard/treatments", icon: Stethoscope },
  ],
  PHARMACIST: [
    { name: "Pharmacy POS", href: "/dashboard", icon: ShoppingCart },
    { name: "Inventory Config", href: "/dashboard/inventory", icon: Package },
    { name: "Billing Ledger", href: "/dashboard/pharmacy-billing", icon: FileText, requiresFinancials: true }, 
  ],
  TELECALLER: [
    { name: "My Leads", href: "/dashboard/telecaller", icon: PhoneCall, isPremium: true },
  ]
};

export default function Sidebar({ role: parentRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [role, setRole] = useState<string | null>(parentRole || null);
  const [hospitalPlan, setHospitalPlan] = useState<string>("BASIC"); 
  const [mounted, setMounted] = useState(false);
  
  // Mobile Menu State
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // User & Hospital States
  const [userName, setUserName] = useState<string>("System User");
  const [userEmail, setUserEmail] = useState<string>("user@hospital.com");
  const [hospitalName, setHospitalName] = useState<string>("Loading...");
  
  // Granular Permissions State
  const [userPermissions, setUserPermissions] = useState<any>({ canViewFinancials: true });

  // Premium Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState("");

  useEffect(() => {
    setMounted(true);
    
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name") || localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("email"); 
    const storedHospitalName = localStorage.getItem("hospitalName");
    const storedPermissions = localStorage.getItem("permissions"); 
    
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedPermissions) {
      try {
        setUserPermissions(JSON.parse(storedPermissions));
      } catch (e) {
        console.error("Failed to parse permissions");
      }
    }
    
    if (storedRole) {
      setRole(storedRole.toUpperCase()); 
      if (storedRole.toUpperCase() !== "SUPER_ADMIN") {
        setHospitalName(storedHospitalName || "Unknown Hospital");
        fetchHospitalPlan();
      } else {
        setHospitalPlan("PREMIUM"); 
        setHospitalName("Global Admin Hub"); 
      }
    } else if (!parentRole) {
      setRole("GUEST");
      setHospitalName("Guest Session");
    }
  }, [parentRole]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const fetchHospitalPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/hospitals/my-plan", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.plan) {
        setHospitalPlan(res.data.plan);
      }
    } catch (error) {
      console.error("Failed to check hospital subscription plan", error);
    }
  };

  if (!mounted) return <div className="hidden md:block w-64 bg-slate-950 border-r border-slate-800 h-screen fixed left-0 top-0"></div>;

  const menuItems = role ? (ROLE_MENUS[role] || []) : [];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000 
        });
      }
    } catch (error) {
      console.error("Logout log failed or timed out:", error);
    } finally {
      localStorage.clear(); 
      window.location.href = "/login"; 
    }
  };

  const handlePremiumClick = (e: React.MouseEvent, featureName: string) => {
    e.preventDefault();
    setIsMobileOpen(false); // Close mobile menu if open
    setLockedFeatureName(featureName);
    setShowUpgradeModal(true);
  };

  const handleContactSales = () => {
    const message = `Hello VAIDYA ERP Sales Team! 👋\n\nI am the admin for *${hospitalName}*. We are currently on the BASIC plan and are interested in upgrading to the PREMIUM plan to unlock the *${lockedFeatureName}* feature.\n\nPlease share the pricing details. Thank you!`;
    const salesPhone = "917009646377"; 
    window.open(`https://wa.me/${salesPhone}?text=${encodeURIComponent(message)}`, "_blank");
    setShowUpgradeModal(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-menu-glass {
          background: rgba(9, 14, 23, 0.6); 
          backdrop-filter: blur(10px); 
          -webkit-backdrop-filter: blur(10px); 
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* =========================================
          MOBILE TOP BAR (Fixed, visible only on small screens)
      ========================================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-slate-950 border-b border-slate-800 z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">V</div>
          <span className="text-lg font-black text-white tracking-tight">VAIDYA ERP</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-300 hover:text-white p-2 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* =========================================
          MOBILE OVERLAY BACKDROP
      ========================================= */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 mobile-menu-glass z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* =========================================
          SIDEBAR CONTAINER (Sliding on Mobile, Fixed on Desktop)
      ========================================= */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[280px] md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl text-white selection:bg-sky-500/30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand & Hospital Header */}
        <div className="p-5 md:p-6 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl shrink-0 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
              VAIDYA<span className="bg-gradient-to-r from-sky-500 to-primary-500 bg-clip-text text-transparent">ERP</span>
            </h1>
            
            <div className="mt-3 flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 shadow-inner">
              <Building2 size={14} className="text-sky-400 shrink-0" />
              <span className="text-xs font-bold text-sky-100 truncate tracking-wide max-w-[140px]">
                {hospitalName}
              </span>
            </div>
            
            <div className="mt-4 flex flex-col gap-2">
               <div className="flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${menuItems.length > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${menuItems.length > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                 </span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {role?.replace("_", " ")} ROLE
                 </span>
               </div>
               
               {role !== "SUPER_ADMIN" && (
                 <div className="flex items-center mt-1">
                   <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                     hospitalPlan === 'PREMIUM' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                   }`}>
                     {hospitalPlan === 'PREMIUM' && <Sparkles size={10} className="text-amber-500" />}
                     {hospitalPlan} PLAN
                   </span>
                 </div>
               )}
            </div>
          </div>

          {/* Close button for Mobile (Inside the sliding sidebar) */}
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1.5 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto hide-scrollbar">
          {menuItems.length > 0 ? (
            menuItems.map((item) => {
              
              // Granular Permission Gate
              if (item.requiresFinancials && userPermissions?.canViewFinancials === false) {
                return null; 
              }

              const isActive = pathname === item.href;
              const isLocked = item.isPremium && hospitalPlan === "BASIC";

              if (isLocked) {
                return (
                  <button 
                    key={item.name} 
                    onClick={(e) => handlePremiumClick(e, item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-900 cursor-pointer group transition-all border border-transparent hover:border-slate-800"
                  >
                    <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <item.icon size={20} className="text-slate-600 group-hover:text-amber-500 transition-colors" strokeWidth={2.5} />
                      {item.name}
                    </div>
                    <div className="p-1 bg-amber-500/10 rounded-md border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                      <Lock size={12} className="text-amber-500" />
                    </div>
                  </button>
                );
              }

              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)} // Auto-close menu on mobile when clicking a link
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group border ${
                    isActive 
                      ? "bg-gradient-to-r from-sky-600 to-primary-600 text-white shadow-lg shadow-sky-900/40 border-sky-500/50" 
                      : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-white drop-shadow-sm" : "text-slate-500 group-hover:text-sky-400 transition-colors"} strokeWidth={2.5} />
                  {item.name}
                </Link>
              );
            })
          ) : (
            <div className="p-4 bg-rose-900/10 rounded-xl border border-rose-900/30 m-2">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                 <ShieldAlert size={18} />
                 <span className="font-bold text-xs uppercase tracking-wider">Role Error</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                 System sees role as: <br/>
                 <span className="font-mono text-rose-300 bg-rose-950/50 px-1.5 py-0.5 rounded mt-1 inline-block">"{role}"</span>
              </p>
            </div>
          )}
        </nav>

        {/* Footer: User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 shrink-0">
          <div className="mb-4 p-3 flex items-center gap-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner overflow-hidden cursor-default">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-primary-600 flex items-center justify-center text-white font-extrabold shrink-0 border border-sky-400/30 text-lg shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5 flex items-center gap-1">
                {userEmail}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
          </button>
          <p className="text-[10px] text-center text-slate-600 mt-5 uppercase font-black tracking-[0.2em]">
              Vaidya ERP © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* =========================================
          PREMIUM UPGRADE MODAL 
      ========================================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header Area */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-center relative">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30 shadow-inner">
                <Crown size={40} className="text-white drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Premium Feature</h2>
            </div>

            {/* Content Area */}
            <div className="p-8 text-center space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">You are trying to access:</p>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-200 font-black text-lg">
                  <Lock size={18} className="text-amber-500"/>
                  {lockedFeatureName}
                </div>
              </div>

              <p className="text-slate-600 font-medium leading-relaxed">
                This powerful feature is locked on the <strong className="text-slate-800">BASIC</strong> plan. Upgrade your clinic to the <strong className="text-amber-600">PREMIUM</strong> plan to unlock advanced tools, analytics, and integrations!
              </p>

              <div className="pt-4 space-y-3">
                <Link
                  href="/dashboard/upgrade"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
                >
                  <Crown size={20} />
                  Upgrade Now
                </Link>
                <button 
                  onClick={handleContactSales}
                  className="w-full flex items-center justify-center gap-3 bg-secondary-500 hover:bg-secondary-600 text-white p-4 rounded-2xl font-bold transition-all active:scale-95"
                >
                  <MessageCircle size={20} />
                  Contact Sales via WhatsApp
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full p-4 text-slate-500 hover:text-slate-800 font-bold transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
