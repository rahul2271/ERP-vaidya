"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { FileSpreadsheet, Download, Package, Receipt, Lock, Loader2, Wifi, RefreshCw, CheckCircle2, XCircle, UploadCloud } from "lucide-react";

export default function TallyExportPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message: string } | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pulledItems, setPulledItems] = useState<any[] | null>(null);
  const [pushingLive, setPushingLive] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    axios.get("/hospitals/my-plan")
      .then(res => setPlan(res.data.plan))
      .catch(() => setPlan("BASIC"))
      .finally(() => setLoading(false));
  }, []);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus(null);
    try {
      const res = await axios.get("/tally/test-connection", authHeaders());
      setConnectionStatus(res.data);
      if (res.data.connected) toast.success("Tally is reachable!");
      else toast.error("Tally responded, but the connection looks off.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Couldn't reach Tally.";
      setConnectionStatus({ connected: false, message: msg });
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  const handlePullStock = async () => {
    setPulling(true);
    try {
      const res = await axios.get("/tally/sync/pull-stock", authHeaders());
      setPulledItems(res.data.items || []);
      toast.success(`Pulled ${res.data.count} stock items from Tally.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to pull stock from Tally.");
    } finally {
      setPulling(false);
    }
  };

  const handlePushLive = async () => {
    setPushingLive(true);
    try {
      const res = await axios.get(`/tally/sync/push-vouchers?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, authHeaders());
      toast.success(`Pushed to Tally — ${res.data.created} voucher(s) created${res.data.errors ? `, ${res.data.errors} error(s)` : ''}.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to push vouchers to Tally.");
    } finally {
      setPushingLive(false);
    }
  };

  const downloadFile = async (url: string, filename: string, key: string) => {
    setDownloading(key);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success("Downloaded — import via Gateway of Tally → Import Data.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Export failed.");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return <div className="p-2 animate-pulse"><div className="h-40 bg-ink-100 rounded-2xl" /></div>;
  }

  if (plan !== "PREMIUM") {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
          <FileSpreadsheet size={20} className="text-primary-600" /> Tally Export
        </h1>
        <div className="bg-white rounded-2xl border border-ink-100 p-16 text-center">
          <Lock size={32} className="mx-auto mb-4 text-ink-200" />
          <p className="font-semibold text-ink-700 mb-1">Tally export is a Premium feature</p>
          <p className="text-sm text-ink-500 mb-6">Upgrade to export stock items and sales vouchers directly into Tally.</p>
          <a href="/dashboard/upgrade" className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all">
            View plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
          <FileSpreadsheet size={20} className="text-primary-600" /> Tally Export
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          Live sync when your Tally server is reachable, or download real Tally XML for manual import via <span className="font-mono text-xs bg-ink-100 px-1.5 py-0.5 rounded">Gateway of Tally → Import → Data</span>.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-900 flex items-center gap-2"><Wifi size={17} className="text-primary-600" /> Live Connection</h3>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-2 px-3.5 py-2 bg-ink-100 text-ink-700 rounded-xl text-xs font-semibold hover:bg-ink-200 transition-all disabled:opacity-60"
          >
            {testing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Test Connection
          </button>
        </div>
        {connectionStatus && (
          <div className={`flex items-center gap-2 text-xs font-medium p-3 rounded-xl mb-4 ${connectionStatus.connected ? 'bg-secondary-50 text-secondary-700' : 'bg-red-50 text-red-700'}`}>
            {connectionStatus.connected ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {connectionStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="border border-ink-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-ink-800 mb-1">Pull stock from Tally</p>
            <p className="text-xs text-ink-500 mb-3">Fetches current stock items live, directly from Tally.</p>
            <button
              onClick={handlePullStock}
              disabled={pulling}
              className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pulling ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              Pull Now
            </button>
            {pulledItems !== null && (
              <div className="mt-3 max-h-40 overflow-y-auto space-y-1">
                {pulledItems.length === 0 ? (
                  <p className="text-xs text-ink-400">No stock items returned.</p>
                ) : pulledItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-[11px] text-ink-600 py-1 border-b border-ink-50 last:border-0">
                    <span className="truncate">{item.name}</span>
                    <span className="font-mono text-ink-500 shrink-0 ml-2">{item.closingBalance} {item.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-ink-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-ink-800 mb-1">Push billing to Tally</p>
            <p className="text-xs text-ink-500 mb-3">Sends paid visits in the date range below directly into Tally as sales vouchers.</p>
            <button
              onClick={handlePushLive}
              disabled={pushingLive}
              className="w-full py-2 bg-secondary-600 text-white rounded-lg text-xs font-semibold hover:bg-secondary-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pushingLive ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              Push Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <Package size={18} className="text-primary-600" />
          </div>
          <h3 className="font-semibold text-ink-900 mb-1.5">Stock Items</h3>
          <p className="text-sm text-ink-500 mb-5">Exports current pharmacy/inventory stock as Tally stock item masters with opening balance and rate.</p>
          <button
            onClick={() => downloadFile("/tally/export/stock-items", `tally_stock_items_${new Date().toISOString().split('T')[0]}.xml`, "stock")}
            disabled={downloading === "stock"}
            className="w-full py-2.5 bg-ink-900 text-white rounded-xl text-sm font-semibold hover:bg-ink-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {downloading === "stock" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Download Stock Items XML
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center mb-4">
            <Receipt size={18} className="text-secondary-600" />
          </div>
          <h3 className="font-semibold text-ink-900 mb-1.5">Sales Vouchers</h3>
          <p className="text-sm text-ink-500 mb-4">Exports paid appointments/visits in a date range as Tally sales vouchers.</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide block mb-1">From</label>
              <input type="date" value={dateRange.startDate} onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })} className="w-full border border-ink-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide block mb-1">To</label>
              <input type="date" value={dateRange.endDate} onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })} className="w-full border border-ink-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" />
            </div>
          </div>
          <button
            onClick={() => downloadFile(
              `/tally/export/sales-vouchers?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
              `tally_sales_${dateRange.startDate}_to_${dateRange.endDate}.xml`,
              "sales"
            )}
            disabled={downloading === "sales"}
            className="w-full py-2.5 bg-secondary-600 text-white rounded-xl text-sm font-semibold hover:bg-secondary-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {downloading === "sales" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Download Sales Vouchers XML
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-xs text-amber-800 leading-relaxed">
        <strong>Note:</strong> This generates a real, importable Tally XML file — it does not connect live to a running Tally instance (Tally's own integration surface requires Tally to be running locally on the accountant's machine). Import the downloaded file via Tally's own menu on that machine.
      </div>
    </div>
  );
}
