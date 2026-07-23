// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Users, Wallet, Activity, Calendar, Clock, ArrowUpRight } from "lucide-react";
// import LowStockWidget from "@/components/LowStockWidget";

// export default function DashboardPage() {
//   const [data, setData] = useState({
//     totalPatients: 0,
//     todayAppointments: 0,
//     revenue: "₹0",
//     activeSessions: 0,
//     history: []
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const config = { headers: { Authorization: `Bearer ${token}` } };
    
//     // ✅ Fix: Ensure only the YYYY-MM-DD part is sent to avoid parsing errors
//     const today = new Date().toISOString().split('T')[0];

//     const [statsRes, historyRes] = await Promise.all([
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/daily-revenue?date=${today}`, config),
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory/history`, config)
//     ]);

//     setData({
//       totalPatients: 128,
//       todayAppointments: statsRes.data.completedSessions || 0,
//       revenue: statsRes.data.totalRevenue || "₹0",
//       activeSessions: 8,
//       history: historyRes.data.slice(0, 5)
//     });
//   } catch (err) {
//     console.error("Dashboard fetch failed", err);
//   } finally {
//     setLoading(false);
//   }
// };

      

//   const stats = [
//     { title: "Total Patients", value: data.totalPatients, icon: Users, color: "text-primary-600", bg: "bg-primary-50" },
//     { title: "Today's Completed", value: data.todayAppointments, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
//     { title: "Today's Revenue", value: data.revenue, icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
//     { title: "Active Therapies", value: data.activeSessions, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
//   ];

//   if (loading) return <div className="p-10 text-gray-500 animate-pulse">Loading Veda ERP...</div>;

//   return (
//     <div className="space-y-8 p-4">
//       <header>
//         <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
//         <p className="text-gray-500">Real-time status for Yukti Herbs Multispeciality</p>
//       </header>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//             <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
//               <stat.icon size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
//               <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Section: Inventory Activity History */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-gray-50 flex justify-between items-center">
//               <h3 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Clock size={18} className="text-primary-500" /> Recent Inventory activity
//               </h3>
//             </div>
//             <div className="divide-y divide-gray-50">
//               {data.history.length > 0 ? (
//                 data.history.map((log: any) => (
//                   <div key={log._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center gap-4">
//                       <div className={`p-2 rounded-lg ${log.changeType === 'ADDITION' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
//                         <ArrowUpRight size={16} className={log.changeType === 'DEDUCTION' ? 'rotate-90' : ''} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-gray-800">{log.inventoryId?.name}</p>
//                         <p className="text-[10px] text-gray-400 italic">{log.notes}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className={`text-sm font-black ${log.changeType === 'ADDITION' ? 'text-green-600' : 'text-red-600'}`}>
//                         {log.changeType === 'ADDITION' ? '+' : '-'}{log.quantity}
//                       </p>
//                       <p className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-10 text-center text-gray-400 italic text-sm">No recent activity recorded.</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Sidebar: Low Stock Widget */}
//         <div className="space-y-6">
//           <LowStockWidget />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/Sidebar"; 
// import AdminDashboard from "@/components/dashboards/AdminDashboard";
// import ReceptionDashboard from "@/components/dashboards/ReceptionDashboard";
// import TherapistDashboard from "@/components/dashboards/TherapistDashboard";

// export default function DashboardPage() {
//   const [role, setRole] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // 1. Get Role from Storage
//     const storedRole = localStorage.getItem("role");
    
//     // Debugging: Check console to see what is actually saved
//     console.log("Current Role in Storage:", storedRole);

//     // 2. Redirect if missing
//     if (!storedRole) {
//       router.push("/login");
//       return;
//     }

//     // 3. Normalize (Handle Super Admin or Doctor as Admin)
//     let cleanRole = storedRole.toUpperCase();
//     if (cleanRole === "SUPER_ADMIN" || cleanRole === "DOCTOR") {
//       cleanRole = "ADMIN";
//     }
    
//     setRole(cleanRole);
//   }, [router]);

//   // Loading State
//   if (!role) return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 animate-pulse">Loading Veda ERP...</div>;

//   return (
//     <div className="flex bg-slate-50 min-h-screen">
      
//       {/* Sidebar with Role Prop */}
//       <Sidebar role={role} />

//       {/* Main Content Area */}
//       <main className="flex-1 ml-64 p-8 transition-all">
//         {role === "ADMIN" && <AdminDashboard />}
//         {role === "RECEPTIONIST" && <ReceptionDashboard />}
//         {role === "THERAPIST" && <TherapistDashboard />}
        
//         {/* Fallback for unknown roles (Debug Helper) */}
//         {!["ADMIN", "RECEPTIONIST", "THERAPIST"].includes(role) && (
//           <div className="p-10 text-center">
//             <h2 className="text-red-500 font-bold text-xl">Role Mismatch</h2>
//             <p className="text-gray-500">
//               System detected role: <span className="font-mono bg-gray-200 px-1 rounded">{role}</span>
//             </p>
//             <button 
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.href = "/login";
//               }}
//               className="mt-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
//             >
//               Force Logout & Reset
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader } from "lucide-react";

// Import Dashboards
import SuperAdminDashboard from "@/components/dashboards/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import ReceptionDashboard from "@/components/dashboards/ReceptionDashboard";
import TherapistDashboard from "@/components/dashboards/TherapistDashboard";
import PharmacistDashboard from "@/components/dashboards/PharmacistDashboard";
import TelecallerDashboard from "@/components/dashboards/TelecallerDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/login");
      return;
    }
    setRole(storedRole.toUpperCase());
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-slate-600 font-medium">Loading Veda ERP...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
          <p className="text-slate-600 mb-6">Unable to determine user role. Please log in again.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Role Dashboard Master Switch */}
      {role === "SUPER_ADMIN" && <SuperAdminDashboard />}
      {role === "ADMIN" && <AdminDashboard />}
      {role === "DOCTOR" && <DoctorDashboard />}
      {role === "RECEPTIONIST" && <ReceptionDashboard />}
      {role === "THERAPIST" && <TherapistDashboard />}
      {role === "PHARMACIST" && <PharmacistDashboard />}
      {role === "TELECALLER" && <TelecallerDashboard />}

      {/* Unknown Role Fallback */}
      {!["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "THERAPIST", "PHARMACIST", "TELECALLER"].includes(role) && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Unknown Role</h2>
            <p className="text-slate-600 mb-2">System detected role:</p>
            <code className="bg-slate-100 text-slate-900 px-3 py-1 rounded inline-block font-mono mb-6">
              {role}
            </code>
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Force Logout & Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}

