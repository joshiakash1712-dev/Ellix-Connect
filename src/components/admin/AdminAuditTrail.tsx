import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Activity,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  ShieldAlert,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditLog } from '../../types';

export const AdminAuditTrail: React.FC = () => {
  const { auditLogs, clearAuditLogs, addAuditLog } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch =
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || log.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [auditLogs, searchQuery, statusFilter]);

  const handleExportAuditCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Details,Status,IPAddress\n';
    const rows = filteredLogs.map(l =>
      `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.details.replace(/"/g, '""')}","${l.status}","${l.ipAddress || '192.168.1.1'}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `ellix-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('Audit Trail Exported', `Generated CSV log report containing ${filteredLogs.length} events`);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to archive and clear current audit log records?')) {
      clearAuditLogs();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Immutable Compliance & System Audit Trail ({auditLogs.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full tamper-evident event log recording user actions, pricing overrides, configuration shifts, and data operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive Logs</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by event action, staff operator, or details..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 shadow-sm capitalize w-full sm:w-auto"
        >
          <option value="all">All Outcomes</option>
          <option value="success">Success Events</option>
          <option value="warning">Warnings / Overrides</option>
          <option value="error">Errors & Breaches</option>
        </select>
      </div>

      {/* Audit Logs Table / Feed */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 text-[11px] uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Details & Context</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        log.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : log.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {log.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {log.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                        {log.status === 'error' && <XCircle className="w-3 h-3" />}
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT INSPECTOR MODAL */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Audit Event Inspector</span>
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-slate-400 font-semibold">Event ID</div>
                  <div className="font-mono text-emerald-400 font-bold">{selectedLog.id}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Operator</span>
                    <span className="font-bold text-white block truncate">{selectedLog.user}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Logged Timestamp</span>
                    <span className="font-mono font-bold text-white block text-[11px]">{selectedLog.timestamp}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-slate-400 font-semibold">Action Trigger</div>
                  <div className="font-bold text-white text-sm">{selectedLog.action}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-slate-400 font-semibold">Event Context & Payload</div>
                  <div className="text-slate-200 leading-relaxed">{selectedLog.details}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Inspector
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
