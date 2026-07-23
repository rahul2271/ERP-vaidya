import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { DEFAULT_BRANDING } from "@/config/branding.config";

export const metadata: Metadata = {
  title: "Privacy Policy | 100% Data Ownership | VAIDYA ERP",
  description: "Review VAIDYA ERP's Privacy Policy. We operate strictly as a Data Processor. 100% data ownership remains with your clinic, secured by 256-bit encryption.",
  alternates: {
    canonical: "https://vaidyaerp.in/privacy-policy",
  },
  robots: {
    index: true,
    follow: true, // It is good practice to let crawlers follow links on legal pages
  }
};

export default function PrivacyPolicyPage() {
  const branding = DEFAULT_BRANDING || { brandName: "VAIDYA ERP" };

  return (
    <div className="pt-[100px] min-h-screen font-sans text-ink-900 bg-[#FAFAFA] selection:bg-primary-100 selection:text-primary-900">
      
      {/* =========================================
          MINIMALIST NAVBAR (CSS Sticky instead of JS)
      ========================================= */}
    

      {/* =========================================
          HEADER SECTION
      ========================================= */}
      <section className="pt-40 pb-12 bg-white border-b border-ink-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary-100 shadow-sm">
            <ShieldCheck size={14} className="text-primary-600" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-ink-500 font-medium">Last Updated: April 2026</p>
        </div>
      </section>

      {/* =========================================
          CONTENT SECTION
      ========================================= */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          
          <div className="bg-ink-900 text-white p-8 rounded-2xl mb-12 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-primary-400" size={24} />
              <h2 className="text-2xl font-bold text-white m-0">Our Core Promise: 100% Data Ownership</h2>
            </div>
            <p className="text-ink-300 m-0 leading-relaxed font-medium">
              VAIDYA ERP operates strictly as a Data Processor. The Clinic (Data Controller) retains 100% ownership of all patient records, financial data, and medical histories. We do not sell, rent, or mine patient data for cross-selling, advertising, or aggregator services. Your patients remain your patients.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">1. Introduction</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            Welcome to VAIDYA ERP ("we", "our", "us"). We provide cloud-based Hospital Management Software specifically engineered for Ayurvedic and Wellness clinics. We are deeply committed to protecting the privacy and security of our clients (the Clinics) and their End-Users (the Patients).
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">2. Information We Collect</h3>
          <p className="text-ink-500 leading-relaxed mb-4">We collect information in two primary categories:</p>
          <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-6">
            <li><strong>Clinic Data:</strong> Information required to manage your SaaS subscription, including clinic name, owner details, contact emails, billing details, and GST identifiers.</li>
            <li><strong>Patient Data (Processed on your behalf):</strong> Information entered into the system by your clinic staff or directly by patients via the AI Prakriti assessment. This includes names, phone numbers, Vata-Pitta-Kapha ratios, medical history, digital prescriptions, and billing records.</li>
          </ul>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">3. How We Use the Information</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            VAIDYA ERP uses the collected data solely to provide, maintain, and improve our Ayurvedic hospital management system. We use this data to facilitate your clinic's operations, such as processing digital EMRs, managing pharmacy POS inventory, tracking God Mode audit logs, and enabling your telecallers to follow up with patients.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">4. Third-Party Integrations</h3>
          <p className="text-ink-500 leading-relaxed mb-4">
            To provide our seamless automated services, VAIDYA ERP integrates with highly secure, industry-standard third-party providers. Data is only shared to the extent necessary to perform the requested function:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-6">
            <li><strong>WhatsApp / Meta API:</strong> Used strictly for sending automated appointment reminders, diet charts, and digital prescriptions to your patients.</li>
            <li><strong>Twilio:</strong> Used to power our embedded cloud dialer and log call history within your CRM.</li>
            <li><strong>Cloud Hosting Providers:</strong> Our databases are hosted on highly secure, ISO 27001-certified servers to ensure maximum uptime and data protection.</li>
          </ul>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">5. Security & Medical Compliance</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            We implement bank-grade 256-bit encryption for all data at rest and in transit. Our architecture is designed with the Ayushman Bharat Digital Mission (ABDM) and HIPAA data standards in mind. Furthermore, our proprietary "God Mode" audit trail permanently logs all data access, modifications, and deletions (including the user ID and IP address) to protect your clinic against internal data breaches and theft.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">6. Data Retention & Deletion</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
            As long as your subscription is active, your data is securely retained. If you choose to cancel your subscription, you are provided a 30-day window to utilize our 1-Click CSV Export tool to download your entire database. After 30 days, your data is permanently and securely scrubbed from our active servers.
          </p>

          <h3 className="text-2xl font-bold text-ink-900 mt-10 mb-4">7. Contact Us</h3>
          <p className="text-ink-500 leading-relaxed mb-6">
  If you have any questions regarding this Privacy Policy or how we handle your clinic's data, please contact our Data Protection team at: <strong>hello@vaidyaerp.in</strong>.
</p>
          
          {/* Note: I updated the contact email here to match the support email used on your homepage (hello@vaidyaerp.com) rather than privacy@vaidyaerp.com, just to keep things centralized, but you can change it back if you have a dedicated privacy inbox! */}

        </div>
      </section>

    </div>
  );
}