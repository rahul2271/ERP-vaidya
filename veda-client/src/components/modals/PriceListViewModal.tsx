"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { X, Tag, Pill, Search, Loader2 } from "lucide-react";

export default function PriceListViewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [therapies, setTherapies] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) fetchRates();
  }, [isOpen]);

  const fetchRates = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [therapyRes, medicineRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/treatments`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, config)
      ]);
      setTherapies(therapyRes.data);
      setMedicines(medicineRes.data);
    } catch (err) {
      console.error("Failed to load rates", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredTherapies = therapies.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const filteredMeds = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hospital Rate Card</h2>
            <p className="text-sm text-gray-500">View-only reference for billing</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search therapy or medicine..." 
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40}/></div>
          ) : (
            <>
              {/* Therapies Section */}
              <section>
                <h3 className="text-xs font-black text-primary-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag size={14}/> Panchakarma & Therapies
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredTherapies.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-primary-50/50 rounded-xl border border-primary-100">
                      <span className="font-bold text-gray-700">{t.name}</span>
                      <span className="font-black text-primary-700">₹{t.cost}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Medicines Section */}
              <section>
                <h3 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Pill size={14}/> Medicine / Pharmacy
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredMeds.map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100">
                      <div>
                        <p className="font-bold text-gray-700">{m.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{m.unit}</p>
                      </div>
                      <span className="font-black text-green-700">₹{m.price}</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}