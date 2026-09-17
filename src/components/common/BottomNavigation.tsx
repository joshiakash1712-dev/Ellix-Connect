import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  BarChart3,
  Zap,
  Building2,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface BottomNavigationProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenMenu?: () => void;
  isMenuOpen?: boolean;
}

interface BottomTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badgeCount?: number;
  highlightBadge?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeView,
  onSelectView
}) => {
  const { activeModule, products } = useStore();

  const lowStockCount = products.filter(p => p.stock <= p.minThreshold).length;

  // Retailer Critical Actions: Dashboard, Billing POS, Inventory, CRM, Reports
  const retailerTabs: BottomTab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'pos',
      label: 'POS Bill',
      icon: <Receipt className="w-5 h-5" />
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      badgeCount: lowStockCount > 0 ? lowStockCount : undefined,
      highlightBadge: lowStockCount > 0
    },
    {
      id: 'crm',
      label: 'CRM & Khata',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  // Wholesaler Critical Actions: Orders, Catalog, Retailers
  const wholesalerTabs: BottomTab[] = [
    {
      id: 'wholesaler_portal',
      label: 'Orders',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'wholesaler_catalog',
      label: 'Catalog',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'wholesaler_retailers',
      label: 'Retailers',
      icon: <Building2 className="w-5 h-5" />
    }
  ];

  // Admin Critical Actions: Platform, Stores, Audit
  const adminTabs: BottomTab[] = [
    {
      id: 'admin_dashboard',
      label: 'Platform',
      icon: <Sliders className="w-5 h-5" />
    },
    {
      id: 'admin_stores',
      label: 'Stores',
      icon: <Building2 className="w-5 h-5" />
    },
    {
      id: 'admin_audit',
      label: 'Audit Logs',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  const currentTabs =
    activeModule === 'retailer'
      ? retailerTabs
      : activeModule === 'wholesaler'
      ? wholesalerTabs
      : adminTabs;

  return (
    <nav
      id="native-android-bottom-navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 md:hidden h-16 px-1.5 shadow-2xl flex items-center justify-around select-none safe-area-bottom overflow-hidden"
    >
      {/* Subtle brand backdrop behind the glass mobile bar */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/10 via-slate-900/60 to-teal-600/10 pointer-events-none" />
      {currentTabs.map(tab => {
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            id={`bottom-nav-tab-${tab.id}`}
            onClick={() => onSelectView(tab.id)}
            className="flex-1 h-full min-h-[48px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 group focus:outline-none"
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Material 3 Active Indicator Pill */}
            <div
              className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 shadow-sm shadow-emerald-500/10 scale-105'
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {tab.icon}

              {/* Notification / Alert Badge */}
              {tab.badgeCount !== undefined && (
                <span
                  className={`absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center border border-slate-900 shadow-sm ${
                    tab.highlightBadge
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </div>

            {/* Tab Label */}
            <span
              className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[68px] transition-colors ${
                isActive ? 'font-bold text-emerald-400' : 'font-medium text-slate-400 group-hover:text-slate-300'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
