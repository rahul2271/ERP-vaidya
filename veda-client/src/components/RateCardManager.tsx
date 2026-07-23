"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function RateCardManager() {
  const [rates, setRates] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", cost: "", durationMin: "60" });

  useEffect(() => { loadRates(); }, []);

  const loadRates = async () => {
     const token = localStorage.getItem("token");
     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/treatments`, {
        headers: { Authorization: `Bearer ${token}` }
     });
     setRates(res.data);
  };

  const addRate = async () => {
     const token = localStorage.getItem("token");
     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/treatments`, form, {
        headers: { Authorization: `Bearer ${token}` }
     });
     setForm({ name: "", cost: "", durationMin: "60" });
     loadRates();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
       <h3 className="font-bold text-gray-800 mb-4">Therapy Rate Card</h3>
       
       {/* Add New Rate */}
       <div className="flex gap-2 mb-6">
          <input placeholder="Therapy Name (e.g. Vaman)" className="border p-2 rounded w-1/2" 
             value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Price (₹)" type="number" className="border p-2 rounded w-1/4" 
             value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
          <button onClick={addRate} className="bg-primary-600 text-white p-2 rounded-lg font-bold flex gap-1 items-center">
             <Plus size={16}/> Add
          </button>
       </div>

       {/* List */}
       <div className="space-y-2 max-h-60 overflow-y-auto">
          {rates.map(r => (
             <div key={r._id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-gray-700">{r.name}</span>
                <div className="flex gap-4">
                   <span className="text-primary-600 font-bold">₹{r.cost}</span>
                   <button className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}