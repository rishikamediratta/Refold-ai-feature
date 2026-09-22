import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import SchemaDiffView from './components/SchemaDiffView';
import ImpactCard from './components/ImpactCard';
import HealthyMappingsView from './components/HealthyMappingsView';
import IntroHero from './components/IntroHero';

import oldSchema from '../data/old_schema.json';
import newSchema from '../data/new_schema.json';
import mappingConfig from '../data/mapping_config.json';
import { analyzeSchemaChanges } from './utils/schemaDiff';

import { 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Activity,
  ArrowLeft
} from 'lucide-react';

// Hardcoded synthetic analysis results matching prototype baseline metrics
const HARDCODED_ANALYSES = [
  {
    mapping_id: 'map-001',
    name: 'Customer Email Sync',
    source_field: 'crm.contact_email',
    target_field: 'erp.customer_email',
    break_type: 'FIELD_RENAMED',
    confidence_score: 96,
    what_changed: "CRM field 'contact_email' was renamed to 'primary_email' in API v2.0.0",
    why_affected: "The pipeline attempts to extract payload.contact_email which now resolves to undefined. The target ERP system requires customer_email, causing null constraint violations on customer creation.",
    suggested_fix: "Update mapping source path:\nFROM: crm.contact_email\nTO:   crm.primary_email",
    changelog_entry: "Remapped primary contact email payload field from deprecated contact_email to v2.0 primary_email."
  },
  {
    mapping_id: 'map-002',
    name: 'ARR Financial Reporting',
    source_field: 'crm.annual_revenue',
    target_field: 'erp.arr_amount',
    break_type: 'FIELD_REMOVED',
    confidence_score: 99,
    what_changed: "CRM field 'annual_revenue' was completely removed in API v2.0.0",
    why_affected: "The target ERP field erp.arr_amount relies on this value for financial reporting and credit score calculation. Passing null drops risk evaluation telemetry.",
    suggested_fix: "Set fallback transform or fetch revenue from Account API endpoint:\nerp.arr_amount = payload.account_financials?.annual_revenue ?? 0;",
    changelog_entry: "Flagged removed revenue field and inserted default fallback value transformer for ERP credit pipeline."
  },
  {
    mapping_id: 'map-003',
    name: 'Account Status Lifecycle',
    source_field: 'crm.account_status',
    target_field: 'erp.status_code',
    break_type: 'TYPE_MISMATCH',
    confidence_score: 92,
    what_changed: "CRM field 'account_status' changed from string (\"ACTIVE\") to nested object ({ status_code: \"ACT\", label: \"Active\" })",
    why_affected: "The ERP system expects a flat string status code. Mapping the whole object causes '[object Object]' coercion or string validation failure in NetSuite ERP API.",
    suggested_fix: "Update transformation path to extract sub-property:\nFROM: crm.account_status\nTO:   crm.account_status.status_code",
    changelog_entry: "Adapted account status extractor to access nested status_code property from updated v2.0 schema object."
  }
];

export default function App() {
  const [analysisState, setAnalysisState] = useState({
    detectedChanges: [],
    affectedMappings: [],
    healthyMappings: [],
    totalMappingsCount: 0
  });

  const [aiAnalyses, setAiAnalyses] = useState(HARDCODED_ANALYSES);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState('');

  // Initial schema diff calculation
  useEffect(() => {
    const result = analyzeSchemaChanges(oldSchema, newSchema, mappingConfig);
    setAnalysisState(result);
  }, []);

  // Handler when clicking "Analyze with Grok AI"
  const handleRunAnalysis = async () => {
    setIsLoading(true);

    try {
      // Step 1: Loading simulation
      setLoadingStep('Cross-referencing schema drift against integration mapping graph...');
      await new Promise(r => setTimeout(r, 450));

      // Step 2: Synthesis simulation / API call
      setLoadingStep('Grok AI engine synthesizing remediation strategy & confidence scores...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affectedMappings: analysisState.affectedMappings,
          schemaChanges: analysisState.detectedChanges
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analyses && data.analyses.length > 0) {
          setAiAnalyses(data.analyses);
        } else {
          setAiAnalyses(HARDCODED_ANALYSES);
        }
      } else {
        setAiAnalyses(HARDCODED_ANALYSES);
      }
    } catch (err) {
      console.warn('Backend API call fallback:', err);
      setAiAnalyses(HARDCODED_ANALYSES);
    } finally {
      setLastAnalyzedTime(new Date().toLocaleTimeString());
      setHasAnalyzed(true);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleResetToIntro = () => {
    setHasAnalyzed(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Header 
        onRunAnalysis={handleRunAnalysis} 
        isLoading={isLoading} 
        hasAnalyzed={hasAnalyzed}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="my-12 p-12 rounded-3xl glass-card border border-indigo-500/40 text-center flex flex-col items-center justify-center space-y-5 glow-indigo bg-slate-900/80 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Autonomous Grok AI Sentinel Active
              </h3>
              <p className="text-sm font-mono text-indigo-300 animate-pulse">
                {loadingStep}
              </p>
            </div>
          </div>
        )}

        {/* Intro View (Before clicking Analyze) */}
        {!hasAnalyzed && !isLoading && (
          <IntroHero 
            onRunAnalysis={handleRunAnalysis} 
            isLoading={isLoading} 
          />
        )}

        {/* Analysis Dashboard View (Only after clicking Analyze) */}
        {hasAnalyzed && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    AI Impact Analysis &amp; Remediation Plan
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grok AI agent cross-references affected mapping nodes to compute break classifications and fixes
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400">
                {lastAnalyzedTime && (
                  <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    Updated at {lastAnalyzedTime}
                  </span>
                )}
                
                <button
                  onClick={handleResetToIntro}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>Back to Overview</span>
                </button>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-700/50 text-xs font-medium text-indigo-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Re-analyze</span>
                </button>
              </div>
            </div>

            {/* Top Metric Cards */}
            <StatsOverview 
              totalMappings={analysisState.totalMappingsCount}
              affectedCount={analysisState.affectedMappings.length}
              criticalCount={analysisState.detectedChanges.length}
              healthyCount={analysisState.healthyMappings.length}
            />

            {/* Schema Comparison Visualizer */}
            <SchemaDiffView 
              oldSchema={oldSchema}
              newSchema={newSchema}
              detectedChanges={analysisState.detectedChanges}
            />

            {/* Affected Mappings Cards Grid */}
            <div className="space-y-4 mb-8">
              {aiAnalyses.map((analysis, idx) => {
                const matchedMapping = analysisState.affectedMappings.find(
                  m => m.id === analysis.mapping_id
                );
                return (
                  <ImpactCard 
                    key={analysis.mapping_id || idx}
                    analysis={analysis}
                    mapping={matchedMapping}
                  />
                );
              })}
            </div>

            {/* Healthy Mappings Table */}
            <HealthyMappingsView 
              healthyMappings={analysisState.healthyMappings}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Schema-Change Impact Agent</span>
            <span>• Proof-of-Concept Integration Sentinel</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by React &amp; Grok AI Engine
          </p>
        </div>
      </footer>

    </div>
  );
}
