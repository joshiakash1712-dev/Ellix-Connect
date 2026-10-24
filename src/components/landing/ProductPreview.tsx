import React, { useState } from 'react';
import {
  Receipt,
  Boxes,
  Users,
  LayoutDashboard,
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

type TabKey = 'pos' | 'inventory' | 'khata' | 'dashboard' | 'reports';

interface TabItem {
  id: TabKey;
  number: string;
  label: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  image: string;
}

const tabs: TabItem[] = [
  {
    id: 'pos',
    number: '01',
    label: 'Billing POS',
    badge: 'Sub-0.2s',
    icon: Receipt,
    headline: 'Express Optical Checkout',
    description: 'Instant barcode scanning, dynamic UPI QR code generation, and 1-click thermal printing.',
    image: billingImg,
  },
  {
    id: 'inventory',
    number: '02',
    label: 'Inventory',
    badge: 'Live Sync',
    icon: Boxes,
    headline: 'Real-Time Batch Control',
    description: 'Automatic stock deductions on every sale with proactive low-stock alerts and expiry monitoring.',
    image: inventoryImg,
  },
  {
    id: 'khata',
    number: '03',
    label: 'Khata CRM',
    badge: 'Zero-Paper',
    icon: Users,
    headline: 'Digital Customer Credit Book',
    description: 'Enforce safety credit limits and send automated WhatsApp payment reminders with UPI links.',
    image: customersImg,
  },
  {
    id: 'dashboard',
    number: '04',
    label: 'Dashboard',
    badge: 'Real-Time',
    icon: LayoutDashboard,
    headline: 'Live Store Command',
    description: 'Monitor daily sales revenue, net profit margins, completed bills, and active registers.',
    image: productsImg,
  },
  {
    id: 'reports',
    number: '05',
    label: 'Reports & GST',
    badge: '1-Click Export',
    icon: BarChart3,
    headline: 'Automated Tax & Z-Reports',
    description: 'Statutory GSTR-1 sales schedules, gross margin audits, and end-of-day register balancing.',
    image: recordsImg,
  },
];

const wheelItems: WorksWheelItem[] = tabs.map((tab) => ({
  title: tab.label,
  tagline: tab.badge,
  image: tab.image,
  href: `#product-${tab.id}`,
}));

export const ProductPreview: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const activeTabMeta = tabs[activeTabIndex] || tabs[0];
  const activeTab = activeTabMeta.id;

  const handleTabSelect = React.useCallback((idx: number) => {
    setActiveTabIndex(idx);
  }, []);

  return (
    <section
      id="product"
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-600 dark:text-sky-400 uppercase select-none mb-1.5 sm:mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
            <span>Interactive Product Wheel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Designed for speed at the counter.
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Turn the 3D wheel or select any module to test the live register simulator and real-time business views.
          </p>
        </div>

        {/* 5 Module Interactive Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2.5 mb-8">
          {tabs.map((tab, idx) => {
            const TabIcon = tab.icon;
            const isActive = activeTabIndex === idx;
            const isPast = idx < activeTabIndex;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(idx)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : isPast
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive ? 'text-blue-100' : isPast ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  >
                    {tab.number}
                  </span>
                  <TabIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-white' : isPast ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold truncate">{tab.label}</div>
                <div
                  className={`hidden sm:block text-[10px] truncate mt-0.5 ${
                    isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side: 3D WorksWheel on Left, Live UI Simulator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: 3D WorksWheel Component */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 shadow-sm overflow-hidden flex flex-col">
              
              {/* The 3D Wheel Stage */}
              <div className="relative flex-1 w-full overflow-hidden">
                <WorksWheel
                  items={wheelItems}
                  label="Product '26"
                  action="Inspect"
                  activeIndex={activeTabIndex}
                  onActiveChange={handleTabSelect}
                  onItemClick={handleTabSelect}
                  className="h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-transparent"
                />
              </div>

              {/* Bottom Quick Jump Dots */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 text-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Active: <strong className="text-slate-900 dark:text-white">{activeTabMeta.label}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {tabs.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTabSelect(idx)}
                      aria-label={`Jump to tab ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeTabIndex
                          ? 'w-6 bg-blue-600'
                          : idx < activeTabIndex
                          ? 'w-2 bg-blue-300 dark:bg-blue-800'
                          : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Live Interactive UI Simulator Window */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
            <div className="rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col justify-between h-full">
              
              <div>
                {/* Window Header */}
                <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="ml-1 text-[11px] sm:text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate">
                      Ellic Enterprise • {activeTabMeta.label}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-sky-300 border border-blue-200 dark:border-blue-900 shrink-0 whitespace-nowrap">
                    {activeTabMeta.badge}
                  </span>
                </div>

                {/* Module Simulator Content */}
                <div className="p-4 sm:p-5 md:p-6 space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                          {activeTabMeta.headline}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                          {activeTabMeta.description}
                        </p>
                      </div>

                      {/* TAB 1: POS BILLING SCREEN */}
                      {activeTab === 'pos' && (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-7 bg-slate-50 dark:bg-slate-950 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                              <span>Scanned Items (3)</span>
                              <span className="text-blue-600 dark:text-sky-400 font-mono text-[11px]">Register #01</span>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">Basmati Rice 5kg</div>
                                  <div className="text-[10px] text-slate-500 font-mono">8901234567890 • 1 unit</div>
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white">₹480.00</div>
                              </div>
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">Organic Turmeric 500g</div>
                                  <div className="text-[10px] text-slate-500 font-mono">8904567890123 • 2 units</div>
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white">₹240.00</div>
                              </div>
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">Mustard Oil 1L</div>
                                  <div className="text-[10px] text-slate-500 font-mono">8909876543210 • 1 unit</div>
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white">₹160.00</div>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-5 bg-blue-50/50 dark:bg-blue-950/20 p-3 sm:p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/60 flex flex-col justify-between space-y-3">
                            <div className="space-y-1 text-xs">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-sky-400">
                                Payment Settlement
                              </div>
                              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                                <span>Subtotal</span>
                                <span>₹838.10</span>
                              </div>
                              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                                <span>GST (5%)</span>
                                <span>₹41.90</span>
                              </div>
                              <div className="flex justify-between text-sm font-bold text-slate-950 dark:text-white pt-1.5 border-t border-blue-200 dark:border-blue-800">
                                <span>Grand Total</span>
                                <span className="text-blue-700 dark:text-sky-300">₹880.00</span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="w-full py-2 px-2.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md text-center">
                                Instant UPI QR (₹880)
                              </div>
                              <div className="flex gap-1.5">
                                <div className="flex-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">
                                  Cash (F1)
                                </div>
                                <div className="flex-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">
                                  Khata (F3)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: INVENTORY SCREEN */}
                      {activeTab === 'inventory' && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Catalog SKUs (1,240 Total)</span>
                            <span className="text-sky-600 dark:text-sky-400 font-medium text-[11px]">Automatic FIFO decrements</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Basmati Rice Superior 5kg</div>
                                <div className="text-[10px] text-slate-500">Batch #BT-902 • Expiry Dec 2027</div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-slate-700 dark:text-slate-300">41 units</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  In Stock
                                </span>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Whole Wheat Atta 10kg</div>
                                <div className="text-[10px] text-slate-500">Batch #BT-881 • Expiry Nov 2026</div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">4 units left</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  Low Stock Alert
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: KHATA CRM SCREEN */}
                      {activeTab === 'khata' && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Customer Credit Book (Khata)</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">100% Zero-Paper</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Rahul Deshmukh</div>
                                <div className="text-[10px] text-slate-500">+91 98765 43210 • Regular Customer</div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <div className="text-right">
                                  <div className="font-bold text-rose-600 dark:text-rose-400">₹420.00 Due</div>
                                  <div className="text-[10px] text-slate-400">Limit: ₹5,000</div>
                                </div>
                                <div className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">
                                  WhatsApp Link
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: DASHBOARD SCREEN */}
                      {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-slate-500 text-[10px]">Today’s Gross Revenue</div>
                            <div className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">₹48,920</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.4% vs yday</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-slate-500 text-[10px]">Invoices Completed</div>
                            <div className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">84 Bills</div>
                            <div className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold">Avg ₹582 / bill</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-slate-500 text-[10px]">Gross Profit Margin</div>
                            <div className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">25.4%</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">₹12,425 profit</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-slate-500 text-[10px]">Active Registers</div>
                            <div className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">2 Online</div>
                            <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Cash balanced</div>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: REPORTS & GST SCREEN */}
                      {activeTab === 'reports' && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Statutory Tax & Day-End Summaries</span>
                            <span className="text-blue-600 dark:text-sky-400 font-medium text-[11px]">GSTR-1 Ready</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="text-slate-500 text-[10px]">CGST + SGST</div>
                              <div className="text-sm font-bold text-slate-950 dark:text-white mt-0.5">₹2,329.50</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="text-slate-500 text-[10px]">Shift Z-Report</div>
                              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Balanced</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="text-slate-500 text-[10px]">Portal Export</div>
                              <div className="text-sm font-bold text-blue-600 dark:text-sky-400 mt-0.5">CSV / PDF</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Live Counter Engine
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Sub-0.2s Transaction Latency
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
