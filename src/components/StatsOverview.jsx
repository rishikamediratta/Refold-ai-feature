import React from 'react';
import { Layers, AlertTriangle, ShieldAlert, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function StatsOverview({ totalMappings, affectedCount, criticalCount, healthyCount }) {
  const cards = [
    {
      title: 'Total Mappings Analyzed',
      value: totalMappings,
      subtext: 'HubSpot ➔ NetSuite Pipeline',
      icon: Layers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Affected Mappings',
      value: affectedCount,
      subtext: `${Math.round((affectedCount / (totalMappings || 1)) * 100)}% pipeline drift rate`,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Critical Breakages',
      value: criticalCount,
      subtext: 'Breaking schema payload changes',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    {
      title: 'Healthy Mappings',
      value: healthyCount,
      subtext: 'Unaffected integration nodes',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card rounded-2xl p-4.5 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.border} border`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white tracking-tight font-mono">
                {card.value}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
