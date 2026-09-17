import React from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Clock
} from 'lucide-react';

interface HeroSectionProps {
  onOpenGetStarted?: () => void;
  onLaunchApp?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenGetStarted, onLaunchApp }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 transition-colors">
      
      {/* Subtle Background Structural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 dark:opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Copy & Headlines */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Business management, without the complexity</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12]">
            Run your business. <br className="hidden sm:inline" />
            <span className="text-slate-900 dark:text-slate-200">Without the complexity.</span>
          </h1>

          {/* Supporting Explanatory Paragraph */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Ellix Connect brings billing, inventory, customers, payments, transactions, and business insights together into one connected platform built specifically for local retailers and growing merchants.
          </p>

          {/* Static CTA Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="btn-hero-getstarted"
              type="button"
              onClick={onOpenGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 dark:text-emerald-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              id="btn-hero-seehowitworks"
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 text-slate-800 dark:text-slate-200 text-base font-semibold border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Value Props */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> No complex setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Works on any device
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Offline resilient
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Instant digital bills
            </span>
          </div>

        </div>

        {/* Polished Visual Application Mockup */}
        <div className="mt-12 sm:mt-16 relative mx-auto max-w-5xl">
          
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 opacity-80 blur-lg -z-10" />

          {/* App Window Frame */}
          <div className="rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-colors">
            
            {/* macOS / SaaS Window Header */}
            <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-2 hidden sm:block" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Ellix Connect · Central Retail Store
                </span>
              </div>

              {/* Mock Address / Status Bar */}
              <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>app.ellixconnect.com/live-register</span>
              </div>

              {/* Status Indicator & Interactive Launch Button */}
              <div className="flex items-center gap-2">
                {onLaunchApp && (
                  <button
                    id="btn-hero-try-live-console"
                    type="button"
                    onClick={onLaunchApp}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
                  >
                    <span>Launch Live App</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                  <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Live Connected</span>
                </div>
              </div>
            </div>

            {/* Inner Dashboard & POS Workspace Mockup */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 space-y-5">
              
              {/* Top Quick Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Today's Sales</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">₹42,850</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">+16.4% from yesterday</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Invoices Issued</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">38</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Avg. ₹1,127 / bill</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Inventory Health</span>
                    <Package className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">99.2%</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">2 items low on stock</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Cash in Drawer</span>
                    <CreditCard className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">₹14,600</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Reconciled & balanced</div>
                </div>

              </div>

              {/* Main Workstage Split: Active Billing POS + Live Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left: Active Billing Terminal (7 Cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                          Live Counter · POS Invoice #1042
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Just now
                      </span>
                    </div>

                    {/* Customer Info Chip */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 mb-3 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">Rajesh Verma</span>
                          <span className="text-slate-500 dark:text-slate-400 ml-1.5">(+91 98450 11223)</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        120 Loyalty Pts
                      </span>
                    </div>

                    {/* Itemized Cart List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50/70 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Royal Basmati Rice 5kg</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">SKU: GRO-8821 · GST 5%</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-white">₹540.00</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">1 unit</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50/70 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Cold Pressed Groundnut Oil 1L</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">SKU: OIL-4102 · GST 5%</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-white">₹320.00</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">1 unit</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50/70 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Organic Roasted Almonds 250g</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">SKU: NUT-0914 · GST 12%</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-white">₹260.00</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">1 unit</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill Total & Instant Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Grand Total (Incl. GST)</span>
                      <span className="text-lg font-bold text-slate-950 dark:text-white">₹1,120.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="py-2 px-1 text-center font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
                        ✓ UPI QR Paid
                      </div>
                      <div className="py-2 px-1 text-center font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                        WhatsApp Sent
                      </div>
                      <div className="py-2 px-1 text-center font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                        Stock Deducted
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Connected System Flow Stream (5 Cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        Connected Sync Engine
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        0.04s latency
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      One counter checkout automatically updates every corner of your business:
                    </p>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Inventory Level Updated</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Groundnut Oil: 14 → 13 units remaining</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Customer History Synced</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">₹1,120 added to Rajesh's lifetime ledger</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Accounting & Tax Recorded</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">CGST ₹26.50 + SGST ₹26.50 entered in GST report</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Cloud Backup: Synced 2s ago</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Data Integrity</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

