"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  UserPlus, CalendarPlus, Clock, X, 
  CheckCircle, AlertCircle, FileText, ChevronLeft, ChevronRight, ChevronDown, Edit ,
  CheckCircle2, Timer, IndianRupee, Stethoscope, Trash2, CalendarCheck,
  BedDouble, UserCheck, Sparkles, Activity, Smartphone, Printer,
  Coffee, LogOut, FileCheck, ClipboardList, Siren, Banknote, Hourglass, LayoutGrid
} from "lucide-react";
import { toast } from "react-hot-toast"; 

import BookAppointmentModal from "@/components/modals/BookAppointmentModal";
import AddPatientModal from "@/components/modals/AddPatientModal"; 
import ProcessPaymentModal from "@/components/modals/ProcessPaymentModal";
import NoticeBoard from "@/components/NoticeBoard"; 

// Half-hour slots covering a typical clinic day, used by the Room Occupancy Matrix.
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

// 🚀 STRICT REAL-TIME STATUS RESOLVER
// 🚀 STRICT REAL-TIME STATUS RESOLVER (Checks exact database fields)
const resolveStaffStatus = (staff: any) => {
  const rawStatus = staff.attendanceStatus || staff.status || 'OFFLINE';
  const statusStr = String(rawStatus).toUpperCase();

  // Available / Online
  if (['AVAILABLE', 'ONLINE', 'ACTIVE'].includes(statusStr)) {
    return {
      status: staff.attendanceStatus || staff.status || 'Available',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: UserCheck,
      isOnline: true,
      dotColor: 'bg-emerald-500' // 🚀 FIX: Added missing dotColor
    };
  }

  // Busy / In Session
  if (['BUSY', 'IN_SESSION', 'IN CABIN'].includes(statusStr)) {
    return {
      status: staff.attendanceStatus || staff.status || 'In Cabin',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: Activity, 
      isOnline: true,
      dotColor: 'bg-amber-500' // 🚀 FIX: Added missing dotColor
    };
  }

  // Offline / Default
  return {
    status: staff.attendanceStatus || staff.status || 'Offline',
    color: 'text-ink-400',
    bg: 'bg-ink-50',
    border: 'border-ink-200',
    icon: LogOut,
    isOnline: false,
    dotColor: 'bg-ink-300' // 🚀 FIX: Added missing dotColor
  };
};

export default function ReceptionDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]); 
  const [pendingBills, setPendingBills] = useState([]);
  const [pendingRecommendations, setPendingRecommendations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]); 
  const [settlement, setSettlement] = useState({ UPI: 0, CASH: 0, CARD: 0, TOTAL: 0 });
  const [pettyCash, setPettyCash] = useState(2500); // 🚀 NEW: Daily Petty Cash Float
  
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddPatientOpen, setAddPatientOpen] = useState(false); 
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  
  // 🚀 CALENDAR STATE
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [sendingQuizId, setSendingQuizId] = useState<string | null>(null);
  
  const [orderForm, setOrderForm] = useState({ date: new Date().toISOString().split('T')[0], time: '09:00', roomId: '', therapistId: '' });

  // 🚀 NEW: Live Wait Time Clock
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchDailyData();
  }, [currentDate]); 

  // Update 'now' every minute to keep wait times accurate
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDailyData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [apptsRes, roomsRes, usersRes] = await Promise.all([
        axios.get("/appointments", config).catch(() => ({ data: [] })),
        axios.get("/rooms", config).catch(() => ({ data: [] })),
        axios.get("/users", config).catch(() => ({ data: [] })) 
      ]);
      
      setRooms(roomsRes.data || []);
      const filteredStaff = (usersRes.data || []).filter((u: any) => u.role?.toUpperCase() === 'THERAPIST' || u.role?.toUpperCase() === 'DOCTOR');
      setStaff(filteredStaff); 

      const gridDateStr = new Date(currentDate).toISOString().split('T')[0];
      const realTodayStr = new Date().toISOString().split('T')[0];

      const daysAppts = (apptsRes.data || []).filter((appt: any) => new Date(appt.startTime).toISOString().startsWith(gridDateStr));
      const unpaid = (apptsRes.data || []).filter((appt: any) => ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'WAITING'].includes(appt.status) && appt.paymentStatus?.toUpperCase() !== 'PAID');

      const recommendations: any[] = [];
      (apptsRes.data || []).forEach((appt: any) => {
        if (appt.recommendedTherapies && appt.recommendedTherapies.length > 0) {
          appt.recommendedTherapies.forEach((rec: any) => {
            if (rec.isProcessed === false || rec.isProcessed === undefined) {
              recommendations.push({ ...rec, patientName: appt.patientId?.name || "Patient Record", patientId: appt.patientId?._id || appt.patientId, originalApptId: appt._id });
            }
          });
        }
      });

      const calcSettlement = { UPI: 0, CASH: 0, CARD: 0, TOTAL: 0 };
      (apptsRes.data || []).forEach((appt: any) => {
        const isPaid = appt.status === 'COMPLETED' && appt.paymentStatus?.toUpperCase() === 'PAID';
        const isToday = new Date(appt.updatedAt || appt.startTime).toISOString().startsWith(realTodayStr);
        if (isPaid && isToday) {
          const amount = appt.finalBilledAmount || appt.amount || 0;
          calcSettlement.TOTAL += amount;
          const mode = appt.paymentMode?.toUpperCase() || 'UPI';
          if (mode === 'UPI') calcSettlement.UPI += amount;
          else if (mode === 'CASH') calcSettlement.CASH += amount;
          else if (mode === 'CARD') calcSettlement.CARD += amount;
        }
      });

      setAppointments(daysAppts);
      setPendingBills(unpaid);
      setSettlement(calcSettlement);
      setPendingRecommendations(recommendations);
    } catch (err) { console.error("Fetch failed:", err); } finally { setLoading(false); }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem("token");
      // 🚀 Track the exact moment they checked in for wait-time tracking
      await axios.patch(`/appointments/${appointmentId}`, { status: 'WAITING', checkInTime: new Date().toISOString() }, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Patient Checked-In. Doctor Notified!");
      fetchDailyData(); 
    } catch (error) { toast.error("Failed to check-in patient."); }
  };

  const handlePrintEOD = () => { toast.success("Generating EOD Settlement..."); setTimeout(() => window.print(), 1000); };
  const [ticketAppt, setTicketAppt] = useState<any>(null);
  const [ticketSending, setTicketSending] = useState<'whatsapp' | 'email' | null>(null);
  const [ticketEmailInput, setTicketEmailInput] = useState('');

  const handlePrintTicket = async (appointmentId: string) => {
    // Open the tab synchronously (before the await) so browsers don't treat
    // it as an unsolicited popup — then point it at the blob once it's ready.
    const ticketWindow = window.open('', '_blank');
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/appointments/${appointmentId}/ticket`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(res.data);
      if (ticketWindow) ticketWindow.location.href = blobUrl;
      else window.open(blobUrl, '_blank'); // fallback if the initial open was blocked anyway
    } catch (err: any) {
      ticketWindow?.close();
      toast.error("Failed to load ticket. Try again.");
    }
  };

  const handleSendTicketWhatsapp = async (appointmentId: string) => {
    setTicketSending('whatsapp');
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/appointments/${appointmentId}/send-ticket-whatsapp`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Ticket sent via WhatsApp!");
      setTicketAppt(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send WhatsApp ticket.");
    } finally {
      setTicketSending(null);
    }
  };

  const handleSendTicketEmail = async (appointmentId: string) => {
    if (!ticketEmailInput.trim()) { toast.error("Enter an email address."); return; }
    setTicketSending('email');
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/appointments/${appointmentId}/send-ticket-email`, { email: ticketEmailInput.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Ticket emailed!");
      setTicketAppt(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to email ticket.");
    } finally {
      setTicketSending(null);
    }
  };

  const handlePrintInvoice = (name: string) => toast.success(`Printing Final Invoice for ${name}`);
  
  // 🚀 NEW: Code Blue Emergency Alert
  const handleEmergencyAlert = () => {
    toast.error("🚨 CODE BLUE INITIATED! Alerting all available doctors and staff immediately!", {
      duration: 6000,
      style: { background: '#e11d48', color: '#fff', fontWeight: '900', padding: '16px', fontSize: '16px' },
      iconTheme: { primary: '#fff', secondary: '#e11d48' },
    });
  };

  const handleProcessOrder = async (rec: any, action: 'BOOK' | 'DISCARD') => {
    if (action === 'DISCARD') {
      if (!window.confirm(`Mark ${rec.treatmentName} as "Not Taken"?`)) return;
      try {
        await axios.post(`/appointments/process-recommendation`, { originalApptId: rec.originalApptId, therapyId: rec._id, action: 'DISCARD' }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        fetchDailyData(); 
      } catch (err) { alert("Failed to discard."); }
    } else { setActiveOrder(rec); }
  };

  const handleConfirmOrderBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const token = localStorage.getItem("token");
       const config = { headers: { Authorization: `Bearer ${token}` } };
       const startDateTime = new Date(`${orderForm.date}T${orderForm.time}`);

       await axios.post(`/appointments/process-recommendation`, {
         originalApptId: activeOrder.originalApptId, therapyId: activeOrder._id, action: 'BOOK',
         patientId: activeOrder.patientId, treatmentName: activeOrder.treatmentName, startTime: startDateTime.toISOString(), roomId: orderForm.roomId                
       }, config);

       const selectedRoom = rooms.find(r => r._id === orderForm.roomId);
       await axios.post(`/therapies`, {
         patientName: activeOrder.patientName, patientId: activeOrder.patientId, therapyName: activeOrder.treatmentName,
         therapistId: orderForm.therapistId, roomNumber: selectedRoom ? selectedRoom.name : "Room", date: orderForm.date, time: orderForm.time
       }, config);

       toast.success("✅ Scheduled & Sent to Dashboard!");
       setActiveOrder(null); 
       setOrderForm({ date: new Date().toISOString().split('T')[0], time: '09:00', roomId: '', therapistId: '' });
       fetchDailyData();     
    } catch(err: any) {
      // 🚀 Surface the real backend error instead of a generic message, so failures are diagnosable
      console.error("Schedule Therapy failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to schedule therapy. Check console for details.");
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleAdmit = async (appointmentId: string, targetType: 'IPD' | 'DAY_CARE') => {
    const label = targetType === 'IPD' ? 'IPD (admission)' : 'Day Care';
    if (!window.confirm(`Admit this patient to ${label}? This generates a new registration number.`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`/appointments/${appointmentId}/admit`, { targetType }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newNumber = targetType === 'IPD' ? res.data.ipdNumber : res.data.dayCareNumber;
      toast.success(`Admitted to ${label} — ${newNumber}`);
      fetchDailyData();
    } catch (err: any) {
      console.error("Admit failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to admit patient.");
    }
  };

  const [dischargeAppt, setDischargeAppt] = useState<any>(null);
  const [dischargeCondition, setDischargeCondition] = useState('');
  const [dischargeAdvice, setDischargeAdvice] = useState('');
  const [dischargeSaving, setDischargeSaving] = useState(false);

  const handleConfirmDischarge = async () => {
    if (!dischargeAppt) return;
    setDischargeSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/appointments/${dischargeAppt._id}/discharge`,
        { dischargeCondition, dischargeAdvice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Patient discharged.");
      setDischargeAppt(null);
      fetchDailyData();
    } catch (err: any) {
      console.error("Discharge failed:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to discharge patient.");
    } finally {
      setDischargeSaving(false);
    }
  };

  // Used by the Room Occupancy Matrix below to find which booking, if any,
  // occupies a given room at a given time slot.
  const getAppointmentForSlot = (roomId: string, roomName: string, time: string) => {
    return appointments.find((appt) => {
      const apptTime = new Date(appt.startTime).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
      });
      const matchedRoom = appt.roomId?._id === roomId || appt.roomId === roomId || appt.room === roomName;
      return matchedRoom && apptTime === time;
    });
  };

  const handleSendPrakritiQuiz = async (patientId: string) => {
    if (!patientId) return;
    setSendingQuizId(patientId);
    try {
      await axios.post(`/patients/${patientId}/send-prakriti-quiz`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
      toast.success("Quiz sent to patient's WhatsApp! 🌿");
    } catch (error: any) { toast.error(error.response?.data?.message || "Failed to send quiz."); } finally { setSendingQuizId(null); }
  };

  const activeDoctors = [...staff].filter(s => s.role?.toUpperCase() === 'DOCTOR').filter(s => resolveStaffStatus(s).isOnline).sort((a, b) => resolveStaffStatus(a).status === 'Available' ? -1 : 1);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#F6F9F8] min-h-screen">
        <div className="h-24 bg-ink-100 rounded-2xl w-full"></div>
        <div className="h-64 bg-ink-100 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9F8] p-4 md:p-8 space-y-8 text-ink-900 pb-10">
      <BookAppointmentModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onSuccess={fetchDailyData} />
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setAddPatientOpen(false)} onSuccess={() => { setAddPatientOpen(false); fetchDailyData(); }} />
      <ProcessPaymentModal isOpen={!!selectedBillId} onClose={() => setSelectedBillId(null)} appointmentId={selectedBillId} onSuccess={fetchDailyData} />

      {/* 🚀 FIX: Schedule Therapy modal — was missing from render tree, so the "Schedule" button had no visible effect */}
      {activeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-lg relative">
            <button onClick={() => setActiveOrder(null)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><X size={24}/></button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Therapy</h2>

            <div className="bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
              <p className="font-bold text-orange-900">{activeOrder.patientName}</p>
              <p className="text-sm text-orange-700 font-bold uppercase mt-1 tracking-wide">{activeOrder.treatmentName}</p>
              {activeOrder.notes && <p className="text-xs text-orange-600/80 italic mt-2 border-t border-orange-200/50 pt-2">&quot; {activeOrder.notes} &quot;</p>}
            </div>

            <form onSubmit={handleConfirmOrderBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-black">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Date</label>
                  <input type="date" className="w-full border-2 p-3 rounded-xl mt-1 outline-none focus:border-primary-500" value={orderForm.date} onChange={e => setOrderForm({...orderForm, date: e.target.value})} required/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Time</label>
                  <input type="time" className="w-full border-2 p-3 rounded-xl mt-1 outline-none focus:border-primary-500" value={orderForm.time} onChange={e => setOrderForm({...orderForm, time: e.target.value})} required/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-black">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1"><BedDouble size={12}/> Assign Room</label>
                  <select className="w-full border-2 p-3 rounded-xl mt-1 outline-none focus:border-primary-500" value={orderForm.roomId} onChange={e => setOrderForm({...orderForm, roomId: e.target.value})} required>
                    <option value="">Select Room...</option>
                    {rooms.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1"><UserCheck size={12}/> Therapist</label>
                  <select className="w-full border-2 p-3 rounded-xl mt-1 outline-none focus:border-primary-500" value={orderForm.therapistId} onChange={e => setOrderForm({...orderForm, therapistId: e.target.value})} required>
                    <option value="">Select Therapist...</option>
                    {staff.filter((s: any) => s.role?.toUpperCase() === 'THERAPIST').map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                  {staff.filter((s: any) => s.role?.toUpperCase() === 'THERAPIST').length === 0 && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">⚠ No therapist accounts found for this hospital. Add a staff member with the Therapist role first.</p>
                  )}
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all mt-6">
                Confirm Booking & Send to Therapist
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER SECTION WITH EMERGENCY */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-ink-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600"></div>
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-700 to-sky-500 bg-clip-text text-transparent flex items-center gap-3">
             Front Desk Console
           </h1>
           <div className="flex items-center gap-2 mt-2">
             <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
             <p className="text-ink-500 font-medium text-sm">Live Doctor & Pharmacy Sync</p>
           </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto mt-2 md:mt-0">
           {/* 🚀 NEW: Code Blue Emergency Button */}
           <button onClick={handleEmergencyAlert} className="flex-1 md:flex-none bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 transition-all group">
             <Siren size={20} className="group-hover:animate-pulse" strokeWidth={2.5} /> <span className="uppercase tracking-wide text-xs">Emergency</span>
           </button>

           <button onClick={() => setAddPatientOpen(true)} className="flex-1 md:flex-none bg-ink-50 hover:bg-ink-100 border border-ink-200 text-ink-600 px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 transition-all">
             <UserPlus size={18} strokeWidth={2.5} /> Walk-in
           </button>
           <button onClick={() => setIsBookingModalOpen(true)} className="flex-1 md:flex-none bg-sky-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-sky-600/20 hover:bg-sky-700 hover:-translate-y-0.5 active:scale-95 transition-all">
             <CalendarPlus size={18} strokeWidth={2.5} /> Book Session
           </button>
        </div>
      </header>

      {/* LIVE DOCTOR ROSTER */}
      <section className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden p-5">
        <h3 className="font-bold text-ink-900 flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-ink-100 text-ink-500 rounded-lg"><Stethoscope size={16} strokeWidth={2.5}/></div>
          Doctor Availability Roster
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {activeDoctors.map(doc => {
            const statusInfo = resolveStaffStatus(doc);
            const StatusIcon = statusInfo.icon;
            const pulseDot = statusInfo.isOnline ? <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusInfo.dotColor} opacity-75`}></span> : null;

            return (
              <div key={doc._id} className={`min-w-[200px] flex items-center gap-3 p-3 rounded-2xl border transition-colors ${statusInfo.bg} ${statusInfo.border}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold bg-white shadow-sm border ${statusInfo.border} ${statusInfo.color}`}>
                  {doc.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-ink-900 text-sm truncate max-w-[120px]">Dr. {doc.name.split(' ')[0]}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 mt-0.5 ${statusInfo.color}`}>
                    <StatusIcon size={10} strokeWidth={3}/> {statusInfo.status}
                    <span className="relative flex h-2 w-2 ml-1">{pulseDot}<span className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.dotColor}`}></span></span>
                  </p>
                </div>
              </div>
            );
          })}
          {activeDoctors.length === 0 && <div className="text-sm text-ink-400 font-medium py-2">No doctors are currently available.</div>}
        </div>
      </section>

      {/* DOCTOR ORDERS WIDGET */}
      <section className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-5 border-b border-amber-50 bg-amber-50/40 flex justify-between items-center">
          <h3 className="font-bold text-amber-900 flex items-center gap-2"><Stethoscope size={18} className="text-amber-600" /> Pending Recommendations</h3>
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm tracking-wide">{pendingRecommendations.length} NEW ORDERS</span>
        </div>
        <div className="p-5 md:p-6 bg-ink-50/30">
          {pendingRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-white border border-ink-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-ink-900 text-base">{rec.patientName}</p>
                      <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100"><Activity size={14}/></div>
                    </div>
                    <p className="text-[11px] text-sky-600 font-bold uppercase tracking-wide bg-sky-50 w-fit px-2 py-1 rounded-md border border-sky-100">{rec.treatmentName}</p>
                    {rec.notes && <div className="mt-3 bg-ink-50 p-3 rounded-xl border border-ink-100 text-[11px] text-ink-500 font-medium italic flex gap-2"><FileText size={12} className="shrink-0 mt-0.5 text-ink-400" />"{rec.notes}"</div>}
                  </div>
                  <div className="flex gap-3 mt-5 pt-4 border-t border-ink-100">
                    <button onClick={() => handleProcessOrder(rec, 'BOOK')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"><CalendarCheck size={16}/> Schedule</button>
                    <button onClick={() => handleProcessOrder(rec, 'DISCARD')} className="bg-ink-50 hover:bg-rose-50 hover:text-rose-600 text-ink-400 border border-ink-200 hover:border-rose-200 px-4 rounded-xl text-xs font-bold flex items-center justify-center transition-all active:scale-95"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-ink-200">
               <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={32} className="text-emerald-400"/></div>
               <p className="text-sm font-bold text-ink-500">All caught up!</p>
               <p className="text-xs text-ink-400 font-medium mt-1">No pending doctor orders right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* QUEUE & REVENUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* QUEUE MANAGER */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-5 border-b border-ink-100 flex justify-between items-center bg-ink-50/50 shrink-0">
               <h3 className="font-bold text-ink-900 flex items-center gap-2">
                 <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><ClipboardList size={18} strokeWidth={2.5}/></div>
                 Daily Queue
               </h3>
               
               {/* 🚀 UPGRADED: NATIVE CLICKABLE CALENDAR */}
               <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-ink-200 shadow-inner group">
                  <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-ink-100 rounded-lg text-ink-500 transition-colors"><ChevronLeft size={16}/></button>
                  
                  <div className="relative flex items-center justify-center cursor-pointer px-2 hover:bg-ink-50 rounded-lg py-1 transition-colors">
                    {/* Invisible Native Input overlaid on top */}
                    <input 
                      type="date" 
                      value={currentDate} 
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <span className="text-[11px] font-bold text-ink-600 text-center tracking-wide uppercase flex items-center gap-1.5">
                      {new Date(currentDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
                      <ChevronDown size={12} className="text-ink-400 group-hover:text-sky-500 transition-colors" />
                    </span>
                  </div>

                  <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-ink-100 rounded-lg text-ink-500 transition-colors"><ChevronRight size={16}/></button>
               </div>

            </div>
            <div className="divide-y divide-ink-100 overflow-y-auto flex-1">
              {appointments.length > 0 ? (
                appointments.map((appt: any) => {
                  
                  // 🚀 NEW: Calculate Live Wait Time
                  let waitTimeText = "";
                  if (appt.status === 'WAITING') {
                    // Use checkInTime if available, else fallback to start time
                    const checkIn = appt.checkInTime ? new Date(appt.checkInTime) : new Date(appt.startTime);
                    const diffMins = Math.floor((now.getTime() - checkIn.getTime()) / 60000);
                    if (diffMins > 0) waitTimeText = `Waiting: ${diffMins}m`;
                    else waitTimeText = "Just Arrived";
                  }

                  return (
                    <div key={appt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-ink-50/80 transition-colors group">
                      <div className="flex items-center gap-5">
                         <span className="text-sm font-bold text-ink-400 w-16 group-hover:text-sky-500 transition-colors">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         <div className="h-8 w-[2px] bg-ink-100 rounded-full hidden sm:block"></div>
                         <div>
                            <p className="font-bold text-ink-900 text-sm md:text-base">{appt.patientId?.name || "Patient"}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                               <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wide">{appt.treatmentName || "Consultation"}</p>
                               <span className={`text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                                 appt.status === 'WAITING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                 appt.status === 'IN_PROGRESS' ? 'bg-primary-100 text-primary-700 border-primary-200' :
                                 appt.status === 'COMPLETED' ? 'bg-ink-100 text-ink-500 border-ink-200' :
                                 'bg-emerald-50 text-emerald-600 border-emerald-200'
                               }`}>{appt.status}</span>

                               {/* Visit registration number — OPD by default, IPD/Day Care once admitted */}
                               {(appt.opdNumber || appt.ipdNumber || appt.dayCareNumber) && (
                                 <span className={`text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border font-mono ${
                                   appt.visitType === 'IPD' ? 'bg-secondary-50 text-secondary-700 border-secondary-200' :
                                   appt.visitType === 'DAY_CARE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                   'bg-ink-50 text-ink-500 border-ink-200'
                                 }`}>
                                   {appt.visitType === 'IPD' ? appt.ipdNumber : appt.visitType === 'DAY_CARE' ? appt.dayCareNumber : appt.opdNumber}
                                 </span>
                               )}
                               
                               {/* Show Wait Time Badge */}
                               {waitTimeText && (
                                 <span className="text-[8px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wide animate-pulse">
                                   <Hourglass size={8}/> {waitTimeText}
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {appt.status === 'SCHEDULED' && (
                          <button onClick={() => handleCheckIn(appt._id)} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-[10px] font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-all active:scale-95">
                            <UserCheck size={14} /> <span className="hidden xl:inline uppercase tracking-wide">Check-in</span>
                          </button>
                        )}
                        {appt.visitType === 'OPD' && (
                          <button onClick={() => handleAdmit(appt._id, 'IPD')} title="Admit to IPD" className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-[10px] font-bold text-secondary-700 bg-secondary-50 hover:bg-secondary-100 rounded-xl border border-secondary-200 transition-all active:scale-95">
                            <BedDouble size={14} /> <span className="hidden xl:inline uppercase tracking-wide">Admit</span>
                          </button>
                        )}
                        {appt.visitType !== 'OPD' && !appt.dischargeDate && (
                          <button onClick={() => { setDischargeAppt(appt); setDischargeCondition(''); setDischargeAdvice(''); }} title="Discharge Patient" className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-all active:scale-95">
                            <FileCheck size={14} /> <span className="hidden xl:inline uppercase tracking-wide">Discharge</span>
                          </button>
                        )}
                        <button onClick={() => { setTicketAppt(appt); setTicketEmailInput(''); }} title="OPD/IPD Ticket" className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-[10px] font-bold text-ink-500 bg-white hover:bg-ink-50 rounded-xl border border-ink-200 transition-all active:scale-95">
                          <Printer size={14} /> <span className="hidden xl:inline uppercase tracking-wide">Ticket</span>
                        </button>
                        <button onClick={() => handleSendPrakritiQuiz(appt.patientId?._id)} disabled={sendingQuizId === appt.patientId?._id} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all active:scale-95 disabled:opacity-50">
                          {sendingQuizId === appt.patientId?._id ? <div className="animate-spin h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full" /> : <Smartphone size={14} />}
                          <span className="hidden xl:inline uppercase tracking-wide">Quiz</span>
                        </button>
                        <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${appt.paymentStatus?.toUpperCase() === 'PAID' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {appt.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : 'DUE'}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-16 text-center text-ink-400 flex flex-col items-center">
                  <Timer size={40} className="opacity-20 mb-3"/>
                  <p className="text-sm font-bold uppercase tracking-wide">No sessions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Occupancy Matrix — restored: shows live booking status per room/time-slot */}
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-ink-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ink-50/50 shrink-0">
              <h3 className="font-bold text-ink-900 flex items-center gap-2">
                <div className="p-1.5 bg-secondary-50 text-secondary-600 rounded-lg"><LayoutGrid size={16} strokeWidth={2.5}/></div>
                Room Occupancy Matrix
              </h3>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-ink-200 shadow-inner w-full sm:w-auto justify-between sm:justify-center">
                <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-ink-50 rounded-lg text-ink-500 transition-colors"><ChevronLeft size={16}/></button>
                <span className="text-[11px] font-bold text-ink-600 w-28 text-center uppercase tracking-wide">
                  {new Date(currentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-ink-50 rounded-lg text-ink-500 transition-colors"><ChevronRight size={16}/></button>
              </div>
            </div>

            {rooms.length === 0 ? (
              <div className="p-16 text-center text-ink-400 flex flex-col items-center">
                <BedDouble size={32} className="opacity-20 mb-3"/>
                <p className="text-sm font-bold uppercase tracking-wide">No rooms configured</p>
                <p className="text-xs mt-1">Add rooms under Clinic Settings to see live occupancy here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar flex-1">
                <div className="min-w-[700px]">
                  <div className="flex bg-sky-50/50 border-b border-ink-200">
                    <div className="w-20 shrink-0 p-3.5 text-[10px] font-bold text-sky-900/50 uppercase tracking-wide text-center border-r border-ink-200">Time</div>
                    {rooms.map(room => (
                      <div key={room._id} className="flex-1 p-3.5 text-[11px] font-bold text-sky-900 uppercase tracking-wide text-center border-r border-ink-200 last:border-0 truncate">
                        {room.name}
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-ink-100 h-[450px] overflow-y-auto custom-scrollbar">
                    {TIME_SLOTS.map(time => (
                      <div key={time} className="flex hover:bg-ink-50/50 transition-colors group">
                        <div className="w-20 shrink-0 p-2 flex items-center justify-center border-r border-ink-100 bg-ink-50/30 group-hover:bg-white transition-colors">
                          <span className="text-[10px] font-bold text-ink-500">{time}</span>
                        </div>
                        {rooms.map(room => {
                          const booking = getAppointmentForSlot(room._id, room.name, time);
                          return (
                            <div key={`${room._id}-${time}`} className="flex-1 border-r border-ink-100 last:border-0 p-1.5 relative h-16">
                              {booking ? (
                                <div className={`h-full w-full rounded-xl p-2 border flex flex-col justify-center overflow-hidden shadow-sm transition-transform hover:scale-[1.02] cursor-default ${
                                  booking.status === 'COMPLETED'
                                    ? 'bg-emerald-50 border-emerald-200/60'
                                    : 'bg-sky-50 border-sky-200/60'
                                }`}>
                                  <p className="font-bold text-ink-900 text-[11px] leading-tight truncate">{booking.patientId?.name}</p>
                                  <p className={`text-[8px] font-bold uppercase mt-0.5 truncate ${booking.status === 'COMPLETED' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                    {booking.treatmentName}
                                  </p>
                                </div>
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-ink-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-1.5 h-1.5 rounded-full bg-ink-100"></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <NoticeBoard />
          
          {/* Revenue & Petty Cash Card */}
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-white/5 transition-transform duration-700 group-hover:scale-110">
              <IndianRupee size={140} />
            </div>
            <h3 className="font-bold text-ink-300 flex items-center justify-between mb-6 pb-4 border-b border-ink-700/50 relative z-10">
              <span className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><IndianRupee size={16} strokeWidth={3}/></div>
                Daily Register
              </span>
              <button onClick={handlePrintEOD} className="text-[9px] uppercase tracking-wide font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-sm">
                <Printer size={12}/> EOD Report
              </button>
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm"><span className="text-ink-400 font-medium">UPI</span><span className="font-bold text-white">₹{settlement.UPI.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-ink-400 font-medium">Cash</span><span className="font-bold text-white">₹{settlement.CASH.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              <div className="flex justify-between items-center text-sm pb-4 border-b border-ink-700/50"><span className="text-ink-400 font-medium">Card</span><span className="font-bold text-white">₹{settlement.CARD.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              
              {/* 🚀 NEW: Petty Cash Tracker */}
              <div className="flex justify-between items-center text-sm pb-4 border-b border-ink-700/50 group/petty cursor-pointer" onClick={() => {
                const amount = prompt("Update Petty Cash Float amount:", pettyCash.toString());
                if (amount && !isNaN(Number(amount))) setPettyCash(Number(amount));
              }}>
                <span className="text-amber-400/80 font-bold flex items-center gap-1.5 uppercase tracking-wide text-[10px]"><Banknote size={14}/> Petty Cash (Float) <Edit size={10} className="opacity-0 group-hover/petty:opacity-100 transition-opacity"/></span>
                <span className="font-bold text-amber-400">₹{pettyCash.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mb-1">Total Vault</span>
                <span className="text-3xl font-bold text-emerald-400 tracking-tighter">₹{settlement.TOTAL.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          {/* Pending Bills */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
             <div className="p-5 border-b border-rose-50 bg-rose-50/40 shrink-0">
                <h3 className="font-bold text-rose-900 flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><AlertCircle size={16} strokeWidth={2.5}/></div>
                  Pending Billing
                </h3>
             </div>
             <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
               {pendingBills.length > 0 ? pendingBills.map((bill: any) => (
                 <div key={bill._id} className="p-4 mb-3 bg-white rounded-2xl border border-rose-100 shadow-sm flex justify-between items-center hover:border-rose-300 transition-colors group">
                   <div>
                       <p className="text-xs font-bold text-ink-900 uppercase tracking-wide">{bill.patientId?.name}</p>
                       <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide mt-1 bg-rose-50 w-fit px-2 py-0.5 rounded border border-rose-100">
                         ₹{bill.finalBilledAmount || bill.amount || 0} Outstanding
                       </p>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handlePrintInvoice(bill.patientId?.name)} title="Print Invoice" className="bg-ink-50 text-ink-500 p-3 rounded-xl border border-ink-100 hover:bg-ink-100 shadow-sm transition-all active:scale-95"><Printer size={16} /></button>
                     <button onClick={() => setSelectedBillId(bill._id)} title="Process Payment" className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white shadow-sm transition-all active:scale-95 group-hover:shadow-md"><IndianRupee size={16} strokeWidth={3} /></button>
                   </div>
                 </div>
               )) : (
                 <div className="p-10 text-center flex flex-col items-center">
                   <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                     <CheckCircle size={24} className="text-emerald-400"/>
                   </div>
                   <p className="text-[10px] text-ink-400 font-bold uppercase tracking-wide">No pending bills</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Discharge modal — captures condition/advice for the NABH discharge summary */}
      {dischargeAppt && (
        <div className="fixed inset-0 z-[100] bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg relative">
            <button onClick={() => setDischargeAppt(null)} className="absolute top-4 right-4 text-ink-400 hover:text-ink-700">
              <X size={18} />
            </button>
            <h3 className="font-bold text-ink-900 mb-1">Discharge Patient</h3>
            <p className="text-sm text-ink-500 mb-5">{dischargeAppt.patientId?.name || "Patient"} — {dischargeAppt.visitType === 'IPD' ? dischargeAppt.ipdNumber : dischargeAppt.dayCareNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Condition at discharge</label>
                <input
                  value={dischargeCondition}
                  onChange={e => setDischargeCondition(e.target.value)}
                  placeholder="e.g. Stable, symptoms resolved"
                  className="w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Advice on discharge</label>
                <textarea
                  value={dischargeAdvice}
                  onChange={e => setDischargeAdvice(e.target.value)}
                  placeholder="Follow-up instructions, medication, precautions…"
                  rows={3}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 resize-none"
                />
              </div>
              <button
                onClick={handleConfirmDischarge}
                disabled={dischargeSaving}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {dischargeSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FileCheck size={16} />}
                Confirm Discharge
              </button>
              <p className="text-[11px] text-ink-400 text-center">Both fields are optional but recommended for a complete discharge summary.</p>
            </div>
          </div>
        </div>
      )}

      {/* OPD/IPD/Day Care Ticket modal — print, download, WhatsApp, or email */}
      {ticketAppt && (
        <div className="fixed inset-0 z-[100] bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-lg relative">
            <button onClick={() => setTicketAppt(null)} className="absolute top-4 right-4 text-ink-400 hover:text-ink-700">
              <X size={18} />
            </button>
            <h3 className="font-bold text-ink-900 mb-1">Visit Ticket</h3>
            <p className="text-sm text-ink-500 mb-5">{ticketAppt.patientId?.name || "Patient"}</p>

            <div className="space-y-2.5">
              <button
                onClick={() => handlePrintTicket(ticketAppt._id)}
                className="w-full py-3 bg-ink-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-ink-800 transition-all"
              >
                <Printer size={16} /> Print / Save as PDF
              </button>

              <button
                onClick={() => handleSendTicketWhatsapp(ticketAppt._id)}
                disabled={ticketSending === 'whatsapp'}
                className="w-full py-3 bg-secondary-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-secondary-700 transition-all disabled:opacity-60"
              >
                {ticketSending === 'whatsapp' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Smartphone size={16} />}
                Send via WhatsApp
              </button>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="patient@email.com"
                  value={ticketEmailInput}
                  onChange={e => setTicketEmailInput(e.target.value)}
                  className="flex-1 border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
                />
                <button
                  onClick={() => handleSendTicketEmail(ticketAppt._id)}
                  disabled={ticketSending === 'email'}
                  className="px-4 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-60 shrink-0"
                >
                  {ticketSending === 'email' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : "Email"}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-ink-400 mt-4 text-center">Includes a scannable verification code for pharmacy/front-desk checks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
// }