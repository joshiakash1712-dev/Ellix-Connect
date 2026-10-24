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

export const WhoItsFor: React.FC = () => {
  const [activeVerticalIndex, setActiveVerticalIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentVertical = verticals[activeVerticalIndex] || verticals[0];
  const Icon = currentVertical.icon;

  const handleVerticalSelect = React.useCallback((idx: number) => {
    setActiveVerticalIndex(idx);
  }, []);

  return (
    <section
      id="who-its-for"
      className="py-12 sm:py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>Interactive Industry Wheel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            Built for local retailers and small businesses.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Turn the 3D wheel or select your trade vertical to see industry-tailored workflows and out-of-the-box presets.
          </p>
        </div>

        {/* 5 Industry Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2.5 mb-8">
          {verticals.map((vert, idx) => {
            const VertIcon = vert.icon;
            const isActive = idx === activeVerticalIndex;
            const isPast = idx < activeVerticalIndex;
            return (
              <button
                key={vert.id}
                type="button"
                onClick={() => handleVerticalSelect(idx)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : isPast
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive ? 'text-blue-100' : isPast ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  >
                    {vert.number}
                  </span>
                  <VertIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-white' : isPast ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold truncate">{vert.name}</div>
                <div
                  className={`hidden sm:block text-[10px] truncate mt-0.5 ${
                    isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {vert.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side: 3D WorksWheel on Left, Live Industry Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: 3D WorksWheel Component */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
              
              {/* The 3D Wheel Stage */}
              <div className="relative flex-1 w-full overflow-hidden">
                <WorksWheel
                  items={wheelItems}
                  label="Retail '26"
                  action="Inspect"
                  activeIndex={activeVerticalIndex}
                  onActiveChange={handleVerticalSelect}
                  onItemClick={handleVerticalSelect}
                  className="h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-transparent"
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
                      <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                        {currentVertical.name}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
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
