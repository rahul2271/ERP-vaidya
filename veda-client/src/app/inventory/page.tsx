"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig"; // 🚀 FIXED: Using standardized config
import { 
  Plus, Search, Package, Trash2, Edit2, AlertCircle, 
  IndianRupee, Filter, ChevronRight, Activity, Database
} from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Churna", 
    unit: "Bottles", 
    quantity: "" as number | string,
    price: "" as number | string, 
    minLevel: 5 
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.price === "") return alert("Name and Price are required!");

    try {
      const payload = {
        name: newItem.name.trim(),
        category: newItem.category,
        unit: newItem.unit,
        quantity: Number(newItem.quantity) || 0,
        price: Number(newItem.price) || 0,
        minLevel: Number(newItem.minLevel) || 5
      };

      await axios.post("/inventory", payload);
      setIsModalOpen(false);
      setNewItem({ name: "", category: "Churna", unit: "Bottles", quantity: "", price: "", minLevel: 5 });
      fetchInventory();
    } catch (err: any) {
      alert("Failed to add item. Check your connection.");
    }
  };

  const deleteItem = async (id: string, name: string) => {
    if(!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await axios.delete(`/inventory/${id}`);
      fetchInventory();
    } catch(err) {
      alert("Failed to delete item.");
    }
  };

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => (Number(i.quantity) || 0) <= (Number(i.minLevel) || 5)).length;
  const totalValue = inventory.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);

  if (loading && inventory.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
        </div>
        <div className="h-[600px] bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-900 to-sky-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                <Database size={24} strokeWidth={2.5}/> 
              </div>
              Pharmacy Inventory
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Stock management and real-time asset valuation.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-200 active:scale-95 transition-all border border-primary-500"
          >
            <Plus size={20} strokeWidth={2.5} /> Add New Item
          </button>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-sky-600 group-hover:text-white transition-all">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skus Tracked</p>
                <h3 className="text-3xl font-black text-slate-800">{totalItems}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${lowStockItems > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock Alert</p>
                <h3 className={`text-3xl font-black ${lowStockItems > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{lowStockItems}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Value</p>
                <h3 className="text-3xl font-black text-slate-800">₹{totalValue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by medicine name or category..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold text-slate-800 transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <tr>
                  <th className="p-5 pl-8">Item Description</th>
                  <th className="p-5">Category</th>
                  <th className="p-5 text-center">Unit</th>
                  <th className="p-5">Current Stock</th>
                  <th className="p-5">Price per Unit</th>
                  <th className="p-5 pr-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-800 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 border border-primary-100 text-[10px] font-black uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5 text-center font-bold text-slate-500 text-xs uppercase">{item.unit}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${(Number(item.quantity)||0) <= (Number(item.minLevel)||5) ? "text-rose-600 bg-rose-50 px-3 py-1 rounded-lg" : "text-slate-700"}`}>
                          {Number(item.quantity) || 0}
                        </span>
                        {(Number(item.quantity)||0) <= (Number(item.minLevel)||5) && <Activity size={12} className="text-rose-400 animate-pulse"/>}
                      </div>
                    </td>
                    <td className="p-5 font-black text-emerald-600 text-sm">₹{Number(item.price).toLocaleString()}</td>
                    <td className="p-5 pr-8 text-center">
                      <button onClick={() => deleteItem(item._id, item.name)} className="p-2.5 bg-white text-slate-300 hover:text-rose-600 border border-slate-100 hover:border-rose-200 rounded-xl transition-all shadow-sm active:scale-95">
                        <Trash2 size={16} strokeWidth={2.5}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL (Existing logic but with Premium UI) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
               <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <h2 className="text-2xl font-black text-slate-800">Add Stock</h2>
                 <Package size={24} className="text-primary-600" />
               </div>
               
               <form onSubmit={addItem} className="p-8 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Product Name *</label>
                    <input required className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold shadow-inner" placeholder="e.g. Mahanarayan Oil" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                       <select className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none font-bold text-sm cursor-pointer shadow-inner" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                         <option value="Churna">Churna</option><option value="Vati">Vati</option><option value="Bhasma">Bhasma</option><option value="Oil">Oil / Taila</option><option value="General">General</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Unit</label>
                       <select className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white outline-none font-bold text-sm cursor-pointer shadow-inner" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})}>
                         <option value="Bottles">Bottles</option><option value="Strips">Strips</option><option value="Boxes">Boxes</option>
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Initial Stock</label>
                       <input required type="number" className="w-full border border-slate-200 p-3.5 rounded-2xl outline-none font-black shadow-inner" placeholder="0" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Sale Price (₹)</label>
                       <input required type="number" className="w-full border-2 border-emerald-100 bg-emerald-50/30 p-3.5 rounded-2xl outline-none focus:border-emerald-500 font-black text-emerald-700 shadow-inner" placeholder="0" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                     </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                      <ChevronRight size={18} strokeWidth={3}/> Confirm Add
                    </button>
                  </div>
               </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}