"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig"; 
import { 
  UserPlus, Shield, Mail, Trash2, X, Users, 
  Briefcase, Lock, CheckCircle2, Search, Building2, Filter 
} from "lucide-react";

interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
  hospitalId?: { _id: string; name: string } | string;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DOCTOR",
    hospitalId: ""
  });
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [adminHospitalId, setAdminHospitalId] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role")?.toUpperCase() || null;
    const currentHospitalId = localStorage.getItem("hospitalId") || null; 
    
    setUserRole(role);
    setAdminHospitalId(currentHospitalId);
    
    // Pass these directly to fetchStaff to avoid async state delays
    fetchStaff(role, currentHospitalId); 
    
    if (role === "SUPER_ADMIN") {
      fetchHospitals();
    }
  }, []);

  const fetchStaff = async (overrideRole?: string | null, overrideHospitalId?: string | null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const currentRole = overrideRole || localStorage.getItem("role")?.toUpperCase();
      const currentHospitalId = overrideHospitalId || localStorage.getItem("hospitalId"); 

      const res = await axios.get(`/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let users = res.data.filter((u: any) => u.role !== 'PATIENT');

      // STRICT FRONTEND TENANT ISOLATION
      if (currentRole !== "SUPER_ADMIN" && currentHospitalId) {
        users = users.filter((u: any) => {
          const staffHospId = typeof u.hospitalId === 'object' ? u.hospitalId?._id : u.hospitalId;
          return staffHospId === currentHospitalId;
        });
      }

      setStaffList(users);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/hospitals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(res.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // 🚀 THE FIX: Explicitly type payload as a flexible Record so TypeScript allows 'delete'
      const payload: Record<string, any> = { ...formData };
      if (!payload.hospitalId) delete payload.hospitalId;

      await axios.post(`/users/add-staff`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "DOCTOR", hospitalId: "" });
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding staff member.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the system?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (err) {
      alert("Failed to delete staff member.");
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const staffHospitalId = typeof staff.hospitalId === 'object' ? staff.hospitalId?._id : staff.hospitalId;
    const matchesHospital = selectedHospital ? staffHospitalId === selectedHospital : true;

    return matchesSearch && matchesHospital;
  });

  const groupedStaff = filteredStaff.reduce((acc, staff) => {
    let hName = "Unassigned / Global Admins";
    if (typeof staff.hospitalId === 'object' && staff.hospitalId?.name) {
      hName = staff.hospitalId.name;
    } else if (typeof staff.hospitalId === 'string') {
      const found = hospitals.find(h => h._id === staff.hospitalId);
      if (found) hName = found.name;
    } else if (staff.role === 'SUPER_ADMIN') {
      hName = "Veda ERP Platform Admins";
    }
    
    if (!acc[hName]) acc[hName] = [];
    acc[hName].push(staff);
    return acc;
  }, {} as Record<string, Staff[]>);

  const renderStaffCard = (staff: Staff) => {
    const roleColors = {
      'SUPER_ADMIN': 'bg-purple-50 text-purple-700 border-purple-200',
      'ADMIN': 'bg-purple-50 text-purple-700 border-purple-200',
      'DOCTOR': 'bg-primary-50 text-primary-700 border-primary-200',
      'RECEPTIONIST': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'THERAPIST': 'bg-orange-50 text-orange-700 border-orange-200',
      'PHARMACIST': 'bg-primary-50 text-primary-700 border-primary-200',
      'TELECALLER': 'bg-sky-50 text-sky-700 border-sky-200',
    };
    const currentRoleColor = roleColors[staff.role as keyof typeof roleColors] || 'bg-slate-100 text-slate-600 border-slate-200';

    return (
      <div key={staff._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md hover:border-sky-200 hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xl shadow-inner shrink-0 group-hover:text-sky-500 group-hover:border-sky-200 transition-colors">
            {staff.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-extrabold text-slate-900 text-lg truncate group-hover:text-sky-600 transition-colors">{staff.name}</h3>
            <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border mt-1 ${currentRoleColor}`}>
              {staff.role.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Mail size={14} className="text-slate-400 shrink-0" /> <span className="truncate">{staff.email}</span>
          </div>
        </div>

        <button 
          onClick={() => handleDelete(staff._id, staff.name)}
          className="absolute top-4 right-4 p-2 bg-white text-slate-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl opacity-0 md:group-hover:opacity-100 transition-all active:scale-95 shadow-sm"
          title="Remove User"
        >
          <Trash2 size={16} strokeWidth={2.5}/>
        </button>
      </div>
    );
  };

  if (loading && staffList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-slate-200 rounded-3xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-800 to-sky-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Users size={24} strokeWidth={2.5}/></div>
              Staff Directory
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Manage practitioners, receptionists, and system admins.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 border border-sky-500 shrink-0"
          >
            <UserPlus size={18} strokeWidth={2.5}/> Add New Member
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name, email, or role..." 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {userRole === "SUPER_ADMIN" && (
            <div className="relative w-full sm:w-72 group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <select 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-800 transition-all shadow-inner cursor-pointer appearance-none"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
              >
                <option value="">All Hospitals (Global View)</option>
                {hospitals.map(h => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          )}
        </div>

        {/* STAFF GRID */}
        {filteredStaff.length > 0 ? (
          userRole === "SUPER_ADMIN" ? (
            <div className="space-y-10">
              {Object.keys(groupedStaff).sort().map(hName => (
                <div key={hName} className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Building2 size={20} strokeWidth={2.5}/></div>
                       <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{hName}</h2>
                     </div>
                     <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                       {groupedStaff[hName].length} Staff Members
                     </span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                     {groupedStaff[hName].map(staff => renderStaffCard(staff))}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map(staff => renderStaffCard(staff))}
            </div>
          )
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
               <Shield size={32} className="text-slate-300" />
             </div>
             <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No staff members found</p>
             <p className="text-xs font-medium mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* ADD STAFF MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
                <X size={20} />
              </button>
              
              <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0 bg-white">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Shield size={24} strokeWidth={2.5}/></div>
                  Provision Account
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-2 ml-1">Create secure access for a new hospital employee.</p>
              </div>
              
              <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
                <form id="add-staff-form" onSubmit={handleAddStaff} className="p-8 space-y-5">
                  
                  {userRole === "SUPER_ADMIN" && (
                    <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 mb-2 shadow-inner">
                      <label className="text-[10px] font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-2">
                        <Building2 size={12}/> Assign to Hospital *
                      </label>
                      <select required className="w-full border border-sky-200 p-3.5 rounded-xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm cursor-pointer"
                        value={formData.hospitalId} onChange={(e) => setFormData({...formData, hospitalId: e.target.value})}
                      >
                        <option value="" disabled>Select a hospital...</option>
                        {hospitals.map(h => (
                          <option key={h._id} value={h._id}>{h.name} ({h.domain})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                      <Users size={12}/> Full Name
                    </label>
                    <input type="text" required placeholder="e.g. Dr. Sharma" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                      <Mail size={12}/> Email Address
                    </label>
                    <input type="email" required placeholder="staff@hospital.com" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                        <Briefcase size={12}/> System Role
                      </label>
                      <select className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner cursor-pointer"
                        value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        {userRole === "SUPER_ADMIN" && <option value="ADMIN">Admin</option>}
                        <option value="DOCTOR">Doctor</option>
                        <option value="THERAPIST">Therapist</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="PHARMACIST">Pharmacist</option>
                        <option value="TELECALLER">Telecaller</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                        <Lock size={12}/> Initial Password
                      </label>
                      <input type="password" required placeholder="••••••••" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   form="add-staff-form"
                   className="flex-[2] py-4 rounded-2xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xl shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 size={18} strokeWidth={3}/> Create Account
                 </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}