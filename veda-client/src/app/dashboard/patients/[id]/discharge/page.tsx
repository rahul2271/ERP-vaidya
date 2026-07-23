"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig"; 
import { useParams } from "next/navigation";
import { 
  Printer, ArrowLeft, FileText, Pill, Activity, 
  User, Calendar, Stethoscope, HeartPulse, Building2 
} from "lucide-react";

export default function DischargeSummary() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/patients/${id}/discharge-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (id) fetchSummary();
  }, [id]);

  if (loading) return <div className="p-10 text-slate-500 flex justify-center mt-10 font-bold animate-pulse tracking-widest uppercase">Generating Comprehensive Report...</div>;
  if (!data) return <div className="p-10 text-red-500 text-center mt-10 font-bold text-2xl">Report data unavailable.</div>;

  const patient = data.patientProfile || {};
  const treatments = data.clinicalSummary?.treatments || [];
  const hospital = data.hospitalDetails || {};
  const financial = data.financialSummary || {};

  // 🚀 EXTRACT CLINICAL NOTES
  let finalChiefComplaints = patient.chiefComplaints || "";
  let finalDiagnosis = patient.diagnosis || "";

  // 🚀 THE FIX: EXTRACT ONLY THE DOCTOR
  let rawDoctorName = patient.assignedDoctor || null;

  for (let i = treatments.length - 1; i >= 0; i--) {
    const t = treatments[i];
    
    const cc = t?.vitals?.chiefComplaints || t?.chiefComplaints;
    const diag = t?.vitals?.diagnosis || t?.diagnosis;

    if (cc && cc !== "N/A" && cc.trim() !== "") finalChiefComplaints = cc;
    if (diag && diag !== "N/A" && diag.trim() !== "") finalDiagnosis = diag;

    if (t.doctor) {
      rawDoctorName = t.doctor;
    }

    if (finalChiefComplaints && finalDiagnosis && rawDoctorName) break;
  }

  if (!finalChiefComplaints || finalChiefComplaints.trim() === "" || finalChiefComplaints === "N/A") {
    finalChiefComplaints = "No specific chief complaints recorded during consultation.";
  }
  if (!finalDiagnosis || finalDiagnosis.trim() === "" || finalDiagnosis === "N/A") {
    finalDiagnosis = "Pending Clinical Diagnosis";
  }

  const fallbackDoc = "Attending Physician";
  const actualDocName = rawDoctorName || fallbackDoc;
  
  const displayDoctorName = actualDocName.toLowerCase().startsWith("dr") ? actualDocName : `Dr. ${actualDocName}`;
  const cursiveSignature = actualDocName.toLowerCase().startsWith("dr.") ? actualDocName.slice(3).trim() : actualDocName;

  const admissionDate = treatments.length > 0 ? treatments[0].date : (patient.createdAt || new Date());

  // ✅ Real NABH registration data — visit type, OPD/IPD/Day Care number, and
  // the actual admission/discharge dates (previously this section showed the
  // first treatment date and "today" as stand-ins, which wasn't accurate).
  const reg = data.registrationDetails || {};
  const conversionHistory = data.conversionHistory || [];
  const regTypeColor = reg.visitType === 'IPD' ? 'text-secondary-600 bg-secondary-50' : reg.visitType === 'DAY_CARE' ? 'text-amber-600 bg-amber-50' : 'text-ink-600 bg-ink-100';

  // 🚀 CHECK FOR PRAKRITI SCORES
  const scores = patient.prakritiScores;
  const hasPrakritiScores = scores && (scores.vata > 0 || scores.pitta > 0 || scores.kapha > 0);

  return (
    <>
      {/* 🚀 PRINT MAGIC CSS: Hides Sidebar & Enforces Colors */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=La+Belle+Aurore&display=swap');
        
        @media print {
          body * {
            visibility: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-summary, #printable-summary * {
            visibility: visible;
          }
          #printable-summary {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            margin: 0;
            padding: 0 20px;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print, .no-print * {
            display: none !important;
          }
          @page { size: A4 portrait; margin: 15mm; }
        }
      `}} />

      <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-6 px-4 md:px-0">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm no-print">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition font-bold px-4 py-2 rounded-lg hover:bg-primary-50">
            <ArrowLeft size={20}/> Back to Profile
          </button>
          <button onClick={() => window.print()} className="bg-primary-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition shadow-lg font-black">
            <Printer size={20}/> Print Official Summary
          </button>
        </div>

        {/* 📄 THE PRINTABLE DOCUMENT */}
        <div id="printable-summary" className="bg-white p-8 md:p-12 shadow-2xl border border-slate-100 rounded-[2rem] text-slate-900 relative">
          
          {/* DYNAMIC HOSPITAL HEADER & LOGO */}
          <div className="flex justify-between items-start border-b-4 border-primary-900 pb-8 mb-10">
            <div className="flex items-start gap-5">
              
              {hospital.logo ? (
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <img src={hospital.logo} alt="Clinic Logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </div>
              ) : (
                <div className="bg-primary-900 text-white p-4 rounded-2xl shadow-sm shrink-0">
                  <Building2 size={40} />
                </div>
              )}

              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-black text-primary-900 tracking-tighter uppercase">
                  {hospital.name || "Veda Medical Center"}
                </h1>
                {hospital.tagline && (
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">
                    {hospital.tagline}
                  </p>
                )}
                <p className="text-slate-500 font-bold mt-2 text-sm">{hospital.location} | Contact: {hospital.contact}</p>
                
                {(hospital.gstNumber || hospital.registrationNumber) && (
                  <p className="text-xs font-bold text-slate-400 mt-1 flex gap-3">
                    {hospital.gstNumber && <span>GSTIN: {hospital.gstNumber}</span>}
                    {hospital.registrationNumber && <span>REG NO: {hospital.registrationNumber}</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right shrink-0 mt-2">
               <div className="bg-primary-900 text-white inline-block px-6 py-2.5 rounded-xl text-xs font-black tracking-[0.2em] uppercase shadow-md print:bg-primary-900 print:text-white">
                Discharge Summary
              </div>
            </div>
          </div>

          {/* 1. Patient Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 print:bg-slate-50">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-2">
                <User size={16}/> Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-y-3">
                <span className="text-slate-400 text-xs font-black uppercase">Name:</span>
                <span className="text-sm font-black text-slate-900 uppercase">{patient.name || "N/A"}</span>
                <span className="text-slate-400 text-xs font-black uppercase">Age/Sex:</span>
                <span className="text-sm font-bold">{patient.age || "--"} Yrs / {patient.gender || "--"}</span>
                <span className="text-slate-400 text-xs font-black uppercase">Address:</span>
                <span className="text-sm font-bold">{patient.address || "Not Provided"}</span>
              </div>
            </div>
            <div className="space-y-4 md:border-l md:pl-8 border-slate-200">
              <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16}/> Identification Details
              </h3>
              <div className="grid grid-cols-2 gap-y-3">
                <span className="text-slate-400 text-xs font-black uppercase">UHID:</span>
                <span className="text-sm font-mono font-black text-primary-700 bg-primary-50 px-2 py-0.5 rounded w-max">{patient.uhid || "Pending"}</span>
                <span className="text-slate-400 text-xs font-black uppercase">Visit Type:</span>
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded w-max ${regTypeColor}`}>{(reg.visitType || "OPD").replace('_', ' ')}</span>
                <span className="text-slate-400 text-xs font-black uppercase">Reg. No.:</span>
                <span className="text-sm font-mono font-bold text-slate-900">{reg.visitNumber || "N/A"}</span>
                {reg.opdNumber && reg.visitType !== 'OPD' && (
                  <>
                    <span className="text-slate-400 text-xs font-black uppercase">Original OPD No.:</span>
                    <span className="text-sm font-mono font-bold text-slate-500">{reg.opdNumber}</span>
                  </>
                )}
                <span className="text-slate-400 text-xs font-black uppercase">Admission:</span>
                <span className="text-sm font-bold">{reg.admissionDate ? new Date(reg.admissionDate).toLocaleDateString('en-IN') : "N/A (OPD)"}</span>
                <span className="text-slate-400 text-xs font-black uppercase">Discharge:</span>
                <span className="text-sm font-bold">{reg.dischargeDate ? new Date(reg.dischargeDate).toLocaleDateString('en-IN') : "—"}</span>
                {reg.nextFollowUpDate && (
                  <>
                    <span className="text-slate-400 text-xs font-black uppercase">Follow-up:</span>
                    <span className="text-sm font-bold text-amber-600">{reg.nextFollowUpDate}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {(reg.dischargeCondition || reg.dischargeAdvice) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {reg.dischargeCondition && (
                <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <h3 className="text-[11px] font-black text-secondary-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <HeartPulse size={16}/> Condition at Discharge
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-bold">{reg.dischargeCondition}</p>
                </div>
              )}
              {reg.dischargeAdvice && (
                <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <FileText size={16}/> Advice on Discharge
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">{reg.dischargeAdvice}</p>
                </div>
              )}
            </div>
          )}

          {conversionHistory.length > 0 && (
            <div className="mb-12">
              <h2 className="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2 border-b pb-2">
                <Activity size={16} className="text-primary-600"/> Episode History
              </h2>
              <div className="space-y-2">
                {conversionHistory.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="text-slate-400 font-bold shrink-0 w-40">
                      {h.timestamp ? new Date(h.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ""}
                    </span>
                    <span className="text-slate-700 font-medium">{h.details}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CLINICAL FINDINGS & DIAGNOSIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <Activity size={16}/> Chief Complaints
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed font-bold">
                  {finalChiefComplaints}
                </p>
              </div>
              <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <FileText size={16}/> Medical History
                </h3>
                <p className="text-sm text-slate-800 font-medium italic">
                  {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 
                    ? patient.medicalHistory.join(", ") 
                    : "No specific medical history noted."}
                </p>
              </div>
            </div>

            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between print:bg-slate-900 print:text-white">
              <div>
                <h3 className="text-[11px] font-black text-primary-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Stethoscope size={16}/> Final Clinical Diagnosis
                </h3>
                <p className="text-xl font-black leading-relaxed">
                  {finalDiagnosis}
                </p>
              </div>
              
              {/* 🚀 DYNAMIC PRAKRITI WIDGET FOR PRINT */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Ayurvedic Profile (Prakriti)</h3>
                
                {hasPrakritiScores ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-primary-300 font-bold">Vata</span><span className="text-slate-300">{scores.vata}%</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full print:bg-slate-800"><div className="bg-primary-400 h-1.5 rounded-full print:bg-primary-400" style={{ width: `${scores.vata}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-orange-300 font-bold">Pitta</span><span className="text-slate-300">{scores.pitta}%</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full print:bg-slate-800"><div className="bg-orange-400 h-1.5 rounded-full print:bg-orange-400" style={{ width: `${scores.pitta}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-emerald-300 font-bold">Kapha</span><span className="text-slate-300">{scores.kapha}%</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full print:bg-slate-800"><div className="bg-emerald-400 h-1.5 rounded-full print:bg-emerald-400" style={{ width: `${scores.kapha}%` }}></div></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-black text-amber-400 uppercase">{patient.prakriti || "NOT ASSESSED"}</p>
                )}
              </div>

            </div>
          </div>

          {/* 3. Detailed Treatment Record */}
          <div className="mb-12">
            <h2 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-xs flex items-center gap-2 border-b pb-2">
              <HeartPulse size={18} className="text-primary-600"/> Course of Treatment
            </h2>
            <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-slate-50">
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="p-4">Date</th>
                    <th className="p-4">Procedure / Consultation</th>
                    <th className="p-4">Clinical Vitals</th>
                    <th className="p-4">Medicines Prescribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {treatments.map((t: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-4 text-slate-500 text-xs font-bold">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="p-4 font-black text-slate-900 uppercase text-xs">{t.treatment}</td>
                      <td className="p-4">
                        {t.vitals && t.vitals.preBp && t.vitals.preBp !== '---' ? (
                          <div className="text-[10px] text-slate-600 space-y-1 font-bold">
                            <p>BP: <span className="text-primary-600">{t.vitals.preBp} / {t.vitals.postBp}</span></p>
                            <p>Pulse: <span className="text-rose-500">{t.vitals.pulse} bpm</span></p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold italic">Not Recorded</span>
                        )}
                      </td>
                      <td className="p-4 space-y-1">
                        {t.medicinesUsed && t.medicinesUsed.length > 0 ? t.medicinesUsed.map((m: any, idx: number) => (
                          <div key={idx} className="text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
                            <Pill size={10}/> {m.name} (x{m.quantity})
                          </div>
                        )) : (
                          <span className="text-[10px] text-slate-300 font-bold italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {treatments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-50/50 print:bg-slate-50">No treatments recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Financial Summary */}
          <div className="bg-slate-900 p-8 rounded-3xl grid grid-cols-3 text-center shadow-xl text-white print:bg-slate-900 print:text-white">
            <div className="border-r border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sessions</p>
              <p className="text-4xl font-black">{data.clinicalSummary?.totalTreatments || 0}</p>
            </div>
            <div className="border-r border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
              <p className={`text-xl font-black mt-2 uppercase ${financial.paymentStatus?.toUpperCase() === 'PAID' ? 'text-emerald-400 print:text-emerald-400' : 'text-amber-400 print:text-amber-400'}`}>
                {financial.paymentStatus?.toUpperCase() === 'PAID' ? 'SETTLED' : 'PENDING'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Bill</p>
              <p className="text-3xl font-black">
                ₹{financial.finalAmount?.toLocaleString('en-IN') || "0"}
              </p>
            </div>
          </div>

          {/* 🚀 REALISTIC BLUE PEN SIGNATURE SECTION */}
          <div className="mt-24 flex justify-between px-10">
            <div className="text-center">
              <div className="w-48 border-b border-slate-300 mb-2 h-10"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital Administrator</p>
            </div>
            <div className="text-center flex flex-col items-center">
               
               {/* The Cursive Signature Line */}
               <div className="w-56 border-b border-slate-300 mb-3 relative h-10 flex items-end justify-center pb-1">
                 {actualDocName !== fallbackDoc && (
                   <span 
                     style={{ 
                       fontFamily: "'La Belle Aurore', cursive", 
                       fontSize: '2.5rem', 
                       color: '#0020A0', /* Ink Blue Color */
                       transform: 'rotate(-4deg)', /* Natural handwritten tilt */
                     }} 
                     className="absolute -bottom-1 whitespace-nowrap"
                   >
                     {cursiveSignature}
                   </span>
                 )}
               </div>
               
               <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{displayDoctorName}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Attending Medical Officer</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}