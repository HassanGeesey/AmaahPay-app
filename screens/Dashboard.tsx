import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
import { useToast } from '../components/ToastNotification'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const { customers, transactions, t, formatCurrency, shopName, loading: shopLoading, error: shopError } = useShop()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [navigating, setNavigating] = useState<string | null>(null)

  const totalDeposit = customers.reduce((a, c) => a + c.deposit, 0)
  const totalCredit = customers.reduce((a, c) => a + c.credit, 0)
  const netBalance = totalDeposit - totalCredit

  const recentTx = transactions.slice(-4)

  // Handle navigation with loading feedback
  const handleNavigate = (path: string, label: string) => {
    setNavigating(label)
    addToast(`Navigating to ${label}...`, 'info')
    setTimeout(() => {
      navigate(path)
      setNavigating(null)
    }, 200)
  }

  // Handle error state
  if (shopError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">Error Loading Data</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-4">{shopError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-3 rounded-lg font-medium"
            aria-label="Reload page"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (shopLoading) {
    return <LoadingSpinner fullScreen message={t.loading || 'Loading dashboard...'} />
  }

  return (
    <div className="max-w-lg mx-auto lg:max-w-none px-4">
      {/* Mobile Header - Hidden on desktop */}
      <header className="lg:hidden py-4 flex items-center gap-3 mb-6">
        <img 
          src="./app_icon.png" 
          alt="App Icon" 
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{shopName || t.store}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{customers.length} customers</p>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">{shopName || t.store}</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">{customers.length} customers</p>
      </header>

      <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-6">
        {/* Left Column - Stats and Actions */}
        <div className="space-y-4 lg:w-80 lg:flex-shrink-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-3">
            <div 
              className="bg-white dark:bg-stone-900 rounded-lg p-4 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
              role="region" 
              aria-label="Total deposit"
            >
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 uppercase tracking-wide">Deposit</p>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-50 lg:text-lg" aria-live="polite">{formatCurrency(totalDeposit)}</p>
            </div>
            <div 
              className="bg-white dark:bg-stone-900 rounded-lg p-4 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
              role="region" 
              aria-label="Total credit"
            >
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 uppercase tracking-wide">Credit</p>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-50 lg:text-lg" aria-live="polite">{formatCurrency(totalCredit)}</p>
            </div>
            <div 
              className={`rounded-lg p-4 border focus:outline-none focus:ring-2 focus:ring-stone-400 ${
                netBalance >= 0 
                  ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800' 
                  : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
              }`}
              role="region" 
              aria-label="Net balance"
            >
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 uppercase tracking-wide">Net</p>
              <p className={`text-base font-semibold lg:text-lg ${netBalance >= 0 ? 'text-stone-900 dark:text-stone-50' : 'text-red-600 dark:text-red-400'}`} aria-live="polite">{formatCurrency(netBalance)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavigate('/purchase', 'New Sale')}
              disabled={navigating === 'New Sale'}
              className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg py-4 font-medium min-h-[56px] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Create new sale"
            >
              {navigating === 'New Sale' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-stone-900"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span>{navigating === 'New Sale' ? 'Loading...' : 'New Sale'}</span>
            </button>
            <button
              onClick={() => handleNavigate('/cash', 'Cash')}
              disabled={navigating === 'Cash'}
              className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg py-4 font-medium min-h-[56px] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to cash screen"
            >
              {navigating === 'Cash' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-stone-900"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              <span>{navigating === 'Cash' ? 'Loading...' : 'Cash'}</span>
            </button>
          </div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden lg:flex-1" role="region" aria-label="Recent transactions">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 lg:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-900 dark:text-stone-50">{t.recent}</h2>
              <button
                onClick={() => handleNavigate('/report', 'Report')}
                className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1"
                aria-label="View all transactions"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {recentTx.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {recentTx.map((tx, index) => (
                <button
                  key={tx.id}
                  onClick={() => navigate(`/customer/${tx.customerId}`)}
                  className={`w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${index !== recentTx.length - 1 ? 'border-b border-stone-100 dark:border-stone-800' : ''} lg:p-5`}
                  aria-label={`View transaction for ${tx.customerName}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'purchase' 
                        ? 'bg-stone-100 dark:bg-stone-800' 
                        : 'bg-stone-100 dark:bg-stone-800'
                    }`}>
                      <svg 
                        className="w-5 h-5 text-stone-600 dark:text-stone-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        {tx.type === 'purchase' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-stone-900 dark:text-stone-50">{tx.customerName}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.type === 'purchase' ? 'text-stone-900 dark:text-stone-50' : 'text-stone-900 dark:text-stone-50'}`}>
                    {tx.type === 'purchase' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{t.empty}</p>
              <button
                onClick={() => handleNavigate('/purchase', 'New Sale')}
                className="mt-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-lg text-sm font-medium"
                aria-label="Create your first sale"
              >
                {t.new}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
