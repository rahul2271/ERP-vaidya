// "use client";

// import { useState } from "react";
// import axios from "@/utils/axiosConfig";
// import { X, BedDouble, LayoutDashboard, Users, Activity } from "lucide-react";

// export default function AddRoomModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "CONSULTATION", // Default type
//     capacity: 1,
//     status: "AVAILABLE"
//   });

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       // Sends the new room data to your backend
//       await axios.post("/rooms", formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       alert("Room added successfully!");
//       setFormData({ name: "", type: "CONSULTATION", capacity: 1, status: "AVAILABLE" });
//       onSuccess(); // Refreshes the dashboard data
//       onClose();   // Closes the modal
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add room. Please check your backend connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
//         {/* Header */}
//         <div className="p-6 border-b flex justify-between items-center bg-primary-50/50">
//           <div>
//             <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
//               <BedDouble className="text-primary-600" /> Add New Room
//             </h2>
//             <p className="text-xs font-bold text-slate-500 mt-1">Register a new ward, ICU, or consultation room.</p>
//           </div>
//           <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
//           <div>
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
//               <LayoutDashboard size={12}/> Room Name / Number
//             </label>
//             <input 
//               type="text" 
//               required
//               placeholder="e.g., Room 101, ICU-A, Massage Therapy 1"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full border-2 border-slate-100 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-primary-500 transition-colors"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
//                 <Activity size={12}/> Room Type
//               </label>
//               <select 
//                 value={formData.type}
//                 onChange={(e) => setFormData({...formData, type: e.target.value})}
//                 className="w-full border-2 border-slate-100 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-primary-500 transition-colors bg-white cursor-pointer"
//               >
//                 <option value="CONSULTATION">Consultation</option>
//                 <option value="THERAPY">Therapy</option>
//                 <option value="GENERAL_WARD">General Ward</option>
//                 <option value="PRIVATE_WARD">Private Ward</option>
//                 <option value="ICU">ICU</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
//                 <Users size={12}/> Bed Capacity
//               </label>
//               <input 
//                 type="number" 
//                 min="1"
//                 required
//                 value={formData.capacity}
//                 onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
//                 className="w-full border-2 border-slate-100 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-primary-500 transition-colors"
//               />
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-black text-sm transition-all shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
//           >
//             {loading ? "Saving Room..." : "Create Room"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import axios from "@/utils/axiosConfig";
import { X, BedDouble, LayoutDashboard, Users, Activity, Plus } from "lucide-react";

export default function AddRoomModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "CONSULTATION", 
    capacity: 1,
    status: "AVAILABLE"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/rooms", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ name: "", type: "CONSULTATION", capacity: 1, status: "AVAILABLE" });
      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error(err);
      alert("Failed to add room. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
          <X size={20}/>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><BedDouble size={24} strokeWidth={2.5} /></div>
            Add New Room
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 ml-1">Register a new ward, ICU, or consultation room.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-6">
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                <LayoutDashboard size={12}/> Room Name / Number
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Room 101, ICU-A, Massage Therapy 1"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                  <Activity size={12}/> Room Type
                </label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner cursor-pointer"
                >
                  <option value="CONSULTATION">Consultation</option>
                  <option value="THERAPY">Therapy</option>
                  <option value="GENERAL_WARD">General Ward</option>
                  <option value="PRIVATE_WARD">Private Ward</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                  <Users size={12}/> Bed Capacity
                </label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  className="w-full border border-slate-200 p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
               Cancel
             </button>
             <button 
               type="submit" 
               disabled={loading}
               className="flex-1 py-4 rounded-2xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {loading ? "Saving Room..." : <><Plus size={18}/> Create Room</>}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}