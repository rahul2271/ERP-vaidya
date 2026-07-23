"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { X, Calendar as CalendarIcon, Clock, User, Stethoscope, DoorOpen, Search, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast"; 

// 10 AM to 7 PM Slots (30-min intervals)
const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", 
  "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", 
  "18:00", "18:30", "19:00"
];

export default function BookAppointmentModal({ isOpen, onClose, onSuccess }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    treatmentName: "",
    date: "",
    time: "", // Forces user to pick from the grid
    roomId: "", 
    type: "Consultation"
  });

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      setFormData(prev => ({ 
        ...prev, 
        date: new Date().toISOString().split('T')[0], 
        time: "",
        roomId: ""
      }));
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [ptsRes, docsRes, trtRes, roomsRes, apptsRes] = await Promise.all([
        axios.get("/patients", config).catch(() => ({ data: [] })),
        axios.get("/users", config).catch((err) => {
          console.error("Failed to fetch users:", err);
          return { data: [] };
        }),
        axios.get("/treatments", config).catch(() => ({ data: [] })),
        axios.get("/rooms", config).catch(() => ({ data: [] })),
        axios.get("/appointments", config).catch(() => ({ data: [] })) 
      ]);
      
      setPatients(ptsRes.data);
      
      const allUsers = docsRes.data || [];
      const filteredDocs = allUsers.filter((u: any) => u.role === 'DOCTOR' || u.role === 'doctor');
      setDoctors(filteredDocs);
      
      setTreatments(trtRes.data);
      setRooms(roomsRes.data);
      setExistingAppointments(apptsRes.data);
    } catch (err) {
      console.error("Failed to fetch booking data", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      return toast.error("Please select an available time slot from the grid.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const startTime = new Date(`${formData.date}T${formData.time}:00`);
      
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId, 
        treatmentName: formData.treatmentName,
        startTime: startTime.toISOString(),
        roomId: formData.roomId || undefined, 
        status: "SCHEDULED",
        type: formData.type,
        mode: "IN_PERSON" 
      };

      // 1. Save to Database
      await axios.post("/appointments", payload, config);
      
      // 2. The backend is handling the WhatsApp trigger automatically, so we just show success!
      toast.success("Slot Secured & WhatsApp Confirmation Sent! 📱");
      
      onSuccess(); // Refresh the Reception Dashboard
      onClose();   // Close the modal
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book slot. It may have just been taken.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ==========================================
  // CONFLICT RESOLUTION: DOCTOR SLOTS
  // Find all times the selected doctor is already booked on the selected date
  // ==========================================
  const bookedDoctorSlots = existingAppointments
    .filter(appt => {
      const apptDate = new Date(appt.startTime).toISOString().split('T')[0];
      const docId = appt.doctorId?._id || appt.doctorId;
      return apptDate === formData.date && docId === formData.doctorId && appt.status !== 'CANCELLED';
    })
    .map(appt => {
      return new Date(appt.startTime).toLocaleTimeString('en-GB', { 
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' 
      });
    });

  // ==========================================
  // CONFLICT RESOLUTION: ROOMS
  // Find all rooms booked on the selected date at the selected time
  // ==========================================
  const bookedRoomIds = existingAppointments
    .filter(appt => {
      const apptDate = new Date(appt.startTime).toISOString().split('T')[0];
      const apptTime = new Date(appt.startTime).toLocaleTimeString('en-GB', { 
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' 
      });
      return apptDate === formData.date && apptTime === formData.time && appt.status !== 'CANCELLED';
    })
    .map(appt => appt.roomId?._id || appt.roomId); 

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
          <X size={20}/>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><CalendarIcon size={24} strokeWidth={2.5} /></div>
            Book Appointment
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 ml-1">Schedule a no-conflict consultation.</p>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form id="booking-form" onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                 <User size={12}/> Select Patient *
              </label>
              <select required className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner cursor-pointer"
                value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="">-- Choose Existing Patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.mobile})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                   <Stethoscope size={12}/> Assign Doctor *
                </label>
                <select required className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner cursor-pointer"
                  value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value, time: ""})}>
                  <option value="">-- Select Doctor --</option>
                  {doctors
                    .filter(doctor => doctor.attendanceStatus !== 'OFFLINE') 
                    .map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                  <Search size={12}/> Search Treatment *
                </label>
                <input 
                  list="treatment-options"
                  required 
                  placeholder="Type to search treatment..."
                  className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                  value={formData.treatmentName} 
                  onChange={e => setFormData({...formData, treatmentName: e.target.value})}
                />
                <datalist id="treatment-options">
                  <option value="General Consultation" />
                  <option value="Follow Up" />
                  {treatments.map(t => (
                    <option key={t._id} value={t.name}>{t.name} (₹{t.cost})</option>
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                   <CalendarIcon size={12}/> Date *
                </label>
                <input type="date" required className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                  value={formData.date} onChange={e => {
                    setFormData({...formData, date: e.target.value, roomId: "", time: ""}); 
                  }} />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                   <DoorOpen size={12}/> Assign Room (Optional)
                </label>
                <select className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner cursor-pointer disabled:opacity-50"
                  value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} disabled={!formData.time}>
                  <option value="">No Room Needed</option>
                  {rooms.map(room => {
                    const isBooked = bookedRoomIds.includes(room._id);
                    return (
                      <option key={room._id} value={room._id} disabled={isBooked} className={isBooked ? "text-rose-400 font-medium bg-rose-50" : "text-slate-900"}>
                        {room.name} {isBooked ? "(Unavailable at this time)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* 🚀 SMART SLOT PICKER GRID */}
            {formData.doctorId && formData.date && (
              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-3">
                   <Clock size={12}/> Select Slot (10 AM - 7 PM) *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {TIME_SLOTS.map(slot => {
                    const isBooked = bookedDoctorSlots.includes(slot);
                    const isSelected = formData.time === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setFormData({...formData, time: slot, roomId: ""})}
                        className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border ${
                          isBooked 
                            ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed line-through decoration-rose-300/50' 
                            : isSelected
                              ? 'bg-sky-600 border-sky-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] scale-105'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-4">
           <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
             Cancel
           </button>
           <button 
             type="submit" 
             form="booking-form"
             disabled={loading || !formData.time} 
             className="flex-1 py-4 rounded-2xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading ? "Processing..." : <><CheckCircle2 size={18}/> Confirm & Notify</>}
           </button>
        </div>

      </div>
    </div>
  );
}