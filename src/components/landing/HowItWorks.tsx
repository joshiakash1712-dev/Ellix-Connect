import React, { useState, useRef, useEffect } from 'react';
import {
  Store,
  Receipt,
  TrendingUp,
  CheckCircle2,
  ScanLine,
  FileSpreadsheet,
  ArrowRight,
  MousePointer2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface StepDetail {
  id: string;
  stepIndex: number;
  number: string;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  expandedExplanation: string;
  icon: React.ElementType;
  keyPoints: string[];
  metrics: Array<{ label: string; value: string }>;
  mockupSnippet: React.ReactNode;
  workspacePreview: {
    badgeText: string;
    headline: string;
    statusText: string;
    consoleSnippet: React.ReactNode;
  };
}

const steps: StepDetail[] = [
  {
    id: 'setup-catalog',
    stepIndex: 0,
    number: '01',
    shortLabel: '01 · Set up catalog',
    badge: '< 5 Min Setup',
    title: 'Set up your catalog',
    subtitle: 'Under 5 Minutes',
    shortDescription: 'Add your business name, import or scan your product inventory with standard barcodes, set your local tax rates, and invite your counter staff.',
    expandedExplanation: 'Get started effortlessly with our guided CSV import wizard or quick-scan mobile camera helper. Ellic automatically maps standard GS1/EAN barcodes, configures GST slabs (5%, 12%, 18%, 28%), and organizes your catalog into intuitive departments with multi-unit packaging support.',
    icon: Store,
    keyPoints: [
      'Store profile & tax rate setup',
      'Bulk inventory import with barcodes',
      'Role-based staff permissions'
    ],
    metrics: [
      { label: 'Setup Time', value: '< 5 Minutes' },
      { label: 'Barcode Format', value: 'GS1 / EAN / Custom' },
      { label: 'Tax Slabs', value: 'GST 5/12/18/28%' }
    ],
    mockupSnippet: (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
          <span>Store Onboarding</span>
          <span className="text-[10px] bg-sky-100 dark:bg-blue-950 text-blue-800 dark:text-sky-300 px-1.5 py-0.5 rounded font-mono">Step 1 of 3</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Business Name</div>
          <div className="font-semibold text-slate-900 dark:text-white">Lakshmi Supermarket &amp; Mart</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Catalog</div>
            <div className="font-semibold text-blue-700 dark:text-sky-400">1,240 SKUs Ready</div>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Tax Mode</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">GST Ready (5/12/18%)</div>
          </div>
        </div>
      </div>
    ),
    workspacePreview: {
      badgeText: 'Guided Store Onboarding Wizard',
      headline: 'Automated SKU, Barcode & Staff Provisioning',
      statusText: 'Zero IT Consultant Required',
      consoleSnippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
            <span>CATALOG &amp; STORE INITIALIZER</span>
            <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">
              STEP 01 READY
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Merchant Profile</div>
              <div className="font-bold text-white mt-0.5">Lakshmi Supermarket &amp; Mart</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Catalog Import</div>
              <div className="font-bold text-sky-400 mt-0.5">1,240 SKUs + Barcodes</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <span>Staff Access: 1 Owner + 3 Counter Crew Assigned</span>
            <span className="text-sky-400 font-bold">GST 5/12/18% Active ✓</span>
          </div>
        </div>
      )
    }
  },
  {
    id: 'start-billing',
    stepIndex: 1,
    number: '02',
    shortLabel: '02 · Start billing',
    badge: '0.2s Scan Speed',
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
    metrics: [
      { label: 'Scan Latency', value: '< 0.2 Seconds' },
      { label: 'Tender Modes', value: 'UPI / Cash / Card / Khata' },
      { label: 'Stock Sync', value: 'Atomic Per-Bill' }
    ],
    mockupSnippet: (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-1.5">
            <ScanLine className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
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
            <div className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold">UPI Paid ✓</div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
          <span>Customer: S. Mehra</span>
          <span className="text-blue-700 dark:text-sky-400 font-medium">WhatsApp Bill Sent</span>
        </div>
      </div>
    ),
    workspacePreview: {
      badgeText: 'Counter Register #01 · Live POS',
      headline: 'Express Barcode Checkout & Dynamic UPI Settlement',
      statusText: 'WhatsApp & 80mm Thermal Ready',
      consoleSnippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
            <span className="flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5" />
              <span>COUNTER REGISTER #01 · ACTIVE SALE</span>
            </span>
            <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">
              UPI PAID ✓
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>4 Items Scanned (Basmati, Mustard Oil, Tea, Sugar)</span>
              <span className="text-white font-bold">₹890.00</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Inventory Deduction (4 SKUs Updated Live)</span>
              <span className="text-sky-400">-4 Units Synced</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
              <span>Customer: S. Mehra</span>
              <span className="text-sky-400">WhatsApp Bill Dispatched ✓</span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'grow-clarity',
    stepIndex: 2,
    number: '03',
    shortLabel: '03 · Grow with clarity',
    badge: '60s Day-End Close',
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
    metrics: [
      { label: 'Shift Closing', value: '60 Seconds' },
      { label: 'Net Margin View', value: '24.6% Live P&L' },
      { label: 'Tax Export', value: '1-Click GSTR-1 CSV' }
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
            <div className="font-bold text-blue-700 dark:text-sky-400">24.6%</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3 text-slate-500 dark:text-slate-400" /> GST Report Ready
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">Download CSV</span>
        </div>
      </div>
    ),
    workspacePreview: {
      badgeText: 'Executive P&L & Day-End Closing Engine',
      headline: 'Automated Shift Balance, Margin & GST Export',
      statusText: '100% Audit-Ready Ledger',
      consoleSnippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
            <span>DAY-END EXECUTIVE CLOSING SHEET</span>
            <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">
              AUDIT READY
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Gross Sales</div>
              <div className="font-bold text-white">₹52,480</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Net Margin</div>
              <div className="font-bold text-sky-400">24.6%</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Low Stock Alerts</div>
              <div className="font-bold text-amber-400">3 Reorder Items</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>GSTR-1 &amp; Category Profit Table Ready</span>
            </span>
            <span className="text-white font-bold underline">Download CSV / Excel</span>
          </div>
        </div>
      )
    }
  }
];

export const HowItWorks: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [originIndex, setOriginIndex] = useState<number>(0);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const activeStep = steps[activeStepIndex] || steps[0];
  const ActiveIcon = activeStep.icon;

  // Spatial transform-origin mapped to the 3-column desktop step grid
  const getOrigin = (index: number) => {
    if (index === 0) return '16.6% 50%';
    if (index === 1) return '50.0% 50%';
    return '83.3% 50%';
  };

  const handleCardMouseEnter = (index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // 50ms intentional buffer to prevent accidental rapid flashing
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveStepIndex(index);
      setOriginIndex(index);
      setIsHovered(true);
    }, 50);
  };

  const handleSectionMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // 160ms grace buffer before returning to the 3-step card grid
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 160);
  };

  const handleSectionMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleNextStep = () => {
    const next = activeStepIndex < steps.length - 1 ? activeStepIndex + 1 : 0;
    setActiveStepIndex(next);
    setOriginIndex(next);
  };

  const handlePrevStep = () => {
    const prev = activeStepIndex > 0 ? activeStepIndex - 1 : steps.length - 1;
    setActiveStepIndex(prev);
    setOriginIndex(prev);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveStepIndex(index);
      setOriginIndex(index);
      setIsHovered(true);
    } else if (e.key === 'Escape' && isHovered) {
      e.preventDefault();
      setIsHovered(false);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % steps.length;
      setActiveStepIndex(next);
      setOriginIndex(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + steps.length) % steps.length;
      setActiveStepIndex(prev);
      setOriginIndex(prev);
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>How It Works</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold normal-case tracking-normal">Setup to Scale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Three simple steps to running a calmer store.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            No bulky enterprise installation, no IT consultants, no long manuals. Ellic is ready the moment you open your browser or tablet.
            <span className="hidden lg:inline text-blue-600 dark:text-sky-400 font-semibold ml-1">
              Hover over any step below to explore its live onboarding &amp; operating workspace in-place.
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP EXPERIENCE (lg: screens and wider): MORPHING WORKSPACE */}
        {/* ============================================================ */}
        <div
          className="hidden lg:grid lg:grid-cols-1 items-stretch relative box-border"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          {/* Layer 1: Background 3-Step Entry-Point Card Grid */}
          <div
            className={`col-start-1 row-start-1 w-full h-full grid grid-cols-3 gap-8 min-h-[560px] items-stretch transition-all duration-200 ease-out will-change-transform ${
              isHovered
                ? 'opacity-20 scale-[0.99] pointer-events-auto'
                : 'opacity-100 scale-100'
            }`}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={step.number}
                  id={`how-step-${step.number}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isCurrent}
                  data-cursor="card"
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onClick={() => handleCardMouseEnter(idx)}
                  onKeyDown={(e) => handleCardKeyDown(e, idx)}
                  className={`website-card-hover p-7 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer text-left ${
                    isCurrent && !isHovered
                      ? 'bg-white dark:bg-slate-900 border-sky-500/60 ring-2 ring-blue-500/30 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    {/* Top Bar: Icon + Step Number Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        data-icon-box
                        className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-blue-600 dark:text-sky-400 flex items-center justify-center transition-all duration-200"
                      >
                        <Icon className="w-5 h-5 transition-transform duration-200" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          data-card-badge
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-200"
                        >
                          {step.badge}
                        </span>
                        <span className="text-lg font-extrabold font-mono text-blue-600 dark:text-sky-400">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Title */}
                    <div className="text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                      {step.subtitle}
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {step.shortDescription}
                    </p>

                    {/* Compact Visual Preview */}
                    <div className="mb-5">
                      {step.mockupSnippet}
                    </div>
                  </div>

                  {/* Bottom Key Points Checklist */}
                  <div
                    data-card-support
                    className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 transition-transform duration-200"
                  >
                    {step.keyPoints.map((point, pointIdx) => (
                      <div key={pointIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 2: Morphing Interactive 3-Step Workspace */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="how-it-works-expanded-workspace"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        transformOrigin: getOrigin(originIndex)
                      }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        scale: 1,
                        transformOrigin: getOrigin(originIndex)
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        transformOrigin: getOrigin(originIndex)
                      }
                }
                transition={{
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="col-start-1 row-start-1 z-20 w-full h-full min-h-[560px] box-border overflow-hidden p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 dark:border-sky-500/30 shadow-2xl ring-1 ring-blue-500/20 flex flex-col justify-between gap-5"
              >
                {/* Top Interactive 3-Step Switcher Ribbon */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                        Interactive 3-Step Onboarding Workspace
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-sky-100 dark:bg-blue-950/80 text-blue-800 dark:text-sky-300 text-[11px] font-mono font-bold border border-sky-300/60 dark:border-sky-800/60">
                        Active Step {activeStepIndex + 1} of 3
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MousePointer2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Hover any step pill to transform workspace</span>
                    </div>
                  </div>

                  {/* 3 Step Dock Pills */}
                  <div className="grid grid-cols-3 gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/80 shadow-inner">
                    {steps.map((s, idx) => {
                      const StepIcon = s.icon;
                      const isActive = idx === activeStepIndex;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          data-cursor="hover"
                          aria-pressed={isActive}
                          onMouseEnter={() => {
                            setActiveStepIndex(idx);
                            setOriginIndex(idx);
                          }}
                          onClick={() => {
                            setActiveStepIndex(idx);
                            setOriginIndex(idx);
                          }}
                          className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 border border-sky-500/50 shadow-sm ring-1 ring-blue-500/20'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 border border-transparent'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {s.number}
                          </span>
                          <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                          <span className="truncate">{s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workspace Content: Two-Column Fluid Morphing State */}
                <div className="flex-1 flex flex-col lg:flex-row items-start justify-between gap-8">
                  {/* Left: In-Depth Step Explanation, Key Points & Metrics */}
                  <motion.div
                    key={`how-left-${activeStep.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[48%] space-y-3.5"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-blue-950/80 text-blue-800 dark:text-sky-300 text-xs font-bold border border-sky-300/60 dark:border-sky-800/60">
                      <ActiveIcon className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                      <span>
                        Step {activeStep.number} · {activeStep.subtitle}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {activeStep.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {activeStep.expandedExplanation}
                    </p>

                    {/* Key Points Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Included in Step {activeStep.number}:
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {activeStep.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Metric Badges */}
                    <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                      {activeStep.metrics.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs"
                        >
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold truncate">
                            {item.label}
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5 truncate">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right: Live Step Simulation & Step-Through Controls */}
                  <motion.div
                    key={`how-right-${activeStep.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[52%]"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3.5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {activeStep.workspacePreview.badgeText}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 bg-sky-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60">
                          {activeStep.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          {activeStep.workspacePreview.headline}
                        </h4>
                        {activeStep.workspacePreview.consoleSnippet}
                      </div>

                      {/* Step-Through Navigation Controls */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-cursor="hover"
                            onClick={handlePrevStep}
                            disabled={activeStepIndex === 0}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            Previous Step
                          </button>
                          <button
                            type="button"
                            data-cursor="hover"
                            onClick={handleNextStep}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                          >
                            <span>{activeStepIndex === steps.length - 1 ? 'Restart from Step 1' : 'Next Step'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-sky-500 font-semibold">
                          {activeStep.workspacePreview.statusText}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* MOBILE & TABLET EXPERIENCE (< lg screens): CLEAN & ACCESSIBLE */}
        {/* ============================================================ */}
        <div className="block lg:hidden space-y-4">
          <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStepIndex === idx;

              return (
                <button
                  key={step.number}
                  id={`mobile-how-step-${step.number}`}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  aria-pressed={isSelected}
                  className={`snap-start shrink-0 w-[250px] sm:w-auto p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-500 ring-2 ring-blue-500/40 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400">
                        Step {step.number}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider mb-0.5">
                      {step.subtitle}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {step.shortDescription}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-sky-400">
                    <span>{isSelected ? 'Viewing step workspace ↓' : 'Tap to preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Detail Workspace */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800">
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>
                  Step {activeStep.number} of 03 · {activeStep.subtitle}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-sky-400">
                {activeStep.badge}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
              {activeStep.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeStep.expandedExplanation}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Included in Step {activeStep.number}:
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeStep.keyPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              {activeStep.workspacePreview.consoleSnippet}
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <span>{activeStepIndex === steps.length - 1 ? 'Restart from Step 1' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


