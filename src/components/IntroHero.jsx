import React from 'react';
import { 
  Zap, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle,
  FileCode2,
  Database
} from 'lucide-react';

export default function IntroHero({ onRunAnalysis, isLoading }) {
  return (
    <div className="space-y-8 my-4 animate-in fade-in duration-500">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-indigo-500/20 p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-950">
        
        {/* Glow ambient effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Tag Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Autonomous iPaaS Drift &amp; Remediation Sentinel</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Detect Schema Drift &amp; Prevent API Failures <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            Powered by Grok AI Engine
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Refold AI cross-references incoming schema updates against downstream integration mappings, 
          autonomously classifying breaking changes, computing risk levels, and outputting production-ready code fixes.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRunAnalysis}
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 cursor-pointer ${
              isLoading
                ? 'bg-indigo-900/60 border border-indigo-500/30 cursor-not-allowed text-indigo-300'
                : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/30 glow-indigo'
            }`}
          >
            <Zap className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing Schema Drift...' : 'Analyse with Grok AI'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5 ml-1 text-cyan-200" />}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 font-mono">
          Ready to scan HubSpot CRM v2.0.0 payload ➔ NetSuite ERP pipeline
        </p>
      </div>

      {/* Staged Payload Preview Card */}
      <div className="rounded-2xl glass-card border border-slate-800 p-6 bg-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Staged Schema Update Ready for Evaluation</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click <span className="text-indigo-300 font-semibold">"Analyse with Grok AI"</span> above to trigger the intelligent impact assessment.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Pending AI Assessment</span>
          </div>
        </div>

        {/* Pipeline Schema Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-500 font-medium">Source Schema</div>
            <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              HubSpot CRM Payload v2.0
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              `data/new_schema.json`
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-500 font-medium">Target Integration</div>
            <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              NetSuite ERP Pipeline
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              `data/mapping_config.json`
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-500 font-medium">Mapped Fields</div>
            <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              4 Active Mapping Nodes
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Customer, ARR, Status, Phone
            </div>
          </div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 bg-slate-900/40 hover:border-indigo-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <GitCompare className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Automated Schema AST Diff</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instantly isolates added, removed, renamed, and type-altered properties between API versions.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 bg-slate-900/40 hover:border-violet-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Grok AI Reasoning</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates blast radius across downstream ERP dependencies to pinpoint exactly why data flows break.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
            <FileCode2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Code Fix Generation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Outputs exact transformation code patches, fallback handlers, and human-readable changelogs.
          </p>
        </div>
      </div>
    </div>
  );
}
