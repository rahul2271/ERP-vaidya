import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCcw, CreditCard, AlertCircle, Database } from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | VAIDYA ERP",
  description: "Review VAIDYA ERP's Refund and Cancellation Policy. Understand our 7-day risk-free trial, subscription cancellation process, and data export guidelines.",
  alternates: {
    canonical: "https://vaidyaerp.in/refund-policy",
  },
  robots: {
    index: true,
    follow: true, 
  }
};

export default function RefundPolicyPage() {
  const branding = DEFAULT_BRANDING || { brandName: "VAIDYA ERP" };

  return (
    <div className="pt-[100px] min-h-screen font-sans text-ink-900 bg-[#FAFAFA] selection:bg-primary-100 selection:text-primary-900">
      
      {/* =========================================
          MINIMALIST NAVBAR (CSS Sticky)
      ========================================= */}
  

      {/* =========================================
          HEADER SECTION
      ========================================= */}
      <section className="pt-24 pb-12 bg-white border-b border-ink-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary-100 shadow-sm">
            <RefreshCcw size={14} className="text-primary-600" /> Billing & Subscriptions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 tracking-tight mb-4">Refund & Cancellation Policy</h1>
          <p className="text-ink-500 font-medium">Last Updated: April 2026</p>
        </div>
      </section>

      {/* =========================================
          CONTENT SECTION
      ========================================= */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          
          <p className="text-ink-500 leading-relaxed mb-10 text-xl font-medium">
            At VAIDYA ERP, we believe in complete transparency. Our software is designed to be the ultimate command center for your clinic, and we want you to feel completely confident before committing to a paid subscription.
          </p>

          <div className="bg-ink-900 text-white p-8 rounded-2xl mb-12 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold text-white m-0">The 7-Day Risk-Free Trial</h2>
            </div>
            <p className="text-ink-300 m-0 leading-relaxed font-medium">
              We offer a fully functional 7-Day Free Trial to all new clinics. You have full access to the Digital EMR, Pharmacy POS, God Mode Audit Trail, and the WhatsApp CRM. We highly encourage your doctors and staff to rigorously test the software during this period. <strong>Because we offer this trial, all subsequent subscription payments are final.</strong>
            </p>
          </div>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4 flex items-center gap-2">
            <AlertCircle className="text-primary-600" size={20}/> 1. Strict Non-Refundable Policy
          </h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            Due to the nature of our cloud-based SaaS infrastructure (where server space, dedicated database clusters, and WhatsApp API credits are provisioned for your clinic the moment you subscribe), <strong>we do not offer refunds, partial refunds, or pro-rated credits</strong> for any active subscription plan (whether Monthly or Annually). 
            <br/><br/>
            Once a payment is successfully processed via our payment gateway (e.g., Razorpay, Stripe), the sale is considered final.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">2. Subscription Cancellations</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            You may cancel your VAIDYA ERP subscription at any time to prevent future billing. You can do this directly from your Admin Dashboard or by contacting our support team.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-ink-500 mb-6">
            <li><strong>Monthly Plans:</strong> If you cancel a monthly subscription, the cancellation will take effect at the end of your current billing cycle. You will retain full access to the software until that date, and you will not be billed for the following month.</li>
            <li><strong>Annual Plans:</strong> If you cancel an annual subscription, you will not receive a refund for the remaining months. However, your clinic will continue to have full access to VAIDYA ERP until the end of the 12-month cycle you paid for.</li>
          </ul>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4 flex items-center gap-2">
            <Database className="text-primary-600" size={20}/> 3. Data Export & Deletion Upon Cancellation
          </h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            We believe you should always own your data. If you choose to cancel your subscription:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-ink-500 mb-6">
            <li>You will have a <strong>30-day grace period</strong> after your subscription officially ends to log in (in restricted read-only mode) and use our "1-Click CSV Export" feature.</li>
            <li>This allows you to securely download your entire patient database, appointment history, and financial billing records.</li>
            <li>After this 30-day period expires, to comply with medical privacy standards, your clinic's database will be permanently and irreversibly wiped from our secure cloud servers.</li>
          </ul>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">4. Exceptional Circumstances</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            If you have been double-billed due to a technical glitch on our payment gateway, please contact us immediately at <strong>billing@vaidyaerp.in</strong> with your transaction ID. Such verified technical errors will be reversed back to your original payment method within 5-7 business days.
          </p>

        </div>
      </section>

    </div>
  );
}