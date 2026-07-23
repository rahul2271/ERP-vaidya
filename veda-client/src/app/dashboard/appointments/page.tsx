"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig"; 
import { 
  Calendar, Plus, Clock, MapPin, User, X, 
  Activity, CheckCircle2, Timer, Pill, Stethoscope, Trash2, FileText,
  ChevronLeft, ChevronRight, CheckCircle, Search, ClipboardList
} from "lucide-react";

interface Appointment {
  _id: string;
  patientId: { name: string; _id: string };
  therapistId: { name: string };
  roomId: { name: string };
  treatmentName: string;
  startTime: string; 
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [availableTreatments, setAvailableTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [vitalsData, setVitalsData] = useState({ preBp: "", postBp: "", pulse: "", weight: "", notes: "" });
  const [selectedMeds, setSelectedMeds] = useState([{ inventoryId: "", quantity: 1, price: 0 }]);
  
  const [clinicalNotes, setClinicalNotes] = useState({ chiefComplaints: "", diagnosis: "" });
  const [recommendedTherapies, setRecommendedTherapies] = useState([{ treatmentName: "", notes: "" }]);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  useEffect(() => {
    fetchData();
    fetchInventory();
    fetchTreatments();
  }, [selectedDate]); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`/appointments/day/${selectedDate}`, config);
      
      const sorted = res.data.sort((a: any, b: any) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      
      setAppointments(sorted);
    } catch (err) { 
      console.error(err); 
      setAppointments([]); 
    } finally { 
      setLoading(false); 
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const fetchInventory = async () => {
    const res = await axios.get(`/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setInventory(res.data);
  };

  const fetchTreatments = async () => {
    const res = await axios.get(`/treatments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setAvailableTreatments(res.data);
  };

  const handleCompleteSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        status: "COMPLETED",
        vitals: {
          preBp: vitalsData.preBp || "N/A",
          postBp: vitalsData.postBp || "N/A",
          pulse: vitalsData.pulse || "N/A",
          weight: vitalsData.weight || "N/A"
        },
        medicinesUsed: selectedMeds
          .filter(m => m.inventoryId !== "")
          .map(m => ({
            inventoryId: m.inventoryId,
            quantity: Number(m.quantity),
            priceAtTime: Number(m.price) 
          })),
        chiefComplaints: clinicalNotes.chiefComplaints,
        diagnosis: clinicalNotes.diagnosis,
        recommendedTherapies: recommendedTherapies
          .filter(t => t.treatmentName.trim() !== "")
          .map(t => ({
            treatmentName: t.treatmentName,
            notes: t.notes || "",
            isProcessed: false 
          })),
        ...(nextFollowUpDate && { nextFollowUpDate })
      };

      await axios.patch(`/appointments/${selectedApptId}`, payload, config);
      setIsVitalsOpen(false);
      fetchData(); 
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to save details"));
    } finally {
      setIsSaving(false);
    }
  };

  const addMedField = () => setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0 }]);
  const addTherapyField = () => setRecommendedTherapies([...recommendedTherapies, { treatmentName: "", notes: "" }]);
  const removeTherapyRow = (idx: number) => setRecommendedTherapies(recommendedTherapies.filter((_, i) => i !== idx));

  // 🚀 Premium Skeleton Loader
  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-pulse text-slate-800">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-3xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><Calendar size={20} strokeWidth={2.5}/></div>
              Daily Schedule
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-11 font-medium">Clinical order management</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* DATE NAVIGATION */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-auto justify-between sm:justify-center">
               <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-primary-600 active:scale-95"><ChevronLeft size={20} strokeWidth={2.5}/></button>
               <div className="px-4 text-center min-w-[130px]">
                  <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-0.5">Viewing Schedule</p>
                  <p className="text-sm font-bold text-slate-800">{new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
               </div>
               <button onClick={() => changeDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-primary-600 active:scale-95"><ChevronRight size={20} strokeWidth={2.5}/></button>
            </div>
            
            <button onClick={() => setIsBookingOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-600/20 active:scale-95 transition-all">
              <Plus size={18} strokeWidth={2.5}/> New Appointment
            </button>
          </div>
        </div>

        {/* APPOINTMENTS LIST */}
        <div className="grid grid-cols-1 gap-5">
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app._id} className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between group ${
                app.status === 'COMPLETED' 
                  ? 'bg-slate-50/50 border-slate-200 shadow-sm opacity-80 hover:opacity-100' 
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5'
              }`}>
                <div className="flex items-center gap-5 w-full">
                  <div className={`p-4 rounded-2xl transition-colors shadow-inner border ${
                    app.status === 'COMPLETED' 
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                      : 'bg-primary-50 text-primary-600 border-primary-100 group-hover:bg-primary-600 group-hover:text-white'
                  }`}>
                    {app.status === 'COMPLETED' ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <Clock size={24} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{app.patientId?.name || "Walk-in Patient"}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 font-bold text-[10px] flex items-center gap-1 uppercase tracking-wider">
                        <Activity size={12} /> {app.treatmentName}
                      </span>
                      <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1 border-l border-slate-200 pl-3">
                        <Timer size={14} className="text-slate-400" /> {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${
                    app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {app.status}
                  </span>
                  {app.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => { setSelectedApptId(app._id); setIsVitalsOpen(true); }} 
                      className="w-full md:w-auto text-sm bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-600 shadow-md transition-all active:scale-95 group-hover:bg-primary-600 flex items-center justify-center gap-2"
                    >
                      <ClipboardList size={16}/> Finalize
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-24 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shadow-sm">
               <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-4">
                 <Calendar size={32} className="text-slate-300"/>
               </div>
               <p className="font-bold uppercase tracking-widest text-sm text-slate-500">Schedule is empty</p>
               <p className="text-xs font-medium mt-1">No appointments booked for this date.</p>
            </div>
          )}
        </div>

        {/* FINALIZE MODAL: Premium Update */}
        {isVitalsOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Close Button */}
              <button onClick={() => setIsVitalsOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
                <X size={20} />
              </button>
              
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0 bg-white">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><ClipboardList size={24} strokeWidth={2.5}/></div>
                  Finalize Consultation
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-2 ml-1">Record vitals, diagnosis, and prescribe treatments.</p>
              </div>

              {/* Scrollable Form Area */}
              <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
                <form id="finalize-form" onSubmit={handleCompleteSession} className="p-8 space-y-8">
                  
                  {/* Vitals */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4"><Activity size={14} className="text-rose-500" /> Patient Vitals</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Pre-BP</label>
                        <input type="text" placeholder="e.g. 120/80" className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner" value={vitalsData.preBp} onChange={(e) => setVitalsData(prev => ({...prev, preBp: e.target.value}))} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Post-BP</label>
                        <input type="text" placeholder="e.g. 118/76" className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner" value={vitalsData.postBp} onChange={(e) => setVitalsData(prev => ({...prev, postBp: e.target.value}))} />
                      </div>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4"><FileText size={14} className="text-sky-500" /> Clinical Assessment</h3>
                    <div className="space-y-4">
                      <textarea 
                         placeholder="Write Chief Complaints here..." 
                         className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner h-24 resize-none" 
                         value={clinicalNotes.chiefComplaints} 
                         onChange={(e) => setClinicalNotes(prev => ({...prev, chiefComplaints: e.target.value}))} 
                      />
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           placeholder="Enter Primary Diagnosis..." 
                           className="w-full border border-slate-200 pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 text-slate-800 font-bold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" 
                           value={clinicalNotes.diagnosis} 
                           onChange={(e) => setClinicalNotes(prev => ({...prev, diagnosis: e.target.value}))} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medicines */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Pill size={14} className="text-emerald-500" /> Prescribe Medicines</h3>
                      <button type="button" onClick={addMedField} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100">+ ADD MED</button>
                    </div>
                    <div className="space-y-3">
                      {selectedMeds.map((med, index) => (
                        <div key={index} className="flex gap-2">
                          <select className="flex-1 border border-slate-200 p-3.5 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner cursor-pointer" value={med.inventoryId} onChange={(e) => {
                              const newMeds = [...selectedMeds];
                              newMeds[index].inventoryId = e.target.value;
                              const item = inventory.find(i => i._id === e.target.value);
                              newMeds[index].price = item?.price || 0;
                              setSelectedMeds(newMeds);
                          }}>
                            <option value="">Select Medicine...</option>
                            {inventory.map(item => <option key={item._id} value={item._id}>{item.name} (₹{item.price})</option>)}
                          </select>
                          <input type="number" min="1" className="w-20 border border-slate-200 p-3.5 rounded-xl text-center outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 font-bold shadow-inner" value={med.quantity} onChange={(e) => {
                              const newMeds = [...selectedMeds];
                              newMeds[index].quantity = Number(e.target.value);
                              setSelectedMeds(newMeds);
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Stethoscope size={14} className="text-purple-500" /> Recommend Therapies</h3>
                      <button type="button" onClick={addTherapyField} className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors border border-purple-100">+ RECOMMEND</button>
                    </div>
                    <div className="space-y-3">
                      {recommendedTherapies.map((th, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <input list="treatment-options" placeholder="Therapy Name..." className="flex-1 border border-slate-200 p-3 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-bold shadow-inner" value={th.treatmentName} onChange={(e) => {
                                const updated = [...recommendedTherapies];
                                updated[index].treatmentName = e.target.value;
                                setRecommendedTherapies(updated);
                          }} />
                          <datalist id="treatment-options">
                            {availableTreatments.map(t => <option key={t._id} value={t.name} />)}
                          </datalist>
                          <input placeholder="Dosage / Notes" className="flex-1 border border-slate-200 p-3 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-inner" value={th.notes} onChange={(e) => {
                                const updated = [...recommendedTherapies];
                                updated[index].notes = e.target.value;
                                setRecommendedTherapies(updated);
                          }} />
                          <button type="button" onClick={() => removeTherapyRow(index)} className="text-slate-300 hover:text-rose-500 p-2 bg-white rounded-lg border border-slate-100 hover:border-rose-200 hover:bg-rose-50 transition-all"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Calendar size={14} className="text-orange-500" /> Next Follow-up Date</h3>
                    <input type="date" className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-slate-700 shadow-inner" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
                  </div>

                </form>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t border-slate-100 bg-white shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10 flex gap-4">
                 <button type="button" onClick={() => setIsVitalsOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   form="finalize-form"
                   disabled={isSaving} 
                   className="flex-[2] py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-primary-600 shadow-xl shadow-slate-900/10 hover:shadow-primary-600/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isSaving ? "Saving Record..." : <><CheckCircle size={18}/> Finalize & Send to Front Desk</>}
                 </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}