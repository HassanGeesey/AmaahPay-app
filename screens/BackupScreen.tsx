import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../components/ToastNotification';

export default function BackupScreen() {
  const { t, customers, products, transactions } = useShop();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    
    try {
      const data = {
        customers,
        products,
        transactions,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rukun-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Save last backup date
      localStorage.setItem('last_backup_date', new Date().toISOString());
      
      addToast('Backup exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export backup', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const lastBackup = localStorage.getItem('last_backup_date');
  const backupDate = lastBackup ? new Date(lastBackup) : null;

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-stone-400 hover:text-stone-50 transition-colors rounded-lg"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-stone-50">Backup</h1>
      </header>

      <div className="space-y-4">
        {/* Main Backup Card */}
        <div className="bg-stone-900 rounded-lg border border-stone-800 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-50 mb-2">Export Your Data</h2>
            <p className="text-sm text-stone-400">Download all your shop data as a JSON file</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-base font-semibold text-stone-50">{customers.length}</p>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-stone-50">{products.length}</p>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Products</p>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-stone-50">{transactions.length}</p>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Transactions</p>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportData}
            disabled={isExporting}
            className="w-full bg-stone-100 text-stone-900 rounded-lg py-4 font-medium min-h-[56px] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-label="Download backup file"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-900"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Backup</span>
              </>
            )}
          </button>
        </div>

        {/* Last Backup Info */}
        {backupDate && (
          <div className="bg-stone-900 rounded-lg border border-stone-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-50">Last Backup</p>
                <p className="text-xs text-stone-400">
                  {backupDate.toLocaleDateString()} at {backupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-stone-800 rounded-lg border border-stone-700 p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-stone-50 mb-1">Backup Tips</h3>
              <ul className="text-xs text-stone-400 space-y-1">
                <li>• Download backups regularly to keep data safe</li>
                <li>• Store backups in multiple locations</li>
                <li>• Backup files include all shop data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto Backup Settings */}
        <div className="bg-stone-900 rounded-lg border border-stone-800 p-4">
          <h3 className="text-sm font-medium text-stone-50 mb-3">Auto Backup</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-50">Enable automatic backups</p>
              <p className="text-xs text-stone-400">Backup data daily when connected</p>
            </div>
            <button 
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-stone-700 transition-colors"
              aria-label="Toggle auto backup"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-stone-300 transition-transform translate-x-1"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}