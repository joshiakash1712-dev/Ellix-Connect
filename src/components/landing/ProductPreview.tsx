import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Boxes,
  Users,
  BarChart3,
  Search,
  ScanLine,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  QrCode,
  DollarSign,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  FileSpreadsheet,
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PreviewTab = 'dashboard' | 'billing' | 'inventory' | 'customers' | 'reports';

interface Hotspot {
  id: string;
  title: string;
  badge: string;
  description: string;
}

const tabHotspots: Record<PreviewTab, Hotspot[]> = {
  dashboard: [
    {
      id: 'rev-metric',
      title: 'Real-Time Revenue Engine',
      badge: 'Live Metric',
      description: 'Calculates net and gross turnover automatically from synced counter receipts with week-on-week trend comparisons.'
    },
    {
      id: 'margin-calc',
      title: 'Gross Margin Analytics',
      badge: 'Profit Tracker',
      description: 'Computes cost of goods sold (COGS) instantly on every sale based on batch purchase price.'
    },
    {
      id: 'khata-summary',
      title: 'Khata Credit Snapshot',
      badge: 'Ledger',
      description: 'Tracks total outstanding customer credit with single-click WhatsApp repayment reminder alerts.'
    }
  ],
  billing: [
    {
      id: 'pos-scanner',
      title: 'Sub-0.2s Barcode Scanner',
      badge: 'POS Speed',
      description: 'Works with any USB or Bluetooth laser scanner. Supports rapid SKU search and custom weigh-scale items.'
    },
    {
      id: 'dynamic-upi',
      title: 'Dynamic NPCI UPI QR',
      badge: 'Payment',
      description: 'Generates real-time QR code tied to the exact bill rupee amount to eliminate cashier typing errors.'
    },
    {
      id: 'whatsapp-receipt',
      title: 'Digital WhatsApp Tax Invoices',
      badge: 'Eco-Receipt',
      description: 'Sends formal PDF GST receipts directly to customer WhatsApp, cutting thermal paper costs by 80%.'
    }
  ],
  inventory: [
    {
      id: 'live-sync',
      title: 'Instant Multi-Counter Stock Sync',
      badge: 'Stock Engine',
      description: 'Deducts items in real time across all POS registers, eliminating inventory discrepancies.'
    },
    {
      id: 'batch-fefo',
      title: 'Batch & Expiry Monitoring',
      badge: 'Compliance',
      description: 'First-Expired, First-Out (FEFO) logic ensures older stock moves first to prevent shelf expiration.'
    },
    {
      id: 'reorder-draft',
      title: 'Automated Reorder Purchase Drafts',
      badge: 'Procurement',
      description: 'Auto-generates vendor purchase orders when inventory hits minimum safety thresholds.'
    }
  ],
  customers: [
    {
      id: 'khata-ledger',
      title: 'Digital Customer Credit Ledger',
      badge: 'Trust Book',
      description: 'Tamper-proof ledger tracks credits and partial repayments with clear date and invoice logs.'
    },
    {
      id: 'whatsapp-reminder',
      title: '1-Tap WhatsApp Payment Links',
      badge: 'Collection',
      description: 'Polite, automated payment reminder messages containing direct UPI pay links.'
    },
    {
      id: 'vip-loyalty',
      title: 'VIP Loyalty Point Engine',
      badge: 'Retention',
      description: 'Awards redeemable cash points on checkout to boost recurring footfall.'
    }
  ],
  reports: [
    {
      id: 'gst-summary',
      title: 'GSTR-1 Ready Tax Tables',
      badge: 'Compliance',
      description: 'Clean breakdown of CGST, SGST, IGST across 0%, 5%, 12%, 18%, and 28% slabs.'
    },
    {
      id: 'fast-moving',
      title: 'Top 10 Fast-Moving SKUs',
      badge: 'Merchandising',
      description: 'Identifies high-velocity items and dead inventory so you never overstock slow products.'
    },
    {
      id: 'tally-export',
      title: 'One-Click Tally & Excel Export',
      badge: 'Accounting',
      description: 'Export clean CSV/JSON spreadsheets formatted directly for your Chartered Accountant.'
    }
  ]
};

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('dashboard');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  const currentHotspots = tabHotspots[activeTab];

  return (
    <section id="product" className="py-20 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Interactive Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            See Ellix Connect in action.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore realistic mockups of the platform's core workspaces. Switch tabs below and click feature hotspots to explore key UI capabilities.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('billing');
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>POS & Checkout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('inventory');
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span>Inventory Management</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('customers');
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Khata (Customer Credit)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('reports');
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Analytics & Reports</span>
          </button>
        </div>

        {/* Hotspots Quick Explorer Bar */}
        <div className="max-w-4xl mx-auto mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive UI Hotspots:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentHotspots.map((hotspot, idx) => (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    selectedHotspot?.id === hotspot.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{hotspot.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Click any hotspot to inspect UI details
          </div>
        </div>

        {/* Hotspot Highlight Card (If active) */}
        {selectedHotspot && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 flex items-start justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                  {selectedHotspot.badge}
                </span>
                <h4 className="text-sm font-bold">{selectedHotspot.title}</h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Mockup Display Canvas */}
        <div className="rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all">
          
          {/* Browser / Shell Header */}
          <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono hidden sm:inline">
                Ellix Connect OS · Active Workspace: {activeTab.toUpperCase()}
              </span>
            </div>

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Demo Store · Realistic Retail Data</span>
            </div>
          </div>

          {/* Tab Screen Content with AnimatePresence */}
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
            
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Today's Revenue</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹48,920</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ 14.8% vs last Tuesday</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Profit</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹12,450</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">25.4% Net Margin</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Invoices</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42 Bills</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Zero pending bills</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Khata Credit</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹6,800</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">4 regular customers</div>
                  </div>
                </div>

                {/* Dashboard Split: Recent Transactions + Stock Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Recent Completed Bills Table (8 Cols) */}
                  <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Completed Invoices</h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Live feed · 42 today</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                            <th className="pb-2">Invoice #</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Payment</th>
                            <th className="pb-2">Items</th>
                            <th className="pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          <tr>
                            <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-white">#INV-1042</td>
                            <td className="py-2.5 text-slate-700 dark:text-slate-300">Rajesh Verma</td>
                            <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">UPI QR</span></td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400">3 items</td>
                            <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">₹1,120.00</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-white">#INV-1041</td>
                            <td className="py-2.5 text-slate-700 dark:text-slate-300">Pooja Sharma</td>
                            <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">Cash</span></td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400">5 items</td>
                            <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">₹640.00</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-white">#INV-1040</td>
                            <td className="py-2.5 text-slate-700 dark:text-slate-300">Vikram Rao</td>
                            <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-semibold">Card</span></td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400">8 items</td>
                            <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">₹2,450.00</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-white">#INV-1039</td>
                            <td className="py-2.5 text-slate-700 dark:text-slate-300">Aman Gupta</td>
                            <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-semibold">Split</span></td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400">2 items</td>
                            <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">₹890.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Low Stock Alerts & Health (4 Cols) */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>Restock Priority</span>
                        </h4>
                        <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                          3 Items
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white">Tata Salt Iodized 1kg</div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-1">
                            <span>Remaining: <strong className="text-rose-600 dark:text-rose-400">3 pkts</strong></span>
                            <span>Min: 15 pkts</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white">Fortune Sunflower Oil 1L</div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-1">
                            <span>Remaining: <strong className="text-amber-600 dark:text-amber-400">5 btls</strong></span>
                            <span>Min: 20 btls</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white">Surf Excel Quick Wash 1kg</div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-1">
                            <span>Remaining: <strong className="text-amber-600 dark:text-amber-400">4 pkts</strong></span>
                            <span>Min: 12 pkts</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Restock PO Drafted</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready to Send</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Product Catalog Grid (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Search Bar & Barcode Scanner */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        value="Search by barcode, SKU, or name..."
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-500 dark:text-slate-400 shadow-sm"
                      />
                    </div>
                    <button type="button" className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-transparent dark:border-slate-700">
                      <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Scan [F2]</span>
                    </button>
                  </div>

                  {/* Category Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-medium shrink-0">All (128)</span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium shrink-0">Groceries</span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium shrink-0">Oils & Ghee</span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium shrink-0">Beverages</span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium shrink-0">Snacks</span>
                  </div>

                  {/* Grid of Quick-Select Items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">GRO-102</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Basmati Rice 5kg</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹540.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">28 in stock</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">OIL-401</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Groundnut Oil 1L</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹320.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">14 in stock</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">NUT-914</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Roasted Almonds 250g</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹260.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">19 in stock</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">BEV-201</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Assam Gold Tea 500g</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹290.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">42 in stock</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">SP-109</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Kashmiri Chilli 200g</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹145.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">35 in stock</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="text-[10px] text-slate-400 font-mono">SN-552</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Digestive Biscuits 1kg</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-2">₹180.00</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">50 in stock</span>
                    </div>
                  </div>

                </div>

                {/* Right: Active Order Cart & Payment (5 Cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Current Cart (3 items)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Customer: Rajesh Verma (+91 98450 11223)</div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                        120 Pts
                      </span>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Basmati Rice 5kg</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">₹540.00 × 1</div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">₹540.00</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Groundnut Oil 1L</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">₹320.00 × 1</div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">₹320.00</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Roasted Almonds 250g</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">₹260.00 × 1</div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">₹260.00</span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-900 dark:text-white">₹1,067.00</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>GST (5% & 12%)</span>
                        <span className="font-medium text-slate-900 dark:text-white">₹53.00</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-950 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                        <span>Grand Total</span>
                        <span>₹1,120.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                      <button type="button" className="py-2.5 rounded-lg bg-emerald-600 text-white shadow-sm flex items-center justify-center gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>UPI QR</span>
                      </button>
                      <button type="button" className="py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Cash</span>
                      </button>
                      <button type="button" className="py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Card</span>
                      </button>
                    </div>

                    <button type="button" className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
                      <span>Complete & Print Thermal Bill [Enter]</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 3. INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                
                {/* Filter and Summary Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inventory Catalog</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">1,240 Total SKUs · ₹4,85,000 Inventory Value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                      Auto-Restock Draft Active
                    </span>
                  </div>
                </div>

                {/* SKU Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                        <th className="pb-2">SKU Code</th>
                        <th className="pb-2">Product Name</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Stock Level</th>
                        <th className="pb-2 text-right">Cost Price</th>
                        <th className="pb-2 text-right">Selling Price</th>
                        <th className="pb-2 text-right">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-3 font-mono font-medium text-slate-600 dark:text-slate-400">8901234001</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">Royal Basmati Rice 5kg</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">Groceries</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                            28 units (Healthy)
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-600 dark:text-slate-400">₹440.00</td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">₹540.00</td>
                        <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">18.5%</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono font-medium text-slate-600 dark:text-slate-400">8901234002</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">Cold Pressed Groundnut Oil 1L</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">Oils & Ghee</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                            5 units (Low Stock)
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-600 dark:text-slate-400">₹250.00</td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">₹320.00</td>
                        <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">21.8%</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono font-medium text-slate-600 dark:text-slate-400">8901234003</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">Tata Salt Iodized 1kg</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">Spices & Salt</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold text-[10px]">
                            3 units (Critical)
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-600 dark:text-slate-400">₹22.00</td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">₹28.00</td>
                        <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">21.4%</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono font-medium text-slate-600 dark:text-slate-400">8901234004</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">Roasted California Almonds 250g</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">Dry Fruits</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                            19 units (Healthy)
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-600 dark:text-slate-400">₹195.00</td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">₹260.00</td>
                        <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">25.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Batch Expiry Audits: 0 items expiring within 30 days</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Stock Reorder Dispatch Ready</span>
                </div>
              </div>
            )}

            {/* 4. CUSTOMERS & KHATA TAB */}
            {activeTab === 'customers' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Customer List (7 Cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Customer Directory & Khata</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Track purchase history and customer credit</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      240 Active Accounts
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Rajesh Verma</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">+91 98450 11223 · 18 orders</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Clear (₹0.00)</div>
                        <div className="text-[10px] text-slate-400">120 Loyalty Points</div>
                      </div>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Mahesh Kulkarni</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">+91 97310 44556 · 32 orders</div>
                      </div>
                      <div className="text-right">
                        <div className="text-rose-600 dark:text-rose-400 font-bold">₹1,850 Due (Khata)</div>
                        <div className="text-[10px] text-slate-400">Due 4 days ago</div>
                      </div>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Sunita Patel</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">+91 94480 88990 · 11 orders</div>
                      </div>
                      <div className="text-right">
                        <div className="text-rose-600 dark:text-rose-400 font-bold">₹750 Due (Khata)</div>
                        <div className="text-[10px] text-slate-400">Due tomorrow</div>
                      </div>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Vikram Rao</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">+91 99000 12345 · 45 orders</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Clear (₹0.00)</div>
                        <div className="text-[10px] text-slate-400">420 Loyalty Points</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Customer Credit Card / Ledger (5 Cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Khata Ledger Snapshot</span>
                        <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold px-2 py-0.5 rounded">
                          Payment Pending
                        </span>
                      </div>
                      <div className="text-base font-bold text-slate-950 dark:text-white mt-1">Mahesh Kulkarni</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">+91 97310 44556 · Bengaluru, KA</div>
                    </div>

                    {/* Balance Box */}
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs mb-3">
                      <div className="text-rose-700 dark:text-rose-400 font-medium">Outstanding Credit Balance</div>
                      <div className="text-2xl font-extrabold text-rose-900 dark:text-rose-300 mt-1">₹1,850.00</div>
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">3 unpaid invoices from this month</div>
                    </div>

                    {/* Unpaid items summary */}
                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span>#INV-0982 (Grocery items)</span>
                        <span className="font-medium text-slate-900 dark:text-white">₹850.00</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span>#INV-0994 (Vegetable Oil)</span>
                        <span className="font-medium text-slate-900 dark:text-white">₹1,000.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button type="button" className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5">
                      <span>Send WhatsApp Payment Link</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700">
                      Record Cash Repayment
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 5. REPORTS & TAX TAB */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Reports Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Monthly Revenue</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹9,42,850</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ 18.2% vs previous month</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Gross Profit</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹2,38,100</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">25.25% Average Margin</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">GST Collected (Output Tax)</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹47,140</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">GSTR-1 Export Ready</div>
                  </div>
                </div>

                {/* Tax Breakdown & Payment Method Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* GST Tax Slabs */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">GST Tax Liability Summary</h4>
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-800">
                        GSTR-3B Ready
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">5% Slab (Essential Commodities)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Taxable Value: ₹4,20,000</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">₹21,000</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">CGST ₹10,500 + SGST ₹10,500</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">12% Slab (Packaged Foods)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Taxable Value: ₹1,80,000</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">₹21,600</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">CGST ₹10,800 + SGST ₹10,800</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">18% Slab (Personal Care & Household)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Taxable Value: ₹25,200</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">₹4,536</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">CGST ₹2,268 + SGST ₹2,268</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Tender Distribution */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Payment Collection Channels</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">100% Reconciled</span>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                            <span>Dynamic UPI QR (PhonePe / GPay / Paytm)</span>
                            <span>64% (₹6,03,424)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[64%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                            <span>Cash Drawer (Drawer Reconciled)</span>
                            <span>26% (₹2,45,141)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-800 dark:bg-slate-400 rounded-full w-[26%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                            <span>Credit & Debit Cards (PoS Terminal)</span>
                            <span>10% (₹94,285)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[10%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Ready for accounting software</span>
                      <button type="button" className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
                        <span>Export Excel / Tally CSV</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
};
