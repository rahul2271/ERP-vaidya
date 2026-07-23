import { Metadata } from "next";
import PharmacyPOSClient from "@/components/PharmacyPOSClient"; // Update path if needed

// 1. Revenue & Inventory-Focused Meta Data
export const metadata: Metadata = {
  title: "Ayurvedic Pharmacy POS & Inventory Software | VAIDYA ERP",
  description: "Auto-deduct stock when doctors prescribe. Track expiries, stop silent leaks, and run your Ayurvedic pharmacy counter from one connected system.",
  keywords: [
    "ayurvedic pharmacy software",
    "pharmacy inventory management ayurveda",
    "clinic pharmacy POS India",
    "herbal medicine inventory software",
    "ayurvedic pharmacy inventory software with expiry tracking",
    "Ayurvedic Hospital Billing System"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/pharmacy-pos", // Adjust URL based on your actual route
  },
  openGraph: {
    title: "Pharmacy POS & Inventory Management | VAIDYA ERP",
    description: "Close the gap between prescription and payment. Generate GST invoices and track expiring medicines instantly.",
    url: "https://vaidyaerp.in/pharmacy-pos",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/pharmacy_pos_dashboard.png", // Replace with an actual screenshot of the POS UI
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP Pharmacy POS Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayurvedic Pharmacy POS | VAIDYA ERP",
    description: "When a doctor hits 'Prescribe', the medicines are instantly waiting in the Pharmacy POS cart. Stop double data entry today.",
  },
};

export default function PharmacyPOSPage() {
  // 2. AEO Schema: Defining the exact POS capabilities for AI Bots
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP - Pharmacy POS & Inventory Module",
    "applicationCategory": "BusinessApplication", // Broadened category for POS/Inventory search intent
    "operatingSystem": "Web-based, Cloud",
    "description": "A comprehensive Pharmacy POS and Inventory Management system tailored for Ayurvedic clinics, featuring EMR auto-sync, live stock deduction, and GST billing.",
    "url": "https://vaidyaerp.in/pharmacy-pos",
    "provider": {
      "@type": "Organization",
      "name": "VAIDYA ERP"
    },
    "featureList": [
      "EMR Auto-Sync to POS Queue",
      "Live Stock Auto-Deduction",
      "GST Compliant Billing & Invoicing",
      "Smart Expiry & Low Stock Alerts",
      "Integrated Revenue Tracking"
    ]
  };

  // 3. FAQ Schema: Answering high-intent queries about inventory control and billing
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does VAIDYA ERP stop pharmacy inventory leakage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VAIDYA ERP connects the doctor's EMR directly to the Pharmacy POS. When a doctor prescribes a medicine, it is instantly sent to the billing queue. The moment the bill is generated, the exact quantities are automatically deducted from the master inventory, eliminating discrepancies."
        }
      },
      {
        "@type": "Question",
        "name": "Can the software track medicine expiry dates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. VAIDYA ERP's inventory system actively tracks batch numbers and expiry dates. It provides smart alerts to warn clinic staff before expensive medicines or oils expire, preventing financial loss."
        }
      },
      {
        "@type": "Question",
        "name": "Does the pharmacy software generate GST invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The VAIDYA ERP Pharmacy POS is fully equipped for lightning-fast checkout, allowing pharmacists to generate legally compliant GST invoices in a single click."
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
      
      {/* Load the interactive POS client component */}
      <PharmacyPOSClient />
    </>
  );
}