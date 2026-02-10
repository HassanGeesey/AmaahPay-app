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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="p-6 max-w-lg mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/customers')} className="p-2 -ml-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:text-stone-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{t.profile}</h1>
        </header>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-lg border border-stone-200 dark:border-stone-800 text-center mb-4">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
            {customer.name.charAt(0)}
          </div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{customer.name}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-4">{customer.phone}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg text-left border border-stone-200 dark:border-stone-800">
              <p className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1">{t.deposit}</p>
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(customer.deposit)}</p>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg text-left border border-stone-200 dark:border-stone-800">
              <p className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1">{t.credit}</p>
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(customer.credit)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate('/purchase', { state: { customerId: customer.id }})}
            className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Sale</span>
          </button>
          <button
            onClick={() => navigate('/cash', { state: { customerId: customer.id }})}
            className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cash</span>
          </button>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800">
            <h3 className="font-semibold text-stone-900 dark:text-stone-50">{t.history}</h3>
          </div>
          {customerTransactions.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {customerTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
                      {tx.type === 'purchase' ? t.buy : t.pay}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(tx.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    {tx.notes && <p className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 mt-1 italic">"{tx.notes}"</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(tx.amount)}</p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500">D: {tx.newBalance.deposit} C: {tx.newBalance.credit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-sm">{t.empty}</div>
          )}
        </div>
      </div>
    </div>
  )
}
