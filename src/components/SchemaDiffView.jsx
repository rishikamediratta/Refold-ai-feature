import React, { useState } from 'react';
import { GitCompare, ChevronDown, ChevronUp, FileCode2, ArrowRight } from 'lucide-react';

export default function SchemaDiffView({ oldSchema, newSchema, detectedChanges }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card rounded-2xl border border-slate-800 mb-6 overflow-hidden">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 bg-slate-900/60 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900/90 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <GitCompare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Schema Comparison Visualizer</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                v1.0.0 ➔ v2.0.0
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Detected {detectedChanges.length} schema drift mutations impacting API contract
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-red-500/10 text-red-400 border border-red-500/20">
              1 Removed
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              1 Renamed
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              1 Type Mismatch
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/40">
          
          {/* Summary Badges of Changes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {detectedChanges.map((change, idx) => {
              let badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
              if (change.type === 'REMOVED') badgeColor = 'bg-red-500/10 text-red-300 border-red-500/20';
              if (change.type === 'TYPE_MISMATCH') badgeColor = 'bg-purple-500/10 text-purple-300 border-purple-500/20';

              return (
                <div key={idx} className={`p-3 rounded-xl border text-xs ${badgeColor} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold tracking-wider uppercase text-[10px]">{change.type}</span>
                    <span className="font-mono text-slate-400">{change.field}</span>
                  </div>
                  <p className="text-slate-300 font-sans mt-0.5 text-[11px]">
                    {change.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Side-by-side JSON Schemas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Old Schema */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                  old_schema.json (v1.0.0)
                </span>
                <span className="text-[10px] font-mono text-slate-500">CRM Contact baseline</span>
              </div>
              <pre className="p-4 text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto max-h-72">
                <code>{JSON.stringify(oldSchema, null, 2)}</code>
              </pre>
            </div>

            {/* New Schema */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                  new_schema.json (v2.0.0)
                </span>
                <span className="text-[10px] font-mono text-indigo-400">Drifted payload</span>
              </div>
              <pre className="p-4 text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto max-h-72">
                <code>{JSON.stringify(newSchema, null, 2)}</code>
              </pre>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
