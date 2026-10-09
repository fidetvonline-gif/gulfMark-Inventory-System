import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { FileText, Download, Printer, Filter, AlertTriangle, XCircle, Package } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { products, categories, suppliers, stockMovements } = useInventory();
  const [reportType, setReportType] = useState<'inventory' | 'low-stock' | 'movements' | 'out-of-stock'>('inventory');

  // Filters
  const [catFilter, setCatFilter] = useState('ALL');
  const [supFilter, setSupFilter] = useState('ALL');

  // CSV Export helper
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'inventory') {
      filename = 'eulfmark_inventory_report.csv';
      csvContent = 'Product Name,SKU,Category,Supplier,Quantity,Reorder Level,Cost Price (NGN),Selling Price (NGN),Status\n';
      products.forEach((p) => {
        const cat = categories.find((c) => c.id === p.category_id)?.name || '';
        const sup = suppliers.find((s) => s.id === p.supplier_id)?.name || '';
        const status = p.quantity === 0 ? 'Out of Stock' : p.quantity <= p.reorder_level ? 'Low Stock' : 'In Stock';
        csvContent += `"${p.name}","${p.sku}","${cat}","${sup}",${p.quantity},${p.reorder_level},${p.cost_price},${p.selling_price},"${status}"\n`;
      });
    } else if (reportType === 'low-stock') {
      filename = 'eulfmark_low_stock_report.csv';
      csvContent = 'Product Name,SKU,Category,Current Stock,Reorder Level,Status\n';
      products.filter((p) => p.quantity > 0 && p.quantity <= p.reorder_level).forEach((p) => {
        const cat = categories.find((c) => c.id === p.category_id)?.name || '';
        csvContent += `"${p.name}","${p.sku}","${cat}",${p.quantity},${p.reorder_level},"Low Stock"\n`;
      });
    } else if (reportType === 'out-of-stock') {
      filename = 'eulfmark_out_of_stock_report.csv';
      csvContent = 'Product Name,SKU,Category,Supplier,Reorder Level\n';
      products.filter((p) => p.quantity === 0).forEach((p) => {
        const cat = categories.find((c) => c.id === p.category_id)?.name || '';
        const sup = suppliers.find((s) => s.id === p.supplier_id)?.name || '';
        csvContent += `"${p.name}","${p.sku}","${cat}","${sup}",${p.reorder_level}\n`;
      });
    } else {
      filename = 'eulfmark_stock_movements_report.csv';
      csvContent = 'Date,Product,Type,Quantity Change,Previous Qty,New Qty,Reference,User\n';
      stockMovements.forEach((m) => {
        const p = products.find((prod) => prod.id === m.product_id)?.name || '';
        csvContent += `"${m.created_at}","${p}","${m.movement_type}",${m.quantity},${m.previous_quantity},${m.new_quantity},"${m.reference}","${m.user_name}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = catFilter === 'ALL' || p.category_id === catFilter;
    const matchesSup = supFilter === 'ALL' || p.supplier_id === supFilter;
    return matchesCat && matchesSup;
  });

  const lowStockList = filteredProducts.filter((p) => p.quantity > 0 && p.quantity <= p.reorder_level);
  const outOfStockList = filteredProducts.filter((p) => p.quantity === 0);

  return (
    <div className="space-y-6">
      {/* Report Switcher & Export buttons */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setReportType('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'inventory' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Inventory Report
          </button>
          <button
            onClick={() => setReportType('low-stock')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'low-stock' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Low Stock Report
          </button>
          <button
            onClick={() => setReportType('out-of-stock')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'out-of-stock' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Out of Stock Report
          </button>
          <button
            onClick={() => setReportType('movements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'movements' ? 'bg-purple-700 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Movement Report
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6 printable-report">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {reportType === 'inventory' && 'Gulfmart Supermarket — Complete Inventory Report'}
              {reportType === 'low-stock' && 'Gulfmart Supermarket — Low Stock Attention Report'}
              {reportType === 'out-of-stock' && 'Gulfmart Supermarket — Out-of-Stock Products Report'}
              {reportType === 'movements' && 'Gulfmart Supermarket — Stock Movement Audit Report'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} by Authorised Personnel
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            Total Records: {
              reportType === 'inventory' ? filteredProducts.length :
              reportType === 'low-stock' ? lowStockList.length :
              reportType === 'out-of-stock' ? outOfStockList.length :
              stockMovements.length
            }
          </div>
        </div>

        {/* Report Tables */}
        {reportType === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-center">Quantity</th>
                  <th className="py-3 px-3 text-right">Cost Price</th>
                  <th className="py-3 px-3 text-right">Selling Price</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id)?.name;
                  const sup = suppliers.find((s) => s.id === p.supplier_id)?.name;
                  const isOut = p.quantity === 0;
                  const isLow = p.quantity > 0 && p.quantity <= p.reorder_level;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">{p.sku}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{cat}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{sup}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{p.quantity} {p.unit}</td>
                      <td className="py-3 px-3 text-right text-slate-600">₦{p.cost_price.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-800">₦{p.selling_price.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'low-stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50 border-b border-amber-200 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Current Stock</th>
                  <th className="py-3 px-3 text-center">Reorder Level</th>
                  <th className="py-3 px-3 text-right">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {lowStockList.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-xs">No low stock items.</td></tr>
                ) : (
                  lowStockList.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">{p.sku}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{categories.find(c => c.id === p.category_id)?.name}</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-800">{p.quantity} {p.unit}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{p.reorder_level}</td>
                      <td className="py-3 px-3 text-right font-semibold text-amber-700 text-xs">Restock Recommended</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'out-of-stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50 border-b border-red-200 text-xs font-semibold text-red-900 uppercase tracking-wider">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {outOfStockList.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-xs">No out-of-stock items.</td></tr>
                ) : (
                  outOfStockList.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">{p.sku}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{categories.find(c => c.id === p.category_id)?.name}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{suppliers.find(s => s.id === p.supplier_id)?.name}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Out of Stock</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'movements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {stockMovements.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 px-3 text-xs text-slate-600">{new Date(m.created_at).toLocaleString()}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{products.find(p => p.id === m.product_id)?.name}</td>
                    <td className="py-3 px-3 text-xs font-semibold text-slate-700">{m.movement_type}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{m.quantity}</td>
                    <td className="py-3 px-3 text-xs font-mono text-slate-600">{m.reference}</td>
                    <td className="py-3 px-3 text-xs font-medium text-slate-800">{m.user_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
