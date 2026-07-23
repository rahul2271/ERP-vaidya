"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Settings, Globe, Key, ShieldAlert, 
  Mail, MessageSquare, CreditCard, Power, Save, RefreshCw, Send, Lock, Smartphone, CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Global Settings State
  const [settings, setSettings] = useState({
    platformName: "VAIDYA ERP",
    supportEmail: "support@vaidyaerp.com",
    supportPhone: "+91 9876543210",
    timeZone: "Asia/Kolkata",
    smsApiKey: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    razorpayKey: "",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeoutMins: 120,
    defaultWhatsAppToken: "",
    defaultWhatsAppPhoneId: "",
    // 🚀 THE FIX: Added Verify Token to State
    defaultWhatsAppVerifyToken: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/settings/global", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.data) setSettings(res.data);
    } catch (error) {
      toast.error("Failed to load settings from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // 🚀 THE FIX: Strip out all MongoDB generated fields before sending
      const { 
        _id, 
        __v, 
        createdAt, 
        updatedAt, 
        id, 
        ...cleanPayload 
      } = settings as any;

      // 🚀 Ensure numbers are sent as numbers, not strings
      cleanPayload.maxLoginAttempts = Number(cleanPayload.maxLoginAttempts) || 5;
      cleanPayload.sessionTimeoutMins = Number(cleanPayload.sessionTimeoutMins) || 120;

      await axios.patch("/settings/global", cleanPayload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      toast.success("Global Configuration Updated!");
    } catch (error: any) {
      console.error("Backend Error Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to sync settings with backend.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <RefreshCw size={40} className="animate-spin text-sky-600" />
        <p className="font-bold text-slate-500 animate-pulse">Initializing System Config...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Settings size={24} /></div>
              Global Settings
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Manage system-wide configurations and API keys.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95"
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* TABS SIDEBAR */}
          <div className="md:col-span-3 space-y-2">
            {[
              { id: 'general', icon: Globe, label: 'General Config' },
              { id: 'integrations', icon: Key, label: 'API Integrations' },
              { id: 'system', icon: ShieldAlert, label: 'Security & Auth' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-200 scale-[1.02]" 
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="md:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px]">
            
            {activeTab === "integrations" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                
                {/* WHATSAPP BUSINESS API SECTION */}
                <div className="bg-green-50/30 border border-green-100 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Smartphone size={120} />
                  </div>
                  
                  <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                    <Smartphone size={18} className="text-green-600"/> WhatsApp API (System Defaults)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Meta Access Token</label>
                      <input 
                        type="password" 
                        placeholder="EAANUB..."
                        className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-xs shadow-inner" 
                        value={settings.defaultWhatsAppToken} 
                        onChange={(e) => setSettings({...settings, defaultWhatsAppToken: e.target.value})} 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone Number ID</label>
                      <input 
                        type="text" 
                        placeholder="1050433..."
                        className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm shadow-inner" 
                        value={settings.defaultWhatsAppPhoneId} 
                        onChange={(e) => setSettings({...settings, defaultWhatsAppPhoneId: e.target.value})} 
                      />
                    </div>

                    {/* 🚀 THE FIX: Added Webhook Verify Token UI */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Webhook Verify Token</label>
                      <input 
                        type="text" 
                        placeholder="e.g. veda_erp_secure_token_123"
                        className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm shadow-inner" 
                        value={settings.defaultWhatsAppVerifyToken} 
                        onChange={(e) => setSettings({...settings, defaultWhatsAppVerifyToken: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-start gap-2 text-[11px] text-green-700 font-medium bg-white/50 p-3 rounded-xl border border-green-100">
                    <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                    <p>Enter the <b>Webhook Verify Token</b> here and use the exact same string in your Meta Developer Portal to authorize the handshake.</p>
                  </div>
                </div>

                {/* EMAIL SMTP SECTION */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                    <Mail size={18} className="text-rose-500"/> Email SMTP Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">SMTP Host</label>
                      <input type="text" placeholder="smtp.gmail.com" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">SMTP Port</label>
                      <input type="text" placeholder="587" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.smtpPort} onChange={(e) => setSettings({...settings, smtpPort: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Username</label>
                      <input type="text" placeholder="notifications@hospital.com" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.smtpUser} onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Password</label>
                      <input type="password" placeholder="••••••••" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.smtpPass} onChange={(e) => setSettings({...settings, smtpPass: e.target.value})} />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4 flex items-center gap-2">
                    <Globe size={18} className="text-sky-600"/> Platform Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">ERP Brand Name</label>
                    <input type="text" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.platformName} onChange={(e) => setSettings({...settings, platformName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Support Email</label>
                    <input type="email" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "system" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                     <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-rose-600"/> Security & Auth Policies
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Max Login Attempts</label>
                            <input type="number" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.maxLoginAttempts} onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Session Timeout (Mins)</label>
                            <input type="number" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-sm" value={settings.sessionTimeoutMins} onChange={(e) => setSettings({...settings, sessionTimeoutMins: parseInt(e.target.value)})} />
                        </div>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}