import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'

export default function SubscriptionManagementScreen() {
  const navigate = useNavigate()
  const { subscriptions, getSubscriptions, verifyPayment, loading } = useAdmin()
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')

  useEffect(() => {
    getSubscriptions()
  }, [getSubscriptions])

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filterStatus === 'all') return true
    return sub.status === filterStatus
  })

  const handleVerifyPayment = async (subscriptionId: string, amount: number) => {
    const result = await verifyPayment(subscriptionId, amount)
    if (result.success) {
      alert('Payment verified successfully!')
      getSubscriptions()
    } else {
      alert(result.error || 'Failed to verify payment')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Subscription Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Manage shop subscriptions and verify payments
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-elevated rounded-2xl p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Total</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {subscriptions.length}
          </p>
        </div>
        <div className="card-elevated rounded-2xl p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-success)' }}>Paid</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-success)' }}>
            {subscriptions.filter(s => s.status === 'paid').length}
          </p>
        </div>
        <div className="card-elevated rounded-2xl p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-warning)' }}>Pending</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-warning)' }}>
            {subscriptions.filter(s => s.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'paid', 'pending', 'overdue'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === status ? 'btn-primary' : 'input-field'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)' }}>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Email
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Plan
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Amount
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Status
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Expiry
                </th>
                <th className="text-center p-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="transition-all hover:brightness-95"
                    style={{
                      animation: 'fadeIn 0.2s ease forwards',
                      animationDelay: `${index * 30}ms`,
                      opacity: 0
                    }}
                  >
                    <td className="p-4">
                      <span style={{ color: 'var(--color-text)' }}>{sub.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm px-2 py-1 rounded-full" style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                        ${sub.amount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(sub.expiry_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {sub.status === 'pending' ? (
                          <button
                            onClick={() => handleVerifyPayment(sub.id, sub.amount)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all"
                          >
                            Verify Payment
                          </button>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex items-center gap-2 text-sm font-medium transition-all hover:opacity-70"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>
  )
}
