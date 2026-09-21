import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HealthyMappingsView({ healthyMappings }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!healthyMappings || healthyMappings.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl border border-slate-800 mb-6 overflow-hidden">
      {/* Header Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-slate-900/40 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900/80 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span>Healthy Integration Mappings ({healthyMappings.length})</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-normal">
                No Drift Detected
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Verified unaffected field paths filtered out prior to AI inference payload
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
            {isExpanded ? 'Hide mappings' : 'View verified nodes'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Mapping Name</th>
                <th className="pb-2.5 font-semibold">Source Field</th>
                <th className="pb-2.5 font-semibold">Target Field</th>
                <th className="pb-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {healthyMappings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-mono text-slate-400 text-[11px]">{item.id}</td>
                  <td className="py-2.5 font-medium text-white">{item.name}</td>
                  <td className="py-2.5 font-mono text-indigo-300">{item.source_field}</td>
                  <td className="py-2.5 font-mono text-cyan-300">
                    <span className="inline-flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      {item.target_field}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      Passing
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
