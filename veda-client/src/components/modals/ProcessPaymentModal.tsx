"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { X, Receipt, Pill, Activity, CheckCircle, Loader2, Tag, Wallet, Smartphone, CreditCard } from "lucide-react";

export default function ProcessPaymentModal({ isOpen, onClose, onSuccess, appointmentId }: any) {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  // 🚀 NEW: State to track the selected payment method
  const [paymentMode, setPaymentMode] = useState<string>("UPI");

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchBillDetails();
      setDiscountPercent(0); 
      setPaymentMode("UPI"); // Default to UPI for convenience in India
    }
  }, [isOpen, appointmentId]);

  const fetchBillDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/appointments/${appointmentId}`);
      setAppointment(res.data);
    } catch (err) {
      console.error("Failed to fetch bill details", err);
    } finally {
      setLoading(false);
    }
  };

  const therapyCost = Number(appointment?.amount || 0);
  const pharmacyCost = appointment?.medicinesUsed?.reduce((total: number, med: any) => {
    const price = Number(med.priceAtTime || med.inventoryId?.price || 0);
    return total + (price * Number(med.quantity || 1));
  }, 0) || 0;

  const subtotal = therapyCost + pharmacyCost;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const handleMarkAsPaid = async () => {
    setPaying(true);
    try {
      // 🚀 NEW: Include paymentMode in the payload
      const payload = { 
        status: 'COMPLETED',
        paymentStatus: 'PAID', 
        paymentMode: paymentMode, // <-- Added here
        finalBilledAmount: finalTotal,
        discount: { 
          percentage: Number(discountPercent), 
          amount: Number(discountAmount) 
        }
      };

      await axios.patch(`/appointments/${appointmentId}`, payload);

      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Failed to process payment. Please check console.");
    } finally {
      setPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-primary-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt size={24} /> Final Bill
          </h2>
          <button onClick={onClose} className="hover:bg-primary-700 p-2 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>
        ) : (
          <div className="p-6 space-y-5">
            
            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Patient</p>
                <h3 className="text-lg font-bold text-gray-900">{appointment?.patientId?.name || "Patient"}</h3>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">{appointment?.treatmentName}</span>
                <span className="font-bold text-gray-900">₹{therapyCost.toFixed(2)}</span>
              </div>
              {appointment?.medicinesUsed?.map((med: any, i: number) => {
                 const price = Number(med.priceAtTime || med.inventoryId?.price || 0);
                 const qty = Number(med.quantity || 1);
                 return (
                  <div key={i} className="flex justify-between items-center text-sm pl-4 mt-2">
                    <span className="text-gray-500">{med.inventoryId?.name} (x{qty})</span>
                    <span className="font-semibold text-gray-700">₹{(price * qty).toFixed(2)}</span>
                  </div>
                 );
              })}
            </div>

            <hr className="border-gray-100" />

            {/* Math & Discount Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-primary-50/50 p-3 rounded-xl border border-primary-100">
                <Tag size={18} className="text-primary-600" />
                <div className="flex-1">
                  <label className="text-[10px] font-black text-primary-600 uppercase">Apply Discount (%)</label>
                  <input 
                    type="number" min="0" max="100" placeholder="0" 
                    className="w-full bg-transparent text-lg font-black text-primary-900 outline-none"
                    value={discountPercent || ""} 
                    onChange={(e) => setDiscountPercent(Number(e.target.value))} 
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-primary-400 font-bold uppercase">Amount Off</p>
                  <p className="text-sm font-black text-primary-600">- ₹{discountAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* 🚀 NEW: Payment Mode Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setPaymentMode('UPI')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${paymentMode === 'UPI' ? 'bg-primary-50 border-primary-600 text-primary-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Smartphone size={16} /> UPI
                </button>
                <button 
                  onClick={() => setPaymentMode('CASH')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${paymentMode === 'CASH' ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Wallet size={16} /> Cash
                </button>
                <button 
                  onClick={() => setPaymentMode('CARD')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${paymentMode === 'CARD' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <CreditCard size={16} /> Card
                </button>
              </div>
            </div>

            {/* Grand Total */}
            <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl mt-2">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Payable</p>
              </div>
              <span className="text-3xl font-black text-white">₹{finalTotal.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleMarkAsPaid} 
                disabled={paying} 
                className="flex-[2] bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {paying ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20}/> Collect {paymentMode}</>}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { X, Receipt, Pill, Activity, CheckCircle, Loader2, Tag } from "lucide-react";

// export default function ProcessPaymentModal({ isOpen, onClose, onSuccess, appointmentId }: any) {
//   const [appointment, setAppointment] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [paying, setPaying] = useState(false);
//   const [discountPercent, setDiscountPercent] = useState<number>(0);

//   useEffect(() => {
//     if (isOpen && appointmentId) {
//       fetchBillDetails();
//       setDiscountPercent(0); // Reset discount when opening a new bill
//     }
//   }, [isOpen, appointmentId]);

//   const fetchBillDetails = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointment(res.data);
//     } catch (err) {
//       console.error("Failed to fetch bill details", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Dynamic Math Calculations ---
//   const therapyCost = Number(appointment?.amount || 0);
  
//   const pharmacyCost = appointment?.medicinesUsed?.reduce((total: number, med: any) => {
//     const price = Number(med.priceAtTime || med.inventoryId?.price || 0);
//     return total + (price * Number(med.quantity || 1));
//   }, 0) || 0;

//   const subtotal = therapyCost + pharmacyCost;
  
//   // Calculate exact discount amount based on percentage
//   const discountAmount = (subtotal * discountPercent) / 100;
//   const finalTotal = subtotal - discountAmount;

//   const handleMarkAsPaid = async () => {
//     setPaying(true);
//     try {
//       const token = localStorage.getItem("token");
      
//       // ✅ EXACT PAYLOAD FOR YOUR NEW SCHEMA
//       const payload = { 
//         status: 'COMPLETED',
//         paymentStatus: 'PAID', // Capitalized to match DB and UI checks
//         finalBilledAmount: finalTotal,
//         discount: { 
//           percentage: Number(discountPercent), 
//           amount: Number(discountAmount) 
//         }
//       };

//       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       onSuccess(); // Triggers the dashboard to refresh
//       onClose();   // Closes the modal
//     } catch (err) {
//       console.error("Payment Error:", err);
//       alert("Failed to process payment. Please check console.");
//     } finally {
//       setPaying(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* Header */}
//         <div className="bg-primary-600 p-6 flex justify-between items-center text-white">
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             <Receipt size={24} /> Final Bill
//           </h2>
//           <button onClick={onClose} className="hover:bg-primary-700 p-2 rounded-full transition-colors">
//             <X size={20}/>
//           </button>
//         </div>

//         {loading ? (
//           <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>
//         ) : (
//           <div className="p-6 space-y-5">
            
//             {/* Patient Info */}
//             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
//               <div>
//                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Patient</p>
//                 <h3 className="text-lg font-bold text-gray-900">{appointment?.patientId?.name || "Patient"}</h3>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Date</p>
//                 <p className="text-sm font-bold text-gray-700">
//                   {appointment?.startTime ? new Date(appointment.startTime).toLocaleDateString('en-IN') : "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* Vitals Display */}
//             {appointment?.vitals?.preBp && appointment.vitals.preBp !== "N/A" && (
//               <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between items-center text-xs">
//                 <span className="text-green-700 font-bold flex items-center gap-1"><Activity size={14}/> Vitals</span>
//                 <span className="text-green-800 font-medium">BP: {appointment.vitals.preBp}/{appointment.vitals.postBp} | Pulse: {appointment.vitals.pulse}</span>
//               </div>
//             )}

//             {/* Breakdown List */}
//             <div className="space-y-3">
//               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Itemized Charges</h4>
              
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600 flex items-center gap-2 font-medium">
//                   <Activity size={14} className="text-primary-500"/> {appointment?.treatmentName}
//                 </span>
//                 <span className="font-bold text-gray-900">₹{therapyCost.toFixed(2)}</span>
//               </div>

//               {appointment?.medicinesUsed?.map((med: any, i: number) => {
//                  const price = Number(med.priceAtTime || med.inventoryId?.price || 0);
//                  const qty = Number(med.quantity || 1);
//                  return (
//                   <div key={i} className="flex justify-between items-center text-sm pl-4 mt-2">
//                     <span className="text-gray-500 flex items-center gap-2">
//                       <Pill size={12} className="text-green-500"/> 
//                       {med.inventoryId?.name || "Medicine"} (x{qty})
//                     </span>
//                     <span className="font-semibold text-gray-700">₹{(price * qty).toFixed(2)}</span>
//                   </div>
//                  );
//               })}
//             </div>

//             <hr className="border-gray-100" />

//             {/* Math & Discount Section */}
//             <div className="space-y-3">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500 font-medium">Subtotal</span>
//                 <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
//               </div>
              
//               {/* Discount Input Block */}
//               <div className="flex items-center gap-3 bg-primary-50/50 p-3 rounded-xl border border-primary-100">
//                 <Tag size={18} className="text-primary-600" />
//                 <div className="flex-1">
//                   <label className="text-[10px] font-black text-primary-600 uppercase">Apply Discount (%)</label>
//                   <input 
//                     type="number" 
//                     min="0" 
//                     max="100" 
//                     placeholder="0" 
//                     className="w-full bg-transparent text-lg font-black text-primary-900 outline-none placeholder:text-primary-200"
//                     value={discountPercent || ""} 
//                     onChange={(e) => setDiscountPercent(Number(e.target.value))} 
//                   />
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[10px] text-primary-400 font-bold uppercase">Amount Off</p>
//                   <p className="text-sm font-black text-primary-600">- ₹{discountAmount.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Grand Total */}
//             <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
//               <div>
//                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Payable</p>
//               </div>
//               <span className="text-3xl font-black text-white">₹{finalTotal.toFixed(2)}</span>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleMarkAsPaid} 
//                 disabled={paying} 
//                 className="flex-[2] bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
//               >
//                 {paying ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20}/> Collect Payment</>}
//               </button>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }