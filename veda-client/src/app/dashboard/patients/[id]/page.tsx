"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axiosConfig";
import { 
  User, Calendar, Clock, Activity, FileText, 
  ChevronLeft, Phone, MapPin, HeartPulse, Stethoscope, Printer, Pill
} from "lucide-react";
import Link from "next/link";
import PrakritiDisplay from "@/components/PrakritiDisplay";

export default function PatientEMRDashboard() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEMRData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 1. Fetch Patient Profile
        const patientRes = await axios.get(`/patients/${id}`, config);
        setPatient(patientRes.data);

        // 2. Fetch Appointment Timeline
        const historyRes = await axios.get(`/patients/${id}/history`, config);
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error fetching EMR data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEMRData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen p-8 flex justify-center mt-20 text-slate-400 font-bold animate-pulse tracking-widest uppercase">Loading Patient Records...</div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mb-4"><User size={32} className="text-rose-400" /></div>
        <h2 className="text-2xl font-black text-slate-800">Patient Record Not Found</h2>
        <Link href="/dashboard/patients" className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div className="flex items-center gap-5">
            <Link href="/dashboard/patients" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-500 hover:text-primary-600 active:scale-95 shadow-inner">
              <ChevronLeft size={24} strokeWidth={2.5}/>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient EMR Dashboard</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                System ID: <span className="text-primary-500">{patient._id?.slice(-8).toUpperCase()}</span>
              </p>
            </div>
          </div>
          
          <Link 
            href={`/dashboard/patients/${patient._id}/discharge`}
            className="flex items-center gap-2 bg-slate-900 hover:bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            <Printer size={18} /> Print Summary
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PATIENT INFO */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6 mb-6">
                <div className="h-24 w-24 bg-gradient-to-br from-primary-50 to-sky-50 border border-primary-100 rounded-[2rem] flex items-center justify-center text-primary-600 shadow-inner mb-4">
                  <span className="text-3xl font-black">{patient.name.charAt(0)}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
                <span className="mt-2 bg-primary-50 text-primary-700 font-mono px-3 py-1 rounded-lg text-xs font-bold border border-primary-100">
                  {patient.uhid || "VDA-PENDING"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <User size={18} className="text-slate-400" /> {patient.age} Yrs • {patient.gender}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={18} className="text-slate-400" /> {patient.mobile}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin size={18} className="text-slate-400" /> {patient.address || "Address not provided"}
                </div>
              </div>
            </div>

            {/* Medical Context */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={16} className="text-rose-400" /> Clinical Profile
              </h3>
              <div className="space-y-5">
                <div>
                  <PrakritiDisplay scores={patient?.prakritiScores} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Medical History</p>
                  <p className="text-sm font-bold text-slate-700 italic">
                    {patient.medicalHistory?.length > 0 ? patient.medicalHistory.join(", ") : "No prior history noted."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: APPOINTMENT TIMELINE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 tracking-tight">
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><Calendar size={20} strokeWidth={2.5}/></div>
                  Consultation History
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">
                  {history.length} Visits
                </span>
              </div>

              {history.length > 0 ? (
                <div className="space-y-6">
                  {history.map((appt) => (
                    <div key={appt._id} className={`p-6 rounded-2xl border transition-all ${
                      appt.status === 'COMPLETED' ? 'bg-slate-50/50 border-slate-200' : 'bg-white border-primary-100 shadow-md ring-4 ring-primary-50'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                              appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {appt.status}
                            </span>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                              <Calendar size={12}/> {new Date(appt.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 uppercase">{appt.treatmentName || "General Consultation"}</h4>
                          <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                            <Stethoscope size={14}/> Dr. {appt.doctorId?.name || "Attending Physician"}
                          </p>
                        </div>

                        {/* 🚀 UPDATED LINKS: Pointing to our new EMR route */}
                        <div className="shrink-0">
                          {appt.status !== 'COMPLETED' ? (
                            <Link 
                              href={`/dashboard/patients/${appt._id}/emr`} 
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 shadow-md transition-all active:scale-95"
                            >
                              <HeartPulse size={16} /> Start Consultation
                            </Link>
                          ) : (
                            <Link 
                              href={`/dashboard/patients/${appt._id}/emr`} 
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                            >
                              <FileText size={16} /> View Prescription
                            </Link>
                          )}
                        </div>

                      </div>
                      
                      {/* Show notes and PRESCRIPTION preview if completed */}
                      {appt.status === 'COMPLETED' && (
                        <div className="mt-5 pt-5 border-t border-slate-200">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             {appt.chiefComplaints && (
                               <div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Chief Complaints</p>
                                 <p className="text-sm font-semibold text-slate-700">{Array.isArray(appt.chiefComplaints) ? appt.chiefComplaints.join(", ") : appt.chiefComplaints}</p>
                               </div>
                             )}
                             {appt.diagnosis && (
                               <div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Diagnosis</p>
                                 <p className="text-sm font-bold text-sky-700">{appt.diagnosis}</p>
                               </div>
                             )}
                          </div>

                          {/* 🚀 NEW: Inline Prescribed Medicines Preview */}
                          {appt.medicinesUsed && appt.medicinesUsed.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Pill size={12} className="text-purple-500" /> Prescribed Medicines
                              </p>
                              <ul className="space-y-1.5">
                                {appt.medicinesUsed.map((med: any, i: number) => (
                                  <li key={i} className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>
                                    <span className="font-bold text-slate-900">{med.inventoryId?.name || "Medicine"}</span> 
                                    <span className="text-slate-500">
                                      — {med.dosage} {med.frequency && `(${med.frequency})`} {med.duration && `for ${med.duration}`}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Calendar size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-sm text-slate-500">No History Found</p>
                  <p className="text-xs font-medium mt-1 text-slate-400">This patient has no recorded appointments.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}