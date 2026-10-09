import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  History,
  FileBarChart,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Store,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { currentUser, logout } = useInventory();
  const [inventoryOpen, setInventoryOpen] = useState(
    activeTab.startsWith('stock-') || activeTab === 'movements'
  );
  const [reportsOpen, setReportsOpen] = useState(activeTab === 'reports');

  const isAdmin = currentUser?.role === 'Administrator';
  const isManager = currentUser?.role === 'Manager';
  const isStaff = currentUser?.role === 'Inventory Staff';

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight text-base">Gulfmart</h2>
              <p className="text-xs text-emerald-400 font-medium">Inventory System</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar">
          {/* Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Products */}
          <button
            onClick={() => handleNav('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          {/* Categories (Admin & Manager) */}
          {!isStaff && (
            <button
              onClick={() => handleNav('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'categories'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>
          )}

          {/* Suppliers */}
          {!isStaff && (
            <button
              onClick={() => handleNav('suppliers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'suppliers'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Suppliers</span>
            </button>
          )}

          {/* Inventory Group */}
          <div className="pt-2">
            <button
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
            >
              <span>Inventory Actions</span>
              {inventoryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {(inventoryOpen || activeTab.startsWith('stock-') || activeTab === 'movements') && (
              <div className="mt-1 space-y-1 pl-2 border-l border-slate-800 ml-3">
                <button
                  onClick={() => handleNav('stock-in')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'stock-in'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stock-In</span>
                </button>

                <button
                  onClick={() => handleNav('stock-out')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'stock-out'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stock-Out</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNav('adjustment')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'adjustment'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Stock Adjustment</span>
                  </button>
                )}

                <button
                  onClick={() => handleNav('movements')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'movements'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-purple-400" />
                  <span>Movement History</span>
                </button>
              </div>
            )}
          </div>

          {/* Reports (Admin & Manager) */}
          {!isStaff && (
            <button
              onClick={() => handleNav('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileBarChart className="w-4 h-4" />
              <span>Reports & Export</span>
            </button>
          )}

          {/* User Management (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => handleNav('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </button>
          )}

          {/* Audit Logs (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => handleNav('audit-logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'audit-logs'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
          )}

          {/* Settings */}
          {isAdmin && (
            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          )}
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 flex items-center justify-center font-bold text-sm">
              {currentUser?.full_name[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{currentUser?.full_name}</p>
              <span className="inline-block text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-full font-semibold">
                {currentUser?.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-red-950/50 hover:text-red-400 text-slate-300 rounded-xl text-xs font-medium transition-all border border-slate-700/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
