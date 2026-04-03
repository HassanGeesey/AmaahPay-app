import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
import { jsPDF } from 'jspdf'

declare global {
  interface Window {
    Android?: {
      downloadPDF: (base64Data: string, fileName: string) => void
    }
  }
}

type DateRange = 'today' | 'week' | 'month' | 'all'

interface ReportData {
  totalCashIn: number
  totalCashOut: number
  totalPurchases: number
  netChange: number
  transactionCount: number
}

interface ProductSale {
  productName: string
  quantity: number
  total: number
}

export default function ReportScreen() {
  const { customers, transactions, cashTransactions, products, settings, formatCurrency, shopName, loading } = useShop()
  const navigate = useNavigate()

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('all')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [generating, setGenerating] = useState(false)

  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    
    let txs = selectedCustomerId === 'all' 
      ? transactions 
      : transactions.filter(t => t.customerId === selectedCustomerId)

    if (dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      switch (dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setDate(now.getDate() - 30)
          break
      }
      txs = txs.filter(t => new Date(t.timestamp) >= cutoff)
    }

    return txs.sort((a, b) => b.timestamp - a.timestamp)
  }, [transactions, selectedCustomerId, dateRange])

  const filteredCashTransactions = useMemo(() => {
    if (!cashTransactions) return []
    
    let ctxs = selectedCustomerId === 'all'
      ? cashTransactions
      : cashTransactions.filter(t => t.customerId === selectedCustomerId)

    if (dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      switch (dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setDate(now.getDate() - 30)
          break
      }
      ctxs = ctxs.filter(t => new Date(t.timestamp) >= cutoff)
    }

    return ctxs.sort((a, b) => b.timestamp - a.timestamp)
  }, [cashTransactions, selectedCustomerId, dateRange])

  const reportData: ReportData = useMemo(() => {
    const cashIn = filteredCashTransactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    
    const cashOut = filteredCashTransactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    
    const purchases = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    return {
      totalCashIn: cashIn,
      totalCashOut: cashOut,
      totalPurchases: purchases,
      netChange: cashIn - cashOut,
      transactionCount: filteredTransactions.length + filteredCashTransactions.length
    }
  }, [filteredTransactions, filteredCashTransactions])

  const productsByCustomer = useMemo(() => {
    const result: Record<string, { customer: any; products: ProductSale[]; total: number }> = {}

    const relevantTransactions = selectedCustomerId === 'all'
      ? transactions.filter((t: any) => t.type === 'purchase')
      : transactions.filter((t: any) => t.customerId === selectedCustomerId && t.type === 'purchase')

    relevantTransactions.forEach((tx: any) => {
      if (!tx.items || tx.items.length === 0) return

      if (dateRange !== 'all') {
        const txDate = new Date(tx.timestamp)
        const now = new Date()
        const cutoff = new Date()
        switch (dateRange) {
          case 'today':
            cutoff.setHours(0, 0, 0, 0)
            break
          case 'week':
            cutoff.setDate(now.getDate() - 7)
            break
          case 'month':
            cutoff.setDate(now.getDate() - 30)
            break
        }
        if (txDate < cutoff) return
      }

      const customer = customers.find((c: any) => c.id === tx.customerId)
      if (!customer) return

      if (!result[tx.customerId]) {
        result[tx.customerId] = { customer, products: [], total: 0 }
      }

      tx.items.forEach((item: any) => {
        const existing = result[tx.customerId].products.find((p: any) => p.productName === item.productName)
        if (existing) {
          existing.quantity += item.quantity
          existing.total += item.total
        } else {
          result[tx.customerId].products.push({
            productName: item.productName,
            quantity: item.quantity,
            total: item.total
          })
        }
        result[tx.customerId].total += item.total
      })
    })

    return Object.values(result).sort((a, b) => b.total - a.total)
  }, [transactions, customers, selectedCustomerId, dateRange])

  const totalProductsSold = useMemo(() => {
    return productsByCustomer.reduce((sum, c) => sum + c.total, 0)
  }, [productsByCustomer])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generatePDF = useCallback(() => {
    setGenerating(true)
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    doc.setFontSize(20)
    doc.text('Report', pageWidth / 2, y, { align: 'center' })
    y += 15

    doc.setFontSize(12)
    doc.text(`Date Range: ${dateRange === 'all' ? 'All' : dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`, 20, y)
    y += 10

    doc.setFontSize(14)
    doc.text('Summary', 20, y)
    y += 10

    doc.setFontSize(11)
    doc.text(`Cash In: ${formatCurrency(reportData.totalCashIn)}`, 20, y)
    y += 7
    doc.text(`Cash Out: ${formatCurrency(reportData.totalCashOut)}`, 20, y)
    y += 7
    doc.text(`Purchases: ${formatCurrency(reportData.totalPurchases)}`, 20, y)
    y += 7
    doc.text(`Products: ${formatCurrency(totalProductsSold)}`, 20, y)
    y += 15

    if (filteredCashTransactions.length > 0) {
      doc.setFontSize(14)
      doc.text('Cash Transactions', 20, y)
      y += 10

      doc.setFontSize(10)
      filteredCashTransactions.slice(0, 20).forEach((tx: any) => {
        const date = new Date(tx.timestamp).toLocaleDateString()
        doc.text(`${date} - ${tx.customerName}: ${tx.type === 'cash_in' ? '+' : '-'}${formatCurrency(tx.amount)}`, 20, y)
        y += 6
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 10
    }

    if (filteredTransactions.length > 0) {
      doc.setFontSize(14)
      doc.text('Sales & Payments', 20, y)
      y += 10

      doc.setFontSize(10)
      filteredTransactions.slice(0, 20).forEach((tx: any) => {
        const date = new Date(tx.timestamp).toLocaleDateString()
        doc.text(`${date} - ${tx.customerName}: ${tx.type === 'purchase' ? '-' : '+'}${formatCurrency(tx.amount)}`, 20, y)
        y += 6
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
    }

    const pdfBase64 = doc.output('datauristring')
    const fileName = `report_${new Date().toISOString().split('T')[0]}.pdf`

    if (window.Android && window.Android.downloadPDF) {
      window.Android.downloadPDF(pdfBase64, fileName)
    } else {
      const link = document.createElement('a')
      link.href = pdfBase64
      link.download = fileName
      link.click()
    }

    setTimeout(() => setGenerating(false), 1000)
  }, [reportData, totalProductsSold, filteredCashTransactions, filteredTransactions, dateRange, formatCurrency])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-lg mx-auto lg:max-w-none pb-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2.5 rounded-xl transition-all hover:brightness-95"
              style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Report
            </h1>
          </div>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {generating ? '...' : 'PDF'}
          </button>
        </header>

        <div className="space-y-5 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Customer</label>
            <select
              id="report-customer"
              name="report-customer"
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="input-field w-full px-4 py-3.5 rounded-xl"
            >
              <option value="all">All Customers</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Date Range</label>
            <div className="flex gap-2">
              {(['all', 'today', 'week', 'month'] as DateRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    dateRange === range 
                      ? 'btn-primary' 
                      : 'input-field'
                  }`}
                >
                  {range === 'all' ? 'All' : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-elevated rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Cash In</p>
            </div>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(reportData.totalCashIn)}</p>
          </div>
          <div className="card-elevated rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Cash Out</p>
            </div>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(reportData.totalCashOut)}</p>
          </div>
          <div className="card-elevated rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,78,59,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Purchases</p>
            </div>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(reportData.totalPurchases)}</p>
          </div>
          <div className="card-elevated rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Products</p>
            </div>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(totalProductsSold)}</p>
          </div>
        </div>

        {productsByCustomer.length > 0 && (
          <div className="card-elevated rounded-2xl overflow-hidden mb-6">
            <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Products by Customer</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{productsByCustomer.length} customers with purchases</p>
            </div>
            
            <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)', maxHeight: '320px', overflowY: 'auto' }}>
              {productsByCustomer.map((customerData: any) => (
                <div key={customerData.customer.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{customerData.customer.name}</p>
                    <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(customerData.total)}</p>
                  </div>
                  <div className="pl-4 space-y-2">
                    {customerData.products.map((product: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span style={{ color: 'var(--color-text-secondary)' }}>{product.productName} x{product.quantity}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>{formatCurrency(product.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card-elevated rounded-2xl overflow-hidden mb-6">
          <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Cash Transactions</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{filteredCashTransactions.length} transactions</p>
          </div>
          
          {filteredCashTransactions.length > 0 ? (
            <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)', maxHeight: '256px', overflowY: 'auto' }}>
              {filteredCashTransactions.map((tx: any, index: number) => (
                <div 
                  key={tx.id} 
                  className="p-4 flex items-center justify-between transition-all hover:brightness-95"
                  style={{ animation: 'fadeIn 0.3s ease forwards', animationDelay: `${index * 50}ms`, opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'cash_in' ? 'gradient-primary' : ''
                    }`} style={tx.type !== 'cash_in' ? { background: 'rgba(220,38,38,0.1)' } : {}}>
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: tx.type === 'cash_in' ? 'white' : 'var(--color-error)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tx.type === 'cash_in' ? "M12 4v16m8-8H4" : "M20 12H4"} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{tx.customerName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-semibold" style={{ color: tx.type === 'cash_in' ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {tx.type === 'cash_in' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
              No cash transactions
            </div>
          )}
        </div>

        <div className="card-elevated rounded-2xl overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Sales & Payments</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{filteredTransactions.length} transactions</p>
          </div>
          
          {filteredTransactions.length > 0 ? (
            <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)', maxHeight: '256px', overflowY: 'auto' }}>
              {filteredTransactions.map((tx: any, index: number) => (
                <div 
                  key={tx.id} 
                  className="p-4 flex items-center justify-between transition-all hover:brightness-95"
                  style={{ animation: 'fadeIn 0.3s ease forwards', animationDelay: `${index * 50}ms`, opacity: 0 }}
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
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{tx.customerName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-semibold" style={{ color: tx.type === 'purchase' ? 'var(--color-text)' : 'var(--color-success)' }}>
                    {tx.type === 'purchase' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
              No transactions
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
