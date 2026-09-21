import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Wrench, 
  FileText, 
  Info,
  Layers
} from 'lucide-react';

export default function ImpactCard({ analysis, mapping }) {
  const [copied, setCopied] = useState(false);

  const handleCopyFix = () => {
    if (analysis?.suggested_fix) {
      navigator.clipboard.writeText(analysis.suggested_fix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine badge styles based on break type
  const getBreakTypeBadge = (type) => {
    switch (type) {
      case 'FIELD_REMOVED':
        return {
          label: 'Field Removed',
          color: 'bg-red-500/10 text-red-400 border-red-500/30',
          dot: 'bg-red-500',
          glow: 'glow-red'
        };
      case 'FIELD_RENAMED':
        return {
          label: 'Field Renamed',
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          glow: 'glow-amber'
        };
      case 'TYPE_MISMATCH':
        return {
          label: 'Type Mismatch',
          color: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          glow: 'glow-indigo'
        };
      default:
        return {
          label: type || 'Schema Drift',
          color: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
          glow: ''
        };
    }
  };

  const badgeStyle = getBreakTypeBadge(analysis?.break_type);
  const confidence = analysis?.confidence_score || 95;

  return (
    <div className={`glass-card rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200 relative overflow-hidden group`}>
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"></div>

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pt-1">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-semibold">
              {analysis?.mapping_id || mapping?.id}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              {analysis?.name || mapping?.name}
            </h3>
          </div>
          
          {/* Mapping Pipeline Direction */}
          <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-400 font-mono">
            <span className="text-indigo-400 font-medium">{analysis?.source_field || mapping?.source_field}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-medium">{analysis?.target_field || mapping?.target_field}</span>
          </div>
        </div>

        {/* Badges: Break Type & Confidence Score */}
        <div className="flex items-center space-x-2">
          {/* Break Type Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}></span>
            <span>{badgeStyle.label}</span>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span className="text-slate-400 text-[11px]">Conf:</span>
            <span className="text-indigo-300 font-bold">{confidence}%</span>
          </div>
        </div>
      </div>

      {/* Grid Content: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column: What Changed & Why It Breaks */}
        <div className="space-y-3">
          {/* What Changed */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>What Changed in API Payload</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {analysis?.what_changed || 'Detected structural drift in CRM v2.0 payload.'}
            </p>
          </div>

          {/* Why It Breaks */}
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/30">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-300 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Why Integration Breaks</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {analysis?.why_affected || 'The current transform logic fails at runtime when evaluating missing or shifted field locations.'}
            </p>
          </div>
        </div>

        {/* Right Column: Suggested Fix Code & Changelog */}
        <div className="space-y-3">
          {/* Suggested Fix */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-900/30 relative">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span>Suggested Remediation Fix</span>
              </div>
              <button
                onClick={handleCopyFix}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-1 text-[11px]"
                title="Copy Fix snippet"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-mono">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="font-mono">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-950 text-[11px] font-mono text-indigo-200 overflow-x-auto border border-slate-800/80 leading-relaxed">
              <code>{analysis?.suggested_fix}</code>
            </pre>
          </div>

          {/* Changelog Entry */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Changelog Summary</span>
            </div>
            <p className="text-xs text-slate-400 italic font-sans leading-relaxed">
              "{analysis?.changelog_entry}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
