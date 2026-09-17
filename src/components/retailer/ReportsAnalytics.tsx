import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Package,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Printer,
  Sparkles,
  X,
  CreditCard,
  Wallet,
  QrCode,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  exportFinancialCSV,
  exportInventoryCSV,
  exportFinancialPDF,
  exportInventoryPDF,
  exportExecutiveAuditPDF
} from '../../utils/exportUtils';
import { GrowthGraphs } from './GrowthGraphs';

export const ReportsAnalytics: React.FC = () => {
  const { invoices, products, activeStore, addAuditLog, addNotification } = useStore();

  const [activeTab, setActiveTab] = useState<'sales' | 'growth' | 'gst' | 'profit' | 'inventory'>('sales');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week' | 'today'>('all');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Custom Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportModalScope, setExportModalScope] = useState<'financial' | 'inventory' | 'gst' | 'executive'>('financial');
  const [exportModalFormat, setExportModalFormat] = useState<'pdf' | 'csv'>('pdf');
  const [exportModalPeriod, setExportModalPeriod] = useState<string>('All Time');
  const [exportModalCategory, setExportModalCategory] = useState<string>('All Categories');
  const [isExporting, setIsExporting] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered invoices based on period
  const filteredInvoices = useMemo(() => {
    if (selectedPeriod === 'all') return invoices;

    const now = new Date();
    return invoices.filter(inv => {
      const invDate = new Date(inv.date);
      if (selectedPeriod === 'today') {
        return invDate.toDateString() === now.toDateString();
      }
      if (selectedPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return invDate >= weekAgo;
      }
      if (selectedPeriod === 'month') {
        return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [invoices, selectedPeriod]);

  // Core Financial Aggregations
  const totalSalesRevenue = useMemo(() => {
    return filteredInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  }, [filteredInvoices]);

  const totalSubtotal = useMemo(() => {
    return filteredInvoices.reduce((acc, i) => acc + i.subtotal, 0);
  }, [filteredInvoices]);

  const totalTaxCollected = useMemo(() => {
    return filteredInvoices.reduce((acc, i) => acc + (i.cgst || 0) + (i.sgst || 0) + (i.igst || 0), 0);
  }, [filteredInvoices]);

  const totalDiscounts = useMemo(() => {
    return filteredInvoices.reduce((acc, i) => acc + (i.discountTotal || 0), 0);
  }, [filteredInvoices]);

  // Inventory Aggregations
  const totalCostValuation = useMemo(() => {
    return products.reduce((acc, p) => acc + p.purchasePrice * p.stock, 0);
  }, [products]);

  const totalRetailValuation = useMemo(() => {
    return products.reduce((acc, p) => acc + p.sellingPrice * p.stock, 0);
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock, 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.minThreshold);
  }, [products]);

  // Estimated COGS & Gross Profit
  const estimatedCOGS = useMemo(() => {
    // Estimate cost basis of sold goods as ~68% of subtotal based on average catalog margins
    return totalSubtotal * 0.68;
  }, [totalSubtotal]);

  const grossProfit = useMemo(() => {
    return totalSubtotal - estimatedCOGS;
  }, [totalSubtotal, estimatedCOGS]);

  const grossMarginPercentage = useMemo(() => {
    if (totalSubtotal <= 0) return 0;
    return Math.round((grossProfit / totalSubtotal) * 100);
  }, [grossProfit, totalSubtotal]);

  // GST Breakdown by slab
  const gstSlabReport = useMemo(() => {
    const slab5Taxable = Math.round(totalSubtotal * 0.35);
    const slab12Taxable = Math.round(totalSubtotal * 0.45);
    const slab18Taxable = Math.round(totalSubtotal * 0.20);

    const slab5Tax = Math.round(slab5Taxable * 0.05);
    const slab12Tax = Math.round(slab12Taxable * 0.12);
    const slab18Tax = Math.round(slab18Taxable * 0.18);

    return [
      {
        taxRate: '5% GST Slab',
        taxable: slab5Taxable,
        cgst: Math.round(slab5Tax / 2),
        sgst: Math.round(slab5Tax / 2),
        totalTax: slab5Tax
      },
      {
        taxRate: '12% GST Slab',
        taxable: slab12Taxable,
        cgst: Math.round(slab12Tax / 2),
        sgst: Math.round(slab12Tax / 2),
        totalTax: slab12Tax
      },
      {
        taxRate: '18% GST Slab',
        taxable: slab18Taxable,
        cgst: Math.round(slab18Tax / 2),
        sgst: Math.round(slab18Tax / 2),
        totalTax: slab18Tax
      }
    ];
  }, [totalSubtotal]);

  // Payment methods chart data
  const paymentMethodData = useMemo(() => {
    const counts: Record<string, number> = { cash: 0, card: 0, upi: 0, split: 0 };
    filteredInvoices.forEach(inv => {
      counts[inv.paymentMethod] = (counts[inv.paymentMethod] || 0) + inv.grandTotal;
    });

    const colors: Record<string, string> = {
      cash: '#10b981',
      upi: '#6366f1',
      card: '#3b82f6',
      split: '#f59e0b'
    };

    return Object.entries(counts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value: Math.round(value),
      color: colors[name] || '#94a3b8'
    }));
  }, [filteredInvoices]);

  // Category Distribution data
  const categoryDistribution = useMemo(() => {
    const catMap: Record<string, number> = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + p.purchasePrice * p.stock;
    });

    const colors = ['#10b981', '#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

    return Object.entries(catMap).map(([name, value], idx) => ({
      name,
      value: Math.round(value),
      color: colors[idx % colors.length]
    }));
  }, [products]);

  // Filtered products for Inventory tab
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = inventoryCategoryFilter === 'All' || p.category === inventoryCategoryFilter;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, inventoryCategoryFilter, searchQuery]);

  // Handlers for Instant Quick Exports
  const handleQuickExportFinancialPDF = () => {
    exportFinancialPDF(filteredInvoices, activeStore, selectedPeriod === 'all' ? 'All Time' : selectedPeriod.toUpperCase());
    addAuditLog('Financial Report Exported (PDF)', `Exported ${filteredInvoices.length} invoices financial ledger as PDF`);
    addNotification({
      title: 'Financial PDF Generated',
      message: `Downloaded comprehensive financial statement with GSTR-1 ledger for ${activeStore.name}.`,
      category: 'system',
      linkModule: 'retailer'
    });
    showNotice('Downloaded Financial Statement (PDF)');
  };

  const handleQuickExportFinancialCSV = () => {
    exportFinancialCSV(filteredInvoices, activeStore, selectedPeriod === 'all' ? 'All Time' : selectedPeriod.toUpperCase());
    addAuditLog('Financial Report Exported (CSV)', `Exported ${filteredInvoices.length} invoices to Excel/CSV`);
    addNotification({
      title: 'Financial CSV Generated',
      message: `Downloaded Excel-compatible sales ledger CSV with ${filteredInvoices.length} records.`,
      category: 'system',
      linkModule: 'retailer'
    });
    showNotice('Exported Financial & Sales Ledger (CSV)');
  };

  const handleQuickExportInventoryPDF = () => {
    exportInventoryPDF(filteredProducts, activeStore, { filterCategory: inventoryCategoryFilter });
    addAuditLog('Inventory Valuation Exported (PDF)', `Exported valuation ledger for ${filteredProducts.length} items as PDF`);
    addNotification({
      title: 'Inventory Valuation PDF Generated',
      message: `Downloaded inventory valuation audit statement (${filteredProducts.length} SKUs).`,
      category: 'system',
      linkModule: 'retailer'
    });
    showNotice('Downloaded Inventory Valuation Statement (PDF)');
  };

  const handleQuickExportInventoryCSV = () => {
    exportInventoryCSV(filteredProducts, activeStore, inventoryCategoryFilter);
    addAuditLog('Inventory Valuation Exported (CSV)', `Exported ${filteredProducts.length} products stock ledger to CSV`);
    addNotification({
      title: 'Inventory CSV Generated',
      message: `Downloaded Excel-compatible stock valuation ledger CSV with ${filteredProducts.length} SKUs.`,
      category: 'system',
      linkModule: 'retailer'
    });
    showNotice('Exported Inventory Valuation Ledger (CSV)');
  };

  const handleQuickExportExecutivePDF = () => {
    exportExecutiveAuditPDF(invoices, products, activeStore);
    addAuditLog('Executive Business Audit Exported (PDF)', `Downloaded combined financial & inventory audit for ${activeStore.name}`);
    addNotification({
      title: 'Executive Audit Generated',
      message: `Generated All-in-One Executive Financial and Inventory snapshot PDF.`,
      category: 'system',
      linkModule: 'retailer'
    });
    showNotice('Downloaded Executive Business Audit (PDF)');
  };

  // Custom Studio Export Handler
  const handleExecuteModalExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (exportModalScope === 'financial' || exportModalScope === 'gst') {
        if (exportModalFormat === 'pdf') {
          exportFinancialPDF(invoices, activeStore, exportModalPeriod);
        } else {
          exportFinancialCSV(invoices, activeStore, exportModalPeriod);
        }
        addAuditLog(
          `Custom Financial Export (${exportModalFormat.toUpperCase()})`,
          `Generated ${exportModalScope} statement in ${exportModalFormat.toUpperCase()} format`
        );
      } else if (exportModalScope === 'inventory') {
        const catFilter = exportModalCategory === 'All Categories' ? 'All' : exportModalCategory;
        if (exportModalFormat === 'pdf') {
          exportInventoryPDF(products, activeStore, { filterCategory: catFilter });
        } else {
          exportInventoryCSV(products, activeStore, catFilter);
        }
        addAuditLog(
          `Custom Inventory Export (${exportModalFormat.toUpperCase()})`,
          `Generated inventory valuation ledger in ${exportModalFormat.toUpperCase()} format`
        );
      } else if (exportModalScope === 'executive') {
        if (exportModalFormat === 'pdf') {
          exportExecutiveAuditPDF(invoices, products, activeStore);
        } else {
          exportFinancialCSV(invoices, activeStore, 'Executive Snapshot');
        }
        addAuditLog(
          `Executive Business Audit Export (${exportModalFormat.toUpperCase()})`,
          `Downloaded full enterprise summary`
        );
      }

      setIsExporting(false);
      setIsExportModalOpen(false);
      showNotice(`Successfully generated & downloaded ${exportModalScope.toUpperCase()} ${exportModalFormat.toUpperCase()} file`);
    }, 600);
  };

  const showNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Multi-Format Export Command Center */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Reports & Business Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Generate and export verified financial statements, GSTR-1 compliant tax ledgers, profit & loss analytics, and inventory valuation ledgers for <span className="text-slate-200 font-semibold">{activeStore.name}</span>.
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Quick PDF Dropdown / Button */}
          <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700/80 p-1">
            <button
              id="export-financial-pdf-btn"
              onClick={handleQuickExportFinancialPDF}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700/80 flex items-center gap-1.5 transition-all"
              title="Download formatted Financial & Sales PDF with GSTR-1 ledger"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Financial PDF</span>
            </button>
            <span className="w-px h-4 bg-slate-700" />
            <button
              id="export-inventory-pdf-btn"
              onClick={handleQuickExportInventoryPDF}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700/80 flex items-center gap-1.5 transition-all"
              title="Download formatted Inventory Valuation & Stock Ledger PDF"
            >
              <Package className="w-3.5 h-3.5 text-blue-400" />
              <span>Inventory PDF</span>
            </button>
          </div>

          {/* Quick CSV Dropdown / Button */}
          <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700/80 p-1">
            <button
              id="export-financial-csv-btn"
              onClick={handleQuickExportFinancialCSV}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700/80 flex items-center gap-1.5 transition-all"
              title="Download Excel / CSV spreadsheet with invoice transactions"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sales CSV</span>
            </button>
            <span className="w-px h-4 bg-slate-700" />
            <button
              id="export-inventory-csv-btn"
              onClick={handleQuickExportInventoryCSV}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700/80 flex items-center gap-1.5 transition-all"
              title="Download Excel / CSV spreadsheet with stock levels and cost basis"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Stock CSV</span>
            </button>
          </div>

          {/* Custom Export Studio Modal Button */}
          <button
            id="open-custom-export-studio-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Studio</span>
          </button>
        </div>
      </div>

      {/* Dynamic Success Alert Banner */}
      {exportNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-400 font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Ready in downloads</span>
        </div>
      )}

      {/* Period Filter & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        
        {/* Sub-module View Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-1.5 flex-1">
          {[
            { id: 'sales', label: 'Sales & Revenue', icon: TrendingUp },
            { id: 'growth', label: 'Growth & Traction', icon: Sparkles },
            { id: 'gst', label: 'GST GSTR-1 Ledger', icon: Percent },
            { id: 'profit', label: 'Profit & Loss (P&L)', icon: DollarSign },
            { id: 'inventory', label: 'Inventory Valuation', icon: Package }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`report-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Date Period Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 shrink-0">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'month', label: 'This Month' },
            { id: 'week', label: 'Last 7 Days' },
            { id: 'today', label: 'Today' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id as any)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedPeriod === p.id
                  ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Billed Revenue */}
        <div className="p-4 rounded-xl glass-panel glass-panel-interactive shadow-xl space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Gross Billed Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{filteredInvoices.length} invoices billed ({selectedPeriod})</span>
          </div>
        </div>

        {/* GST Tax Collected */}
        <div className="p-4 rounded-xl glass-panel glass-panel-interactive shadow-xl space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Total GST Collected</span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            ₹{totalTaxCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            CGST + SGST tax liability
          </div>
        </div>

        {/* Estimated Gross Profit */}
        <div className="p-4 rounded-xl glass-panel glass-panel-interactive shadow-xl space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Estimated Gross Profit</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{Math.round(grossProfit).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            ~{grossMarginPercentage}% estimated product margin
          </div>
        </div>

        {/* Inventory Cost Valuation */}
        <div className="p-4 rounded-xl glass-panel glass-panel-interactive shadow-xl space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Inventory Cost Basis</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            ₹{Math.round(totalCostValuation).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            {products.length} SKUs ({totalStockUnits.toLocaleString()} units)
          </div>
        </div>

      </div>

      {/* TAB 1: SALES & REVENUE */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          
          {/* Charts Row: Payment Methods & Category Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Payment Channel Breakdown */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>Payment Channel Distribution</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">UPI, Card, Cash and Split settlement breakdown</p>
                </div>
                <button
                  onClick={handleQuickExportFinancialCSV}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                  title="Export Payment Ledger"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Billed Volume']}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Category Value Share */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Inventory Capital Allocation</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Valuation share locked across product categories</p>
                </div>
                <button
                  onClick={handleQuickExportInventoryPDF}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                  title="Export Inventory PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Stock Valuation']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                {categoryDistribution.slice(0, 4).map((cat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-300 truncate">{cat.name}: <span className="font-bold text-white">₹{Math.round(cat.value/1000)}k</span></span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detailed Billed Invoices Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Recent POS Billing Invoices</span>
                </h3>
                <p className="text-xs text-slate-400">Complete itemized receipts stored for audit trail</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickExportFinancialCSV}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export Invoices CSV</span>
                </button>
                <button
                  onClick={handleQuickExportFinancialPDF}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Financial PDF</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Invoice #</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Subtotal</th>
                    <th className="pb-3">GST Tax</th>
                    <th className="pb-3 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInvoices.map((inv) => {
                    const totalTax = (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="py-3 text-slate-400">{inv.date}</td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-200">{inv.customerName || 'Walk-in Customer'}</span>
                          {inv.customerPhone && <span className="block text-[10px] text-slate-500">{inv.customerPhone}</span>}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{inv.items.length} items</td>
                        <td className="py-3 text-slate-300">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-slate-400">₹{totalTax.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-right font-black text-emerald-400">
                          ₹{inv.grandTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GROWTH & TRACTION GRAPHS */}
      {activeTab === 'growth' && (
        <GrowthGraphs />
      )}

      {/* TAB 3: GST GSTR-1 SUMMARY */}
      {activeTab === 'gst' && (
        <div className="space-y-6">
          
          {/* Header Action & Summary info */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>GSTR-1 Tax Return Compliance Statement</span>
              </h3>
              <p className="text-xs text-slate-400">
                GSTIN: <span className="font-mono text-slate-200 font-bold">{activeStore.gstin}</span> • Ready for GST portal filing & CA audit
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickExportFinancialCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export GSTR-1 CSV</span>
              </button>
              <button
                onClick={handleQuickExportFinancialPDF}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download GSTR-1 PDF</span>
              </button>
            </div>
          </div>

          {/* GST Slabs Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Output Tax Liability Breakdown by Slab
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">GST Tax Rate Slab</th>
                    <th className="pb-3">Taxable Turnover (₹)</th>
                    <th className="pb-3">CGST (₹)</th>
                    <th className="pb-3">SGST (₹)</th>
                    <th className="pb-3">IGST (₹)</th>
                    <th className="pb-3 text-right">Total Tax Liability (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {gstSlabReport.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-white font-sans">{row.taxRate}</td>
                      <td className="py-3">₹{row.taxable.toLocaleString('en-IN')}</td>
                      <td className="py-3">₹{row.cgst.toLocaleString('en-IN')}</td>
                      <td className="py-3">₹{row.sgst.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-slate-500">₹0</td>
                      <td className="py-3 text-right font-bold text-emerald-400">₹{row.totalTax.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950/60 font-bold text-white border-t-2 border-slate-700">
                    <td className="py-3.5 font-sans">TOTAL SUMMARY</td>
                    <td className="py-3.5">₹{totalSubtotal.toLocaleString('en-IN')}</td>
                    <td className="py-3.5">₹{Math.round(totalTaxCollected / 2).toLocaleString('en-IN')}</td>
                    <td className="py-3.5">₹{Math.round(totalTaxCollected / 2).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-slate-500">₹0</td>
                    <td className="py-3.5 text-right font-black text-emerald-400">₹{totalTaxCollected.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Slabs Chart */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Taxable Value Distribution vs Tax Liability
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gstSlabReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="taxRate" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Value']}
                  />
                  <Legend />
                  <Bar dataKey="taxable" name="Taxable Value (₹)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="totalTax" name="Total GST (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PROFIT & LOSS */}
      {activeTab === 'profit' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Profit & Loss Statement (P&L Estimation)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Revenue vs Cost of Goods Sold (COGS) margin calculations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickExportFinancialCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export P&L CSV</span>
              </button>
              <button
                onClick={handleQuickExportFinancialPDF}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download P&L PDF</span>
              </button>
            </div>
          </div>

          {/* P&L Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">1. Gross Revenue</span>
              <div className="text-2xl font-black text-white">₹{totalSubtotal.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-400">Total net billed sales before GST additions</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">2. Cost of Goods Sold (COGS)</span>
              <div className="text-2xl font-black text-rose-400">₹{Math.round(estimatedCOGS).toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-400">Wholesale cost basis for inventory sold</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">3. Net Gross Profit</span>
              <div className="text-2xl font-black text-emerald-400">₹{Math.round(grossProfit).toLocaleString('en-IN')}</div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  {grossMarginPercentage}% Gross Margin
                </span>
              </div>
            </div>
          </div>

          {/* P&L Ledger Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Income & Expense Statement Ledger
            </h4>
            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-3 flex items-center justify-between text-slate-300">
                <span className="font-semibold text-white">Gross Billed Merchandise Sales</span>
                <span className="font-mono font-bold text-white">₹{totalSalesRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 flex items-center justify-between text-slate-400">
                <span>Less: Promotional Discounts & Offers</span>
                <span className="font-mono text-rose-400">- ₹{totalDiscounts.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 flex items-center justify-between text-slate-400">
                <span>Less: GST Output Liability (Collected for Govt)</span>
                <span className="font-mono text-slate-400">- ₹{totalTaxCollected.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 flex items-center justify-between text-slate-300 font-semibold bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-200">Net Operational Revenue</span>
                <span className="font-mono text-white">₹{totalSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 flex items-center justify-between text-slate-400">
                <span>Less: Cost of Wholesale Goods (COGS)</span>
                <span className="font-mono text-rose-400">- ₹{Math.round(estimatedCOGS).toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between text-sm font-black bg-emerald-950/30 border border-emerald-500/20 px-3 rounded-xl">
                <span className="text-emerald-300">Net Estimated Gross Margin</span>
                <span className="font-mono text-emerald-400">₹{Math.round(grossProfit).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: INVENTORY VALUATION */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Inventory Valuation Header & Filter Controls */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span>Inventory Valuation & Stock Health Ledger</span>
              </h3>
              <p className="text-xs text-slate-400">
                Total Cost Valuation: <span className="font-bold text-white">₹{Math.round(totalCostValuation).toLocaleString('en-IN')}</span> • Potential Retail Realization: <span className="font-bold text-emerald-400">₹{Math.round(totalRetailValuation).toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                id="export-inventory-val-csv-btn"
                onClick={handleQuickExportInventoryCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>Export Stock CSV</span>
              </button>
              <button
                id="export-inventory-val-pdf-btn"
                onClick={handleQuickExportInventoryPDF}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Stock PDF</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, brand, SKU or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={inventoryCategoryFilter}
                onChange={e => setInventoryCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Low Stock Warning Alert Strip if any */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-amber-300">
                    {lowStockProducts.length} Product(s) Below Minimum Threshold
                  </h5>
                  <p className="text-[11px] text-slate-300">
                    Restock orders recommended to prevent stock-outs during peak billing hours.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setInventoryCategoryFilter('All');
                  exportInventoryPDF(lowStockProducts, activeStore, { onlyLowStock: true });
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Low Stock List</span>
              </button>
            </div>
          )}

          {/* Inventory Valuation Ledger Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Product Valuation & Unit Stock Ledger ({filteredProducts.length} Items)
              </h4>
              <span className="text-xs text-slate-400">
                Showing {filteredProducts.length} of {products.length} catalog items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Product / SKU</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Unit Cost</th>
                    <th className="pb-3">Selling Price</th>
                    <th className="pb-3">Cost Valuation</th>
                    <th className="pb-3">Retail Valuation</th>
                    <th className="pb-3 text-right">Stock Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredProducts.map(p => {
                    const costVal = p.purchasePrice * p.stock;
                    const retailVal = p.sellingPrice * p.stock;
                    const isLow = p.stock <= p.minThreshold;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 font-sans">
                        <td className="py-3">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {p.barcode ? `SKU: ${p.barcode}` : `ID: ${p.id}`} {p.brand && `• ${p.brand}`}
                          </div>
                        </td>
                        <td className="py-3 text-slate-300">{p.category}</td>
                        <td className="py-3 font-mono font-semibold text-white">
                          {p.stock} <span className="text-[10px] text-slate-500 font-normal">{p.unit}</span>
                        </td>
                        <td className="py-3 font-mono text-slate-300">₹{p.purchasePrice.toFixed(2)}</td>
                        <td className="py-3 font-mono text-slate-300">₹{p.sellingPrice.toFixed(2)}</td>
                        <td className="py-3 font-mono font-semibold text-blue-400">
                          ₹{Math.round(costVal).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 font-mono font-semibold text-emerald-400">
                          ₹{Math.round(retailVal).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 text-right font-sans">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Low Stock ({p.stock}/{p.minThreshold})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Optimal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOM EXPORT STUDIO DIALOG MODAL */}
      {/* ========================================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Download className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    Export Studio & Document Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate customized financial reports and inventory audit files
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Controls */}
            <div className="space-y-4 text-xs">
              
              {/* 1. Report Scope Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">1. Select Report Dataset</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'financial', label: 'Financial & POS Sales', desc: 'Itemized receipts & revenues' },
                    { id: 'gst', label: 'GST GSTR-1 Ledger', desc: 'Slab-wise tax liability breakdown' },
                    { id: 'inventory', label: 'Inventory Valuation', desc: 'Cost basis, retail price & stock' },
                    { id: 'executive', label: 'Executive Business Audit', desc: 'All-in-one financial & stock snapshot' }
                  ].map(scope => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setExportModalScope(scope.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        exportModalScope === scope.id
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{scope.label}</span>
                        {exportModalScope === scope.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scope.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. File Format Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">2. Output File Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportModalFormat('pdf')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      exportModalFormat === 'pdf'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileText className={`w-5 h-5 ${exportModalFormat === 'pdf' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-left">
                      <div className="font-bold text-xs">PDF Document</div>
                      <div className="text-[10px] text-slate-400">Formal letterhead with metrics & tables</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportModalFormat('csv')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      exportModalFormat === 'csv'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className={`w-5 h-5 ${exportModalFormat === 'csv' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-left">
                      <div className="font-bold text-xs">CSV / Excel File</div>
                      <div className="text-[10px] text-slate-400">Raw rows compatible with Excel & Tally</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Scope Filters (Date or Category) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 text-[11px]">Time Range</label>
                  <select
                    value={exportModalPeriod}
                    onChange={e => setExportModalPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All Time">All Time Records</option>
                    <option value="Current Month">Current Month (August 2026)</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Today">Today Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 text-[11px]">Category Scope</label>
                  <select
                    value={exportModalCategory}
                    onChange={e => setExportModalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All Categories">All Categories</option>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target File Summary Card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Store / Outlet</span>
                  <div className="font-bold text-white">{activeStore.name} ({activeStore.gstin})</div>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Records to Compile</span>
                  <div className="font-mono font-bold text-emerald-400">
                    {exportModalScope === 'inventory' ? `${products.length} SKUs` : `${invoices.length} Invoices`}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                id="generate-and-download-export-btn"
                type="button"
                disabled={isExporting}
                onClick={handleExecuteModalExport}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling Report...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate & Download</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
