"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Search, FileText, Calendar, 
  Eye, Printer, X, Receipt, IndianRupee, CreditCard, Banknote, SmartphoneNfc
} from "lucide-react";

export default function PharmacyBillingPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<any | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("/pharmacy/sales");
      setSales(response.data);
    } catch (err) {
      console.error("Failed to load pharmacy sales", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => 
    sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  // 🚀 Premium Skeleton Loader
  if (loading && sales.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse bg-[#f8fafc] min-h-screen">
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-[600px] bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 pb-20 relative">
      
      {/* 🚀 DASHBOARD VIEW (Hidden during print) */}
      <div className="max-w-7xl mx-auto space-y-8 print:hidden flex flex-col h-full">
        
        {/* HEADER */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-800 to-sky-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl"><FileText size={24} strokeWidth={2.5}/></div>
              Pharmacy Ledger
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-14">View past over-the-counter sales and reprint receipts.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or Bill ID..." 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm font-bold text-slate-800 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <tr>
                  <th className="p-5 pl-8">Bill ID</th>
                  <th className="p-5">Date & Time</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Payment Mode</th>
                  <th className="p-5 text-right">Total Amount</th>
                  <th className="p-5 pr-8 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSales.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-20 text-center text-slate-400">
                       <div className="flex flex-col items-center justify-center">
                         <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                           <Receipt size={32} className="text-slate-300" />
                         </div>
                         <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">No records found</p>
                         <p className="text-xs font-medium mt-1">Sales will appear here once processed at the POS.</p>
                       </div>
                     </td>
                   </tr>
                ) : filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <span className="font-mono text-sm font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100/50">
                        #{sale._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-slate-400"/>
                      {new Date(sale.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-extrabold text-slate-800">{sale.customerName}</p>
                      {sale.customerPhone && <p className="text-[11px] font-bold text-slate-400 tracking-wider mt-0.5">{sale.customerPhone}</p>}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        sale.paymentMode === 'UPI' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                        sale.paymentMode === 'CASH' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {sale.paymentMode === 'UPI' ? <SmartphoneNfc size={12} strokeWidth={3}/> : 
                         sale.paymentMode === 'CASH' ? <Banknote size={12} strokeWidth={3}/> : 
                         <CreditCard size={12} strokeWidth={3}/>}
                        {sale.paymentMode}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <p className="font-black text-slate-900 text-lg tracking-tight">₹{sale.grandTotal.toFixed(2)}</p>
                    </td>
                    <td className="p-5 pr-8 text-center">
                      <button 
                        onClick={() => setSelectedBill(sale)}
                        className="p-2.5 bg-white text-slate-400 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all border border-transparent hover:border-sky-100 shadow-sm active:scale-95"
                        title="View Receipt"
                      >
                        <Eye size={18} strokeWidth={2.5}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🚀 PRINTABLE RECEIPT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md print:bg-white print:block print:absolute print:inset-0 p-4">
          
          <div className="bg-white w-full max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden print:w-full print:max-w-none print:shadow-none print:rounded-none relative flex flex-col max-h-[90vh]">
            
            {/* Modal Actions (Hidden during print) */}
            <div className="p-5 bg-slate-50 flex justify-between items-center print:hidden border-b border-slate-200 shrink-0">
               <h3 className="font-bold flex items-center gap-2 text-slate-800"><Receipt size={18}/> Digital Receipt</h3>
               <div className="flex gap-2">
                 <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 shadow-sm active:scale-95 transition-all">
                   <Printer size={14}/> Print
                 </button>
                 <button onClick={() => setSelectedBill(null)} className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl transition-colors active:scale-95">
                   <X size={16} strokeWidth={3}/>
                 </button>
               </div>
            </div>

            {/* 🧾 ACTUAL RECEIPT (This is what gets printed) */}
            <div className="p-8 print:p-0 bg-white font-mono overflow-y-auto custom-scrollbar relative">
               
               {/* Aesthetic Receipt Top Edge (Hidden in print) */}
               <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDgsMCA0LDgiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] bg-repeat-x print:hidden"></div>

               <div className="text-center mb-6 pt-2">
                 <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">
                    {selectedBill.hospitalId?.name || "YUKTI HERBS PHARMACY"}
                 </h2>
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    {selectedBill.hospitalId?.address || "Mohali, Punjab"}
                 </p>
                 {selectedBill.hospitalId?.phone && (
                    <p className="text-[10px] text-slate-600 font-bold">Ph: {selectedBill.hospitalId.phone}</p>
                 )}
               </div>

               <div className="border-t border-b border-dashed border-slate-300 py-3 mb-6 text-[11px] font-bold text-slate-700 space-y-1">
                 <div className="flex justify-between"><span>Bill No:</span><span className="text-slate-900">#{selectedBill._id.slice(-6).toUpperCase()}</span></div>
                 <div className="flex justify-between"><span>Date:</span><span className="text-slate-900">{new Date(selectedBill.createdAt).toLocaleDateString('en-GB')} {new Date(selectedBill.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                 <div className="flex justify-between"><span>Cashier:</span><span className="text-slate-900 uppercase">{selectedBill.soldBy?.name || 'Staff'}</span></div>
                 <div className="flex justify-between"><span>Customer:</span><span className="text-slate-900 uppercase">{selectedBill.customerName}</span></div>
                 <div className="flex justify-between"><span>Pay Mode:</span><span className="text-slate-900 uppercase">{selectedBill.paymentMode}</span></div>
               </div>

               <table className="w-full text-[11px] text-left mb-6 font-bold">
                 <thead className="border-b border-slate-800 text-slate-900">
                   <tr>
                     <th className="py-2 w-full uppercase">Item</th>
                     <th className="py-2 px-2 text-center uppercase">Qty</th>
                     <th className="py-2 text-right uppercase">Amt</th>
                   </tr>
                 </thead>
                 <tbody className="text-slate-700">
                   {selectedBill.items.map((item: any, idx: number) => (
                     <tr key={idx} className="border-b border-slate-100 last:border-0">
                       <td className="py-2 pr-2 leading-tight">{item.name} <br/><span className="text-[9px] text-slate-400 font-medium">@ ₹{item.unitPrice}</span></td>
                       <td className="py-2 text-center align-top">{item.quantity}</td>
                       <td className="py-2 text-right align-top text-slate-900">₹{item.lineTotal.toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>

               <div className="space-y-1.5 text-[11px] font-bold text-slate-600 mb-8 border-t border-slate-800 pt-3">
                 <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedBill.subtotal.toFixed(2)}</span></div>
                 {selectedBill.discount?.amount > 0 && (
                   <div className="flex justify-between text-slate-500"><span>Discount</span><span>- ₹{selectedBill.discount.amount.toFixed(2)}</span></div>
                 )}
                 <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t-2 border-dashed border-slate-300 mt-2">
                   <span className="uppercase">Net Total</span><span>₹{selectedBill.grandTotal.toFixed(2)}</span>
                 </div>
               </div>

               <div className="text-center text-[10px] font-bold text-slate-500 pt-4 border-t border-slate-200">
                 <p>*** THANK YOU ***</p>
                 <p className="mt-0.5 tracking-widest uppercase text-[9px]">Get well soon</p>
               </div>
               
               {/* Aesthetic Receipt Bottom Edge (Hidden in print) */}
               <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIHBvaW50cz0iMCw4IDgsOCA0LDAiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] bg-repeat-x print:hidden"></div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}