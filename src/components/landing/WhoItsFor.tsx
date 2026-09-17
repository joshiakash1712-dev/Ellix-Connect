import React, { useState } from 'react';
import {
  ShoppingBag,
  Shirt,
  Wrench,
  Pill,
  Truck,
  Check,
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BusinessVertical {
  id: string;
  title: string;
  shortCategory: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  painPoints: string[];
  howEllixAdapts: string[];
  adaptationSummary: string;
}

const verticals: BusinessVertical[] = [
  {
    id: 'supermarkets-grocery',
    title: 'Supermarkets & Grocery',
    shortCategory: 'High Volume & Perishables',
    badge: 'High Frequency',
    description: 'Lightning-fast checkout queues, batch expiry monitoring, loose weight pricing, and automated restock alerts for essential food supplies.',
    icon: ShoppingBag,
    painPoints: [
      'Peak hour billing queues causing customer drop-offs',
      'Stock expiring unnoticed on shelves eating into margins',
      'Complex loose grains, fruits, and vegetable weigh-scale pricing'
    ],
    howEllixAdapts: [
      'Sub-0.2s barcode reading with quick-touch top grocery shortcuts',
      'First-in-first-out (FIFO) batch tracking with 30-day expiry notifications',
      'Integrated digital weigh scale support for loose produce items'
    ],
    adaptationSummary: 'Optimized for high transaction volume, zero billing bottlenecks, and precise perishable inventory controls.'
  },
  {
    id: 'retail-fashion',
    title: 'Retail & Fashion',
    shortCategory: 'Apparel, Footwear & Accessories',
    badge: 'Variant Heavy',
    description: 'Manage complex size, fit, and color matrices seamlessly. Print custom barcode stickers, launch seasonal sales, and reward VIP shoppers.',
    icon: Shirt,
    painPoints: [
      'Managing hundreds of size/color combinations for identical garments',
      'Seasonal discount confusion and incorrect counter pricing',
      'Loss of repeat customers without a structured VIP loyalty program'
    ],
    howEllixAdapts: [
      'Parent-child matrix cataloging (Size: S/M/L/XL × Colors) under one master SKU',
      'In-app thermal barcode price tag and garment hang-tag label generator',
      'Digital VIP tiering that awards cashable points on every purchase'
    ],
    adaptationSummary: 'Streamlines complex SKU variants, custom hang-tag printing, and seasonal promotions.'
  },
  {
    id: 'hardware-electronics',
    title: 'Hardware & Electronics',
    shortCategory: 'Tools, Electricals & Gadgets',
    badge: 'Serial & Multi-Unit',
    description: 'Handle versatile measurement units (pieces, meters, kilograms, boxes) and maintain flexible credit Khata accounts for local contractors.',
    icon: Wrench,
    painPoints: [
      'Selling wire/cables by meter, nails by kg, and pipes by bundle from one stock pool',
      'Uncollected customer credit ledgers (Khata) tracked on messy paper diaries',
      'Tracking serial numbers and warranty validity on electrical appliances'
    ],
    howEllixAdapts: [
      'Multi-unit fractional packaging conversions with live stock deduction',
      'Automated digital Khata with customer payment reminders via WhatsApp',
      'Unique serial number / IMEI capture printed directly on GST warranty receipts'
    ],
    adaptationSummary: 'Master fractional unit conversions, serial warranty tracking, and contractor credit lines.'
  },
  {
    id: 'pharmacies-wellness',
    title: 'Pharmacies & Wellness',
    shortCategory: 'Chemists, Health & Cosmetics',
    badge: 'Batch & Regulation',
    description: 'Track medication batches, expiry alerts, doctor prescription notes, and ensure 100% compliant GST schedules for pharmaceuticals.',
    icon: Pill,
    painPoints: [
      'Strict regulatory requirements for medicine batch numbers and expiry',
      'Difficulty maintaining fast checkout while recording doctor prescription details',
      'Capital locked in dead medicine stock that approaches expiry'
    ],
    howEllixAdapts: [
      'Mandatory batch selection with automated near-expiry lockout alerts',
      'Prescription attachment and registered practitioner detail logging',
      'One-click return-to-vendor (RTV) claims for expired medicine batches'
    ],
    adaptationSummary: 'Ensures stringent batch and expiry compliance with rapid prescription counter checkout.'
  },
  {
    id: 'wholesale-distribution',
    title: 'Wholesale & Distribution',
    shortCategory: 'B2B Trade & Bulk Supply',
    badge: 'B2B Operations',
    description: 'Scale your wholesale supply chain with bulk B2B tax invoices, custom price lists per merchant tier, credit terms, and purchase orders.',
    icon: Truck,
    painPoints: [
      'Different customer price tiers (distributor vs retailer vs walk-in)',
      'Large credit balances requiring strict credit limit enforcement',
      'Slow generation of bulky B2B tax invoices with multiple tax rates'
    ],
    howEllixAdapts: [
      'Custom customer price tiers that auto-apply wholesale rates at checkout',
      'Credit limit safeguards that block billing when credit caps are breached',
      'Comprehensive B2B GST e-way bill ready invoices and delivery challans'
    ],
    adaptationSummary: 'Engineered for merchant pricing tiers, bulk deliveries, credit caps, and B2B invoices.'
  }
];

export const WhoItsFor: React.FC = () => {
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>('supermarkets-grocery');

  const selectedVertical = verticals.find((v) => v.id === selectedVerticalId) || verticals[0];
  const SelectedIcon = selectedVertical.icon;

  return (
    <section id="who-its-for" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Who It's For
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Built for local retailers, specialized merchants & wholesalers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Different businesses have different operational rhythms. Click any category below to discover the exact operational pain points solved and how Ellix Connect adapts.
          </p>
        </div>

        {/* 5 Vertical Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {verticals.map((vert) => {
            const Icon = vert.icon;
            const isSelected = selectedVerticalId === vert.id;

            return (
              <button
                key={vert.id}
                id={`vertical-${vert.id}`}
                type="button"
                onClick={() => setSelectedVerticalId(vert.id)}
                className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {vert.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-1">
                    {vert.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                    {vert.shortCategory}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>{isSelected ? 'Selected' : 'View solutions'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Detail Box for Selected Vertical */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <SelectedIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Industry Specialization
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                  {selectedVertical.title}
                </h3>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block max-w-xs text-right">
              {selectedVertical.adaptationSummary}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Pain Points Solved */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Operational Pain Points</span>
              </div>
              <div className="space-y-3">
                {selectedVertical.painPoints.map((pain, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="text-rose-500 font-bold text-sm leading-none shrink-0 mt-0.5">✕</span>
                    <span className="leading-relaxed">{pain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: How Ellix Connect Adapts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>How Ellix Connect Adapts</span>
              </div>
              <div className="space-y-3">
                {selectedVertical.howEllixAdapts.map((solution, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
