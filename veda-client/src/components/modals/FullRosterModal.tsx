"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { X, Search, Mail, UserCircle, Activity, Users } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FullRosterModal({ 
  isOpen, 
  onClose, 
  staffList = [], 
  onSuccess,
  onStatusUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  staffList?: any[]; 
  onSuccess?: () => void;
  onStatusUpdate?: (userId: string, newStatus: string) => void;
}) {
  const [localStaffList, setLocalStaffList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      if (staffList && staffList.length > 0) {
        setLocalStaffList(staffList);
      } else {
        fetchFullStaff();
      }
    }
  }, [isOpen, staffList]);

  const fetchFullStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/users", { headers: { Authorization: `Bearer ${token}` } });
      const onlyStaff = res.data.filter((user: any) => user.role?.toUpperCase() !== 'PATIENT');
      setLocalStaffList(onlyStaff);
    } catch (err) {
      console.error("Failed to fetch staff roster:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setUpdatingId(userId);
    try {
      const token = localStorage.getItem("token");
      
      // 🚀 THE FIX: Send EXACTLY what the backend expects!
      const payload = { attendanceStatus: newStatus };

      await axios.patch(`/users/${userId}`, payload, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state instantly
      setLocalStaffList(prev => prev.map(staff => 
        staff._id === userId ? { ...staff, attendanceStatus: newStatus, status: newStatus } : staff
      ));

      // Update parent dashboard instantly
      if (onStatusUpdate) {
        onStatusUpdate(userId, newStatus);
      }

      toast.success("Status Updated Successfully!");
      if (onSuccess) onSuccess();

    } catch (err: any) {
      const backendError = err.response?.data?.message;
      const errorMessage = Array.isArray(backendError) ? backendError[0] : backendError;
      toast.error(`Failed: ${errorMessage || "Invalid data sent to server"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  const safeList = Array.isArray(localStaffList) ? localStaffList : [];
  const filteredStaff = safeList.filter(s => 
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
          <X size={20} />
        </button>

        <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0 bg-white">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Activity size={24} strokeWidth={2.5}/></div>
            Staff Roster & Attendance
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 ml-1">
            Manage live availability for {safeList.length} staff members.
          </p>
        </div>

        <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl w-full"></div>)}
             </div>
          ) : filteredStaff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStaff.map((staff, idx) => {
                
                // 🚀 FIX: Reading either status or attendanceStatus to ensure it maps correctly
                const rawStatus = staff.attendanceStatus || staff.status || 'OFFLINE';
                const currentStatus = String(rawStatus).toUpperCase();
                
                const statusColors = {
                  'AVAILABLE': 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20',
                  'ONLINE': 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20',
                  'ACTIVE': 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20',
                  'BUSY': 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500/20',
                  'IN_SESSION': 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500/20',
                  'OFFLINE': 'bg-slate-50 text-slate-600 border-slate-200 focus:ring-slate-500/20'
                };

                const appliedColorClass = statusColors[currentStatus as keyof typeof statusColors] || statusColors['OFFLINE'];
                const isOnline = ['AVAILABLE', 'ONLINE', 'ACTIVE'].includes(currentStatus);

                // Ensure the dropdown shows "AVAILABLE" if it's currently any variant of online
                const selectValue = ['ONLINE', 'ACTIVE', 'AVAILABLE'].includes(currentStatus) ? 'AVAILABLE' : currentStatus;

                return (
                  <div key={staff._id || idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-sky-200 transition-all duration-300 hover:-translate-y-0.5 group">
                    
                    <div className="flex items-start gap-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-inner border
                        ${staff.role?.toUpperCase() === 'SUPER_ADMIN' || staff.role?.toUpperCase() === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                          staff.role?.toUpperCase() === 'DOCTOR' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {staff.name ? staff.name.charAt(0).toUpperCase() : <UserCircle size={28}/>}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-extrabold text-slate-800 text-base truncate">{staff.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-sky-600 mt-0.5 mb-1.5 bg-sky-50 w-fit px-2 py-0.5 rounded border border-sky-100">{staff.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {updatingId === staff._id ? (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                             <div className="h-2 w-2 bg-slate-400 rounded-full animate-ping"></div> Updating...
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex h-2 w-2">
                              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : currentStatus === 'BUSY' ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                            </div>
                            
                            {/* 🚀 THE FIX: Strict Enums */}
                            <select 
                              value={selectValue} 
                              onChange={(e) => handleStatusChange(staff._id, e.target.value)}
                              className={`text-xs font-bold uppercase tracking-wider pl-8 pr-4 py-2 rounded-xl border outline-none cursor-pointer appearance-none transition-colors shadow-inner focus:ring-2 ${appliedColorClass}`}
                            >
                              <option value="AVAILABLE">Available</option>
                              <option value="BUSY">In Session</option>
                              <option value="OFFLINE">Offline / Leave</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-slate-400 py-20">
               <Users size={48} className="mb-4 opacity-20"/>
               <p className="font-bold text-sm uppercase tracking-widest text-slate-500">No staff found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}