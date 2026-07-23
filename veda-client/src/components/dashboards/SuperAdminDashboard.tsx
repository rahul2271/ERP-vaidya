"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Building2, ShieldCheck, Activity, Plus, 
  UserPlus, X, RefreshCw, Globe, IndianRupee,
  Mail, Phone, MapPin
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export default function SuperAdminDashboard() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [metrics, setMetrics] = useState({
    totalHospitals: 0,
    activeLicenses: 0,
    networkHealth: 100,
    mrr: 0,
    revenueHistory: [] 
  });
  
  const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  // 🚀 FIX: Added 'email' to the hospital form state to satisfy backend validation
  const [hospitalForm, setHospitalForm] = useState({ 
    name: "", domain: "", email: "", city: "", state: "", phone: "", status: "Active" 
  });
  
  const [adminForm, setAdminForm] = useState({ 
    name: "", email: "", mobile: "", password: "" 
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [hospitalsRes, metricsRes] = await Promise.all([
        axios.get("/hospitals", { headers }),
        axios.get("/super-admin/metrics", { headers }).catch(() => ({ data: null })) 
      ]);

      setHospitals(hospitalsRes.data);
      
      if (metricsRes.data) {
        setMetrics({
          totalHospitals: metricsRes.data.metrics.totalHospitals,
          activeLicenses: metricsRes.data.metrics.activeLicenses,
          networkHealth: metricsRes.data.metrics.networkHealth,
          mrr: metricsRes.data.revenue.mrr,
          revenueHistory: metricsRes.data.revenue.history || [] 
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleLicense = async (hospitalId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (!window.confirm(`Switch license to ${newStatus}?`)) return;

    setHospitals(prev => prev.map(h => h._id === hospitalId ? { ...h, status: newStatus } : h));

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/hospitals/${hospitalId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      alert("Failed to update status.");
      fetchDashboardData();
    }
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/hospitals", hospitalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAddHospitalOpen(false);
      // Reset form including email
      setHospitalForm({ name: "", domain: "", email: "", city: "", state: "", phone: "", status: "Active" });
      fetchDashboardData();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert(`❌ Error: ${Array.isArray(msg) ? msg.join(", ") : msg || "Server Error"}`);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/users", {
        ...adminForm,
        role: "ADMIN",
        hospitalId: selectedHospital._id,
        age: 35, 
        gender: "Other" 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAddAdminOpen(false);
      setAdminForm({ name: "", email: "", mobile: "", password: "" });
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert(`❌ Error: ${Array.isArray(msg) ? msg.join(", ") : msg || "Server Error"}`);
    }
  };

  // 🚀 Premium Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8 animate-pulse">
        <div className="h-20 bg-ink-100 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-ink-100 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-ink-100 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-ink-900 bg-[#F6F9F8] min-h-screen">
      
      {/* HEADER: Soft gradients and refined typography */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-ink-100 shadow-sm transition-all hover:shadow-md">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r text-ink-900 flex items-center gap-3">
            Master Control
            <button 
              onClick={fetchDashboardData} 
              className={`p-2 bg-ink-50 text-ink-400 rounded-full hover:bg-ink-100 hover:text-sky-600 transition-colors ${refreshing ? 'animate-spin text-sky-600' : ''}`}
            >
              <RefreshCw size={18} />
            </button>
          </h1>
          <p className="text-ink-500 font-medium text-sm mt-1 flex items-center gap-2">
            Global Hospital & Revenue Management
          </p>
        </div>
        <button 
          onClick={() => setIsAddHospitalOpen(true)} 
          className="mt-4 md:mt-0 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3}/> Register Facility
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Units", value: metrics.totalHospitals || hospitals.length, icon: Building2, color: "text-primary-600", bg: "bg-primary-50" },
          { title: "Active Licenses", value: metrics.activeLicenses || hospitals.filter(h => (h.status || 'Inactive').toLowerCase() === 'active').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Network Health", value: `${metrics.networkHealth}%`, icon: Activity, color: "text-secondary-600", bg: "bg-secondary-50" },
          { title: "Monthly Revenue", value: `₹${metrics.mrr.toLocaleString()}`, icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5">
             <div className={`h-14 w-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                <card.icon size={24} strokeWidth={2.5}/>
             </div>
             <div>
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mb-1">{card.title}</p>
                <h2 className="text-3xl font-bold text-ink-900 tracking-tight">{card.value}</h2>
             </div>
          </div>
        ))}
      </div>

      {/* REVENUE CHART */}
      <div className="bg-white p-8 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-ink-900 tracking-tight">Revenue Growth</h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">+14% vs Last Month</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.revenueHistory}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#25786f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#25786f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `₹${value}`} dx={-10} />
              <Tooltip 
                cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1e293b'}} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#25786f" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 8, strokeWidth: 0, fill: '#25786f' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REFINED TABLE */}
      <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-ink-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-ink-900">Active Facilities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400 font-semibold">
                <th className="p-5 pl-8">Hospital Details</th>
                <th className="p-5">Location</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {hospitals.map((h) => (
                <tr key={h._id} className="hover:bg-ink-50/80 transition-colors group">
                  <td className="p-5 pl-8 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg border border-sky-100">
                      {h.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-ink-900">{h.name}</p>
                      <p className="text-xs font-medium text-ink-400 flex items-center gap-1 mt-0.5">
                        <Globe size={12}/> {h.domain}.vaidyaerp.com
                      </p>
                    </div>
                  </td>
                  <td className="p-5 font-medium text-ink-500">{h.city}, {h.state}</td>
                  <td className="p-5">
                    <button 
                      onClick={() => handleToggleLicense(h._id, h.status || 'Inactive')} 
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        (h.status || 'Inactive') === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${(h.status || 'Inactive') === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {h.status || 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <button 
                      onClick={() => { setSelectedHospital(h); setIsAddAdminOpen(true); }} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-ink-50 text-ink-500 rounded-xl text-sm font-semibold hover:bg-sky-50 hover:text-sky-600 transition-colors border border-ink-200"
                    >
                      <UserPlus size={16}/> Add Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 FIXED REGISTER FACILITY MODAL */}
      {isAddHospitalOpen && (
        <div className="fixed inset-0 bg-ink-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-lg relative border border-ink-100 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAddHospitalOpen(false)} className="absolute right-6 top-6 text-ink-400 hover:text-ink-500 transition-colors bg-ink-50 p-2 rounded-full"><X size={20} /></button>
            <h2 className="text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Building2 size={24}/></div>
              Register Facility
            </h2>
            
            <form onSubmit={handleCreateHospital} className="space-y-5">
              
              {/* Row 1: Hospital Name */}
              <div>
                <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 block">Hospital Name</label>
                <input required type="text" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" placeholder="E.g. City Care Hospital" value={hospitalForm.name} onChange={(e) => {
                  const val = e.target.value;
                  setHospitalForm({...hospitalForm, name: val, domain: val.toLowerCase().replace(/[^a-z0-9]+/g, '-')});
                }} />
              </div>

              {/* Row 2: Subdomain */}
              <div>
                <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 flex items-center gap-1.5"><Globe size={12}/> Subdomain</label>
                <div className="flex items-center border border-ink-200 rounded-2xl bg-ink-50 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all shadow-inner">
                  <input required type="text" className="w-full p-3.5 bg-transparent font-mono text-sm text-ink-900 outline-none" value={hospitalForm.domain} onChange={(e) => setHospitalForm({...hospitalForm, domain: e.target.value})} />
                  <span className="pr-4 text-ink-400 font-medium text-sm">.vaidyaerp.com</span>
                </div>
              </div>

              {/* 🚀 NEW Row 3: Official Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 flex items-center gap-1.5"><Mail size={12}/> Contact Email</label>
                  <input required type="email" placeholder="admin@hospital.com" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={hospitalForm.email} onChange={(e) => setHospitalForm({...hospitalForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 flex items-center gap-1.5"><Phone size={12}/> Phone Number</label>
                  <input required type="text" placeholder="9876543210" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={hospitalForm.phone} onChange={(e) => setHospitalForm({...hospitalForm, phone: e.target.value})} />
                </div>
              </div>

              {/* Row 4: City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 flex items-center gap-1.5"><MapPin size={12}/> City</label>
                  <input required placeholder="City" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={hospitalForm.city} onChange={(e) => setHospitalForm({...hospitalForm, city: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink-500 uppercase tracking-wide ml-1 mb-2 flex items-center gap-1.5"><MapPin size={12}/> State</label>
                  <input required placeholder="State" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={hospitalForm.state} onChange={(e) => setHospitalForm({...hospitalForm, state: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-bold mt-4 shadow-sm transition-all active:scale-95">
                Complete Setup
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 bg-ink-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-lg relative border border-ink-100 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAddAdminOpen(false)} className="absolute right-6 top-6 text-ink-400 hover:text-ink-500 transition-colors bg-ink-50 p-2 rounded-full"><X size={20} /></button>
            <h2 className="text-2xl font-bold text-ink-900 mb-1 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><UserPlus size={24}/></div>
              Create Admin
            </h2>
            <p className="text-sm font-medium text-ink-500 mb-6 bg-ink-50 p-3 rounded-xl border border-ink-100 mt-4">
              Provisioning access for: <strong className="text-ink-900">{selectedHospital?.name}</strong>
            </p>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <input required placeholder="Full Name" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
              <input required type="email" placeholder="Official Email Address" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} />
              <input required placeholder="Mobile Number" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={adminForm.mobile} onChange={(e) => setAdminForm({...adminForm, mobile: e.target.value})} />
              <input required placeholder="Assign Temporary Password" type="password" className="w-full border border-ink-200 p-3.5 rounded-2xl bg-ink-50 text-ink-900 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold mt-4 shadow-sm transition-all active:scale-95">Send Access Credentials</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
