"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";
import { Smartphone, Lock, Info, Save, ShieldCheck, RefreshCw } from "lucide-react";

export default function HospitalWhatsAppConfig({ hospital }: { hospital: any }) {
  const [loading, setLoading] = useState(false);
  
  // Initialize state
  const [config, setConfig] = useState({
    accessToken: "",
    phoneId: "",
    businessAccountId: "",
    verifyToken: "veda_erp_secure_token_123", // Default webhook token
  });

  // Sync state when the hospital data successfully loads from the parent page
  useEffect(() => {
    if (hospital?.whatsappConfig) {
      setConfig({
        accessToken: hospital.whatsappConfig.accessToken || "",
        phoneId: hospital.whatsappConfig.phoneId || "",
        businessAccountId: hospital.whatsappConfig.businessAccountId || "",
        verifyToken: hospital.whatsappConfig.verifyToken || "veda_erp_secure_token_123",
      });
    }
  }, [hospital]);

  // Safety guard
  if (!hospital) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      // 🚀 Calls the Super-Admin specific route we built in the NestJS backend
      await axios.patch(`/hospitals/${hospital._id}/whatsapp-config`, config);
      toast.success(`WhatsApp Configured for ${hospital.name}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hospital credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-6">
      
      {/* PANEL HEADER */}
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800">WhatsApp API Integration</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hospital Specific Credentials</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
          <ShieldCheck size={12} /> Super Admin Access
        </div>
      </div>

      {/* CONFIGURATION FORM */}
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Meta Access Token</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="password" 
                value={config.accessToken}
                onChange={(e) => setConfig({...config, accessToken: e.target.value})}
                placeholder="Paste EAANUB..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Phone Number ID</label>
            <input 
              type="text" 
              value={config.phoneId}
              onChange={(e) => setConfig({...config, phoneId: e.target.value})}
              placeholder="e.g. 1050433..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-sm transition-all shadow-inner"
            />
          </div>

        </div>

        {/* FALLBACK WARNING */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
          <Info className="text-amber-500 shrink-0" size={18} />
          <p className="text-xs font-medium text-amber-700 leading-relaxed">
            If these fields are left blank, the system will automatically use the <strong>Global Fallback API</strong> from your master system settings.
          </p>
        </div>

        {/* SAVE BUTTON */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Syncing with Meta..." : "Save Hospital Credentials"}
        </button>

      </div>
    </div>
  );
}