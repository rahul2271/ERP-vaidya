"use client";

import React, { useState, useEffect } from "react";
import { 
  X, UserPlus, Mail, Phone, Lock, Briefcase, BadgeCheck, 
  ShieldCheck, EyeOff, LayoutPanelTop, Crown, CheckCircle2 
} from "lucide-react";
import axios from "@/utils/axiosConfig"; 
import { toast } from "react-hot-toast";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
}

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "", 
    password: "",
    role: "DOCTOR",
    specialization: "",
    // 🚀 Default Permissions
    permissions: {
      canViewFinancials: true,
      canEditInventory: true,
      canExportData: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [hospitalPlan, setHospitalPlan] = useState("BASIC");
  
  // 🚀 NEW: State for the Premium Upgrade Popup
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  useEffect(() => {
    // Check plan from localStorage (populated in Sidebar or Login)
    const plan = localStorage.getItem("hospitalPlan") || "BASIC";
    setHospitalPlan(plan);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowUpgradePopup(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        ...formData,
        role: formData.role.toUpperCase(), 
        age: 30, // Fallback for schema
        gender: "Other", 
      };

      await axios.post("/users/add-staff", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`${formData.name} added to staff directory!`);
      onSuccess(); 
      handleClose(); 
      
    } catch (error: any) {
      console.error("Add Staff Error:", error.response?.data);
      const msg = error.response?.data?.message || "Check staff limits and try again.";
      
      // 🚀 MAGIC: Intercept the Limit Error and show the beautiful Upgrade Popup!
      if (msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("plan") || msg.toLowerCase().includes("maximum") || msg.includes("BASIC_LIMIT_REACHED")) {
        setShowUpgradePopup(true);
      } else {
        toast.error(`Failed to add staff: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (key: string) => {
    if (hospitalPlan === "BASIC") return; // 🔒 Basic plan can't toggle permissions
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key as keyof typeof formData.permissions]
      }
    });
  };

  // =========================================================================
  // 🚀 THE PREMIUM UPGRADE POPUP (Shows when limit is reached)
  // =========================================================================
  if (showUpgradePopup) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <button onClick={handleClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors">
            <X size={20} />
          </button>
          
          <div className="h-24 w-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 border-4 border-amber-50">
            <Crown size={40} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Staff Limit Reached</h2>
          <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed px-4">
            Your Basic Plan allows a maximum of 6 staff members. Upgrade to the <span className="font-bold text-amber-600">PRO Plan</span> to unlock unlimited growth for your hospital!
          </p>

          <div className="w-full bg-slate-50 rounded-3xl p-6 mb-8 text-left border border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Pro Plan Benefits</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 size={18} className="text-emerald-500" /> Unlimited Staff Accounts
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 size={18} className="text-emerald-500" /> Multi-Branch Management
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 size={18} className="text-emerald-500" /> Advanced Analytics & Reports
              </li>
            </ul>
          </div>

          <button onClick={() => window.open('https://rctechsolutions.com', '_blank')} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:to-slate-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            Contact Sales to Upgrade
          </button>
          <button onClick={handleClose} className="mt-5 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 🏥 STANDARD ADD STAFF FORM
  // =========================================================================
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <button onClick={handleClose} className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 transition-colors bg-white shadow-sm hover:bg-slate-100 p-2.5 rounded-2xl z-10 border">
            <X size={20} />
          </button>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
            <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-200"><UserPlus size={28} strokeWidth={2.5}/></div>
            Provision Staff
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-3 ml-1">Assign secure login credentials and access levels.</p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form id="add-staff-form" onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* 1. Basic Info */}
            <div className="space-y-5">
                <h3 className="text-[11px] font-black text-sky-600 uppercase tracking-[0.2em] mb-4">Identification</h3>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                        <BadgeCheck size={12}/> Full Name
                    </label>
                    <input required type="text" placeholder="e.g., Dr. Rahul" className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                            <Mail size={12}/> Email
                        </label>
                        <input required type="email" placeholder="staff@clinic.com" className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                            <Phone size={12}/> Mobile
                        </label>
                        <input required type="text" placeholder="9876543210" className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* 2. Security */}
            <div className="space-y-5 pt-2">
                <h3 className="text-[11px] font-black text-sky-600 uppercase tracking-[0.2em] mb-4">Security & Assignment</h3>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                            <Briefcase size={12}/> Role
                        </label>
                        <select className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all cursor-pointer appearance-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="DOCTOR">Doctor</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="TELECALLER">Telecaller</option>
                            <option value="THERAPIST">Therapist</option>
                            <option value="PHARMACIST">Pharmacist</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                            <Lock size={12}/> Initial Password
                        </label>
                        <input required type="text" placeholder="veda2026" className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* 🚀 3. ACCESS CONTROL (PREMIUM FEATURE) */}
            <div className={`p-6 rounded-3xl border-2 transition-all ${hospitalPlan === 'PREMIUM' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck size={16}/> Granular Access Levels
                  </h3>
                  {hospitalPlan === 'BASIC' && (
                    <span className="text-[9px] font-black bg-amber-500 text-white px-2 py-1 rounded-md">PREMIUM ONLY</span>
                  )}
               </div>

               <div className="space-y-4">
                  <div 
                    onClick={() => togglePermission('canViewFinancials')}
                    className={`flex items-center justify-between p-4 rounded-2xl border bg-white transition-all ${hospitalPlan === 'PREMIUM' ? 'cursor-pointer hover:border-amber-400 active:scale-[0.98]' : 'cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${formData.permissions.canViewFinancials ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            <LayoutPanelTop size={18}/>
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">Financial Visibility</p>
                            <p className="text-[10px] font-bold text-slate-400">Can view Billing, Revenue, and Analytics</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.permissions.canViewFinancials ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.permissions.canViewFinancials ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>

                  <div 
                    onClick={() => togglePermission('canEditInventory')}
                    className={`flex items-center justify-between p-4 rounded-2xl border bg-white transition-all ${hospitalPlan === 'PREMIUM' ? 'cursor-pointer hover:border-amber-400 active:scale-[0.98]' : 'cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${formData.permissions.canEditInventory ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                            <BadgeCheck size={18}/>
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">Inventory Management</p>
                            <p className="text-[10px] font-bold text-slate-400">Can add, delete or edit pharmacy stock</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.permissions.canEditInventory ? 'bg-primary-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.permissions.canEditInventory ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
               </div>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-slate-100 bg-slate-50/80 shrink-0 flex gap-4">
           <button type="button" onClick={handleClose} className="flex-1 py-4 rounded-2xl font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm uppercase tracking-widest text-xs">
             Discard
           </button>
           <button 
             type="submit" 
             form="add-staff-form"
             disabled={loading}
             className="flex-[2] py-4 rounded-2xl font-black text-white bg-sky-600 hover:bg-sky-700 shadow-xl shadow-sky-600/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
           >
             {loading ? "Syncing..." : <><UserPlus size={18}/> Authorize Account</>}
           </button>
        </div>

      </div>
    </div>
  );
}