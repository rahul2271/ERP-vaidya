"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  PhoneCall, Users, CheckCircle2, XCircle, 
  Calendar, Clock, FileText, Activity, Video, Phone, 
  Stethoscope, Save, UserPlus, CalendarPlus, ChevronLeft, 
  ChevronRight, Timer, MessageCircle, Crown, PhoneOff
} from "lucide-react";
import { toast } from "react-hot-toast"; 
import NoticeBoard from "@/components/NoticeBoard"; 

// Premium Features & Modals
import WhatsAppPipeline from "@/components/WhatsAppPipeline";
import CallDialer from "@/components/CallDialer";
import AddPatientModal from "@/components/modals/AddPatientModal"; 
import BookAppointmentModal from "@/components/modals/BookAppointmentModal";

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", 
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
  "17:00", "17:30", "18:00", "18:30", "19:00"
];

export default function TelecallerDashboard() {
  // Data States
  const [leads, setLeads] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPremium, setIsPremium] = useState(false);
  
  // Premium Tab States
  const [callRecordings, setCallRecordings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"NOTES" | "RECORDINGS">("NOTES");
  const [activeCall, setActiveCall] = useState<{name: string, phone: string} | null>(null);

  // Modal States
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [bookingLead, setBookingLead] = useState<any | null>(null);
  const [isAddPatientOpen, setAddPatientOpen] = useState(false);
  const [isManualBookingOpen, setManualBookingOpen] = useState(false);
  
  // Form States
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("CONTACTED");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [callMode, setCallMode] = useState("VIDEO_CALL");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState(""); 

  // ==========================================
  // INITIALIZATION & FETCHING
  // ==========================================
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      const hospitalPlan = userData.hospitalPlan?.trim().toUpperCase();
      setIsPremium(hospitalPlan === "PREMIUM");
    }

    fetchDashboardData(true);

    // Auto-refresh leads for incoming WhatsApps
    const interval = setInterval(() => {
      fetchDashboardData(false); 
    }, 10000); 

    return () => clearInterval(interval);
  }, [currentDate]);

  const fetchDashboardData = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [leadsRes, staffRes, apptsRes] = await Promise.all([
        axios.get("/leads/telecaller/mine", config).catch(() => ({ data: [] })),
        axios.get("/users", config).catch(() => ({ data: [] })),
        axios.get("/appointments", config).catch(() => ({ data: [] }))
      ]);

      setLeads(leadsRes.data);
      setDoctors(staffRes.data.filter((u: any) => u.role?.toUpperCase() === 'DOCTOR' || u.role?.toUpperCase() === 'THERAPIST'));
      setExistingAppointments(apptsRes.data); 

      // Filter and Sort Daily Queue
      const dailyAppts = (apptsRes.data || [])
        .filter((a: any) => new Date(a.startTime).toISOString().startsWith(currentDate) && a.status !== 'CANCELLED')
        .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      setAppointments(dailyAppts);

    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

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

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/leads/${selectedLead._id}/update`, 
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Lead updated successfully!");
      setSelectedLead(null);
      fetchDashboardData(false);
    } catch (error) {
      toast.error("Failed to update lead.");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptTime) return toast.error("Please select a time slot.");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const patientRes = await axios.post("/patients", {
        name: bookingLead.patientName,
        mobile: String(bookingLead.phone).trim(),
        age: 30, gender: "O", assignedDoctorId: selectedDoctor, 
      }, config);

      const startDateTime = new Date(`${apptDate}T${apptTime}:00`);
      
      await axios.post("/appointments", {
        patientId: patientRes.data._id || patientRes.data.id,
        doctorId: selectedDoctor,
        treatmentName: "Teleconsultation",
        startTime: startDateTime.toISOString(),
        duration: 30,
        mode: "ONLINE", 
        bookingNotes: `[${callMode.replace('_', ' ')}] ${notes}`, 
      }, config);

      await axios.patch(`/leads/${bookingLead._id}/update`, 
        { status: 'BOOKED', notes: `Booked with Doctor on ${apptDate}. ${notes}` }, 
        config
      );

      toast.success("Appointment secured & WhatsApp sent! 🎉");
      setBookingLead(null);
      setApptDate(""); setApptTime(""); setSelectedDoctor("");
      fetchDashboardData(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book slot.");
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  // ==========================================
  // COMPUTED & CONFLICT LOGIC
  // ==========================================
  const activeLeads = leads.filter(l => l.status === 'ASSIGNED' || l.status === 'CONTACTED');
  const convertedLeads = leads.filter(l => l.status === 'BOOKED');

  const bookedDoctorSlots = existingAppointments
    .filter(appt => {
      const apptDateStr = new Date(appt.startTime).toISOString().split('T')[0];
      const docId = appt.doctorId?._id || appt.doctorId;
      return apptDateStr === apptDate && docId === selectedDoctor && appt.status !== 'CANCELLED';
    })
    .map(appt => new Date(appt.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }));

  // ==========================================
  // RENDER UI
  // ==========================================
  if (loading && leads.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#F6F9F8] min-h-screen">
        <div className="h-24 bg-ink-100 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="h-32 bg-ink-100 rounded-2xl w-full"></div><div className="h-32 bg-ink-100 rounded-2xl w-full"></div></div>
        <div className="h-[500px] bg-ink-100 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9F8] p-4 md:p-8 text-ink-900 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 md:p-8 rounded-2xl border border-ink-100 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-inner">
               <PhoneCall size={32} strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink-900 flex items-center gap-3">
                Leads Hub
                {isPremium ? (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 rounded-xl shadow-sm text-white text-[10px] font-bold uppercase tracking-wide"><Crown size={12}/> Premium</span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-primary-700 px-3 py-1 rounded-xl shadow-sm text-white text-[10px] font-bold uppercase tracking-wide"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Standard</span>
                )}
              </h1>
              <p className="text-sm font-medium text-ink-500 mt-1">Screening, follow-ups, and booking routing.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
             <button onClick={() => setAddPatientOpen(true)} className="flex-1 lg:flex-none bg-white text-ink-600 border border-ink-200 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-ink-50 hover:text-sky-600 transition-all shadow-sm"><UserPlus size={18} /> New Patient</button>
             <button onClick={() => setManualBookingOpen(true)} className="flex-1 lg:flex-none bg-sky-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition-all"><CalendarPlus size={18} /> Direct Booking</button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group flex items-center gap-5">
             <div className="absolute -right-4 -bottom-4 bg-amber-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors"></div>
             <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner border border-amber-100 relative z-10 group-hover:scale-110 transition-transform"><Users size={24} strokeWidth={2.5}/></div>
             <div className="relative z-10"><p className="text-ink-400 text-[10px] font-bold uppercase tracking-wide mb-1">Pending Calls</p><h2 className="text-4xl font-bold text-ink-900 tracking-tighter">{activeLeads.length}</h2></div>
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group flex items-center gap-5">
             <div className="absolute -right-4 -bottom-4 bg-emerald-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
             <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100 relative z-10 group-hover:scale-110 transition-transform"><CheckCircle2 size={24} strokeWidth={2.5}/></div>
             <div className="relative z-10"><p className="text-ink-400 text-[10px] font-bold uppercase tracking-wide mb-1">Successful Conversions</p><h2 className="text-4xl font-bold text-ink-900 tracking-tighter">{convertedLeads.length}</h2></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* DAILY SCHEDULE (SOURCE AWARE + TELECALLER TRACKING) */}
            <div className="bg-white rounded-[32px] border border-ink-100 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
              <div className="p-6 border-b border-ink-100 flex justify-between items-center bg-ink-50/50 shrink-0">
                <h3 className="font-bold text-ink-900 flex items-center gap-2"><Clock className="text-sky-500" size={18} strokeWidth={2.5}/> Daily Schedule</h3>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-ink-200 shadow-inner">
                   <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-ink-100 rounded-lg text-ink-500"><ChevronLeft size={16}/></button>
                   <span className="text-[11px] font-bold text-ink-600 w-24 text-center tracking-wide uppercase">{new Date(currentDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}</span>
                   <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-ink-100 rounded-lg text-ink-500"><ChevronRight size={16}/></button>
                </div>
              </div>
              <div className="divide-y divide-ink-100 overflow-y-auto flex-1 custom-scrollbar">
                {appointments.length > 0 ? (
                  appointments.map((appt: any) => {
                    const isFromLead = appt.bookingNotes?.includes("CALL");
                    return (
                      <div key={appt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-ink-50/80 transition-colors group">
                        <div className="flex items-center gap-5">
                           <span className="text-sm font-bold text-ink-400 w-16 group-hover:text-sky-500 text-right">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <div className="h-8 w-[2px] bg-ink-100 rounded-full hidden sm:block"></div>
                           <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-ink-900 text-sm md:text-base">{appt.patientId?.name || "Patient"}</p>
                                {isFromLead ? (
                                  <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter">Lead Conversion</span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-tighter">Direct Booking</span>
                                )}
                              </div>
                              
                              <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wide mt-1">With Dr. {appt.doctorId?.name || 'Staff'} • {appt.treatmentName}</p>
                              
                              {/* 🚀 Shows the Telecaller's Name */}
                              {appt.bookedById && (
                                <p className="text-[10px] text-primary-500 font-bold uppercase tracking-wide mt-0.5 flex items-center gap-1">
                                  <Users size={10} /> Booked by: {appt.bookedById.name}
                                </p>
                              )}

                           </div>
                        </div>
                        <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${appt.paymentStatus?.toUpperCase() === 'PAID' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {appt.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : 'DUE'}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-16 text-center text-ink-400 flex flex-col items-center"><Timer size={40} className="opacity-20 mb-3"/><p className="text-sm font-bold uppercase tracking-wide">No sessions scheduled</p></div>
                )}
              </div>
            </div>

            {/* CALLING LIST QUEUE */}
            <div className="bg-white rounded-[32px] border border-ink-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-ink-100 bg-ink-50/50 shrink-0">
                <h3 className="font-bold text-ink-900 flex items-center gap-3 uppercase text-xs tracking-[0.2em]"><Activity className="text-sky-500" size={18} strokeWidth={3}/> Calling List</h3>
              </div>
              <div className="p-6 bg-ink-50/30 flex-1 overflow-y-auto">
                {activeLeads.length === 0 ? (
                  <div className="py-24 text-center text-ink-400 italic">No pending leads found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeLeads.map((lead) => (
                      <div key={lead._id} className="relative bg-white border border-ink-200 rounded-[24px] p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group border-b-4 border-b-slate-100 hover:border-b-sky-500">
                        {lead.unreadCount > 0 && (
                          <div className="absolute -top-3 -right-3 h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white animate-bounce z-10">{lead.unreadCount}</div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-10 w-10 bg-ink-50 rounded-xl flex items-center justify-center text-ink-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors"><Users size={18} /></div>
                          <button 
                            onClick={() => setActiveCall({ name: lead.patientName, phone: lead.phone })}
                            className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm" title="Start Direct Call"
                          >
                            <PhoneCall size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                        <h4 className="font-bold text-lg text-ink-900 mb-1">{lead.patientName}</h4>
                        <p className="text-xs font-bold text-ink-400 mb-4 flex items-center gap-1.5"><Phone size={12}/> {lead.phone}</p>
                        
                        {lead.unreadCount > 0 && (
                          <div className="mb-4 flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div> New Reply</span>
                            <MessageCircle size={12} className="text-emerald-500" />
                          </div>
                        )}

                        <div className="flex gap-2 mt-auto pt-2">
                          <button 
                            onClick={() => { 
                              setSelectedLead(lead); setStatus(lead.status); setNotes(lead.medicalHistoryNotes || ""); 
                              setActiveTab("NOTES"); fetchRecordings(lead.phone); 
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95 border ${lead.unreadCount > 0 ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-ink-50 text-ink-500 hover:bg-sky-600 hover:text-white border-ink-100'}`}
                          >
                            {lead.unreadCount > 0 ? "Read Message" : "Chat & Notes"}
                          </button>
                          <button 
                            onClick={() => { setBookingLead(lead); setNotes(lead.medicalHistoryNotes || ""); }} 
                            className="h-9 w-9 bg-primary-700 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-all active:scale-95 shrink-0"
                          >
                            <Calendar size={14} strokeWidth={2.5}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6"><NoticeBoard /></div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: DETAILS, WHATSAPP & RECORDINGS TABS */}
        {/* ========================================================================= */}
        {selectedLead && (
          <div className="fixed inset-0 bg-primary-700/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-lg relative border border-ink-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row h-[85vh]">
              
              <div className="flex-[1.2] bg-ink-50 p-8 border-r border-ink-100 flex flex-col overflow-y-auto">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-ink-900 flex items-center gap-3"><MessageCircle className="text-emerald-500" size={28} /> WhatsApp Hub</h2>
                 </div>
                 <WhatsAppPipeline leadId={selectedLead._id} leadName={selectedLead.patientName} leadPhone={selectedLead.phone} isPremium={isPremium} />
              </div>

              <div className="flex-1 p-8 flex flex-col bg-white">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4 border-b border-ink-100 pb-2">
                    <button onClick={() => setActiveTab("NOTES")} className={`text-sm font-bold uppercase tracking-wide pb-2 border-b-2 transition-all ${activeTab === "NOTES" ? "border-sky-600 text-sky-600" : "border-transparent text-ink-400 hover:text-ink-500"}`}>Disposition</button>
                    <button onClick={() => setActiveTab("RECORDINGS")} className={`text-sm font-bold uppercase tracking-wide pb-2 border-b-2 transition-all ${activeTab === "RECORDINGS" ? "border-emerald-600 text-emerald-600" : "border-transparent text-ink-400 hover:text-ink-500"}`}>Call History</button>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="text-ink-400 hover:text-rose-500 transition-colors p-2 bg-ink-50 rounded-full"><XCircle size={24} /></button>
                </div>

                {activeTab === "NOTES" && (
                  <form onSubmit={handleUpdateLead} className="flex-1 flex flex-col space-y-6 mt-2 animate-in fade-in duration-300">
                    <div>
                      <label className="text-[10px] font-bold text-ink-500 uppercase tracking-wide block mb-3 ml-1">Call Disposition</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-ink-100 p-4 rounded-2xl bg-ink-50 outline-none focus:border-sky-500 text-sm font-bold text-ink-600 transition-all">
                        <option value="ASSIGNED">Assigned</option>
                        <option value="CONTACTED">In Progress</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="text-[10px] font-bold text-ink-500 uppercase tracking-wide block mb-3 ml-1">Screening Summary</label>
                      <textarea placeholder="Note down history..." value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1 w-full border-2 border-ink-100 p-6 rounded-[32px] bg-ink-50 outline-none focus:border-sky-500 text-sm font-medium transition-all resize-none min-h-[200px]"/>
                    </div>
                    <button type="submit" className="w-full py-5 rounded-2xl font-bold text-white bg-primary-700 hover:bg-sky-600 shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wide text-xs"><Save size={18} strokeWidth={3}/> Update File</button>
                  </form>
                )}

                {activeTab === "RECORDINGS" && (
                  <div className="flex-1 flex flex-col space-y-4 mt-2 animate-in fade-in duration-300 overflow-y-auto pr-2 custom-scrollbar">
                    {callRecordings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-ink-400 space-y-3"><PhoneOff size={40} className="opacity-30" /><p className="text-xs font-bold tracking-wide uppercase">No recordings found</p></div>
                    ) : (
                      callRecordings.map((rec, index) => (
                        <div key={index} className="bg-ink-50 p-5 rounded-[24px] border border-ink-200 shadow-sm flex flex-col gap-3 hover:border-sky-200 transition-colors">
                          <div className="flex justify-between items-center">
                             <p className="text-xs font-bold text-ink-600 uppercase tracking-wide flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Call Session {index + 1}</p>
                             <p className="text-[10px] font-bold text-ink-400">{new Date(rec.createdAt).toLocaleString()}</p>
                          </div>
                          <audio controls className="w-full h-10 outline-none">
                            <source src={`${rec.details}.mp3`} type="audio/mpeg" />
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

        {/* ========================================================================= */}
        {/* MODAL 2: LEAD SMART SLOT BOOKING */}
        {/* ========================================================================= */}
        {bookingLead && (
          <div className="fixed inset-0 bg-primary-700/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-lg shadow-lg relative border border-ink-100 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
              <div className="px-10 pt-10 pb-8 border-b border-ink-100 bg-ink-50/50 text-center relative">
                <button onClick={() => setBookingLead(null)} className="absolute right-6 top-6 text-ink-300 hover:text-rose-500"><XCircle size={28} /></button>
                <div className="p-4 bg-sky-600 text-white rounded-[24px] w-fit mx-auto mb-4"><Calendar size={28} /></div>
                <h2 className="text-2xl font-bold text-ink-900">Route Patient</h2>
                <p className="text-xs font-bold text-ink-400 mt-2 uppercase tracking-wide">{bookingLead.patientName}</p>
              </div>
              
              <div className="p-8 bg-white overflow-y-auto max-h-[60vh] custom-scrollbar">
                <form id="lead-book-form" onSubmit={handleBookAppointment} className="space-y-6">
                  
                  <select required value={selectedDoctor} onChange={(e) => { setSelectedDoctor(e.target.value); setApptTime(""); }} className="w-full border-2 border-ink-100 p-4 rounded-2xl bg-ink-50 outline-none focus:border-sky-500 text-sm font-bold">
                    <option value="" disabled>Select Doctor...</option>
                    {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.name}</option>)}
                  </select>
                  
                  <input required type="date" value={apptDate} onChange={(e) => { setApptDate(e.target.value); setApptTime(""); }} className="w-full border-2 border-ink-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-sky-500" />
                  
                  {/* SMART SLOT PICKER */}
                  {selectedDoctor && apptDate && (
                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-wide block mb-3">Select Slot *</label>
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(slot => {
                          const isBooked = bookedDoctorSlots.includes(slot);
                          return (
                            <button key={slot} type="button" disabled={isBooked} onClick={() => setApptTime(slot)} className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${isBooked ? 'bg-ink-50 border-ink-50 text-ink-300 cursor-not-allowed line-through' : apptTime === slot ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-white border-ink-100 text-ink-500 hover:border-sky-300'}`}>
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCallMode('VIDEO_CALL')} className={`flex-1 py-3.5 rounded-2xl text-xs font-bold border-2 transition-all ${callMode === 'VIDEO_CALL' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-ink-100 text-ink-400'}`}><Video className="inline mr-1" size={14}/> Video Call</button>
                    <button type="button" onClick={() => setCallMode('AUDIO_CALL')} className={`flex-1 py-3.5 rounded-2xl text-xs font-bold border-2 transition-all ${callMode === 'AUDIO_CALL' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-ink-100 text-ink-400'}`}><Phone className="inline mr-1" size={14}/> Audio Call</button>
                  </div>
                  
                </form>
              </div>

              <div className="p-8 border-t bg-ink-50 shrink-0">
                 <button type="submit" form="lead-book-form" disabled={!apptTime} className="w-full py-5 rounded-[24px] font-bold text-white bg-primary-700 hover:bg-sky-600 transition-all uppercase text-xs tracking-wide disabled:opacity-50 shadow-xl flex items-center justify-center gap-2">
                   <CheckCircle2 size={18}/> Confirm & Notify
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3 & 4: GLOBAL MODALS FOR MANUAL ENTRY */}
        {/* ========================================================================= */}
        <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setAddPatientOpen(false)} onSuccess={() => { setAddPatientOpen(false); setManualBookingOpen(true); }} />
        <BookAppointmentModal isOpen={isManualBookingOpen} onClose={() => setManualBookingOpen(false)} onSuccess={() => { setManualBookingOpen(false); fetchDashboardData(); }} />

        {/* ========================================================================= */}
        {/* VOIP DIALER OVERLAY */}
        {/* ========================================================================= */}
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