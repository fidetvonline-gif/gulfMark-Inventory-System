import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ActiveTab } from '../types';
import { Menu, Plus, ArrowDownRight, ArrowUpRight, Shield, UserCheck } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, setMobileOpen }) => {
  const { currentUser, switchUserRole, users } = useInventory();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Product Inventory Catalog';
      case 'categories': return 'Product Categories';
      case 'suppliers': return 'Supplier Management';
      case 'stock-in': return 'Record Stock-In (Goods Receipt)';
      case 'stock-out': return 'Record Stock-Out (Dispatch / Sales)';
      case 'adjustment': return 'Stock Quantity Adjustment';
      case 'movements': return 'Stock Movement History Log';
      case 'reports': return 'Inventory Reports & Export';
      case 'users': return 'System User Accounts';
      case 'audit-logs': return 'Security & Activity Audit Logs';
      case 'settings': return 'System Configuration & Settings';
      default: return 'Gulfmart Supermarket';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">Gulfmart Supermarket Inventory Management System</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Quick Action buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stock-in')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-all"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Stock-In</span>
          </button>
          <button
            onClick={() => setActiveTab('stock-out')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Stock-Out</span>
          </button>
        </div>

        {/* Role switcher for easy demo testing */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] font-semibold text-slate-500 uppercase px-2 hidden sm:inline">Role:</span>
          {['Administrator', 'Manager', 'Inventory Staff'].map((role) => {
            const isCurrent = currentUser?.role === role;
            return (
              <button
                key={role}
                onClick={() => switchUserRole(role)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={`Switch session to ${role}`}
              >
                {role === 'Administrator' ? 'Admin' : role === 'Manager' ? 'Manager' : 'Staff'}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
