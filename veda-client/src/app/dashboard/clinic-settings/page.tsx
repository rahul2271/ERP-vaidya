// "use client";

// import { useState, useEffect } from "react";
// import axios from "@/utils/axiosConfig";
// import { Settings, Smartphone, Save, RefreshCw, ShieldAlert } from "lucide-react";
// import { toast } from "react-hot-toast";

// export default function ClinicSettingsPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Clinic-specific WhatsApp State
//   const [waConfig, setWaConfig] = useState({
//     accessToken: "",
//     phoneId: "",
//   });

//   useEffect(() => {
//     fetchClinicSettings();
//   }, []);

//   const fetchClinicSettings = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       // 🚀 Hits the new endpoint we just created
//       const res = await axios.get("/hospitals/my-clinic/settings", { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
      
//       if (res.data?.whatsappConfig) {
//         setWaConfig({
//           accessToken: res.data.whatsappConfig.accessToken || "",
//           phoneId: res.data.whatsappConfig.phoneId || "",
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to load clinic settings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("token");
//       // 🚀 Hits the specific hospital update endpoint
//       await axios.patch("/hospitals/my-clinic/whatsapp", waConfig, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
      
//       toast.success("Clinic WhatsApp Settings Updated!");
//     } catch (error: any) {
//       toast.error("Failed to save settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <RefreshCw size={40} className="animate-spin text-sky-600" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800">
//       <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
//         {/* HEADER */}
//         <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//           <div>
//             <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
//               <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Settings size={24} /></div>
//               Clinic Settings
//             </h1>
//             <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Manage your specific clinic's API integrations.</p>
//           </div>
//           <button 
//             onClick={handleSave} 
//             disabled={saving}
//             className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-70"
//           >
//             {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
//             {saving ? "Saving..." : "Save Config"}
//           </button>
//         </div>

//         {/* WHATSAPP API SECTION */}
//         <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
//           <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
//             <Smartphone size={22} className="text-green-600"/> Meta WhatsApp Integration
//           </h2>
          
//           <div className="space-y-6">
//             <div>
//               <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Meta Access Token</label>
//               <input 
//                 type="password" 
//                 placeholder="EAANUB..."
//                 className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm" 
//                 value={waConfig.accessToken} 
//                 onChange={(e) => setWaConfig({...waConfig, accessToken: e.target.value})} 
//               />
//             </div>
            
//             <div>
//               <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Phone Number ID</label>
//               <input 
//                 type="text" 
//                 placeholder="1050433..."
//                 className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm" 
//                 value={waConfig.phoneId} 
//                 onChange={(e) => setWaConfig({...waConfig, phoneId: e.target.value})} 
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex items-start gap-2 text-xs text-primary-700 font-medium bg-primary-50 p-4 rounded-xl border border-primary-100">
//             <ShieldAlert size={16} className="mt-0.5 shrink-0" />
//             <p>These keys ensure all automated messages and replies are routed exclusively through your clinic's official WhatsApp number.</p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Settings, Smartphone, Save, RefreshCw, ShieldAlert, 
  Building2, MapPin, Phone, Mail, FileText, Landmark, ShieldCheck, Image as ImageIcon, Lock, Crown
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ClinicSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState("BASIC"); // 🚀 Tracks the user's SaaS Plan

  const [formData, setFormData] = useState({
    name: "",
    logo: "", // 🚀 New Logo Field
    tagline: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    registrationNumber: ""
  });

  const [waConfig, setWaConfig] = useState({ accessToken: "", phoneId: "" });
  const [smtpConfig, setSmtpConfig] = useState({ host: "", port: "587", user: "", pass: "", fromEmail: "", fromName: "" });
  const [tallyConfig, setTallyConfig] = useState({ serverUrl: "", companyName: "" });

  useEffect(() => {
    fetchClinicSettings();
  }, []);

  const fetchClinicSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch settings AND plan simultaneously
      const [settingsRes, planRes] = await Promise.all([
        axios.get("/hospitals/my-clinic", config),
        axios.get("/hospitals/my-plan", config)
      ]);
      
      setPlan(planRes.data?.plan?.toUpperCase() || "BASIC");

      if (settingsRes.data) {
        setFormData({
          name: settingsRes.data.name || "",
          logo: settingsRes.data.logo || "",
          tagline: settingsRes.data.tagline || "",
          phone: settingsRes.data.phone || "",
          email: settingsRes.data.email || "",
          address: settingsRes.data.address || "",
          city: settingsRes.data.city || "",
          state: settingsRes.data.state || "",
          gstNumber: settingsRes.data.gstNumber || "",
          registrationNumber: settingsRes.data.registrationNumber || ""
        });

        if (settingsRes.data.whatsappConfig) {
          setWaConfig({
            accessToken: settingsRes.data.whatsappConfig.accessToken || "",
            phoneId: settingsRes.data.whatsappConfig.phoneId || "",
          });
        }

        if (settingsRes.data.smtpConfig) {
          setSmtpConfig({
            host: settingsRes.data.smtpConfig.host || "",
            port: String(settingsRes.data.smtpConfig.port || "587"),
            user: settingsRes.data.smtpConfig.user || "",
            pass: settingsRes.data.smtpConfig.pass || "",
            fromEmail: settingsRes.data.smtpConfig.fromEmail || "",
            fromName: settingsRes.data.smtpConfig.fromName || "",
          });
        }

        if (settingsRes.data.tallyConfig) {
          setTallyConfig({
            serverUrl: settingsRes.data.tallyConfig.serverUrl || "",
            companyName: settingsRes.data.tallyConfig.companyName || "",
          });
        }
      }
    } catch (error) {
      toast.error("Failed to load clinic settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData, whatsappConfig: waConfig, smtpConfig: { ...smtpConfig, port: Number(smtpConfig.port) || 587 }, tallyConfig };

      await axios.patch("/hospitals/my-clinic", payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (formData.name) localStorage.setItem("hospitalName", formData.name);
      toast.success("Clinic Settings Updated Successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen gap-4"><RefreshCw size={40} className="animate-spin text-sky-600" /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-24">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Settings size={24} /></div>
              Clinic Settings
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Manage your clinic's brand, billing details, and API integrations.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95">
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Config"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: BRAND INFO & LOGO */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
              <ShieldCheck size={18}/> Brand Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Registered Clinic Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Clinic Tagline (Optional)</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="e.g. Care you can trust" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
                </div>
              </div>
            </div>

            {/* 🚀 PREMIUM GATED LOGO SECTION */}
            <div className="mt-6 pt-6 border-t border-slate-100">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-3 flex items-center gap-2">
                 Invoice Logo <Crown size={14} className="text-amber-500"/>
               </label>
               
               <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-6">
                  {/* PREMIUM LOCK OVERLAY */}
                  {plan !== 'PREMIUM' && (
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
                       <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center border border-amber-100">
                          <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-3"><Lock size={20}/></div>
                          <p className="font-black text-slate-800 mb-1">Premium Feature</p>
                          <p className="text-xs text-slate-500 font-medium mb-4">Upgrade your plan to add a custom logo to your patient invoices.</p>
                          <Link href="/dashboard/billing/upgrade" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5">
                            <Crown size={14}/> Upgrade to Premium
                          </Link>
                       </div>
                    </div>
                  )}

                  {/* ACTUAL INPUT (Disabled if Basic) */}
                  <div className="flex items-center gap-6">
                     <div className="h-20 w-20 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {formData.logo ? (
                          <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <ImageIcon size={24} className="text-slate-300" />
                        )}
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-bold text-slate-600 mb-2">Upload Logo URL</p>
                        <input 
                          type="text" 
                          disabled={plan !== 'PREMIUM'}
                          placeholder="https://your-image-url.com/logo.png" 
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-amber-500 font-medium text-sm text-slate-800 transition-all disabled:bg-slate-100 disabled:text-slate-400" 
                          value={formData.logo} 
                          onChange={e => setFormData({...formData, logo: e.target.value})} 
                        />
                        <p className="text-[10px] text-slate-400 mt-2 font-medium italic">For best results, use a transparent PNG image (max 500x500px).</p>
                     </div>
                     </div>
                     </div>
                     </div></div>
                

          {/* SECTION 2: CONTACT & LOCATION */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
              <MapPin size={18}/> Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Official Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Official Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Full Address</label>
                <textarea rows={2} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 resize-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">City</label>
                <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">State</label>
                <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-bold text-slate-800 transition-all" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SECTION 3: LEGAL & TAXATION */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-4">
              <Landmark size={18}/> Legal & Taxation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">GST Number</label>
                <input type="text" placeholder="e.g. 22AAAAA0000A1Z5" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-mono font-bold text-slate-800 uppercase transition-all" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Clinic Reg. No.</label>
                <input type="text" placeholder="e.g. MH/1234/2026" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:border-primary-500 font-mono font-bold text-slate-800 transition-all" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SECTION 4: WHATSAPP API */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <Smartphone size={22} className="text-green-600"/> Meta WhatsApp Integration
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Meta Access Token</label>
                <input 
                  type="password" 
                  placeholder="EAANUB..."
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono text-sm transition-all" 
                  value={waConfig.accessToken} 
                  onChange={(e) => setWaConfig({...waConfig, accessToken: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Phone Number ID</label>
                <input 
                  type="text" 
                  placeholder="1050433..."
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono text-sm transition-all" 
                  value={waConfig.phoneId} 
                  onChange={(e) => setWaConfig({...waConfig, phoneId: e.target.value})} 
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-xs text-primary-700 font-medium bg-primary-50 p-4 rounded-xl border border-primary-100">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <p>These keys ensure all automated messages and replies are routed exclusively through your clinic's official WhatsApp number.</p>
            </div>
          </div>

          {/* SECTION 5: EMAIL (SMTP) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <Smartphone size={22} className="text-primary-600"/> Email (SMTP) for patient invoices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">SMTP Host</label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm transition-all"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Port</label>
                <input
                  type="number"
                  placeholder="587"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm transition-all"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">SMTP Username</label>
                <input
                  type="text"
                  placeholder="you@yourclinic.com"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm transition-all"
                  value={smtpConfig.user}
                  onChange={(e) => setSmtpConfig({...smtpConfig, user: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">SMTP Password</label>
                <input
                  type="password"
                  placeholder="App password"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm transition-all"
                  value={smtpConfig.pass}
                  onChange={(e) => setSmtpConfig({...smtpConfig, pass: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">"From" Email</label>
                <input
                  type="email"
                  placeholder="billing@yourclinic.com"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  value={smtpConfig.fromEmail}
                  onChange={(e) => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">"From" Name</label>
                <input
                  type="text"
                  placeholder="Your Clinic Billing"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  value={smtpConfig.fromName}
                  onChange={(e) => setSmtpConfig({...smtpConfig, fromName: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-xs text-primary-700 font-medium bg-primary-50 p-4 rounded-xl border border-primary-100">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <p>Invoices and receipts sent to patients use these credentials, so they arrive from your clinic's own email address — not a shared platform account. For Gmail, use an App Password, not your regular login password.</p>
            </div>
          </div>

          {/* SECTION 6: TALLY INTEGRATION (Premium) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <Smartphone size={22} className="text-primary-600"/> Tally Integration (Premium)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Tally Server URL</label>
                <input
                  type="text"
                  placeholder="http://your-tally-host:9000"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm transition-all"
                  value={tallyConfig.serverUrl}
                  onChange={(e) => setTallyConfig({...tallyConfig, serverUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Tally Company Name</label>
                <input
                  type="text"
                  placeholder="Exactly as it appears in Tally"
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  value={tallyConfig.companyName}
                  onChange={(e) => setTallyConfig({...tallyConfig, companyName: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-xs text-amber-700 font-medium bg-amber-50 p-4 rounded-xl border border-amber-100">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <p>
                Tally must be running with its HTTP server enabled (F1 → Settings → Connectivity → Client/Server Configuration, default port 9000), and this URL must be reachable from the internet. A standard local desktop Tally on a home/clinic network usually isn't — you'll typically need Tally on Cloud, or a tunnel (like ngrok) to a local install. Test the connection from the Tally Export page after saving.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}