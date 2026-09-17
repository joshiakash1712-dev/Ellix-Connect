import React, { useState } from 'react';
import {
  Store,
  Receipt,
  TrendingUp,
  CheckCircle2,
  ScanLine,
  QrCode,
  FileSpreadsheet,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StepDetail {
  id: string;
  stepIndex: number;
  number: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  expandedExplanation: string;
  icon: React.ElementType;
  keyPoints: string[];
  mockupSnippet: React.ReactNode;
}

const steps: StepDetail[] = [
  {
    id: 'setup-catalog',
    stepIndex: 0,
    number: '01',
    title: 'Set up your catalog',
    subtitle: 'Under 5 Minutes',
    shortDescription: 'Add your business name, import or scan your product inventory with standard barcodes, set your local tax rates, and invite your counter staff.',
    expandedExplanation: 'Get started effortlessly with our guided CSV import wizard or quick-scan mobile camera helper. Ellix Connect automatically maps standard GS1/EAN barcodes, configures GST slabs (5%, 12%, 18%, 28%), and organizes your catalog into intuitive departments with multi-unit packaging support.',
    icon: Store,
    keyPoints: [
      'Store profile & tax rate setup',
      'Bulk inventory import with barcodes',
      'Role-based staff permissions'
    ],
    mockupSnippet: (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
          <span>Store Onboarding</span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">Step 1 of 3</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Business Name</div>
          <div className="font-semibold text-slate-900 dark:text-white">Lakshmi Supermarket & Mart</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Catalog</div>
            <div className="font-semibold text-emerald-700 dark:text-emerald-400">1,240 SKUs Ready</div>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Tax Mode</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">GST Ready (5/12/18%)</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'start-billing',
    stepIndex: 1,
    number: '02',
    title: 'Start billing immediately',
    subtitle: 'High-Velocity Counter',
    shortDescription: 'Ring up sales in seconds, accept payments via dynamic UPI QR, cash, or card, keep stock synced live, and record customer Khata without paper notebooks.',
    expandedExplanation: 'Your cashiers scan barcodes in under 0.2s, add multiple items, apply member discounts, and accept payments with zero downtime. Dynamic UPI QR codes generate instantly on customer-facing screens, and thermal receipts or WhatsApp digital invoices dispatch automatically.',
    icon: Receipt,
    keyPoints: [
      'Sub-second barcode & SKU scanning',
      'Automated stock reduction per bill',
      'Instant digital WhatsApp receipts'
    ],
    mockupSnippet: (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-1.5">
            <ScanLine className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Counter Register #01</span>
          </span>
          <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono">Active Sale</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">4 Items Scanned</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Basmati, Mustard Oil, Tea, Sugar</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900 dark:text-white">₹890.00</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">UPI Paid ✓</div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
          <span>Customer: S. Mehra</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">WhatsApp Bill Sent</span>
        </div>
      </div>
    )
  },
  {
    id: 'grow-clarity',
    stepIndex: 2,
    number: '03',
    title: 'Grow with clarity',
    subtitle: 'Actionable Intelligence',
    shortDescription: 'Track daily profits, spot your top 10 fastest moving items, get early warnings on low stock, and download audit-ready tax reports with a single click.',
    expandedExplanation: 'Close your store in 60 seconds with automated shift balancing and cash drawer tallying. Gain comprehensive visibility into your best-performing products, gross profit margins per category, dead stock alerts, and single-click GSTR-1 tax compliance summaries.',
    icon: TrendingUp,
    keyPoints: [
      'Real-time gross margin analytics',
      'Fast-selling vs dead stock alerts',
      'One-click tax & accounting export'
    ],
    mockupSnippet: (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
          <span>Day-End Closing Summary</span>
          <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">Audit Ready</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Gross Sales</div>
            <div className="font-bold text-slate-900 dark:text-white">₹52,480</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Net Margin</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400">24.6%</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3 text-slate-500 dark:text-slate-400" /> GST Report Ready
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">Download CSV</span>
        </div>
      </div>
    )
  }
];

export const HowItWorks: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleNextStep = () => {
    setActiveStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Three simple steps to running a calmer store.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            No bulky enterprise installation, no IT consultants, no long manuals. Ellix Connect is ready the moment you open your browser or tablet.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300/70 dark:border-slate-800">
            {steps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStepIndex === idx;
            const isExpanded = expandedStep === step.id;

            return (
              <div
                key={step.number}
                id={`how-step-${step.number}`}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-7 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-xl'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Header: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-2xl font-extrabold font-mono ${
                      isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
                    }`}>
                      {step.number}
                    </span>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    {step.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {step.shortDescription}
                  </p>

                  {/* Expandable Explanation Toggle (Requirement #7) */}
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStep(isExpanded ? null : step.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      <span>{isExpanded ? 'Hide in-depth details' : 'Read in-depth explanation'}</span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed">
                        {step.expandedExplanation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Micro Visual Card Preview */}
                <div className="mb-6">
                  {step.mockupSnippet}
                </div>

                {/* Key Points */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {step.keyPoints.map((point, pointIdx) => (
                    <div key={pointIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-Through Navigation Controls (Requirement #7) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">Active Step {activeStepIndex + 1} of 3:</span>
            <span>{steps[activeStepIndex].title}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous Step
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <span>{activeStepIndex === steps.length - 1 ? 'Restart from Step 1' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

