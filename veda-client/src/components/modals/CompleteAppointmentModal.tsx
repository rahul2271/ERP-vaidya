// // "use client";
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { X, Save, Pill, Plus, Trash2 } from "lucide-react";

// // export default function CompleteAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: any) {
// //   const [vitals, setVitals] = useState({ bp: "", pulse: "", weight: "" });
  
// //   // Medicine Selection State
// //   const [inventory, setInventory] = useState<any[]>([]); // List of available meds
// //   const [selectedMeds, setSelectedMeds] = useState<any[]>([]); // Meds added to this session
// //   const [loading, setLoading] = useState(false);

// //   // Fetch Inventory on Load
// //   useEffect(() => {
// //     if (isOpen) {
// //       const token = localStorage.getItem("token");
// //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, { headers: { Authorization: `Bearer ${token}` } })
// //         .then(res => setInventory(res.data))
// //         .catch(err => console.error("Failed to load inventory"));
// //     }
// //   }, [isOpen]);

// //   if (!isOpen) return null;

// //   // Add a row
// //   const addMedRow = () => {
// //     setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0 }]);
// //   };

// //   // Update a row
// //   // ✅ FIX: Auto-fill price when medicine is selected
// //   const updateMed = (index: number, field: string, value: any) => {
// //     const updated = [...selectedMeds];
// //     updated[index][field] = value;
    
// //     // If the user selected a medicine, find its price from the inventory list
// //     if (field === "inventoryId") {
// //    const selectedItem = inventory.find(i => i._id === value);
// //    if (selectedItem) {
// //       updated[index].price = selectedItem.price || 0; // ✅ This ensures the bill gets the rate
// //    }
// // }
   
// //     setSelectedMeds(updated);
// //   };

// //   // Remove a row
// //   const removeMed = (index: number) => {
// //     setSelectedMeds(selectedMeds.filter((_, i) => i !== index));
// //   };

// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");
      
// //       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/complete`, {
// //         vitals,
// //         medicines: selectedMeds.filter(m => m.inventoryId) // Send only valid rows
// //       }, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });

// //       alert("Appointment Completed & Billed!");
// //       onSuccess();
// //       onClose();
// //     } catch (err) {
// //       alert("Failed to save.");
// //     } finally { setLoading(false); }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
// //         <div className="bg-green-600 p-4 text-white flex justify-between items-center">
// //           <h3 className="font-bold">Complete Session</h3>
// //           <button onClick={onClose}><X size={20}/></button>
// //         </div>

// //         <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
// //           {/* Vitals Section */}
// //           <div>
// //              <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">Patient Vitals</h4>
// //              <div className="grid grid-cols-3 gap-3">
// //                <input placeholder="BP (120/80)" className="border p-2 rounded-lg text-sm" 
// //                  value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} />
// //                <input placeholder="Pulse (72)" className="border p-2 rounded-lg text-sm" 
// //                  value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} />
// //                <input placeholder="Weight (Kg)" className="border p-2 rounded-lg text-sm" 
// //                  value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} />
// //              </div>
// //           </div>

// //           {/* Medicines Section */}
// //           <div>
// //              <div className="flex justify-between items-center mb-2">
// //                 <h4 className="font-bold text-gray-700 text-sm uppercase flex gap-2 items-center">
// //                    <Pill size={14}/> Medicines Used
// //                 </h4>
// //                 <button onClick={addMedRow} className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-md font-bold flex items-center gap-1">
// //                    <Plus size={12}/> Add Item
// //                 </button>
// //              </div>

// //              <div className="space-y-2">
// //                {selectedMeds.map((med, index) => (
// //                  <div key={index} className="flex gap-2 items-center">
// //                     {/* Medicine Dropdown */}
// //                     <select 
// //                       className="flex-1 border p-2 rounded-lg text-sm bg-white"
// //                       value={med.inventoryId}
// //                       onChange={(e) => updateMed(index, 'inventoryId', e.target.value)}
// //                     >
// //                        <option value="">Select Medicine</option>
// //                        {inventory.map(item => (
// //                           <option key={item._id} value={item._id}>
// //                              {item.name} (₹{item.price})
// //                           </option>
// //                        ))}
// //                     </select>

// //                     {/* Quantity */}
// //                     <input 
// //                       type="number" className="w-16 border p-2 rounded-lg text-sm text-center"
// //                       value={med.quantity}
// //                       min="1"
// //                       onChange={(e) => updateMed(index, 'quantity', parseInt(e.target.value))}
// //                     />

// //                     {/* Delete Button */}
// //                     <button onClick={() => removeMed(index)} className="text-red-400 hover:text-red-600">
// //                        <Trash2 size={16}/>
// //                     </button>
// //                  </div>
// //                ))}
               
// //                {selectedMeds.length === 0 && (
// //                   <p className="text-xs text-gray-400 italic text-center py-2">No medicines added.</p>
// //                )}
// //              </div>
// //           </div>
// //         </div>

// //         <div className="p-4 border-t bg-gray-50">
// //            <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg">
// //              {loading ? "Saving..." : "Complete & Generate Bill"}
// //            </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { X, Pill, Plus, Trash2, Activity } from "lucide-react";

// export default function CompleteAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: any) {
//   // ✅ FIX: Separated preBp and postBp exactly as the backend expects
//   const [vitals, setVitals] = useState({ preBp: "", postBp: "", pulse: "", weight: "" });
//   const [inventory, setInventory] = useState<any[]>([]); 
//   const [selectedMeds, setSelectedMeds] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const token = localStorage.getItem("token");
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => setInventory(res.data))
//       .catch(err => console.error("Failed to load inventory"));
      
//       setVitals({ preBp: "", postBp: "", pulse: "", weight: "" });
//       setSelectedMeds([]);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const addMedRow = () => {
//     setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0 }]);
//   };

//   const updateMed = (index: number, field: string, value: any) => {
//     const updated = [...selectedMeds];
//     updated[index][field] = value;
    
//     // Auto-fill price
//     if (field === "inventoryId") {
//       const selectedItem = inventory.find(i => i._id === value);
//       if (selectedItem) {
//         updated[index].price = selectedItem.price || 0; 
//       }
//     }
//     setSelectedMeds(updated);
//   };

//   const removeMed = (index: number) => {
//     setSelectedMeds(selectedMeds.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       // ✅ FIX: Strict payload mapping
//       const payload = {
//         status: "COMPLETED",
//         vitals: {
//           preBp: vitals.preBp || "N/A",
//           postBp: vitals.postBp || "N/A",
//           pulse: vitals.pulse || "N/A",
//           weight: vitals.weight || "N/A"
//         },
//         medicines: selectedMeds
//           .filter(m => m.inventoryId !== "")
//           .map(m => ({
//             inventoryId: m.inventoryId,
//             quantity: Number(m.quantity),
//             price: Number(m.price) 
//           }))
//       };

//       // ✅ Hit the standard update endpoint
//       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       alert("Session Completed! Vitals and Medicines saved.");
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       alert("Failed to save session. Check connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         <div className="bg-green-600 p-5 text-white flex justify-between items-center">
//           <div>
//             <h3 className="font-bold text-lg">Finalize Treatment</h3>
//             <p className="text-xs text-green-100 font-medium">Record vitals and dispense medicines</p>
//           </div>
//           <button onClick={onClose} className="hover:bg-green-700 p-2 rounded-full transition-colors"><X size={20}/></button>
//         </div>

//         <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
//           {/* Vitals Section */}
//           <div className="space-y-3">
//              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                <Activity size={14} className="text-green-500"/> Patient Vitals
//              </h4>
//              <div className="grid grid-cols-2 gap-4">
//                <div>
//                  <label className="text-[10px] font-bold text-gray-500 ml-1">PRE-BP</label>
//                  <input placeholder="120" className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                    value={vitals.preBp} onChange={e => setVitals({...vitals, preBp: e.target.value})} />
//                </div>
//                <div>
//                  <label className="text-[10px] font-bold text-gray-500 ml-1">POST-BP</label>
//                  <input placeholder="80" className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                    value={vitals.postBp} onChange={e => setVitals({...vitals, postBp: e.target.value})} />
//                </div>
//              </div>
//              <div className="grid grid-cols-2 gap-4">
//                <input placeholder="Pulse (bpm)" className="border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                  value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} />
//                <input placeholder="Weight (kg)" className="border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                  value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} />
//              </div>
//           </div>

//           <hr className="border-gray-100" />

//           {/* Medicines Section */}
//           <div className="space-y-3">
//              <div className="flex justify-between items-center">
//                 <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                    <Pill size={14} className="text-primary-500"/> Medicines Dispensed
//                 </h4>
//                 <button onClick={addMedRow} className="text-[10px] bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full font-black flex items-center gap-1 hover:bg-primary-100">
//                    <Plus size={12}/> ADD MEDICINE
//                 </button>
//              </div>

//              <div className="space-y-3">
//                {selectedMeds.map((med, index) => (
//                  <div key={index} className="flex gap-2 items-start">
//                     <div className="flex-1">
//                       <select 
//                         className="w-full border p-3 rounded-xl text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
//                         value={med.inventoryId}
//                         onChange={(e) => updateMed(index, 'inventoryId', e.target.value)}
//                       >
//                          <option value="">Select Item</option>
//                          {inventory.map(item => (
//                             <option key={item._id} value={item._id}>
//                                {item.name} (₹{item.price})
//                             </option>
//                          ))}
//                       </select>
//                     </div>
//                     <input 
//                       type="number" className="w-20 border p-3 rounded-xl text-sm text-center bg-gray-50 outline-none"
//                       value={med.quantity} min="1"
//                       onChange={(e) => updateMed(index, 'quantity', parseInt(e.target.value) || 1)}
//                     />
//                     <button onClick={() => removeMed(index)} className="p-3 text-red-400 hover:text-red-600 bg-red-50 rounded-xl">
//                        <Trash2 size={18}/>
//                     </button>
//                  </div>
//                ))}
               
//                {selectedMeds.length === 0 && (
//                   <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
//                     <p className="text-xs text-gray-400 font-medium italic">No medicines assigned.</p>
//                   </div>
//                )}
//              </div>
//           </div>
//         </div>

//         <div className="p-5 border-t bg-gray-50 flex gap-3">
//            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
//            <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg">
//              {loading ? "Processing..." : "Complete Session"}
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import axios from "@/utils/axiosConfig"; // Or standard axios if you prefer
// import { X, Pill, Plus, Trash2, Activity } from "lucide-react";

// export default function CompleteAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: any) {
//   const [vitals, setVitals] = useState({ preBp: "", postBp: "", pulse: "", weight: "" });
//   const [inventory, setInventory] = useState<any[]>([]); 
//   const [selectedMeds, setSelectedMeds] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       // 1. Fetch Inventory for the dropdowns
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       })
//       .then(res => setInventory(res.data))
//       .catch(err => console.error("Failed to load inventory"));
      
//       // Reset form
//       setVitals({ preBp: "", postBp: "", pulse: "", weight: "" });
//       setSelectedMeds([]);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const addMedRow = () => {
//     setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0 }]);
//   };

//   const updateMed = (index: number, field: string, value: any) => {
//     const updated = [...selectedMeds];
//     updated[index][field] = value;
    
//     // ✅ CRITICAL FIX: Automatically find and attach the exact price from Inventory!
//     if (field === "inventoryId") {
//       const selectedItem = inventory.find(i => i._id === value);
//       if (selectedItem) {
//         updated[index].price = selectedItem.price || 0; 
//       } else {
//         updated[index].price = 0;
//       }
//     }
//     setSelectedMeds(updated);
//   };

//   const removeMed = (index: number) => {
//     setSelectedMeds(selectedMeds.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       // ✅ Payload sends the attached price to the backend
//       const payload = {
//         status: "COMPLETED",
//         vitals: {
//           preBp: vitals.preBp || "N/A",
//           postBp: vitals.postBp || "N/A",
//           pulse: vitals.pulse || "N/A",
//           weight: vitals.weight || "N/A"
//         },
//         medicines: selectedMeds
//           .filter(m => m.inventoryId !== "") // Ignore empty rows
//           .map(m => ({
//             inventoryId: m.inventoryId,
//             quantity: Number(m.quantity),
//             price: Number(m.price) // Send the captured price
//           }))
//       };

//       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       alert("Session Completed! Vitals and Medicines saved.");
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       alert("Failed to save session. Check connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         <div className="bg-green-600 p-5 text-white flex justify-between items-center">
//           <div>
//             <h3 className="font-bold text-lg">Finalize Treatment</h3>
//             <p className="text-xs text-green-100 font-medium">Record vitals and dispense medicines</p>
//           </div>
//           <button onClick={onClose} className="hover:bg-green-700 p-2 rounded-full transition-colors"><X size={20}/></button>
//         </div>

//         <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
//           {/* Vitals Section */}
//           <div className="space-y-3">
//              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                <Activity size={14} className="text-green-500"/> Patient Vitals
//              </h4>
//              <div className="grid grid-cols-2 gap-4">
//                <div>
//                  <label className="text-[10px] font-bold text-gray-500 ml-1">PRE-BP</label>
//                  <input placeholder="120" className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                    value={vitals.preBp} onChange={e => setVitals({...vitals, preBp: e.target.value})} />
//                </div>
//                <div>
//                  <label className="text-[10px] font-bold text-gray-500 ml-1">POST-BP</label>
//                  <input placeholder="80" className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-gray-50" 
//                    value={vitals.postBp} onChange={e => setVitals({...vitals, postBp: e.target.value})} />
//                </div>
//              </div>
//           </div>

//           <hr className="border-gray-100" />

//           {/* Medicines Section */}
//           <div className="space-y-3">
//              <div className="flex justify-between items-center">
//                 <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                    <Pill size={14} className="text-primary-500"/> Medicines Dispensed
//                 </h4>
//                 <button onClick={addMedRow} className="text-[10px] bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full font-black flex items-center gap-1 hover:bg-primary-100">
//                    <Plus size={12}/> ADD MEDICINE
//                 </button>
//              </div>

//              <div className="space-y-3">
//                {selectedMeds.map((med, index) => (
//                  <div key={index} className="flex gap-2 items-start">
//                     <div className="flex-1">
//                       <select 
//                         className="w-full border p-3 rounded-xl text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
//                         value={med.inventoryId}
//                         onChange={(e) => updateMed(index, 'inventoryId', e.target.value)}
//                       >
//                          <option value="">Select Medicine...</option>
//                          {inventory.map(item => (
//                             <option key={item._id} value={item._id}>
//                                {item.name} (₹{item.price})
//                             </option>
//                          ))}
//                       </select>
//                     </div>
//                     <input 
//                       type="number" className="w-20 border p-3 rounded-xl text-sm text-center bg-gray-50 outline-none"
//                       value={med.quantity} min="1"
//                       onChange={(e) => updateMed(index, 'quantity', parseInt(e.target.value) || 1)}
//                     />
//                     <button onClick={() => removeMed(index)} className="p-3 text-red-400 hover:text-red-600 bg-red-50 rounded-xl">
//                        <Trash2 size={18}/>
//                     </button>
//                  </div>
//                ))}
               
//                {selectedMeds.length === 0 && (
//                   <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
//                     <p className="text-xs text-gray-400 font-medium italic">No medicines assigned.</p>
//                   </div>
//                )}
//              </div>
//           </div>
//         </div>

//         <div className="p-5 border-t bg-gray-50 flex gap-3">
//            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
//            <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg">
//              {loading ? "Processing..." : "Complete Session"}
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import axios from "@/utils/axiosConfig";
// import { X, Pill, Plus, Trash2, Activity, Stethoscope, CalendarDays } from "lucide-react";

// export default function CompleteAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: any) {
//   const [vitals, setVitals] = useState({ preBp: "", postBp: "", pulse: "", weight: "" });
//   const [inventory, setInventory] = useState<any[]>([]); 
//   const [selectedMeds, setSelectedMeds] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(false);

//   // 🚀 NEW: State for Recommended Therapies and Follow-up
//   const [recommendedTherapies, setRecommendedTherapies] = useState<any[]>([]);
//   const [nextFollowUp, setNextFollowUp] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       })
//       .then(res => setInventory(res.data))
//       .catch(err => console.error("Failed to load inventory"));
      
//       setVitals({ preBp: "", postBp: "", pulse: "", weight: "" });
//       setSelectedMeds([]);
//       setRecommendedTherapies([]); // Reset recommendations
//       setNextFollowUp(""); // Reset follow-up
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // --- MEDICINE LOGIC ---
//   const addMedRow = () => setSelectedMeds([...selectedMeds, { inventoryId: "", quantity: 1, price: 0 }]);
//   const updateMed = (index: number, field: string, value: any) => {
//     const updated = [...selectedMeds];
//     updated[index][field] = value;
//     if (field === "inventoryId") {
//       const selectedItem = inventory.find(i => i._id === value);
//       updated[index].price = selectedItem ? (selectedItem.price || 0) : 0;
//     }
//     setSelectedMeds(updated);
//   };
//   const removeMed = (index: number) => setSelectedMeds(selectedMeds.filter((_, i) => i !== index));

//   // 🚀 NEW: THERAPY LOGIC
//   const addTherapyRow = () => setRecommendedTherapies([...recommendedTherapies, { treatmentName: "", notes: "" }]);
//   const updateTherapy = (index: number, field: string, value: string) => {
//     const updated = [...recommendedTherapies];
//     updated[index][field] = value;
//     setRecommendedTherapies(updated);
//   };
//   const removeTherapy = (index: number) => setRecommendedTherapies(recommendedTherapies.filter((_, i) => i !== index));

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         status: "COMPLETED",
//         vitals: {
//           preBp: vitals.preBp || "N/A",
//           postBp: vitals.postBp || "N/A",
//           pulse: vitals.pulse || "N/A",
//           weight: vitals.weight || "N/A"
//         },
//         medicines: selectedMeds.filter(m => m.inventoryId !== ""),
//         // 🚀 NEW FIELDS SENT TO BACKEND
//         recommendedTherapies: recommendedTherapies.filter(t => t.treatmentName !== ""),
//         nextFollowUpDate: nextFollowUp || null
//       };

//       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       alert("Consultation Finalized! Data sent to Front Desk.");
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       alert("Failed to save session.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         <div className="bg-green-600 p-5 text-white flex justify-between items-center">
//           <div>
//             <h3 className="font-bold text-lg text-white">Finalize Consultation</h3>
//             <p className="text-xs text-green-100 font-medium">Complete vitals, meds, and recommendations</p>
//           </div>
//           <button onClick={onClose} className="hover:bg-green-700 p-2 rounded-full transition-colors text-white"><X size={20}/></button>
//         </div>

//         <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
//           {/* VITALS SECTION */}
//           <div className="space-y-3">
//              <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                <Activity size={14} className="text-green-500"/> Patient Vitals
//              </h4>
//              <div className="grid grid-cols-4 gap-3">
//                 {['preBp', 'postBp', 'pulse', 'weight'].map((v) => (
//                   <div key={v}>
//                     <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">{v}</label>
//                     <input className="w-full border p-2 rounded-lg text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-green-500" 
//                       value={(vitals as any)[v]} onChange={e => setVitals({...vitals, [v]: e.target.value})} />
//                   </div>
//                 ))}
//              </div>
//           </div>

//           <hr className="border-gray-100" />

//           {/* 🚀 NEW: THERAPY RECOMMENDATIONS SECTION */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                 <Stethoscope size={14} className="text-purple-500"/> Recommended Therapies
//               </h4>
//               <button onClick={addTherapyRow} className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-black flex items-center gap-1 hover:bg-purple-100">
//                 <Plus size={12}/> ADD THERAPY
//               </button>
//             </div>
//             {recommendedTherapies.map((th, idx) => (
//               <div key={idx} className="flex gap-2 items-start bg-purple-50/30 p-2 rounded-xl border border-purple-50">
//                 <input placeholder="Therapy Name (e.g. Basti)" className="flex-1 border p-2 rounded-lg text-xs outline-none" 
//                   value={th.treatmentName} onChange={e => updateTherapy(idx, 'treatmentName', e.target.value)} />
//                 <input placeholder="Notes/Duration" className="flex-1 border p-2 rounded-lg text-xs outline-none" 
//                   value={th.notes} onChange={e => updateTherapy(idx, 'notes', e.target.value)} />
//                 <button onClick={() => removeTherapy(idx)} className="p-2 text-red-400"><Trash2 size={16}/></button>
//               </div>
//             ))}
//           </div>

//           <hr className="border-gray-100" />

//           {/* MEDICINES SECTION */}
//           <div className="space-y-3">
//              <div className="flex justify-between items-center">
//                 <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//                    <Pill size={14} className="text-primary-500"/> Prescribed Medicines
//                 </h4>
//                 <button onClick={addMedRow} className="text-[10px] bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full font-black flex items-center gap-1 hover:bg-primary-100">
//                    <Plus size={12}/> ADD MEDICINE
//                 </button>
//              </div>
//              <div className="space-y-2">
//                {selectedMeds.map((med, index) => (
//                  <div key={index} className="flex gap-2">
//                     <select className="flex-1 border p-2 rounded-lg text-xs bg-gray-50 outline-none" value={med.inventoryId} onChange={(e) => updateMed(index, 'inventoryId', e.target.value)}>
//                       <option value="">Select...</option>
//                       {inventory.map(item => <option key={item._id} value={item._id}>{item.name} (₹{item.price})</option>)}
//                     </select>
//                     <input type="number" className="w-16 border p-2 rounded-lg text-xs text-center" value={med.quantity} onChange={(e) => updateMed(index, 'quantity', parseInt(e.target.value) || 1)} />
//                     <button onClick={() => removeMed(index)} className="p-2 text-red-400"><Trash2 size={16}/></button>
//                  </div>
//                ))}
//              </div>
//           </div>

//           <hr className="border-gray-100" />

//           {/* 🚀 NEW: NEXT FOLLOW-UP SECTION */}
//           <div className="space-y-3">
//             <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
//               <CalendarDays size={14} className="text-orange-500"/> Next Follow-up
//             </h4>
//             <input type="date" className="w-full border p-3 rounded-xl text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500" 
//               value={nextFollowUp} onChange={e => setNextFollowUp(e.target.value)} />
//           </div>
//         </div>

//         <div className="p-5 border-t bg-gray-50 flex gap-3">
//            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 text-sm">Cancel</button>
//            <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg text-sm transition-all">
//              {loading ? "Saving..." : "Finalize & Notify Front Desk"}
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }