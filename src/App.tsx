import React, { useState, Suspense, lazy } from 'react';
import { EllixLandingPage } from './components/landing/EllixLandingPage';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { auth } from './lib/firebase';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { AuthModal } from './components/auth/AuthModal';
import { SaveStatusToast } from './components/common/SaveStatusToast';
import { ShieldCheck, Mail, AlertCircle, X, Zap } from 'lucide-react';

// Lazy-loaded application views & heavy widgets to keep initial website bundle fast
const RetailerDashboard = lazy(() =>
  import('./components/retailer/RetailerDashboard').then((m) => ({ default: m.RetailerDashboard }))
);
const BillingPOS = lazy(() =>
  import('./components/retailer/BillingPOS').then((m) => ({ default: m.BillingPOS }))
);
const InventoryManager = lazy(() =>
  import('./components/retailer/InventoryManager').then((m) => ({ default: m.InventoryManager }))
);
const CustomerCRM = lazy(() =>
  import('./components/retailer/CustomerCRM').then((m) => ({ default: m.CustomerCRM }))
);
const ReportsAnalytics = lazy(() =>
  import('./components/retailer/ReportsAnalytics').then((m) => ({ default: m.ReportsAnalytics }))
);
const EmployeeRoles = lazy(() =>
  import('./components/retailer/EmployeeRoles').then((m) => ({ default: m.EmployeeRoles }))
);
const InvoiceTemplates = lazy(() =>
  import('./components/retailer/InvoiceTemplates').then((m) => ({ default: m.InvoiceTemplates }))
);
const CrewSales = lazy(() =>
  import('./components/retailer/CrewSales').then((m) => ({ default: m.CrewSales }))
);
const SupplierManager = lazy(() =>
  import('./components/retailer/SupplierManager').then((m) => ({ default: m.SupplierManager }))
);
const SubscriptionPaywall = lazy(() =>
  import('./components/subscription/SubscriptionPaywall').then((m) => ({ default: m.SubscriptionPaywall }))
);
const WholesalerPortal = lazy(() =>
  import('./components/wholesaler/WholesalerPortal').then((m) => ({ default: m.WholesalerPortal }))
);
const AdminPanel = lazy(() =>
  import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const CustomerJourneyMap = lazy(() =>
  import('./components/research/CustomerJourneyMap').then((m) => ({ default: m.CustomerJourneyMap }))
);
const AccountSyncHubModal = lazy(() =>
  import('./components/auth/AccountSyncHubModal').then((m) => ({ default: m.AccountSyncHubModal }))
);
const SupportChatbot = lazy(() =>
  import('./components/common/SupportChatbot').then((m) => ({ default: m.SupportChatbot }))
);

// Staggered entrance sequence for MainLayout containers (opacity 0 -> 1, translateY 12px -> 0)
const mainLayoutContainerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
};

const mainLayoutItemVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const clearTransformWhenIdle = (
  transform: { y?: number | string },
  generatedTransform: string
) => {
  if (transform.y === 0 || transform.y === '0px') {
    return 'none';
  }
  return generatedTransform;
};

// Material motion transition preset (Shared Axis with subtle scale & fade)
const pageMotionVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.985,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface MainLayoutProps {
  onNavigateToWebsite?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onNavigateToWebsite }) => {
  const { isDemoMode, activeModule, setActiveModule, subscription, activeRole } = useStore();
  const { userProfile: rawUserProfile } = useAuth();
  const userProfile = isDemoMode ? null : rawUserProfile;
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  const renderActiveView = () => {
    // Universal journey map view accessible from any module
    if (activeView === 'journey_map') {
      return <CustomerJourneyMap />;
    }

    // Authoritative Subscription Paywall: Restrict core retail operations if blocked or cancelled
    const isClient = activeRole === 'client' || userProfile?.role === 'client';
    const isSubscriptionBlocked = subscription && (subscription.status === 'blocked' || subscription.status === 'cancelled');
    if (isClient && isSubscriptionBlocked) {
      return <SubscriptionPaywall />;
    }

    // Retailer Views
    if (activeModule === 'retailer') {
      switch (activeView) {
        case 'journey_map':
          return <CustomerJourneyMap />;
        case 'pos':
          return <BillingPOS />;
        case 'inventory':
          return <InventoryManager />;
        case 'suppliers':
          return <SupplierManager />;
        case 'crm':
          return <CustomerCRM />;
        case 'my_sales':
          return <CrewSales />;
        case 'templates':
          return <InvoiceTemplates />;
        case 'reports':
          return <ReportsAnalytics onNavigateToPOS={() => setActiveView('pos')} />;
        case 'employees':
          return <EmployeeRoles />;
        case 'dashboard':
        default:
          return (
            <RetailerDashboard
              onNavigateToInventory={() => setActiveView('inventory')}
              onNavigateToRestock={() => setActiveView('inventory')}
              onNavigateToPOS={() => setActiveView('pos')}
              onNavigateToWholesale={() => setActiveModule('wholesaler')}
              onNavigateToReports={() => setActiveView('reports')}
              onNavigateToJourneyMap={() => setActiveView('journey_map')}
            />
          );
      }
    }

    // Wholesaler Views
    if (activeModule === 'wholesaler') {
      return <WholesalerPortal />;
    }

    // Admin Views
    if (activeModule === 'admin') {
      return <AdminPanel />;
    }

    return (
      <RetailerDashboard
        onNavigateToInventory={() => setActiveView('inventory')}
        onNavigateToRestock={() => setActiveView('inventory')}
      />
    );
  };

  const { currentUser: rawAuthUser, setIsSyncHubOpen, resendVerificationEmail } = useAuth();
  const authUser = isDemoMode ? null : rawAuthUser;
  const [dismissEmailBanner, setDismissEmailBanner] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const viewKey = `${activeModule}-${activeView}`;

  const hasUnverifiedEmail = Boolean(
    !isDemoMode &&
    authUser &&
    authUser.email &&
    !authUser.emailVerified &&
    !authUser.providerData.some(p => p.providerId === 'google.com') &&
    !dismissEmailBanner
  );

  return (
    <motion.div
      variants={mainLayoutContainerVariants}
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white w-full max-w-full overflow-x-hidden"
    >
      
      {/* Top Main Navigation */}
      <motion.div
        variants={mainLayoutItemVariants}
        transformTemplate={clearTransformWhenIdle}
        className="sticky top-0 z-40 w-full"
      >
        <Navbar
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onNavigateToWebsite={onNavigateToWebsite}
        />
      </motion.div>

      {/* Unverified Email Security Banner */}
      {hasUnverifiedEmail && (
        <motion.div
          variants={mainLayoutItemVariants}
          transformTemplate={clearTransformWhenIdle}
          className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Verify Email:</strong> Please verify <strong>{authUser?.email}</strong> for full permissions and account recovery.
            </span>
            <button
              onClick={async () => {
                try {
                  await resendVerificationEmail();
                  setResendStatus('Verification link sent!');
                } catch {
                  setResendStatus('Failed to send link.');
                }
              }}
              className="underline font-bold hover:text-white transition-colors ml-1"
            >
              {resendStatus || 'Resend verification link'}
            </button>
            <span className="text-amber-400/60">•</span>
            <button
              onClick={() => setIsSyncHubOpen(true)}
              className="text-amber-300 font-semibold hover:underline flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              <span>Manage Account</span>
            </button>
          </div>
          <button
            onClick={() => setDismissEmailBanner(true)}
            className="p-1 text-amber-300 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Body Layout */}
      <motion.div
        variants={mainLayoutItemVariants}
        transformTemplate={clearTransformWhenIdle}
        className="flex-1 flex flex-col md:flex-row w-full max-w-full min-w-0 overflow-x-hidden"
      >
        
        {/* Module Sub-navigation Sidebar, Collapsible Drawer & Bottom Nav */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onNavigateToWebsite={onNavigateToWebsite}
        />

        {/* Main Workstage Content View with Motion Transitions & Safe Area Padding for Bottom Bar */}
        <motion.main
          variants={mainLayoutItemVariants}
          transformTemplate={clearTransformWhenIdle}
          className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 pb-24 md:pb-6 w-full max-w-7xl mx-auto overflow-x-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              id={`view-stage-${viewKey}`}
              key={viewKey}
              variants={pageMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-full h-full will-change-transform min-w-0 overflow-x-hidden"
            >
              <Suspense
                fallback={
                  <div className="w-full min-h-[320px] flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                  </div>
                }
              >
                {renderActiveView()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </motion.main>

      </motion.div>

      {/* Persistent Native Android-style Bottom Navigation for Mobile Critical Actions */}
      <BottomNavigation
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenMenu={() => setIsMobileDrawerOpen(true)}
        isMenuOpen={isMobileDrawerOpen}
      />

      {/* Machine-Readable AI Context & Application Data for Headless Agents and Scrapers */}
      <section
        id="app-machine-readable-context"
        className="sr-only"
        aria-label="Machine-Readable Application Knowledge"
      >
        <h2>Ellix Connect Android Retail Platform</h2>
        <p>
          Active business management system operating on Android and Web. Supporting POS sub-second billing,
          multi-batch inventory, customer khata credit management, dynamic UPI QR payments, and GST reports.
        </p>
        <p>Available endpoints: /api/about, /llms.txt, /llms-full.txt, /sitemap.xml</p>
      </section>

    </motion.div>
  );
};

// Dedicated Website Page (Route: /)
const WebsitePage: React.FC<{ onNavigateToApp: () => void; onLaunchDemo: () => void }> = ({
  onNavigateToApp,
  onLaunchDemo,
}) => {
  return (
    <>
      <EllixLandingPage onLaunchApp={onNavigateToApp} onLaunchDemo={onLaunchDemo} />
      {/* 24/7 AI Customer Support Chatbot - isolated to the Website page */}
      <Suspense fallback={null}>
        <SupportChatbot />
      </Suspense>
      <AuthModal />
    </>
  );
};

// App Demo Mode — Renders the actual application with isolated fake/mock data, without login or real user data
const DemoApplicationPage: React.FC<{ onExitDemo: () => void }> = ({ onExitDemo }) => {
  return (
    <StoreProvider isDemoMode={true}>
      <MainLayout onNavigateToWebsite={onExitDemo} />
    </StoreProvider>
  );
};

// Dedicated Real Client Application Page (Route: /app — Protected against direct reach)
const ApplicationPage: React.FC<{ onNavigateToWebsite: () => void }> = ({ onNavigateToWebsite }) => {
  return (
    <>
      <MainLayout onNavigateToWebsite={onNavigateToWebsite} />
      {/* Application Auth, Sync Hub & Save Status Modals */}
      <AuthModal />
      <Suspense fallback={null}>
        <AccountSyncHubModal />
      </Suspense>
      <SaveStatusToast />
    </>
  );
};

function isAppUrlPath(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return pathname === '/app' || pathname.startsWith('/app/') || window.location.hash === '#app';
}

const AppContent: React.FC = () => {
  const { currentUser, loading: isAuthLoading, openAuthModal } = useAuth();
  // Prevent direct URL reach to /app: only allow entry when explicitly launched from an authenticated session
  const hasAuthorizedAppEntryRef = React.useRef<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'website' | 'demo' | 'app'>('website');

  // Block any direct reach to /app or /#app on initial load or unauthenticated state
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const enforceRouteProtection = () => {
      if (isAppUrlPath()) {
        if (!hasAuthorizedAppEntryRef.current || (!isAuthLoading && !currentUser)) {
          try {
            window.history.replaceState({}, '', '/');
          } catch {
            // ignore history errors
          }
          setCurrentPage('website');
          return;
        }
        setCurrentPage('app');
      } else {
        setCurrentPage(prev => (prev === 'demo' ? 'demo' : 'website'));
      }
    };

    enforceRouteProtection();

    window.addEventListener('popstate', enforceRouteProtection);
    window.addEventListener('hashchange', enforceRouteProtection);
    return () => {
      window.removeEventListener('popstate', enforceRouteProtection);
      window.removeEventListener('hashchange', enforceRouteProtection);
    };
  }, [currentUser, isAuthLoading]);

  // Automatically return to Website page (/) if user signs out while inside ApplicationPage (/app)
  React.useEffect(() => {
    if (!isAuthLoading && !currentUser && currentPage === 'app') {
      hasAuthorizedAppEntryRef.current = false;
      try {
        window.history.replaceState({}, '', '/');
      } catch {
        // ignore
      }
      setCurrentPage('website');
    }
  }, [currentUser, isAuthLoading, currentPage]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title =
        currentPage === 'app'
          ? 'Ellix Connect OS — Retail & POS Application'
          : currentPage === 'demo'
            ? 'Ellix Connect OS — Interactive App Demo'
            : 'Ellix Connect — Business management, without the complexity';
    }
  }, [currentPage]);

  const navigateToPage = (targetPage: 'website' | 'demo' | 'app') => {
    if (targetPage === 'app') {
      // Prevent direct reach if not authenticated
      if (!authUserIsSignedIn(currentUser)) {
        openAuthModal('login');
        return;
      }
      hasAuthorizedAppEntryRef.current = true;
      try {
        if (window.location.pathname !== '/app' || window.location.hash === '#app') {
          window.history.pushState({}, '', '/app');
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        // ignore
      }
      setCurrentPage('app');
    } else if (targetPage === 'demo') {
      hasAuthorizedAppEntryRef.current = false;
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        // ignore
      }
      setCurrentPage('demo');
    } else {
      hasAuthorizedAppEntryRef.current = false;
      try {
        if (window.location.pathname !== '/' || window.location.hash === '#app') {
          window.history.pushState({}, '', '/');
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        // ignore
      }
      setCurrentPage('website');
    }
  };

  if (currentPage === 'app' && hasAuthorizedAppEntryRef.current && authUserIsSignedIn(currentUser)) {
    return <ApplicationPage onNavigateToWebsite={() => navigateToPage('website')} />;
  }

  if (currentPage === 'demo') {
    return <DemoApplicationPage onExitDemo={() => navigateToPage('website')} />;
  }

  return (
    <WebsitePage
      onNavigateToApp={() => navigateToPage('app')}
      onLaunchDemo={() => navigateToPage('demo')}
    />
  );
};

function authUserIsSignedIn(currentUser: unknown): boolean {
  return Boolean(currentUser || auth.currentUser);
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

