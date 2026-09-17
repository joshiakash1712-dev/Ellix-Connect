import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveModule } from '../../types';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  ShieldCheck,
  Building2,
  Sliders,
  Zap,
  Palette,
  Menu,
  X,
  Store as StoreIcon,
  Truck,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Wifi,
  WifiOff,
  CheckCircle2,
  Sparkles,
  Settings,
  Moon,
  Sun,
  Database,
  Lock,
  Activity,
  Compass,
  LogIn,
  LogOut,
  Smartphone,
  Mail,
  KeyRound,
  Globe
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  onOpenMobileDrawer?: () => void;
  onNavigateToWebsite?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer = () => {},
  onOpenMobileDrawer = () => {},
  onNavigateToWebsite
}) => {
  const {
    activeModule,
    setActiveModule,
    activeStore,
    setActiveStore,
    stores,
    activeRole,
    products,
    theme,
    toggleTheme,
    setIsSettingsModalOpen
  } = useStore();

  const {
    currentUser: authUser,
    openAuthModal,
    setIsSyncHubOpen
  } = useAuth();

  const [showStorePickerInDrawer, setShowStorePickerInDrawer] = React.useState(false);

  const lowStockCount = products.filter(p => p.stock <= p.minThreshold).length;

  const retailerItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory & Stock', shortLabel: 'Inventory', icon: <Package className="w-5 h-5" />, count: products.length },
    { id: 'crm', label: 'B2B & Clients', shortLabel: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports & GST', shortLabel: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'templates', label: 'Invoice Templates', shortLabel: 'Templates', icon: <Palette className="w-5 h-5" /> },
    { id: 'employees', label: 'Staff & Roles', shortLabel: 'Staff', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'journey_map', label: 'Customer Journey Map', shortLabel: 'Journey', icon: <Compass className="w-5 h-5" />, badge: 'UX' }
  ];

  const wholesalerItems: NavItem[] = [
    { id: 'wholesaler_portal', label: 'Orders & Quotes', shortLabel: 'Orders', icon: <Zap className="w-5 h-5" /> },
    { id: 'wholesaler_catalog', label: 'Bulk Catalog', shortLabel: 'Catalog', icon: <Package className="w-5 h-5" /> },
    { id: 'wholesaler_retailers', label: 'Connected Retailers', shortLabel: 'Retailers', icon: <Building2 className="w-5 h-5" /> }
  ];

  const adminItems: NavItem[] = [
    { id: 'admin_dashboard', label: 'Platform Console', shortLabel: 'Platform', icon: <Sliders className="w-5 h-5" /> },
    { id: 'journey_map', label: 'Customer Journey Map', shortLabel: 'Journey', icon: <Compass className="w-5 h-5" />, badge: 'UX' }
  ];

  const items =
    activeModule === 'retailer'
      ? retailerItems
      : activeModule === 'wholesaler'
      ? wholesalerItems
      : adminItems;

  // Primary mobile bottom navigation items
  const primaryBottomNavItems = items.slice(0, 4);

  const modulesList: { id: ActiveModule; label: string; icon: React.ReactNode }[] = [
    { id: 'retailer', label: 'Retailer', icon: <StoreIcon className="w-3.5 h-3.5" /> },
    { id: 'wholesaler', label: 'Wholesale', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldAlert className="w-3.5 h-3.5" /> }
  ];

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. DESKTOP SIDEBAR (md:flex)                                  */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden md:flex w-[280px] glass-panel border-r border-slate-800 text-slate-300 p-4 shrink-0 flex-col justify-between min-h-[calc(100vh-4rem)] relative overflow-hidden">
        {/* Subtle brand gradient backdrop BEHIND the glass sidebar */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-600/10 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="space-y-4">
          {/* Branch Profile Pill */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
              {activeStore.name?.slice(0, 2).toUpperCase() || 'EM'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{activeStore.name || 'Main Branch'}</div>
              <div className="text-[10px] text-slate-400 truncate capitalize">{activeRole.replace('_', ' ')} Access</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {activeModule.toUpperCase()} NAVIGATION
            </div>

            {items.map(item => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="space-y-2 mb-2">
          {activeModule === 'retailer' && (
            <button
              id="btn-sidebar-actions-required"
              onClick={() => onSelectView('inventory')}
              className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500/50 text-left transition-all group flex items-center justify-between"
              title="View items requiring replenishment"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-300 truncate">
                    {lowStockCount > 0 ? `${lowStockCount} Actions Required` : 'Inventory Healthy'}
                  </div>
                  <div className="text-[10px] text-amber-200/80 truncate">
                    {lowStockCount > 0 ? `${lowStockCount} items below threshold` : 'All stocks optimal'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400/60 group-hover:text-amber-300 shrink-0" />
            </button>
          )}

          {/* System Status Quick Button */}
          <button
            id="btn-sidebar-system-status"
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all group flex items-center justify-between"
            title="System & Cloud Sync Status"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] shrink-0 ml-1" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">
                  System Status
                </div>
                <div className="text-[10px] text-emerald-400 font-medium truncate">
                  All Systems Online
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
          </button>
        </div>

          {/* Auth & Sync Hub Quick Card */}
          <div className="mb-2">
            {authUser ? (
              <button
                id="btn-sidebar-sync-hub"
                onClick={() => setIsSyncHubOpen(true)}
                className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/50 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Identity
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 group-hover:underline">
                    Security &rarr;
                  </span>
                </div>
                <div className="text-xs font-semibold text-white truncate mt-0.5">
                  {authUser.displayName || 'Merchant Partner'}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <span>{authUser.email || authUser.phoneNumber}</span>
                </div>
              </button>
            ) : (
              <button
                id="btn-sidebar-sign-in"
                onClick={() => openAuthModal('login')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Marketing Website Return Button */}
          {onNavigateToWebsite && (
            <div className="mb-2">
              <button
                id="btn-sidebar-website"
                onClick={onNavigateToWebsite}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all"
                title="Return to Marketing Website"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marketing Website</span>
                </div>
                <span className="text-[10px] text-slate-400">View &rarr;</span>
              </button>
            </div>
          )}

          {/* Settings Menu Button */}
          <div>
            <button
              id="btn-sidebar-settings"
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700/80 transition-all active:scale-[0.98]"
              title="Open System Settings & Theme"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>System Settings</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. ANDROID MATERIAL 3 COLLAPSIBLE NAVIGATION DRAWER (MOBILE)  */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            
            {/* Scrim / Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobileDrawer}
              className="fixed inset-0 bg-slate-950/80"
              aria-hidden="true"
            />

            {/* Navigation Drawer Surface with Touch Swipe-to-Dismiss */}
            <motion.div
              id="android-navigation-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              drag="x"
              dragConstraints={{ left: -310, right: 0 }}
              dragElastic={{ left: 0.15, right: 0 }}
              dragSnapToOrigin={false}
              onDragEnd={(_event, info) => {
                // If swiped left by 60px or with negative velocity, dismiss drawer
                if (info.offset.x < -60 || info.velocity.x < -200) {
                  onCloseMobileDrawer();
                }
              }}
              className="relative w-[310px] max-w-[85vw] glass-panel border-r border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto touch-pan-y"
            >
              {/* Subtle brand gradient backdrop BEHIND mobile glass drawer */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-600/10 via-teal-500/5 to-transparent pointer-events-none" />

              {/* Swipe Left Handle Affordance on drawer edge */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-slate-700/60 pointer-events-none" />

              <div className="p-4 space-y-4">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-white text-base shadow-md">
                      E
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white leading-tight">
                        Ellix<span className="text-emerald-400">Connect</span>
                      </h2>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Android Business OS
                      </span>
                    </div>
                  </div>

                  <button
                    id="btn-close-drawer"
                    onClick={onCloseMobileDrawer}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
                    aria-label="Close navigation drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Active Store & Role Summary Card */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs shrink-0">
                        {activeStore.name?.slice(0, 2).toUpperCase() || 'EM'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{activeStore.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{activeStore.city} • {activeRole.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Switch Store Button if Retailer */}
                  {activeModule === 'retailer' && (
                    <div>
                      <button
                        onClick={() => setShowStorePickerInDrawer(!showStorePickerInDrawer)}
                        className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-slate-300 text-[11px] font-semibold flex items-center justify-between border border-slate-700/60"
                      >
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-emerald-400" />
                          <span>Switch Store Outlet</span>
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showStorePickerInDrawer ? 'rotate-90' : ''}`} />
                      </button>

                      {showStorePickerInDrawer && (
                        <div className="mt-2 space-y-1 pt-1 border-t border-slate-700/40">
                          {stores.map(st => (
                            <button
                              key={st.id}
                              onClick={() => {
                                setActiveStore(st);
                                setShowStorePickerInDrawer(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                                activeStore.id === st.id
                                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                  : 'text-slate-300 hover:bg-slate-700/40'
                              }`}
                            >
                              <span className="truncate">{st.name}</span>
                              {activeStore.id === st.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Module Switcher Tabs (Android Segmented Button) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
                    System Mode
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {modulesList.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setActiveModule(mod.id);
                        }}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          activeModule === mod.id
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mod.icon}
                        <span>{mod.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Drawer Links */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
                    {activeModule.toUpperCase()} VIEWS
                  </div>

                  {items.map(item => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`drawer-nav-${item.id}`}
                        onClick={() => {
                          onSelectView(item.id);
                          onCloseMobileDrawer();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20'
                            : 'text-slate-300 hover:bg-slate-800/80 active:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {item.icon}
                          </div>
                          <span className="text-xs">{item.label}</span>
                        </div>

                        {item.count !== undefined && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Drawer Bottom Utility & Info */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
                {/* Mobile Drawer Marketing Website Return Button */}
                {onNavigateToWebsite && (
                  <button
                    id="btn-drawer-website"
                    onClick={() => {
                      onCloseMobileDrawer();
                      onNavigateToWebsite();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between active:scale-[0.98] transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Marketing Website</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Exit App &rarr;</span>
                  </button>
                )}

                {/* Mobile Drawer Settings Menu Button */}
                <button
                  id="btn-drawer-settings"
                  onClick={() => {
                    onCloseMobileDrawer();
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between active:scale-[0.98] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-emerald-400" />
                    <span>System Settings & Theme</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </button>

                <div className="w-full flex items-center justify-between text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Live Database Connected</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Online</span>
                </div>

                <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span>←</span> Swipe left to close
                  </span>
                  <span>v2.4.0</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
