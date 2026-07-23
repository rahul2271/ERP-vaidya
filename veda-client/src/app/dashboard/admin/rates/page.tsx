"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag, Activity, IndianRupee, FileText, Clock } from "lucide-react";

export default function TherapyRatesPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", cost: "", durationMin: "60" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRates(); }, []);

  const loadRates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/treatments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRates(res.data);
    } catch (err: any) {
      console.error("Failed to load rates:", err?.response?.data || err);
      toast.error("Couldn't load the rate card.");
    } finally {
      setLoading(false);
    }
  };

  const addRate = async () => {
    if (!form.name.trim() || !form.cost) {
      toast.error("Enter both a therapy name and a price.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/treatments`, {
        name: form.name.trim(),
        cost: Number(form.cost),
        durationMin: Number(form.durationMin) || 60,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: "", cost: "", durationMin: "60" });
      toast.success(`${form.name.trim()} added to the rate card.`);
      loadRates();
    } catch (err: any) {
      console.error("Failed to add rate:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to add therapy. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRate = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from the rate card?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/treatments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${name} removed.`);
      loadRates();
    } catch (err: any) {
      console.error("Failed to delete rate:", err?.response?.data || err);
      toast.error("Failed to remove this therapy.");
    }
  };

  if (loading && rates.length === 0) {
    return (
      <div className="p-2 md:p-4 animate-pulse space-y-6">
        <div className="h-10 bg-ink-100 rounded-xl w-64" />
        <div className="h-28 bg-ink-100 rounded-2xl w-full" />
        <div className="h-80 bg-ink-100 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
            <Tag size={20} className="text-primary-600" strokeWidth={2} />
            Therapy rate card
          </h1>
          <p className="text-sm text-ink-500 mt-1">Standard pricing used across appointments and billing.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border border-ink-100 w-fit">
          <Activity size={15} className="text-primary-600" />
          <span className="text-sm font-semibold text-ink-700">{rates.length} {rates.length === 1 ? 'therapy' : 'therapies'}</span>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-ink-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <FileText size={12} /> Therapy name
          </label>
          <input
            className="w-full border border-ink-200 p-3 rounded-xl bg-ink-50/50 text-ink-900 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
            placeholder="e.g. Shirodhara, Abhyanga…"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addRate()}
          />
        </div>

        <div className="w-full md:w-36">
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <IndianRupee size={12} /> Price
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 font-semibold text-sm">₹</span>
            <input
              className="w-full border border-ink-200 p-3 pl-7 rounded-xl bg-ink-50/50 text-ink-900 font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
              type="number"
              min="0"
              placeholder="1200"
              value={form.cost}
              onChange={e => setForm({ ...form, cost: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addRate()}
            />
          </div>
        </div>

        <div className="w-full md:w-32">
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <Clock size={12} /> Minutes
          </label>
          <input
            className="w-full border border-ink-200 p-3 rounded-xl bg-ink-50/50 text-ink-900 font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
            type="number"
            min="1"
            value={form.durationMin}
            onChange={e => setForm({ ...form, durationMin: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addRate()}
          />
        </div>

        <button
          onClick={addRate}
          disabled={saving}
          className="w-full md:w-auto bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Plus size={17} strokeWidth={2.5} /> {saving ? "Adding…" : "Add"}
        </button>
      </div>

      {/* Rates table */}
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-100 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
                <th className="p-4 pl-6">Therapy</th>
                <th className="p-4">Price</th>
                <th className="p-4">Duration</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {rates.map(rate => (
                <tr key={rate._id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-ink-900 text-sm">{rate.name}</td>
                  <td className="p-4">
                    <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md font-semibold text-sm">
                      ₹{rate.cost}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-ink-500">{rate.durationMin || 60} min</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => deleteRate(rate._id, rate.name)}
                      className="text-ink-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rates.length === 0 && !loading && (
          <div className="py-16 flex flex-col items-center justify-center text-ink-400">
            <Tag size={28} className="mb-3 text-ink-200" />
            <p className="font-semibold text-ink-600 text-sm mb-0.5">No therapies yet</p>
            <p className="text-xs">Add your first rate above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
