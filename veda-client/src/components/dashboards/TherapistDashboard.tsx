"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import {
  User, Clock, PlayCircle, CheckCircle,
  Activity, Calendar, XCircle, Loader2
} from "lucide-react";
import NoticeBoard from "@/components/NoticeBoard";

export default function TherapistDashboard() {
  const [therapies, setTherapies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

  useEffect(() => {
    fetchTodayTherapies();
  }, []);

  const fetchTodayTherapies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/therapies/me/today");
      setTherapies(response.data);
    } catch (err) {
      console.error(err);
      setTherapies([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const updateTherapyStatus = async (therapyId: string, newStatus: string) => {
    setActionLoading(therapyId);
    try {
      await axios.put(`/therapies/${therapyId}/status`, { status: newStatus });
      showToast(`Therapy marked as ${newStatus.replace('_', ' ').toLowerCase()}`, "success");
      fetchTodayTherapies();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-ink-100 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-ink-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const pendingCount = therapies.filter(t => t.status === 'PENDING').length;
  const completedCount = therapies.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">

      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 font-semibold text-sm text-white transition-all animate-in slide-in-from-top-4 fade-in ${toast.type === 'success' ? 'bg-primary-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={17} /> : <XCircle size={17} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-ink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900 flex items-center gap-2.5">
            <Activity size={19} className="text-primary-600" strokeWidth={2} />
            My schedule
          </h1>
          <p className="text-sm text-ink-500 mt-1">Today's therapy sessions.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-amber-50 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
            <Clock size={16} className="text-amber-600" />
            <div>
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Pending</p>
              <p className="font-bold text-amber-800 leading-none text-base mt-0.5">{pendingCount}</p>
            </div>
          </div>
          <div className="flex-1 md:flex-none bg-secondary-50 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
            <CheckCircle size={16} className="text-secondary-600" />
            <div>
              <p className="text-[10px] font-semibold text-secondary-700 uppercase tracking-wide">Completed</p>
              <p className="font-bold text-secondary-800 leading-none text-base mt-0.5">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Therapy cards */}
        <div className="flex-1 lg:w-2/3">
          {therapies.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[280px] bg-white rounded-2xl border border-dashed border-ink-200">
              <Calendar size={28} className="text-ink-200 mb-3" />
              <h3 className="text-sm font-semibold text-ink-600">No therapies scheduled</h3>
              <p className="text-xs text-ink-400 mt-1">Your schedule is clear today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {therapies.map((therapy) => (
                <div key={therapy._id} className="bg-white border border-ink-100 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col justify-between">

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center shrink-0">
                        <User size={17} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink-900 leading-tight text-sm">{therapy.patientName || "Patient"}</h3>
                        <p className="text-xs text-primary-600 mt-0.5">{therapy.therapyName || "Therapy"}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-semibold rounded-md ${
                      therapy.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                      therapy.status === 'IN_PROGRESS' ? 'bg-primary-50 text-primary-700' :
                      'bg-secondary-50 text-secondary-700'
                    }`}>
                      {therapy.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-ink-50/60 rounded-xl p-3.5 mb-4 space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-ink-500">Room</span>
                      <span className="font-semibold text-ink-800">{therapy.roomNumber || "Unassigned"}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-ink-100">
                      <span className="text-xs text-ink-500">Time</span>
                      <span className="font-semibold text-ink-800">{therapy.time || "—"}</span>
                    </div>
                  </div>

                  {therapy.status === 'PENDING' && (
                    <button
                      onClick={() => updateTherapyStatus(therapy._id, 'IN_PROGRESS')}
                      disabled={actionLoading === therapy._id}
                      className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {actionLoading === therapy._id ? <Loader2 className="animate-spin" size={16} /> : <><PlayCircle size={16} /> Start session</>}
                    </button>
                  )}

                  {therapy.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateTherapyStatus(therapy._id, 'COMPLETED')}
                      disabled={actionLoading === therapy._id}
                      className="w-full py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {actionLoading === therapy._id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} /> Mark completed</>}
                    </button>
                  )}

                  {therapy.status === 'COMPLETED' && (
                    <div className="w-full py-2.5 bg-ink-50 text-ink-400 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Finished
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 shrink-0">
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
}
