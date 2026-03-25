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

  const handleNavigate = (path: string, label: string) => {
    setNavigating(label)
    addToast(`Navigating to ${label}...`, 'info')
    setTimeout(() => {
      navigate(path)
      setNavigating(null)
    }, 200)
  }

  if (shopError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 gradient-mesh">
        <div className="card-elevated rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(220,38,38,0.1)' }}>
            <svg className="w-8 h-8" style={{ color: 'var(--color-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Error Loading Data</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{shopError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary w-full py-3 rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (shopLoading) {
    return <LoadingSpinner fullScreen message={t.loading || 'Loading dashboard...'} />
  }

  return (
    <div className="max-w-lg mx-auto lg:max-w-none px-4 pb-8">
      {/* Header */}
      <header className="lg:hidden py-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {shopName || t.store}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {customers.length} customers
            </p>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block mb-8">
        <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          {shopName || t.store}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {customers.length} customers &bull; {transactions.length} transactions
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-6 lg:space-y-0 lg:flex lg:gap-8">
        {/* Left Column */}
        <div className="space-y-5 lg:w-84 lg:flex-shrink-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {/* Deposit Card */}
            <div 
              className="card-elevated rounded-2xl p-4 hover:shadow-lg transition-all animate-fade-in-up"
              role="region" 
              aria-label="Total deposit"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.1)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Deposit</p>
              </div>
              <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }} aria-live="polite">
                {formatCurrency(totalDeposit)}
              </p>
            </div>

            {/* Credit Card */}
            <div 
              className="card-elevated rounded-2xl p-4 hover:shadow-lg transition-all animate-fade-in-up delay-100"
              role="region" 
              aria-label="Total credit"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.1)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--color-warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Credit</p>
              </div>
              <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }} aria-live="polite">
                {formatCurrency(totalCredit)}
              </p>
            </div>

            {/* Net Balance Card */}
            <div 
              className={`rounded-2xl p-4 border transition-all animate-fade-in-up delay-200 ${
                netBalance >= 0 
                  ? 'card-elevated' 
                  : 'border-red-200 dark:border-red-900'
              }`}
              style={netBalance < 0 ? { background: 'rgba(220,38,38,0.05)' } : {}}
              role="region" 
              aria-label="Net balance"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  netBalance >= 0 ? '' : ''
                }`} style={{ 
                  background: netBalance >= 0 ? 'rgba(6,78,59,0.1)' : 'rgba(220,38,38,0.1)',
                  color: netBalance >= 0 ? 'var(--color-primary)' : 'var(--color-error)'
                }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Net</p>
              </div>
              <p className={`text-lg font-semibold ${netBalance < 0 ? '' : ''}`} style={{ color: netBalance >= 0 ? 'var(--color-text)' : 'var(--color-error)' }} aria-live="polite">
                {formatCurrency(netBalance)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavigate('/purchase', 'New Sale')}
              disabled={navigating === 'New Sale'}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl py-4 font-medium min-h-[60px] transition-all hover:shadow-lg"
              style={{ animation: 'fadeInUp 0.4s ease forwards', opacity: 0 }}
              aria-label="Create new sale"
            >
              {navigating === 'New Sale' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
              className="card-elevated flex items-center justify-center gap-2 rounded-xl py-4 font-medium min-h-[60px] transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ 
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                animation: 'fadeInUp 0.4s ease forwards',
                animationDelay: '100ms',
                opacity: 0
              }}
              aria-label="Go to cash screen"
            >
              {navigating === 'Cash' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
              ) : (
                <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              <span>{navigating === 'Cash' ? 'Loading...' : 'Cash'}</span>
            </button>
          </div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div 
          className="card-elevated rounded-2xl overflow-hidden lg:flex-1 animate-fade-in-up delay-300" 
          style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}
          role="region" 
          aria-label="Recent transactions"
        >
          <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                {t.recent}
              </h2>
              <button
                onClick={() => handleNavigate('/report', 'Report')}
                className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
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
            <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {recentTx.map((tx, index) => (
                <button
                  key={tx.id}
                  onClick={() => navigate(`/customer/${tx.customerId}`)}
                  className="w-full p-4 flex items-center justify-between transition-all hover:brightness-95 dark:hover:brightness-110"
                  style={{ 
                    background: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-subtle)',
                    animation: 'fadeIn 0.3s ease forwards',
                    animationDelay: `${400 + index * 100}ms`,
                    opacity: 0
                  }}
                  aria-label={`View transaction for ${tx.customerName}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      tx.type === 'purchase' ? 'gradient-primary' : ''
                    }`} style={tx.type !== 'purchase' ? { background: 'rgba(217,119,6,0.1)' } : {}}>
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        style={{ color: tx.type === 'purchase' ? 'white' : 'var(--color-accent)' }}
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
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{tx.customerName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: tx.type === 'purchase' ? 'var(--color-text)' : 'var(--color-success)' }}>
                      {tx.type === 'purchase' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{tx.type}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-bg-subtle)' }}>
                <svg className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{t.empty}</p>
              <button
                onClick={() => handleNavigate('/purchase', 'New Sale')}
                className="btn-primary px-6 py-2.5 rounded-xl font-medium"
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
