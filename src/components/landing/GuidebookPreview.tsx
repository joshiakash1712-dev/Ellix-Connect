import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Receipt,
  Boxes,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X,
  Printer,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuideItem {
  id: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  icon: React.ElementType;
  keyTopics: string[];
  docContent: {
    overview: string;
    steps: { title: string; detail: string }[];
    proTip: string;
  };
}

const guides: GuideItem[] = [
  {
    id: 'getting-started',
    category: 'Getting Started',
    readTime: '5 min read',
    title: 'Store Setup & Counter Hardware',
    description: 'A step-by-step walkthrough on configuring your store details, connecting barcode scanners and thermal printers, and setting staff access roles.',
    icon: BookOpen,
    keyTopics: ['USB & Bluetooth scanner pairing', 'Thermal bill printer configuration', 'Role-based cashier permissions'],
    docContent: {
      overview: 'Ellix Connect connects directly with your existing POS peripherals without proprietary drivers or specialized bridge software.',
      steps: [
        {
          title: '1. Store Profile & Tax Initialization',
          detail: 'Navigate to Settings > Business Profile. Enter your legal trade name, GSTIN (optional for unregistered retailers), and store contact address printed on customer receipts.'
        },
        {
          title: '2. Connect Thermal Receipt Printer',
          detail: 'Connect any standard 58mm or 80mm ESC/POS thermal printer via USB or Bluetooth. Ellix Connect natively detects standard print services.'
        },
        {
          title: '3. Test Barcode Scanner',
          detail: 'Plug in any HID USB or 2.4GHz wireless barcode gun. Scan any standard item barcode into the test field to verify automatic return key emulation.'
        }
      ],
      proTip: 'For faster billing, ensure your barcode scanner is configured to send an Enter [CR] suffix after reading.'
    }
  },
  {
    id: 'billing',
    category: 'Billing',
    readTime: '4 min read',
    title: 'Mastering Rapid POS & Digital Billing',
    description: 'How to ring up purchases in under 10 seconds, generate dynamic UPI QR codes, split tenders between cash and card, and share WhatsApp invoices.',
    icon: Receipt,
    keyTopics: ['Keyboard shortcuts [F2 scan, Enter pay]', 'Split payment reconciliation', 'Paperless WhatsApp PDF receipts'],
    docContent: {
      overview: 'The billing terminal is built for high-throughput counters where cashier speed and zero lag are mission-critical.',
      steps: [
        {
          title: '1. Fast Item Lookups & Barcodes',
          detail: 'Press [F2] or click into the scanner field. Scan item barcodes in rapid succession or type item names/SKUs for instant autocomplete.'
        },
        {
          title: '2. Dynamic QR Payment Generation',
          detail: 'When the customer chooses UPI, Ellix Connect renders a dynamic NPCI-compliant QR code with the exact bill amount locked, eliminating manual typing errors.'
        },
        {
          title: '3. Instant Invoice Dispatch',
          detail: 'Collect customer mobile number during or after billing. Click WhatsApp Bill to dispatch an eco-friendly PDF tax invoice automatically.'
        }
      ],
      proTip: 'Press the spacebar to open the payment drawer immediately once all items are scanned.'
    }
  },
  {
    id: 'inventory',
    category: 'Inventory',
    readTime: '6 min read',
    title: 'Real-Time Stock & Batch Management',
    description: 'How to organize products into categories, manage batch expiry dates, set automatic low-stock reorder thresholds, and generate restock drafts.',
    icon: Boxes,
    keyTopics: ['Batch & expiry date tracking', 'Automated restock threshold alerts', 'Wholesale supplier purchase orders'],
    docContent: {
      overview: 'Eliminate stock-outs and inventory shrinkage with live stock counts that auto-deduct with every counter receipt.',
      steps: [
        {
          title: '1. Catalog Organization & Bundles',
          detail: 'Group items by Department and Category. Define individual units (Pcs, Kg, Box, Pack) with accurate conversion ratios.'
        },
        {
          title: '2. Low-Stock Safety Buffers',
          detail: 'Set minimum safety stock thresholds. When items drop below buffer levels, they automatically surface on your Daily Restock Purchase Sheet.'
        },
        {
          title: '3. Batch Expiry Management',
          detail: 'Assign batch numbers and expiry months during Goods Inward. The system applies First-Expired, First-Out (FEFO) logic at POS.'
        }
      ],
      proTip: 'Schedule automated inventory audits for high-value items twice a month using the built-in Cycle Count tool.'
    }
  },
  {
    id: 'customers',
    category: 'Customers',
    readTime: '4 min read',
    title: 'Customer Khata & Loyalty Retention',
    description: 'How to maintain tamper-proof customer credit books, record partial repayments, reward repeat buyers with loyalty points, and send gentle SMS reminders.',
    icon: Users,
    keyTopics: ['Digital Khata credit balancing', 'Automated WhatsApp payment links', 'Loyalty point earning and redemption'],
    docContent: {
      overview: 'Strengthen customer trust with transparent digital credit ledgers and reward programs that turn first-time shoppers into regulars.',
      steps: [
        {
          title: '1. Opening a Customer Khata Ledger',
          detail: 'Select Credit / Khata at checkout. Assign credit limits per customer and record authorized signatures or PIN confirmations.'
        },
        {
          title: '2. Recording Repayments',
          detail: 'When a customer deposits cash or sends UPI, record the repayment against specific bills or overall outstanding balance with instant receipt dispatch.'
        },
        {
          title: '3. Automated Friendly Reminders',
          detail: 'Send polite WhatsApp payment reminders with one tap, including a breakdown of purchases and a secure UPI deep-link.'
        }
      ],
      proTip: 'Loyalty points can be configured to auto-apply as instant cash discounts once a customer passes 100 points.'
    }
  }
];

export const GuidebookPreview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGuideModal, setActiveGuideModal] = useState<GuideItem | null>(null);

  const categories = ['All', 'Getting Started', 'Billing', 'Inventory', 'Customers'];

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.keyTopics.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="guide" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md mb-3 border border-emerald-200/60 dark:border-emerald-800/60">
            Ellix Guidebook
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Learn Ellix Connect, step by step.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We believe business software should be intuitive. Search topics below or select any guide to view the full interactive walkthrough.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                data-cursor="hover"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              data-cursor="hover"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides or topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors hover:border-emerald-500/40"
            />
          </div>
        </div>

        {/* Guidebook Cards Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">No guides matching your search</div>
            <div className="text-xs text-slate-500 mt-1">Try searching for "POS", "barcode", "tax", or reset category filters.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <div
                  key={guide.id}
                  id={`guide-card-${guide.id}`}
                  data-cursor="card"
                  onClick={() => setActiveGuideModal(guide)}
                  className="website-card-hover group p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top Bar: Icon + Read Time */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-center group-hover:bg-slate-900 dark:group-hover:bg-slate-800 group-hover:text-emerald-400 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{guide.readTime}</span>
                      </span>
                    </div>

                    {/* Category & Title */}
                    <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      {guide.category}
                    </div>
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {guide.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {guide.description}
                    </p>
                  </div>

                  {/* Key Topics Covered */}
                  <div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 mb-4">
                      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Key Topics Covered:
                      </div>
                      {guide.keyTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <FileCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
                      <span>Read full documentation</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Illustrated Callout Card */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Looking for printable staff onboarding cheat-sheets?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Download one-page keyboard shortcut templates and cashier daily opening/closing checklists.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveGuideModal(guides[0])}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shrink-0"
          >
            <span>Explore Onboarding Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Guide Preview Modal (Requirement #9) */}
      {activeGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveGuideModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                    {activeGuideModal.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeGuideModal.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  {activeGuideModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {activeGuideModal.docContent.overview}
              </p>

              <div className="space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Implementation Steps</div>
                {activeGuideModal.docContent.steps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {step.title}
                    </div>
                    <div className="leading-relaxed">
                      {step.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip Box */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pro Tip: </span>
                  <span>{activeGuideModal.docContent.proTip}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Ellix Connect Official Documentation</span>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
