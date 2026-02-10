import React, { useState } from 'react'
import { useShop } from '../contexts/ShopContext'

export default function CashTransactionsScreen() {
  const { t, cashTransactions, cashStats, formatCurrency, customers } = useShop()
  const [filterCustomer, setFilterCustomer] = useState<string>('')

  const filteredTransactions = filterCustomer
    ? cashTransactions.filter(tx => tx.customerId === filterCustomer)
    : cashTransactions

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'cash_in': return '💵'
      case 'cash_out': return '💸'
      case 'cash_purchase': return '🛒'
      default: return '💰'
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'cash_in': return 'bg-green-100 text-green-800'
      case 'cash_out': return 'bg-red-100 text-red-800'
      case 'cash_purchase': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatActionType = (type: string) => {
    switch (type) {
      case 'cash_in': return t.cashIn
      case 'cash_out': return t.cashOut
      case 'cash_purchase': return t.cashPurchase
      default: return type
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{t.cashTransactions}</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700">{t.totalCashIn}</p>
          <p className="text-xl font-bold text-green-800">{formatCurrency(cashStats.totalCashIn)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{t.totalCashOut}</p>
          <p className="text-xl font-bold text-red-800">{formatCurrency(cashStats.totalCashOut)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">{t.totalCashPurchases}</p>
          <p className="text-xl font-bold text-blue-800">{formatCurrency(cashStats.totalCashPurchases)}</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-700">{t.netCashFlow}</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(cashStats.netCashFlow)}</p>
        </div>
      </div>

      {customers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t.selectCustomer}
          </label>
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">{t.empty}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(tx.type)}`}>
                      <span className="text-lg">{getActionIcon(tx.type)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{tx.customerName}</p>
                      <p className="text-sm text-slate-500">{formatActionType(tx.type)}</p>
                      {tx.notes && (
                        <p className="text-xs text-slate-400 mt-1">{tx.notes}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'cash_out' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'cash_out' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </p>
                    {tx.type === 'cash_out' && tx.creditAdded && tx.creditAdded > 0 && (
                      <p className="text-xs text-orange-600">
                        +{formatCurrency(tx.creditAdded)} {t.credit}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
