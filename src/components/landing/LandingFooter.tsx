import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { EllixConnectLogo } from '../branding/EllixConnectLogo';

interface LandingFooterProps {
  onOpenSignIn?: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAiMetadata?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenSignIn,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAiMetadata
}) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Tagline (2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <EllixConnectLogo size="sm" alt="Ellix Connect Official Logo" />
            </div>

            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed text-sm">
              Business management, without the complexity. The modern retail platform for billing, inventory, customers, payments, and business insights.
            </p>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Designed for local retailers, supermarkets & wholesalers.</span>
            </div>
          </div>

          {/* Col 2: Product & Features */}
          <div className="space-y-3">
            <div className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
              Product
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#product" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Product Overview
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Billing & Invoices
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Inventory Management
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Customers & Khata
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Reports & Tax Sheets
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Features & Workflow */}
          <div className="space-y-3">
            <div className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
              Features
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Connected Workflow
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Dynamic UPI QR
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Offline Sync Architecture
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Support */}
          <div className="space-y-3">
            <div className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
              Resources
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#guide" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  Guide & Tutorials
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: AI & Machine Data */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
              <span>AI & Machine Data</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAiMetadata}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors text-left flex items-center gap-1"
                >
                  <span>AI Data Inspector</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 rounded">Live</span>
                </button>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>llms.txt (AI Spec)</span>
                </a>
              </li>
              <li>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  llms-full.txt (Reference)
                </a>
              </li>
              <li>
                <a
                  href="/api/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  /api/about (JSON API)
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  sitemap.xml
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Status Row */}
        <div className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Ellix Connect Inc. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              data-cursor="hover"
              onClick={onOpenAiMetadata}
              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>AI & Crawlers Ready</span>
            </button>
            <button
              type="button"
              data-cursor="hover"
              onClick={onOpenPrivacy}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              data-cursor="hover"
              onClick={onOpenTerms}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              data-cursor="hover"
              onClick={onOpenContact}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
