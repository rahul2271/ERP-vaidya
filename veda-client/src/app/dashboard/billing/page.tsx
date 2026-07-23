"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Search, FileText, Mail, MessageCircle, CheckCircle2, AlertCircle, Loader2, Receipt, Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function BillingPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🚀 Track loading states for individual buttons
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [sendingWaId, setSendingWaId] = useState<string | null>(null);

  // 🚀 Dynamic Clinic Name
  const [clinicName, setClinicName] = useState("Our Clinic");

  useEffect(() => {
    fetchBills();
    // Grab the dynamic name from settings
    const storedName = localStorage.getItem("hospitalName");
    if (storedName) setClinicName(storedName);
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/appointments");
      const completedSessions = res.data.filter((app: any) => app.status === 'COMPLETED');
      setBills(completedSessions.reverse()); 
    } catch (err) {
      console.error("Failed to load bills", err);
      toast.error("Failed to load billing records.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================================
  // 🚀 1. DYNAMIC & PROFESSIONAL WHATSAPP API HANDLER
  // ==================================================================
  const handleWhatsAppAPI = async (bill: any) => {
    if (!bill.patientId?.mobile) return toast.error("No phone number recorded for this patient.");

    // Construct the Professional Message
    const amount = bill.finalBilledAmount || bill.amount || 0;
    const status = bill.paymentStatus || 'PENDING';
    const date = new Date(bill.startTime).toLocaleDateString('en-GB');
    const treatment = bill.treatmentName || 'General Consultation';

    const professionalMessage = `Dear ${bill.patientId.name},

We hope you are doing well! 🌿

Here are the details of your recent visit at *${clinicName}*:

📅 *Date:* ${date}
🩺 *Treatment:* ${treatment}
💳 *Total Billed:* ₹${amount}
📊 *Payment Status:* ${status.toUpperCase()}

📄 Please find your official *Invoice and Medical Discharge Summary* attached to this message as a PDF document.

If you have any questions, need further assistance, or would like to schedule your next follow-up, please feel free to reply directly to this chat.

Wishing you a swift recovery and vibrant health!

Warm Regards,
*The Care Team at ${clinicName}*`;

    setSendingWaId(bill._id);
    try {
      const token = localStorage.getItem("token");
      
      // Send to backend with the custom message attached
      await axios.post(`/patients/${bill.patientId._id}/send-whatsapp-invoice`, 
        { 
          appointmentId: bill._id,
          customCaption: professionalMessage // 🚀 We pass the message to the backend
        }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success("Professional Invoice sent directly via WhatsApp!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send WhatsApp message. Check Clinic API Settings.");
    } finally {
      setSendingWaId(null);
    }
  };

  // ==================================================================
  // 🚀 2. DYNAMIC EMAIL HANDLER
  // ==================================================================
  const handleEmail = async (patientId: string, email: string, apptId: string) => {
    const targetEmail = email || prompt("No email saved. Please enter the patient's email address:");
    if (!targetEmail) return;

    setSendingEmailId(apptId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/patients/${patientId}/send-bill-email`, 
        { email: targetEmail, appointmentId: apptId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success("Bill sent successfully via Email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email. Check SMTP settings.");
    } finally {
      setSendingEmailId(null);
    }
  };

  const filteredBills = bills.filter(b => 
    b.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-800 to-primary-500 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl"><Receipt size={24} strokeWidth={2.5}/></div>
              Billing & Invoices
            </h1>
            {/* 🚀 Shows dynamic clinic name */}
            <p className="text-sm font-medium text-slate-500 mt-2 ml-12">Manage and share financial records for {clinicName}.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient name..." 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* BILL LIST TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="p-5 pl-8">Date</th>
                  <th className="p-5">Patient Details</th>
                  <th className="p-5">Procedure / Treatment</th>
                  <th className="p-5">Total Billed</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  // Premium Skeleton Loader Rows
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-5 pl-8"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="p-5"><div className="h-4 bg-slate-200 rounded w-32 mb-2"></div><div className="h-3 bg-slate-200 rounded w-20"></div></td>
                      <td className="p-5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                      <td className="p-5"><div className="h-5 bg-slate-200 rounded w-16"></div></td>
                      <td className="p-5"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="p-5 pr-8 text-right"><div className="h-8 bg-slate-200 rounded-xl w-32 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          <Receipt size={32} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No bills found</p>
                        <p className="text-xs font-medium mt-1">Adjust your search or check back later.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      <td className="p-5 pl-8 text-slate-500 font-bold text-xs flex items-center gap-1.5 h-full">
                        <Calendar size={14} className="text-slate-400 group-hover:text-emerald-500 transition-colors"/>
                        {new Date(bill.startTime).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
                      </td>
                      
                      <td className="p-5">
                        <p className="font-extrabold text-slate-800 text-sm">{bill.patientId?.name || "Unknown Patient"}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-wider">{bill.patientId?.mobile || "No Contact"}</p>
                      </td>
                      
                      <td className="p-5">
                        <span className="bg-sky-50 text-sky-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-sky-100/50">
                          {bill.treatmentName || "Consultation"}
                        </span>
                      </td>
                      
                      <td className="p-5">
                        <p className="font-black text-slate-900 text-lg tracking-tight">
                          ₹{bill.finalBilledAmount || bill.amount || 0}
                        </p>
                      </td>
                      
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          bill.paymentStatus?.toUpperCase() === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {bill.paymentStatus?.toUpperCase() === 'PAID' ? <CheckCircle2 size={12} strokeWidth={3}/> : <AlertCircle size={12} strokeWidth={3}/>} 
                          {bill.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : 'DUE'}
                        </span>
                      </td>
                      
                      <td className="p-5 pr-8 text-right flex justify-end gap-2">
                        {/* 🚀 NOW PASSES THE FULL BILL OBJECT TO BUILD THE DYNAMIC MESSAGE */}
                        <button 
                          onClick={() => handleWhatsAppAPI(bill)}
                          disabled={sendingWaId === bill._id}
                          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm active:scale-95 disabled:opacity-50"
                          title="Send Professional PDF via WhatsApp API"
                        >
                          {sendingWaId === bill._id ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} strokeWidth={2.5}/>}
                        </button>

                        <button 
                          onClick={() => handleEmail(bill.patientId?._id, bill.patientId?.email, bill._id)}
                          disabled={sendingEmailId === bill._id}
                          className="p-2.5 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all border border-primary-100 shadow-sm disabled:opacity-50 active:scale-95"
                          title="Send Email with PDF"
                        >
                          {sendingEmailId === bill._id ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} strokeWidth={2.5}/>}
                        </button>

                        <button 
                          onClick={() => window.open(`/dashboard/patients/${bill.patientId?._id}/invoice?apptId=${bill._id}`, '_blank')}
                          className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-sm shadow-slate-900/20 active:scale-95 group/btn"
                        >
                          <FileText size={14} className="group-hover/btn:scale-110 transition-transform"/> Open Invoice
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}