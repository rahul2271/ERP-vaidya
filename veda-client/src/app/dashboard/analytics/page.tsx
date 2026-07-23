"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  TrendingUp, Users, Calendar, IndianRupee, 
  Lock, Sparkles, BarChart3, PieChart, Activity, 
  ArrowUpRight, ArrowDownRight, Award
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AnalyticsDashboard() {
  const [hospitalPlan, setHospitalPlan] = useState<string>("BASIC");
  const [loading, setLoading] = useState(true);
  const [clinicName, setClinicName] = useState("Our Clinic");

  // 🚀 DYNAMIC DATA STATES
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { todayPatients: 0, todayRevenue: 0, upcomingAppts: 0, monthlyGrowth: 0 },
    revenueTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    topDoctors: [],
    topTherapies: []
  });

  useEffect(() => {
    const storedName = localStorage.getItem("hospitalName");
    if (storedName) setClinicName(storedName);
    
    fetchHospitalPlan();
    fetchAnalyticsData(); // 🚀 Fetch live numbers!
  }, []);

  const fetchHospitalPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/hospitals/my-plan", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.plan) setHospitalPlan(res.data.plan);
    } catch (error) {
      console.error("Failed to fetch plan", error);
    }
  };

  // 🚀 FETCH THE REAL DATA FROM THE BACKEND
  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/appointments/analytics/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
      toast.error("Failed to sync live data.");
    } finally {
      setLoading(false);
    }
  };

  const isPremium = hospitalPlan === "PREMIUM";

  const handleUpgradeClick = () => {
    const message = `Hello VAIDYA ERP Sales! We want to upgrade *${clinicName}* to the PREMIUM plan to unlock Advanced Analytics.`;
    window.open(`https://wa.me/917009646377?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Premium Gate Wrapper Component
  const PremiumGate = ({ children, title }: { children: React.ReactNode, title: string }) => {
    if (isPremium) return <>{children}</>;
    
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm group">
        <div className="filter blur-[6px] opacity-40 pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-[2px] p-6 text-center">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-amber-100 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2 tracking-tight">Unlock {title}</h3>
          <p className="text-xs font-bold text-slate-500 mb-6 max-w-[250px]">
            Upgrade to the Premium Plan to access deep business insights and growth metrics.
          </p>
          <button 
            onClick={handleUpgradeClick}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Sparkles size={14} /> Upgrade Now
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-10 flex justify-center text-slate-400 font-bold animate-pulse tracking-widest uppercase mt-20">Syncing Live Data...</div>;

  // Dynamic calculations for the chart scaling
  const maxRevenue = Math.max(...(dashboardData.revenueTrend as number[]), 1);
  const colors = ["bg-purple-500", "bg-sky-500", "bg-primary-400", "bg-slate-300"];
  const docColors = ["text-amber-600 bg-amber-50", "text-slate-600 bg-slate-100", "text-orange-700 bg-orange-50"];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-1.5 bg-primary-50 text-primary-600 rounded-xl"><BarChart3 size={24} strokeWidth={2.5}/></div>
              Command Center
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-12">Live performance overview for {clinicName}.</p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 ${
            isPremium ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            {isPremium && <Sparkles size={14} className="text-amber-500"/>}
            {hospitalPlan} TIER
          </div>
        </div>

        {/* 1. BASIC KPIS (Live Data) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><IndianRupee size={20} strokeWidth={2.5}/></div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
            <h3 className="text-3xl font-black text-slate-800">₹{dashboardData.stats.todayRevenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><Users size={20} strokeWidth={2.5}/></div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Footfall Today</p>
            <h3 className="text-3xl font-black text-slate-800">{dashboardData.stats.todayPatients}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Calendar size={20} strokeWidth={2.5}/></div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Appointments</p>
            <h3 className="text-3xl font-black text-slate-800">{dashboardData.stats.upcomingAppts}</h3>
          </div>

          <PremiumGate title="Growth Metrics">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-800 shadow-sm hover:shadow-md transition-shadow text-white h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30"><TrendingUp size={20} strokeWidth={2.5}/></div>
                <span className="flex items-center text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg tracking-widest"><ArrowUpRight size={12} className="mr-1"/> Up</span>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">M-o-M Revenue Growth</p>
              <h3 className="text-3xl font-black text-emerald-400">+{dashboardData.stats.monthlyGrowth}%</h3>
            </div>
          </PremiumGate>
        </div>

        {/* 2. ADVANCED CHARTS (Premium Only) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Trend Chart (Dynamic) */}
          <div className="lg:col-span-2">
            <PremiumGate title="Revenue Forecasting">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={18} className="text-primary-500"/> 30-Day Revenue Trend
                  </h3>
                </div>
                
                <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-6">
                  {dashboardData.revenueTrend.map((amount: number, i: number) => {
                    const heightPercent = maxRevenue > 0 ? (amount / maxRevenue) * 100 : 0;
                    return (
                      <div key={i} className="w-full flex flex-col items-center gap-2 group">
                        <div className="w-full relative bg-slate-50 rounded-t-lg h-full flex items-end justify-center">
                          <div 
                            className="w-full bg-primary-500 rounded-t-lg group-hover:bg-sky-500 transition-colors" 
                            style={{ height: `${heightPercent}%`, minHeight: amount > 0 ? '5%' : '0%' }}
                          ></div>
                          <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            ₹{amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </PremiumGate>
          </div>

          {/* Doctor Leaderboard & Therapy Stats (Dynamic) */}
          <div className="space-y-8">
            
            {/* Top Doctors */}
            <PremiumGate title="Doctor Performance">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <Award size={16} className="text-amber-500"/> Top Performing Doctors
                </h3>
                <div className="space-y-4">
                  {dashboardData.topDoctors.length > 0 ? dashboardData.topDoctors.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${docColors[i] || "text-slate-600 bg-slate-100"}`}>
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest">{doc.patients} Consultations</p>
                        </div>
                      </div>
                      <p className="font-black text-sm text-emerald-600">₹{doc.revenue.toLocaleString()}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 font-bold text-center py-4">No data available yet.</p>
                  )}
                </div>
              </div>
            </PremiumGate>

            {/* Popular Therapies */}
            <PremiumGate title="Therapy Insights">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <PieChart size={16} className="text-purple-500"/> Most Billed Therapies
                </h3>
                <div className="space-y-4">
                  {dashboardData.topTherapies.length > 0 ? dashboardData.topTherapies.map((t: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                        <span>{t.name}</span>
                        <span>{t.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`${colors[i] || 'bg-slate-300'} h-2 rounded-full`} style={{ width: `${t.percent}%` }}></div>
                      </div>
                    </div>
                  )) : (
                     <p className="text-sm text-slate-400 font-bold text-center py-4">No treatments recorded yet.</p>
                  )}
                </div>
              </div>
            </PremiumGate>

          </div>
        </div>

      </div>
    </div>
  );
}