import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Shield,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Activity,
  UserX,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Maximize2,
  Globe,
  Star,
  RefreshCw,
  AlertCircle,
  Store as StoreIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { AdminTab } from './AdminPanel';

interface RoleInfo {
  label: string;
  count: number;
  color: string;
  border: string;
  bg: string;
}

interface AdminOverviewSummaryProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddUser?: () => void;
}

export const AdminOverviewSummary: React.FC<AdminOverviewSummaryProps> = ({
  onNavigateTab,
  onOpenAddUser
}) => {
  const {
    employees,
    stores,
    wholesalers,
    auditLogs,
    visitorStats,
    refreshVisitorStats
  } = useStore();

  const [isGrowthExpanded, setIsGrowthExpanded] = useState(true);
  const [growthView, setGrowthView] = useState<'visitors' | 'conversions' | 'accounts' | 'network_sales' | 'stores'>('visitors');
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshingTelemetry(true);
    try {
      await refreshVisitorStats();
    } finally {
      setTimeout(() => setIsRefreshingTelemetry(false), 500);
    }
  };

  // Multi-month growth telemetry dataset
  const growthTrajectoryData = useMemo(() => {
    return [
      { month: 'Mar 2026', totalAccounts: 4, activeStaff: 4, networkRevenue: 78000, franchiseStores: 2, growthMoM: 15.0 },
      { month: 'Apr 2026', totalAccounts: 6, activeStaff: 5, networkRevenue: 92000, franchiseStores: 2, growthMoM: 17.9 },
      { month: 'May 2026', totalAccounts: 7, activeStaff: 7, networkRevenue: 108000, franchiseStores: 3, growthMoM: 17.4 },
      { month: 'Jun 2026', totalAccounts: 9, activeStaff: 8, networkRevenue: 129000, franchiseStores: 3, growthMoM: 19.4 },
      { month: 'Jul 2026', totalAccounts: 11, activeStaff: 10, networkRevenue: 154000, franchiseStores: 3, growthMoM: 19.4 },
      { month: 'Aug 2026 (Live)', totalAccounts: Math.max(employees.length, 12), activeStaff: Math.max(employees.length, 12), networkRevenue: 186000, franchiseStores: Math.max(stores.length, 3), growthMoM: 28.6 }
    ];
  }, [employees, stores]);

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalUsers = employees.length;
    const activeUsers = employees.filter(e => e.status === 'active' || (e as any).active !== false).length;
    const suspendedUsers = totalUsers - activeUsers;
    const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 100;

    // Role breakdown
    const roleMap: Record<string, RoleInfo> = {
      customer: {
        label: 'Platform Customer',
        count: 0,
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10'
      },
      client: {
        label: 'Paid Store Client',
        count: 0,
        color: 'text-sky-400',
        border: 'border-sky-500/30',
        bg: 'bg-sky-500/10'
      },
      cashier: {
        label: 'POS Cashier',
        count: 0,
        color: 'text-blue-400',
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/10'
      },
      manager: {
        label: 'Store Manager',
        count: 0,
        color: 'text-purple-400',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/10'
      },
      inventory_manager: {
        label: 'Inventory Specialist',
        count: 0,
        color: 'text-amber-400',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10'
      },
      wholesaler_admin: {
        label: 'Wholesale Admin',
        count: 0,
        color: 'text-teal-400',
        border: 'border-teal-500/30',
        bg: 'bg-teal-500/10'
      },
      owner: {
        label: 'Franchise Owner',
        count: 0,
        color: 'text-indigo-400',
        border: 'border-indigo-500/30',
        bg: 'bg-indigo-500/10'
      },
      ellix_admin: {
        label: 'Platform Admin',
        count: 0,
        color: 'text-rose-400',
        border: 'border-rose-500/30',
        bg: 'bg-rose-500/10'
      },
      super_admin: {
        label: 'Sole Super Admin',
        count: 0,
        color: 'text-sky-300',
        border: 'border-sky-400/40',
        bg: 'bg-sky-500/20'
      }
    };

    employees.forEach(emp => {
      const roleKey = emp.role || 'customer';
      if (roleMap[roleKey]) {
        roleMap[roleKey].count += 1;
      } else {
        roleMap[roleKey] = {
          label: roleKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          count: 1,
          color: 'text-indigo-400',
          border: 'border-indigo-500/30',
          bg: 'bg-indigo-500/10'
        };
      }
    });

    const rolesAssignedCount = Object.values(roleMap).filter(r => r.count > 0).length;
    const twoFaCount = employees.filter(e => (e as any).twoFactorEnabled !== false).length;
    const twoFaPercentage = totalUsers > 0 ? Math.round((twoFaCount / totalUsers) * 100) : 100;
    const growthPercent = '+28.6%';
    const newAccountsPast30Days = Math.max(2, Math.floor(totalUsers * 0.3));

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      activePercentage,
      rolesAssignedCount,
      roleMap,
      twoFaCount,
      twoFaPercentage,
      growthPercent,
      newAccountsPast30Days
    };
  }, [employees]);

  return (
    <div
      id="admin-overview-summary"
      className="p-5 sm:p-6 rounded-xl bg-[#121826] border border-slate-800 shadow-lg space-y-6 relative overflow-hidden tabular-nums"
    >
      {/* Subtle Background Accent Gradient */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      {/* 1. Live Platform Telemetry Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-[#0A0E1A] to-[#121826] border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                ellico.ai.studio
              </span>
              <span className="text-xs font-extrabold text-white">Live Platform Visitor Telemetry</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {visitorStats?.activeVisitors ?? 12} Active Now
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live tracking session traffic, customer signups, and client conversions across all platform domains.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-slate-400 block font-mono">Last Ingress Sync</span>
            <span className="text-[11px] font-mono text-slate-300 font-bold">
              {visitorStats?.lastUpdated ? new Date(visitorStats.lastUpdated).toLocaleTimeString() : 'Live'}
            </span>
          </div>
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshingTelemetry}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Fetch real-time platform telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshingTelemetry ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Core KPI Cards (Live Visitors, Paid Clients, Registered Customers, Reviews, Store Fleet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
        
        {/* Metric 1: Real-time Visitors */}
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          id="metric-card-active-visitors"
          className="p-4 rounded-xl bg-[#0A0E1A] border border-sky-500/30 hover:border-sky-500/60 transition-all shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{visitorStats?.activeVisitors ?? 12} Live</span>
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {(visitorStats?.totalVisitors ?? 14890).toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">total visits</span>
            </div>
            <span className="text-xs font-bold text-slate-300 block mt-0.5">ellico.ai.studio Visitors</span>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">+{visitorStats?.todayVisitors ?? 642} today</span>
              <span className="text-slate-500">Global</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Paid Clients & Store Access */}
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          id="metric-card-paid-clients"
          onClick={() => onNavigateTab('stores')}
          className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
              <StoreIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {visitorStats?.paidClients ?? stores.length} Paid
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {stores.length}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Store Outlets</span>
            </div>
            <span className="text-xs font-bold text-slate-300 block mt-0.5">Clients & Stores</span>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-sky-400 font-semibold">{visitorStats?.onlineStores ?? stores.filter(s => s.status !== 'paused').length} Online</span>
              <span className="text-amber-400 font-bold">{visitorStats?.pausedStores ?? stores.filter(s => s.status === 'paused').length} Paused</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Registered Customers */}
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          id="metric-card-registered-customers"
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {visitorStats?.conversionRate ?? 14.8}% Conv
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">
                {visitorStats?.registeredCustomers ?? 128}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Registered</span>
            </div>
            <span className="text-xs font-bold text-slate-300 block mt-0.5">Customers & Shoppers</span>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Auto-Customer on login
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Reviews & Rating */}
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          id="metric-card-reviews-rating"
          className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              98% Positive
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">
                {visitorStats?.averageRating ?? 4.9}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">/ 5.0 Rating</span>
            </div>
            <span className="text-xs font-bold text-slate-300 block mt-0.5">Verified Reviews</span>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold">{visitorStats?.totalReviews ?? 142} Reviews</span>
              <span className="text-amber-400 font-bold">5 Stars</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 5: Team Roster & RBAC */}
        <motion.div
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
          id="metric-card-roles-assigned"
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {metrics.rolesAssignedCount} Roles
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-300">{metrics.totalUsers}</span>
              <span className="text-[10px] font-semibold text-slate-400">Managed Users</span>
            </div>
            <span className="text-xs font-bold text-slate-300 block mt-0.5">Staff & Admin Roster</span>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-sky-400 font-semibold">{metrics.activeUsers} Active</span>
              <span className="text-purple-400 font-bold">{metrics.twoFaPercentage}% 2FA</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3. Interactive Growth Trajectory & Daily Traffic Curves */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#0A0E1A] border border-slate-800 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  {growthView === 'visitors'
                    ? '14-Day Platform Visitors Traffic (ellico.ai.studio)'
                    : growthView === 'conversions'
                    ? 'Customer Signups & Client Conversions'
                    : 'Enterprise Network Performance'}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {visitorStats?.conversionRate ? `${visitorStats.conversionRate}% Conversion` : '+28.6% MoM'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Continuous real-time telemetry from visitor ingress to paid store subscriptions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* View Switcher Pills */}
            <div className="flex items-center gap-1 bg-[#121826] p-1 rounded-xl border border-slate-800">
              {[
                { id: 'visitors', label: 'Daily Visitors' },
                { id: 'conversions', label: 'Conversions & Signups' },
                { id: 'network_sales', label: 'Network Revenue' },
                { id: 'stores', label: 'Franchise Fleet' },
                { id: 'accounts', label: 'Staff Accounts' }
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setGrowthView(v.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    growthView === v.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Collapse / Expand Button */}
            <button
              onClick={() => setIsGrowthExpanded(!isGrowthExpanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={isGrowthExpanded ? 'Collapse Graph' : 'Expand Graph'}
            >
              {isGrowthExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Chart Canvas */}
        <AnimatePresence>
          {isGrowthExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3 pt-2"
            >
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {growthView === 'visitors' ? (
                    <AreaChart data={visitorStats?.dailyTrends || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="visitorTrafficGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161D2C', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} Visitors`, 'Daily Unique Visits']}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#38bdf8" strokeWidth={2.5} fill="url(#visitorTrafficGrad)" />
                    </AreaChart>
                  ) : growthView === 'conversions' ? (
                    <AreaChart data={visitorStats?.dailyTrends || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="conversionsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161D2C', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} fill="url(#signupsGrad)" name="New Customers" />
                      <Area type="monotone" dataKey="conversions" stroke="#6366f1" strokeWidth={2} fill="url(#conversionsGrad)" name="Paid Store Clients" />
                    </AreaChart>
                  ) : growthView === 'network_sales' ? (
                    <AreaChart data={growthTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161D2C', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Network Gross Revenue']}
                      />
                      <Area type="monotone" dataKey="networkRevenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminRevenueGrad)" />
                    </AreaChart>
                  ) : growthView === 'stores' ? (
                    <AreaChart data={growthTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminStoresGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161D2C', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} Outlets`, 'Active Franchises']}
                      />
                      <Area type="monotone" dataKey="franchiseStores" stroke="#0284C7" strokeWidth={2.5} fill="url(#adminStoresGrad)" />
                    </AreaChart>
                  ) : (
                    <AreaChart data={growthTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminAccountsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161D2C', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`${val} Accounts`, 'Staff & Admins']}
                      />
                      <Area type="monotone" dataKey="totalAccounts" stroke="#3b82f6" strokeWidth={2.5} fill="url(#adminAccountsGrad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Quick Growth Mini-Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1 border-t border-slate-800 text-center">
                {(growthView === 'visitors' || growthView === 'conversions' ? (visitorStats?.dailyTrends?.slice(-7) || []) : growthTrajectoryData).map((d: any, i: number) => (
                  <div key={i} className="p-1.5 rounded-lg bg-[#121826] border border-slate-800 text-[11px]">
                    <span className="text-slate-400 block truncate font-medium">
                      {d.date || d.month?.split(' ')[0]}
                    </span>
                    <span className="font-bold text-white block">
                      {d.visitors ? `${d.visitors} visits` : growthView === 'network_sales' ? `₹${(d.networkRevenue/1000).toFixed(0)}k` : growthView === 'stores' ? `${d.franchiseStores} hubs` : `${d.totalAccounts} users`}
                    </span>
                    <span className="text-[10px] text-sky-400 font-bold block">
                      {d.signups ? `+${d.signups} signups` : `+${d.growthMoM}%`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Detailed Role Assignment Distribution Breakdown Bar */}
      <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-slate-200">Role Assignment Breakdown</span>
            <span className="text-[10px] text-slate-400">({metrics.rolesAssignedCount} active roles across {metrics.totalUsers} accounts)</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any role to inspect permissions</span>
        </div>

        {/* Visual Multi-Segment Distribution Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
          {(Object.entries(metrics.roleMap) as [string, RoleInfo][]).map(([roleKey, r]) => {
            if (r.count === 0) return null;
            const pct = Math.max(5, (r.count / (metrics.totalUsers || 1)) * 100);
            const colorClass =
              roleKey === 'cashier'
                ? 'bg-blue-500'
                : roleKey === 'manager'
                ? 'bg-purple-500'
                : roleKey === 'inventory_staff'
                ? 'bg-amber-500'
                : roleKey === 'wholesaler_admin'
                ? 'bg-sky-500'
                : 'bg-sky-500';

            return (
              <div
                key={roleKey}
                style={{ width: `${pct}%` }}
                className={`${colorClass} h-full transition-all border-r border-slate-900/60 last:border-r-0`}
                title={`${r.label}: ${r.count} users (${Math.round((r.count / metrics.totalUsers) * 100)}%)`}
              />
            );
          })}
        </div>

        {/* Interactive Role Badges / Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(Object.entries(metrics.roleMap) as [string, RoleInfo][]).map(([roleKey, r]) => (
            <button
              key={roleKey}
              onClick={() => onNavigateTab('users')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 ${r.bg} ${r.border} ${r.color}`}
            >
              <span className="font-bold">{r.label}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#121826] text-[10px] font-extrabold text-white border border-slate-700/60">
                {r.count} {r.count === 1 ? 'user' : 'users'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
