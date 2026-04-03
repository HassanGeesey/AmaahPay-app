import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'

export default function AdminReportsScreen() {
  const navigate = useNavigate()
  const { users, subscriptions, getSubscriptions, loading, getTotalRevenue } = useAdmin()

  useEffect(() => {
    getSubscriptions()
  }, [getSubscriptions])

  const paidSubscriptions = subscriptions.filter(s => s.status === 'paid')
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending')
  const overdueSubscriptions = subscriptions.filter(s => s.status === 'overdue')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Admin Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Overview of revenue and user statistics
        </p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-elevated rounded-2xl p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Total Users
          </p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {users.length}
          </p>
        </div>
        <div className="card-elevated rounded-2xl p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Active Subscriptions
          </p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--color-success)' }}>
            {paidSubscriptions.length}
          </p>
        </div>
        <div className="card-elevated rounded-2xl p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Pending Payments
          </p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--color-warning)' }}>
            {pendingSubscriptions.length}
          </p>
        </div>
        <div className="card-elevated rounded-2xl p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Total Revenue
          </p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
            ${getTotalRevenue().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue by Plan */}
      <div className="card-elevated rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Revenue by Plan
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {['basic', 'professional', 'enterprise'].map(plan => {
            const planSubs = paidSubscriptions.filter(s => s.plan === plan)
            const planRevenue = planSubs.reduce((sum, s) => sum + s.amount, 0)
            return (
              <div key={plan} className="text-center p-4 rounded-xl" style={{ background: 'var(--color-bg-subtle)' }}>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  {plan}
                </p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  ${planRevenue}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {planSubs.length} users
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* User List */}
      <div className="card-elevated rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          All Users
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)' }}>
                <th className="text-left p-3 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Email</th>
                <th className="text-left p-3 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Shop</th>
                <th className="text-left p-3 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {users.slice(0, 10).map((user, index) => (
                <tr key={user.id} style={{ animation: 'fadeIn 0.2s ease forwards', animationDelay: `${index * 20}ms`, opacity: 0 }}>
                  <td className="p-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user.email}</td>
                  <td className="p-3 text-sm" style={{ color: 'var(--color-text)' }}>{user.shop_name || '-'}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex items-center gap-2 text-sm font-medium"
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
