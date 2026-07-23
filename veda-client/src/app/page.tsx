import { Metadata } from "next";
import HomeClient from "@/components/HomeClient"; // Update this path if needed

// 1. Aggressive, Intent-Driven Meta Data
export const metadata: Metadata = {
  title: "Ayurvedic Clinic Management Software | VAIDYA ERP",
  description: "Run your Ayurvedic clinic with zero-markup WhatsApp, live pharmacy inventory, and 1-click digital EMR. NABH-aligned records, built for Indian clinics.",
  keywords: [
    "Ayurvedic Clinic Management Software",
    "ayurveda hospital software India",
    "panchakarma software",
    "clinic ERP India",
    "zero commission clinic software",
    "ayurvedic EMR software",
    "bring your own whatsapp api clinic software"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in",
  },
  openGraph: {
    title: "VAIDYA ERP | Ayurvedic Clinic Management Software ",
    description: "Run your Ayurvedic clinic with zero-markup WhatsApp, live pharmacy inventory, and 1-click digital EMR. NABH-aligned records, built for Indian clinics.",
    url: "https://vaidyaerp.in",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vaidyaerp.in/admin_dashboard.png", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "VAIDYA ERP God Mode Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VAIDYA ERP | Smart Clinic Management Software",
    description: "Stop paying 300% markups on WhatsApp APIs. Plug in your own Meta API with zero markup.",
  },
};

export default function HomePage() {
  // 2. AEO (Answer Engine Optimization) Schema
  // This tells Google and AI bots exactly what your software is, pricing, and location.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VAIDYA ERP",
    "operatingSystem": "Web-based, Cloud",
    "applicationCategory": "HealthApplication",
    "description": "Smart Ayurvedic Clinic Management Software featuring BYO WhatsApp API, 1-click digital prescriptions, and Panchakarma ward management.",
    "url": "https://vaidyaerp.in",
    "creator": {
      "@type": "Organization",
      "name": "RC Tech Solutions"
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "VAIDYA ERP HQ",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sahibzada Ajit Singh Nagar",
        "addressRegion": "Punjab",
        "addressCountry": "IN"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "24990",
      "priceCurrency": "INR",
      "billingIncrement": "P1Y",
      "description": "Starter Clinic Annual Plan"
    },
    "featureList": [
      "Bring Your Own Meta API",
      "Panchakarma Bed Management",
      "ABDM Compliant Billing",
      "Ayurvedic Pharmacy POS"
    ]
  };

  // 3. FAQ Schema for rich snippets in SERPs
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you charge per WhatsApp message or take a cut of my bookings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Never. VAIDYA uses a 'Bring Your Own API' model. You plug in your own Meta WhatsApp or SMS API key and pay the base rate directly to Meta with zero markup."
        }
      },
      {
        "@type": "Question",
        "name": "Who actually owns my patient data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You do. 100%. Your data is 256-bit encrypted and locked to your clinic. You can export it to a CSV with one click whenever you want."
        }
      }
    ]
  };

  return (
    <>
      {/* Injecting Schema invisibly into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Load the interactive client UI */}
      <HomeClient />
    </>
  );
}