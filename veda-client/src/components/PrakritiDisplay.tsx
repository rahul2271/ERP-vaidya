"use client";

import React from "react";
import { Wind, Flame, Mountain, Activity, Info } from "lucide-react";

interface PrakritiDisplayProps {
  scores?: {
    vata: number;
    pitta: number;
    kapha: number;
  };
}

export default function PrakritiDisplay({ scores }: PrakritiDisplayProps) {
  if (!scores || (scores.vata === 0 && scores.pitta === 0 && scores.kapha === 0)) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center justify-center">
        <div className="bg-slate-200 p-3 rounded-full mb-3 text-slate-400">
          <Activity size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-600">No Prakriti Data</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Send the Digital Assessment link to the patient's WhatsApp to generate their profile.
        </p>
      </div>
    );
  }

  const doshaArray = [
    { name: "Vata", value: scores.vata, color: "text-primary-600", bg: "bg-primary-100", icon: Wind, traits: "Prone to dry skin, anxiety, and irregular digestion (bloating). Recommend warm, oily, nourishing foods and a strict routine." },
    { name: "Pitta", value: scores.pitta, color: "text-orange-600", bg: "bg-orange-100", icon: Flame, traits: "Prone to acidity, inflammation, and irritability. Recommend cooling, moderately heavy foods. Avoid spicy or fermented items." },
    { name: "Kapha", value: scores.kapha, color: "text-emerald-600", bg: "bg-emerald-100", icon: Mountain, traits: "Prone to weight gain, lethargy, and mucous. Recommend light, warm, dry, and spicy foods. Requires regular vigorous exercise." },
  ];
  
  const dominant = doshaArray.reduce((prev, current) => (prev.value > current.value ? prev : current));

  return (
    <div className="bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
      
      {/* Background Graphic */}
      <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none">
        <dominant.icon size={150} />
      </div>

      {/* Header & Dominant Badge */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Activity size={14} /> Prakriti Profile
          </h2>
          <p className="text-2xl font-black text-slate-800 tracking-tight">
            Dominant <span className={dominant.color}>{dominant.name}</span>
          </p>
        </div>
        
        <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs ${dominant.bg} ${dominant.color}`}>
          <dominant.icon size={14} /> {dominant.value}%
        </div>
      </div>

      {/* The Visual Breakdown Bars */}
      <div className="space-y-4 relative z-10 mb-6">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-primary-600 flex items-center gap-1"><Wind size={12}/> Vata (Air/Space)</span>
            <span className="text-slate-600">{scores.vata}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full animate-in slide-in-from-left duration-700 ease-out" style={{ width: `${scores.vata}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-orange-600 flex items-center gap-1"><Flame size={12}/> Pitta (Fire/Water)</span>
            <span className="text-slate-600">{scores.pitta}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full animate-in slide-in-from-left duration-700 delay-150 ease-out" style={{ width: `${scores.pitta}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-emerald-600 flex items-center gap-1"><Mountain size={12}/> Kapha (Earth/Water)</span>
            <span className="text-slate-600">{scores.kapha}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full animate-in slide-in-from-left duration-700 delay-300 ease-out" style={{ width: `${scores.kapha}%` }}></div>
          </div>
        </div>
      </div>

      {/* 🚀 NEW: Clinical Interpretation for the Doctor */}
      <div className={`mt-auto p-4 rounded-2xl border ${dominant.bg.replace('100', '50')} ${dominant.color.replace('600', '800')} border-opacity-50`}>
        <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2 opacity-70">
          <Info size={12} /> Clinical Interpretation
        </h4>
        <p className="text-xs font-bold leading-relaxed">
          {dominant.traits}
        </p>
      </div>

    </div>
  );
}