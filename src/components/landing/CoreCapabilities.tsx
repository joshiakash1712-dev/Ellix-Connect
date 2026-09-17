import React, { useState, useRef, useId } from 'react';
import {
  Receipt,
  Boxes,
  Tag,
  Users,
  CreditCard,
  History,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowRight,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface CapabilityItem {
  id: string;
  title: string;
  category: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  checklist: string[];
  inDepthOverview: string;
  previewData: {
    badgeText: string;
    headline: string;
    details: Array<{ label: string; value: string }>;
    snippet: React.ReactNode;
  };
}

const capabilities: CapabilityItem[] = [
  {
    id: 'billing',
    title: 'Billing & Invoices',
    shortLabel: 'Billing',
    category: 'Counter Operations',
    description: 'Create bills and invoices in just a few clicks with sub-second barcode scanning and instant thermal printing.',
    icon: Receipt,
    badge: 'Sub-second speed',
    checklist: [
      'Create and manage bills and invoices',
      'Apply discounts and taxes automatically',
      'Record payments instantly (Cash, UPI & Card)',
      'Track invoice status & print thermal receipts'
    ],
    inDepthOverview: 'Eliminate counter queues with keyboard shortcuts, continuous barcode scanning, and one-tap dynamic QR payments. Cashiers settle bills in under 10 seconds without lifting hands from the keyboard.',
    previewData: {
      badgeText: 'Active Register #01 · POS Live',
      headline: 'Express Barcode Checkout',
      details: [
        { label: 'Scan Latency', value: '< 0.25s' },
        { label: 'Receipt Output', value: 'Thermal 80mm & PDF' },
        { label: 'Tax Accuracy', value: '100% GSTR-1 Verified' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
            <span>INV-2026-0842</span>
            <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">GST COMPLIANT</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Basmati Rice 5kg x 1</span>
            <span>₹480.00</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Cold Pressed Mustard Oil 1L x 2</span>
            <span>₹360.00</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-1.5 border-t border-slate-800 text-[11px]">
            <span>CGST (2.5%) + SGST (2.5%)</span>
            <span>₹40.00</span>
          </div>
          <div className="flex justify-between font-bold text-white text-sm pt-1">
            <span>Total Amount Paid</span>
            <span className="text-emerald-400">₹880.00 (UPI Verified)</span>
          </div>
        </div>
      )
    }
  },
  {
    id: 'inventory',
    title: 'Inventory',
    shortLabel: 'Inventory',
    category: 'Stock Control',
    description: 'Track stock quantities across batches with automatic updates on every sale and automated low-stock warnings.',
    icon: Boxes,
    badge: 'Real-time sync',
    checklist: [
      'Track stock quantities in real time',
      'Monitor low-stock items & threshold alerts',
      'Automatic stock updates on every barcode scan',
      'Multi-batch tracking with expiry date warnings'
    ],
    inDepthOverview: 'Say goodbye to late-night stock counting. Every barcode scan instantly reduces batch quantities in your database. Automated reorder triggers notify you before fast-selling essentials run out.',
    previewData: {
      badgeText: 'Real-time Warehouse Sync',
      headline: 'Multi-Batch & Expiry Monitor',
      details: [
        { label: 'Sync Latency', value: 'Instant (40ms)' },
        { label: 'Alert Trigger', value: 'Min. Threshold < 15 units' },
        { label: 'Variance Rate', value: '0.0% Shrinkage' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">SKU-89241 · Tata Tea Gold 500g</span>
            <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800/60">In Stock: 84 units</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Batch No.</div>
              <div className="font-bold text-white">BCH-2026-C</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Expiry Date</div>
              <div className="font-bold text-amber-400">Nov 2027</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Reorder Level</div>
              <div className="font-bold text-emerald-400">15 Units</div>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'products',
    title: 'Products',
    shortLabel: 'Products',
    category: 'Catalog Management',
    description: 'Manage product information, prices, SKUs, categories, custom barcodes, and wholesale stock thresholds.',
    icon: Tag,
    badge: 'Flexible catalog',
    checklist: [
      'Manage complete product information',
      'Configure retail, bulk & wholesale prices',
      'Categorize with custom SKUs and barcodes',
      'Set stock thresholds & automatic reorder levels'
    ],
    inDepthOverview: 'Organize thousands of items effortlessly. Manage variants by size, color, pack size, or weight. Print custom sticky barcode labels for unbranded items or import your entire supplier catalog in one CSV click.',
    previewData: {
      badgeText: 'Unified SKU Database',
      headline: 'Variant & Barcode Generator',
      details: [
        { label: 'Supported SKUs', value: '100,000+ per store' },
        { label: 'Pricing Tiers', value: 'Retail, Bulk, B2B wholesale' },
        { label: 'Barcode Print', value: 'Standard 50x25mm labels' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">Cotton Oxford Shirt (Variants)</span>
            <span className="text-blue-400 text-[10px]">4 Sizes · 3 Colors</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between py-0.5">
              <span>Size M · Sky Blue (SKU-551-M-BLU)</span>
              <span className="text-white font-bold">₹1,299 (Stock: 24)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Size L · Sky Blue (SKU-551-L-BLU)</span>
              <span className="text-white font-bold">₹1,299 (Stock: 18)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Size XL · Sky Blue (SKU-551-XL-BLU)</span>
              <span className="text-amber-400 font-bold">₹1,299 (Low: 3)</span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'customers',
    title: 'Customers',
    shortLabel: 'Customers',
    category: 'Relationship & Khata',
    description: 'Keep customer information, purchase history, invoices, and outstanding Khata balances synchronized.',
    icon: Users,
    badge: 'Digital Khata',
    checklist: [
      'Maintain comprehensive customer profiles',
      'Track complete purchase history & invoices',
      'Manage outstanding Khata credit balances',
      'Automate WhatsApp balance reminders & loyalty'
    ],
    inDepthOverview: 'Replace frayed paper notebooks with an immutable digital Khata. Keep trusted neighborhood customers happy with store credit, view their complete purchase history, and automatically send polite WhatsApp reminders.',
    previewData: {
      badgeText: 'Digital Khata Ledger',
      headline: 'Credit Balances & Loyalty VIP',
      details: [
        { label: 'Ledger Audit', value: 'Tamper-proof history' },
        { label: 'Reminders', value: 'One-tap WhatsApp link' },
        { label: 'Loyalty Points', value: '1 point per ₹100 spend' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <div>
              <div className="font-bold text-white">Rajesh Verma (VIP Regular)</div>
              <div className="text-[10px] text-slate-400">+91 98201 44892</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-amber-400">Khata Due Balance</div>
              <div className="font-bold text-amber-300 text-sm">₹2,450.00</div>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-emerald-400 pt-1">
            <span>Available Reward Points: 340 pts</span>
            <span className="text-white underline cursor-pointer">One-Tap UPI Link</span>
          </div>
        </div>
      )
    }
  },
  {
    id: 'payments',
    title: 'Payments',
    shortLabel: 'Payments',
    category: 'Unified Checkout',
    description: 'Track paid and outstanding payments with dynamic UPI QR codes, cards, cash drawer tallying, and split tender.',
    icon: CreditCard,
    badge: 'Multi-tender',
    checklist: [
      'Track paid and outstanding payments live',
      'Support all payment methods (UPI, Card, Cash)',
      'Real-time payment verification & status checks',
      'Split tender payments & cash drawer reconciliation'
    ],
    inDepthOverview: 'Never miss a sale due to payment friction. Generate dynamic, exact-amount UPI QR codes that customers scan with Google Pay, PhonePe, or Paytm. Split payments between cash and digital instantly.',
    previewData: {
      badgeText: 'Multi-Tender Checkout',
      headline: 'Zero Payment Mismatch',
      details: [
        { label: 'UPI QR', value: 'Dynamic exact-amount QR' },
        { label: 'Split Tender', value: 'Cash + Card + UPI combo' },
        { label: 'Reconciliation', value: 'Instant cash drawer tally' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">Dynamic UPI QR Code</span>
            <span className="text-emerald-400 text-[10px]">Verified Settlement</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow">
              <QrCode className="w-14 h-14 text-slate-900" />
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="text-slate-300">Bill Total: <strong className="text-white">₹1,450.00</strong></div>
              <div className="text-emerald-400">Scan via GPay / PhonePe / Paytm</div>
              <div className="text-[10px] text-slate-400">Merchant VPA: ellix.store@icici</div>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'transactions',
    title: 'Transactions',
    shortLabel: 'Transactions',
    category: 'Audit & Records',
    description: 'View business transactions, filter records, manage cashier shifts, returns, and daily expense balances.',
    icon: History,
    badge: 'Tamper-proof',
    checklist: [
      'View comprehensive business transactions',
      'Filter transactions by date, cashier & tender',
      'Maintain immutable, searchable transaction records',
      'Log cashier shift handovers & return credits'
    ],
    inDepthOverview: 'Maintain complete transparency across all shifts. Track which cashier opened the till, total cash collected, refunds processed, and shift handovers with automated discrepancy alerts.',
    previewData: {
      badgeText: 'Audit Trail Ledger',
      headline: 'Cashier Shift & Returns Log',
      details: [
        { label: 'Shift Handover', value: '60-second drawer count' },
        { label: 'Credit Notes', value: 'Instant customer return credit' },
        { label: 'Discrepancy Check', value: 'Zero unlogged cash leaks' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between border-b border-slate-800 pb-1.5 font-bold text-white">
            <span>Shift Handover: Morning Register #02</span>
            <span className="text-emerald-400">Balanced ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Opening Cash: ₹2,000.00</div>
            <div>Cash Collected: ₹18,450.00</div>
            <div>UPI Settlements: ₹24,800.00</div>
            <div className="text-emerald-400 font-bold">Closing Till: ₹20,450.00</div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'reports',
    title: 'Reports',
    shortLabel: 'Reports',
    category: 'Financial Analytics',
    description: 'Generate sales reports, inventory reports, customer/payment information, and business performance sheets.',
    icon: BarChart3,
    badge: 'Audit-ready',
    checklist: [
      'Generate end-of-day sales & revenue reports',
      'Produce real-time inventory & stock valuation sheets',
      'Review consolidated customer & payment summaries',
      'Export audit-ready GSTR-1 & profit margin tables'
    ],
    inDepthOverview: 'Eliminate accounting stress. Download automated day-end closing sheets, GST tax liabilities, and product gross margin tables in clean Excel or PDF formats that your accountant will love.',
    previewData: {
      badgeText: 'Statutory Tax Statements',
      headline: 'End-of-Day P&L Statement',
      details: [
        { label: 'Tax Reports', value: 'GSTR-1 & GSTR-3B Ready' },
        { label: 'Margin Analytics', value: 'Net gross profit per category' },
        { label: 'Export Options', value: 'Excel (.xlsx), CSV, PDF' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between border-b border-slate-800 pb-1.5 text-white font-bold">
            <span>Day-End Report · Sep 16, 2026</span>
            <span className="text-emerald-400">Export Complete</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Net Sales</div>
              <div className="font-bold text-white">₹52,480</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Tax Collected</div>
              <div className="font-bold text-white">₹4,280</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Est. Margin</div>
              <div className="font-bold text-emerald-400">23.8%</div>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'insights',
    title: 'Business Insights',
    shortLabel: 'Insights',
    category: 'Growth Intelligence',
    description: 'Track business trends, product performance, customer insights, and actionable business intelligence.',
    icon: TrendingUp,
    badge: 'Decision engine',
    checklist: [
      'Monitor business trends & revenue velocity',
      'Analyze top-selling vs dead stock product performance',
      'Review customer retention & foot-traffic insights',
      'Act on data-driven business recommendations'
    ],
    inDepthOverview: 'Make smart purchasing decisions. See which items bring 80% of your profit, which slow-moving products tie up working capital, and what times of day require extra counter staffing.',
    previewData: {
      badgeText: 'Growth Analytics Engine',
      headline: 'Smart Velocity & Foot-Traffic',
      details: [
        { label: 'Dead Stock Flag', value: 'Items with 0 sales > 45 days' },
        { label: 'Peak Hour', value: '6:00 PM – 8:30 PM' },
        { label: 'Repeat Rate', value: '68% Customer Retention' }
      ],
      snippet: (
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex justify-between border-b border-slate-800 pb-1.5 text-white font-bold">
            <span>Top Velocity SKUs (This Week)</span>
            <span className="text-emerald-400">+18% vs Last Week</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>1. Amul Butter 500g</span>
              <span className="text-white font-bold">142 units sold</span>
            </div>
            <div className="flex justify-between">
              <span>2. Aashirvaad Atta 10kg</span>
              <span className="text-white font-bold">98 units sold</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>Dead Stock Alert: Imported Olive Oil</span>
              <span>0 sales in 32 days</span>
            </div>
          </div>
        </div>
      )
    }
  }
];

export const CoreCapabilities: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('billing');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [originIndex, setOriginIndex] = useState<number>(0);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const activeCap = capabilities.find((c) => c.id === activeId) || capabilities[0];
  const ActiveIcon = activeCap.icon;

  // Origin calculation based on 4 columns x 2 rows
  const getOrigin = (index: number) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = col === 0 ? '12.5%' : col === 1 ? '37.5%' : col === 2 ? '62.5%' : '87.5%';
    const y = row === 0 ? '25%' : '75%';
    return `${x} ${y}`;
  };

  const handleCardMouseEnter = (id: string, index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Small intentional buffer (50ms) to prevent accidental rapid flashing
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveId(id);
      setOriginIndex(index);
      setIsHovered(true);
    }, 50);
  };

  const handleSectionMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // 160ms buffer before returning to normal 8-card grid
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

  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-[#fafafa] dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Everything your business needs to operate smoothly.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eight foundational pillars engineered to replace clunky legacy billing systems and fragmented paper ledgers.
            <span className="hidden lg:inline text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
              Hover over any capability below to explore its live workspace in-place.
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP EXPERIENCE (lg: screens and wider): MORPHING WORKSPACE */}
        {/* ============================================================ */}
        <div
          className="hidden lg:block relative min-h-[580px]"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          {/* Layer 1: Background 8-Card Grid */}
          <div
            className={`grid grid-cols-4 gap-4 transition-all duration-300 ease-out ${
              isHovered
                ? 'filter blur-[2px] opacity-25 scale-[0.99] pointer-events-auto'
                : 'filter blur-0 opacity-100 scale-100'
            }`}
          >
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              const isCurrent = cap.id === activeId;

              return (
                <div
                  key={cap.id}
                  id={`desktop-card-${cap.id}`}
                  onMouseEnter={() => handleCardMouseEnter(cap.id, index)}
                  className={`p-5 rounded-2xl text-left flex flex-col justify-between cursor-pointer border transition-all duration-200 ${
                    isCurrent && !isHovered
                      ? 'bg-white dark:bg-slate-900 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 hover:shadow-lg text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    {/* Top Bar: Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                        {cap.badge}
                      </span>
                    </div>

                    {/* Category & Title */}
                    <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                      {cap.category}
                    </div>
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                      {cap.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {cap.description}
                    </p>
                  </div>

                  {/* Checklist highlights */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {cap.checklist.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 2: Morphing Interactive Workspace */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="desktop-expanded-workspace"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.96,
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
                        scale: 0.96,
                        transformOrigin: getOrigin(originIndex)
                      }
                }
                transition={{
                  duration: 0.24,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute inset-0 z-20 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 dark:border-emerald-500/30 shadow-2xl ring-1 ring-emerald-500/20 flex flex-col justify-between"
              >
                {/* Top Interactive Capability Switcher Ribbon */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                        Interactive Capability Workspace
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MousePointer2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Hover any pill to transform workspace</span>
                    </div>
                  </div>

                  {/* 8 Capability Dock Pills */}
                  <div className="grid grid-cols-8 gap-1.5 mb-6 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/80 shadow-inner">
                    {capabilities.map((c, idx) => {
                      const Icon = c.icon;
                      const isActive = c.id === activeId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onMouseEnter={() => handleCardMouseEnter(c.id, idx)}
                          onClick={() => handleCardMouseEnter(c.id, idx)}
                          className={`relative py-2 px-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className="truncate text-[11px]">{c.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workspace Content: Fluid Morphing State */}
                <div className="flex-1 flex flex-col lg:flex-row items-start justify-between gap-8">
                  {/* Left: Capability Detail and Checklist */}
                  <motion.div
                    key={`left-${activeCap.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[48%] space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800/60">
                      <ActiveIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{activeCap.category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {activeCap.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {activeCap.inDepthOverview}
                    </p>

                    {/* Checklist Requirements */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Engineered Capabilities:
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {activeCap.checklist.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {activeCap.previewData.details.map((item, idx) => (
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

                  {/* Right: Application Preview UI Mockup */}
                  <motion.div
                    key={`right-${activeCap.id}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[52%]"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {activeCap.previewData.badgeText}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                          Live UI Preview
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                          {activeCap.previewData.headline}
                        </h4>
                        {activeCap.previewData.snippet}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                        <span>End-to-end synchronized module</span>
                        <span className="text-emerald-500 font-semibold">Zero latency cloud sync</span>
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
        <div className="block lg:hidden space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              const isSelected = cap.id === activeId;

              return (
                <button
                  key={cap.id}
                  id={`mobile-card-${cap.id}`}
                  type="button"
                  onClick={() => setActiveId(cap.id)}
                  aria-pressed={isSelected}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {cap.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      {cap.category}
                    </div>
                    <h3 className="text-base font-bold mb-1.5">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>{isSelected ? 'Viewing details ↓' : 'Tap to preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Detail Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <ActiveIcon className="w-3.5 h-3.5" />
              <span>{activeCap.category}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
              {activeCap.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeCap.inDepthOverview}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Core Capabilities:
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeCap.checklist.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              {activeCap.previewData.snippet}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
