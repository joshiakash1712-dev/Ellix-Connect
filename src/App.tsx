import React, { useState } from 'react';
import { EllixLandingPage } from './components/landing/EllixLandingPage';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { RetailerDashboard } from './components/retailer/RetailerDashboard';
import { BillingPOS } from './components/retailer/BillingPOS';
import { InventoryManager } from './components/retailer/InventoryManager';
import { CustomerCRM } from './components/retailer/CustomerCRM';
import { ReportsAnalytics } from './components/retailer/ReportsAnalytics';
import { EmployeeRoles } from './components/retailer/EmployeeRoles';
import { InvoiceTemplates } from './components/retailer/InvoiceTemplates';
import { WholesalerPortal } from './components/wholesaler/WholesalerPortal';
import { AdminPanel } from './components/admin/AdminPanel';
import { CustomerJourneyMap } from './components/research/CustomerJourneyMap';
import { AuthModal } from './components/auth/AuthModal';
import { AccountSyncHubModal } from './components/auth/AccountSyncHubModal';
import { SaveStatusToast } from './components/common/SaveStatusToast';
import { ShieldCheck, Mail, AlertCircle, X, Zap } from 'lucide-react';

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
      ease: [0.2, 0.0, 0.0, 1.0],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.985,
    transition: {
      duration: 0.18,
      ease: [0.3, 0.0, 0.8, 0.15],
    },
  },
};

interface MainLayoutProps {
  onNavigateToWebsite?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onNavigateToWebsite }) => {
  const { activeModule, setActiveModule } = useStore();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    // Universal journey map view accessible from any module
    if (activeView === 'journey_map') {
      return <CustomerJourneyMap />;
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
        case 'crm':
          return <CustomerCRM />;
        case 'templates':
          return <InvoiceTemplates />;
        case 'reports':
          return <ReportsAnalytics />;
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

  const { currentUser: authUser, setIsSyncHubOpen, resendVerificationEmail } = useAuth();
  const [dismissEmailBanner, setDismissEmailBanner] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const viewKey = `${activeModule}-${activeView}`;

  const hasUnverifiedEmail = Boolean(
    authUser &&
    authUser.email &&
    !authUser.emailVerified &&
    !authUser.providerData.some(p => p.providerId === 'google.com') &&
    !dismissEmailBanner
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white w-full max-w-full overflow-x-hidden">
      
      {/* Top Main Navigation */}
      <Navbar
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onNavigateToWebsite={onNavigateToWebsite}
      />

      {/* Unverified Email Security Banner */}
      {hasUnverifiedEmail && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
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
        </div>
      )}

      {/* Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full min-w-0 overflow-x-hidden">
        
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
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 pb-24 md:pb-6 w-full max-w-7xl mx-auto overflow-x-hidden">
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
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Persistent Native Android-style Bottom Navigation for Mobile Critical Actions */}
      <BottomNavigation
        activeView={activeView}
        onSelectView={setActiveView}
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

    </div>
  );
};

const AppContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#app') return 'app';
      const saved = localStorage.getItem('ellix_preferred_view');
      if (saved === 'app') return 'app';
    }
    return 'landing';
  });

  const handleSwitchView = (mode: 'landing' | 'app') => {
    setViewMode(mode);
    try {
      localStorage.setItem('ellix_preferred_view', mode);
      if (mode === 'app') {
        window.location.hash = '#app';
      } else {
        if (window.location.hash === '#app') {
          history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      {viewMode === 'landing' ? (
        <EllixLandingPage onLaunchApp={() => handleSwitchView('app')} />
      ) : (
        <MainLayout onNavigateToWebsite={() => handleSwitchView('landing')} />
      )}
      
      {/* Global Auth & Account Synchronization Modals */}
      <AuthModal />
      <AccountSyncHubModal />
      <SaveStatusToast />
    </>
  );
};

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

