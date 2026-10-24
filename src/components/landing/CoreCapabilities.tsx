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
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';

import productsImg from '../../assets/images/workflow_products_sku_1792691890542.jpg';
import customersImg from '../../assets/images/workflow_customer_khata_1792691907419.jpg';
import billingImg from '../../assets/images/workflow_pos_billing_1792691908115.jpg';
import paymentsImg from '../../assets/images/workflow_upi_payments_1792691908068.jpg';
import inventoryImg from '../../assets/images/workflow_inventory_stock_1792691922135.jpg';
import recordsImg from '../../assets/images/workflow_tax_records_1792691922332.jpg';

interface CapabilityCard {
  id: string;
  number: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  points: string[];
  image: string;
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
    image: billingImg,
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
    image: inventoryImg,
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
    image: customersImg,
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
    image: paymentsImg,
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
    image: productsImg,
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
    image: recordsImg,
    telemetry: {
      label: 'Compliance Engine',
      value: 'GSTR-1 Ready (1-Click CSV)',
      status: 'Automated tax reconciliation',
    },
  },
];

const wheelItems: WorksWheelItem[] = capabilities.map((cap) => ({
  title: cap.title,
  tagline: cap.badge,
  image: cap.image,
  href: `#feature-${cap.id}`,
}));

export const CoreCapabilities: React.FC = () => {
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentCap = capabilities[activeCapIndex] || capabilities[0];
  const Icon = currentCap.icon;

  const handleCapSelect = React.useCallback((idx: number) => {
    setActiveCapIndex(idx);
  }, []);

  return (
    <section
      id="features"
      className="py-12 sm:py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>Interactive Capabilities Wheel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            Six tools unified into one calm platform.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Turn the 3D wheel or click any module to inspect all six capabilities that drive your store every day.
          </p>
        </div>

        {/* 6 Capabilities Step Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2.5 mb-8">
          {capabilities.map((cap, idx) => {
            const CapIcon = cap.icon;
            const isActive = idx === activeCapIndex;
            const isPast = idx < activeCapIndex;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => handleCapSelect(idx)}
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
                    {cap.number}
                  </span>
                  <CapIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-white' : isPast ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold truncate">{cap.title}</div>
                <div
                  className={`hidden sm:block text-[10px] truncate mt-0.5 ${
                    isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cap.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side: 3D WorksWheel on Left, Live Capability Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: 3D WorksWheel Component */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
              
              {/* The 3D Wheel Stage */}
              <div className="relative flex-1 w-full overflow-hidden">
                <WorksWheel
                  items={wheelItems}
                  label="Capabilities '26"
                  action="Inspect"
                  activeIndex={activeCapIndex}
                  onActiveChange={handleCapSelect}
                  onItemClick={handleCapSelect}
                  className="h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-transparent"
                />
              </div>

              {/* Bottom Quick Jump Dots */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 text-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Active: <strong className="text-slate-900 dark:text-white">{currentCap.title}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {capabilities.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCapSelect(idx)}
                      aria-label={`Jump to capability ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeCapIndex
                          ? 'w-6 bg-blue-600'
                          : idx < activeCapIndex
                          ? 'w-2 bg-blue-300 dark:bg-blue-800'
                          : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Live Capability Monitor */}
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
                      Live Capability Monitor
                    </span>
                  </div>
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

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Hyperlocal Ready
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  0% Monthly Hardware Fees
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
