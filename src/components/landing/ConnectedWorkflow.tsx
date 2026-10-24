import React, { useState } from 'react';
import {
  Tag,
  Users,
  Receipt,
  CreditCard,
  Boxes,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';

import productsImg from '../../assets/images/workflow_products_sku_1792691890542.jpg';
import customersImg from '../../assets/images/workflow_customer_khata_1792691907419.jpg';
import billingImg from '../../assets/images/workflow_pos_billing_1792691908115.jpg';
import paymentsImg from '../../assets/images/workflow_upi_payments_1792691908068.jpg';
import inventoryImg from '../../assets/images/workflow_inventory_stock_1792691922135.jpg';
import recordsImg from '../../assets/images/workflow_tax_records_1792691922332.jpg';

interface WorkflowStage {
  id: string;
  number: string;
  name: string;
  icon: React.ElementType;
  tagline: string;
  summary: string;
  rippleEffect: string;
  image: string;
  mockupSnippet: {
    title: string;
    badge: string;
    lines: Array<{ label: string; value: string }>;
  };
}

const stages: WorkflowStage[] = [
  {
    id: 'products',
    number: '01',
    name: 'Products',
    icon: Tag,
    tagline: 'Catalog & Barcodes',
    summary: 'Add SKUs once with barcode, purchase price, selling price, and GST tax slab.',
    rippleEffect: 'Immediately ready for counter barcode scanners and stock tracking.',
    image: productsImg,
    mockupSnippet: {
      title: 'Catalog Record',
      badge: 'Active SKU',
      lines: [
        { label: 'Item', value: 'Basmati Rice Superior 5kg' },
        { label: 'Barcode', value: '8901234567890 (EAN-13)' },
        { label: 'Retail Price', value: '₹480.00 (Margin: +26%)' },
      ],
    },
  },
  {
    id: 'customers',
    number: '02',
    name: 'Customers',
    icon: Users,
    tagline: 'Profiles & Khata',
    summary: 'Identify repeat buyers by phone number and manage customer credit limits.',
    rippleEffect: 'Links purchase history and credit balance to the customer’s profile.',
    image: customersImg,
    mockupSnippet: {
      title: 'Customer Profile',
      badge: 'VIP Member',
      lines: [
        { label: 'Name', value: 'Rahul Deshmukh (+91 98765 43210)' },
        { label: 'Khata Balance', value: '₹420.00 Outstanding' },
        { label: 'Credit Limit', value: '₹5,000 Safe Cap' },
      ],
    },
  },
  {
    id: 'billing',
    number: '03',
    name: 'Billing',
    icon: Receipt,
    tagline: 'Counter Scan-to-Bill',
    summary: 'Scan items in sub-seconds with optical laser or keyboard search.',
    rippleEffect: 'Generates instant GST-compliant thermal receipts or WhatsApp bills.',
    image: billingImg,
    mockupSnippet: {
      title: 'POS Active Invoice',
      badge: 'INV-2026-0842',
      lines: [
        { label: 'Cart Items', value: '3 Line Items Scanned' },
        { label: 'Total', value: '₹880.00 (CGST + SGST included)' },
        { label: 'Speed', value: '< 0.2s per barcode scan' },
      ],
    },
  },
  {
    id: 'payments',
    number: '04',
    name: 'Payments',
    icon: CreditCard,
    tagline: 'Cash, UPI QR, Cards & Split',
    summary: 'Accept any tender: dynamic scan-and-pay UPI QR, cards, cash, or credit Khata.',
    rippleEffect: 'Settles payment instantly and flags any remaining credit balance.',
    image: paymentsImg,
    mockupSnippet: {
      title: 'Payment Settlement',
      badge: 'Split Tender Ready',
      lines: [
        { label: 'Paid via UPI QR', value: '₹500.00 (Instant)' },
        { label: 'Added to Khata', value: '₹380.00 (Due Recorded)' },
        { label: 'Status', value: 'Verified & Closed' },
      ],
    },
  },
  {
    id: 'inventory',
    number: '05',
    name: 'Inventory',
    icon: Boxes,
    tagline: 'Live Stock Deduction',
    summary: 'Stock automatically deducts across registers the instant a bill is completed.',
    rippleEffect: 'Warns you before shelves run empty and drafts wholesale reorders.',
    image: inventoryImg,
    mockupSnippet: {
      title: 'Live Stock Engine',
      badge: 'Real-Time Sync',
      lines: [
        { label: 'Rice 5kg Pool', value: '42 → 41 units remaining' },
        { label: 'Threshold Alert', value: 'Healthy (> 10 units min)' },
        { label: 'Batch Expiry', value: 'Dec 2027 (FIFO Tracked)' },
      ],
    },
  },
  {
    id: 'records',
    number: '06',
    name: 'Records',
    icon: FileText,
    tagline: 'Reports, GST & Audit Logs',
    summary: 'Sales, drawer cash, and GST tax schedules update without manual tallying.',
    rippleEffect: 'No late-night spreadsheets. End-of-day Z-reports are ready in 60 seconds.',
    image: recordsImg,
    mockupSnippet: {
      title: 'Daily Business Summary',
      badge: 'Automated Record',
      lines: [
        { label: 'Gross Sales Today', value: '₹48,920 (84 Invoices)' },
        { label: 'Drawer Cash Tally', value: 'Exact match (0 variance)' },
        { label: 'GST Export', value: 'GSTR-1 Ready (1-Click CSV)' },
      ],
    },
  },
];

const wheelItems: WorksWheelItem[] = stages.map((stage) => ({
  title: stage.name,
  tagline: stage.tagline,
  image: stage.image,
  href: `#stage-${stage.id}`,
}));

export const ConnectedWorkflow: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentStage = stages[activeStageIndex];

  const handleStageSelect = React.useCallback((idx: number) => {
    setActiveStageIndex(idx);
  }, []);

  const handleActiveChange = React.useCallback((idx: number) => {
    setActiveStageIndex(idx);
  }, []);

  return (
    <section
      id="workflow"
      className="relative bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors py-12 sm:py-16 md:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight break-words">
            How data flows through your store.
          </h2>
        </div>

        {/* Side-by-Side: 3D WorksWheel on Left, Live Workflow Monitor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: 3D WorksWheel Component */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
              
              {/* The 3D Wheel Stage */}
              <div className="relative flex-1 w-full overflow-hidden">
                <WorksWheel
                  items={wheelItems}
                  label="Workflow '26"
                  action="Inspect"
                  activeIndex={activeStageIndex}
                  onActiveChange={handleActiveChange}
                  onItemClick={handleStageSelect}
                  className="h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-transparent"
                />
              </div>

              {/* Bottom Quick Jump Dots for mobile touch convenience */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 text-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Active: <strong className="text-slate-900 dark:text-white">{currentStage.name}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {stages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleStageSelect(idx)}
                      aria-label={`Jump to stage ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeStageIndex
                          ? 'w-6 bg-blue-600'
                          : idx < activeStageIndex
                          ? 'w-2 bg-blue-300 dark:bg-blue-800'
                          : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Live Workflow Monitor (Anchored details for user reading) */}
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
                      Live Workflow Monitor
                    </span>
                  </div>
                </div>

                {/* Animated Stage Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage.id}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    {/* Stage Name & Tagline */}
                    <div>
                      <div className="text-[11px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                        {currentStage.tagline}
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5 flex items-center gap-2">
                        <span>{currentStage.name}</span>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentStage.summary}
                      </p>
                    </div>

                    {/* Stage Live Data Mockup */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 space-y-2.5 font-sans">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span className="truncate">{currentStage.mockupSnippet.title}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-sky-700/60 shrink-0 font-bold">
                          {currentStage.mockupSnippet.badge}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {currentStage.mockupSnippet.lines.map((l, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2"
                          >
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 font-medium">
                              {l.label}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-right break-words">
                              {l.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-0.5 font-medium">
                        Synchronized automatically with counter registers
                      </div>
                    </div>

                    {/* Automated Ripple Consequence Banner */}
                    <div className="p-3.5 rounded-xl bg-sky-50/80 dark:bg-blue-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-sky-300 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Next Automated Action:</span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {currentStage.rippleEffect}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev / Next Stage Controls */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={activeStageIndex === 0}
                  onClick={() => handleStageSelect(Math.max(0, activeStageIndex - 1))}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev Stage</span>
                </button>

                <div className="text-[11px] font-mono font-medium text-slate-400">
                  {activeStageIndex + 1} / {stages.length}
                </div>

                <button
                  type="button"
                  disabled={activeStageIndex === stages.length - 1}
                  onClick={() => handleStageSelect(Math.min(stages.length - 1, activeStageIndex + 1))}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Next Stage</span>
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


