import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveModule, UserRole } from '../../types';
import { NotificationCenter } from './NotificationCenter';
import { SettingsModal } from './SettingsModal';
import {
  Store as StoreIcon,
  Truck,
  ShieldAlert,
  Bell,
  ChevronDown,
  CheckCircle2,
  Menu,
  Settings,
  ShieldCheck,
  Zap,
  LogIn,
  LogOut,
  Smartphone,
  Mail,
  KeyRound,
  Cloud,
  RefreshCw,
  WifiOff,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileDrawer?: () => void;
  onOpenNotifications?: () => void;
  onNavigateToWebsite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileDrawer,
  onOpenNotifications,
  onNavigateToWebsite
}) => {
  const {
    activeModule,
    setActiveModule,
    activeRole,
    setActiveRole,
    unreadCount,
    theme,
    toggleTheme,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    cloudSyncState,
    forceCloudSync
  } = useStore();

  const {
    currentUser: authUser,
    userProfile,
    openAuthModal,
    setIsSyncHubOpen,
    logout
  } = useAuth();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Connectivity detection using navigator.onLine API
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const modules: { id: ActiveModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'retailer', label: 'Retailer App', icon: <StoreIcon className="w-4 h-4" /> },
    { id: 'wholesaler', label: 'Wholesaler Portal', icon: <Truck className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin OS', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'owner', label: 'Store Owner', desc: 'Full access to Multi-Store Inventory, Restock, Staff & Financials' },
    { id: 'manager', label: 'Store Manager', desc: 'Inventory stock management & Wholesaler Restock Orders' },
    { id: 'inventory_staff', label: 'Inventory Staff', desc: 'Stock inward/outward, batching & barcodes' },
    { id: 'wholesaler_admin', label: 'Wholesaler Admin', desc: 'Manage catalog, quotes & retail dispatches' },
    { id: 'platform_admin', label: 'Platform Admin', desc: 'Multi-tenant security, system controls & audit logs' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 text-slate-100 shadow-xl w-full max-w-full overflow-x-hidden relative">
      {/* Subtle brand gradient backdrop BEHIND the glass navbar to give frosted refraction depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/10 via-teal-500/5 to-emerald-600/10 pointer-events-none" />
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Store Picker */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Drawer Trigger (Android Navigation Icon) */}
            <button
              id="btn-hamburger-menu"
              onClick={onOpenMobileDrawer}
              className="md:hidden p-2 -ml-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center shrink-0"
              aria-label="Open Navigation Drawer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-200" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl tracking-wider border border-emerald-300/30 shrink-0">
                E
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  Ellix<span className="text-emerald-400 font-extrabold">Connect</span>
                </span>

                {/* Subtle Offline Badge */}
                {!isOnline && (
                  <span
                    id="badge-navbar-offline"
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0"
                    title="Offline: Internet connection lost (navigator.onLine). Offline-first mode is active; local data remains safe."
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <WifiOff className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Offline</span>
                  </span>
                )}
              </div>
            </div>

            {onNavigateToWebsite && (
              <button
                id="btn-nav-return-website"
                type="button"
                onClick={onNavigateToWebsite}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm"
                title="Return to Marketing Landing Page"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Marketing Site</span>
              </button>
            )}
          </div>

          {/* Center Navigation Modules Switcher (Visible on extra large desktop) */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {modules.map(mod => {
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {mod.icon}
                  <span>{mod.label}</span>
                  {mod.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Cloud Sync Status & Quick Action Button */}
            <button
              id="btn-nav-cloud-sync"
              onClick={() => forceCloudSync()}
              disabled={cloudSyncState.status === 'syncing'}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                cloudSyncState.status === 'syncing'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 animate-pulse cursor-wait'
                  : cloudSyncState.status === 'offline'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40'
              }`}
              title={
                cloudSyncState.status === 'syncing'
                  ? 'Syncing with Cloud Firestore...'
                  : cloudSyncState.status === 'offline'
                  ? 'Offline: Changes stored in local SQLite/IndexedDB. Tap to retry connection.'
                  : 'Cloud Connected: Tap to manually refresh from cloud'
              }
            >
              {cloudSyncState.status === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              ) : cloudSyncState.status === 'offline' ? (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline text-[11px]">
                {cloudSyncState.status === 'syncing'
                  ? 'Syncing'
                  : cloudSyncState.status === 'offline'
                  ? 'Offline'
                  : 'Cloud'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-nav-notifications"
              onClick={() => onOpenNotifications ? onOpenNotifications() : setIsNotificationModalOpen(true)}
              className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0"
              title="Notifications Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-extrabold text-white flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Sign In Button (Unauthenticated state) */}
            {!authUser && (
              <button
                id="btn-nav-sign-in"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 shrink-0"
                title="Sign In with Google, Phone OTP or Email"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Role Switcher & Profile Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 text-xs text-slate-200 transition-all"
              >
                {authUser?.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt={authUser.displayName || 'User'}
                    className="w-7 h-7 rounded-md object-cover border border-emerald-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-md bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                    {authUser?.displayName
                      ? authUser.displayName.slice(0, 2).toUpperCase()
                      : activeRole.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left max-w-[100px] md:max-w-[130px]">
                  <div className="text-xs font-semibold capitalize text-slate-200 leading-none flex items-center gap-1 truncate">
                    <span className="truncate">{authUser?.displayName || activeRole.replace('_', ' ')}</span>
                    {authUser && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                    {authUser ? 'Verified Account' : 'Switch Role & Menu'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50">
                  
                  {/* Authenticated User Status Bar */}
                  {authUser ? (
                    <div className="p-2.5 mb-2 rounded-lg bg-slate-900 border border-slate-700/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Identity
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {authUser.email ? authUser.email.split('@')[0] : 'Phone User'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-white font-semibold truncate">
                        {authUser.displayName || 'Merchant Partner'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {authUser.email || authUser.phoneNumber}
                      </div>

                      {/* Account Security Settings */}
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          setIsSyncHubOpen(true);
                        }}
                        className="w-full mt-2 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Security & Linked Credentials</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 mb-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
                      <div className="text-xs font-semibold text-slate-300 mb-1">
                        Sign in to your account
                      </div>
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          openAuthModal('login');
                        }}
                        className="w-full py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In / Register</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-1">
                    Select Active Role
                  </div>
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setActiveRole(r.id);
                          if (r.id === 'wholesaler_admin') setActiveModule('wholesaler');
                          else if (r.id === 'platform_admin') setActiveModule('admin');
                          else setActiveModule('retailer');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                          activeRole === r.id
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{r.label}</div>
                          <div className="text-[10px] text-slate-400">{r.desc}</div>
                        </div>
                        {activeRole === r.id && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Settings and Theme in menu */}
                  <div className="mt-2 pt-2 border-t border-slate-700/80 space-y-1">
                    <button
                      id="btn-menu-settings"
                      onClick={() => {
                        setShowRoleDropdown(false);
                        setIsSettingsModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Settings (Theme & Preferences)</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                        {theme === 'dark' ? 'Dark' : 'Light'}
                      </span>
                    </button>

                    {authUser && (
                      <button
                        id="btn-menu-signout"
                        onClick={async () => {
                          setShowRoleDropdown(false);
                          await logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Real-time Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* System Settings & Theme Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </header>
  );
};
