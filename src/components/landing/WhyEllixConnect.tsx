import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Award,
  ShieldCheck,
  Network,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BenefitItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  expandedDetails: string;
  icon: React.ElementType;
  keyMetric: string;
  bullets: string[];
}

const benefits: BenefitItem[] = [
  {
    id: 'simple',
    title: 'Simple',
    subtitle: 'Zero Learning Curve',
    description: 'Designed for everyday business owners and staff, not software engineers. If you know how to use a smartphone, you already know how to run Ellix Connect.',
    expandedDetails: 'Every workflow has been trimmed down to the minimum necessary taps. With intuitive search, standard keyboard shortcuts (F2 for bill, F4 for cash, F8 for barcode search), and zero obscure database settings, new cashiers become fully productive on their very first shift.',
    icon: Sparkles,
    keyMetric: '< 2 min onboarding',
    bullets: [
      'Clean, distraction-free interfaces',
      'No specialized IT training needed',
      'One-click item selection'
    ]
  },
  {
    id: 'fast',
    title: 'Fast',
    subtitle: 'High-Speed Counter Ops',
    description: 'Never keep a line waiting. High-frequency barcode scanning, quick-touch favorites, and 3-tap checkout ensure lightning-fast customer throughput.',
    expandedDetails: 'Our rendering engine eliminates counter stutter. Barcode readers trigger asynchronous cache lookups in under 15ms, thermal receipts print instantly via direct USB/network socket spooling, and dynamic UPI QR codes generate in under 200ms.',
    icon: Zap,
    keyMetric: '0.4s barcode response',
    bullets: [
      'Sub-second SKU lookups',
      'Instant UPI dynamic QR generation',
      'Rapid thermal receipt dispatch'
    ]
  },
  {
    id: 'professional',
    title: 'Professional',
    subtitle: 'Elevate Customer Trust',
    description: 'Give customers a polished experience with branded GST invoices, paperless WhatsApp bills, accurate loyalty point receipts, and clear itemized totals.',
    expandedDetails: 'Impress your customers with beautifully formatted bills displaying your logo, custom greetings, GSTIN, HSN summaries, and dynamic QR verification codes. Customers appreciate paperless WhatsApp invoices and clear digital Khata balance notifications.',
    icon: Award,
    keyMetric: '100% Tax Compliant',
    bullets: [
      'Clean branded PDF & thermal bills',
      'Automated WhatsApp billing updates',
      'Transparent customer Khata ledgers'
    ]
  },
  {
    id: 'reliable',
    title: 'Reliable',
    subtitle: 'Offline-First Resilience',
    description: 'Your business cannot afford downtime. Built with local data caching and automatic cloud sync, sales continue smoothly even during power or internet drops.',
    expandedDetails: 'The cash register never halts. If your broadband or mobile hotspot drops, Ellix Connect seamlessly switches to local IndexedDB caching. Invoices, cash receipts, and inventory deductions continue locally and reconcile the second connectivity returns.',
    icon: ShieldCheck,
    keyMetric: '99.99% Uptime Guarantee',
    bullets: [
      'Works seamlessly offline',
      'Automatic background cloud sync',
      'Bank-grade encrypted records'
    ]
  },
  {
    id: 'connected',
    title: 'Connected',
    subtitle: 'One Unified Source of Truth',
    description: 'Say goodbye to isolated software silos. Stock, billing, customers, cashier shifts, and tax reports are permanently wired into a single synchronized hub.',
    expandedDetails: 'No more spreadsheets or duplicate entry. When an item is billed at the till, stock is decremented immediately, loyalty points are added to the customer ledger, shift drawer balances increment, and day-end tax ledgers update in a single transaction.',
    icon: Network,
    keyMetric: 'Unified Architecture',
    bullets: [
      'Automatic stock decrements on sale',
      'Zero manual spreadsheet reconciliation',
      'Real-time multi-register sync'
    ]
  }
];

export const WhyEllixConnect: React.FC = () => {
  const [selectedBenefitId, setSelectedBenefitId] = useState<string>('simple');

  const selectedBenefit = benefits.find((b) => b.id === selectedBenefitId) || benefits[0];
  const SelectedIcon = selectedBenefit.icon;

  return (
    <section id="why-ellix" className="py-20 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Why Ellix Connect
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Built for modern retail. Built to last.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Click any of the five pillars below to view its in-depth architectural explanation and learn why store owners trust Ellix Connect.
          </p>
        </div>

        {/* 5 Benefits Selectable Grid: 3 on top, 2 on bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.slice(0, 3).map((benefit) => {
            const Icon = benefit.icon;
            const isSelected = selectedBenefitId === benefit.id;

            return (
              <button
                key={benefit.id}
                id={`benefit-${benefit.id}`}
                type="button"
                data-cursor="card"
                onClick={() => setSelectedBenefitId(benefit.id)}
                className={`website-card-hover p-7 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {benefit.keyMetric}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    {benefit.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 flex items-center justify-between">
                    <span>{benefit.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {benefit.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom 2 Benefits: wider 2-col layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {benefits.slice(3, 5).map((benefit) => {
            const Icon = benefit.icon;
            const isSelected = selectedBenefitId === benefit.id;

            return (
              <button
                key={benefit.id}
                id={`benefit-${benefit.id}`}
                type="button"
                data-cursor="card"
                onClick={() => setSelectedBenefitId(benefit.id)}
                className={`website-card-hover p-7 rounded-2xl text-left border transition-all flex flex-col sm:flex-row justify-between gap-6 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {benefit.keyMetric}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    {benefit.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 flex items-center justify-between">
                    <span>{benefit.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="sm:w-64 pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center space-y-2.5">
                  {benefit.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Benefit Deep-Dive Explanation Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Architectural Deep Dive: {selectedBenefit.title}</span>
              </div>
              <h4 className="text-xl font-bold text-white">
                How "{selectedBenefit.title}" is engineered in Ellix Connect
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {selectedBenefit.expandedDetails}
              </p>
            </div>
            <div className="shrink-0">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Key Performance Target</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{selectedBenefit.keyMetric}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

