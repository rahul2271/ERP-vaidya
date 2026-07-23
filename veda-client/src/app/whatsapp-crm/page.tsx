import { Metadata } from "next";
import WhatsAppCRMClient from "@/components/WhatsAppCRMClient"; // Update path if needed

// 1. High-Intent, Feature-Specific Meta Data
export const metadata: Metadata = {
  title: "WhatsApp CRM & Clinic Marketing Automation | VAIDYA ERP",
  description: "Automate patient follow-ups, appointment reminders, and diet charts. VAIDYA ERP features a built-in WhatsApp CRM with 0% message markup via our BYO API model.",
  keywords: [
    "Clinic WhatsApp CRM",
    "Healthcare Marketing Automation",
    "Ayurvedic Patient Follow-up Software",
    "Bring Your Own WhatsApp API Clinic",
    "Automated Appointment Reminders",
    "Cloud Dialer for Clinics"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/whatsapp-crm", // Adjust URL as needed
  },
  openGraph: {
    title: "WhatsApp CRM & Cloud Dialer | VAIDYA ERP",
    description: "Stop juggling three different mobile phones. Centralize your clinic's communication instantly with our browser-based WhatsApp integration.",
    url: "https://vaidyaerp.in/whatsapp-crm",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/whatsapp_crm_dashboard.png", // Replace with an actual screenshot of your CRM UI
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP WhatsApp CRM Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp CRM & Clinic Marketing | VAIDYA ERP",
    description: "Send diet charts, prescriptions, and appointment reminders automatically without ever picking up a physical device.",
  },
};

export default function WhatsAppCRMPage() {
  // 2. AEO Schema: Defining the exact CRM capabilities for AI Bots
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP - WhatsApp CRM & Cloud Dialer",
    "applicationCategory": "CRMApplication", // Targeting CRM specific search intent
    "operatingSystem": "Web-based, Cloud",
    "description": "A comprehensive Customer Relationship Management (CRM) tool for clinics, featuring integrated WhatsApp Web messaging, automated appointment reminders, and an embedded cloud dialer.",
    "url": "https://vaidyaerp.in/whatsapp-crm",
    "provider": {
      "@type": "Organization",
      "name": "VAIDYA ERP"
    },
    "featureList": [
      "Bring Your Own API (0% Message Markup)",
      "Automated Appointment Reminders",
      "1-Click PDF Document Delivery",
      "Embedded Browser Cloud Dialer",
      "Telecaller Lead Pipeline"
    ]
  };

  // 3. FAQ Schema: Answering high-intent queries about API costs and automation
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you charge a markup on WhatsApp messages sent through the CRM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Unlike other platforms that charge up to a 300% markup, VAIDYA ERP uses a 'Bring Your Own API' model. You connect your own Meta keys and pay the base rates directly to Meta, resulting in a 0% commission on messages."
        }
      },
      {
        "@type": "Question",
        "name": "Does the clinic need a physical phone connected to use the WhatsApp CRM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No physical phone is required. VAIDYA ERP is powered by official Cloud APIs, allowing your telecallers and front desk staff to chat directly from their computer screens without scanning QR codes."
        }
      },
      {
        "@type": "Question",
        "name": "Can the software automatically send appointment reminders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. To help slash no-show rates, the VAIDYA ERP system automatically messages patients via WhatsApp a day before their scheduled visit."
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
      
      {/* Load your high-converting interactive UI */}
      <WhatsAppCRMClient />
    </>
  );
}