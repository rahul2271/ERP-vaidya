"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Megaphone, Plus, Clock, CheckCircle2, XCircle, 
  Trash2, Send, AlertCircle, FileText, User
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function NoticeBoard() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  
  // UI States
  const [activeTab, setActiveTab] = useState<'PUBLISHED' | 'PENDING'>('PUBLISHED');
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newNotice, setNewNotice] = useState({ title: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
    // Safely extract the user's role from the JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role?.toUpperCase() || "");
      } catch (e) {
        console.error("Could not parse token");
      }
    }
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/notices", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(res.data);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message) return toast.error("Please fill all fields");
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/notices", newNotice, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(
        ['ADMIN', 'SUPER_ADMIN'].includes(userRole) 
          ? "Notice published instantly!" 
          : "Notice submitted for Admin approval."
      );
      
      setNewNotice({ title: "", message: "" });
      setIsAdding(false);
      fetchNotices();
    } catch (err) {
      toast.error("Failed to post notice.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: 'PUBLISHED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/notices/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Notice ${status.toLowerCase()}!`);
      fetchNotices();
    } catch (err) {
      toast.error(`Failed to ${status.toLowerCase()} notice.`);
    }
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm("Delete this notice permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Notice deleted.");
      fetchNotices();
    } catch (err) {
      toast.error("Failed to delete notice.");
    }
  };

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
  const publishedNotices = notices.filter(n => n.status === 'PUBLISHED');
  const pendingNotices = notices.filter(n => n.status === 'PENDING');
  
  const displayNotices = activeTab === 'PUBLISHED' ? publishedNotices : pendingNotices;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[450px] max-h-[600px]">
      
      {/* HEADER */}
      <div className="p-5 border-b border-sky-50 bg-gradient-to-r from-sky-50/50 to-white flex justify-between items-center shrink-0">
        <h3 className="font-bold text-sky-900 flex items-center gap-2">
          <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg"><Megaphone size={18} strokeWidth={2.5}/></div>
          Notice Board
        </h3>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
            title="Post a new announcement"
          >
            <Plus size={18} strokeWidth={3}/>
          </button>
        )}
      </div>

      {/* ADMIN TABS (Only visible to Admins) */}
      {isAdmin && !isAdding && (
        <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0 p-2 gap-2">
          <button 
            onClick={() => setActiveTab('PUBLISHED')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'PUBLISHED' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Live ({publishedNotices.length})
          </button>
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'PENDING' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending {pendingNotices.length > 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">{pendingNotices.length}</span>}
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 p-4 relative">
        
        {/* ADD NOTICE FORM */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText size={14}/> New Announcement
            </h4>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Notice Title..." 
                required
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800"
              />
              <textarea 
                placeholder="Write your announcement here..." 
                required
                rows={4}
                value={newNotice.message}
                onChange={(e) => setNewNotice({...newNotice, message: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Sending..." : <><Send size={14}/> Submit</>}
              </button>
            </div>
          </form>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-pulse">
            <div className="h-10 w-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold uppercase tracking-widest">Loading Board...</p>
          </div>
        ) : displayNotices.length > 0 ? (
          <div className="space-y-4">
            {displayNotices.map((notice) => (
              <div key={notice._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition-all group">
                
                {/* Notice Header */}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-extrabold text-slate-800 text-sm leading-snug pr-4">{notice.title}</h4>
                  
                  {/* Admin Controls */}
                  {isAdmin && activeTab === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => updateStatus(notice._id, 'PUBLISHED')} className="text-emerald-500 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors"><CheckCircle2 size={18}/></button>
                      <button onClick={() => updateStatus(notice._id, 'REJECTED')} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><XCircle size={18}/></button>
                    </div>
                  )}
                  {isAdmin && activeTab === 'PUBLISHED' && (
                    <button onClick={() => deleteNotice(notice._id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"><Trash2 size={16}/></button>
                  )}
                </div>

                {/* Notice Body */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 whitespace-pre-wrap">
                  {notice.message}
                </p>

                {/* Notice Footer (Author & Date) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-sky-50 text-sky-600 h-5 w-5 rounded-full flex items-center justify-center">
                      <User size={10} strokeWidth={3}/>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {notice.authorId?.name || "Staff"}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Clock size={10}/>
                    {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-70 mt-10">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              {activeTab === 'PUBLISHED' ? <Megaphone size={24} className="text-slate-400"/> : <AlertCircle size={24} className="text-amber-400"/>}
            </div>
            <h4 className="text-sm font-black text-slate-700">
              {activeTab === 'PUBLISHED' ? "No Announcements" : "Inbox Clear"}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {activeTab === 'PUBLISHED' ? "You're all caught up on hospital news." : "No pending notices require approval."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}