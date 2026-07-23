"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";
import { Building2, Search, RefreshCw, MapPin, Phone, Globe, ShieldCheck, ChevronRight } from "lucide-react";

export default function ManageHospitalsPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/hospitals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(res.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleLicense = async (e: React.MouseEvent, hospitalId: string, currentStatus: string) => {
    e.stopPropagation(); // 🚀 Prevent row click from firing
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (!window.confirm(`Switch license to ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/hospitals/${hospitalId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHospitals();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // 🚀 THE FIX: Variable must be defined before use in the return statement
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && hospitals.length === 0) {
    return <div className="p-20 text-center font-bold animate-pulse text-slate-400">Loading Directory...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border shadow-sm gap-5">
          <h1 className="text-2xl font-black flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><ShieldCheck size={24}/></div>
            Manage Hospitals
          </h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, domain, or city..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* DIRECTORY TABLE */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="p-5 pl-8">Hospital Details</th>
                  <th className="p-5">Location</th>
                  <th className="p-5 pr-8 text-right">License Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHospitals.map((h) => {
                  const isActive = (h.status || 'Inactive') === 'Active';
                  return (
                    <tr 
                      key={h._id} 
                      onClick={() => router.push(`/dashboard/hospitals/${h._id}`)}
                      className="hover:bg-sky-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                            {h.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{h.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{h.domain}.vaidyaerp.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-600 text-xs">
                        {h.city}, {h.state}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={(e) => handleToggleLicense(e, h._id, h.status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                              isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {h.status || 'Inactive'}
                          </button>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}