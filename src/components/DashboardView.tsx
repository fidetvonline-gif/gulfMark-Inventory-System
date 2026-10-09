import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ActiveTab } from '../types';
import {
  Package,
  FolderTree,
  Truck,
  AlertTriangle,
  XCircle,
  Activity,
  ArrowRight,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { products, categories, suppliers, stockMovements, auditLogs, currentUser } = useInventory();

  // Calculations
  const totalProducts = products.filter(p => p.status === 'Active').length;
  const totalCategories = categories.filter(c => c.status === 'Active').length;
  const totalSuppliers = suppliers.filter(s => s.status === 'Active').length;

  const lowStockProducts = products.filter(p => p.status === 'Active' && p.quantity > 0 && p.quantity <= p.reorder_level);
  const outOfStockProducts = products.filter(p => p.status === 'Active' && p.quantity === 0);

  // Stock movements today
  const todayStr = new Date().toISOString().split('T')[0];
  const movementsToday = stockMovements.filter(m => m.created_at.startsWith(todayStr)).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/50">
            Active Session: {currentUser?.full_name} ({currentUser?.role})
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold mt-3 tracking-tight">
            Welcome to Gulfmart Inventory Hub
          </h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time supermarket stock monitoring, automated reorder alerts, and digital movement records replacing manual notebooks.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setActiveTab('stock-in')}
              className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-700" />
              <span>Record Stock-In</span>
            </button>
            <button
              onClick={() => setActiveTab('stock-out')}
              className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border border-emerald-600/50 transition-all flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
              <span>Record Stock-Out</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-sky-400" />
              <span>View Product Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setActiveTab('products')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalProducts}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Total Products</p>
        </div>

        <div
          onClick={() => setActiveTab('categories')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalCategories}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Categories</p>
        </div>

        <div
          onClick={() => setActiveTab('suppliers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalSuppliers}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Suppliers</p>
        </div>

        <div
          onClick={() => setActiveTab('products')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
            {lowStockProducts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{lowStockProducts.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Low Stock</p>
        </div>

        <div
          onClick={() => setActiveTab('products')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <XCircle className="w-5 h-5" />
            </div>
            {outOfStockProducts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{outOfStockProducts.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Out of Stock</p>
        </div>

        <div
          onClick={() => setActiveTab('movements')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{movementsToday}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Movements Today</p>
        </div>
      </div>

      {/* Main Grid: Low Stock Products & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Products Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Low Stock & Out of Stock Alerts</h3>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 text-center">Current Stock</th>
                  <th className="py-3 px-3 text-center">Reorder Level</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {[...lowStockProducts, ...outOfStockProducts].length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      All products have healthy stock levels. No low stock alerts!
                    </td>
                  </tr>
                ) : (
                  [...lowStockProducts, ...outOfStockProducts].map((p) => {
                    const isOut = p.quantity === 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-medium text-slate-900">{p.name}</td>
                        <td className="py-3.5 px-3 text-slate-500 text-xs font-mono">{p.sku}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-slate-800">{p.quantity} {p.unit}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500">{p.reorder_level}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isOut
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
            </div>
            {currentUser?.role === 'Administrator' && (
              <button
                onClick={() => setActiveTab('audit-logs')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View Audit Trail
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[340px] pr-1">
            {auditLogs.slice(0, 6).map((log) => {
              const dateObj = new Date(log.created_at);
              const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {log.user_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 leading-snug">
                      <strong className="text-slate-900">{log.user_name}</strong> {log.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {dateObj.toLocaleDateString()} at {timeStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
