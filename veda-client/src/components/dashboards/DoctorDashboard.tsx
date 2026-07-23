"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Users, Calendar, Activity, Clock, FileText, CheckCircle2, UserCheck,
  ChevronLeft, ChevronRight, MapPin, Video, Phone, ListTodo, Plus, Trash2, CheckSquare, Square,
  Building2, Globe, Sparkles, ArrowUpRight, Leaf 
} from "lucide-react";
import Link from "next/link";
import NoticeBoard from "@/components/NoticeBoard"; // 🚀 Imported the new Notice Board!

export default function DoctorConsole() {
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState({ patients: 0, visits: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [activeTab, setActiveTab] = useState<'OPD' | 'TELECONSULT'>('OPD');

  // 🚀 DATABASE-CONNECTED TASK LOGIC
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  // 1. Fetch tasks from MongoDB when component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks from DB", err);
    }
  };

  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [reportsRes, queueRes, statsRes] = await Promise.all([
        axios.get("/reports/pending", config).catch(() => ({ data: [] })),
        axios.get(`/appointments/day/${selectedDate}`, config).catch(() => ({ data: [] })),
        axios.get("/users/stats", config).catch(() => ({ data: { patients: 0, visits: 0 } }))
      ]);

      setPendingReports(reportsRes.data);
      
      const liveQueue = (queueRes.data || []).sort((a: any, b: any) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      
      setQueue(liveQueue);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Dashboard sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // 🚀 POST NEW TASK TO DB
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/tasks", { text: newTask }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Add the new task directly from the database to the UI
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to save task to DB", err);
    }
  };

  // 🚀 PATCH STATUS TO DB
  const toggleTask = async (id: string) => {
    // Optimistic UI update for instant click feel
    setTasks(tasks.map(t => t._id === id ? { ...t, done: !t.done } : t));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/tasks/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to update task status in DB", err);
      fetchTasks(); // Revert UI if the API call fails
    }
  };

  // 🚀 DELETE FROM DB
  const deleteTask = async (id: string) => {
    // Optimistic UI update
    setTasks(tasks.filter(t => t._id !== id));
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to delete task from DB", err);
      fetchTasks(); // Revert UI if the API call fails
    }
  };

  const opdQueue = queue.filter(a => a.mode === 'IN_PERSON' || !a.mode);
  const teleQueue = queue.filter(a => a.mode === 'ONLINE' || a.mode === 'VIDEO_CALL' || a.mode === 'AUDIO_CALL');
  
  const displayQueue = activeTab === 'OPD' ? opdQueue : teleQueue;

  // Premium Skeleton Loader
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#F6F9F8] min-h-screen">
        <div className="h-24 bg-ink-100 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-ink-100 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-ink-100 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-64 bg-ink-100 rounded-2xl"></div>
            <div className="h-64 bg-ink-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9F8] p-4 md:p-8 space-y-8 text-ink-900 pb-10">
      
      {/* HEADER: Elegant Gradients and Polished Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-ink-100 shadow-sm transition-all hover:shadow-md">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r text-ink-900 flex items-center gap-3">
            Doctor's Console
          </h1>
          <div className="flex items-center gap-2 mt-2 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-emerald-700 font-bold text-[11px] tracking-wide uppercase">Live Sync Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-ink-50 p-1.5 rounded-2xl border border-ink-200 shadow-inner">
           <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-ink-500 hover:text-sky-600 active:scale-95"><ChevronLeft size={20} strokeWidth={2.5}/></button>
           <div className="px-4 text-center min-w-[140px]">
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wide mb-0.5">Schedule For</p>
              <p className="text-sm font-bold text-ink-900">{new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
           </div>
           <button onClick={() => changeDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-ink-500 hover:text-sky-600 active:scale-95"><ChevronRight size={20} strokeWidth={2.5}/></button>
        </div>
      </div>

      {/* METRICS ROW: Subtle lifts and beautiful colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Patients", value: stats.patients, icon: Users, color: "text-primary-600", bg: "bg-primary-50" },
          { title: "Offline OPD Visits", value: opdQueue.length, icon: Calendar, color: "text-sky-600", bg: "bg-sky-50" },
          { title: "Teleconsultations", value: teleQueue.length, icon: Globe, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5 group">
             <div className={`h-14 w-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon size={26} strokeWidth={2.5}/>
             </div>
             <div>
               <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mb-1">{stat.title}</p>
               <h2 className="text-3xl font-bold text-ink-900 tracking-tight">{stat.value}</h2>
             </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: TIMELINE WITH SEGMENTED CONTROL TABS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            
            {/* iOS-Style Segmented Tabs */}
            <div className="p-5 border-b border-ink-100 flex flex-col sm:flex-row justify-between items-center bg-ink-50/50 gap-4">
               <h3 className="font-bold text-ink-900 flex items-center gap-2 px-2">
                 <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><Clock size={18} strokeWidth={2.5}/></div>
                 Appointment Timeline
               </h3>
               
               <div className="flex bg-ink-100/60 p-1.5 rounded-2xl w-full sm:w-auto shadow-inner">
                 <button 
                   onClick={() => setActiveTab('OPD')}
                   className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wide rounded-xl transition-all duration-300 ${activeTab === 'OPD' ? 'bg-white text-sky-700 shadow-sm scale-100' : 'text-ink-500 hover:text-ink-600 scale-95 hover:scale-100'}`}
                 >
                   <Building2 size={16}/> Offline OPD
                   {opdQueue.length > 0 && <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-[10px]">{opdQueue.length}</span>}
                 </button>
                 <button 
                   onClick={() => setActiveTab('TELECONSULT')}
                   className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wide rounded-xl transition-all duration-300 ${activeTab === 'TELECONSULT' ? 'bg-white text-purple-700 shadow-sm scale-100' : 'text-ink-500 hover:text-ink-600 scale-95 hover:scale-100'}`}
                 >
                   <Globe size={16}/> Online Calls
                   {teleQueue.length > 0 && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px]">{teleQueue.length}</span>}
                 </button>
               </div>
            </div>

            {/* TIMELINE LIST */}
            <div className="p-6 md:p-8">
              {displayQueue.length > 0 ? (
                <div className="relative border-l-2 border-ink-100/80 ml-4 space-y-10">
                  {displayQueue.map((appt) => {
                    const isVideo = appt.bookingNotes?.includes('[VIDEO CALL]') || appt.mode === 'VIDEO_CALL';
                    const isAudio = appt.bookingNotes?.includes('[AUDIO CALL]') || appt.mode === 'AUDIO_CALL';

                    // 🚀 NEW: Check for Prakriti Scores
                    const scores = appt.patientId?.prakritiScores;
                    let dominantDosha = null;
                    if (scores && (scores.vata > 0 || scores.pitta > 0 || scores.kapha > 0)) {
                      const doshas = [
                        { name: "Vata", value: scores.vata, color: "text-primary-700 bg-primary-100/80 border-primary-200/50" },
                        { name: "Pitta", value: scores.pitta, color: "text-orange-700 bg-orange-100/80 border-orange-200/50" },
                        { name: "Kapha", value: scores.kapha, color: "text-emerald-700 bg-emerald-100/80 border-emerald-200/50" },
                      ];
                      dominantDosha = doshas.reduce((prev, current) => (prev.value > current.value ? prev : current));
                    }

                    return (
                    <div key={appt._id} className="relative pl-8 group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[11px] top-6 h-5 w-5 rounded-full border-4 border-white shadow-sm transition-colors duration-300 ${appt.status === 'COMPLETED' ? 'bg-emerald-400' : isVideo ? 'bg-secondary-500' : isAudio ? 'bg-amber-400' : 'bg-sky-500'}`}></div>
                      
                      {/* Appointment Card */}
                      <div className={`border p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-md flex flex-col gap-4 ${
                          isVideo ? 'bg-secondary-50/40 border-purple-100 hover:border-purple-300 hover:bg-secondary-50' :
                          isAudio ? 'bg-amber-50/40 border-amber-100 hover:border-amber-300 hover:bg-amber-50' :
                          'bg-ink-50/50 border-ink-100 hover:border-ink-200 hover:bg-white'
                      }`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          
                          <div className="flex items-center gap-5">
                             <div className="text-center min-w-[70px]">
                                <p className="text-lg font-bold text-ink-900">{new Date(appt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide mt-0.5">Time</p>
                             </div>
                             <div className="h-12 w-[2px] bg-ink-100/60 hidden md:block rounded-full"></div>
                             <div>
                                <Link href={`/dashboard/patients/${appt.patientId?._id}`} className="font-bold text-ink-900 hover:text-sky-600 block text-lg transition-colors">{appt.patientId?.name || "Patient Name"}</Link>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="text-[10px] bg-sky-100/80 text-sky-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide border border-sky-200/50">{appt.treatmentName}</span>
                                  
                                  {/* 🚀 NEW: DOMINANT DOSHA BADGE */}
                                  {dominantDosha && (
                                    <span className={`text-[10px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-md border ${dominantDosha.color}`}>
                                      <Leaf size={12}/> {dominantDosha.name}
                                    </span>
                                  )}

                                  {isVideo ? (
                                    <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1.5 bg-purple-100/80 px-2.5 py-1 rounded-md border border-purple-200/50"><Video size={12}/> Video Session</span>
                                  ) : isAudio ? (
                                    <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1.5 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200/50"><Phone size={12}/> Audio Consult</span>
                                  ) : (
                                    appt.roomId && <span className="text-[10px] text-ink-500 font-bold flex items-center gap-1.5 bg-ink-100/50 px-2.5 py-1 rounded-md border border-ink-200"><MapPin size={12}/> {appt.roomId?.name || "OPD Room"}</span>
                                  )}
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                             {appt.status === 'COMPLETED' ? (
                               <span className="flex-1 md:flex-none flex justify-center items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
                                 <CheckCircle2 size={16}/> Consult Completed
                               </span>
                             ) : isVideo ? (
                               <a href={appt.meetLink || "#"} target="_blank" className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 text-white rounded-2xl text-xs font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                                 <Video size={16}/> Launch Video Call
                               </a>
                             ) : isAudio ? (
                               <button className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                                 <Phone size={16}/> Dial Patient
                               </button>
                             ) : (
                               <Link href={`/dashboard/appointments/${appt._id}`} className="flex-1 md:flex-none px-6 py-3 bg-primary-700 text-white rounded-2xl text-xs font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 group-hover:bg-sky-600">
                                 Attend Case <ArrowUpRight size={16} className="opacity-70"/>
                               </Link>
                             )}
                          </div>
                        </div>

                        {/* RECEPTION / TELECALLER NOTES */}
                        {appt.bookingNotes && (
                          <div className="mt-2 text-xs text-ink-500 bg-white/60 p-3.5 rounded-2xl border border-ink-200/60 flex items-start gap-3 backdrop-blur-sm">
                            <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="font-bold text-ink-900 text-[10px] uppercase tracking-wide mb-1">Pre-Consult Notes:</span> 
                              <span className="leading-relaxed">{appt.bookingNotes.replace('[VIDEO CALL]', '').replace('[AUDIO CALL]', '').trim()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center h-full">
                   <div className="h-24 w-24 bg-ink-50 rounded-full flex items-center justify-center mb-6 border border-ink-100">
                     {activeTab === 'OPD' ? <Building2 size={40} className="text-ink-300"/> : <Globe size={40} className="text-ink-300"/>}
                   </div>
                   <p className="text-ink-900 font-bold text-lg mb-1">
                     {activeTab === 'OPD' ? 'No Offline Patients' : 'No Online Consultations'}
                   </p>
                   <p className="text-ink-500 text-sm font-medium">Your queue for this category is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: ACTION ITEMS */}
        <div className="space-y-6">
          
          {/* 🚀 NEW: HOSPITAL NOTICE BOARD PLACED HERE FOR MAXIMUM VISIBILITY */}
          <NoticeBoard />
          
          {/* Quick Tasks */}
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-sky-50 bg-sky-50/50 flex justify-between items-center">
               <h3 className="font-bold text-sky-900 flex items-center gap-2"><ListTodo size={18} className="text-sky-500"/> Personal Tasks</h3>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <form onSubmit={handleAddTask} className="flex gap-2 mb-5">
                <input 
                  type="text" 
                  placeholder="E.g., Remind Amit about diet..." 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 bg-ink-50 border border-ink-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                />
                <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center">
                  <Plus size={20}/>
                </button>
              </form>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                {/* 🚀 FIXED: Using task._id mapping for MongoDB data */}
                {tasks.map(task => (
                  <div key={task._id} className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${task.done ? 'bg-ink-50/80 border-transparent opacity-60' : 'bg-white border-ink-200 shadow-sm hover:border-sky-300'}`}>
                    <button onClick={() => toggleTask(task._id)} className={`mt-0.5 transition-colors ${task.done ? 'text-emerald-500' : 'text-ink-300 hover:text-sky-500'}`}>
                      {task.done ? <CheckSquare size={18}/> : <Square size={18}/>}
                    </button>
                    <p className={`flex-1 text-sm font-semibold leading-snug ${task.done ? 'text-ink-400 line-through' : 'text-ink-600'}`}>
                      {task.text}
                    </p>
                    <button onClick={() => deleteTask(task._id)} className="text-ink-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-ink-400 font-bold uppercase tracking-wide bg-ink-50 py-2 px-4 rounded-xl border border-ink-100 inline-block">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reports Review */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-orange-50 bg-orange-50/50 flex justify-between items-center">
               <h3 className="font-bold text-orange-900 flex items-center gap-2"><FileText size={18} className="text-orange-500"/> Lab Reports</h3>
               <span className="bg-orange-200/70 text-orange-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">{pendingReports.length} NEW</span>
            </div>
            <div className="p-5 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
               {pendingReports.map((report) => (
                 <div key={report._id} className="p-4 bg-white border border-ink-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition-all group">
                    <p className="font-bold text-ink-900 text-sm mb-0.5">{report.patientName}</p>
                    <p className="text-xs font-bold text-sky-600 mb-4">{report.testName}</p>
                    <button className="w-full py-2.5 bg-orange-50 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 text-orange-700 group-hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-md active:scale-95 border border-orange-100 group-hover:border-transparent">
                       <FileText size={14}/> Open & Review
                    </button>
                 </div>
               ))}
               {pendingReports.length === 0 && (
                 <div className="py-10 text-center">
                    <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={32} className="text-emerald-400"/>
                    </div>
                    <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">All reports cleared</p>
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}