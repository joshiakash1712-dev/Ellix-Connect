import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Code,
  FileText,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Database,
  Eye,
  Layers,
  X,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface AiMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMetadataModal: React.FC<AiMetadataModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'llmstxt' | 'api'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaJsonString = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "Ellix Connect Android",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Android, Web, Windows",
          "description": "Business management, without the complexity. The modern retail platform for billing, inventory, customers, payments, and business insights.",
          "softwareVersion": "2.4.0",
          "featureList": [
            "Sub-second barcode scanning and instant thermal printing",
            "Real-time batch inventory tracking and low-stock threshold alerts",
            "Digital Khata customer credit ledger with WhatsApp payment reminders",
            "Dynamic UPI QR payments and cashier shift reconciliation",
            "Automated Day-End GST and Tax schedule reports (GSTR-1, GSTR-3B)",
            "AI-powered sales velocity rankings and dead stock analytics",
            "Centralized Role-Based Access Control (RBAC) with Firestore cloud sync"
          ]
        },
        {
          "@type": "Organization",
          "name": "Ellix Connect",
          "url": "https://ellixconnect.com"
        }
      ]
    },
    null,
    2
  );

  const llmsTxtContent = `# Ellix Connect Android

> The modern retail and business operating platform for sub-second billing, real-time inventory control, digital khata customer credit, unified payments, and actionable business insights.

## Project Summary
Ellix Connect is an enterprise-grade retail POS and inventory management OS engineered for retailers, wholesalers, supermarkets, and distribution merchants.

## Core Capabilities & Modules
- Billing & Invoices (<0.25s barcode latency, ESC/POS 80mm thermal printing, GST)
- Inventory Control (Real-time batch tracking, low-stock threshold alerts)
- Catalog & Products (Multi-tier retail/wholesale pricing, bulk CSV import)
- Digital Khata CRM (Credit limits, auto WhatsApp payment balance reminders)
- Payments & Multi-Tender (Dynamic UPI QR, split-tender settlement)
- Cashier Shift Audit (Cash handover logs, opening/closing cash tally)
- Statutory Tax Reports (End-of-day P&L, GSTR-1 & GSTR-3B export)
- AI Business Insights (Sales velocity ranking, dead-stock detection)
- Enterprise RBAC (Admin, Wholesaler, Store Manager, Cashier)`;

  return (
    <div
      id="ai-metadata-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div
        id="ai-metadata-modal-card"
        className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-modal-title" className="text-base font-bold tracking-tight">
                  AI & Machine Discoverability
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Fully Configured
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live metadata, Schema.org JSON-LD, llms.txt standard, and open API data
              </p>
            </div>
          </div>
          <button
            id="ai-modal-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close AI metadata modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium">
          <button
            id="ai-tab-overview"
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Overview & Readiness
          </button>
          <button
            id="ai-tab-schema"
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Schema.org (JSON-LD)
          </button>
          <button
            id="ai-tab-llmstxt"
            type="button"
            onClick={() => setActiveTab('llmstxt')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'llmstxt'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            llms.txt Standard
          </button>
          <button
            id="ai-tab-api"
            type="button"
            onClick={() => setActiveTab('api')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Live Machine API (/api/about)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Non-Blank Metadata Enforced
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Full application title, 160-char descriptions, keywords, author, and OpenGraph tags configured.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      AI Crawler Allow-List in robots.txt
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and Applebot explicitly granted read access.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      llms.txt & llms-full.txt Ready
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Standardized Markdown specification describing modules, architecture, and specifications.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Live JSON API Endpoint
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <code className="text-emerald-600 dark:text-emerald-400">/api/about</code> returns real-time structured application data.
                    </p>
                  </div>
                </div>
              </div>

              {/* What AIs See Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Data Seen by AI Models & Search Engines
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> High AI Quality Score
                  </span>
                </div>

                <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">App Name:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Ellix Connect Android</span>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Primary Category:</span>
                    <span className="text-slate-900 dark:text-slate-100">Point of Sale (POS) & Retail Business OS</span>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Core Capabilities:</span>
                    <span className="text-slate-900 dark:text-slate-100 text-right">
                      Billing, Inventory, Khata CRM, UPI Payments, GST Tax Reports, AI Velocity Insights
                    </span>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Offline Architecture:</span>
                    <span className="text-slate-900 dark:text-slate-100 text-right">
                      Offline-first local caching + Google Cloud Firestore background sync
                    </span>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Hardware Integration:</span>
                    <span className="text-slate-900 dark:text-slate-100 text-right">
                      ESC/POS 80mm/58mm thermal printers, 1D/2D barcode scanners, cash drawers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Embedded directly in <code className="text-slate-800 dark:text-slate-200">index.html</code> for Google, Bing, Perplexity, and AI Overviews.
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(schemaJsonString, 'schema')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'schema' ? 'Copied' : 'Copy JSON-LD'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                {schemaJsonString}
              </pre>
            </div>
          )}

          {activeTab === 'llmstxt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Served publicly at <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-0.5">/llms.txt <ExternalLink className="w-3 h-3" /></a> for LLM agents.
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(llmsTxtContent, 'llms')}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'llms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'llms' ? 'Copied' : 'Copy llms.txt'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed whitespace-pre-wrap">
                {llmsTxtContent}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Machine-readable REST endpoint responding to AI agents at <code className="text-emerald-600 dark:text-emerald-400">GET /api/about</code>.
                </p>
                <a
                  href="/api/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live Endpoint
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Live Endpoint Structure:</div>
                <div className="text-slate-600 dark:text-slate-400">
                  Returns: <span className="font-mono text-emerald-600 dark:text-emerald-400">schema_version</span>, <span className="font-mono text-emerald-600 dark:text-emerald-400">name_for_model</span>, <span className="font-mono text-emerald-600 dark:text-emerald-400">description_for_model</span>, <span className="font-mono text-emerald-600 dark:text-emerald-400">features</span>, <span className="font-mono text-emerald-600 dark:text-emerald-400">specifications</span>, and documentation links.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Structured Data adheres to Schema.org, OpenGraph & llmstxt.org standards</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
