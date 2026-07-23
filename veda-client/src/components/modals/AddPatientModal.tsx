"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig"; 
import { X, User, Phone, Calendar, Users, Stethoscope, MapPin } from "lucide-react";

export default function AddPatientModal({ isOpen, onClose, onSuccess }: any) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "Mohali", // ✅ Added default address to match your working page
    assignedDoctorId: "" 
  });

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      setFormData({ name: "", age: "", gender: "", mobile: "", address: "Mohali", assignedDoctorId: "" });
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    try {
      // ✅ Using your interceptor-based axios
      const res = await axios.get("/users/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ 🚀 CRITICAL FIX: Ensure 'age' is a Number
      const payload = {
        ...formData,
        age: Number(formData.age),
      };

      // ✅ Ensure your axiosConfig handles the Token, 
      // or manually add it if the interceptor isn't set up yet:
      const token = localStorage.getItem("token");
      
      await axios.post("/patients", payload, {
        headers: { Authorization: `Bearer ${token}` } // Manual backup
      });

      onSuccess(); 
      onClose(); 
    } catch (err: any) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || "Check console for details"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-primary-400" size={24} /> Register New Patient
          </h2>
          <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-xl transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 text-slate-800">
          
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Full Name *</label>
            <input 
              type="text" required placeholder="Full Name"
              className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Age *</label>
              <input 
                type="number" required placeholder="26"
                className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold"
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Gender *</label>
              <select 
                required 
                className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Mobile *</label>
              <input 
                type="tel" required placeholder="10-digit number"
                className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold"
                value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Location</label>
              <input 
                type="text" placeholder="City"
                className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} 
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Assign to Doctor</label>
            <select 
              className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-primary-600"
              value={formData.assignedDoctorId} onChange={e => setFormData({...formData, assignedDoctorId: e.target.value})}
            >
              <option value="">-- No Doctor Assigned --</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-200 disabled:opacity-50 transition-all">
              {loading ? "Registering..." : "Save Patient"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}