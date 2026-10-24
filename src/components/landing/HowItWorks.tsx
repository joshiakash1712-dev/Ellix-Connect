import React, { useState } from 'react';
import { Store, Receipt, TrendingUp, CheckCircle2, Sparkles, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';

import productsImg from '../../assets/images/workflow_products_sku_1792691890542.jpg';
import billingImg from '../../assets/images/workflow_pos_billing_1792691908115.jpg';
import recordsImg from '../../assets/images/workflow_tax_records_1792691922332.jpg';

interface Step {
  step: string;
  title: string;
  time: string;
  description: string;
  icon: React.ElementType;
  image: string;
  preview: {
    heading: string;
    items: string[];
  };
  impact: string;
}

const steps: Step[] = [
  {
    step: '01',
    title: 'Add your products',
    time: '< 5 Minutes',
    description: 'Import your catalog via spreadsheet or scan items on your counter. Set selling prices and GST slabs once.',
    icon: Store,
    image: productsImg,
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
    step: '02',
    title: 'Bill in sub-seconds',
    time: 'Daily Counter',
    description: 'Cashiers scan items with any USB/Bluetooth scanner. Print thermal receipts or send digital bills via WhatsApp.',
    icon: Receipt,
    image: billingImg,
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
    step: '03',
    title: 'Stay in sync automatically',
    time: 'Always Live',
    description: 'Every sale automatically decrements stock, updates customer Khata balances, and prepares your daily Z-report.',
    icon: TrendingUp,
    image: recordsImg,
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

const wheelItems: WorksWheelItem[] = steps.map((s) => ({
  title: s.title,
  tagline: s.time,
  image: s.image,
  href: `#step-${s.step}`,
}));

export const HowItWorks: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentStep = steps[activeStepIndex] || steps[0];
  const Icon = currentStep.icon;

  const handleStepSelect = React.useCallback((idx: number) => {
    setActiveStepIndex(idx);
  }, []);

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            Up and running in minutes.
          </h2>
        </div>

        {/* Side-by-Side: 3D WorksWheel on Left, Live Implementation Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: 3D WorksWheel Component */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
              
              {/* The 3D Wheel Stage */}
              <div className="relative flex-1 w-full overflow-hidden">
                <WorksWheel
                  items={wheelItems}
                  label="Steps '26"
                  action="Inspect"
                  activeIndex={activeStepIndex}
                  onActiveChange={handleStepSelect}
                  onItemClick={handleStepSelect}
                  className="h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-transparent"
                />
              </div>

              {/* Bottom Quick Jump Dots */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 text-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Active: <strong className="text-slate-900 dark:text-white">{currentStep.title}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleStepSelect(idx)}
                      aria-label={`Jump to step ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeStepIndex
                          ? 'w-6 bg-blue-600'
                          : idx < activeStepIndex
                          ? 'w-2 bg-blue-300 dark:bg-blue-800'
                          : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Live Implementation Monitor */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between h-full">
              
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="ml-1 text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                      Live Implementation Monitor
                    </span>
                  </div>
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

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Zero IT Consultants Needed
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Plug-and-play Hardware
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
