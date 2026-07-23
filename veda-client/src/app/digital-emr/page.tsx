import { Metadata } from "next";
import DigitalEMRClient from "@/components/DigitalEMRClient"; // Update path if needed

// 1. Bottom-of-the-Funnel, Feature-Specific Meta Data
export const metadata: Metadata = {
  title: "1-Click Digital EMR & WhatsApp Prescriptions | VAIDYA ERP",
  description: "Stop pharmacy leakage and save doctor's time. Generate legally compliant Ayurvedic prescriptions in 1-click and push them directly to your Pharmacy POS and patient's WhatsApp.",
  keywords: [
    "Ayurvedic EMR",
    "Digital Prescription Software",
    "Send Prescription on WhatsApp",
    "Pharmacy POS Integration",
    "Stop Pharmacy Leakage Clinic",
    "Ayurveda Clinic Management Software"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/digital-emr", // Adjust URL as needed
  },
  openGraph: {
    title: "1-Click Digital EMR & Prescriptions | VAIDYA ERP",
    description: "Doctors hate typing. Let them focus on healing. Our predictive EMR saves favorite drug combos and sends branded PDFs instantly.",
    url: "https://vaidyaerp.in/digital-emr",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/emr_dashboard.png", // Replace with an actual screenshot of your EMR UI
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP 1-Click Digital Prescription Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1-Click Digital EMR | VAIDYA ERP",
    description: "Don't let patients walk out with a paper slip to the local chemist. Push prescriptions directly to your internal POS.",
  },
};

export default function DigitalEMRPage() {
  // 2. AEO Schema: Defining the exact EMR software capabilities for AI Bots
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP - Digital EMR Module",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web-based, Cloud",
    "description": "A predictive Electronic Medical Record (EMR) system for Ayurveda that generates 1-click PDF prescriptions, sends them via WhatsApp, and integrates directly with internal Pharmacy POS systems.",
    "url": "https://vaidyaerp.in/digital-emr",
    "provider": {
      "@type": "Organization",
      "name": "VAIDYA ERP"
    },
    "featureList": [
      "1-Click Digital Prescriptions",
      "Instant WhatsApp PDF Delivery",
      "Pharmacy POS Integration",
      "Predictive Typing & Treatment Templates",
      "Pre-loaded Patient Vitals & Prakriti"
    ]
  };

  // 3. FAQ Schema: Answering high-intent queries about digital prescriptions and pharmacy revenue
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can clinics stop pharmacy leakage to outside chemists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "By using a connected EMR like VAIDYA ERP. When a doctor hits 'Push to Pharmacy', the prescribed medicines are instantly reserved at the internal Pharmacy POS, ensuring they are packed and billed before the patient leaves the clinic."
        }
      },
      {
        "@type": "Question",
        "name": "Can doctors send digital prescriptions via WhatsApp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. With VAIDYA ERP, doctors can generate a legally compliant, branded PDF prescription and send it directly to the patient's WhatsApp with a single click."
        }
      },
      {
        "@type": "Question",
        "name": "Do Ayurvedic doctors have to type out full prescriptions manually?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. VAIDYA ERP features a predictive EMR designed for speed. Doctors can save their favorite Ayurvedic treatment protocols and use fast auto-complete to add medicines, dosages, and diet instructions in seconds."
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
      <DigitalEMRClient />
    </>
  );
}