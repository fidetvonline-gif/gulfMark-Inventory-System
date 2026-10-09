import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ActiveTab, MovementType } from '../types';
import {
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  History,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

interface InventoryOperationsViewProps {
  initialSubTab?: 'stock-in' | 'stock-out' | 'adjustment' | 'movements';
}

export const InventoryOperationsView: React.FC<InventoryOperationsViewProps> = ({ initialSubTab = 'stock-in' }) => {
  const {
    products,
    suppliers,
    stockMovements,
    recordStockIn,
    recordStockOut,
    recordStockAdjustment,
    currentUser
  } = useInventory();

  const [subTab, setSubTab] = useState<'stock-in' | 'stock-out' | 'adjustment' | 'movements'>(initialSubTab);

  // Stock-In Form State
  const [inProductId, setInProductId] = useState(products[0]?.id || '');
  const [inQty, setInQty] = useState(10);
  const [inSupplierId, setInSupplierId] = useState(suppliers[0]?.id || '');
  const [inUnitCost, setInUnitCost] = useState(products[0]?.cost_price || 1000);
  const [inRef, setInRef] = useState(`REF-${Math.floor(10000 + Math.random() * 90000)}`);
  const [inRemarks, setInRemarks] = useState('Standard restock delivery');

  // Stock-Out Form State
  const [outProductId, setOutProductId] = useState(products[0]?.id || '');
  const [outQty, setOutQty] = useState(5);
  const [outReason, setOutReason] = useState('Sales');
  const [outRef, setOutRef] = useState(`SO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [outRemarks, setOutRemarks] = useState('Counter checkout');
  const [outError, setOutError] = useState('');

  // Adjustment Form State
  const [adjProductId, setAdjProductId] = useState(products[0]?.id || '');
  const [adjNewQty, setAdjNewQty] = useState(products[0]?.quantity || 0);
  const [adjReason, setAdjReason] = useState('Damaged products');
  const [adjRemarks, setAdjRemarks] = useState('Physical count discrepancy');

  // Movement history search / filter
  const [movementSearch, setMovementSearch] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('ALL');

  const selectedInProduct = products.find((p) => p.id === inProductId);
  const selectedOutProduct = products.find((p) => p.id === outProductId);
  const selectedAdjProduct = products.find((p) => p.id === adjProductId);

  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = recordStockIn(inProductId, Number(inQty), inSupplierId, Number(inUnitCost), inRef, inRemarks);
    if (success) {
      setInRef(`REF-${Math.floor(10000 + Math.random() * 90000)}`);
      setInQty(10);
    }
  };

  const handleStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOutError('');
    const result = recordStockOut(outProductId, Number(outQty), outReason, outRef, outRemarks);
    if (!result.success) {
      setOutError(result.error || 'Insufficient stock.');
    } else {
      setOutRef(`SO-${Math.floor(10000 + Math.random() * 90000)}`);
      setOutQty(5);
    }
  };

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdjProduct) return;
    const diff = Number(adjNewQty) - selectedAdjProduct.quantity;
    const type = diff >= 0 ? 'Increase' : 'Decrease';
    recordStockAdjustment(adjProductId, Number(adjNewQty), type, adjReason, adjRemarks);
  };

  const filteredMovements = stockMovements.filter((m) => {
    const p = products.find((prod) => prod.id === m.product_id);
    const pName = p?.name.toLowerCase() || '';
    const matchesSearch = pName.includes(movementSearch.toLowerCase()) || m.reference.toLowerCase().includes(movementSearch.toLowerCase()) || m.user_name.toLowerCase().includes(movementSearch.toLowerCase());
    const matchesType = movementTypeFilter === 'ALL' || m.movement_type === movementTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setSubTab('stock-in')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'stock-in'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>Record Stock-In</span>
        </button>

        <button
          onClick={() => setSubTab('stock-out')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'stock-out'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Record Stock-Out</span>
        </button>

        {currentUser?.role === 'Administrator' && (
          <button
            onClick={() => setSubTab('adjustment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'adjustment'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Stock Adjustment</span>
          </button>
        )}

        <button
          onClick={() => setSubTab('movements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'movements'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Movement History</span>
        </button>
      </div>

      {/* Stock-In Panel */}
      {subTab === 'stock-in' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Stock-In (Goods Receipt)</h3>
              <p className="text-xs text-slate-500">Record incoming products from suppliers and increase stock quantity</p>
            </div>
          </div>

          <form onSubmit={handleStockInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select Product</label>
              <select
                value={inProductId}
                onChange={(e) => {
                  setInProductId(e.target.value);
                  const p = products.find((prod) => prod.id === e.target.value);
                  if (p) setInUnitCost(p.cost_price);
                }}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              >
                {products.filter(p => p.status === 'Active').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current Stock: {p.quantity} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantity Received</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={inQty}
                  onChange={(e) => setInQty(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-600"
                />
                {selectedInProduct && (
                  <p className="text-[11px] text-emerald-700 mt-1">
                    New total after stock-in: <strong>{selectedInProduct.quantity + Number(inQty)}</strong> {selectedInProduct.unit}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supplier</label>
                <select
                  value={inSupplierId}
                  onChange={(e) => setInSupplierId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Unit Cost Price (₦)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={inUnitCost}
                  onChange={(e) => setInUnitCost(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reference Number</label>
                <input
                  type="text"
                  required
                  value={inRef}
                  onChange={(e) => setInRef(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Remarks / Notes</label>
              <textarea
                rows={2}
                value={inRemarks}
                onChange={(e) => setInRemarks(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Record Stock-In</span>
            </button>
          </form>
        </div>
      )}

      {/* Stock-Out Panel */}
      {subTab === 'stock-out' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Stock-Out (Sales / Dispatch)</h3>
              <p className="text-xs text-slate-500">Record inventory removal with strict stock validation</p>
            </div>
          </div>

          {outError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Transaction Rejected:</strong> {outError}
              </div>
            </div>
          )}

          <form onSubmit={handleStockOutSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select Product</label>
              <select
                value={outProductId}
                onChange={(e) => setOutProductId(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              >
                {products.filter(p => p.status === 'Active').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Available: {p.quantity} {p.unit})
                  </option>
                ))}
              </select>
              {selectedOutProduct && (
                <p className="text-xs text-slate-500 mt-1">
                  Available Quantity: <strong className="text-slate-900">{selectedOutProduct.quantity} {selectedOutProduct.unit}</strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantity to Remove</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={outQty}
                  onChange={(e) => setOutQty(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-600"
                />
                {selectedOutProduct && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Remaining after removal: <strong>{Math.max(0, selectedOutProduct.quantity - Number(outQty))}</strong>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reason</label>
                <select
                  value={outReason}
                  onChange={(e) => setOutReason(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Sales">Customer Sales</option>
                  <option value="Damaged">Damaged / Expired</option>
                  <option value="Transfer">Branch Transfer</option>
                  <option value="Internal Use">Store Internal Use</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reference / Invoice Number</label>
              <input
                type="text"
                required
                value={outRef}
                onChange={(e) => setOutRef(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Remarks</label>
              <textarea
                rows={2}
                value={outRemarks}
                onChange={(e) => setOutRemarks(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Record Stock-Out</span>
            </button>
          </form>
        </div>
      )}

      {/* Stock Adjustment Panel */}
      {subTab === 'adjustment' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Stock Quantity Adjustment</h3>
              <p className="text-xs text-slate-500">Reconcile physical stock count with system records</p>
            </div>
          </div>

          <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select Product</label>
              <select
                value={adjProductId}
                onChange={(e) => {
                  setAdjProductId(e.target.value);
                  const p = products.find((prod) => prod.id === e.target.value);
                  if (p) setAdjNewQty(p.quantity);
                }}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              >
                {products.filter(p => p.status === 'Active').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (System Stock: {p.quantity} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Current System Quantity</label>
                <input
                  type="text"
                  disabled
                  value={selectedAdjProduct?.quantity || 0}
                  className="w-full px-3.5 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Physical Count (Actual Qty)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjNewQty}
                  onChange={(e) => setAdjNewQty(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-600"
                />
                {selectedAdjProduct && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Difference: <strong className={adjNewQty - selectedAdjProduct.quantity >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                      {adjNewQty - selectedAdjProduct.quantity >= 0 ? `+${adjNewQty - selectedAdjProduct.quantity}` : adjNewQty - selectedAdjProduct.quantity}
                    </strong>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reason for Adjustment</label>
              <input
                type="text"
                required
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                placeholder="e.g. Physical stock audit discrepancy, Damaged items"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Remarks</label>
              <textarea
                rows={2}
                value={adjRemarks}
                onChange={(e) => setAdjRemarks(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Confirm Stock Adjustment</span>
            </button>
          </form>
        </div>
      )}

      {/* Movement History Panel */}
      {subTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={movementSearch}
                onChange={(e) => setMovementSearch(e.target.value)}
                placeholder="Search by product, ref, user..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <select
              value={movementTypeFilter}
              onChange={(e) => setMovementTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 w-full md:w-auto"
            >
              <option value="ALL">All Movement Types</option>
              <option value="STOCK_IN">Stock-In</option>
              <option value="STOCK_OUT">Stock-Out</option>
              <option value="ADJUSTMENT_IN">Adjustment (Increase)</option>
              <option value="ADJUSTMENT_OUT">Adjustment (Decrease)</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4 text-center">Qty Change</th>
                  <th className="py-3.5 px-4 text-center">Prev → New</th>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                      No stock movements recorded matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m) => {
                    const prod = products.find((p) => p.id === m.product_id);
                    const dateObj = new Date(m.created_at);
                    const isIncoming = m.movement_type === 'STOCK_IN' || m.movement_type === 'ADJUSTMENT_IN';

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                          {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{prod?.name || 'Unknown Product'}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              m.movement_type === 'STOCK_IN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.movement_type === 'STOCK_OUT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {m.movement_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-center font-bold ${isIncoming ? 'text-emerald-700' : 'text-red-600'}`}>
                          {isIncoming ? `+${m.quantity}` : `-${m.quantity}`}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-600 font-mono">
                          {m.previous_quantity} → {m.new_quantity}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-600">{m.reference}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-800">{m.user_name}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
