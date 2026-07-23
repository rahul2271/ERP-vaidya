"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// 🚀 THE FIX: Added 'Pill' to the import list below
import { X, User, Activity, Receipt, Download, FileText, Calendar as CalendarIcon, Phone, FileClock, Pill } from "lucide-react";

export default function PatientDetailsModal({ patientId, onClose }: any) {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [billData, setBillData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (patientId) fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [profileRes, historyRes, billRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}/history`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}/bill`, config) 
      ]);

      setData(profileRes.data);
      setHistory(historyRes.data);
      setBillData(billRes.data);
    } catch (err) {
      console.error("Failed to fetch patient details", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}/discharge-pdf`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' 
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bill_${data?.name || 'Patient'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF.");
    }
  };

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 flex justify-between items-center text-white shrink-0 shadow-md z-10 relative">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/4 w-64 h-full bg-primary-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="p-1.5 bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30">
                <FileText size={20} strokeWidth={2.5}/>
              </div>
              Patient Medical File
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-1.5 tracking-wider uppercase ml-12">MRN: {patientId}</p>
          </div>
          <button onClick={onClose} className="relative z-10 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-rose-500/20 p-2.5 rounded-full transition-all border border-transparent hover:border-rose-500/30">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {loading ? (
          // Premium Skeleton Loader
          <div className="flex flex-1 overflow-hidden animate-pulse">
             <div className="w-1/3 bg-slate-50 p-6 border-r border-slate-100 hidden md:block space-y-6">
                <div className="h-24 w-24 bg-slate-200 rounded-full mx-auto"></div>
                <div className="h-6 bg-slate-200 rounded-md w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2 mx-auto"></div>
                <div className="h-20 bg-slate-200 rounded-xl mt-10"></div>
                <div className="h-24 bg-slate-200 rounded-xl mt-4"></div>
             </div>
             <div className="w-full md:w-2/3 p-8 space-y-6">
                <div className="h-12 bg-slate-200 rounded-xl w-full mb-8"></div>
                <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
             </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            
            {/* Sidebar (Basic Info) */}
            <div className="w-1/3 bg-gradient-to-b from-slate-50 to-white p-6 border-r border-slate-100 overflow-y-auto hidden md:block">
              <div className="text-center mb-8 pt-4">
                <div className="w-24 h-24 bg-sky-50 border-2 border-sky-100 text-sky-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-inner">
                  {data?.name?.charAt(0)}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{data?.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">{data?.age} Yrs</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">{data?.gender === 'M' ? 'Male' : 'Female'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-1"><Phone size={12}/> Contact</p>
                  <p className="font-extrabold text-slate-800 tracking-wide group-hover:text-sky-600 transition-colors">{data?.mobile}</p>
                </div>
                
                {/* Total Due Badge */}
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-5 rounded-2xl border border-rose-100 shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="absolute -right-4 -top-4 text-rose-500/5 transition-transform duration-500 group-hover:scale-110">
                     <Receipt size={80}/>
                   </div>
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 relative z-10">Total Balance Due</p>
                   <p className="text-3xl font-black text-rose-700 tracking-tighter relative z-10">₹{billData?.totalDue || 0}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 flex flex-col bg-white">
              
              {/* Premium Pill Tabs */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex bg-slate-200/60 p-1.5 rounded-2xl shadow-inner">
                  {[
                    { id: 'overview', icon: Activity, label: 'Overview', activeColor: 'text-sky-700' },
                    { id: 'history', icon: FileClock, label: 'History', activeColor: 'text-sky-700' },
                    { id: 'billing', icon: Receipt, label: 'Financials', activeColor: 'text-emerald-700' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl ${
                        activeTab === tab.id 
                          ? `bg-white shadow-sm scale-100 ${tab.activeColor}` 
                          : "text-slate-500 hover:text-slate-700 scale-95 hover:scale-100"
                      }`}
                    >
                      <tab.icon size={14}/> {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><Activity size={16}/></div>
                        Current Diagnosis
                      </h4>
                      <div className="p-5 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-900 text-sm leading-relaxed font-medium shadow-inner">
                        {data?.diagnosis || <span className="text-primary-400 italic">No active diagnosis recorded.</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="space-y-4 animate-in fade-in duration-300 relative">
                    <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100 hidden md:block"></div>
                    {history.length > 0 ? history.map((visit) => (
                        <div key={visit._id} className="relative pl-0 md:pl-10 group">
                           <div className="absolute left-[19px] top-4 h-3 w-3 rounded-full border-2 border-sky-500 bg-white hidden md:block group-hover:bg-sky-100 transition-colors"></div>
                           <div className="border border-slate-200 rounded-2xl p-5 hover:border-sky-200 hover:shadow-md transition-all bg-white">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-800 text-sm md:text-base">{visit.treatmentName}</h5>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                                  <CalendarIcon size={10}/> {new Date(visit.startTime).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}
                                </span>
                              </div>
                           </div>
                        </div>
                    )) : (
                      <div className="py-12 text-center text-slate-400">
                        <FileClock size={40} className="mx-auto mb-3 opacity-20"/>
                        <p className="text-xs font-bold uppercase tracking-widest">No previous visits found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BILLING TAB */}
                {activeTab === "billing" && billData && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     
                     <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Receipt size={18}/></div> 
                           Billing Summary
                        </h3>
                        <button onClick={downloadPdf} className="text-xs flex items-center gap-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-4 py-2 rounded-xl font-bold text-slate-600 hover:text-emerald-700 transition-all shadow-sm active:scale-95 group">
                           <Download size={14} className="group-hover:-translate-y-0.5 transition-transform"/> Download PDF
                        </button>
                     </div>

                     {/* Section 1: Therapies */}
                     <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                          <h4 className="font-black text-sky-900 text-xs uppercase tracking-widest flex items-center gap-2">
                             <Activity size={14} className="text-sky-500"/> Procedures
                          </h4>
                        </div>
                        <div className="p-0 overflow-x-auto">
                          <table className="w-full text-sm">
                             <thead><tr className="text-left text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/30"><th className="p-4 font-bold">Date</th><th className="p-4 font-bold">Therapy</th><th className="p-4 font-bold text-right">Cost</th></tr></thead>
                             <tbody className="divide-y divide-slate-50">
                                {billData.sections?.therapies?.items?.length > 0 ? (
                                    billData.sections.therapies.items.map((t: any, i: number) => (
                                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="p-4 text-slate-500 font-medium">{new Date(t.date).toLocaleDateString('en-GB')}</td>
                                          <td className="p-4 font-bold text-slate-800">{t.name}</td>
                                          <td className="p-4 text-right font-black text-slate-900">₹{t.cost}</td>
                                       </tr>
                                    ))
                                ) : (
                                  <tr><td colSpan={3} className="p-6 text-center text-slate-400 text-xs font-medium italic">No procedures billed.</td></tr>
                                )}
                             </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-sky-50/30 border-t border-slate-100 text-right">
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-4">Subtotal</span>
                           <span className="font-black text-sky-700 text-lg">₹{billData.sections?.therapies?.total || 0}</span>
                        </div>
                     </div>

                     {/* Section 2: Medicines */}
                     <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                          <h4 className="font-black text-emerald-900 text-xs uppercase tracking-widest flex items-center gap-2">
                             <Pill size={14} className="text-emerald-500"/> Pharmacy
                          </h4>
                        </div>
                        <div className="p-0 overflow-x-auto">
                          <table className="w-full text-sm">
                             <thead><tr className="text-left text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/30"><th className="p-4 font-bold">Item</th><th className="p-4 font-bold">Qty</th><th className="p-4 font-bold text-right">Total</th></tr></thead>
                             <tbody className="divide-y divide-slate-50">
                                {billData.sections?.medicines?.items?.length > 0 ? (
                                    billData.sections.medicines.items.map((m: any, i: number) => (
                                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="p-4 font-bold text-slate-800">{m.name}</td>
                                          <td className="p-4 text-slate-500 font-medium">x{m.qty}</td>
                                          <td className="p-4 text-right font-black text-slate-900">₹{m.total}</td>
                                       </tr>
                                    ))
                                ) : (
                                  <tr><td colSpan={3} className="p-6 text-center text-slate-400 text-xs font-medium italic">No medicines billed.</td></tr>
                                )}
                             </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-emerald-50/30 border-t border-slate-100 text-right">
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-4">Subtotal</span>
                           <span className="font-black text-emerald-700 text-lg">₹{billData.sections?.medicines?.total || 0}</span>
                        </div>
                     </div>

                     {/* Grand Total */}
                     <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl flex justify-between items-center shadow-xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-300 relative z-10">Grand Total Due</span>
                        <span className="text-4xl font-black tracking-tighter relative z-10">₹{billData.subtotal}</span>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}