import { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
import { X, CalendarPlus, Trash2, User, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProcessTherapyModal({ isOpen, onClose, recommendation, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  const [formData, setFormData] = useState({
    therapistId: '',
    roomId: '',
    startTime: new Date().toISOString().slice(0, 16) // Default to right now
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch available therapists and rooms
      axios.get('/users?role=THERAPIST').then(res => setTherapists(res.data)).catch(console.error);
      axios.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen || !recommendation) return null;

  const handleProcess = async (action: 'BOOK' | 'DISCARD') => {
    if (action === 'BOOK' && (!formData.therapistId || !formData.roomId)) {
      return toast.error("Please select a therapist and a room to book.");
    }

    setLoading(true);
    try {
      await axios.post('/appointments/process-recommendation', {
        originalApptId: recommendation.originalApptId,
        therapyId: recommendation._id,
        action: action,
        patientId: recommendation.patient?._id,
        treatmentName: recommendation.name,
        startTime: formData.startTime,
        roomId: formData.roomId,
        therapistId: formData.therapistId
      });
      
      toast.success(action === 'BOOK' ? "Therapy Booked & Added to Bill!" : "Recommendation Discarded");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to process recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-sky-50/50">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Process Prescription</h2>
            <p className="text-xs font-bold text-sky-600 uppercase mt-1 tracking-wider">{recommendation.patient?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors text-slate-500 shadow-sm"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Doctor Recommended</p>
            <p className="font-extrabold text-slate-800 text-lg">{recommendation.name}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5 mb-2"><User size={14}/> Assign Therapist</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.therapistId} onChange={(e) => setFormData({...formData, therapistId: e.target.value})}
              >
                <option value="">-- Select Therapist --</option>
                {therapists.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5 mb-2"><LayoutGrid size={14}/> Assign Room</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.roomId} onChange={(e) => setFormData({...formData, roomId: e.target.value})}
              >
                <option value="">-- Select Room --</option>
                {rooms.map((r: any) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Start Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button 
            onClick={() => handleProcess('DISCARD')} disabled={loading}
            className="flex-1 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} /> Patient Refused
          </button>
          <button 
            onClick={() => handleProcess('BOOK')} disabled={loading}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-sky-600/20 transition-all disabled:opacity-50"
          >
            <CalendarPlus size={16} /> Book Therapy
          </button>
        </div>
      </div>
    </div>
  );
}