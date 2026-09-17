import React, { useState } from 'react';
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
  Layers,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowStep {
  stepNumber: string;
  id: string;
  title: string;
  subtitle: string;
  actionDetail: string;
  icon: React.ElementType;
  demoHeadline: string;
  demoExplanation: string;
  systemActivity: string;
  demoSnippet: React.ReactNode;
}

const steps: WorkflowStep[] = [
  {
    stepNumber: '01',
    id: 'product-added',
    title: 'Product Added',
    subtitle: 'Catalog & Barcode Setup',
    actionDetail: 'Item saved with SKU, tax slab, cost price, and retail MRP.',
    icon: Tag,
    demoHeadline: 'SKU Creation & Barcode Encoding',
    demoExplanation: 'Products are added via quick manual entry, mobile camera scan, or bulk CSV upload. Ellix Connect assigns or reads standard EAN/UPC barcodes and calculates profit margins automatically.',
    systemActivity: 'Catalog DB · Indexed SKU #SKU-89241 · Barcode linked',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CATALOG REPOSITORY</span>
          <span>STATUS: ACTIVE</span>
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
    subtitle: 'Rapid Counter Input',
    actionDetail: 'Sub-second optical laser or keyboard search at the till.',
    icon: ScanLine,
    demoHeadline: 'Instant Scanner Recognition (< 0.2s)',
    demoExplanation: 'Cashiers scan items with any USB/Bluetooth barcode scanner or type a quick abbreviation. The counter adds the line item with zero typing delays.',
    systemActivity: 'Register #01 · Scan event captured · Latency 140ms',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>SCANNER LISTENER</span>
          <span className="text-emerald-300">MATCH VERIFIED</span>
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
    subtitle: 'Tax & Line Calculation',
    actionDetail: 'GST rates, item discounts, and grand totals generated live.',
    icon: FileText,
    demoHeadline: 'Automated GST Calculation & Digital Bill',
    demoExplanation: 'Ellix Connect applies tax slabs (5%, 12%, 18%, 28%) and calculates discounts in real time. Instant receipt preview is ready for thermal printing or WhatsApp delivery.',
    systemActivity: 'Billing Engine · Invoice #INV-2026-1049 generated',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>INVOICE #INV-2026-1049</span>
          <span>TAX SUMMARY</span>
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
    subtitle: 'Real-Time Inventory Sync',
    actionDetail: 'Warehouse and shelf quantities decrease simultaneously.',
    icon: Boxes,
    demoHeadline: 'Atomic Inventory Stock Reduction',
    demoExplanation: 'No manual end-of-day reconciliations. The millisecond the bill is created, batch inventories drop across registers and warehouses. If stock drops below safe limits, low-stock warnings activate.',
    systemActivity: 'Inventory Service · Stock updated: 84 → 83 units',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>ATOMIC STOCK SYNC</span>
          <span className="text-emerald-400">0 DISCREPANCY</span>
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
    subtitle: 'Dynamic UPI QR & Cash',
    actionDetail: 'Multi-tender verified and cash drawer automatically balanced.',
    icon: CreditCard,
    demoHeadline: 'Instant Multi-Tender Settlement',
    demoExplanation: 'Customers pay using Dynamic UPI QR codes on their phone, cash, or card. Ellix Connect registers the exact payment method and logs the till cash amount without manual balancing.',
    systemActivity: 'Payment Gateway · UPI Txn #UPI-849204 settled',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>PAYMENT VERIFICATION</span>
          <span>SUCCESS</span>
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
    subtitle: 'Customer Ledger & Loyalty',
    actionDetail: 'Credit ledger balanced and WhatsApp receipt link dispatched.',
    icon: Users,
    demoHeadline: 'Digital Khata & Loyalty Retention',
    demoExplanation: 'Customer loyalty points are credited, existing store credit balance updates, and an automated WhatsApp PDF receipt with a polite thank-you message is sent directly to the customer.',
    systemActivity: 'CRM Worker · Loyalty +13 pts · WhatsApp bill delivered',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>CUSTOMER KHATA PROFILE</span>
          <span className="text-blue-400">WHATSAPP SENT</span>
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
    subtitle: 'Executive Intelligence',
    actionDetail: 'Gross profits, top-selling items, and day-end tax ledgers update.',
    icon: TrendingUp,
    demoHeadline: 'Real-Time Financial & Sales Analytics',
    demoExplanation: 'The entire chain culminates in real-time clarity. Store owners instantly see updated gross profit margins, inventory turnover rates, and audit-ready tax liabilities without opening a spreadsheet.',
    systemActivity: 'Analytics Pipeline · P&L, GSTR-1, & Margin refreshed',
    demoSnippet: (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex justify-between text-emerald-400 border-b border-slate-800 pb-1.5 font-bold">
          <span>LIVE EXECUTIVE DASHBOARD</span>
          <span className="text-emerald-400">UPDATED</span>
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

  const currentStep = steps[activeStepIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <section id="workflow" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Connected Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            One business action. Everything stays connected.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            In traditional setups, billing doesn't talk to inventory or paper Khata. In Ellix Connect, a single sale ripples through all 7 operational steps automatically. Click any step below to see it in action.
          </p>
        </div>

        {/* Visual Sequential Workflow Cards / Flow */}
        <div className="mb-10">
          
          {/* Flow Stepper Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              const isCurrent = activeStepIndex === idx;

              return (
                <button
                  key={step.stepNumber}
                  id={`workflow-step-${idx}`}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-slate-900 dark:bg-emerald-950/80 border-slate-900 dark:border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/40 transform -translate-y-1'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Top Row: Number & Arrow indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      
                      {!isLast && (
                        <div className="hidden lg:block text-slate-300 dark:text-slate-600">
                          <ArrowRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                        isCurrent
                          ? 'bg-slate-800 dark:bg-emerald-900/60 text-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-sm font-bold tracking-tight mb-1 ${
                        isCurrent ? 'text-white' : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <div
                      className={`text-[11px] font-medium mb-2 ${
                        isCurrent ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.subtitle}
                    </div>
                  </div>

                  {/* Micro Detail */}
                  <p
                    className={`text-xs leading-normal mt-2 pt-2 border-t ${
                      isCurrent
                        ? 'border-slate-800 dark:border-emerald-800/60 text-slate-300'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.actionDetail}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Step Demo Panel (Requirement #5) */}
          <div
            id="workflow-step-preview"
            className="mt-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              {/* Left: Step Details & Explanation */}
              <div className="lg:w-1/2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold">
                    Step {currentStep.stepNumber} of 07
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Connected Workflow Pipeline
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2.5">
                  <CurrentIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentStep.demoHeadline}</span>
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentStep.demoExplanation}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{currentStep.systemActivity}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Previous Step
                  </button>
                  <button
                    type="button"
                    disabled={activeStepIndex === steps.length - 1}
                    onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </div>

              {/* Right: Step Demo Visual Snippet */}
              <div className="w-full lg:w-1/2">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Live Data Ripple Demonstration
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">All 7 Steps Synced</span>
                  </div>
                  <div className="p-4 bg-slate-950">
                    {currentStep.demoSnippet}
                  </div>
                </div>
              </div>
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
