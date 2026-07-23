import { Metadata } from "next";
import LoginClient from "@/components/LoginClient"; // Update path if needed

// 1. Navigational, Trust-Building Meta Data
export const metadata: Metadata = {
  title: "Login | Secure Clinic Dashboard | VAIDYA ERP",
  description: "Sign in to your VAIDYA ERP command center. Secure, HIPAA-compliant, and 256-bit encrypted access to your Ayurvedic clinic's patient records, billing, and pharmacy.",
  keywords: [
    "Vaidya ERP Login",
    "Vaidya ERP Dashboard",
    "Secure Clinic Login",
    "Ayurvedic Software Portal"
  ],
  alternates: {
    canonical: "https://vaidyaerp.in/login", // Adjust URL as needed
  },
  openGraph: {
    title: "Login | VAIDYA ERP Command Center",
    description: "Access your secure Ayurvedic clinic dashboard.",
    url: "https://vaidyaerp.in/login",
    siteName: "VAIDYA ERP",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | VAIDYA ERP Command Center",
    description: "Secure login portal for VAIDYA ERP.",
  },
};

export default function LoginPage() {
  return (
    <>
      {/* Note: We don't need heavy Schema.org markup (like SoftwareApplication or FAQ) 
        on the login page. We want search engine crawlers to read the meta tags for 
        brand name searches and move on.
      */}
      <LoginClient />
    </>
  );
}