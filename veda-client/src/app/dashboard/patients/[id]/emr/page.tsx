"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/utils/axiosConfig";
import { 
  ChevronLeft, User, Calendar, Clock, Stethoscope, 
  FileText, Pill, Activity, CheckCircle2, Save, Trash2, HeartPulse, Search, Lock,
  ShoppingCart, FileDown, MessageCircle, Check, ConciergeBell, Microscope
} from "lucide-react";
import PrakritiDisplay from "@/components/PrakritiDisplay"; 
import toast from "react-hot-toast";

export default function ActiveConsultation() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dynamic Clinic & Doctor States
  const [clinicName, setClinicName] = useState("Clinic Name");
  const [doctorName, setDoctorName] = useState("Consultant");

  // ACTION STATES
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPushedToPharmacy, setIsPushedToPharmacy] = useState(false);
  const [isPushedToReception, setIsPushedToReception] = useState(false); 

  // DROPDOWN DATA STATES
  const [inventory, setInventory] = useState<any[]>([]);
  const [availableTreatments, setAvailableTreatments] = useState<any[]>([]);

  // CLINICAL FORM STATES 
  const [vitalsData, setVitalsData] = useState({ preBp: "", postBp: "", pulse: "", weight: "" });
  const [chiefComplaints, setChiefComplaints] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [investigations, setInvestigations] = useState(""); 
  const [notes, setNotes] = useState("");
  const [prakriti, setPrakriti] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  
  // MEDICATION STATE
  const [selectedMeds, setSelectedMeds] = useState([{ 
    inventoryId: "", quantity: 1, price: 0, 
    dosage: "", frequency: "", timing: "", duration: "" 
  }]);
  
  const [recommendedTherapies, setRecommendedTherapies] = useState([{ treatmentName: "", notes: "" }]);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const storedHospital = localStorage.getItem("hospitalName");
    if (storedHospital) setClinicName(storedHospital);

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAppointmentDetails();
    fetchInventory();
    fetchTreatments();
  }, [appointmentId]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`/inventory`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setInventory(res.data);
    } catch (err) { console.error("Failed to load inventory"); }
  };

  const fetchTreatments = async () => {
    try {
      const res = await axios.get(`/treatments`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setAvailableTreatments(res.data);
    } catch (err) { console.error("Failed to load treatments"); }
  };

  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/appointments/${appointmentId}`, { headers: { Authorization: `Bearer ${token}` }});
      const data = res.data;
      setAppointment(data);
      
      let dName = "Consultant";
      if (data.doctorId && data.doctorId.name) {
        dName = data.doctorId.name;
      } else if (data.patientId?.assignedDoctorId?.name) {
        dName = data.patientId.assignedDoctorId.name;
      } else {
        dName = localStorage.getItem("name") || "Consultant";
      }
      setDoctorName(dName);

      if (data.notes) setNotes(data.notes);
      if (data.diagnosis) setDiagnosis(data.diagnosis);
      if (data.investigations) setInvestigations(data.investigations); 
      if (data.vitals) setVitalsData({ ...vitalsData, ...data.vitals });
      if (data.nextFollowUpDate) setNextFollowUpDate(new Date(data.nextFollowUpDate).toISOString().split('T')[0]);
      if (data.chiefComplaints) setChiefComplaints(Array.isArray(data.chiefComplaints) ? data.chiefComplaints.join(", ") : data.chiefComplaints);
      
      if (data.medicinesUsed && data.medicinesUsed.length > 0) {
        setSelectedMeds(data.medicinesUsed.map((m: any) => ({
          inventoryId: m.inventoryId || "", quantity: m.quantity || 1, price: m.priceAtTime || 0,
          dosage: m.dosage || "", frequency: m.frequency || "", timing: m.timing || "", duration: m.duration || ""
        })));
      }
      
      if (data.recommendedTherapies && data.recommendedTherapies.length > 0) setRecommendedTherapies(data.recommendedTherapies);
      if (data.patientId?.prakriti) setPrakriti(data.patientId.prakriti);
      if (data.patientId?.medicalHistory) setMedicalHistory(Array.isArray(data.patientId.medicalHistory) ? data.patientId.medicalHistory.join(", ") : data.patientId.medicalHistory);

    } catch (err) {
      toast.error("Could not load case details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent, completeStatus = false) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const appointmentPayload = {
        chiefComplaints, diagnosis, notes, investigations, 
        vitals: { preBp: vitalsData.preBp || "N/A", postBp: vitalsData.postBp || "N/A", pulse: vitalsData.pulse || "N/A", weight: vitalsData.weight || "N/A" },
        medicinesUsed: selectedMeds.filter(m => m.inventoryId !== "").map(m => ({
            inventoryId: m.inventoryId, quantity: Number(m.quantity), priceAtTime: Number(m.price),
            dosage: m.dosage, frequency: m.frequency, timing: m.timing, duration: m.duration
        })),
        recommendedTherapies: recommendedTherapies.filter(t => t.treatmentName.trim() !== "").map(t => ({
            treatmentName: t.treatmentName, notes: t.notes || "", isProcessed: false 
        })),
        ...(nextFollowUpDate && { nextFollowUpDate }),
        ...(completeStatus && { status: "COMPLETED" })
      };

      const patientPayload = { prakriti, medicalHistory: medicalHistory.split(',').map(item => item.trim()).filter(Boolean) };

      await Promise.all([
        axios.patch(`/appointments/${appointmentId}`, appointmentPayload, config),
        axios.patch(`/patients/${appointment.patientId._id}`, patientPayload, config)
      ]);

      toast.success(completeStatus ? "Consultation Completed!" : "Progress Saved Successfully!");
      if (completeStatus) router.push("/dashboard"); 
      
    } catch (error) {
      toast.error("Failed to save consultation.");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print(); // Triggers the browser print dialog
    }, 500);
  };

  const handlePushToPharmacy = () => { setIsPushedToPharmacy(true); toast.success("Sent to Pharmacy POS!"); };
  const handlePushToReception = () => { setIsPushedToReception(true); toast.success("Notified Front Desk for Billing!"); };

  const addMedField = () => setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0, dosage: "", frequency: "", timing: "", duration: "" }]);
  const updateMedicine = (index: number, field: string, value: any) => { const newMeds = [...selectedMeds]; (newMeds[index] as any)[field] = value; setSelectedMeds(newMeds); };
  const addTherapyField = () => setRecommendedTherapies([...recommendedTherapies, { treatmentName: "", notes: "" }]);
  const removeTherapyRow = (idx: number) => setRecommendedTherapies(recommendedTherapies.filter((_, i) => i !== idx));

  if (loading) return <div className="p-8 text-center animate-pulse font-bold text-sky-500 mt-20">Loading Patient File...</div>;
  if (!appointment) return <div className="p-8 text-center text-rose-500 font-bold mt-20">Case Not Found</div>;

  const patient = appointment.patientId || {};
  const isCompleted = appointment.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-24">
      
      {/* 🚀 THE MAGIC FIX: This CSS hides everything except the prescription when generating the PDF */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-prescription, #printable-prescription * {
            visibility: visible;
          }
          #printable-prescription {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          /* Ensure watermark prints properly */
          #printable-prescription {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />

      {/* DATALISTS FOR AUTO-COMPLETE */}
      <datalist id="dosage-list">
        <option value="1 Tab" /><option value="2 Tabs" /><option value="1/2 Tab" />
        <option value="1 tsp" /><option value="2 tsp" /><option value="5 ml" /><option value="10 ml" />
        <option value="Apply Locally" /><option value="As Directed" />
      </datalist>
      <datalist id="freq-list">
        <option value="1-0-1 (BD)" /><option value="1-1-1 (TDS)" /><option value="0-0-1 (HS)" />
        <option value="1-0-0 (OD)" /><option value="SOS (As needed)" />
      </datalist>
      <datalist id="timing-list">
        <option value="After Meals (PC)" /><option value="Before Meals (AC)" />
        <option value="Empty Stomach" /><option value="With Warm Water" /><option value="With Milk" />
      </datalist>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {isCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm font-bold">
            <Lock size={20} className="text-emerald-600" /> This record is marked as COMPLETED and is locked.
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div className="flex items-center gap-5">
            <button onClick={() => router.back()} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 hover:text-sky-600 active:scale-95 shadow-inner transition-colors">
              <ChevronLeft size={24} strokeWidth={2.5}/>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
                <div className="p-1.5 bg-primary-50 text-primary-600 rounded-xl"><Stethoscope size={22} strokeWidth={2.5}/></div> 
                {isCompleted ? "Consultation Record" : "Active Consultation"}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5 ml-14">Case File: <span className="text-sky-500 font-black">#{appointment._id?.slice(-6).toUpperCase()}</span></p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border shadow-sm bg-primary-50 text-primary-700 border-primary-200">
            {appointment.status}
          </div>
        </div>

        {/* PATIENT INFO & PRAKRITI DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
            <div className="h-28 w-28 bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shrink-0 border-4 border-white z-10">
              {patient?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left z-10">
              <h1 className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">{patient?.name || "Unknown"}</h1>
              <p className="text-sm font-bold text-slate-500 mb-4 tracking-wide">{patient?.age || '--'} Years • {patient?.gender || '--'} • {patient?.mobile || '--'}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">UHID: {patient?.uhid || "PENDING"}</span>
                <span className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-sky-100">DR. {doctorName}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1"><PrakritiDisplay scores={patient?.prakritiScores} /></div>
        </div>

        {/* EMR WORKSPACE */}
        <form id="consultation-form" className="grid lg:grid-cols-12 gap-6 items-start pb-28 relative">
          
          {/* =========================================
              LEFT COLUMN: DOCTOR'S DATA ENTRY
          ========================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. VITALS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">
                <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg"><HeartPulse size={18} strokeWidth={2.5}/></div> Vitals
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Pre-BP</label><input disabled={isCompleted} type="text" placeholder="120/80" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 disabled:text-slate-500 font-bold shadow-inner" value={vitalsData.preBp} onChange={(e) => setVitalsData(prev => ({...prev, preBp: e.target.value}))} /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Post-BP</label><input disabled={isCompleted} type="text" placeholder="118/76" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 disabled:text-slate-500 font-bold shadow-inner" value={vitalsData.postBp} onChange={(e) => setVitalsData(prev => ({...prev, postBp: e.target.value}))} /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Pulse</label><input disabled={isCompleted} type="text" placeholder="72 bpm" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 disabled:text-slate-500 font-bold shadow-inner" value={vitalsData.pulse} onChange={(e) => setVitalsData(prev => ({...prev, pulse: e.target.value}))} /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Weight</label><input disabled={isCompleted} type="text" placeholder="70 kg" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 outline-none focus:ring-2 disabled:text-slate-500 font-bold shadow-inner" value={vitalsData.weight} onChange={(e) => setVitalsData(prev => ({...prev, weight: e.target.value}))} /></div>
              </div>
            </div>

            {/* 2. CLINICAL ASSESSMENT */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-2 pb-4 border-b border-slate-100">
                <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><Activity size={18} strokeWidth={2.5}/></div> Clinical Assessment
              </h3>
              <div className="pb-6 border-b border-slate-100 border-dashed">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Past Medical History</label>
                <input disabled={isCompleted} type="text" placeholder="E.g., Diabetes..." value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full border border-amber-200 p-4 rounded-2xl bg-amber-50/30 disabled:text-slate-500 outline-none focus:ring-2 font-semibold text-amber-900 shadow-inner" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Chief Complaints</label>
                <input disabled={isCompleted} type="text" placeholder="E.g., Severe lower back pain..." value={chiefComplaints} onChange={(e) => setChiefComplaints(e.target.value)} className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 font-semibold shadow-inner" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Primary Diagnosis</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
                  <input disabled={isCompleted} type="text" placeholder="Enter Official Diagnosis..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full border border-slate-200 pl-12 pr-4 py-4 rounded-2xl bg-primary-50/30 outline-none focus:ring-2 font-black text-primary-900 shadow-inner" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-1.5">
                  <Microscope size={14} className="text-purple-500"/> Lab Tests / Investigations Advised
                </label>
                <textarea disabled={isCompleted} rows={2} placeholder="E.g., CBC, HbA1c, X-Ray KUB..." value={investigations} onChange={(e) => setInvestigations(e.target.value)} className="w-full border border-purple-200 p-4 rounded-2xl bg-purple-50/30 outline-none focus:ring-2 font-semibold text-purple-900 shadow-inner resize-y" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Diet & Pathya (Advice)</label>
                <textarea disabled={isCompleted} rows={3} placeholder="Instructions here will print on the PDF..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 font-medium shadow-inner resize-y" />
              </div>
            </div>

            {/* 3. MEDICINES WITH AUTO-COMPLETE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                  <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg"><Pill size={18} strokeWidth={2.5}/></div> Prescribed Medicines
                </h3>
                {!isCompleted && <button type="button" onClick={addMedField} className="text-[10px] font-bold bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-widest">+ ADD ROW</button>}
              </div>
              
              <div className="space-y-4">
                {selectedMeds.map((med, index) => (
                  <div key={index} className="flex flex-col gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner group">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select disabled={isCompleted} className="flex-1 border border-slate-200 p-3.5 rounded-xl bg-white text-sm outline-none focus:ring-2 disabled:bg-slate-100 font-bold text-slate-700 shadow-sm" value={med.inventoryId} onChange={(e) => {
                          const item = inventory.find(i => i._id === e.target.value);
                          updateMedicine(index, 'inventoryId', e.target.value);
                          updateMedicine(index, 'price', item?.price || item?.sellingPrice || 0);
                      }}>
                        <option value="" disabled>Select Medicine...</option>
                        {inventory.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                      </select>
                      <input disabled={isCompleted} type="number" min="1" placeholder="Qty" className="w-full sm:w-24 border border-slate-200 p-3.5 rounded-xl text-center outline-none focus:ring-2 font-black text-slate-800 bg-white shadow-sm" value={med.quantity} onChange={(e) => updateMedicine(index, 'quantity', Number(e.target.value))} />
                      {!isCompleted && <button type="button" onClick={() => setSelectedMeds(selectedMeds.filter((_, i) => i !== index))} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 px-3 rounded-xl transition-all hidden sm:block"><Trash2 size={20}/></button>}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input disabled={isCompleted} list="dosage-list" placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"/>
                      <input disabled={isCompleted} list="freq-list" placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(index, 'frequency', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"/>
                      <input disabled={isCompleted} list="timing-list" placeholder="Timing" value={med.timing} onChange={(e) => updateMedicine(index, 'timing', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"/>
                      <div className="relative">
                        <input disabled={isCompleted} type="number" placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700 pr-10"/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">Days</span>
                      </div>
                    </div>
                    {!isCompleted && <button type="button" onClick={() => setSelectedMeds(selectedMeds.filter((_, i) => i !== index))} className="w-full py-2 text-rose-500 bg-rose-50 rounded-lg text-xs font-bold sm:hidden flex items-center justify-center gap-1"><Trash2 size={14}/> Remove</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. THERAPIES */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Stethoscope size={18} strokeWidth={2.5}/></div> Recommended Therapies
                </h3>
                {!isCompleted && <button type="button" onClick={addTherapyField} className="text-[10px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-widest">+ RECOMMEND</button>}
              </div>

              <div className="space-y-4">
                {recommendedTherapies.map((th, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-inner">
                    <select disabled={isCompleted} className="flex-1 border border-slate-200 p-3.5 rounded-xl text-sm bg-white outline-none focus:ring-2 font-bold text-slate-700 shadow-sm" value={th.treatmentName} onChange={(e) => {
                          const updated = [...recommendedTherapies]; updated[index].treatmentName = e.target.value; setRecommendedTherapies(updated);
                    }}>
                      <option value="" disabled>Select Therapy...</option>
                      {availableTreatments.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                    </select>

                    <input disabled={isCompleted} placeholder="Instructions (e.g. 3 sessions)" className="flex-1 border border-slate-200 p-3.5 rounded-xl text-sm bg-white outline-none focus:ring-2 font-medium text-slate-700 shadow-sm" value={th.notes} onChange={(e) => {
                          const updated = [...recommendedTherapies]; updated[index].notes = e.target.value; setRecommendedTherapies(updated);
                    }} />
                    {!isCompleted && <button type="button" onClick={() => removeTherapyRow(index)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 px-3 py-2 sm:py-0 rounded-xl transition-all flex justify-center"><Trash2 size={20}/></button>}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. FOLLOW UP */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><Calendar size={18} strokeWidth={2.5}/></div> Next Follow-up
                  </h3>
                </div>
                <input disabled={isCompleted} type="date" className="w-full sm:w-auto border border-slate-200 p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 font-black text-slate-700 shadow-inner" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: LIVE PREVIEW & ACTIONS (STICKY)
          ========================================= */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-6 space-y-6">
              
              {/* Action Buttons */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 gap-3">
                <button type="button" onClick={handleGeneratePDF} disabled={isGenerating} className="col-span-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-md">
                  {isGenerating ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FileDown size={16}/>} Download PDF
                </button>
                <button type="button" className="py-2.5 bg-green-50 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 flex justify-center items-center gap-2 border border-green-200"><MessageCircle size={14}/> WhatsApp</button>
                <button type="button" onClick={handlePushToPharmacy} disabled={isPushedToPharmacy} className={`py-2.5 rounded-xl font-bold text-xs flex justify-center items-center gap-2 border ${isPushedToPharmacy ? 'bg-slate-100 text-slate-400' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'}`}>
                  {isPushedToPharmacy ? <Check size={14}/> : <ShoppingCart size={14}/>} Pharmacy
                </button>
                <button type="button" onClick={handlePushToReception} disabled={isPushedToReception} className={`col-span-2 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 border ${isPushedToReception ? 'bg-slate-100 text-slate-400' : 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'}`}>
                  {isPushedToReception ? <Check size={16}/> : <ConciergeBell size={16}/>} Send to Reception Desk
                </button>
              </div>

              {/* 🚀 Real-time Prescription Preview */}
              {/* Added the ID "printable-prescription" so the CSS knows what to print */}
              <div id="printable-prescription" className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden aspect-[1/1.4] flex flex-col relative before:absolute before:inset-0 before:bg-[url('/watermark-logo.png')] before:bg-center before:bg-no-repeat before:opacity-5 before:pointer-events-none">
                
                {/* Fake Paper Header */}
                <div className="p-6 border-b-2 border-sky-600 bg-slate-50 flex justify-between items-center relative z-10">
                  <div>
                    <h2 className="text-xl font-black text-sky-800 uppercase tracking-tighter">{clinicName}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Dr. {doctorName}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-medium">
                    <p className="font-bold text-slate-700">{currentTime}</p>
                    <p className="mt-0.5">ID: {patient?.uhid || patient?._id?.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                {/* Paper Body */}
                <div className="p-6 flex-1 text-sm flex flex-col relative z-10 overflow-y-auto hide-scrollbar">
                  
                  {/* Patient Info Row */}
                  <div className="flex justify-between items-end border-b border-slate-200 pb-2 mb-4">
                    <p className="font-bold text-slate-800">{patient?.name}, {patient?.age}{patient?.gender?.charAt(0)}</p>
                    <p className="text-xs font-semibold text-slate-500">{prakriti || patient?.prakriti || "Assessed"} Prakriti</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                    <p className="font-semibold text-slate-800">{diagnosis || "..."}</p>
                  </div>

                  {investigations && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-purple-600">Investigations Advised</p>
                      <p className="text-xs text-slate-800 font-bold whitespace-pre-wrap">{investigations}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-2xl font-serif text-slate-800 mb-3 italic">Rx</h3>
                    <ul className="space-y-3">
                      {selectedMeds.filter(m => m.inventoryId !== "").length === 0 && <p className="text-slate-300 italic text-xs">Add medicines on the left...</p>}
                      {selectedMeds.filter(m => m.inventoryId !== "").map((med, i) => {
                        const itemName = inventory.find(inv => inv._id === med.inventoryId)?.name || "Medicine";
                        const durationText = med.duration ? `(${med.duration} Days)` : "";
                        const instructions = [med.dosage, med.frequency, med.timing, durationText].filter(Boolean).join(" — ");
                        
                        return (
                          <li key={i} className="flex gap-3">
                            <span className="font-bold text-slate-400">{i+1}.</span>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{itemName}</p>
                              {instructions && <p className="text-xs text-slate-600 font-medium mt-0.5">{instructions}</p>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Recommended Therapies in Preview */}
                  {recommendedTherapies.filter(th => th.treatmentName.trim() !== "").length > 0 && (
                    <div className="mb-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recommended Therapies</p>
                      <ul className="space-y-2">
                        {recommendedTherapies.filter(th => th.treatmentName.trim() !== "").map((th, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <Activity size={14} className="text-purple-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-800">{th.treatmentName}</p>
                              {th.notes && <p className="text-xs text-slate-600 font-medium">{th.notes}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {notes && (
                    <div className="mb-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pathya / Advice</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{notes}</p>
                    </div>
                  )}

                  {/* Realistic Doctor Signature Area */}
                  <div className="mt-auto pt-10 flex justify-between items-end relative">
                    <div className="w-16 h-16 rounded-full border-2 border-primary-900/10 flex items-center justify-center -rotate-12 opacity-50 ml-4">
                       <div className="w-12 h-12 rounded-full border border-primary-900/10 flex items-center justify-center text-center">
                         <span className="text-[5px] font-bold text-primary-900/40 uppercase tracking-widest leading-tight">VAIDYA CLINIC<br/>SEAL</span>
                       </div>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <div className="absolute bottom-5 text-4xl text-primary-800 font-['Caveat',_'Brush_Script_MT',_cursive] -rotate-6 opacity-90 select-none pointer-events-none whitespace-nowrap">
                        {doctorName}
                      </div>
                      <div className="w-40 border-t-2 border-slate-800 border-dashed mt-8 z-10"></div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mt-1.5">Dr. {doctorName}</p>
                      {/* Removed the Registration Number line as requested */}
                    </div>
                  </div>

                </div>
                
                {/* Paper Footer */}
                <div className="p-4 bg-slate-50 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest relative z-10 border-t border-slate-200">
                  Generated securely via VAIDYA ERP
                </div>
              </div>

            </div>
          </div>

          {/* =========================================
              BOTTOM ACTION BAR (Save / Complete)
          ========================================= */}
          {!isCompleted && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 px-6 md:px-8 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] col-span-12">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-end md:ml-64">
                 <button type="button" onClick={(e) => handleSaveConsultation(e, false)} disabled={saving} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                   <Save size={18}/> Save Draft
                 </button>
                 
                 <button type="button" onClick={(e) => handleSaveConsultation(e, true)} disabled={saving} className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black shadow-xl shadow-sky-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                   <CheckCircle2 size={20} strokeWidth={3}/> Complete & Return
                 </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}