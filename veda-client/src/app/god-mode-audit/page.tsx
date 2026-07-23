import { Metadata } from "next";
import GodModeAuditClient from "@/components/GodModeAuditClient"; // Update path if needed

// 1. Security-Focused, High-Intent Meta Data
export const metadata: Metadata = {
  title: "Clinic Security & Audit Trail Software | VAIDYA ERP",
  description: "Immutable audit logs track every user, action, and IP address. Know exactly who edited or deleted a record, in real time.",
  keywords: [
    "clinic data security software",
    "clinic audit trail software India",
    "hospital audit trail software",
    "secure EMR India",
    "anti-theft clinic software",
    "Ayurvedic Clinic Data Security"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/god-mode", // Adjust URL based on your actual route
  },
  openGraph: {
    title: "God Mode Audit Trail | Secure Your Clinic | VAIDYA ERP",
    description: "End the mystery. Get an unalterable, behind-the-scenes look at exactly who deleted bills or altered patient records in your clinic.",
    url: "https://vaidyaerp.in/god-mode",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/audit_trail_dashboard.png", // Replace with an actual screenshot of the Audit Log UI
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP Immutable Audit Trail System Log",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "God Mode Audit Trail | VAIDYA ERP",
    description: "Catch every deleted bill instantly. VAIDYA ERP permanently logs every edit, deletion, and IP address for absolute peace of mind.",
  },
};

export default function GodModePage() {
  // 2. AEO Schema: Defining the exact security capabilities for AI Bots
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP - God Mode Security & Audit Trail",
    "applicationCategory": "SecurityApplication", // Note the specific category for AI context
    "operatingSystem": "Web-based, Cloud",
    "description": "An immutable audit trail and security module for clinics that tracks every user action, deletion, and IP address to prevent data tampering and unauthorized access.",
    "url": "https://vaidyaerp.in/god-mode",
    "provider": {
      "@type": "Organization",
      "name": "VAIDYA ERP"
    },
    "featureList": [
      "Immutable Master Audit Trail",
      "Network & IP Address Tracking",
      "Deleted Invoice Tracking",
      "Staff Action Accountability Logging"
    ]
  };

  // 3. FAQ Schema: Answering high-intent security queries to capture rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I track deleted bills or altered records in my clinic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VAIDYA ERP's God Mode maintains an immutable master audit trail. Every time an invoice is deleted, a discount is applied, or a patient record is altered, the system logs the exact timestamp, user ID, and IP address."
        }
      },
      {
        "@type": "Question",
        "name": "Can staff members edit or delete the clinic's audit logs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The audit logs in VAIDYA ERP are completely immutable. They cannot be edited, paused, or deleted by anyone, ensuring total data security and staff accountability."
        }
      },
      {
        "@type": "Question",
        "name": "Does the system track remote or unauthorized access?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every action logged in VAIDYA ERP captures the exact network IP address used by the device, allowing clinic administrators to verify if an action was taken inside the clinic or from an unauthorized remote location."
        }
      }
    ]
  };

  return (
    <>
      {/* Inject Schema into the DOM for Search Engines and AI Overviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Load the secure UI client component */}
      <GodModeAuditClient />
    </>
  );
}