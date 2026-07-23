import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck, FileText, BedDouble, Users, Sun, ArrowRight,
  QrCode, ClipboardCheck, History, CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "NABH-Aligned OPD/IPD Records Software | VAIDYA ERP",
  description: "Separate OPD, IPD, and Day Care registers with sequential numbering, one lifetime UHID, and full discharge summaries — built to NABH record-keeping standards.",
  keywords: [
    "NABH compliant clinic software",
    "OPD IPD software for ayurvedic clinics",
    "UHID software",
    "hospital accreditation software ayurveda",
    "NABH discharge summary software",
    "hospital record keeping software India",
  ],
};

const FEATURES = [
  {
    icon: Users,
    title: "One UHID, for life",
    body: "Every patient gets a single Unique Health ID generated once, at first registration, using an atomic sequential counter — not a random number. It's reused across every visit, forever, so a patient's history is always traceable back to one identity.",
  },
  {
    icon: BedDouble,
    title: "Separate OPD, IPD, and Day Care registers",
    body: "Most clinic software treats every visit identically. VAIDYA tracks OPD (outpatient), IPD (admission), and Day Care as distinct registers, each with its own sequential registration number that resets every calendar year — the way real hospital filing systems and NABH assessors expect records organized.",
  },
  {
    icon: ArrowRight,
    title: "Traceable OPD → IPD conversion",
    body: "When a doctor decides a patient needs admission, converting from OPD to IPD (or Day Care) generates a new registration number while keeping the original OPD number visible on the record — so the full episode of care stays traceable, not overwritten.",
  },
  {
    icon: FileText,
    title: "Complete discharge summaries",
    body: "Every discharge summary includes UHID, visit type, registration number, admission and discharge dates, condition at discharge, and advice given — the elements NABH documentation actually requires, not just a bill.",
  },
  {
    icon: History,
    title: "Full episode history, on the summary itself",
    body: "Every admission and discharge event is logged — who performed it, when, and the exact number change — and that history appears directly on the final discharge summary, so the complete episode of care is in one document.",
  },
  {
    icon: QrCode,
    title: "Verifiable registration tickets",
    body: "OPD/IPD/Day Care tickets carry a QR code encoding the UHID and registration number, so front desk or pharmacy staff can verify a patient's identity and visit against the record in seconds.",
  },
];

const FAQ = [
  {
    q: "Does VAIDYA ERP make my clinic NABH certified?",
    a: "No. NABH certification is a separate accreditation process carried out by the National Accreditation Board for Hospitals & Healthcare Providers, involving an on-site assessment of your facility, staff, and processes. VAIDYA ERP structures your digital records — UHID, OPD/IPD/Day Care registers, discharge summaries — to match the documentation standards NABH assessors look for, which supports your accreditation effort but doesn't replace it.",
  },
  {
    q: "What's the difference between OPD, IPD, and Day Care numbering?",
    a: "OPD (outpatient) numbers are assigned for a standard visit with no admission. IPD (inpatient) numbers are assigned when a patient is formally admitted. Day Care numbers are for admissions where the patient occupies a bed for treatment but is discharged the same day — common for Panchakarma therapy. Each gets its own sequential number series, separate from the others.",
  },
  {
    q: "Can I export these registers for an NABH audit?",
    a: "Yes — the Records page lets Admin, Doctor, and Receptionist roles export each register (OPD, IPD, Day Care, and upcoming follow-ups) as a CSV file on demand.",
  },
];

export default function NABHCompliancePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="pt-[200px] min-h-screen bg-[#F6F9F8] pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[11px] font-bold mb-6 w-fit mx-auto tracking-wide">
          <ShieldCheck size={13} /> NABH-ALIGNED RECORD KEEPING
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 tracking-tight mb-5">
          Registration and discharge, the way accreditation actually expects it
        </h1>
        <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
          NABH assessors look for specific things in patient records: a permanent unique identifier, clearly separated visit types, and complete discharge documentation. VAIDYA ERP builds that structure into how every visit is recorded — not as an afterthought.
        </p>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-ink-100 p-7">
              <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-5">
                <f.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-ink-900 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registers illustration strip */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-ink-900 rounded-[2rem] p-10 md:p-12">
          <h2 className="text-white text-xl font-bold mb-8 text-center">Three registers, tracked separately</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Users, label: "OPD Register", format: "OPD-2026-00001", desc: "Standard outpatient visits" },
              { icon: BedDouble, label: "IPD Register", format: "IPD-2026-00001", desc: "Formal admissions" },
              { icon: Sun, label: "Day Care Register", format: "DC-2026-00001", desc: "Same-day therapy admissions" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <r.icon size={22} className="text-primary-400 mx-auto mb-3" />
                <p className="text-white font-bold text-sm mb-1">{r.label}</p>
                <p className="text-ink-400 font-mono text-xs mb-2">{r.format}</p>
                <p className="text-ink-300 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance disclaimer, stated clearly and not buried */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <ClipboardCheck size={22} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>This describes VAIDYA ERP's record-keeping structure, not an NABH certification claim.</strong> NABH accreditation for your facility is a separate process carried out by the National Accreditation Board for Hospitals & Healthcare Providers, involving on-site assessment. VAIDYA ERP's documentation structure is designed to support that process, not substitute for it.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-ink-900 text-center mb-10">Common questions</h2>
        <div className="space-y-4">
          {FAQ.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-ink-100 p-6">
              <h3 className="font-bold text-ink-900 mb-2 flex items-start gap-2">
                <CheckCircle2 size={17} className="text-primary-600 shrink-0 mt-0.5" /> {f.q}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 text-center">
        <Link href="/signup" className="inline-flex items-center gap-2 bg-primary-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-all">
          Start your 15-day free trial <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
