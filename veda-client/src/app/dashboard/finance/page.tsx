"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Users, 
  IndianRupee, 
  BarChart3, 
  Calendar as CalendarIcon,
  Download,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function FinanceDashboard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample data for the chart - In production, fetch this from an API endpoint like /revenue/trend
  const chartData = [
    { name: 'Mon', revenue: 4500 },
    { name: 'Tue', revenue: 6000 },
    { name: 'Wed', revenue: 7500 },
    { name: 'Thu', revenue: 4000 },
    { name: 'Fri', revenue: 9000 },
    { name: 'Sat', revenue: 10500 },
    { name: 'Sun', revenue: 8000 },
  ];

  useEffect(() => {
    fetchFinancialData();
  }, [selectedDate]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/revenue/daily?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch financial data", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Premium Skeleton Loader
  if (loading && !report) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-16 bg-slate-200 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
        </div>
        <div className="h-80 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee size={22} strokeWidth={3}/></div>
              Financial Overview
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 ml-14">Track revenue and session volume for Yukti Herbs.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner group">
            <CalendarIcon size={18} className="text-slate-400 ml-2 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none text-sm font-bold text-slate-700 p-1 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-emerald-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner border border-emerald-100">
                <IndianRupee size={24} strokeWidth={2.5}/>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm">+12.5%</span>
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Total Revenue</p>
              <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">{loading ? "..." : report?.totalRevenue || "₹0"}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-sky-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-sky-100 transition-colors duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shadow-inner border border-sky-100">
                <Users size={24} strokeWidth={2.5}/>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Completed Sessions</p>
              <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">{loading ? "..." : report?.completedSessions || "0"}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-orange-50 w-24 h-24 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shadow-inner border border-orange-100">
                <TrendingUp size={24} strokeWidth={2.5}/>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-black mt-5 uppercase tracking-widest">Avg. Per Patient</p>
              <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">₹1,500</h2>
            </div>
          </div>
        </div>

        {/* 🚀 LIVE REVENUE CHART */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-sky-500" strokeWidth={2.5} /> Performance Analysis
            </h3>
            <span className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">Last 7 Days</span>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickFormatter={(value) => `₹${value}`} dx={-10} />
                
                {/* 🚀 THE FIX: Changed to (value: any) and safely coerced to Number */}
                <Tooltip 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1e293b'}} 
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK SUMMARY ALERT */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
          
          <div className="relative z-10">
            <h4 className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
               <AlertCircle size={20} className="text-emerald-400"/> Billing Accuracy Alert
            </h4>
            <p className="text-slate-400 text-sm mt-2 font-medium">All completed sessions shown above are automatically calculated based on the standard ₹1,500 consultation rate.</p>
          </div>
          
          <button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all relative z-10 flex items-center justify-center gap-2">
            <Download size={18} strokeWidth={3}/> Generate CSV Report
          </button>
        </div>

      </div>
    </div>
  );
}