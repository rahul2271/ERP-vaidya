"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    direction: "up" | "down";
    percentage: number;
    label?: string;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red" | "pink";
  subtitle?: string;
  onClick?: () => void;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  subtitle,
  onClick,
  loading = false,
}: StatCardProps) {
  const colorClasses = {
    blue: { bg: "bg-primary-50", text: "text-primary-600", border: "border-primary-100" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100" },
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${
        onClick ? "cursor-pointer hover:border-slate-300" : ""
      }`}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              trend.direction === "up"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {trend.percentage}%
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </p>

      {/* Value */}
      {loading ? (
        <div className="h-8 bg-slate-200 rounded-lg animate-pulse mb-1" />
      ) : (
        <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      )}

      {/* Subtitle/Trend Label */}
      {subtitle && (
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
      {trend?.label && (
        <p className="text-xs text-slate-500 font-medium">{trend.label}</p>
      )}
    </div>
  );
}
