// "use client";

// import { useEffect, useState } from "react";
// import axios from "@/utils/axiosConfig";
// import { useRouter } from "next/navigation";
// import { Building2, Search, RefreshCw, MapPin, Phone, Globe, ShieldCheck, ChevronRight } from "lucide-react";

// export default function ManageHospitalsPage() {
//   const router = useRouter();
//   const [hospitals, setHospitals] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const fetchHospitals = async () => {
//     setRefreshing(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/hospitals", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setHospitals(res.data);
//     } catch (error) {
//       console.error("Failed to fetch hospitals", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleToggleLicense = async (e: React.MouseEvent, hospitalId: string, currentStatus: string) => {
//     e.stopPropagation(); // 🚀 Prevent row click navigation
//     const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
//     if (!window.confirm(`Switch license to ${newStatus}?`)) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(`/hospitals/${hospitalId}`, { status: newStatus }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchHospitals();
//     } catch (error) {
//       alert("Failed to update status.");
//     }
//   };

//   // 🚀 FIX: Re-defined the missing variable for Turbopack
//   const filteredHospitals = hospitals.filter(hospital => 
//     hospital.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     hospital.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     hospital.city?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading && hospitals.length === 0) {
//     return <div className="p-20 text-center font-bold animate-pulse text-slate-400">Loading Directory...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800">
//       <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
//         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border shadow-sm gap-5">
//           <h1 className="text-2xl font-black flex items-center gap-3">
//             <ShieldCheck className="text-sky-600" /> Manage Hospitals
//           </h1>
//           <div className="relative w-full md:w-96">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search directory..." 
//               className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
//               <tr>
//                 <th className="p-5 pl-8">Hospital</th>
//                 <th className="p-5">Location</th>
//                 <th className="p-5 pr-8 text-right">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredHospitals.map((h) => (
//                 <tr 
//                   key={h._id} 
//                   onClick={() => router.push(`/dashboard/hospitals/${h._id}`)} 
//                   className="hover:bg-sky-50/50 cursor-pointer transition-all group"
//                 >
//                   <td className="p-5 pl-8 flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-black">
//                       {h.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="font-bold text-sm">{h.name}</p>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase">{h.domain}.vaidyaerp.com</p>
//                     </div>
//                   </td>
//                   <td className="p-5 text-xs font-bold text-slate-500">{h.city}, {h.state}</td>
//                   <td className="p-5 pr-8 text-right">
//                     <button 
//                       onClick={(e) => handleToggleLicense(e, h._id, h.status)}
//                       className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border ${
//                         h.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
//                       }`}
//                     >
//                       {h.status || 'Inactive'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import HospitalWhatsAppConfig from "./WhatsAppConfig"; // 🚀 Make sure this import is here!
import { ArrowLeft } from "lucide-react";

export default function HospitalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/hospitals/${id}`);
        setHospital(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-slate-400 animate-pulse font-bold text-center">Loading Profile...</div>;
  if (!hospital) return <div className="p-10 text-rose-500 font-bold text-center">Hospital record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* 1. BACK BUTTON */}
      <button onClick={() => router.push('/dashboard/hospitals')} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-sky-600 transition-all">
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* 2. HOSPITAL HEADER (This was working perfectly in your screenshot) */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm flex items-center gap-5">
        <div className="h-16 w-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black">
          {hospital.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{hospital.name}</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Tenant ID: {hospital._id}</p>
        </div>
      </div>

      {/* 🚀 3. THE WHATSAPP CONFIG (This replaces the accidental table) */}
      <HospitalWhatsAppConfig hospital={hospital} />

    </div>
  );
}