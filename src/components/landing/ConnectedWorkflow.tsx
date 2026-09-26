import React, { useState, useRef } from 'react';
import {
  Tag,
  ScanLine,
  FileText,
  Boxes,
  CreditCard,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface WorkflowStep {
  stepNumber: string;
  id: string;
  title: string;
  shortLabel: string;
  subtitle: string;
  badge: string;
  actionDetail: string;
  icon: React.ElementType;
  demoHeadline: string;
  demoExplanation: string;
  systemActivity: string;
  checklist: string[];
  metrics: Array<{ label: string; value: string }>;
  demoSnippet: React.ReactNode;
}

const steps: WorkflowStep[] = [
  {
    stepNumber: '01',
    id: 'product-added',
    title: 'Product Added',
    shortLabel: '01 · Product',
    subtitle: 'Catalog & Barcode Setup',
    badge: 'SKU Indexed',
    actionDetail: 'Item saved with SKU, tax slab, cost price, and retail MRP.',
    icon: Tag,
    demoHeadline: 'SKU Creation & Barcode Encoding',
    demoExplanation: 'Products are added via quick manual entry, mobile camera scan, or bulk CSV upload. Ellix Connect assigns or reads standard EAN/UPC barcodes and calculates profit margins automatically.',
    systemActivity: 'Catalog DB · Indexed SKU #SKU-89241 · Barcode linked',
    checklist: [
      'Assign or scan standard EAN/UPC barcode',
      'Configure purchase cost, MRP, and retail selling price',
      'Bind HSN code and automatic GST tax slab'
    ],
    metrics: [
      { label: 'Entry Speed', value: '< 3 sec / SKU' },
      { label: 'Margin Calc', value: '+26.3% Auto' },
      { label: 'Next Ripple', value: 'POS Scanner Ready' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CATALOG REPOSITORY</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">STATUS: ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>Item: Basmati Rice Superior 5kg</div>
          <div>Barcode: 8901234567890</div>
          <div>Purchase: ₹380.00</div>
          <div className="text-emerald-400 font-bold">Selling Price: ₹480.00 (+26.3%)</div>
        </div>
      </div>
    )
  },
  {
    stepNumber: '02',
    id: 'barcode-scanned',
    title: 'Barcode Scanned',
    shortLabel: '02 · Scanned',
    subtitle: 'Rapid Counter Input',
    badge: '< 0.2s Scan',
    actionDetail: 'Sub-second optical laser or keyboard search at the till.',
    icon: ScanLine,
    demoHeadline: 'Instant Scanner Recognition (< 0.2s)',
    demoExplanation: 'Cashiers scan items with any USB/Bluetooth barcode scanner or type a quick abbreviation. The counter adds the line item with zero typing delays.',
    systemActivity: 'Register #01 · Scan event captured · Latency 140ms',
    checklist: [
      'Plug-and-play USB, Bluetooth, or camera barcode input',
      'Instant SKU lookup with zero focus-loss at checkout',
      'Automatic unit price & batch selection on scan'
    ],
    metrics: [
      { label: 'Scan Latency', value: '140ms Optical' },
      { label: 'Hardware', value: 'USB / BT / Cam' },
      { label: 'Next Ripple', value: 'Live Bill Engine' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>SCANNER LISTENER</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">MATCH VERIFIED</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Scanned: [8901234567890]</span>
          <span className="text-white font-bold">Basmati Rice 5kg</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
          <span>Unit Qty: 1</span>
          <span className="text-emerald-400">Added to current cart</span>
        </div>
      </div>
    )
  },
  {
    stepNumber: '03',
    id: 'bill-created',
    title: 'Bill Created',
    shortLabel: '03 · Bill',
    subtitle: 'Tax & Line Calculation',
    badge: 'GST Auto-Calc',
    actionDetail: 'GST rates, item discounts, and grand totals generated live.',
    icon: FileText,
    demoHeadline: 'Automated GST Calculation & Digital Bill',
    demoExplanation: 'Ellix Connect applies tax slabs (5%, 12%, 18%, 28%) and calculates discounts in real time. Instant receipt preview is ready for thermal printing or WhatsApp delivery.',
    systemActivity: 'Billing Engine · Invoice #INV-2026-1049 generated',
    checklist: [
      'Real-time CGST + SGST split across mixed tax slabs',
      'Role-guarded promotional and line-item discount rules',
      '80mm thermal print & WhatsApp digital invoice ready'
    ],
    metrics: [
      { label: 'Tax Split', value: 'CGST + SGST' },
      { label: 'Invoice Format', value: '80mm & WhatsApp' },
      { label: 'Next Ripple', value: 'Atomic Stock Sync' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>INVOICE #INV-2026-1049</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">TAX SUMMARY</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span>Subtotal (3 items)</span>
            <span>₹1,240.00</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>CGST (2.5%) + SGST (2.5%)</span>
            <span>₹62.00</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
            <span>Net Payable</span>
            <span className="text-emerald-400">₹1,302.00</span>
          </div>
        </div>
      </div>
    )
  },
  {
    stepNumber: '04',
    id: 'stock-deducted',
    title: 'Stock Deducted',
    shortLabel: '04 · Stock',
    subtitle: 'Real-Time Inventory Sync',
    badge: 'Atomic Sync',
    actionDetail: 'Warehouse and shelf quantities decrease simultaneously.',
    icon: Boxes,
    demoHeadline: 'Atomic Inventory Stock Reduction',
    demoExplanation: 'No manual end-of-day reconciliations. The millisecond the bill is created, batch inventories drop across registers and warehouses. If stock drops below safe limits, low-stock warnings activate.',
    systemActivity: 'Inventory Service · Stock updated: 84 → 83 units',
    checklist: [
      'Simultaneous deduction across active counter & storage',
      'Automated low-stock threshold alert evaluation',
      'Zero discrepancy between billed items and shelf count'
    ],
    metrics: [
      { label: 'Sync Mode', value: 'Atomic Write' },
      { label: 'Discrepancy', value: '0.0% Variance' },
      { label: 'Next Ripple', value: 'Tender Settlement' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>ATOMIC STOCK SYNC</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">0 DISCREPANCY</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>SKU: Rice-Bas-5kg</div>
          <div>Previous Count: 84</div>
          <div>Deducted: -1 Unit</div>
          <div className="text-emerald-400 font-bold">Current Balance: 83 Units</div>
        </div>
      </div>
    )
  },
  {
    stepNumber: '05',
    id: 'payment-received',
    title: 'Payment Received',
    shortLabel: '05 · Payment',
    subtitle: 'Dynamic UPI QR & Cash',
    badge: 'Multi-Tender',
    actionDetail: 'Multi-tender verified and cash drawer automatically balanced.',
    icon: CreditCard,
    demoHeadline: 'Instant Multi-Tender Settlement',
    demoExplanation: 'Customers pay using Dynamic UPI QR codes on their phone, cash, or card. Ellix Connect registers the exact payment method and logs the till cash amount without manual balancing.',
    systemActivity: 'Payment Gateway · UPI Txn #UPI-849204 settled',
    checklist: [
      'Dynamic exact-amount UPI QR generation on screen',
      'Support for Cash, Card, UPI, Bank Transfer & Split Pay',
      'Automatic shift register & cash drawer reconciliation'
    ],
    metrics: [
      { label: 'Tender Types', value: 'UPI / Cash / Split' },
      { label: 'Verification', value: 'Instant Match' },
      { label: 'Next Ripple', value: 'Customer Khata' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>PAYMENT VERIFICATION</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">SUCCESS</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span>Tender: Dynamic UPI QR</span>
            <span className="text-white font-bold">₹1,302.00</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>VPA: customer@okhdfcbank</span>
            <span className="text-emerald-400">Instant Credit</span>
          </div>
        </div>
      </div>
    )
  },
  {
    stepNumber: '06',
    id: 'khata-updated',
    title: 'Khata Updated',
    shortLabel: '06 · Khata',
    subtitle: 'Customer Ledger & Loyalty',
    badge: 'CRM & Loyalty',
    actionDetail: 'Credit ledger balanced and WhatsApp receipt link dispatched.',
    icon: Users,
    demoHeadline: 'Digital Khata & Loyalty Retention',
    demoExplanation: 'Customer loyalty points are credited, existing store credit balance updates, and an automated WhatsApp PDF receipt with a polite thank-you message is sent directly to the customer.',
    systemActivity: 'CRM Worker · Loyalty +13 pts · WhatsApp bill delivered',
    checklist: [
      'Immutable digital Khata credit & payment ledger update',
      'Automatic loyalty reward points calculation on spend',
      'One-tap WhatsApp bill & payment link dispatch'
    ],
    metrics: [
      { label: 'Loyalty Added', value: '+13 Reward Pts' },
      { label: 'Receipt Link', value: 'WhatsApp Sent' },
      { label: 'Next Ripple', value: 'Live Analytics' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CUSTOMER KHATA PROFILE</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-blue-300 border border-blue-800/60">WHATSAPP SENT</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div>Customer: Vikram Mehta (+91 98450 11234)</div>
          <div>New Loyalty Balance: 245 pts (+13 earned)</div>
          <div className="text-emerald-400 font-bold">Outstanding Credit: ₹0.00 (Fully Paid)</div>
        </div>
      </div>
    )
  },
  {
    stepNumber: '07',
    id: 'insights-refreshed',
    title: 'Insights Refreshed',
    shortLabel: '07 · Insights',
    subtitle: 'Executive Intelligence',
    badge: 'Live P&L',
    actionDetail: 'Gross profits, top-selling items, and day-end tax ledgers update.',
    icon: TrendingUp,
    demoHeadline: 'Real-Time Financial & Sales Analytics',
    demoExplanation: 'The entire chain culminates in real-time clarity. Store owners instantly see updated gross profit margins, inventory turnover rates, and audit-ready tax liabilities without opening a spreadsheet.',
    systemActivity: 'Analytics Pipeline · P&L, GSTR-1, & Margin refreshed',
    checklist: [
      'Instant net revenue and gross margin recalculation',
      'Audit-ready GSTR-1 & GSTR-3B tax liability update',
      'Fast-moving SKU velocity & cashier performance metrics'
    ],
    metrics: [
      { label: 'Gross Margin', value: '24.2% Real-Time' },
      { label: 'GST Ledger', value: 'GSTR-1 Synced' },
      { label: 'Pipeline State', value: '7/7 Complete ✓' }
    ],
    demoSnippet: (
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>LIVE EXECUTIVE DASHBOARD</span>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800/60">UPDATED</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>Daily Revenue: ₹48,950 (+12%)</div>
          <div>Net Gross Margin: 24.2%</div>
          <div>Orders Today: 142</div>
          <div className="text-emerald-400 font-bold">GSTR-1 Liability: ₹3,916</div>
        </div>
      </div>
    )
  }
];

export const ConnectedWorkflow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [originIndex, setOriginIndex] = useState<number>(0);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const currentStep = steps[activeStepIndex] || steps[0];
  const CurrentIcon = currentStep.icon;

  // Spatial transform-origin calculation corresponding to the 7-column step layout
  const getOrigin = (index: number) => {
    const origins = ['7.1%', '21.4%', '35.7%', '50.0%', '64.3%', '78.6%', '92.9%'];
    const x = origins[index] || '50.0%';
    return `${x} 35%`;
  };

  const handleCardMouseEnter = (index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // 50ms intentional hover buffer to prevent accidental rapid flashing
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveStepIndex(index);
      setOriginIndex(index);
      setIsHovered(true);
    }, 50);
  };

  const handleSectionMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // 160ms buffer before returning cleanly to the 7-step card grid
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

  const handleStepKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveStepIndex(index);
      setOriginIndex(index);
      setIsHovered(true);
    } else if (e.key === 'Escape' && isHovered) {
      e.preventDefault();
      setIsHovered(false);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(steps.length - 1, index + 1);
      setActiveStepIndex(next);
      setOriginIndex(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      setActiveStepIndex(prev);
      setOriginIndex(prev);
    }
  };

  return (
    <section
      id="workflow"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Connected Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            One business action. Everything stays connected.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            In traditional setups, billing doesn't talk to inventory or paper Khata. In Ellix Connect, a single sale ripples through all 7 operational steps automatically.
            <span className="hidden lg:inline text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
              Hover over any workflow step below to inspect its live data ripple in-place.
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP EXPERIENCE (lg: screens and wider): MORPHING WORKSPACE */}
        {/* ============================================================ */}
        <div
          className="hidden lg:block relative min-h-[540px] mb-12"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          {/* Layer 1: Background 7-Step Entry-Point Card Grid */}
          <div
            className={`grid grid-cols-7 gap-3.5 min-h-[540px] items-stretch transition-all duration-200 ease-out will-change-transform ${
              isHovered
                ? 'opacity-20 scale-[0.99] pointer-events-auto'
                : 'opacity-100 scale-100'
            }`}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={step.stepNumber}
                  id={`workflow-step-${idx}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isCurrent}
                  data-cursor="card"
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onClick={() => handleCardMouseEnter(idx)}
                  onKeyDown={(e) => handleStepKeyDown(e, idx)}
                  className={`website-card-hover p-4 rounded-2xl text-left flex flex-col justify-between cursor-pointer border transition-all duration-200 ${
                    isCurrent && !isHovered
                      ? 'bg-white dark:bg-slate-900 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 hover:shadow-lg text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    {/* Top Bar: Step Number Badge + Flow Connector Arrow */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                          isCurrent && !isHovered
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        Step {step.stepNumber}
                      </span>

                      {!isLast ? (
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-colors ${
                            isCurrent ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      )}
                    </div>

                    {/* Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Category Subtitle & Step Title */}
                    <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                      {step.subtitle}
                    </div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-2 leading-snug">
                      {step.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {step.actionDetail}
                    </p>
                  </div>

                  {/* Bottom Supporting Highlights */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                        {step.badge}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        Live Sync
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {step.checklist.slice(0, 2).map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 2: Morphing Interactive Workflow Workspace */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="workflow-expanded-workspace"
                id="workflow-step-preview"
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
                {/* Top Interactive Workflow Switcher Ribbon */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                        Connected Workflow Live Workspace
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold border border-emerald-300/60 dark:border-emerald-800/60">
                        Step {currentStep.stepNumber} of 07
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MousePointer2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Hover any step pill to trace the live data ripple</span>
                    </div>
                  </div>

                  {/* 7 Connected Workflow Step Dock Pills */}
                  <div className="grid grid-cols-7 gap-1.5 mb-6 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/80 shadow-inner">
                    {steps.map((s, idx) => {
                      const StepIcon = s.icon;
                      const isActive = idx === activeStepIndex;
                      return (
                        <button
                          key={s.stepNumber}
                          type="button"
                          data-cursor="hover"
                          aria-pressed={isActive}
                          onMouseEnter={() => {
                            setActiveStepIndex(idx);
                            setOriginIndex(idx);
                          }}
                          onClick={() => {
                            setActiveStepIndex(idx);
                            setOriginIndex(idx);
                          }}
                          className={`relative py-2 px-1.5 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 border border-transparent'
                          }`}
                        >
                          <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className="truncate text-[11px]">{s.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workspace Content: Two-Column Fluid Morphing State */}
                <div className="flex-1 flex flex-col lg:flex-row items-start justify-between gap-8">
                  {/* Left: Step Explanation, Checklist & Sequential Controls */}
                  <motion.div
                    key={`workflow-left-${currentStep.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[48%] space-y-3.5"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800/60">
                      <CurrentIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Step {currentStep.stepNumber} · {currentStep.subtitle}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {currentStep.demoHeadline}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {currentStep.demoExplanation}
                    </p>

                    {/* Automated Operations Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Automated Pipeline Actions:
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {currentStep.checklist.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Metric Badges */}
                    <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                      {currentStep.metrics.map((item, idx) => (
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

                  {/* Right: Live Data Ripple Console & Stepper Navigation */}
                  <motion.div
                    key={`workflow-right-${currentStep.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full lg:w-[52%] flex flex-col justify-between space-y-3.5"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3.5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            Live Data Ripple Demonstration
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                          All 7 Steps Synced
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          {currentStep.title} · System Output
                        </h4>
                        {currentStep.demoSnippet}
                      </div>

                      {/* System Activity Telemetry Strip */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{currentStep.systemActivity}</span>
                      </div>

                      {/* Bottom Sequential Stepper Controls */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-cursor="hover"
                            disabled={activeStepIndex === 0}
                            onClick={() => {
                              const prev = Math.max(0, activeStepIndex - 1);
                              setActiveStepIndex(prev);
                              setOriginIndex(prev);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            ← Previous Step
                          </button>
                          <button
                            type="button"
                            data-cursor="hover"
                            disabled={activeStepIndex === steps.length - 1}
                            onClick={() => {
                              const next = Math.min(steps.length - 1, activeStepIndex + 1);
                              setActiveStepIndex(next);
                              setOriginIndex(next);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            Next Step →
                          </button>
                        </div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Zero latency cloud sync
                        </span>
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
        <div className="block lg:hidden space-y-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStepIndex === idx;

              return (
                <button
                  key={step.stepNumber}
                  id={`mobile-workflow-step-${idx}`}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  aria-pressed={isSelected}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Step {step.stepNumber}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      {step.subtitle}
                    </div>
                    <h3 className="text-base font-bold mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.actionDetail}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>{isSelected ? 'Viewing step details ↓' : 'Tap to preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Detail Workspace */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>
                  Step {currentStep.stepNumber} of 07 · {currentStep.subtitle}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">All 7 Steps Synced</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
              {currentStep.demoHeadline}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStep.demoExplanation}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{currentStep.systemActivity}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Automated Pipeline Actions:
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentStep.checklist.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              {currentStep.demoSnippet}
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous Step
              </button>
              <button
                type="button"
                disabled={activeStepIndex === steps.length - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>

        {/* Before vs After Contrast Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* The Old Way */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-950/80 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>The Fragmented Legacy Approach</span>
            </div>
            <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
              4 Disconnected Tools & Manual Reconciliations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Billing machine does not know current warehouse stock levels.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Customer credit recorded on paper notebooks (Khata), leading to lost money.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Manual spreadsheet data entry required every night after closing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>GST reports prepared days late with calculation discrepancies.</span>
              </li>
            </ul>
          </div>

          {/* The Ellix Connect Way */}
          <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>The Connected Ellix Approach</span>
            </div>
            <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
              One Connected Platform. Everything In Sync.
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Each barcode scan automatically reserves and decrements live stock.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Instant digital Khata ledger with automated WhatsApp payment links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Zero post-closing data entry. Shift drawer and sales close in 60 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Audit-ready GST tax breakdowns and profit margins generated in real time.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

