import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'

export default function AdminDashboardScreen() {
  const navigate = useNavigate()
  const {
    users,
    loading,
    error,
    getAllUsers,
    getActiveUserCount,
    getInactiveUserCount,
    getTotalRevenue
  } = useAdmin()

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'var(--color-primary)',
      background: 'rgba(6,78,59,0.1)'
    },
    {
      label: 'Active Users',
      value: getActiveUserCount(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'var(--color-success)',
      background: 'rgba(5,150,105,0.1)'
    },
    {
      label: 'Inactive Users',
      value: getInactiveUserCount(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'var(--color-error)',
      background: 'rgba(220,38,38,0.1)'
    },
    {
      label: 'Total Revenue',
      value: `$${getTotalRevenue().toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'var(--color-accent)',
      background: 'rgba(217,119,6,0.1)'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Admin Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Manage all shop owners and subscriptions
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="card-elevated rounded-2xl p-5 animate-fade-in-up"
            style={{
              animationDelay: `${index * 100}ms`,
              opacity: 0
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.background, color: stat.color }}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              User Management
            </h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:brightness-95"
              style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
            ) : users.length > 0 ? (
              users.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg transition-all hover:bg-primary/5"
                  style={{
                    animation: 'fadeIn 0.3s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {user.shop_name || user.email}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
                No users found
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-elevated rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 rounded-xl text-left transition-all hover:shadow-lg"
              style={{ background: 'var(--color-bg-subtle)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--color-primary)', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>View Users</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Manage all shop owners</p>
            </button>
            <button
              onClick={() => navigate('/admin-signup')}
              className="p-4 rounded-xl text-left transition-all hover:shadow-lg"
              style={{ background: 'var(--color-bg-subtle)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--color-accent)', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Create Shop</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Add new shop owner</p>
            </button>
            <button
              onClick={() => navigate('/admin/subscriptions')}
              className="p-4 rounded-xl text-left transition-all hover:shadow-lg"
              style={{ background: 'var(--color-bg-subtle)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--color-success)', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Subscriptions</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Manage payments</p>
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="p-4 rounded-xl text-left transition-all hover:shadow-lg"
              style={{ background: 'var(--color-bg-subtle)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--color-primary)', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Reports</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>View analytics</p>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}
    </div>
  )
}
