import { Metadata } from "next";
import AIPrakritiClient from "@/components/AIPrakritiClient"; // Update path if needed

// 1. Highly Specific, Feature-Driven Meta Data
export const metadata: Metadata = {
  title: "AI Prakriti & Dosha Assessment Software | VAIDYA ERP",
  description: "Digital AYUSH Prakriti quiz with instant Vata-Pitta-Kapha assessment. Standardize dosha analysis across your clinic with VAIDYA's AI dashboard.",
  keywords: [
    "prakriti assessment software",
    "dosha analysis software",
    "digital prakriti quiz",
    "AI ayurveda diagnosis",
    "vata pitta kapha software"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/ai-prakriti",
  },
  openGraph: {
    title: "AI Prakriti Analysis | VAIDYA ERP",
    description: "Automate patient onboarding. Send bilingual AYUSH questionnaires via WhatsApp and get instant Dosha radar charts before the consultation begins.",
    url: "https://vaidyaerp.in/ai-prakriti",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/prakriti_radar_chart.png", // Replace with an actual screenshot of your radar chart UI
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP AI Prakriti Radar Chart Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prakriti Analysis | VAIDYA ERP",
    description: "Stop wasting 10 minutes on paper clipboards. Get instant Vata, Pitta, Kapha analysis directly on your doctor dashboard.",
  },
};

export default function AIPrakritiPage() {
  // 2. AEO Schema: Defining the specific software feature for AI Bots
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP - AI Prakriti Module",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web-based, Cloud",
    "description": "An automated AI Prakriti and Dosha analysis module that sends bilingual AYUSH questionnaires via WhatsApp and generates Vata, Pitta, and Kapha radar charts.",
    "url": "https://vaidyaerp.in/ai-prakriti",
    "provider": {
      "@type": "Organization",
      "name": "VAIDYA ERP"
    },
    "featureList": [
      "Automated WhatsApp Questionnaire Delivery",
      "Bilingual AYUSH Standard Forms (Hindi/English)",
      "Instant Vata, Pitta, Kapha Radar Charts",
      "Pre-consultation Patient Diagnostics"
    ]
  };

  // 3. FAQ Schema: Converting your "How it works" section into Google-friendly snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the automated AI Prakriti questionnaire work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When your receptionist books an appointment in VAIDYA ERP, an automated WhatsApp message is instantly sent to the patient with a secure link to a 15-question AYUSH standard questionnaire."
        }
      },
      {
        "@type": "Question",
        "name": "How do doctors view the Prakriti (Dosha) analysis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The moment a patient submits the digital form, VAIDYA ERP calculates the exact Vata, Pitta, and Kapha ratios and displays them as a visual radar chart directly on the doctor's screen, allowing diagnosis to begin instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Are the patient questionnaires available in Hindi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the VAIDYA ERP AI Prakriti questionnaire is fully bilingual (Hindi and English). Patients can answer in their preferred language, and the data automatically syncs to the doctor's dashboard in English."
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
      
      {/* Load your luxury interactive UI */}
      <AIPrakritiClient />
    </>
  );
}