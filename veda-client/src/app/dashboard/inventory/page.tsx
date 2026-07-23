"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig"; // 🚀 Standardized to your custom config
import { 
  Package, Plus, AlertCircle, TrendingDown, IndianRupee, 
  X, Pill, Trash2, Search, FileText, Activity 
} from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Vati",
    quantity: "" as number | string, 
    unit: "Bottles",
    price: "" as number | string 
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        quantity: Number(formData.quantity) || 0,
        price: Number(formData.price) || 0,
        minLevel: 10
      };

      await axios.post(`/inventory`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      setFormData({ name: "", category: "Vati", quantity: "", unit: "Bottles", price: "" });
      fetchInventory(); 
    } catch (err) {
      alert("Error adding stock. Make sure your backend terminal has no errors.");
    }
  };

  const deleteItem = async (id: string) => {
    if(!window.confirm("Are you sure you want to remove this item permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch(err) {
      alert("Failed to delete item. Make sure you restarted the backend server.");
    }
  };

  const lowStockCount = items.filter(i => (Number(i.quantity) || 0) < 10).length;
  const totalValue = items.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.price) || 0)), 0);

  const filteredItems = items.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🚀 Premium Skeleton Loader
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-pulse text-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-20 bg-slate-200 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
          </div>
          <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Package size={24} strokeWidth={2.5}/></div>
              Pharmacy & Stock
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Manage hospital medicines, oils, and inventory levels.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} strokeWidth={3}/> Add New Item
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5 group">
            <div className="h-14 w-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{items.length}</h2>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5 group">
            <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform relative">
              {lowStockCount > 0 && <span className="absolute top-0 right-0 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span></span>}
              <TrendingDown size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{lowStockCount}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-5 group">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <IndianRupee size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inventory Value</p>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">₹{totalValue.toLocaleString('en-IN')}</h2>
            </div>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Table Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
             <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by medicine name or category..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold text-slate-800 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="p-5 pl-8">Medicine Name</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Current Stock</th>
                  <th className="p-5">Unit Price</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isLowStock = (Number(item.quantity) || 0) < 10;
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-5 pl-8 font-extrabold text-slate-800 text-[15px]">{item.name}</td>
                        <td className="p-5">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200/60">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider border shadow-sm ${
                            isLowStock ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isLowStock && <AlertCircle size={14}/>}
                            {item.quantity || 0} {item.unit}
                          </span>
                        </td>
                        <td className="p-5 font-black text-slate-900 tracking-tight">₹{item.price || 0}</td>
                        <td className="p-5 pr-8 text-right">
                          <button 
                            onClick={() => deleteItem(item._id)} 
                            className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm active:scale-95"
                            title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400">
                       <div className="flex flex-col items-center justify-center">
                         <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                           <Package size={32} className="text-slate-300" />
                         </div>
                         <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No items found</p>
                         <p className="text-xs font-medium mt-1">Add new items to the pharmacy to see them here.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- ADD NEW ITEM MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
              
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full z-10">
                <X size={20} />
              </button>
              
              <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0 bg-white">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><Pill size={24} strokeWidth={2.5}/></div>
                  Add New Stock
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-2 ml-1">Register a new Ayurvedic medicine to the pharmacy.</p>
              </div>
              
              <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
                <form id="add-inventory-form" onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                      <FileText size={12}/> Medicine Name
                    </label>
                    <input type="text" required placeholder="e.g. Ashwagandha Churna" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                        <Activity size={12}/> Category
                      </label>
                      <select className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner cursor-pointer"
                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="Vati">Vati</option>
                        <option value="Churna">Churna</option>
                        <option value="Taila">Taila</option>
                        <option value="Asava">Asava</option>
                        <option value="Bhasma">Bhasma</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">
                        Unit Type
                      </label>
                      <input type="text" required placeholder="Bottles, Gm, Kg" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner"
                        value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                        <Package size={12}/> Opening Stock
                      </label>
                      <input type="number" required min="0" placeholder="0" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-black outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner"
                        value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
                        <IndianRupee size={12}/> Unit Price
                      </label>
                      <input type="number" required min="0" placeholder="₹ 0.00" className="w-full border border-slate-200 p-3.5 rounded-2xl bg-white text-slate-800 font-black outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Buttons */}
              <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   form="add-inventory-form"
                   className="flex-[2] py-4 rounded-2xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <Plus size={18} strokeWidth={3}/> Save to Pharmacy
                 </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}