import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'

export default function CustomerDetailScreen() {
  const { id } = useParams()
  const { customers, transactions, t, formatCurrency } = useShop()
  const navigate = useNavigate()
  const customer = customers.find(c => c.id === id)
  const customerTransactions = transactions.filter(tx => tx.customerId === id)

  if (!customer) return <div className="p-6">{t.empty}</div>

  const netBalance = customer.deposit - customer.credit

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-lg mx-auto pb-8">
        <header className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/customers')} 
            className="p-2.5 rounded-xl transition-all hover:brightness-95"
            style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Customer Profile
          </h1>
        </header>

        {/* Profile Card */}
        <div className="card-elevated rounded-3xl p-6 text-center mb-5 relative overflow-hidden">
          {/* Decorative background */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
          
          <div 
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-white text-2xl font-semibold shadow-lg relative z-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold relative z-10" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            {customer.name}
          </h2>
          <p className="text-sm mt-1 relative z-10" style={{ color: 'var(--color-text-secondary)' }}>{customer.phone}</p>
          
          {/* Net Balance Summary */}
          <div className={`mt-5 pt-4 border-t relative z-10 ${netBalance >= 0 ? 'border-emerald-200 dark:border-emerald-900' : 'border-red-200 dark:border-red-900'}`}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Net Position
            </p>
            <p className="text-2xl font-semibold" style={{ 
              color: netBalance >= 0 ? 'var(--color-success)' : 'var(--color-error)',
              fontFamily: 'var(--font-display)'
            }}>
              {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
            </p>
          </div>
        </div>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Deposit Card */}
          <div className="card-elevated rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(5,150,105,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-success)' }}>Deposit</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {formatCurrency(customer.deposit)}
            </p>
          </div>
          
          {/* Credit Card */}
          <div className="card-elevated rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(217,119,6,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-warning)' }}>Credit</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {formatCurrency(customer.credit)}
            </p>
          </div>
          
          {/* Available Card */}
          <div className="card-elevated rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(6,78,59,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Available</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {formatCurrency(Math.max(0, customer.deposit))}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/purchase', { state: { customerId: customer.id }})}
            className="btn-primary flex items-center justify-center gap-2 py-4 rounded-xl font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Sale</span>
          </button>
          <button
            onClick={() => navigate('/cash', { state: { customerId: customer.id }})}
            className="card-elevated flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all hover:shadow-lg"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cash</span>
          </button>
        </div>

        {/* Transaction History */}
        <div className="card-elevated rounded-2xl overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                Transaction History
              </h3>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)' }}>
                {customerTransactions.length} entries
              </span>
            </div>
          </div>
          {customerTransactions.length > 0 ? (
            <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)', maxHeight: '400px', overflowY: 'auto' }}>
              {customerTransactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  className="p-5 flex justify-between items-start transition-all hover:brightness-95"
                  style={{ 
                    animation: 'fadeIn 0.3s ease forwards',
                    animationDelay: `${index * 30}ms`,
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'purchase' ? 'gradient-primary' : ''
                    }`} style={tx.type !== 'purchase' ? { background: 'rgba(5,150,105,0.1)' } : {}}>
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: tx.type === 'purchase' ? 'white' : 'var(--color-success)' }}
                      >
                        {tx.type === 'purchase' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                        {tx.type === 'purchase' ? t.buy : t.pay}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      {tx.notes && (
                        <p className="text-xs mt-2 italic" style={{ color: 'var(--color-text-muted)' }}>
                          "{tx.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="flex gap-2 mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--color-success)' }}>
                        D: {formatCurrency(tx.newBalance.deposit)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--color-warning)' }}>
                        C: {formatCurrency(tx.newBalance.credit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--color-bg-subtle)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              {t.empty}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
