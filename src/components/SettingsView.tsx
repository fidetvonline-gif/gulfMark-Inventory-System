import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Settings, Store, Database, ShieldCheck, RefreshCw, Key, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

export const SettingsView: React.FC = () => {
  const { addToast } = useInventory();
  const storedConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(storedConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(storedConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({ url: supabaseUrl, anonKey: supabaseAnonKey });
    addToast('Supabase configuration saved successfully!', 'success');
  };

  const handleTestSupabase = async () => {
    setIsTesting(true);
    setTestResult(null);
    saveSupabaseConfig({ url: supabaseUrl, anonKey: supabaseAnonKey });
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
    if (res.success) {
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleClearSupabase = () => {
    if (window.confirm('Disconnect Supabase and revert to local storage mode?')) {
      clearSupabaseConfig();
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      setTestResult(null);
      addToast('Disconnected from Supabase.', 'info');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    addToast('SQL schema copied to clipboard!', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to default sample data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">System Configuration & Settings</h2>
          <p className="text-xs text-slate-500">Supermarket profile, Supabase Cloud database integration, and maintenance</p>
        </div>
      </div>

      {/* Supabase Connection Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Supabase Cloud Database Connection</h3>
              <p className="text-xs text-slate-500">Connect your Supabase project for persistent cloud storage and multi-user synchronization</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${supabaseUrl && supabaseAnonKey ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {supabaseUrl && supabaseAnonKey ? 'Configured' : 'Local Mode'}
          </span>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supabase Anon / Public Key</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
              />
            </div>
          </div>

          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Save Configuration
              </button>
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTesting}
                className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold rounded-xl transition-all"
              >
                {isTesting ? 'Testing Connection...' : 'Test Connection'}
              </button>
              {supabaseUrl && (
                <button
                  type="button"
                  onClick={handleClearSupabase}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Disconnect
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              {showSqlSchema ? 'Hide SQL Schema' : 'View Supabase SQL Setup Schema'}
            </button>
          </div>
        </form>

        {showSqlSchema && (
          <div className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Supabase SQL Schema (Run in Supabase SQL Editor)</span>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono overflow-x-auto p-3 bg-slate-950 rounded-lg text-emerald-300 max-h-64">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">Supermarket Profile</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Supermarket Name</label>
              <p className="font-medium text-slate-900">Gulfmart Supermarket Limited</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Headquarters Location</label>
              <p className="font-medium text-slate-900">Uyo, Akwa Ibom State, Nigeria</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">System Version</label>
              <p className="font-medium text-slate-900">v1.0.0 (Academic MVP Build)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">Local Data & Maintenance</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Persistence Engine</label>
              <p className="font-medium text-emerald-800">Browser Local Storage + Supabase Cloud</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Data Synchronization</label>
              <p className="font-medium text-slate-900">Active (Automatic state persistence)</p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

