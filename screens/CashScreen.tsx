import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
import { Customer } from '../types'

export default function CashScreen() {
  const { state: routeState } = useLocation()
  const { customers, processPayment, processCashOut, formatCurrency, t } = useShop()
  const navigate = useNavigate()

  const [selectedCustomerId, setSelectedCustomerId] = useState(routeState?.customerId || '')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [search, setSearch] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [warningInfo, setWarningInfo] = useState({ shortfall: 0, amount: 0 })

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setAmount('')
    setNotes('')
    setShowWarning(false)
  }

  const handleCashIn = async () => {
    if (!selectedCustomer || !amount || parseFloat(amount) <= 0) return
    setProcessing(true)
    try {
      await processPayment(selectedCustomer.id, parseFloat(amount), notes)
      navigate('/')
    } finally {
      setProcessing(false)
    }
  }

  const handleCashOut = () => {
    if (!selectedCustomer || !amount || parseFloat(amount) <= 0) return

    const amt = parseFloat(amount)
    if (amt <= selectedCustomer.deposit) {
      handleCashOutNormal()
    } else {
      setWarningInfo({
        shortfall: amt - selectedCustomer.deposit,
        amount: amt
      })
      setShowWarning(true)
    }
  }

  const handleCashOutNormal = async () => {
    if (!selectedCustomer || !amount) return
    setProcessing(true)
    try {
      await processCashOut(selectedCustomer.id, parseFloat(amount), notes)
      navigate('/')
    } catch (error: any) {
      console.error('Cash out error:', error)
      alert('Error processing cash out. Please check that your database is set up correctly.\n\nError: ' + (error?.message || 'Unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleCashOutWithCredit = async () => {
    if (!selectedCustomer || !amount) return
    setProcessing(true)
    try {
      await processCashOut(selectedCustomer.id, parseFloat(amount), notes)
      navigate('/')
    } catch (error: any) {
      console.error('Cash out error:', error)
      alert('Error processing cash out. Please check that your database is set up correctly.\n\nError: ' + (error?.message || 'Unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  if (!selectedCustomer) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="p-6 max-w-lg mx-auto lg:max-w-none">
          <header className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 text-stone-400 hover:text-stone-600 dark:text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">Cash</h1>
          </header>

          <input
            type="text"
            id="cash-search"
            name="cash-search"
            placeholder={t.search + '...'}
            className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder:text-stone-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-4 space-y-3">
            {customers
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
              .map(customer => (
                <button
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className="w-full p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-left hover:border-stone-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-50">{customer.name}</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500 dark:text-stone-400">Deposit: <span className="font-medium text-stone-900 dark:text-stone-50">{formatCurrency(customer.deposit)}</span></p>
                      {customer.credit > 0 && (
                        <p className="text-xs text-stone-500 dark:text-stone-400">Credit: <span className="font-medium text-stone-900 dark:text-stone-50">{formatCurrency(customer.credit)}</span></p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="p-6 max-w-lg mx-auto lg:max-w-none">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedCustomerId('')} className="p-2 -ml-2 text-stone-400 hover:text-stone-600 dark:text-stone-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">Cash</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">{selectedCustomer.name}</p>
          </div>
        </header>

        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Deposit</p>
              <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(selectedCustomer.deposit)}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Credit</p>
              <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(selectedCustomer.credit)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleCashIn}
            disabled={!amount || parseFloat(amount) <= 0 || processing}
            className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-lg font-medium disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Cash In</span>
          </button>
          <button
            onClick={handleCashOut}
            disabled={!amount || parseFloat(amount) <= 0 || processing}
            className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-lg font-medium disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <span>Cash Out</span>
          </button>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-4 space-y-4">
          <div>
            <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Amount</label>
            <input
              type="number"
              id="cash-amount"
              name="cash-amount"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 text-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Notes (optional)</label>
            <input
              type="text"
              id="cash-notes"
              name="cash-notes"
              placeholder="..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50"
            />
          </div>
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="mt-4 rounded-lg p-4 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
              {parseFloat(amount) > selectedCustomer.deposit ? 'After Cash Out:' : 'New Deposit:'}
            </p>
            <p className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
              {formatCurrency(Math.max(0, selectedCustomer.deposit - parseFloat(amount) || 0))}
            </p>
          </div>
        )}

        {showWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-stone-900 rounded-lg p-6 w-full max-w-sm">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-stone-600 dark:text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="font-semibold text-stone-900 dark:text-stone-50">Insufficient Deposit</p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Deposit:</span>
                  <span className="font-medium text-stone-900 dark:text-stone-50">{formatCurrency(selectedCustomer.deposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Amount:</span>
                  <span className="font-medium text-stone-900 dark:text-stone-50">{formatCurrency(warningInfo.amount)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 dark:border-stone-800 pt-2">
                  <span className="text-stone-500 dark:text-stone-400">Remaining as Credit:</span>
                  <span className="font-medium text-stone-900 dark:text-stone-50">{formatCurrency(warningInfo.shortfall)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCashOutWithCredit}
                  disabled={processing}
                  className="py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-lg disabled:opacity-40"
                >
                  {processing ? '...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
