import React, { useState } from 'react';
import {
  Receipt,
  Boxes,
  Users,
  CreditCard,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MousePointer,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorkWheelStage } from './WorkWheelStage';
import { useCardWheelScroll } from '../../hooks/useCardWheelScroll';

interface CapabilityCard {
  id: string;
  number: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  points: string[];
  telemetry: {
    label: string;
    value: string;
    status: string;
  };
}

const capabilities: CapabilityCard[] = [
  {
    id: 'billing',
    number: '01',
    title: 'Billing & POS',
    badge: 'Sub-0.2s Checkout',
    icon: Receipt,
    description: 'Fast counter checkout with USB/Bluetooth optical barcode scanners and instant thermal printing.',
    points: [
      'Sub-second barcode scan & keyboard shortcuts',
      'Instant 58mm/80mm thermal receipts & PDF bills',
      'Direct WhatsApp digital bills sent to shoppers',
    ],
    telemetry: {
      label: 'Scan Latency',
      value: '< 0.18s per item',
      status: 'Real-time USB & Bluetooth sync',
    },
  },
  {
    id: 'inventory',
    number: '02',
    title: 'Products & Inventory',
    badge: 'Real-Time Sync',
    icon: Boxes,
    description: 'Track stock across registers with automatic deductions on every sale and proactive restock alerts.',
    points: [
      'Automatic stock deduction on every sale',
      'Batch tracking with 30-day expiry warnings',
      'Built-in barcode generator & label printing',
    ],
    telemetry: {
      label: 'Stock Reconciliation',
      value: 'Instant FIFO Deduct',
      status: 'Multi-register ledger',
    },
  },
  {
    id: 'customers',
    number: '03',
    title: 'Customers & Khata',
    badge: 'Zero-Paper Ledger',
    icon: Users,
    description: 'Replace paper diaries with a digital Khata credit book and automated payment reminders.',
    points: [
      'Customer credit limits to prevent overdue exposure',
      '1-tap WhatsApp balance reminders with UPI payment links',
      'Full purchase history & loyalty points per buyer',
    ],
    telemetry: {
      label: 'Credit Safeguard',
      value: 'Dynamic Cap Enforcement',
      status: 'Auto WhatsApp UPI links',
    },
  },
  {
    id: 'payments',
    number: '04',
    title: 'Payments & Settlements',
    badge: 'Multi-Tender',
    icon: CreditCard,
    description: 'Accept any tender: dynamic exact-amount UPI QR codes, debit/credit cards, cash, and split bills.',
    points: [
      'Dynamic UPI QR generated per invoice for scan-and-pay',
      'Split payments (e.g. part cash + part UPI + part credit)',
      'Cash drawer reconciliation on shift handover',
    ],
    telemetry: {
      label: 'Tender Settlement',
      value: 'Dynamic Exact-Amount UPI',
      status: 'Instant verification',
    },
  },
  {
    id: 'team',
    number: '05',
    title: 'Team & Access Control',
    badge: '4-Digit PINs',
    icon: ShieldCheck,
    description: 'Keep your cash register secure with role-based access control and rapid cashier switching.',
    points: [
      'Quick 4-digit PIN login for counter cashiers',
      'Shift opening and closing drawer cash balancing',
      'Protect discount approval & wholesale buying prices',
    ],
    telemetry: {
      label: 'Security & Shifts',
      value: '4-Digit Fast PIN Switch',
      status: 'Blind drawer cash tallies',
    },
  },
  {
    id: 'reports',
    number: '06',
    title: 'Reports & Records',
    badge: 'Audit Ready',
    icon: BarChart3,
    description: 'Daily Z-reports, gross profit margins, and GST tax breakdowns generated without manual calculation.',
    points: [
      'End-of-day Z-reports generated in 60 seconds',
      'GSTR-1 sales schedules with HSN summary export',
      'Tamper-evident audit logs of every price override',
    ],
    telemetry: {
      label: 'Compliance Engine',
      value: 'GSTR-1 Ready (1-Click CSV)',
      status: 'Automated tax reconciliation',
    },
  },
];

export const CoreCapabilities: React.FC = () => {
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentCap = capabilities[activeCapIndex] || capabilities[0];
  const Icon = currentCap.icon;

  const handleCapSelect = React.useCallback((idx: number) => {
    setActiveCapIndex(idx);
  }, []);

  // Work wheel scrolling with screen centering and page-lock until last card
  const {
    sectionRef,
    cardRef,
    scrollProps,
    isLastItem,
    scrollToNextSection,
  } = useCardWheelScroll({
    totalItems: capabilities.length,
    activeIndex: activeCapIndex,
    onActiveChange: setActiveCapIndex,
    sectionId: 'features',
  });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-12 sm:py-16 md:py-20 scroll-mt-16 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            Six tools unified into one calm platform.
          </h2>
        </div>

        {/* Side-by-Side: Interactive Work Wheel on Left, Live Scrolling Capability Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: Vector Work Wheel Dial Component (Hidden on mobile for clean preview, visible on desktop) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 flex-col">
            <WorkWheelStage
              items={capabilities.map((c) => ({
                id: c.id,
                number: c.number,
                title: c.title,
                tagline: c.badge,
                icon: c.icon,
              }))}
              activeIndex={activeCapIndex}
              onActiveChange={handleCapSelect}
              label="Capabilities '26"
              sublabel="Core Platform"
              className="h-full min-h-[380px] sm:min-h-[440px]"
            />
          </div>

          {/* Right: Live Capability Monitor (Target Card with Work Wheel scrolling applied) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
            <div
              ref={cardRef}
              {...scrollProps}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between h-full outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-grab active:cursor-grabbing"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="ml-1 text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 truncate">
                      Live Capability Monitor
                    </span>
                  </div>

                  {isLastItem ? (
                    <button
                      type="button"
                      onClick={scrollToNextSection}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 px-2.5 py-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer shrink-0"
                      title="All capabilities viewed. Scroll or click to continue to next section"
                    >
                      <span>Unlocked • Scroll down ↓</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded shrink-0 font-medium">
                      <MousePointer className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Anchored ({activeCapIndex + 1}/{capabilities.length}) • Scroll down</span>
                      <span className="sm:hidden">{activeCapIndex + 1}/{capabilities.length} • Scroll</span>
                    </span>
                  )}
                </div>

                {/* Animated Capability Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCap.id}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    {/* Title & Tagline */}
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{currentCap.badge}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                        {currentCap.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentCap.description}
                      </p>
                    </div>

                    {/* Operational Telemetry Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {currentCap.telemetry.label}
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-sky-400">
                          {currentCap.telemetry.value}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{currentCap.telemetry.status}</span>
                      </div>
                    </div>

                    {/* Feature Points Checklist */}
                    <div className="pt-2 space-y-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Included In Store License
                      </div>
                      {currentCap.points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Card Controls & Footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={activeCapIndex === 0}
                  onClick={() => handleCapSelect(Math.max(0, activeCapIndex - 1))}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev Tool</span>
                </button>

                <div className="text-[11px] font-mono font-medium text-slate-400">
                  {activeCapIndex + 1} / {capabilities.length}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeCapIndex < capabilities.length - 1) {
                      handleCapSelect(activeCapIndex + 1);
                    } else {
                      scrollToNextSection();
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                >
                  <span>{activeCapIndex === capabilities.length - 1 ? 'Next Section' : 'Next Tool'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
