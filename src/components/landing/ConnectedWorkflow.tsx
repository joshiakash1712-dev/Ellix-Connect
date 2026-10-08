import React, { useState, useRef, useEffect } from 'react';
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
    demoExplanation: 'Products are added via quick manual entry, mobile camera scan, or bulk CSV upload. Ellic assigns or reads standard EAN/UPC barcodes and calculates profit margins automatically.',
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CATALOG REPOSITORY</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">STATUS: ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>Item: Basmati Rice Superior 5kg</div>
          <div>Barcode: 8901234567890</div>
          <div>Purchase: ₹380.00</div>
          <div className="text-sky-400 font-bold">Selling Price: ₹480.00 (+26.3%)</div>
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>SCANNER LISTENER</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">MATCH VERIFIED</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Scanned: [8901234567890]</span>
          <span className="text-white font-bold">Basmati Rice 5kg</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
          <span>Unit Qty: 1</span>
          <span className="text-sky-400">Added to current cart</span>
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
    demoExplanation: 'Ellic applies tax slabs (5%, 12%, 18%, 28%) and calculates discounts in real time. Instant receipt preview is ready for thermal printing or WhatsApp delivery.',
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>INVOICE #INV-2026-1049</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">TAX SUMMARY</span>
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
            <span className="text-sky-400">₹1,302.00</span>
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>ATOMIC STOCK SYNC</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">0 DISCREPANCY</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>SKU: Rice-Bas-5kg</div>
          <div>Previous Count: 84</div>
          <div>Deducted: -1 Unit</div>
          <div className="text-sky-400 font-bold">Current Balance: 83 Units</div>
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
    demoExplanation: 'Customers pay using Dynamic UPI QR codes on their phone, cash, or card. Ellic registers the exact payment method and logs the till cash amount without manual balancing.',
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>PAYMENT VERIFICATION</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">SUCCESS</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span>Tender: Dynamic UPI QR</span>
            <span className="text-white font-bold">₹1,302.00</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>VPA: customer@okhdfcbank</span>
            <span className="text-sky-400">Instant Credit</span>
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CUSTOMER KHATA PROFILE</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-blue-300 border border-blue-800/60">WHATSAPP SENT</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div>Customer: Vikram Mehta (+91 98450 11234)</div>
          <div>New Loyalty Balance: 245 pts (+13 earned)</div>
          <div className="text-sky-400 font-bold">Outstanding Credit: ₹0.00 (Fully Paid)</div>
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
        <div className="flex justify-between text-sky-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>LIVE EXECUTIVE DASHBOARD</span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-800/60">UPDATED</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>Daily Revenue: ₹48,950 (+12%)</div>
          <div>Net Gross Margin: 24.2%</div>
          <div>Orders Today: 142</div>
          <div className="text-sky-400 font-bold">GSTR-1 Liability: ₹3,916</div>
        </div>
      </div>
    )
  }
];

export const ConnectedWorkflow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [originIndex, setOriginIndex] = useState<number>(0);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Detect when the Connected Workflow section enters the viewport (Section 12)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.22 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smoothly advance the sapphire data-flow signal through steps 01 -> 07 while in viewport & not hovered
  useEffect(() => {
    if (prefersReducedMotion || !isInViewport || isHovered) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % steps.length);
    }, 1550);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isInViewport, isHovered]);

  const currentStep = steps[activeStepIndex] || steps[0];
  const CurrentIcon = currentStep.icon;

  // Spatial transform-origin calculation corresponding to the 7-column step layout
  const getOrigin = (index: number) => {
    const origins = ['7.1%', '21.4%', '35.7%', '50.0%', '64.3%', '78.6%', '92.9%'];
    const x = origins[index] || '50.0%';
    return `${x} 35%`;
  };

  // Signal progress percentage across the 7 steps (centered on active step column)
  const signalProgressPct = ((activeStepIndex + 0.5) / steps.length) * 100;

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
      ref={sectionRef}
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 lg:mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>Connected Workflow</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold normal-case tracking-normal">7-Step Atomic Signal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            One business action. Everything stays connected.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            In traditional setups, billing doesn&apos;t talk to inventory or paper Khata. In Ellic, a single sale ripples through all 7 operational steps automatically.
            <span className="hidden lg:inline text-blue-600 dark:text-sky-400 font-semibold ml-1">
              Hover over any workflow step below to inspect its live data ripple in-place.
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* CONNECTED DATA-FLOW SIGNAL TRACK (Section 12 & 13)           */}
        {/* ============================================================ */}
        <div className="hidden lg:block mb-5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2 px-1">
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-sky-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
              </span>
              <span>ONE ACTION → CONNECTED CONSEQUENCES → BUSINESS INSIGHT</span>
            </span>
            <span>
              Active Signal: <strong className="text-slate-900 dark:text-white">{currentStep.shortLabel}</strong> ({ currentStep.badge })
            </span>
          </div>

          {/* 7-Node Connected Signal Conduit */}
          <div className="relative h-2 rounded-full bg-slate-200/90 dark:bg-slate-800/90 overflow-visible">
            {/* Illuminated Connected Path up to Active Step */}
            <motion.div
              className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 shadow-[0_0_12px_rgba(37, 99, 235,0.55)]"
              animate={{ width: `${signalProgressPct}%` }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Traveling Sapphire Signal Pulse Head */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 rounded-full bg-sky-400/30 dark:bg-sky-400/40 flex items-center justify-center pointer-events-none"
              animate={{ left: `${signalProgressPct}%` }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-300 shadow-[0_0_10px_rgba(37, 99, 235,0.95)]" />
            </motion.div>

            {/* 7 Step Anchor Dots */}
            <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
              {steps.map((s, idx) => {
                const isReached = idx <= activeStepIndex;
                const isCurrentNode = idx === activeStepIndex;
                return (
                  <div key={s.id} className="flex items-center justify-center">
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isCurrentNode
                          ? 'bg-white ring-2 ring-blue-500 scale-125'
                          : isReached
                          ? 'bg-sky-300 dark:bg-sky-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP EXPERIENCE (lg: screens and wider): MORPHING WORKSPACE */}
        {/* ============================================================ */}
        <div
          className="hidden lg:grid lg:grid-cols-1 items-stretch relative mb-12 box-border"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          {/* Layer 1: Background 7-Step Entry-Point Card Grid */}
          <div
            className={`col-start-1 row-start-1 w-full h-full grid grid-cols-7 gap-3.5 min-h-[560px] items-stretch transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
              isHovered
                ? 'opacity-20 scale-[0.99] pointer-events-auto'
                : 'opacity-100 scale-100'
            }`}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              const isCurrent = activeStepIndex === idx;
              const isConnectedPath = idx <= activeStepIndex;

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
                  className={`website-card-hover p-4 rounded-2xl text-left flex flex-col justify-between cursor-pointer border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-w-0 box-border ${
                    isCurrent && !isHovered
                      ? 'bg-white dark:bg-slate-900 border-sky-500/80 ring-2 ring-blue-500/25 shadow-[0_12px_28px_-6px_rgba(37, 99, 235,0.2)] -translate-y-1 text-slate-900 dark:text-white'
                      : isConnectedPath && !isHovered
                      ? 'bg-white dark:bg-slate-900/95 border-sky-500/30 dark:border-sky-500/25 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg text-slate-900 dark:text-white opacity-90 hover:opacity-100'
                  }`}
                >
                  <div>
                    {/* Top Bar: Step Number Badge + Flow Connector Arrow */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border transition-colors duration-300 ${
                          isCurrent && !isHovered
                            ? 'bg-sky-500/15 text-blue-700 dark:text-sky-300 border-sky-500/40'
                            : isConnectedPath && !isHovered
                            ? 'bg-sky-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-sky-400 border-sky-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        Step {step.stepNumber}
                      </span>

                      {!isLast ? (
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-all duration-300 ${
                            isCurrent
                              ? 'text-sky-500 dark:text-sky-400 translate-x-0.5'
                              : isConnectedPath
                              ? 'text-sky-500/60 dark:text-sky-400/60'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ) : (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            isCurrent ? 'text-sky-500 dark:text-sky-400 scale-110' : 'text-sky-500/70 dark:text-sky-400/70'
                          }`}
                        />
                      )}
                    </div>

                    {/* Icon Container — Brief Activation Glow & Pulse when Signal Reaches Step */}
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all duration-300 ${
                        isCurrent && !isHovered
                          ? 'bg-sky-50 dark:bg-blue-950/80 border-sky-500/50 text-blue-600 dark:text-sky-300 shadow-[0_0_14px_rgba(37, 99, 235,0.25)] scale-105'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 text-blue-600 dark:text-sky-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Category Subtitle & Step Title */}
                    <div className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-1">
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
                      <span className="text-[10px] font-mono text-blue-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                        )}
                        <span>Live Sync</span>
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {step.checklist.slice(0, 2).map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-sky-500 shrink-0" />
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
                  duration: 0.28,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="col-start-1 row-start-1 z-20 w-full h-full min-h-[560px] box-border overflow-hidden p-6 lg:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 dark:border-sky-500/30 shadow-2xl ring-1 ring-blue-500/20 flex flex-col justify-between gap-5"
              >
                {/* Top Interactive Workflow Switcher Ribbon */}
                <div className="w-full min-w-0">
                  <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 truncate">
                        Connected Workflow Live Workspace
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-blue-950/80 text-blue-800 dark:text-sky-300 text-[11px] font-mono font-bold border border-sky-300/60 dark:border-sky-800/60 shrink-0">
                        Step {currentStep.stepNumber} of 07
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                      <MousePointer2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>Hover any step pill to trace the live data ripple</span>
                    </div>
                  </div>

                  {/* 7 Connected Workflow Step Dock Pills with Connected Path Highlight (Section 13) */}
                  <div className="grid grid-cols-7 gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/80 shadow-inner box-border relative">
                    {steps.map((s, idx) => {
                      const StepIcon = s.icon;
                      const isActive = idx === activeStepIndex;
                      const isConnected = idx < activeStepIndex;
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
                          className={`relative py-2 px-1.5 rounded-xl text-xs font-bold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 border border-sky-500/60 shadow-sm ring-2 ring-blue-500/20'
                              : isConnected
                              ? 'bg-sky-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-sky-300 border border-sky-500/25 opacity-95'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 border border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <StepIcon
                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                              isActive
                                ? 'text-sky-500 scale-110'
                                : isConnected
                                ? 'text-sky-500/80'
                                : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate text-[11px]">{s.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Traveling Sapphire Signal Path toward active step */}
                  <div className="mt-2 px-3">
                    <div className="relative h-1 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500/40 via-sky-400 to-sky-400 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_8px_rgba(37, 99, 235,0.5)]"
                        style={{ width: `${((activeStepIndex + 0.5) / steps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Workspace Content: Two-Column Fluid Morphing State Aligned to Container Boundaries */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch min-w-0">
                  {/* Left: Step Explanation, Checklist & Bottom Metric Cards */}
                  <motion.div
                    key={`workflow-left-${currentStep.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="lg:col-span-6 flex flex-col justify-between gap-3.5 min-w-0"
                  >
                    <div className="space-y-3 min-w-0">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-blue-950/80 text-blue-800 dark:text-sky-300 text-xs font-bold border border-sky-300/60 dark:border-sky-800/60">
                        <CurrentIcon className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                        <span>
                          Step {currentStep.stepNumber} · {currentStep.subtitle}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                        {currentStep.demoHeadline}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {currentStep.demoExplanation}
                      </p>

                      {/* Automated Operations Checklist */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 box-border">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Automated Pipeline Actions:
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                          {currentStep.checklist.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                              <span className="truncate sm:whitespace-normal">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step Metric Badges — Contained Inside Main Frame & Bottom-Aligned */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1 mt-auto min-w-0">
                      {currentStep.metrics.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs min-w-0 box-border"
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
                    className="lg:col-span-6 flex flex-col min-w-0"
                  >
                    <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between gap-3.5 min-w-0 box-border">
                      <div className="space-y-3.5 min-w-0">
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                              Live Data Ripple Demonstration
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 bg-sky-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60 shrink-0">
                            All 7 Steps Synced
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {currentStep.title} · System Output
                          </h4>
                          {currentStep.demoSnippet}
                        </div>

                        {/* System Activity Telemetry Strip */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 min-w-0 box-border">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span className="truncate">{currentStep.systemActivity}</span>
                        </div>
                      </div>

                      {/* Bottom Sequential Stepper Controls */}
                      <div className="pt-3 mt-auto flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
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
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            Next Step →
                          </button>
                        </div>
                        <span className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold shrink-0">
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
        <div className="block lg:hidden space-y-4 mb-10">
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
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
                  className={`snap-start shrink-0 w-[235px] sm:w-auto p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-500 ring-2 ring-blue-500/40 shadow-md text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Step {step.stepNumber}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider mb-0.5">
                      {step.subtitle}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {step.actionDetail}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-sky-400">
                    <span>{isSelected ? 'Viewing step details ↓' : 'Tap to preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Detail Workspace */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800">
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
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>{currentStep.systemActivity}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Automated Pipeline Actions:
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentStep.checklist.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
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
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>

        {/* Before vs After Contrast Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* The Old Way */}
          <div data-cursor="card" className="website-card-hover p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-950/80 shadow-sm">
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

          {/* The Ellic Way */}
          <div data-cursor="card" className="website-card-hover p-6 rounded-2xl bg-sky-50/40 dark:bg-blue-950/30 border border-sky-300/80 dark:border-sky-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-blue-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>The Connected Ellic Approach</span>
            </div>
            <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
              One Connected Platform. Everything In Sync.
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-sky-400 font-bold">✓</span>
                <span>Each barcode scan automatically reserves and decrements live stock.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-sky-400 font-bold">✓</span>
                <span>Instant digital Khata ledger with automated WhatsApp payment links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-sky-400 font-bold">✓</span>
                <span>Zero post-closing data entry. Shift drawer and sales close in 60 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-sky-400 font-bold">✓</span>
                <span>Audit-ready GST tax breakdowns and profit margins generated in real time.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

