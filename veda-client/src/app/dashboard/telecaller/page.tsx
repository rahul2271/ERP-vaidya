"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  PhoneCall, Users, CheckCircle2, XCircle, 
  Calendar, Clock, FileText, Activity, Video, Phone, Save, MessageCircle, Crown, Bell, PhoneOff
} from "lucide-react";
import WhatsAppPipeline from "@/components/WhatsAppPipeline";
import CallDialer from "@/components/CallDialer";

export default function TelecallerDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isPremium, setIsPremium] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [bookingLead, setBookingLead] = useState<any | null>(null);
  const [activeCall, setActiveCall] = useState<{name: string, phone: string} | null>(null);

  // 🚀 New States for the Tabbed Interface
  const [callRecordings, setCallRecordings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"NOTES" | "RECORDINGS">("NOTES");

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("CONTACTED");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [callMode, setCallMode] = useState("VIDEO_CALL");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      const hospitalPlan = userData.hospitalPlan?.trim().toUpperCase();
      setIsPremium(hospitalPlan === "PREMIUM");
    }
    
    fetchMyLeadsAndDoctors();

    const interval = setInterval(() => {
      fetchMyLeadsAndDoctors(false); 
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const fetchMyLeadsAndDoctors = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [leadsRes, staffRes] = await Promise.all([
        axios.get("/leads/telecaller/mine", config).catch(() => ({ data: [] })),
        axios.get("/users", config).catch(() => ({ data: [] }))
      ]);

      setLeads(leadsRes.data);
      const docs = staffRes.data.filter((u: any) => u.role?.toUpperCase() === 'DOCTOR');
      setDoctors(docs);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // 🚀 Fetch specific call history when a lead is clicked
  const fetchRecordings = async (phone: string) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/calls/history/${phone}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCallRecordings(data);
    } catch (err) {
      console.error("Could not fetch recordings", err);
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/leads/${selectedLead._id}/update`, 
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedLead(null);
      fetchMyLeadsAndDoctors();
    } catch (error) {
      alert("Failed to update lead.");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingLead || !selectedDoctor || !apptDate || !apptTime) {
      return alert("Please select a doctor, date, and time.");
    }
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const patientPayload = {
        name: bookingLead.patientName,
        mobile: String(bookingLead.phone).trim(),
        age: 30,
        gender: "O",
        assignedDoctorId: selectedDoctor, 
      };
      const patientRes = await axios.post("/patients", patientPayload, config);
      const newPatientId = patientRes.data._id || patientRes.data.id; 
      const startDateTime = new Date(`${apptDate}T${apptTime}`);
      const apptPayload = {
        patientId: newPatientId,
        doctorId: selectedDoctor,
        treatmentName: "Teleconsultation",
        startTime: startDateTime,
        duration: 30,
        mode: "ONLINE", 
        bookingNotes: `[${callMode.replace('_', ' ')}] ${notes}`, 
      };
      await axios.post("/appointments", apptPayload, config);
      await axios.patch(`/leads/${bookingLead._id}/update`, 
        { status: 'BOOKED', notes: `Booked with Doctor on ${apptDate}. ${notes}` }, 
        config
      );
      alert("Appointment successfully routed to Doctor's Console!");
      setBookingLead(null);
      fetchMyLeadsAndDoctors();
    } catch (error) {
      alert("Failed to book appointment.");
    }
  };

  const activeLeads = leads.filter(l => l.status === 'ASSIGNED' || l.status === 'CONTACTED');

  if (loading && leads.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
           <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
        </div>
        <div className="h-[500px] bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-inner">
               <PhoneCall size={32} strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Leads Hub</h1>
              <p className="text-sm font-medium text-slate-500">Real-time follow-ups and WhatsApp outreach.</p>
            </div>
          </div>
          
          {isPremium ? (
            <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 rounded-2xl shadow-xl shadow-amber-500/20 text-white">
               <Crown size={18} fill="white" />
               <span className="text-xs font-black uppercase tracking-widest">Premium Facility</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-2xl shadow-xl shadow-slate-900/10">
               <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <span className="text-xs font-black text-white uppercase tracking-widest">Standard Plan</span>
            </div>
          )}
        </div>

        {/* CALLING LIST QUEUE */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase text-xs tracking-[0.2em]">
               <Activity className="text-sky-500" size={18} strokeWidth={3}/> Calling List
             </h3>
          </div>

          <div className="p-8 bg-slate-50/30 flex-1">
            {activeLeads.length === 0 ? (
              <div className="py-24 text-center text-slate-400 italic">No pending leads found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeLeads.map((lead) => (
                  <div key={lead._id} className="relative bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col group border-b-4 border-b-slate-100 hover:border-b-sky-500">
                    
                    {lead.unreadCount > 0 && (
                      <div className="absolute -top-3 -right-3 h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-500/30 border-2 border-white animate-bounce z-10">
                        {lead.unreadCount}
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                      <div className="relative h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                        <Users size={20} />
                      </div>

                      <button 
                        onClick={() => setActiveCall({ name: lead.patientName, phone: lead.phone })}
                        className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm shadow-emerald-200"
                        title="Start Direct Call"
                      >
                        <PhoneCall size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                    
                    <h4 className="font-black text-xl text-slate-900 mb-1">{lead.patientName}</h4>
                    <p className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                       <Phone size={14} className="text-slate-400"/> {lead.phone}
                    </p>

                    {lead.unreadCount > 0 && (
                      <div className="mb-4 flex items-center justify-between bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">New WhatsApp Reply</span>
                        </div>
                        <MessageCircle size={14} className="text-emerald-500" />
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto pt-2">
                      <button 
                        onClick={() => { 
                          setSelectedLead(lead); 
                          setStatus(lead.status); 
                          setNotes(lead.medicalHistoryNotes || ""); 
                          lead.unreadCount = 0; 
                          setActiveTab("NOTES"); // Reset to notes tab by default
                          fetchRecordings(lead.phone); // 🚀 Fetch audio files!
                        }}
                        className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 border ${
                          lead.unreadCount > 0 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                            : 'bg-slate-50 text-slate-600 hover:bg-sky-600 hover:text-white border-slate-50'
                        }`}
                      >
                        {lead.unreadCount > 0 ? "Read Message" : "Details & Chat"}
                      </button>
                      <button 
                        onClick={() => { setBookingLead(lead); setNotes(lead.medicalHistoryNotes || ""); }} 
                        className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-slate-900/20 shrink-0"
                      >
                        <Calendar size={18} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: DETAILS, WHATSAPP & RECORDINGS */}
        {selectedLead && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row h-[85vh]">
              
              <div className="flex-[1.2] bg-slate-50 p-8 border-r border-slate-100 flex flex-col overflow-y-auto">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <MessageCircle className="text-emerald-500" size={28} /> WhatsApp Hub
                    </h2>
                 </div>
                 <WhatsAppPipeline 
                    leadId={selectedLead._id}
                    leadName={selectedLead.patientName}
                    leadPhone={selectedLead.phone}
                    isPremium={isPremium} 
                 />
              </div>

              {/* 🚀 TABBED INTERFACE (NOTES vs RECORDINGS) */}
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4 border-b border-slate-100 pb-2">
                    <button 
                      onClick={() => setActiveTab("NOTES")} 
                      className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === "NOTES" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                      Disposition
                    </button>
                    <button 
                      onClick={() => setActiveTab("RECORDINGS")} 
                      className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === "RECORDINGS" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                      Call History
                    </button>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-slate-50 rounded-full">
                    <XCircle size={24} />
                  </button>
                </div>

                {/* TAB 1: DISPOSITION FORM */}
                {activeTab === "NOTES" && (
                  <form onSubmit={handleUpdateLead} className="flex-1 flex flex-col space-y-6 mt-2 animate-in fade-in duration-300">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 ml-1">Call Disposition</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-3xl bg-slate-50 outline-none focus:border-sky-500 text-sm font-bold text-slate-700 transition-all">
                        <option value="ASSIGNED">Assigned</option>
                        <option value="CONTACTED">In Progress</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 ml-1">Screening Summary</label>
                      <textarea 
                        placeholder="Note down history..." 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                        className="flex-1 w-full border-2 border-slate-100 p-6 rounded-[32px] bg-slate-50 outline-none focus:border-sky-500 text-sm font-medium transition-all resize-none min-h-[200px]"
                      />
                    </div>
                    <button type="submit" className="w-full py-5 rounded-3xl font-black text-white bg-slate-900 hover:bg-sky-600 shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                      <Save size={18} strokeWidth={3}/> Update File
                    </button>
                  </form>
                )}

                {/* TAB 2: AUDIO RECORDINGS */}
                {activeTab === "RECORDINGS" && (
                  <div className="flex-1 flex flex-col space-y-4 mt-2 animate-in fade-in duration-300 overflow-y-auto pr-2 custom-scrollbar">
                    {callRecordings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
                        <PhoneOff size={40} className="opacity-30" />
                        <p className="text-xs font-black tracking-widest uppercase">No recordings found</p>
                      </div>
                    ) : (
                      callRecordings.map((rec, index) => (
                        <div key={index} className="bg-slate-50 p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-sky-200 transition-colors">
                          <div className="flex justify-between items-center">
                             <p className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                               <div className="h-2 w-2 rounded-full bg-emerald-500"></div> Call Session {index + 1}
                             </p>
                             <p className="text-[10px] font-bold text-slate-400">{new Date(rec.createdAt).toLocaleString()}</p>
                          </div>
                          {/* Twilio URLs require .mp3 appended for direct browser playback */}
                          <audio controls className="w-full h-10 outline-none">
                            <source src={`${rec.details}.mp3`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* MODAL 2: BOOKING */}
        {bookingLead && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
              <div className="px-10 pt-10 pb-8 border-b border-slate-100 bg-slate-50/50 text-center">
                <div className="flex justify-between items-center mb-6">
                   <div className="p-4 bg-sky-600 text-white rounded-[24px]">
                      <Calendar size={28} />
                   </div>
                   <button onClick={() => setBookingLead(null)} className="text-slate-300 hover:text-rose-500">
                     <XCircle size={28} />
                   </button>
                </div>
                <h2 className="text-3xl font-black">Route Patient</h2>
              </div>
              <div className="p-10 space-y-8 bg-white">
                <form id="book-appt-form" onSubmit={handleBookAppointment} className="space-y-6">
                  <select required value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-slate-50 outline-none focus:border-sky-500 text-sm font-black">
                    <option value="" disabled>Select Doctor...</option>
                    {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold" />
                    <input required type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold" />
                  </div>
                </form>
              </div>
              <div className="p-10 border-t bg-white">
                 <button type="submit" form="book-appt-form" className="w-full py-5 rounded-3xl font-black text-white bg-slate-900 hover:bg-sky-600 transition-all uppercase text-xs tracking-widest">
                   Confirm Appointment
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* 🚀 VOIP DIALER OVERLAY */}
        {activeCall && (
          <CallDialer 
            phoneNumber={activeCall.phone} 
            patientName={activeCall.name} 
            onClose={() => setActiveCall(null)} 
          />
        )}
        
      </div>
    </div>
  );
}