"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "@/utils/axiosConfig"; 
import { useParams, useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, Building2 } from "lucide-react";

function InvoiceContent() {
  const { id } = useParams(); 
  const searchParams = useSearchParams();
  const apptId = searchParams.get("apptId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        let patientData: any = { _id: id, name: "Patient Record", age: "-", gender: "-", mobile: "-" };
        let hospital: any = {};
        
        try {
          const patientRes = await axios.get(`/patients/${id}`, config);
          patientData = patientRes.data;
          hospital = patientData.hospitalId || {};
        } catch(e) { console.warn("Patient profile fetch failed, using fallback."); }

        let financialSummary: any = {};

        if (apptId) {
          const apptRes = await axios.get(`/appointments/${apptId}`, config);
          const appt = apptRes.data;

          const medItems = appt.medicinesUsed?.map((m: any) => ({
              name: m.inventoryId?.name || "Ayurvedic Medicine",
              qty: m.quantity || 1,
              unitPrice: m.priceAtTime || 0,
              total: (m.quantity || 1) * (m.priceAtTime || 0)
          })) || [];

          const baseAmount = appt.amount || 0; 
          const medsTotal = medItems.reduce((sum: number, curr: any) => sum + curr.total, 0);

          financialSummary = {
              paymentStatus: appt.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : 'PAYMENT DUE',
              subtotal: appt.finalBilledAmount || (baseAmount + medsTotal),
              totalDiscount: appt.discount?.amount || 0,
              finalAmount: appt.finalBilledAmount || (baseAmount + medsTotal),
              invoiceDate: appt.startTime,
              sections: {
                  therapies: { items: [{ name: appt.treatmentName || "Consultation", cost: baseAmount }] },
                  medicines: { items: medItems }
              }
          };

        } else {
          const billingRes = await axios.get(`/appointments/patient/${id}/billing`, config);
          const billing = billingRes.data;
          
          financialSummary = {
              paymentStatus: billing.totalDue > 0 ? 'PAYMENT DUE' : 'PAID',
              subtotal: billing.subtotal,
              totalDiscount: billing.totalDiscount,
              finalAmount: billing.finalAmount,
              invoiceDate: new Date().toISOString(),
              sections: billing.sections
          };
        }

        const locationString = [hospital.address, hospital.city, hospital.state].filter(Boolean).join(", ");

        setData({
          hospitalDetails: { 
            name: hospital.name || "Veda Medical Center", 
            logo: hospital.logo || "",
            tagline: hospital.tagline || "",
            location: locationString || "Main Clinic", 
            contact: hospital.phone || "N/A",
            gstNumber: hospital.gstNumber || "",
            regNumber: hospital.registrationNumber || ""
          },
          patientProfile: {
            id: patientData._id || id,
            uhid: patientData.uhid || "Pending",
            name: patientData.name || "Patient Record",
            age: patientData.age || "N/A",
            gender: patientData.gender || "N/A",
            mobile: patientData.mobile || "N/A"
          },
          financialSummary
        });

      } catch (err) { 
        console.error("Invoice generation error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    
    if (id) fetchInvoice();
  }, [id, apptId]);

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-500">Generating Invoice...</div>;
  if (!data) return <div className="p-10 text-red-500 text-center font-bold">Invoice data unavailable.</div>;

  const financial = data.financialSummary;
  const isPaid = financial?.paymentStatus?.toUpperCase() === 'PAID';
  const invoiceNo = `INV-${new Date(financial.invoiceDate || new Date()).getFullYear()}-${data.patientProfile?.id?.slice(-5).toUpperCase()}`;

  return (
    <>
      {/* 🚀 PRINT MAGIC CSS: Strips Dashboard UI and makes Invoice full-width */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page { size: A4 portrait; margin: 10mm; }
        }
      `}} />

      <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-6 px-4 md:px-0">
        
        {/* ACTION BAR (Hidden during print) */}
        <div className="flex justify-between print:hidden no-print">
          <button onClick={() => window.close()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={18}/> Close
          </button>
          <button onClick={() => window.print()} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition shadow-lg font-bold">
            <Printer size={18}/> Print Invoice
          </button>
        </div>

        {/* 📄 THE PRINTABLE INVOICE PAPER */}
        <div id="printable-invoice" className="bg-white p-8 md:p-12 shadow-2xl border border-gray-200 rounded-sm text-black print:shadow-none print:border-none print:p-0">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
            <div className="flex items-start gap-4">
              {data.hospitalDetails?.logo ? (
                <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                  <img 
                    src={data.hospitalDetails.logo} 
                    alt="Clinic Logo" 
                    className="max-w-full max-h-full object-contain mix-blend-multiply" 
                  />
                </div>
              ) : (
                <div className="bg-primary-900 text-white p-3.5 rounded-xl shadow-sm shrink-0">
                  <Building2 size={36} />
                </div>
              )}

              <div>
                <h1 className="text-2xl font-black text-primary-900 uppercase tracking-wider">
                  {data.hospitalDetails?.name}
                </h1>
                {data.hospitalDetails?.tagline && (
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1.5">
                    {data.hospitalDetails.tagline}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-500 mt-1">{data.hospitalDetails?.location}</p>
                <p className="text-sm font-medium text-gray-500">Ph: {data.hospitalDetails?.contact}</p>
                
                {(data.hospitalDetails?.gstNumber || data.hospitalDetails?.regNumber) && (
                  <p className="text-xs font-bold text-gray-400 mt-2 flex gap-3">
                    {data.hospitalDetails?.gstNumber && <span>GSTIN: {data.hospitalDetails.gstNumber}</span>}
                    {data.hospitalDetails?.regNumber && <span>REG NO: {data.hospitalDetails.regNumber}</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
              <p className="text-sm font-bold text-gray-800">No: <span className="text-gray-500 font-medium">{invoiceNo}</span></p>
              <p className="text-sm font-bold text-gray-800">Date: <span className="text-gray-500 font-medium">{new Date(financial.invoiceDate).toLocaleDateString('en-IN')}</span></p>
            </div>
          </div>

          {/* PATIENT DETAILS SECTION */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 flex justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Billed To</p>
              <h3 className="text-lg font-bold text-gray-900">{data.patientProfile?.name}</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">UHID: {data.patientProfile?.uhid}</p>
              <p className="text-sm text-gray-600 mt-1">Age/Sex: {data.patientProfile?.age} / {data.patientProfile?.gender}</p>
              <p className="text-sm text-gray-600">Mobile: {data.patientProfile?.mobile}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Status</p>
              <p className={`text-xl font-black uppercase ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                {isPaid ? 'PAID' : 'PAYMENT DUE'}
              </p>
            </div>
          </div>

          {/* ITEMIZED TABLE */}
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="bg-primary-900 text-white text-[10px] uppercase tracking-widest">
                <th className="p-3 rounded-tl-lg">#</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Rate (₹)</th>
                <th className="p-3 text-right rounded-tr-lg">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 border-b border-gray-100">
              {financial?.sections?.therapies?.items?.map((item: any, i: number) => (
                <tr key={`therapy-${i}`}>
                  <td className="p-3 text-gray-400">{(i + 1).toString().padStart(2, '0')}</td>
                  <td className="p-3 font-semibold text-gray-800">
                    {item.name} <br/><span className="text-[10px] text-gray-400 font-normal uppercase">Therapy / Procedure (SAC: 99931)</span>
                  </td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-right text-gray-600">{item.cost.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-gray-900">{item.cost.toFixed(2)}</td>
                </tr>
              ))}

              {financial?.sections?.medicines?.items?.map((item: any, i: number) => {
                const baseIdx = financial?.sections?.therapies?.items?.length || 0;
                const rowNum = (baseIdx + i + 1).toString().padStart(2, '0');
                return (
                  <tr key={`med-${i}`}>
                    <td className="p-3 text-gray-400">{rowNum}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {item.name} <br/><span className="text-[10px] text-gray-400 font-normal uppercase">Medicine / Pharmacy (HSN: 30049011)</span>
                    </td>
                    <td className="p-3 text-center">{item.qty}</td>
                    <td className="p-3 text-right text-gray-600">{item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-gray-900">{item.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* CALCULATIONS & TOTALS */}
          <div className="flex justify-end mb-12">
            <div className="w-72 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{financial?.subtotal?.toFixed(2)}</span>
              </div>
              
              {financial?.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount Applied:</span>
                  <span>- ₹{financial?.totalDiscount?.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-black text-primary-900 pt-2 border-t border-gray-100">
                <span>Grand Total:</span>
                <span>₹{financial?.finalAmount?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600 font-bold pt-2">
                <span>Amount Paid:</span>
                <span className={isPaid ? "text-green-600" : "text-gray-400"}>
                  {isPaid ? `₹${financial?.finalAmount?.toFixed(2)}` : "₹0.00"}
                </span>
              </div>
              
              <div className="flex justify-between text-lg font-black pt-2 bg-gray-50 p-2 rounded-lg">
                <span>Balance Due:</span>
                <span className={isPaid ? "text-gray-400" : "text-red-600"}>
                  {isPaid ? "₹0.00" : `₹${financial?.finalAmount?.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t-2 border-gray-100 pt-6 flex justify-between items-end text-xs text-gray-400">
            <div>
              <p className="font-bold text-gray-600 mb-1">Terms & Conditions:</p>
              <p>1. Consultation and therapy fees are non-refundable.</p>
              <p>2. Medicines can only be exchanged within 7 days with this original invoice.</p>
              <p>3. This is a computer-generated invoice and requires no signature.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-12 border-b border-gray-300 mb-2"></div>
              <p className="font-bold text-gray-600">Authorized Signatory</p>
              <p className="text-[10px] text-gray-400 font-medium">{data.hospitalDetails?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-400 animate-pulse">Loading Invoice Engine...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}