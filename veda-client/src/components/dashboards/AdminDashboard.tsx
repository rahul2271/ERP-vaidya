"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Users, Wallet, Activity, UserPlus, 
  Shield, Stethoscope, Calendar, Clock, 
  ChevronRight, ArrowUpRight, Bed, AlertCircle,
  ShieldAlert, LockKeyhole, IndianRupee, Database, Trash2, ShieldCheck, Edit, Globe,
  FileSpreadsheet, Mic, Phone, Headphones, Filter,
  Crown, CreditCard, Settings
} from "lucide-react";
import AddStaffModal from "@/components/modals/AddStaffModal";
import FullRosterModal from "@/components/modals/FullRosterModal";
import AddRoomModal from "@/components/modals/AddRoomModal"; 
import NoticeBoard from "@/components/NoticeBoard"; 

// Visual Mapping for Dynamic Log Actions
const getLogStyling = (action: string, module: string) => {
  const act = action?.toUpperCase() || '';
  const mod = module?.toUpperCase() || '';
  if (act.includes('DELETE') || act.includes('REMOVE')) return { icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-100' };
  if (act.includes('EXPORT') || act.includes('DOWNLOAD')) return { icon: Database, color: 'text-secondary-600', bg: 'bg-purple-100' };
  if (act.includes('BILL') || mod === 'BILLING') return { icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-100' };
  if (act.includes('UPDATE') || act.includes('EDIT')) return { icon: Edit, color: 'text-primary-600', bg: 'bg-primary-100' };
  return { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' }; 
};

// 🚀 STRICT REAL-TIME STATUS RESOLVER (Shared with Modal)
export const resolveStaffStatus = (staff: any) => {
  const rawStatus = staff.status || staff.attendanceStatus || 'OFFLINE';
  const statusStr = String(rawStatus).toUpperCase();

  if (['AVAILABLE', 'ONLINE', 'ACTIVE'].includes(statusStr)) {
    return { 
      text: staff.status || staff.attendanceStatus || 'Available', 
      isOnline: true, 
      dotColor: 'bg-emerald-500', 
      textColor: 'text-emerald-500' 
    };
  }
  
  if (['BUSY', 'IN_SESSION', 'IN CABIN'].includes(statusStr)) {
    return { 
      text: staff.status || staff.attendanceStatus || 'Busy', 
      isOnline: true, 
      dotColor: 'bg-amber-500', 
      textColor: 'text-amber-500' 
    };
  }

  return { 
    text: staff.status || staff.attendanceStatus || 'Offline', 
    isOnline: false, 
    dotColor: 'bg-ink-300', 
    textColor: 'text-ink-400' 
  };
};

export default function AdminDashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRosterOpen, setRosterOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false); 
  const [hospitalPlan, setHospitalPlan] = useState("BASIC"); 
  const [subInfo, setSubInfo] = useState<{ subscriptionStatus: string; trialEndsAt: string | null; planRenewsAt: string | null; daysLeft: number } | null>(null);
  
  const [dashboardData, setDashboardData] = useState({
    stats: { totalPatients: 0, revenue: 0, doctorsCount: 0, staffCount: 0 },
    beds: { occupied: 0, total: 50 }
  });

  const [staffList, setStaffList] = useState<any[]>([]); 
  const [appointments, setAppointments] = useState<any[]>([]); 
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [callRecordings, setCallRecordings] = useState<any[]>([]);

  const [filterSource, setFilterSource] = useState("ALL"); 
  const [filterBooker, setFilterBooker] = useState("ALL"); 

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [res, usersRes, apptsRes] = await Promise.all([
        axios.get('/dashboard/admin', config).catch(() => ({ data: null })),
        axios.get('/users', config).catch(() => ({ data: [] })),
        axios.get('/appointments', config).catch(() => ({ data: [] }))
      ]);

      if (res.data) setDashboardData(res.data);
      
      if (usersRes.data) {
        const onlyStaff = usersRes.data.filter((user: any) => user.role?.toUpperCase() !== 'PATIENT');
        setStaffList(onlyStaff);
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const todayAppts = (apptsRes.data || [])
        .filter((a: any) => new Date(a.startTime).toISOString().startsWith(todayStr) && a.status !== 'CANCELLED')
        .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      setAppointments(todayAppts);

      let actualPlan = "BASIC";
      try {
        const planRes = await axios.get('/hospitals/my-plan', config); 
        actualPlan = (planRes.data?.plan || "BASIC").toUpperCase();
        setHospitalPlan(actualPlan);
        setSubInfo(planRes.data);
        localStorage.setItem("hospitalPlan", actualPlan); 
      } catch (e) {
        setHospitalPlan("BASIC");
      }

      if (actualPlan === 'PREMIUM') {
        const logsRes = await axios.get('/audit-logs', config).catch(() => ({ data: [] }));
        setAuditLogs(logsRes.data);
        const callsRes = await axios.get('/calls/recordings/all', config).catch(() => ({ data: [] }));
        setCallRecordings(callsRes.data);
      }
    } catch (err) { 
      console.error("Failed to fetch dashboard data", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchDashboardData(); 
  }, []);

  const handleExportLogs = () => {
    if (!auditLogs || auditLogs.length === 0) return alert("No logs available to export.");

    const headers = ["Date", "Time", "Action", "Module", "User", "Role", "IP Address", "Details"];
    const rows = auditLogs.map(log => {
      const dateObj = new Date(log.createdAt);
      return [
        dateObj.toLocaleDateString(), dateObj.toLocaleTimeString(), log.action, log.module || "SYSTEM",
        log.userId?.name || "System", log.userId?.role || "AUTO", log.ipAddress || "Unknown",
        `"${(log.details || "").replace(/"/g, '""')}"` 
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VAIDYA_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const stats = [
    { title: "Today's Revenue", value: `₹${(dashboardData?.stats?.revenue || 0).toLocaleString()}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Live" },
    { title: "Active Patients", value: dashboardData?.stats?.totalPatients || 0, icon: Users, color: "text-primary-600", bg: "bg-primary-50", trend: "Total" },
    { title: "Available Doctors", value: dashboardData?.stats?.doctorsCount || 0, icon: Stethoscope, color: "text-secondary-600", bg: "bg-secondary-50", trend: "On Duty" },
    { title: "Support Staff", value: dashboardData?.stats?.staffCount || 0, icon: Shield, color: "text-amber-600", bg: "bg-amber-50", trend: "Active" },
  ];

  const uniqueBookers = Array.from(new Map(appointments.filter(a => a.bookedById).map(a => [a.bookedById._id, a.bookedById])).values());

  const filteredAppointments = appointments.filter(apt => {
    const isLead = apt.bookingNotes?.includes("CALL");
    const matchSource = filterSource === "ALL" || (filterSource === "LEAD" && isLead) || (filterSource === "DIRECT" && !isLead);
    const matchBooker = filterBooker === "ALL" || apt.bookedById?._id === filterBooker;
    return matchSource && matchBooker;
  });

  const sortedStaffList = [...staffList].sort((a, b) => {
    const aOnline = resolveStaffStatus(a).isOnline;
    const bOnline = resolveStaffStatus(b).isOnline;
    if (aOnline === bOnline) return 0;
    return aOnline ? -1 : 1;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#F6F9F8] min-h-screen">
        <div className="h-24 bg-ink-100 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-ink-100 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-ink-100 rounded-2xl"></div>
          <div className="space-y-8">
            <div className="h-64 bg-ink-100 rounded-2xl"></div>
            <div className="h-40 bg-ink-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9F8] p-4 md:p-8 space-y-8 text-ink-900 pb-10">
      <AddStaffModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchDashboardData} />
      <AddRoomModal isOpen={isRoomModalOpen} onClose={() => setRoomModalOpen(false)} onSuccess={fetchDashboardData} />
      
      {/* 🚀 SYNCHRONIZED MODAL */}
      <FullRosterModal 
        isOpen={isRosterOpen} 
        onClose={() => setRosterOpen(false)} 
        staffList={staffList} 
        onStatusUpdate={(userId, newStatus) => {
          setStaffList(prev => prev.map(s => 
            s._id === userId ? { ...s, status: newStatus, attendanceStatus: newStatus } : s
          ));
        }}
        onSuccess={fetchDashboardData} 
      />
      
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r text-ink-900 flex items-center gap-3">
            Command Center <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase border border-sky-200 shadow-sm">Admin</span>
          </h1>
          <p className="text-ink-500 font-medium text-sm mt-1">Real-time overview of your facility's operations and security.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="p-3 bg-ink-50 hover:bg-ink-100 text-ink-500 transition-all rounded-2xl border border-ink-200 shadow-sm active:scale-95" title="System Settings">
            <Settings size={18} strokeWidth={2.5} />
          </button>
          <button onClick={() => setRoomModalOpen(true)} className="px-5 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all rounded-2xl font-bold flex items-center gap-2 text-sm border border-sky-100 shadow-sm active:scale-95">
            <Bed size={18} strokeWidth={2.5} /> Add Room
          </button>
          <button onClick={() => setModalOpen(true)} className="px-5 py-3 bg-sky-600 hover:bg-sky-700 transition-all text-white rounded-2xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-sky-200 active:scale-95">
            <UserPlus size={18} strokeWidth={2.5} /> Add Staff
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5 group">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-ink-900 tracking-tight">{stat.value}</h3>
              <span className="text-[11px] font-bold text-emerald-500 flex items-center mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight size={12} className="mr-1" strokeWidth={3}/> {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-ink-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-6 md:p-8 border-b border-ink-100 bg-ink-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-xl font-bold text-ink-900 flex items-center gap-3">
                <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl shadow-inner"><Calendar size={20} strokeWidth={2.5}/></div>
                Today's Operations
                <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ml-2">
                  {filteredAppointments.length} Appts
                </span>
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-ink-200 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-ink-500">
                  <Filter size={14} className="text-ink-400 mr-2" />
                  <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="bg-transparent outline-none cursor-pointer border-r border-ink-200 pr-2 mr-2">
                    <option value="ALL">All Sources</option>
                    <option value="LEAD">Lead Conversions</option>
                    <option value="DIRECT">Direct Bookings</option>
                  </select>
                  <select value={filterBooker} onChange={(e) => setFilterBooker(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                    <option value="ALL">All Staff</option>
                    {uniqueBookers.map((user: any) => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-0 overflow-x-auto custom-scrollbar max-h-[400px]">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-ink-400">
                  <div className="h-20 w-20 bg-ink-50 rounded-full flex items-center justify-center mb-4 border border-ink-100">
                    <Calendar size={32} className="text-ink-300" />
                  </div>
                  <p className="font-bold text-ink-500">No appointments scheduled today.</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-ink-400">
                  <p className="font-bold text-ink-500">No appointments match your filters.</p>
                  <button onClick={() => { setFilterSource('ALL'); setFilterBooker('ALL'); }} className="text-xs font-bold text-sky-500 mt-2 hover:underline">Clear Filters</button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-ink-50 shadow-sm z-10">
                    <tr className="text-[10px] uppercase tracking-wide text-ink-400 font-bold border-b border-ink-100">
                      <th className="p-5 pl-8">Time</th>
                      <th className="p-5">Patient & Provider</th>
                      <th className="p-5">Booked By (Source)</th>
                      <th className="p-5">Financials (Revenue)</th>
                      <th className="p-5 pr-8 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {filteredAppointments.map((apt: any, idx: number) => {
                      const isLeadConversion = apt.bookingNotes?.includes("CALL");
                      const isPaid = apt.paymentStatus?.toUpperCase() === 'PAID';
                      const revenue = apt.finalBilledAmount || apt.amount || 0;
                      
                      return (
                        <tr key={idx} className="hover:bg-ink-50/80 transition-colors group">
                          <td className="p-5 pl-8 font-bold text-ink-500 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-ink-400 group-hover:text-sky-500 transition-colors"/> 
                              {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="p-5">
                            <p className="font-bold text-ink-900 text-sm">{apt.patientId?.name || "Unknown Patient"}</p>
                            <p className="text-[10px] text-ink-500 font-bold uppercase tracking-wide mt-0.5 flex items-center gap-1">
                              <Stethoscope size={10}/> Dr. {apt.doctorId?.name || "Unassigned"}
                            </p>
                          </td>
                          <td className="p-5">
                            {apt.bookedById ? (
                              <div>
                                <p className="font-bold text-sky-600 text-xs flex items-center gap-1.5"><Users size={12}/> {apt.bookedById.name}</p>
                                <span className={`mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter ${isLeadConversion ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-emerald-100 border-emerald-200 text-emerald-700'}`}>
                                  {isLeadConversion ? 'Lead Conversion' : 'Direct Booking'}
                                </span>
                              </div>
                            ) : (<span className="text-xs text-ink-400 italic">Self / Online</span>)}
                          </td>
                          <td className="p-5">
                            {revenue > 0 ? (
                              <div>
                                <p className="font-bold text-ink-900 text-sm flex items-center gap-1">
                                  ₹{revenue.toLocaleString('en-IN')}
                                </p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mt-1 inline-block border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                  {isPaid ? 'Paid' : 'Due'}
                                </span>
                              </div>
                            ) : (<span className="text-xs font-bold text-ink-400">--</span>)}
                          </td>
                          <td className="p-5 pr-8 text-right">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border shadow-sm ${
                              apt.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              apt.status === 'IN_PROGRESS' ? 'bg-primary-50 text-primary-700 border-primary-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* GLOBAL CALL MONITOR (GOD MODE) */}
          <div className="bg-white rounded-[2.5rem] border border-ink-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative h-[450px] flex flex-col">
            {hospitalPlan === 'BASIC' && (
              <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-primary-700/5 flex flex-col items-center justify-center p-6 text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 text-ink-900 border border-ink-100">
                   <LockKeyhole size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-ink-900 mb-2 tracking-tight">Call Monitor Locked</h3>
                 <p className="text-ink-500 font-medium max-w-sm mb-6 text-sm">Upgrade to Premium to listen to live telecaller recordings and track communication quality.</p>
                 <button onClick={() => window.open('https://wa.me/917009646377', '_blank')} className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:-translate-y-1 hover:shadow-slate-900/30 transition-all active:scale-95 flex items-center gap-2">
                   Upgrade to Premium <ArrowUpRight size={16}/>
                 </button>
              </div>
            )}
            <div className="p-6 md:p-8 border-b border-ink-100 flex justify-between items-center bg-ink-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shadow-md border border-rose-100"><Headphones size={20} /></div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 tracking-tight">Global Call Monitor</h2>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mt-0.5">Live Telecaller Feed</p>
                </div>
              </div>
            </div>
            <div className={`flex-1 overflow-auto custom-scrollbar ${hospitalPlan === 'BASIC' ? 'blur-sm select-none overflow-hidden' : ''}`}>
              {callRecordings.length > 0 ? (
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                  <thead className="bg-ink-50/80 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
                    <tr className="text-[10px] uppercase tracking-wide text-ink-400 font-bold border-b border-ink-200">
                      <th className="p-4 pl-8">Date & Time</th>
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Dialed Number</th>
                      <th className="p-4 pr-8">Audio Recording</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {callRecordings.map((rec, index) => (
                      <tr key={index} className="hover:bg-ink-50/50 transition-colors group">
                        <td className="p-4 pl-8">
                          <p className="text-xs font-bold text-ink-600">{new Date(rec.createdAt).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-ink-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {new Date(rec.createdAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {rec.userId?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-ink-900">{rec.userId?.name || 'Unknown'}</p>
                              <p className="text-[9px] font-bold text-ink-400 uppercase tracking-wide">{rec.userId?.role || 'Staff'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-ink-500 flex items-center gap-1.5"><Phone size={12} className="text-ink-400" /> {rec.targetId}</p>
                        </td>
                        <td className="p-4 pr-8 w-[250px]">
                          <audio controls className="w-full h-8 outline-none"><source src={`${rec.details}.mp3`} type="audio/mpeg" /></audio>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-ink-400 py-10">
                  <Mic size={40} className="mb-3 opacity-30"/>
                  <p className="font-bold text-sm">No calls recorded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* 🛡️ SECURITY AUDIT TABLE */}
          <div className="bg-white rounded-[2.5rem] border border-ink-100 shadow-sm overflow-hidden relative h-[500px] flex flex-col">
            {hospitalPlan === 'BASIC' && (
              <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-primary-700/5 flex flex-col items-center justify-center p-6 text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 text-ink-900 border border-ink-100">
                   <LockKeyhole size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-ink-900 mb-2 tracking-tight">Security Audit Locked</h3>
                 <p className="text-ink-500 font-medium max-w-sm mb-6 text-sm">Upgrade to Premium to unlock Advanced Audit Logs. Trace exactly who edits bills or exports data.</p>
                 <button onClick={() => window.open('https://wa.me/917009646377', '_blank')} className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:-translate-y-1 hover:shadow-slate-900/30 transition-all active:scale-95 flex items-center gap-2">
                   Upgrade to Premium <ArrowUpRight size={16}/>
                 </button>
              </div>
            )}
            <div className="p-6 md:p-8 border-b border-ink-100 flex justify-between items-center bg-ink-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-700 text-white rounded-xl shadow-md"><ShieldAlert size={20} /></div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 tracking-tight">Security Audit Log</h2>
                  <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wide mt-0.5">Real-Time Threat Tracking</p>
                </div>
              </div>
              <button onClick={handleExportLogs} disabled={hospitalPlan === 'BASIC' || auditLogs.length === 0} className="text-sm font-bold text-ink-500 bg-white border border-ink-200 px-4 py-2 rounded-lg shadow-sm hover:bg-ink-50 disabled:opacity-50 transition-all flex items-center gap-2">
                <FileSpreadsheet size={16}/> Export CSV
              </button>
            </div>
            <div className={`flex-1 overflow-auto custom-scrollbar ${hospitalPlan === 'BASIC' ? 'blur-sm select-none overflow-hidden' : ''}`}>
              {auditLogs.length > 0 ? (
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                  <thead className="bg-ink-50/80 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
                    <tr className="text-[10px] uppercase tracking-wide text-ink-400 font-bold border-b border-ink-200">
                      <th className="p-4 pl-8">Timestamp</th>
                      <th className="p-4">Staff Member</th>
                      <th className="p-4 text-center">Event Type</th>
                      <th className="p-4">Origin (IP)</th>
                      <th className="p-4 pr-8">Activity Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {auditLogs.map((log) => {
                      const style = getLogStyling(log.action, log.module);
                      return (
                        <tr key={log._id} className="hover:bg-ink-50/50 transition-colors group">
                          <td className="p-4 pl-8">
                            <p className="text-xs font-bold text-ink-600">{new Date(log.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] font-bold text-ink-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-ink-100 border border-ink-200 flex items-center justify-center text-xs font-bold text-ink-500 shrink-0">
                                {log.userId?.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-ink-900">{log.userId?.name || "System"}</p>
                                <p className="text-[9px] font-bold text-sky-500 uppercase">{log.userId?.role || log.module}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${style.bg} ${style.color} text-[10px] font-bold uppercase tracking-tight`}>
                              <style.icon size={12} strokeWidth={3} /> {log.action?.replace(/_/g, ' ')}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-400">
                              <Globe size={12} className="text-ink-300"/> {log.ipAddress || 'Unknown'}
                            </div>
                          </td>
                          <td className="p-4 pr-8">
                            <p className="text-xs text-ink-500 font-medium max-w-[250px] truncate" title={log.details}>{log.details}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-ink-400 py-10">
                  <ShieldCheck size={40} className="mb-3 opacity-30"/>
                  <p className="font-bold text-sm">No security events logged recently.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <NoticeBoard />

          {/* SaaS Plan & Subscription Widget */}
          <div className={`rounded-2xl p-6 relative overflow-hidden border ${hospitalPlan === 'PREMIUM' ? 'bg-gradient-to-br from-primary-800 to-ink-900 border-primary-700 text-white shadow-xl shadow-sky-900/20' : 'bg-white border-ink-200 text-ink-900 shadow-sm'}`}>
             {hospitalPlan === 'PREMIUM' && <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl -z-10"></div>}
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                   <p className={`text-[10px] font-bold uppercase tracking-wide ${hospitalPlan === 'PREMIUM' ? 'text-sky-400' : 'text-ink-400'}`}>Current Plan</p>
                   <h3 className="text-2xl font-bold mt-1 flex items-center gap-2">
                     {hospitalPlan === 'PREMIUM' ? <Crown size={24} className="text-amber-400"/> : <CreditCard size={24} className="text-ink-500"/>}
                     {hospitalPlan} License
                   </h3>
                </div>
                {subInfo?.subscriptionStatus === 'TRIALING' ? (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wide">Trial</span>
                ) : hospitalPlan === 'PREMIUM' && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wide">Active</span>
                )}
             </div>

             {subInfo?.subscriptionStatus === 'TRIALING' ? (
                <div className="mt-4 border-t border-sky-800/50 pt-4">
                   <p className="text-xs text-sky-200 font-medium flex justify-between">
                     <span>Trial ends:</span>
                     <span className="text-white font-bold">
                       {subInfo.trialEndsAt ? new Date(subInfo.trialEndsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                       {typeof subInfo.daysLeft === 'number' ? ` (${subInfo.daysLeft}d left)` : ''}
                     </span>
                   </p>
                   <a href="/dashboard/upgrade" className="mt-4 w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2">
                     <Crown size={16}/> Upgrade before trial ends
                   </a>
                </div>
             ) : hospitalPlan === 'BASIC' ? (
                <div className="mt-4">
                   <p className="text-sm text-ink-500 font-medium mb-4">Upgrade to Premium to unlock Call Recording, God Mode Audits, and automated Telecalling CRM.</p>
                   <a href="/dashboard/upgrade" className="w-full bg-primary-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors shadow-md flex items-center justify-center gap-2">
                     <Crown size={16}/> Upgrade License
                   </a>
                </div>
             ) : (
                <div className="mt-4 border-t border-sky-800/50 pt-4">
                   <p className="text-xs text-sky-200 font-medium flex justify-between">
                     <span>Next billing date:</span>
                     <span className="text-white font-bold">
                       {subInfo?.planRenewsAt ? new Date(subInfo.planRenewsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'}
                     </span>
                   </p>
                   <p className="text-xs text-sky-200 font-medium flex justify-between mt-2"><span>Support SLA:</span> <span className="text-white font-bold text-emerald-400">24/7 Priority</span></p>
                </div>
             )}
          </div>

          {/* 🚀 LIVE STAFF ROSTER WIDGET */}
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={18} strokeWidth={2.5}/></div>
                Staff Roster (Live)
              </h2>
            </div>
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
              {sortedStaffList.length > 0 ? (
                sortedStaffList.map((staff: any, idx: number) => {
                  const statusInfo = resolveStaffStatus(staff);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-ink-50 border border-transparent hover:border-ink-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-bold text-sm shadow-inner ${
                          staff.role?.toUpperCase() === 'TELECALLER' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                          staff.role?.toUpperCase() === 'DOCTOR' ? 'bg-sky-50 border-sky-100 text-sky-600' :
                          'bg-ink-50 border-ink-200 text-ink-500'
                        }`}>
                          {staff.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-ink-900 text-sm leading-tight">{staff.name}</p>
                          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mt-0.5">{staff.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wide ${statusInfo.textColor}`}>
                          {statusInfo.text}
                        </span>
                        <div className="relative flex h-3 w-3">
                          {statusInfo.isOnline && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusInfo.dotColor} opacity-75`}></span>}
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${statusInfo.dotColor}`}></span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-10 text-ink-400">
                  <p className="text-xs font-bold bg-ink-50 py-2 px-4 rounded-xl border border-ink-100 inline-block">No staff found.</p>
                </div>
              )}
            </div>
            
            <button onClick={() => setRosterOpen(true)} className="w-full mt-4 py-3 bg-ink-50 hover:bg-ink-100 text-ink-500 rounded-2xl font-bold text-xs transition-colors border border-ink-100">
              View Full Roster Matrix
            </button>
          </div>

          {/* Infrastructure Stats */}
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-primary-900 rounded-2xl shadow-xl shadow-ink-900/10 p-7 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-white/5 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
              <Bed size={140} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-ink-300 mb-1 flex items-center gap-2">
                Ward Capacity <AlertCircle size={14} className="text-sky-400" />
            </h3>
            {dashboardData.beds.total > 0 ? (
              <>
                <p className="text-4xl font-bold mb-8 mt-2 tracking-tight">
                  {dashboardData.beds.occupied} / {dashboardData.beds.total} 
                  <span className="text-sm font-medium text-ink-400 ml-2 block mt-1">Beds Occupied</span>
                </p>
                <div className="w-full bg-ink-700/50 rounded-full h-3 mb-2 overflow-hidden backdrop-blur-sm border border-ink-600/50">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-primary-400 h-full rounded-full transition-all duration-1000 relative" 
                    style={{ width: `${(dashboardData.beds.occupied / dashboardData.beds.total) * 100}%` }}
                  >
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)' , backgroundSize: '1rem 1rem'}}></div>
                  </div>
                </div>
                <p className="text-[11px] text-ink-300 font-bold tracking-wide text-right uppercase">
                  {Math.round((dashboardData.beds.occupied / dashboardData.beds.total) * 100)}% Capacity
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-300 mt-4">No rooms configured yet. Add rooms under Clinic Settings to see live occupancy here.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}