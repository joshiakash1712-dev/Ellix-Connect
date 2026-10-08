import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Shirt,
  Wrench,
  Pill,
  Truck,
  Check,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  MousePointer2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

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

  const selectedVertical = verticals.find((v) => v.id === selectedVerticalId) || verticals[0];
  const SelectedIcon = selectedVertical.icon;

  // Spatial transform-origin mapped to the 3-top + 2-bottom vertical card layout
  const getOrigin = (index: number) => {
    switch (index) {
      case 0:
        return '16.6% 25%';
      case 1:
        return '50.0% 25%';
      case 2:
        return '83.3% 25%';
      case 3:
        return '25.0% 75%';
      case 4:
        return '75.0% 75%';
      default:
        return '50.0% 50%';
    }
  };

  const handleCardMouseEnter = (verticalId: string, index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedVerticalId(verticalId);
      setOriginIndex(index);
      setIsHovered(true);
    }, 50);
  };

  const handleSectionMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
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

  const handleCardKeyDown = (e: React.KeyboardEvent, verticalId: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedVerticalId(verticalId);
      setOriginIndex(index);
      setIsHovered(true);
    } else if (e.key === 'Escape' && isHovered) {
      e.preventDefault();
      setIsHovered(false);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % verticals.length;
      setSelectedVerticalId(verticals[nextIdx].id);
      setOriginIndex(nextIdx);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + verticals.length) % verticals.length;
      setSelectedVerticalId(verticals[prevIdx].id);
      setOriginIndex(prevIdx);
    }
  };

  return (
    <section
      id="who-its-for"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>Who It&apos;s For</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold normal-case tracking-normal">Retailers &amp; Merchants</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Built for local retailers, specialized merchants &amp; wholesalers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Different businesses have different operational rhythms.
            <span className="hidden lg:inline text-blue-600 dark:text-sky-400 font-semibold ml-1">
              Hover over any retail category card below to expand its live operational adaptation workspace.
            </span>
            <span className="lg:hidden ml-1">
              Tap any category below to discover the exact operational pain points solved and how Ellic adapts.
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP TWO-LAYER SPATIAL CARD-TO-WORKSPACE ARCHITECTURE     */}
        {/* ============================================================ */}
        <div
          className="hidden lg:grid lg:grid-cols-1 items-stretch relative box-border"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          {/* STATE 1: Desktop Entry-Point Cards (3 Top + 2 Bottom) */}
          <div
            className={`col-start-1 row-start-1 w-full h-full space-y-6 min-h-[540px] transition-all duration-200 ease-out will-change-transform ${
              isHovered
                ? 'opacity-20 scale-[0.99] pointer-events-auto'
                : 'opacity-100 scale-100'
            }`}
          >
            {/* Top Row: First 3 Verticals */}
            <div className="grid grid-cols-3 gap-6">
              {verticals.slice(0, 3).map((vert, index) => {
                const Icon = vert.icon;
                const isSelected = selectedVerticalId === vert.id;

                return (
                  <div
                    key={vert.id}
                    id={`vertical-${vert.id}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    data-cursor="card"
                    onMouseEnter={() => handleCardMouseEnter(vert.id, index)}
                    onClick={() => handleCardMouseEnter(vert.id, index)}
                    onKeyDown={(e) => handleCardKeyDown(e, vert.id, index)}
                    className={`website-card-hover p-6 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected && !isHovered
                        ? 'bg-white dark:bg-slate-900 border-sky-500/60 ring-2 ring-blue-500/30 shadow-md text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg text-slate-900 dark:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          data-icon-box
                          className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-blue-600 dark:text-sky-400 flex items-center justify-center transition-all duration-200"
                        >
                          <Icon className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <span
                          data-card-badge
                          className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-sky-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-200"
                        >
                          {vert.badge}
                        </span>
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
                        {vert.shortCategory}
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                        {vert.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {vert.description}
                      </p>
                    </div>

                    <div
                      data-card-support
                      className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 transition-transform duration-200"
                    >
                      {vert.howEllixAdapts.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: Remaining 2 Verticals */}
            <div className="grid grid-cols-2 gap-6">
              {verticals.slice(3, 5).map((vert, offset) => {
                const index = offset + 3;
                const Icon = vert.icon;
                const isSelected = selectedVerticalId === vert.id;

                return (
                  <div
                    key={vert.id}
                    id={`vertical-${vert.id}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    data-cursor="card"
                    onMouseEnter={() => handleCardMouseEnter(vert.id, index)}
                    onClick={() => handleCardMouseEnter(vert.id, index)}
                    onKeyDown={(e) => handleCardKeyDown(e, vert.id, index)}
                    className={`website-card-hover p-6 rounded-2xl text-left border transition-all duration-200 flex flex-row justify-between gap-6 cursor-pointer ${
                      isSelected && !isHovered
                        ? 'bg-white dark:bg-slate-900 border-sky-500/60 ring-2 ring-blue-500/30 shadow-md text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          data-icon-box
                          className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-blue-600 dark:text-sky-400 flex items-center justify-center transition-all duration-200"
                        >
                          <Icon className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <span
                          data-card-badge
                          className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-sky-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-200"
                        >
                          {vert.badge}
                        </span>
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
                        {vert.shortCategory}
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                        {vert.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {vert.description}
                      </p>
                    </div>

                    <div
                      data-card-support
                      className="w-64 pl-6 border-l border-slate-100 dark:border-slate-800/80 flex flex-col justify-center space-y-2 text-[11px] text-slate-500 dark:text-slate-400 transition-transform duration-200"
                    >
                      {vert.howEllixAdapts.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STATE 2: Spatial Morphing Industry Specialization Workspace */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="who-its-for-expanded-workspace"
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
                style={{ transformOrigin: getOrigin(originIndex) }}
                className="col-start-1 row-start-1 z-20 w-full h-full min-h-[540px] box-border overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 dark:border-sky-500/30 shadow-2xl ring-1 ring-blue-500/20 p-5 sm:p-7 flex flex-col justify-between gap-4"
              >
                {/* Top Workspace Header & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                        Industry Specialization Workspace
                      </span>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-sky-100 dark:bg-blue-950/80 text-blue-800 dark:text-sky-300 text-[11px] font-mono font-bold border border-sky-300/60 dark:border-sky-800/60">
                        {selectedVertical.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MousePointer2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Hover any vertical pill to switch specialization</span>
                    </div>
                  </div>

                  {/* 5-Vertical Switcher Dock */}
                  <div className="grid grid-cols-5 gap-1.5 mb-5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/80 shadow-inner">
                    {verticals.map((vert, idx) => {
                      const VertIcon = vert.icon;
                      const isActive = selectedVerticalId === vert.id;
                      return (
                        <button
                          key={vert.id}
                          type="button"
                          data-cursor="hover"
                          aria-pressed={isActive}
                          onMouseEnter={() => {
                            setSelectedVerticalId(vert.id);
                            setOriginIndex(idx);
                          }}
                          onClick={() => {
                            setSelectedVerticalId(vert.id);
                            setOriginIndex(idx);
                          }}
                          className={`relative py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 border border-sky-500/50 shadow-sm ring-1 ring-blue-500/20'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 border border-transparent'
                          }`}
                        >
                          <VertIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                          <span className="truncate">{vert.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Workspace Content with AnimatePresence Crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedVertical.id}
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                    >
                      {/* Left Column: Vertical Identity, Summary & Adaptation Focus (5 Cols) */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center font-bold shrink-0">
                              <SelectedIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider block">
                                {selectedVertical.shortCategory}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
                                {selectedVertical.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            {selectedVertical.description}
                          </p>

                          {/* Adaptation Summary Callout */}
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
                              Operational Focus
                            </div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                              {selectedVertical.adaptationSummary}
                            </p>
                          </div>
                        </div>

                        {/* Supporting Readiness Indicators */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            100% GST Ready
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Sub-0.2s POS
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-blue-950/60 text-[11px] font-mono font-semibold text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                            Live Stock Sync
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Pain Points vs How Ellix Connect Adapts (7 Cols) */}
                      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Common Operational Pain Points */}
                        <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/15 border border-rose-200/70 dark:border-rose-900/40 space-y-3">
                          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Common Operational Pain Points</span>
                          </div>
                          <div className="space-y-2.5">
                            {selectedVertical.painPoints.map((pain, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200/60 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 shadow-2xs"
                              >
                                <span className="text-rose-500 font-bold text-xs leading-none shrink-0 mt-0.5">✕</span>
                                <span className="leading-relaxed">{pain}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How Ellic Adapts */}
                        <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-blue-950/20 border border-sky-200/70 dark:border-blue-900/40 space-y-3">
                          <div className="flex items-center gap-2 text-blue-700 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <span>How Ellic Adapts</span>
                          </div>
                          <div className="space-y-2.5">
                            {selectedVertical.howEllixAdapts.map((solution, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200/60 dark:border-blue-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs"
                              >
                                <Check className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed font-medium">{solution}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Workspace Footer Navigation */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Vertical {verticals.findIndex((v) => v.id === selectedVertical.id) + 1} of {verticals.length} ·{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{selectedVertical.title}</strong>
                  </span>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => {
                      const currentIdx = verticals.findIndex((v) => v.id === selectedVertical.id);
                      const nextIdx = (currentIdx + 1) % verticals.length;
                      setSelectedVerticalId(verticals[nextIdx].id);
                      setOriginIndex(nextIdx);
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-sky-400 hover:text-sky-500 cursor-pointer"
                  >
                    <span>Next Vertical</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* MOBILE & TABLET EXPERIENCE (< lg screens): CLEAN & ACCESSIBLE */}
        {/* ============================================================ */}
        <div className="block lg:hidden space-y-4">
          <div className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
            {verticals.map((vert, idx) => {
              const Icon = vert.icon;
              const isSelected = selectedVerticalId === vert.id;

              return (
                <button
                  key={vert.id}
                  id={`mobile-vertical-${vert.id}`}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedVerticalId(vert.id);
                    setOriginIndex(idx);
                  }}
                  className={`snap-start shrink-0 w-[250px] sm:w-auto p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-blue-700 dark:text-sky-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {vert.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-0.5">
                      {vert.shortCategory}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white mb-1">
                      {vert.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2 line-clamp-2">
                      {vert.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-700 dark:text-sky-400 flex items-center justify-between">
                    <span>{isSelected ? 'Viewing solutions below ↓' : 'Tap to view solutions'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Detail Panel */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-400 flex items-center justify-center font-bold">
                  <SelectedIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider block">
                    {selectedVertical.shortCategory}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                    {selectedVertical.title}
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {selectedVertical.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedVertical.adaptationSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Common Operational Pain Points</span>
                </div>
                {selectedVertical.painPoints.map((pain, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="text-rose-500 font-bold text-xs leading-none shrink-0 mt-0.5">✕</span>
                    <span className="leading-relaxed">{pain}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-700 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>How Ellic Adapts</span>
                </div>
                {selectedVertical.howEllixAdapts.map((solution, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-sky-50/60 dark:bg-blue-950/30 border border-sky-200/70 dark:border-blue-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <Check className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
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

