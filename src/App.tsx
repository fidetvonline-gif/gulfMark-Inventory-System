/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { ActiveTab } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { CategoriesView } from './components/CategoriesView';
import { SuppliersView } from './components/SuppliersView';
import { InventoryOperationsView } from './components/InventoryOperationsView';
import { ReportsView } from './components/ReportsView';
import { UsersView } from './components/UsersView';
import { AuditLogsView } from './components/AuditLogsView';
import { SettingsView } from './components/SettingsView';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { currentUser } = useInventory();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main wrapper */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
            {activeTab === 'products' && <ProductsView setActiveTab={setActiveTab} />}
            {activeTab === 'categories' && <CategoriesView />}
            {activeTab === 'suppliers' && <SuppliersView />}
            {activeTab === 'stock-in' && <InventoryOperationsView initialSubTab="stock-in" />}
            {activeTab === 'stock-out' && <InventoryOperationsView initialSubTab="stock-out" />}
            {activeTab === 'adjustment' && <InventoryOperationsView initialSubTab="adjustment" />}
            {activeTab === 'movements' && <InventoryOperationsView initialSubTab="movements" />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'audit-logs' && <AuditLogsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainContent />
    </InventoryProvider>
  );
}
