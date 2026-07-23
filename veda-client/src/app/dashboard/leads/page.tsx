"use client";

import { useEffect, useState, useRef } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Users, UploadCloud, FileSpreadsheet, PhoneCall, 
  CheckCircle2, Clock, UserCheck, MapPin, AlertCircle, MessageSquare
} from "lucide-react";
import CallDialer from "@/components/CallDialer"; // 🚀 Added import

export default function LeadManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [telecallers, setTelecallers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [callingLead, setCallingLead] = useState<{name: string, phone: string} | null>(null); // 🚀 Added state
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLeadsAndStaff();
  }, []);

  const fetchLeadsAndStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [leadsRes, staffRes] = await Promise.all([
        axios.get("/leads/admin/all", config).catch(() => ({ data: [] })),
        axios.get("/users", config).catch(() => ({ data: [] }))
      ]);

      setLeads(leadsRes.data);
      const callers = staffRes.data.filter((u: any) => u.role === 'TELECALLER' || u.role === 'telecaller');
      setTelecallers(callers);
      
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        
        const parsedLeads = rows.slice(1).map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => 
             col.trim().replace(/^"|"$/g, '').trim()
          );
          
          return {
            patientName: cols[0] || "Unknown",
            phone: cols[1] || "0000000000",
            preferredDoctor: cols[2] || "Unspecified",
            problem: cols[3] || "Not provided",
            city: cols[4] || "Unknown",
            source: cols[5] || "FB Ads"
          };
        });

        const token = localStorage.getItem("token");
        await axios.post("/leads/bulk", { leads: parsedLeads }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert(`Successfully uploaded ${parsedLeads.length} leads!`);
        fetchLeadsAndStaff(); 
      } catch (error) {
        alert("Failed to process CSV file. Ensure it matches the format.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleAssign = async (leadId: string, telecallerId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/leads/${leadId}/assign`, { telecallerId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? { ...lead, assignedTo: telecallers.find(t => t._id === telecallerId), status: 'ASSIGNED' } : lead
      ));
    } catch (err) {
      alert("Failed to assign lead");
    }
  };

  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;
  const convertedCount = leads.filter(l => l.status === 'BOOKED').length;

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-pulse text-slate-800">
        <div className="max-w-[1500px] mx-auto space-y-8">
          <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
          </div>
          <div className="h-[600px] bg-slate-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-[1500px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-800 to-sky-500 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-1.5 bg-primary-50 text-primary-600 rounded-xl"><Users size={24} strokeWidth={2.5}/></div>
              Lead Distribution Center
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Import and route marketing leads to your telecalling team.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full md:w-auto px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black shadow-lg shadow-sky-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 border border-sky-500 disabled:opacity-50"
            >
               {uploading ? <Clock size={20} className="animate-spin" strokeWidth={3}/> : <UploadCloud size={20} strokeWidth={3}/>}
               {uploading ? "Processing CSV..." : "Upload CSV Leads"}
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-rose-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-rose-100 transition-colors duration-500"></div>
             <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 shadow-inner border border-rose-100">
                  <FileSpreadsheet size={24} strokeWidth={2.5}/>
                </div>
             </div>
             <div className="relative z-10">
               <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Unassigned / New</p>
               <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">{newLeadsCount}</h2>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-sky-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-sky-100 transition-colors duration-500"></div>
             <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shadow-inner border border-sky-100">
                  <PhoneCall size={24} strokeWidth={2.5}/>
                </div>
             </div>
             <div className="relative z-10">
               <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Total Active Leads</p>
               <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">{leads.length}</h2>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-emerald-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors duration-500"></div>
             <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner border border-emerald-100">
                  <CheckCircle2 size={24} strokeWidth={2.5}/>
                </div>
             </div>
             <div className="relative z-10">
               <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Converted to OPD</p>
               <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">{convertedCount}</h2>
             </div>
          </div>
        </div>

        {/* LEADS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><Users size={18} strokeWidth={2.5}/></div> 
               Raw Lead Database
             </h3>
          </div>

          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="p-5 pl-8 whitespace-nowrap">Lead Details</th>
                  <th className="p-5 whitespace-nowrap">Contact</th>
                  <th className="p-5 whitespace-nowrap min-w-[200px]">Reported Issue</th>
                  <th className="p-5 whitespace-nowrap min-w-[300px]">Telecaller Audit Log</th>
                  <th className="p-5 whitespace-nowrap">Status</th>
                  <th className="p-5 pr-8 whitespace-nowrap">Routing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-24 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          <FileSpreadsheet size={40} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No Leads in System</p>
                        <p className="text-xs font-medium mt-1">Upload a CSV file to begin.</p>
                      </div>
                    </td>
                  </tr>
                ) : leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8 align-top">
                      <div className="flex items-center gap-3">
                        <div>
                           <p className="font-extrabold text-slate-800 text-sm whitespace-nowrap">{lead.patientName}</p>
                           <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="bg-sky-50 text-sky-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase border border-sky-100/50 tracking-wider">{lead.source}</span>
                            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1"><MapPin size={10} className="text-emerald-500"/> {lead.city}</span>
                          </div>
                        </div>
                        {/* 🚀 ADMIN TEST CALL BUTTON */}
                        <button 
                          onClick={() => setCallingLead({ name: lead.patientName, phone: lead.phone })}
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                        >
                          <PhoneCall size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-black text-slate-700 align-top tracking-tight">{lead.phone}</td>
                    <td className="p-5 text-sm font-medium text-slate-600 align-top min-w-[200px] max-w-[250px] whitespace-normal break-words leading-relaxed">
                      <div className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 shadow-inner">
                        <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" strokeWidth={2.5}/> 
                        <span className="text-xs">{lead.problem}</span>
                      </div>
                    </td>
                    <td className="p-5 align-top min-w-[250px] max-w-[350px]">
                      {lead.medicalHistoryNotes || lead.notes ? (
                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-2.5 shadow-inner">
                          <MessageSquare size={14} className="text-sky-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600 font-medium italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                            "{lead.medicalHistoryNotes || lead.notes}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-dashed border-slate-200">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="p-5 align-top whitespace-nowrap">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border shadow-sm ${
                        lead.status === 'NEW' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                        lead.status === 'NOT_INTERESTED' ? 'bg-slate-100 text-slate-500 border-slate-200 line-through' : 
                        lead.status === 'ASSIGNED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        lead.status === 'CONTACTED' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        lead.status === 'BOOKED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5 pr-8 align-top whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select 
                          value={lead.assignedTo?._id || ""}
                          onChange={(e) => handleAssign(lead._id, e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white shadow-sm cursor-pointer transition-all hover:border-slate-300"
                        >
                          <option value="" disabled>Route to Caller...</option>
                          {telecallers.map(caller => (
                            <option key={caller._id} value={caller._id}>{caller.name}</option>
                          ))}
                        </select>
                        {lead.assignedTo && <UserCheck size={20} className="text-emerald-500 shrink-0"/>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🚀 VOIP DIALER */}
        {callingLead && (
          <CallDialer 
            phoneNumber={callingLead.phone} 
            patientName={callingLead.name} 
            onClose={() => setCallingLead(null)} 
          />
        )}

      </div>
    </div>
  );
}