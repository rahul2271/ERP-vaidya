"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { UserPlus, Search, Trash2, Edit, X, FileText, User, Activity } from "lucide-react";

interface Patient {
  _id: string;
  uhid?: string; 
  name: string;
  age: number;
  gender: string;
  mobile: string;
  address?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    uhid: "", 
    name: "",
    age: "",
    gender: "M", 
    mobile: "",
    address: "Mohali"
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (patient: Patient) => {
    setFormData({
      uhid: patient.uhid || "", 
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      mobile: patient.mobile,
      address: patient.address || "Mohali"
    });
    setEditingPatientId(patient._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatientId(null);
    setFormData({ uhid: "", name: "", age: "", gender: "M", mobile: "", address: "Mohali" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Dynamic SaaS UHID Generator
      // Only send a uhid if the user explicitly typed a custom one. Otherwise,
      // omit it entirely so the backend's sequential counter generates it —
      // generating one here with Math.random() would always populate this field
      // and silently bypass the backend's real, collision-safe generator.
      const payload: any = {
        ...formData,
        age: Number(formData.age),
      };
      if (formData.uhid) {
        payload.uhid = formData.uhid;
      } else {
        delete payload.uhid;
      }
      
      if (editingPatientId) {
        await axios.patch(`/patients/${editingPatientId}`, payload, config);
      } else {
        await axios.post(`/patients`, payload, config);
      }
      
      handleCloseModal();
      fetchPatients();
    } catch (err: any) {
      console.error("Backend Validation Error:", err.response?.data || err.message);
      const errorMsg = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(", ") 
        : err.response?.data?.message || "Validation failed.";
      alert(`Error saving patient: ${errorMsg}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPatients(); 
      } catch (err) {
        alert("Delete failed. You might not have Admin permissions.");
      }
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mobile.includes(searchTerm) ||
    (p.uhid && p.uhid.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* HEADER & CONTROLS */}
      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Patient Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and view electronic medical records.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search name, phone, or UHID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { handleCloseModal(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all whitespace-nowrap"
          >
            <UserPlus size={18} /> Add Patient
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                <th className="py-4 px-6 rounded-tl-[1.5rem]">Patient ID & UHID</th>
                <th className="py-4 px-6">Patient Name</th>
                <th className="py-4 px-6">Age / Sex</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6 text-center rounded-tr-[1.5rem]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 font-bold animate-pulse">Loading Patients...</td></tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1.5">
                        {p.uhid ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold tracking-tight shadow-sm">
                            {p.uhid}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-bold tracking-tight shadow-sm">
                            Pending UHID
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-bold" title="System Patient ID">
                          ID: {p._id.slice(-6)} 
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/patients/${p._id}`} className="flex items-center gap-3 group/link">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-100 group-hover/link:bg-primary-600 group-hover/link:text-white transition-colors">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover/link:text-primary-600 transition-colors block">{p.name}</span>
                          <span className="text-xs text-slate-400 font-medium">View Full Profile</span>
                        </div>
                      </Link>
                    </td>

                    <td className="py-4 px-6">{p.age} Yrs <span className="text-slate-300 mx-1">/</span> {p.gender}</td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{p.mobile}</td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/dashboard/patients/${p._id}`} 
                          className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors font-bold text-xs border border-sky-100"
                        >
                          <Activity size={14} /> EMR
                        </Link>
                        <Link 
                          href={`/dashboard/patients/${p._id}/discharge`} 
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleEditClick(p)} 
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 text-slate-200 mb-4" />
                      <p className="font-black text-slate-700 text-lg uppercase tracking-wider">No patients found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PATIENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute right-6 top-6 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-2 rounded-full transition-all">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
              {editingPatientId ? "Edit Patient Details" : "Register Patient"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3.5 rounded-xl mt-1 text-slate-900 outline-none focus:border-primary-500 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input 
                    type="number" required
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3.5 rounded-xl mt-1 text-slate-900 outline-none focus:border-primary-500 transition-all font-bold"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3.5 rounded-xl mt-1 text-slate-900 outline-none focus:border-primary-500 transition-all font-bold cursor-pointer"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Mobile Number</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3.5 rounded-xl mt-1 text-slate-900 outline-none focus:border-primary-500 transition-all font-bold"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
              
              <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all mt-8">
                {editingPatientId ? "Update Patient Data" : "Save New Patient"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}