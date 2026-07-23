"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Search, Stethoscope, Calendar, User, 
  CheckCircle, Clock, PlayCircle, Filter, ChevronDown, Activity
} from "lucide-react";

export default function TreatmentRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); // Check who is logged in
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 🚀 SMART ROUTING: Therapists get their own history, Doctors get everything!
      const endpoint = role === "THERAPIST" 
        ? "/therapies/me/history" 
        : "/therapies";

      const response = await axios.get(endpoint, config);
      setRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch therapy history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.therapyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🚀 Premium Skeleton Loader
  if (loading && records.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-[600px] bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER & FILTERS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-800 to-sky-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Stethoscope size={24} strokeWidth={2.5} /></div>
              Treatment Records
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Complete history of therapy sessions and clinical treatments.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            {/* Search Bar */}
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search patient or therapy..." 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-48 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
              <select 
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-bold text-slate-700 transition-all shadow-inner appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <tr>
                  <th className="p-5 pl-8 w-48">Date & Time</th>
                  <th className="p-5">Patient Name</th>
                  <th className="p-5">Therapy & Staff</th>
                  <th className="p-5 text-center">Room</th>
                  <th className="p-5 pr-8 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-2.5 text-sm font-extrabold text-slate-800">
                        <Calendar size={14} className="text-sky-400" />
                        {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-slate-400 mt-1 uppercase">
                        <Clock size={12} className="text-slate-300" /> {record.time}
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-black shadow-inner border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                          {record.patientName?.charAt(0).toUpperCase() || <User size={16} />}
                        </div>
                        <span className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">{record.patientName}</span>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="text-sm font-black text-slate-900 leading-tight block">
                        {record.therapyName}
                      </span>
                      {record.therapistId?.name && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                          <User size={10} className="text-slate-400" /> By: {record.therapistId.name}
                        </span>
                      )}
                    </td>

                    <td className="p-5 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg border border-slate-200 shadow-sm">
                        {record.roomNumber || "N/A"}
                      </span>
                    </td>

                    <td className="p-5 pr-8 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        record.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        record.status === 'IN_PROGRESS' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {record.status === 'PENDING' && <Clock size={12} strokeWidth={3} />}
                        {record.status === 'IN_PROGRESS' && <Activity size={12} strokeWidth={3} />}
                        {record.status === 'COMPLETED' && <CheckCircle size={12} strokeWidth={3} />}
                        {record.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          <Stethoscope size={32} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No records found</p>
                        <p className="text-xs font-medium mt-1">Try adjusting your search or status filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}