// "use client";

// import { useEffect, useState } from "react";
// import axios from "@/utils/axiosConfig";
// import { useRouter } from "next/navigation"; // 🚀 Import Router
// import { Building2, Search, RefreshCw, MapPin, Phone, Globe, ShieldCheck, ChevronRight } from "lucide-react";

// export default function ManageHospitalsPage() {
//   const router = useRouter(); // 🚀 Initialize Router
//   const [hospitals, setHospitals] = useState<any[]>([]);
//   // ... (keep your existing state and fetchHospitals logic)

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
//       <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
//         {/* ... (Header and Search remain the same) */}

//         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               {/* ... (Thead remains the same) */}
//               <tbody className="divide-y divide-slate-50">
//                 {filteredHospitals.map((h) => {
//                   const isActive = (h.status || 'Inactive') === 'Active';
//                   return (
//                     <tr 
//                       key={h._id} 
//                       // 🚀 Routing Logic: Click anywhere on the row (except buttons) to manage
//                       onClick={() => router.push(`/dashboard/hospitals/${h._id}`)}
//                       className="hover:bg-sky-50/30 cursor-pointer transition-colors group"
//                     >
//                       <td className="p-5 pl-8">
//                         <div className="flex items-center gap-4">
//                           <div className="h-12 w-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
//                             {h.name.charAt(0)}
//                           </div>
//                           <div>
//                             <p className="font-extrabold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">
//                               {h.name}
//                             </p>
//                             <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
//                               <Globe size={12}/> {h.domain}.vaidyaerp.com
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="p-5 font-bold text-slate-600 text-xs">
//                         {h.city}, {h.state}
//                       </td>

//                       <td className="p-5 font-bold text-slate-600 text-xs">
//                         {h.phone || "Not Provided"}
//                       </td>

//                       <td className="p-5 pr-8 text-right">
//                         <div className="flex items-center justify-end gap-3">
//                            {/* Use stopPropagation to prevent row click when toggling status */}
//                           <button 
//                             onClick={(e) => {
//                               e.stopPropagation(); 
//                               handleToggleLicense(h._id, h.status);
//                             }}
//                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${
//                               isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
//                             }`}
//                           >
//                             {h.status || 'Inactive'}
//                           </button>
//                           <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }