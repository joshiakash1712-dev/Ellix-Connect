import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldAlert,
  Sliders,
  Database,
  Building2,
  Users,
  Lock,
  Activity,
  Truck,
  Layers,
  Sparkles
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminOverviewSummary } from './AdminOverviewSummary';
import { AdminStores } from './AdminStores';
import { AdminWholesalers } from './AdminWholesalers';
import { AdminUsersRBAC } from './AdminUsersRBAC';
import { AdminDatabaseSync } from './AdminDatabaseSync';
import { AdminSecurity } from './AdminSecurity';
import { AdminAuditTrail } from './AdminAuditTrail';

export type AdminTab = 'overview' | 'stores' | 'wholesalers' | 'users' | 'database' | 'security' | 'audit';

interface AdminPanelProps {
  initialTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  initialTab = 'overview',
  onTabChange
}) => {
  const {
    stores,
    wholesalers,
    employees,
    products,
    invoices,
    customers,
    auditLogs
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const navTabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'overview', label: 'Platform Console', icon: <Sliders className="w-4 h-4" /> },
    { id: 'stores', label: 'Outlets & Franchises', icon: <Building2 className="w-4 h-4" />, badge: stores.length },
    { id: 'wholesalers', label: 'Wholesale Hub', icon: <Truck className="w-4 h-4" />, badge: wholesalers.length },
    { id: 'users', label: 'Staff & RBAC', icon: <Users className="w-4 h-4" />, badge: employees.length },
    { id: 'database', label: 'Database & Sync', icon: <Database className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Hardware', icon: <Lock className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trail', icon: <Activity className="w-4 h-4" />, badge: auditLogs.length }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. TOP ENTERPRISE BANNER & QUICK STATS */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white tracking-tight">Superadmin Control Center</h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Tenant Superuser
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centralized governance for multi-store franchise outlets, B2B supplier hubs, staff RBAC, and JSON backups.
              </p>
            </div>
          </div>
        </div>

        {/* Global Cluster Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Active Outlets</span>
            <span className="text-lg font-black text-white">{stores.length} Branches</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Wholesalers</span>
            <span className="text-lg font-black text-emerald-400">{wholesalers.length} Suppliers</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Roster Staff</span>
            <span className="text-lg font-black text-teal-400">{employees.length} Users</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Compliance</span>
            <span className="text-lg font-black text-indigo-400">100% Audit</span>
          </div>
        </div>
      </div>

      {/* 2. ADMIN OVERVIEW SUMMARY (High-level metrics: Active Users, Account Growth, Roles Assigned, Outlets) */}
      <AdminOverviewSummary onNavigateTab={handleSelectTab} />

      {/* 3. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg overflow-x-auto no-scrollbar">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE SUB-VIEW RENDER */}
      <div>
        {activeTab === 'overview' && (
          <AdminOverview
            onNavigateTab={(tab) => handleSelectTab(tab as AdminTab)}
            onOpenAddStore={() => handleSelectTab('stores')}
          />
        )}

        {activeTab === 'stores' && <AdminStores />}

        {activeTab === 'wholesalers' && <AdminWholesalers />}

        {activeTab === 'users' && <AdminUsersRBAC />}

        {activeTab === 'database' && <AdminDatabaseSync />}

        {activeTab === 'security' && <AdminSecurity />}

        {activeTab === 'audit' && <AdminAuditTrail />}
      </div>

    </div>
  );
};
