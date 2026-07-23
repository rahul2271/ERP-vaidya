"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, 
  CreditCard, Smartphone, CheckCircle, IndianRupee, Tag, 
  Loader2, User, PackageOpen, Receipt, XCircle
} from "lucide-react";
import NoticeBoard from "@/components/NoticeBoard"; // 🚀 Imported Notice Board

export default function PharmacistDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [settlement, setSettlement] = useState({ UPI: 0, CASH: 0, CARD: 0, TOTAL: 0, TOTAL_BILLS: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, setRes] = await Promise.all([
        axios.get("/inventory"),
        axios.get("/pharmacy/settlement")
      ]);
      setInventory(invRes.data.filter((item: any) => item.quantity > 0)); 
      setSettlement(setRes.data);
    } catch (err) {
      showToast("Failed to load pharmacy data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.inventoryId === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          showToast(`Only ${product.quantity} units available.`, "error");
          return prev; 
        }
        return prev.map(item => 
          item.inventoryId === product._id 
            ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [...prev, {
        inventoryId: product._id, name: product.name, unitPrice: product.price,
        quantity: 1, lineTotal: product.price, maxStock: product.quantity 
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.inventoryId === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item; 
        if (newQty > item.maxStock) {
           showToast(`Max stock reached (${item.maxStock})`, "error");
           return item;
        }
        return { ...item, quantity: newQty, lineTotal: newQty * item.unitPrice };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.inventoryId !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return showToast("Cart is empty!", "error");
    if (!customerName.trim()) return showToast("Customer Name is required.", "error");

    setIsCheckingOut(true);
    try {
      const payload = { customerName, customerPhone, items: cart, subtotal, discount: { percentage: discountPercent, amount: discountAmount }, grandTotal, paymentMode };
      await axios.post("/pharmacy/sale", payload);
      showToast("Sale completed successfully!", "success");
      setCart([]); setCustomerName("Walk-in Customer");
      setCustomerPhone(""); setDiscountPercent(0);
      fetchData(); 
    } catch (err: any) {
      showToast("Checkout failed: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && inventory.length === 0) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col bg-ink-50/60 p-6 gap-6">
        <div className="h-24 bg-ink-100 rounded-2xl animate-pulse"></div>
        <div className="flex gap-6 h-full">
           <div className="flex-1 bg-ink-100 rounded-2xl animate-pulse"></div>
           <div className="w-96 bg-ink-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-ink-50/60 overflow-hidden text-ink-900">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-bold text-sm transition-all animate-in slide-in-from-top-4 fade-in ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 border-b border-ink-100 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <ShoppingCart className="text-primary-600" size={24} /> Pharmacy POS
          </h1>
          <p className="text-sm text-ink-500 font-medium mt-1">Over-the-counter sales & inventory management</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-ink-100 px-4 py-3 rounded-xl flex items-center gap-3">
            <Receipt size={20} className="text-primary-600" />
            <div>
              <p className="text-[10px] font-bold text-ink-500 uppercase">Total Bills</p>
              <p className="font-bold text-ink-900">{settlement.TOTAL_BILLS || 0}</p>
            </div>
          </div>
          <div className="bg-green-50 px-4 py-3 rounded-xl border border-green-200 flex items-center gap-3">
            <IndianRupee size={20} className="text-green-600" />
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase">Today's Revenue</p>
              <p className="font-bold text-green-700">₹{settlement.TOTAL.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden p-6">
        
        {/* Left Column: Notices & Inventory (Scrolls together) */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
          
          {/* 🚀 NOTICE BOARD INSERTED HERE */}
          <div className="shrink-0">
            <NoticeBoard />
          </div>

          {/* INVENTORY SECTION */}
          <div className="flex flex-col bg-white rounded-2xl border border-ink-100 overflow-hidden shrink-0 min-h-[500px]">
            <div className="p-4 border-b border-ink-100 bg-white shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search medicines..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-ink-50/60 border border-ink-200 text-ink-900 font-bold rounded-lg outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="p-4 bg-ink-50/60">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInventory.map(item => (
                  <button 
                    key={item._id}
                    onClick={() => addToCart(item)}
                    className="bg-white p-4 border border-ink-100 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all text-left flex flex-col justify-between h-40 active:scale-95"
                  >
                    <div>
                      <p className="font-bold text-ink-900 text-sm line-clamp-2">{item.name}</p>
                      <span className={`inline-flex mt-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${item.quantity <= 10 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-ink-100 text-ink-500 border border-ink-100'}`}>
                        {item.quantity} in stock
                      </span>
                    </div>
                    <div className="flex justify-between items-end w-full mt-2 pt-2 border-t border-ink-50">
                      <p className="text-xl font-bold text-primary-600">₹{item.price}</p>
                      <div className="bg-primary-50 p-1.5 rounded-md text-primary-600">
                        <Plus size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </button>
                ))}
                {filteredInventory.length === 0 && (
                  <div className="col-span-full text-center py-12 text-ink-400 flex flex-col items-center">
                    <PackageOpen size={40} className="mb-3 opacity-20"/>
                    <span className="font-bold">No medicines found in inventory</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Cart (Locked in place) */}
        <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-ink-100 overflow-hidden shrink-0 h-full">
          <div className="p-4 bg-primary-700 text-white flex justify-between items-center shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              <ShoppingCart size={18} /> Current Sale ({cart.length})
            </h3>
          </div>

          <div className="p-4 border-b border-ink-100 bg-ink-50/60 space-y-3 shrink-0">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-ink-200 rounded-lg text-sm font-bold outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-ink-900 transition-all"
              />
            </div>
            <div className="relative">
              <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input 
                type="text" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone (Optional)"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-ink-200 rounded-lg text-sm font-bold outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-ink-900 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-400">
                <ShoppingCart size={40} className="opacity-20 mb-3" />
                <p className="text-sm font-bold uppercase tracking-wide">Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.inventoryId} className="p-3 bg-ink-50/60 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-ink-900 text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-ink-500 font-medium mt-0.5">₹{item.unitPrice} / unit</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.inventoryId)}
                      className="text-ink-300 hover:text-red-600 bg-white hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-ink-100 hover:border-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-ink-100/60">
                    <div className="flex items-center bg-white border border-ink-200 rounded-lg overflow-hidden shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.inventoryId, -1)}
                        className="p-1.5 hover:bg-ink-100 text-ink-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-ink-900 border-x border-ink-100 bg-ink-50/60">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.inventoryId, 1)}
                        className="p-1.5 hover:bg-ink-100 text-ink-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-ink-900 text-base">₹{item.lineTotal.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-ink-100 bg-ink-50/60 space-y-4 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-ink-100 shadow-sm">
              <span className="text-xs font-bold text-ink-500 flex items-center gap-1.5 uppercase tracking-wide">
                <Tag size={14} className="text-primary-500"/> Discount (%)
              </span>
              <input 
                type="number" 
                min="0" 
                max="100"
                value={discountPercent || ""}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-20 bg-ink-50/60 border border-ink-200 text-ink-900 text-center rounded-lg py-1.5 text-sm font-bold focus:border-primary-500 outline-none"
              />
            </div>

            <div className="space-y-2 text-sm bg-white p-4 rounded-xl border border-ink-100">
              <div className="flex justify-between text-ink-500">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="font-medium">Discount Applied</span>
                  <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-3 border-t border-ink-100 mt-2">
                <span className="text-xs font-bold text-ink-400 uppercase tracking-wide">Total Pay</span>
                <span className="text-2xl font-bold text-primary-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'CASH', 'CARD'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all border shadow-sm active:scale-95 ${paymentMode === mode ? 'bg-primary-700 text-white border-primary-700' : 'bg-white text-ink-500 border-ink-100 hover:bg-ink-50/60 hover:border-ink-200'}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut || cart.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
            >
              {isCheckingOut ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} />
                  Complete Transaction
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}