import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
// import { jsPDF } from 'jspdf'

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
  const { customers, transactions, cashTransactions, products, settings, formatCurrency, shopName } = useShop()
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
      .reduce((sum, t) => sum + t.amount, 0)
    
    const cashOut = filteredCashTransactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const purchases = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalCashIn: cashIn,
      totalCashOut: cashOut,
      totalPurchases: purchases,
      netChange: cashIn - cashOut,
      transactionCount: filteredTransactions.length + filteredCashTransactions.length
    }
  }, [filteredTransactions, filteredCashTransactions])

  const productsByCustomer = useMemo(() => {
    const result: Record<string, { customer: typeof customers[0]; products: ProductSale[]; total: number }> = {}

    const relevantTransactions = selectedCustomerId === 'all'
      ? transactions.filter(t => t.type === 'purchase')
      : transactions.filter(t => t.customerId === selectedCustomerId && t.type === 'purchase')

    relevantTransactions.forEach(tx => {
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

      const customer = customers.find(c => c.id === tx.customerId)
      if (!customer) return

      if (!result[tx.customerId]) {
        result[tx.customerId] = { customer, products: [], total: 0 }
      }

      tx.items.forEach(item => {
        const existing = result[tx.customerId].products.find(p => p.productName === item.productName)
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

  const generatePDF = async () => {
    setGenerating(true)
    try {
      // PDF generation temporarily disabled
      alert('PDF export temporarily disabled for deployment')
      return
      // const doc = new jsPDF()
      const customerName = selectedCustomerId === 'all' ? 'All Customers' : customers.find(c => c.id === selectedCustomerId)?.name || 'Unknown'
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      const tableWidth = pageWidth - (margin * 2)
      
      try {
        const iconUrl = '/android_asset/webapp/app_icon.png'
        const response = await fetch(iconUrl)
        const blob = await response.blob()
        const reader = new FileReader()
        
        reader.onload = function(e) {
          const imgData = e.target?.result as string
          if (imgData) {
            doc.addImage(imgData, 'PNG', margin, 8, 18, 18)
          }
          doc.setFontSize(24)
          doc.setFont('helvetica', 'bold')
          doc.text(shopName || 'AmaahPay', margin + 22, 22)
          
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.text(`Report`, margin + 22, 30)
          
          doc.setFontSize(9)
          doc.text(`Customer: ${customerName}`, margin, 42)
          doc.text(`Date Range: ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`, margin, 48)
          doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 54)
          
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text('Summary', margin, 66)
          
          finishPDF(doc, customerName, pageWidth, margin, tableWidth)
        }
        reader.readAsDataURL(blob)
      } catch (iconError) {
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text(shopName || 'AmaahPay', margin, 22)
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Report`, margin, 30)
        
        doc.setFontSize(9)
        doc.text(`Customer: ${customerName}`, margin, 42)
        doc.text(`Date Range: ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`, margin, 48)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 54)
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('Summary', margin, 66)
        
        finishPDF(doc, customerName, pageWidth, margin, tableWidth)
      }
    } finally {
      setGenerating(false)
    }
  }

  const finishPDF = (doc: any, customerName: string, pageWidth: number, margin: number, tableWidth: number) => {
    let yPos = 72
    
    const summaryData = [
      ['Cash In', formatCurrency(reportData.totalCashIn)],
      ['Cash Out', formatCurrency(reportData.totalCashOut)],
      ['Purchases', formatCurrency(reportData.totalPurchases)],
      ['Products Sold', formatCurrency(totalProductsSold)],
      ['Net Balance', formatCurrency(reportData.netChange)]
    ]
    
    summaryData.forEach((row, index) => {
      const isLast = index === summaryData.length - 1
      
      doc.setFillColor(250, 250, 250)
      doc.rect(margin, yPos, tableWidth, 8, 'F')
      
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(margin, yPos, margin + tableWidth, yPos)
      if (isLast) {
        doc.line(margin, yPos + 8, margin + tableWidth, yPos + 8)
      }
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(row[0], margin + 4, yPos + 5.5)
      
      const valueWidth = doc.getTextWidth(row[1])
      doc.setFont('helvetica', 'bold')
      doc.text(row[1], margin + tableWidth - valueWidth - 4, yPos + 5.5)
      
      yPos += 8
    })
    
    yPos += 10

    if (productsByCustomer.length > 0) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Products by Customer', margin, yPos)
      yPos += 6
      
      productsByCustomer.forEach((customerData) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFillColor(240, 240, 240)
        doc.rect(margin, yPos, tableWidth, 8, 'F')
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(margin, yPos, margin + tableWidth, yPos)
        doc.line(margin, yPos + 8, margin + tableWidth, yPos + 8)
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(customerData.customer.name, margin + 4, yPos + 5.5)
        
        const customerTotal = formatCurrency(customerData.total)
        const customerTotalWidth = doc.getTextWidth(customerTotal)
        doc.text(customerTotal, margin + tableWidth - customerTotalWidth - 4, yPos + 5.5)
        
        yPos += 8
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        
        customerData.products.forEach((product) => {
          if (yPos > 280) {
            doc.addPage()
            yPos = 20
          }
          
          doc.text(`  ${product.productName}`, margin + 4, yPos + 5)
          
          const productInfo = `${product.quantity}x - ${formatCurrency(product.total)}`
          const productInfoWidth = doc.getTextWidth(productInfo)
          doc.text(productInfo, margin + tableWidth - productInfoWidth - 4, yPos + 5)
          
          doc.setDrawColor(230, 230, 230)
          doc.setLineWidth(0.2)
          doc.line(margin, yPos + 7, margin + tableWidth, yPos + 7)
          
          yPos += 7
        })
        
        yPos += 4
      })
      
      yPos += 6
    }
    
    if (filteredCashTransactions.length > 0) {
      if (yPos > 220) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Cash Transactions', margin, yPos)
      yPos += 6
      
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, yPos, tableWidth, 8, 'F')
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, yPos, margin + tableWidth, yPos)
      doc.line(margin, yPos + 8, margin + tableWidth, yPos + 8)
      
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Date', margin + 4, yPos + 5)
      doc.text('Customer', margin + 50, yPos + 5)
      doc.text('Type', margin + 110, yPos + 5)
      doc.text('Amount', margin + tableWidth - 35, yPos + 5)
      
      yPos += 8
      
      filteredCashTransactions.slice(0, 20).forEach((tx, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(margin, yPos, tableWidth, 7, 'F')
        }
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        
        const date = new Date(tx.timestamp).toLocaleDateString()
        const type = tx.type === 'cash_in' ? 'Cash In' : 'Cash Out'
        const amount = (tx.type === 'cash_in' ? '+' : '-') + formatCurrency(tx.amount)
        
        doc.text(date, margin + 4, yPos + 5)
        doc.text(tx.customerName?.substring(0, 25) || '', margin + 50, yPos + 5)
        doc.text(type, margin + 110, yPos + 5)
        
        const amountWidth = doc.getTextWidth(amount)
        doc.text(amount, margin + tableWidth - amountWidth - 4, yPos + 5)
        
        doc.setDrawColor(230, 230, 230)
        doc.setLineWidth(0.2)
        doc.line(margin, yPos + 7, margin + tableWidth, yPos + 7)
        
        yPos += 7
      })
      
      yPos += 8
    }
    
    if (filteredTransactions.length > 0) {
      if (yPos > 220) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Sales & Payments', margin, yPos)
      yPos += 6
      
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, yPos, tableWidth, 8, 'F')
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, yPos, margin + tableWidth, yPos)
      doc.line(margin, yPos + 8, margin + tableWidth, yPos + 8)
      
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Date', margin + 4, yPos + 5)
      doc.text('Customer', margin + 50, yPos + 5)
      doc.text('Type', margin + 110, yPos + 5)
      doc.text('Amount', margin + tableWidth - 35, yPos + 5)
      
      yPos += 8
      
      filteredTransactions.slice(0, 20).forEach((tx, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(margin, yPos, tableWidth, 7, 'F')
        }
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        
        const date = new Date(tx.timestamp).toLocaleDateString()
        const type = tx.type === 'purchase' ? 'Purchase' : 'Payment'
        const amount = (tx.type === 'purchase' ? '-' : '+') + formatCurrency(tx.amount)
        
        doc.text(date, margin + 4, yPos + 5)
        doc.text(tx.customerName?.substring(0, 25) || '', margin + 50, yPos + 5)
        doc.text(type, margin + 110, yPos + 5)
        
        const amountWidth = doc.getTextWidth(amount)
        doc.text(amount, margin + tableWidth - amountWidth - 4, yPos + 5)
        
        doc.setDrawColor(230, 230, 230)
        doc.setLineWidth(0.2)
        doc.line(margin, yPos + 7, margin + tableWidth, yPos + 7)
        
        yPos += 7
      })
    }
    
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${i} of ${totalPages}`, margin, doc.internal.pageSize.height - 10)
    }
    
    const pdfData = doc.output('datauristring')
    const fileName = `report-${customerName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    
    if (window.Android && window.Android && window.Android.downloadPDF) {
      try {
        window.Android.downloadPDF(pdfData, fileName)
      } catch (error) {
        console.error('Android download failed:', error)
        const link = document.createElement('a')
        link.href = pdfData
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      const link = document.createElement('a')
      link.href = pdfData
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="p-6 max-w-lg mx-auto lg:max-w-none">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 text-stone-400 hover:text-stone-600 dark:text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">Report</h1>
          </div>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {generating ? '...' : 'PDF'}
          </button>
        </header>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Customer</label>
            <select
              id="report-customer"
              name="report-customer"
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full p-3 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50"
            >
              <option value="all">All Customers</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Date Range</label>
            <div className="flex gap-2">
              {(['all', 'today', 'week', 'month'] as DateRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                    dateRange === range 
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900' 
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {range === 'all' ? 'All' : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Cash In</p>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(reportData.totalCashIn)}</p>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Cash Out</p>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(reportData.totalCashOut)}</p>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Purchases</p>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(reportData.totalPurchases)}</p>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Products Sold</p>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(totalProductsSold)}</p>
          </div>
        </div>

        {productsByCustomer.length > 0 && (
          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden mt-4">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800">
              <h2 className="font-semibold text-stone-900 dark:text-stone-50">Products by Customer</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">{productsByCustomer.length} customers with purchases</p>
            </div>
            
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto">
              {productsByCustomer.map((customerData) => (
                <div key={customerData.customer.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-stone-900 dark:text-stone-50">{customerData.customer.name}</p>
                    <p className="font-semibold text-stone-900 dark:text-stone-50">{formatCurrency(customerData.total)}</p>
                  </div>
                  <div className="pl-4 space-y-1">
                    {customerData.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-stone-500 dark:text-stone-400">{product.productName} x{product.quantity}</span>
                        <span className="text-stone-600 dark:text-stone-400">{formatCurrency(product.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden mt-4">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">Cash Transactions</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">{filteredCashTransactions.length} transactions</p>
          </div>
          
          {filteredCashTransactions.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-64 overflow-y-auto">
              {filteredCashTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-stone-600 dark:text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tx.type === 'cash_in' ? "M12 4v16m8-8H4" : "M20 12H4"} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-stone-900 dark:text-stone-50">{tx.customerName}</p>
                      <p className="text-xs text-stone-400">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-50">
                    {tx.type === 'cash_in' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 text-sm">
              No cash transactions
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden mt-4">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">Sales & Payments</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">{filteredTransactions.length} transactions</p>
          </div>
          
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-64 overflow-y-auto">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-stone-600 dark:text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tx.type === 'purchase' ? "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" : "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-stone-900 dark:text-stone-50">{tx.customerName}</p>
                      <p className="text-xs text-stone-400">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-50">
                    {tx.type === 'purchase' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 text-sm">
              No transactions
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
