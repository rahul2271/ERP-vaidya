"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, ArrowRight, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function LowStockWidget() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory/low-stock-alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLowStockItems(res.data);
      } catch (err) {
        console.error("Failed to load alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="p-4 bg-gray-50 animate-pulse rounded-2xl h-40"></div>;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
        <h3 className="font-bold text-red-700 flex items-center gap-2 text-sm uppercase">
          <AlertTriangle size={16} /> Reorder Alerts
        </h3>
        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
          {lowStockItems.length} Items Low
        </span>
      </div>

      <div className="p-5 flex-1 space-y-3 overflow-y-auto max-h-[250px]">
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item: any) => (
            <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-800">{item.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-medium">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-600">{item.stock} <span className="text-[10px] text-gray-400">{item.unit} left</span></p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <PackageSearch size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">All stock levels are healthy.</p>
          </div>
        )}
      </div>

      <Link href="/dashboard/inventory" className="p-4 bg-gray-50 text-center text-xs font-bold text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 border-t">
        Manage Pharmacy <ArrowRight size={14} />
      </Link>
    </div>
  );
}