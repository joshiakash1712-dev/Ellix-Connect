import React, { useState } from 'react';
import {
  ShoppingBag,
  Shirt,
  Wrench,
  Pill,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';
import { useScrollLock } from '@/hooks/useScrollLock';

import productsImg from '../../assets/images/workflow_products_sku_1792691890542.jpg';
import billingImg from '../../assets/images/workflow_pos_billing_1792691908115.jpg';
import inventoryImg from '../../assets/images/workflow_inventory_stock_1792691922135.jpg';
import customersImg from '../../assets/images/workflow_customer_khata_1792691907419.jpg';
import paymentsImg from '../../assets/images/workflow_upi_payments_1792691908068.jpg';

interface Vertical {
  id: string;
  number: string;
  name: string;
  icon: React.ElementType;
  tagline: string;
  summary: string;
  keyFeatures: string[];
  image: string;
  preset: string;
}

const verticals: Vertical[] = [
  {
    id: 'grocery',
    number: '01',
    name: 'Supermarkets & Grocery',
    icon: ShoppingBag,
    tagline: 'High Volume & Quick Queues',
    summary: 'Speed through evening counter rushes with sub-second optical scanning and automated batch expiry monitoring.',
    keyFeatures: [
      'Sub-0.2s barcode scanning for long counter queues',
      'First-in-first-out (FIFO) batch tracking with expiry alerts',
      'Dynamic UPI QR codes for instant contactless payments',
    ],
    image: productsImg,
    preset: 'Pre-loaded with 4,000+ FMCG grocery barcodes & tax slabs',
  },
  {
    id: 'fashion',
    number: '02',
    name: 'Retail & Fashion',
    icon: Shirt,
    tagline: 'Apparel, Footwear & Variants',
    summary: 'Manage complex size, fit, and color variants without clutter. Print custom thermal barcode hang-tags.',
    keyFeatures: [
      'Parent-child variant matrix (Sizes & Colors under 1 master SKU)',
      'Built-in thermal barcode price tag & hang-tag generator',
      'Seasonal promotional discounts & customer loyalty points',
    ],
    image: billingImg,
    preset: 'Pre-configured apparel size scales (S-XXL) & footwear sizing',
  },
  {
    id: 'hardware',
    number: '03',
    name: 'Hardware & Electricals',
    icon: Wrench,
    tagline: 'Tools, Multi-Unit & Contractor Khata',
    summary: 'Handle versatile measurement units and maintain flexible credit Khata accounts for local contractors.',
    keyFeatures: [
      'Multi-unit packaging (pieces, meters, kg, boxes)',
      'Digital contractor Khata with WhatsApp payment reminders',
      'Serial number & warranty tracking on appliances',
    ],
    image: inventoryImg,
    preset: 'Supports loose metric conversions & contractor credit caps',
  },
  {
    id: 'pharmacy',
    number: '04',
    name: 'Pharmacies & Wellness',
    icon: Pill,
    tagline: 'Batch Numbers & Regulation',
    summary: 'Track medication batches, expiry alerts, and maintain 100% compliant statutory GST records.',
    keyFeatures: [
      'Batch-wise stock tracking with automated 30-day expiry flags',
      'Accurate HSN codes and GST slab mapping',
      'Fast counter lookup by brand or generic molecule name',
    ],
    image: customersImg,
    preset: 'Strict FIFO batch validation & compliant drug register format',
  },
  {
    id: 'wholesale',
    number: '05',
    name: 'Wholesale & B2B Supply',
    icon: Truck,
    tagline: 'Trade Invoices & Tiered Pricing',
    summary: 'Run bulk trade with merchant pricing tiers, credit limit enforcement, and GST e-invoices.',
    keyFeatures: [
      'Distributor vs Retailer vs Walk-in price tiers',
      'Credit limit safeguards that block billing over credit caps',
      'Full B2B tax invoice and delivery challan printing',
    ],
    image: paymentsImg,
    preset: 'Tiered wholesale price levels & bulk packing carton counts',
  },
];

const wheelItems: WorksWheelItem[] = verticals.map((v) => ({
  title: v.name,
  tagline: v.tagline,
  image: v.image,
  href: `#vertical-${v.id}`,
}));

const TOTAL_STOPS = verticals.length;

export const WhoItsFor: React.FC = () => {
  const [activeVerticalIndex, setActiveVerticalIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isBoundaryEscaping, setIsBoundaryEscaping] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const currentVertical = verticals[activeVerticalIndex] || verticals[0];
  const Icon = currentVertical.icon;

  const sectionRef = React.useRef<HTMLElement>(null);
  const activeVerticalIndexRef = React.useRef(activeVerticalIndex);
  activeVerticalIndexRef.current = activeVerticalIndex;

  // Toggle overflow: hidden on the body element only when the Work Wheel is active/in-view
  useScrollLock(isInView && isInteracting && !isBoundaryEscaping);

  // Observe when the Work Wheel component is actively in view
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wheelAccumulatorRef = React.useRef(0);
  const wheelResetTimeoutRef = React.useRef<number | null>(null);
  const lastWheelTimeRef = React.useRef(0);
  const lastWheelDirRef = React.useRef(0);

  // Handle clicking on industry buttons or indicators
  const handleVerticalSelect = React.useCallback((idx: number) => {
    const clampedIdx = Math.max(0, Math.min(TOTAL_STOPS - 1, idx));
    activeVerticalIndexRef.current = clampedIdx;
    setActiveVerticalIndex(clampedIdx);
  }, []);

  // Section-level wheel listener for in-place 1-step navigation without scrolling the site away
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      // Ignore horizontal trackpad swipes
      if (Math.abs(event.deltaY) < 2 && Math.abs(event.deltaX) > 10) return;

      const dy = event.deltaY;
      if (Math.abs(dy) < 3) return;

      const rect = el.getBoundingClientRect();
      // Only capture when section is in active view on screen
      const isInActiveView =
        rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      if (!isInActiveView) {
        return; // Allow natural page scrolling when not viewing section
      }

      const direction = dy > 0 ? 1 : -1; // 1 = down/forward, -1 = up/reverse
      const currentIdx = activeVerticalIndexRef.current;

      // Natural boundary escape:
      // At index 0, scrolling up allows the site to scroll up to previous section (How It Works)
      if (direction < 0 && currentIdx <= 0) {
        setIsBoundaryEscaping(true);
        return;
      }
      // At index 4 (last stop), scrolling down allows the site to scroll down to next section (Product Preview)
      if (direction > 0 && currentIdx >= TOTAL_STOPS - 1) {
        setIsBoundaryEscaping(true);
        return;
      }

      setIsBoundaryEscaping(false);

      // Between 0 and 4: preventDefault prevents the page from scrolling down or up!
      event.preventDefault();

      const now = performance.now();
      const timeSinceLast = now - lastWheelTimeRef.current;
      lastWheelTimeRef.current = now;

      const isDiscreteTick = event.deltaMode !== 0 || Math.abs(dy) >= 28;

      if (isDiscreteTick) {
        // Enforce 1 mouse wheel notch = 1 step
        if (timeSinceLast > 120 || Math.sign(dy) !== Math.sign(lastWheelDirRef.current)) {
          lastWheelDirRef.current = dy;
          const nextIdx = Math.max(0, Math.min(TOTAL_STOPS - 1, currentIdx + direction));
          if (nextIdx !== currentIdx) {
            activeVerticalIndexRef.current = nextIdx;
            setActiveVerticalIndex(nextIdx);
          }
        }
      } else {
        // Continuous trackpad swipe: accumulate smooth deltas
        wheelAccumulatorRef.current += dy;
        const THRESHOLD = 36;
        if (Math.abs(wheelAccumulatorRef.current) >= THRESHOLD) {
          const step = Math.sign(wheelAccumulatorRef.current);
          const nextIdx = Math.max(0, Math.min(TOTAL_STOPS - 1, currentIdx + step));
          if (nextIdx !== currentIdx) {
            activeVerticalIndexRef.current = nextIdx;
            setActiveVerticalIndex(nextIdx);
          }
          wheelAccumulatorRef.current = 0;
        }

        if (wheelResetTimeoutRef.current) window.clearTimeout(wheelResetTimeoutRef.current);
        wheelResetTimeoutRef.current = window.setTimeout(() => {
          wheelAccumulatorRef.current = 0;
        }, 150);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelResetTimeoutRef.current) window.clearTimeout(wheelResetTimeoutRef.current);
    };
  }, []);

  return (
    <section
      id="who-its-for"
      ref={sectionRef}
      onPointerEnter={() => {
        setIsInteracting(true);
        setIsBoundaryEscaping(false);
      }}
      onPointerLeave={() => {
        setIsInteracting(false);
        setIsBoundaryEscaping(false);
      }}
      className="py-12 sm:py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 lg:mb-5">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
              Built for local retailers and small businesses.
            </h2>
          </div>

          {/* Side-by-Side: 3D WorksWheel on Left, Live Industry Monitor on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* Left: 3D WorksWheel Component */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] lg:h-[460px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
                
                {/* The 3D Wheel Stage */}
                <div className="relative flex-1 w-full overflow-hidden">
                  <WorksWheel
                    items={wheelItems}
                    label="Retail '26"
                    action="Inspect"
                    activeIndex={activeVerticalIndex}
                    onActiveChange={handleVerticalSelect}
                    onItemClick={handleVerticalSelect}
                    disableWheelListener={true}
                    className="h-full min-h-[340px] sm:min-h-[400px] lg:h-full bg-transparent"
                  />
                </div>

                {/* Bottom Quick Jump Dots */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 text-xs">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Active: <strong className="text-slate-900 dark:text-white">{currentVertical.name}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {verticals.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleVerticalSelect(idx)}
                        aria-label={`Jump to vertical ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeVerticalIndex
                            ? 'w-6 bg-blue-600'
                            : idx < activeVerticalIndex
                            ? 'w-2 bg-blue-300 dark:bg-blue-800'
                            : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Live Industry Profile Monitor */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="p-5 sm:p-6 lg:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between h-full lg:h-[460px] overflow-hidden">
                
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
                        Live Industry Profile
                      </span>
                    </div>
                  </div>

                  {/* Animated Vertical Details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVertical.id}
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
                          <span>{currentVertical.tagline}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                          {currentVertical.name}
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {currentVertical.summary}
                        </p>
                      </div>

                      {/* Pre-Configured Preset Card */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                          <span>Pre-Configured Out of the Box</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {currentVertical.preset}
                        </div>
                      </div>

                      {/* Key Features Checklist */}
                      <div className="pt-2 space-y-2.5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          Specialized Workflows
                        </div>
                        {currentVertical.keyFeatures.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Instant Template Loading
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Zero Custom Coding
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
    </section>
  );
};
