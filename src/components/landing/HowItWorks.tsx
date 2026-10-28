import React, { useState } from 'react';
import {
  Store,
  Receipt,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  ArrowLeft,
  MousePointer,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorkWheelStage } from './WorkWheelStage';
import { useCardWheelScroll } from '../../hooks/useCardWheelScroll';

interface Step {
  id: string;
  step: string;
  title: string;
  time: string;
  description: string;
  icon: React.ElementType;
  preview: {
    heading: string;
    items: string[];
  };
  impact: string;
}

const steps: Step[] = [
  {
    id: 'products',
    step: '01',
    title: 'Add your products',
    time: '< 5 Minutes',
    description: 'Import your catalog via spreadsheet or scan items on your counter. Set selling prices and GST slabs once.',
    icon: Store,
    preview: {
      heading: 'Catalog Ready',
      items: [
        'Scan EAN/UPC barcodes directly at the counter',
        'Auto-calculate margin (+26%) and retail markup',
        'Assign 5/12/18% statutory GST tax slabs',
      ],
    },
    impact: 'Ready for instant optical laser barcode checkout',
  },
  {
    id: 'billing',
    step: '02',
    title: 'Bill in sub-seconds',
    time: 'Daily Counter',
    description: 'Cashiers scan items with any USB/Bluetooth scanner. Print thermal receipts or send digital bills via WhatsApp.',
    icon: Receipt,
    preview: {
      heading: 'Sub-0.2s POS',
      items: [
        'Plug-and-play USB & Bluetooth barcode scanner input',
        'Dynamic exact-amount UPI QR code checkout',
        'Split tender across cash, cards, & credit Khata',
      ],
    },
    impact: 'Cuts checkout queue times by over 70%',
  },
  {
    id: 'records',
    step: '03',
    title: 'Stay in sync automatically',
    time: 'Always Live',
    description: 'Every sale automatically decrements stock, updates customer Khata balances, and prepares your daily Z-report.',
    icon: TrendingUp,
    preview: {
      heading: 'Auto-Reconciliation',
      items: [
        'Live inventory count deducted across registers',
        'Zero-paper customer credit balances logged instantly',
        '60-second end-of-shift cash drawer balancing',
      ],
    },
    impact: 'Zero night-time bookkeeping or spreadsheet tallies',
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentStep = steps[activeStepIndex] || steps[0];

  const handleStepSelect = React.useCallback((idx: number) => {
    setActiveStepIndex(idx);
  }, []);

  // Work wheel scrolling with screen centering and page-lock until last card
  const {
    sectionRef,
    cardRef,
    scrollProps,
    isLastItem,
    scrollToNextSection,
  } = useCardWheelScroll({
    totalItems: steps.length,
    activeIndex: activeStepIndex,
    onActiveChange: setActiveStepIndex,
    sectionId: 'how-it-works',
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-12 sm:py-16 md:py-20 scroll-mt-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            Up and running in minutes.
          </h2>
        </div>

        {/* Side-by-Side: Interactive Work Wheel on Left, Live Scrolling Implementation Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: Vector Work Wheel Dial Component (Hidden on mobile for clean preview, visible on desktop) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 flex-col">
            <WorkWheelStage
              items={steps.map((s) => ({
                id: s.id,
                number: s.step,
                title: s.title,
                tagline: s.time,
                icon: s.icon,
              }))}
              activeIndex={activeStepIndex}
              onActiveChange={handleStepSelect}
              label="Steps '26"
              sublabel="Fast Setup"
              className="h-full min-h-[380px] sm:min-h-[440px]"
            />
          </div>

          {/* Right: Live Implementation Monitor (Target Card with Work Wheel scrolling applied) */}
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
                      Live Implementation Monitor
                    </span>
                  </div>

                  {isLastItem ? (
                    <button
                      type="button"
                      onClick={scrollToNextSection}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 px-2.5 py-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer shrink-0"
                      title="All steps viewed. Scroll or click to continue to next section"
                    >
                      <span>Unlocked • Scroll down ↓</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded shrink-0 font-medium">
                      <MousePointer className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Anchored ({activeStepIndex + 1}/{steps.length}) • Scroll down</span>
                      <span className="sm:hidden">{activeStepIndex + 1}/{steps.length} • Scroll</span>
                    </span>
                  )}
                </div>

                {/* Animated Step Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.step}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    {/* Title & Setup Badge */}
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Setup Time: {currentStep.time}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                        {currentStep.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentStep.description}
                      </p>
                    </div>

                    {/* Operational Impact Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Operational Impact
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                        <span>{currentStep.impact}</span>
                      </div>
                    </div>

                    {/* Execution Checklist */}
                    <div className="pt-2 space-y-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        {currentStep.preview.heading}
                      </div>
                      {currentStep.preview.items.map((it, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{it}</span>
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
                  disabled={activeStepIndex === 0}
                  onClick={() => handleStepSelect(Math.max(0, activeStepIndex - 1))}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev Step</span>
                </button>

                <div className="text-[11px] font-mono font-medium text-slate-400">
                  {activeStepIndex + 1} / {steps.length}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeStepIndex < steps.length - 1) {
                      handleStepSelect(activeStepIndex + 1);
                    } else {
                      scrollToNextSection();
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                >
                  <span>{activeStepIndex === steps.length - 1 ? 'Next Section' : 'Next Step'}</span>
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
