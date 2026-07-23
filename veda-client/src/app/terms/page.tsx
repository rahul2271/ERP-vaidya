import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, FileText } from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

// 1. Legal Page Meta Data
export const metadata: Metadata = {
  title: "Terms of Service | VAIDYA ERP",
  description: "Review the Terms of Service for VAIDYA ERP. Understand our software usage policies, medical liability disclaimers, and 0% commission SaaS structure.",
  alternates: {
    canonical: "https://vaidyaerp.in/terms-of-service", // Adjust URL based on your actual route
  },
  robots: {
    index: true,
    follow: true, 
  }
};

export default function TermsOfServicePage() {
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
            <Scale size={14} className="text-primary-600" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 tracking-tight mb-4">Terms of Service</h1>
          <p className="text-ink-500 font-medium">Last Updated: April 2026</p>
        </div>
      </section>

      {/* =========================================
          CONTENT SECTION
      ========================================= */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          
          <p className="text-ink-500 leading-relaxed mb-10 text-xl font-medium">
            By accessing or using VAIDYA ERP, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the software or use any of its services.
          </p>

          <div className="bg-ink-900 text-white p-8 rounded-2xl mb-12 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold text-white m-0">Crucial Medical Disclaimer</h2>
            </div>
            <p className="text-ink-300 m-0 leading-relaxed font-medium">
              VAIDYA ERP is a technology platform and software tool—<strong>not a medical device, healthcare provider, or diagnostic engine.</strong> The Clinic and its licensed practitioners are solely and entirely responsible for the accuracy of all prescriptions, diagnoses, AI Prakriti interpretations, and treatments entered into the system. VAIDYA ERP and its creators are strictly not liable for any medical malpractice, misdiagnosis, or patient harm resulting from human error or reliance on the software.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4 flex items-center gap-2">
            <FileText className="text-primary-600" size={20}/> 1. Subscription & 0% Commission Policy
          </h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            VAIDYA ERP operates on a strict Software-as-a-Service (SaaS) subscription model. We charge a flat, recurring fee (Monthly or Annually) for access to our platform. We do <strong>not</strong> charge any per-appointment commissions, nor do we extract hidden fees from your clinic's revenue or pharmacy sales. Your financial success is entirely your own.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">2. Service Availability & Uptime</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            We strive to maintain a 99.9% server uptime for VAIDYA ERP. However, as a cloud-native platform, our services rely on third-party infrastructure (such as cloud hosting, Twilio for telecalling, and Meta for WhatsApp APIs). We are not liable for temporary service interruptions, communication delays, or data sync issues caused by internet service provider failures or third-party outages outside of our direct control.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">3. User Responsibilities & Fair Use</h3>
          <p className="text-ink-500 leading-relaxed mb-4">As a subscriber, you agree to use VAIDYA ERP strictly for lawful clinic management purposes. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-6">
            <li>Use the WhatsApp API integration to send spam, unsolicited marketing, or non-medical promotional blasts that violate Meta's terms of service.</li>
            <li>Attempt to bypass, hack, or compromise the "God Mode" security audit logs.</li>
            <li>Share user login credentials across multiple staff members (each staff member must use their designated role-based access).</li>
          </ul>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">4. Account Suspension</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            We reserve the right to immediately suspend or terminate your clinic's access to VAIDYA ERP if you violate these Terms of Service, engage in illegal activities, misuse patient data, or fail to pay your subscription fees after the standard grace period. In the event of a payment-related suspension, your data will be held securely for 30 days before being permanently scheduled for deletion.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">5. Limitation of Liability</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            To the maximum extent permitted by applicable law, in no event shall VAIDYA ERP, its founders, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages. This includes, without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">6. Modifications to the Terms</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our software after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">7. Contact Information</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            For any legal inquiries or questions regarding these Terms of Service, please contact us at: <strong>legal@vaidyaerp.in</strong>.
          </p>

        </div>
      </section>

    </div>
  );
}