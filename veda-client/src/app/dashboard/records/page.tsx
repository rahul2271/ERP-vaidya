"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import { FileText, Users, BedDouble, Sun, CalendarClock, Search, Download } from "lucide-react";

type VisitType = "OPD" | "IPD" | "DAY_CARE";

const TABS: { id: VisitType | "FOLLOWUPS"; label: string; icon: any }[] = [
  { id: "OPD", label: "OPD Register", icon: Users },
  { id: "IPD", label: "IPD Register", icon: BedDouble },
  { id: "DAY_CARE", label: "Day Care Register", icon: Sun },
  { id: "FOLLOWUPS", label: "Upcoming Follow-ups", icon: CalendarClock },
];

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<VisitType | "FOLLOWUPS">("OPD");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (tab: VisitType | "FOLLOWUPS") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = tab === "FOLLOWUPS" ? "/appointments/followups/upcoming" : `/appointments/register/${tab}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setRows(res.data || []);
    } catch (err) {
      console.error("Failed to load records:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rows.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.patientId?.name?.toLowerCase().includes(q) || r.patientId?.uhid?.toLowerCase().includes(q) ||
      r.opdNumber?.toLowerCase().includes(q) || r.ipdNumber?.toLowerCase().includes(q) || r.dayCareNumber?.toLowerCase().includes(q);
  });

  const regNumberFor = (r: any) => r.visitType === 'IPD' ? r.ipdNumber : r.visitType === 'DAY_CARE' ? r.dayCareNumber : r.opdNumber;

  // Downloadable register — the kind of paper trail a NABH assessor expects
  // to be able to pull on demand, not just view on screen.
  const exportCsv = () => {
    const headers = activeTab === "FOLLOWUPS"
      ? ["Patient", "UHID", "Visit Type", "Doctor", "Mobile", "Follow-up Date"]
      : ["Patient", "UHID", "Registration No.", "Doctor", "Mobile", activeTab === "OPD" ? "Visit Date" : "Admission Date", "Discharge Date"];

    const rows = filtered.map(r => {
      if (activeTab === "FOLLOWUPS") {
        return [r.patientId?.name, r.patientId?.uhid, r.visitType || "OPD", r.doctorId?.name, r.patientId?.mobile, r.nextFollowUpDate];
      }
      const base = [r.patientId?.name, r.patientId?.uhid, regNumberFor(r), r.doctorId?.name, r.patientId?.mobile];
      if (activeTab === "OPD") return [...base, new Date(r.startTime).toLocaleDateString('en-IN')];
      return [...base, r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN') : "", r.dischargeDate ? new Date(r.dischargeDate).toLocaleDateString('en-IN') : "Admitted"];
    });

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab.toLowerCase()}_register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
          <FileText size={20} className="text-primary-600" strokeWidth={2} />
          Registration Records
        </h1>
        <p className="text-sm text-ink-500 mt-1">OPD, IPD, and Day Care tracked as separate registers, per NABH record-keeping practice.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-ink-100 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-primary-600 text-white shadow-sm' : 'text-ink-500 hover:bg-ink-50'
            }`}
          >
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Export */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, UHID, or registration no."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
          />
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm font-semibold text-ink-600 hover:bg-ink-50 transition-all disabled:opacity-50 shrink-0"
        >
          <Download size={15} /> Export register (CSV)
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-100 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
                <th className="p-4 pl-6">Patient</th>
                <th className="p-4">UHID</th>
                <th className="p-4">{activeTab === "FOLLOWUPS" ? "Visit Type" : "Reg. No."}</th>
                <th className="p-4">Doctor</th>
                {activeTab === "FOLLOWUPS" ? (
                  <th className="p-4 pr-6">Follow-up Date</th>
                ) : activeTab === "OPD" ? (
                  <th className="p-4 pr-6">Visit Date</th>
                ) : (
                  <>
                    <th className="p-4">Admitted</th>
                    <th className="p-4 pr-6">Discharged</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {loading ? (
                <tr><td colSpan={6} className="p-16 text-center text-ink-400 text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-ink-400">
                    <FileText size={28} className="mx-auto mb-3 text-ink-200" />
                    <p className="text-sm font-medium">No records found</p>
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r._id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-semibold text-ink-900 text-sm">{r.patientId?.name || "Unknown"}</p>
                    <p className="text-xs text-ink-400">{r.patientId?.mobile}</p>
                  </td>
                  <td className="p-4 font-mono text-xs text-ink-600">{r.patientId?.uhid || "—"}</td>
                  <td className="p-4">
                    {activeTab === "FOLLOWUPS" ? (
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                        r.visitType === 'IPD' ? 'bg-secondary-50 text-secondary-700' : r.visitType === 'DAY_CARE' ? 'bg-amber-50 text-amber-700' : 'bg-ink-100 text-ink-600'
                      }`}>{r.visitType || 'OPD'}</span>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-primary-700">{regNumberFor(r) || "—"}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-ink-600">{r.doctorId?.name || "—"}</td>
                  {activeTab === "FOLLOWUPS" ? (
                    <td className="p-4 pr-6 text-sm font-semibold text-amber-700">{r.nextFollowUpDate}</td>
                  ) : activeTab === "OPD" ? (
                    <td className="p-4 pr-6 text-sm text-ink-600">{new Date(r.startTime).toLocaleDateString('en-IN')}</td>
                  ) : (
                    <>
                      <td className="p-4 text-sm text-ink-600">{r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN') : "—"}</td>
                      <td className="p-4 pr-6 text-sm">
                        {r.dischargeDate ? (
                          <span className="text-ink-600">{new Date(r.dischargeDate).toLocaleDateString('en-IN')}</span>
                        ) : (
                          <span className="text-secondary-600 font-semibold text-xs uppercase bg-secondary-50 px-2 py-1 rounded">Admitted</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
