import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Moon,
  Sun,
  Monitor,
  Check,
  Sparkles,
  Sliders,
  Database,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Palette,
  Eye,
  Zap,
  Info,
  Bot,
  ExternalLink,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    toggleTheme,
    products,
    invoices,
    customers,
    activeStore,
    resetToDefaultData
  } = useStore();

  const [activeSettingsTab, setActiveSettingsTab] = React.useState<'appearance' | 'data' | 'about'>('appearance');
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 animate-in fade-in duration-200"
    >
      <motion.div
        id="settings-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] glass-panel relative transition-colors ${
          theme === 'light'
            ? 'text-slate-900'
            : 'text-slate-100'
        }`}
      >
        {/* Subtle brand gradient backdrop BEHIND the glass modal */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600/15 via-slate-900/60 to-teal-600/15 pointer-events-none" />

        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between transition-colors ${
            theme === 'light' ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>System Settings</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    theme === 'light'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  Preferences
                </span>
              </h2>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                Theme, display contrast, storage & environment preferences
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'light'
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className={`px-4 pt-3 border-b flex gap-2 ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          {[
            { id: 'appearance', label: 'Appearance & Theme', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'data', label: 'Storage & Diagnostics', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'about', label: 'About System', icon: <Info className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                activeSettingsTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : theme === 'light'
                  ? 'border-transparent text-slate-600 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border-b border-emerald-500/30 text-xs font-bold flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          {/* ------------------------------------------------ */}
          {/* TAB 1: APPEARANCE & THEME                        */}
          {/* ------------------------------------------------ */}
          {activeSettingsTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Color Theme & Display Mode
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Choose between the dark OLED/midnight palette and a high-contrast daylight theme designed for sharp outdoor legibility.
                </p>

                {/* Theme Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dark Theme Card */}
                  <div
                    id="theme-card-dark"
                    onClick={() => {
                      setTheme('dark');
                      showToast('Switched to Dark Theme');
                    }}
                    className={`p-3.5 rounded-xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                      theme === 'dark'
                        ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                        : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                            <Moon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span>Dark Theme</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Midnight Slate</span>
                          </div>
                        </div>
                        {theme === 'dark' && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Visual Mini Mockup */}
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 mt-2">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-2 rounded bg-slate-800" />
                          <div className="w-4 h-2 rounded bg-emerald-500" />
                        </div>
                        <div className="w-full h-3 rounded bg-slate-900 border border-slate-800" />
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          <div className="h-4 rounded bg-slate-900 border border-slate-800" />
                          <div className="h-4 rounded bg-slate-900 border border-slate-800" />
                          <div className="h-4 rounded bg-emerald-500/20 border border-emerald-500/40" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>POS & Night Terminal</span>
                      <span className="text-emerald-400 font-bold">{theme === 'dark' ? 'Active' : 'Select'}</span>
                    </div>
                  </div>

                  {/* High-Contrast Light Theme Card */}
                  <div
                    id="theme-card-light"
                    onClick={() => {
                      setTheme('light');
                      showToast('Switched to High-Contrast Light Theme');
                    }}
                    className={`p-3.5 rounded-xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                      theme === 'light'
                        ? 'border-emerald-600 bg-white text-slate-900 shadow-xl shadow-slate-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                            <Sun className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>High-Contrast Light</span>
                            </div>
                            <span className="text-[10px] text-slate-600">Crisp Daylight White</span>
                          </div>
                        </div>
                        {theme === 'light' && (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Visual Mini Mockup */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300 space-y-1.5 mt-2">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-2 rounded bg-slate-300" />
                          <div className="w-4 h-2 rounded bg-emerald-600" />
                        </div>
                        <div className="w-full h-3 rounded bg-white border border-slate-300 shadow-sm" />
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          <div className="h-4 rounded bg-white border border-slate-300" />
                          <div className="h-4 rounded bg-white border border-slate-300" />
                          <div className="h-4 rounded bg-emerald-100 border border-emerald-400" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Daylight & Retail Counter</span>
                      <span className="text-emerald-700 font-bold">{theme === 'light' ? 'Active' : 'Select'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Toggle Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Direct Theme Switch</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Currently using {theme === 'dark' ? 'Dark Theme' : 'High-Contrast Light Theme'}
                    </div>
                  </div>
                </div>

                <button
                  id="btn-toggle-theme-switch"
                  onClick={toggleTheme}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                    theme === 'light'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              {/* Display Attributes */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ergonomics & Accessibility
                </h4>
                <div
                  className={`divide-y rounded-xl border text-xs ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 divide-slate-200 text-slate-800'
                      : 'bg-slate-900/60 border-slate-800 divide-slate-800 text-slate-200'
                  }`}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold">High-Contrast Borders & Typography</div>
                      <div className="text-[11px] text-slate-500">Optimized WCAG AA readability for ambient lighting</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Enforced
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Hardware Accelerated Transitions</div>
                      <div className="text-[11px] text-slate-500">Motion smooth layouts across all modules</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* TAB 2: STORAGE & DIAGNOSTICS                     */}
          {/* ------------------------------------------------ */}
          {activeSettingsTab === 'data' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Local Ledger & State Diagnostics
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Ellix Connect maintains instant offline persistence for inventory, invoices, and B2B orders.
                </p>
              </div>

              <div
                className={`grid grid-cols-3 gap-2.5 p-3.5 rounded-xl border text-center ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{products.length}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Products</div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">{invoices.length}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Invoices</div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{customers.length}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Customers</div>
                </div>
              </div>

              {/* Cloud Database & Account Sync Status */}
              <div
                className={`p-3.5 rounded-xl border space-y-3 ${
                  theme === 'light' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Cloud Firestore & Account Sync
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="font-medium">Firebase Project:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">nice-unity-1mbw7</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="font-medium">Database ID:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title="ai-studio-ellixconnect-badaa1a3-33f3-40fb-a0e7-a5f5c05ebc53">
                      ai-studio-ellixconnect...
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-[11px]">
                    <span className="font-medium">Sync Protocol:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Bidirectional Real-Time Snapshots</span>
                  </div>
                </div>
              </div>

              {/* Reset Data Danger Zone */}
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400">Restore Factory Default Database</div>
                  <button
                    id="btn-reset-factory-data"
                    onClick={() => setResetConfirmOpen(!resetConfirmOpen)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-500 transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
                <p className="text-[11px] text-red-700/80 dark:text-red-300/80">
                  Reload initial factory inventory catalog, customer ledgers, and standard system records.
                </p>

                {resetConfirmOpen && (
                  <div className="pt-2 border-t border-red-500/20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setResetConfirmOpen(false)}
                      className="px-3 py-1 rounded text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetToDefaultData();
                        setResetConfirmOpen(false);
                        showToast('Database reset to clean defaults');
                      }}
                      className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-bold"
                    >
                      Confirm Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* TAB 3: ABOUT                                     */}
          {/* ------------------------------------------------ */}
          {activeSettingsTab === 'about' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                  E
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">Ellix Connect Business OS</h4>
                  <p className="text-xs text-slate-500">Version 2.4.0 • Enterprise Edition</p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 leading-relaxed ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/40 border-slate-800 text-slate-300'
                }`}
              >
                <p>
                  Unified cloud & edge business operating system tailored for retail shopkeepers, multi-branch outlets, and B2B FMCG wholesalers.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Store Node: {activeStore.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Online & Active</span>
                </div>
              </div>

              {/* AI & Machine Discoverability Info Card */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${
                  theme === 'light' ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' : 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Bot className="w-4 h-4" /> AI & Crawler Discoverability
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Metadata
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Non-blank metadata, Schema.org JSON-LD, standard <code>llms.txt</code>, and <code>/api/about</code> structured data are active for AI assistants (ChatGPT, Gemini, Perplexity) and search engines.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/60 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    <span>llms.txt</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                  <a
                    href="/api/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/60 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>/api/about</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3.5 sm:p-4 border-t flex items-center justify-between text-xs ${
            theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Theme: <strong className={theme === 'light' ? 'text-slate-900' : 'text-slate-200'}>{theme === 'light' ? 'High-Contrast Light' : 'Dark Theme'}</strong></span>
          </div>

          <button
            id="btn-settings-done"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
