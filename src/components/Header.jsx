import React from 'react';
import { Cpu, ShieldCheck, Zap, Database, Terminal } from 'lucide-react';

export default function Header({ modelName, onRunAnalysis, isLoading, hasAnalyzed }) {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Schema-Change Impact Agent
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                Autonomous iPaaS Sentinel
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Drift Detection &amp; Remediation Pipeline</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <Database className="w-3 h-3 text-violet-400" />
                HubSpot CRM ➔ NetSuite ERP
              </span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Trigger */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Model Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">Engine:</span>
            <span className="font-mono text-indigo-300 font-semibold">Grok AI Engine</span>
          </div>

          {/* Active Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
            hasAnalyzed 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${hasAnalyzed ? 'bg-emerald-400' : 'bg-indigo-400'}`}></span>
            <span>{hasAnalyzed ? 'Analysis Active' : 'Sentinel Ready'}</span>
          </div>

          {/* Run Analysis Button */}
          <button
            onClick={onRunAnalysis}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 cursor-pointer ${
              isLoading
                ? 'bg-indigo-900/50 cursor-not-allowed border border-indigo-700/50 text-indigo-300'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 shadow-indigo-600/30 glow-indigo'
            }`}
          >
            <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading 
                ? 'Analyzing Impact...' 
                : hasAnalyzed 
                ? 'Re-analyze Payload' 
                : 'Analyze with Grok AI'
              }
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
