import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Cloud, LogIn, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  href: string;
  id: string;
}

const navItems: NavItem[] = [
  { name: 'Product', href: '#product', id: 'product' },
  { name: 'Features', href: '#features', id: 'features' },
  { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { name: 'Guide', href: '#guide', id: 'guide' }
];

interface LandingHeaderProps {
  onOpenSignIn?: () => void;
  onOpenGetStarted?: () => void;
  onOpenAppPreview?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onOpenSignIn,
  onOpenGetStarted,
  onOpenAppPreview
}) => {
  const { currentUser, userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Handle scroll detection for subtle header shadow & active section highlight
  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect if scrolled past top
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Detect active section based on scroll offset
      const scrollPosition = window.scrollY + 120;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            return;
          }
        }
      }

      // If at very top of page
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler with header offset
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash smoothly without jump
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b glass-panel relative ${
        isScrolled
          ? 'shadow-md border-slate-200/90 dark:border-slate-800'
          : 'border-transparent'
      }`}
    >
      {/* Subtle brand gradient backdrop BEHIND the glass header for frosted refraction */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/10 via-teal-500/5 to-emerald-600/10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-sm border border-slate-800 dark:border-slate-700 transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-950 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Ellix <span className="text-emerald-600 dark:text-emerald-400">Connect</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase hidden sm:inline-block">
              Business Management Platform
            </span>
          </div>
        </a>

        {/* Desktop Navigation with Smooth Scroll & Active Indicator */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50/80 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Static Header Actions & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle id="btn-theme-toggle-header" />

          {/* Desktop Auth Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-auth-user"
                  type="button"
                  onClick={onOpenSignIn}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer group"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {currentUser.displayName || 'Account'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" title="Cloud Database Synced" />
                </button>

                {onOpenAppPreview && (
                  <button
                    id="btn-nav-open-console"
                    type="button"
                    onClick={onOpenAppPreview}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Console</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  id="btn-nav-signin"
                  type="button"
                  onClick={onOpenSignIn}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                {onOpenAppPreview && (
                  <button
                    id="btn-nav-launch-preview"
                    type="button"
                    onClick={onOpenAppPreview}
                    className="px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Explore live business management app & cloud database"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Live App</span>
                  </button>
                )}

                <button
                  id="btn-nav-getstarted"
                  type="button"
                  onClick={onOpenGetStarted}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:bg-slate-950 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 dark:text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <button
            id="btn-nav-mobile-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer / Collapsible Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col space-y-1 text-sm font-semibold">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Theme</span>
                <ThemeToggle id="btn-theme-toggle-mobile" showLabel />
              </div>

              {currentUser && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-emerald-500/30">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.displayName || 'Merchant Partner'}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Cloud Database Connected</span>
                    </div>
                  </div>
                </div>
              )}

              {onOpenAppPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAppPreview();
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Merchant Console</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn?.();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                {currentUser ? 'Manage Account & Credentials' : 'Sign In'}
              </button>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGetStarted?.();
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 dark:text-emerald-100" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

