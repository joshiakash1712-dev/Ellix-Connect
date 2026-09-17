import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Employee } from '../../types';
import {
  ShieldCheck,
  Plus,
  UserCheck,
  Lock,
  Mail,
  Phone,
  CheckCircle,
  X,
  Edit,
  Key
} from 'lucide-react';

export const EmployeeRoles: React.FC = () => {
  const { employees, addEmployee, updateEmployee } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Employee['role']>('manager');
  const [permissions, setPermissions] = useState({
    inventoryEdit: true,
    reports: true,
    employeeManagement: false,
    restockOrders: true
  });

  const handleRoleChange = (newRole: Employee['role']) => {
    setRole(newRole);
    if (newRole === 'owner') {
      setPermissions({ inventoryEdit: true, reports: true, employeeManagement: true, restockOrders: true });
    } else if (newRole === 'manager') {
      setPermissions({ inventoryEdit: true, reports: true, employeeManagement: false, restockOrders: true });
    } else {
      setPermissions({ inventoryEdit: true, reports: false, employeeManagement: false, restockOrders: false });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addEmployee({
      storeId: 'store-1',
      name,
      email,
      phone,
      role,
      permissions,
      status: 'active'
    });
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const toggleStatus = (emp: Employee) => {
    updateEmployee(emp.id, {
      status: emp.status === 'active' ? 'inactive' : 'active'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Staff Roles & Granular Access Controls</span>
          </h2>
          <p className="text-xs text-slate-400">
            Define role permissions for Owners, Managers, Cashiers, and Inventory Staff.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Employee Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Permissions Matrix</th>
                <th className="pb-3 text-right">Status / Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{emp.name}</span>
                      {emp.role === 'owner' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                          PRIMARY OWNER
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 uppercase font-extrabold text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                      {emp.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 text-slate-400">
                    <div>{emp.email}</div>
                    <div className="text-[10px] text-slate-500">{emp.phone}</div>
                  </td>

                  <td className="py-3">
                    <div className="flex flex-wrap gap-1 text-[9px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded ${emp.permissions.inventoryEdit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'}`}>
                        Inventory Control
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${emp.permissions.reports ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'}`}>
                        Reports & GST
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${emp.permissions.employeeManagement ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'}`}>
                        Staff Admin
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${emp.permissions.restockOrders ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'}`}>
                        Wholesale Restock
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={() => toggleStatus(emp)}
                      disabled={emp.role === 'owner'}
                      className={`px-3 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                        emp.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {emp.status.toUpperCase()}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kavita Vernekar"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Role Type</label>
                <select
                  value={role}
                  onChange={e => handleRoleChange(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="inventory_staff">Inventory Staff</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Add Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
