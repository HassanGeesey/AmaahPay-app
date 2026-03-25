import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminSignupScreen() {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { signIn, signUp, language } = useAuth()
  const navigate = useNavigate()

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@amaahpay.com'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  const t = {
    en: {
      title: 'Admin: Create New Shop Account',
      adminOnly: 'Admin Access Only',
      adminEmail: 'Admin Email',
      adminPassword: 'Admin Password',
      verifyAdmin: 'Verify Admin',
      email: 'Shop Owner Email',
      password: 'Password',
      shopName: 'Shop Name',
      createAccount: 'Create Shop Account',
      backToLogin: 'Back to Login',
      loginAsAdmin: 'Login as Admin',
      invalidCredentials: 'Invalid admin credentials',
      accountCreated: 'Account created successfully! Please check your email to verify.',
      genericError: 'An error occurred. Please try again.',
      creatingAccount: 'Creating Account...',
      verifyingAdmin: 'Verifying...',
      waitSeconds: 'Wait',
      note: 'This page is for administrators only. You must verify your admin credentials before creating shop accounts.',
      createShop: 'Create New Shop',
      authenticated: 'Admin Verified ✓',
      adminInfo: 'Admin: {email}'
    },
    so: {
      title: 'Maamul: Ka Abuuro Accountka Dukaanka Cusub',
      adminOnly: 'Helitaanka Maamulka oo keliya',
      adminEmail: 'Email-ka Maamulaha',
      adminPassword: 'Eremaanka Maamulaha',
      verifyAdmin: 'Xaqiiji Maamulaha',
      email: 'Email-ka Milkiilaha Dukaanka',
      password: 'Eremaanka',
      shopName: 'Magaca Dukaanka',
      createAccount: 'Abuuro Accountka Dukaanka',
      backToLogin: 'Ku Noqo Login',
      loginAsAdmin: 'Geli Sida Maamule',
      invalidCredentials: 'Macluumaadka maamulaha waa khalad',
      accountCreated: 'Account-ku waa la abuuray si sax ah! Hubi email-kaaga si aad xaqiijiso.',
      genericError: 'Waxaa dhacay khalad. Fadlan isku day markale.',
      creatingAccount: 'Waa la abuurayaa...',
      verifyingAdmin: 'Waa la xaqiijinayaa...',
      waitSeconds: 'Sug',
      note: 'Boggan waa maamulaha keliya. Waa inaad xaqiijiso macluumaadka maamulaha ka hor abuurista accounts-ka dukaanka.',
      createShop: 'Abuuro Dukaanka Cusub',
      authenticated: 'Maamulaha La Xaqiijiyay ✓',
      adminInfo: 'Maamule: {email}'
    }
  }

  const labels = t[language]

  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in as admin
      const { error } = await signIn(adminEmail, adminPassword)
      if (error) {
        setError(labels.invalidCredentials)
        setLoading(false)
        return
      }
      setIsAuthenticated(true)
    } catch (err) {
      setError(labels.invalidCredentials)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    
    setLoading(true)
    setError(null)

    try {
      const { error } = await signUp(email, password, shopName)
      if (error) {
        setError(error.message)
        
        if (error.status === 429) {
          setCanSubmit(false)
          const cooldownTime = 60
          let remaining = cooldownTime
          setCooldownRemaining(remaining)
          
          const timer = setInterval(() => {
            remaining--
            setCooldownRemaining(remaining)
            if (remaining <= 0) {
              clearInterval(timer)
              setCanSubmit(true)
            }
          }, 1000)
        }
      } else {
        setCanSubmit(false)
        const cooldownTime = 30
        let remaining = cooldownTime
        setCooldownRemaining(remaining)
        
        const timer = setInterval(() => {
          remaining--
          setCooldownRemaining(remaining)
          if (remaining <= 0) {
            clearInterval(timer)
            setCanSubmit(true)
          }
        }, 1000)
        
        alert(labels.accountCreated)
        navigate('/login')
      }
    } catch (err) {
      setError(labels.genericError)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutAdmin = async () => {
    setIsAuthenticated(false)
    setAdminEmail('')
    setAdminPassword('')
  }

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div 
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse-glow"
            style={{ boxShadow: '0 0 40px rgba(6,78,59,0.3)' }}
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            AmaahPay
          </h1>
          <div 
            className="inline-block mt-3 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--color-error)' }}
          >
            {labels.adminOnly}
          </div>
        </div>

        {/* Form Card */}
        <div className="card-elevated rounded-3xl p-6 animate-fade-in-up delay-200">
          <h2 className="text-xl font-semibold text-center mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            {labels.title}
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
            </div>
          )}

          {/* Admin Verification Form */}
          {!isAuthenticated ? (
            <form className="space-y-5" onSubmit={handleVerifyAdmin}>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: 'var(--color-error)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {labels.adminEmail}
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: 'var(--color-error)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {labels.adminPassword}
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  placeholder={labels.adminPassword}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-xl font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? labels.verifyingAdmin : labels.verifyAdmin}
              </button>
            </form>
          ) : (
            /* Shop Creation Form (Admin Authenticated) */
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Admin Info Badge */}
              <div 
                className="mb-4 p-3 rounded-xl text-sm flex items-center justify-between"
                style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--color-success)' }}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {labels.authenticated}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {ADMIN_EMAIL}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {labels.shopName}
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  placeholder={labels.shopName}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {labels.email}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  placeholder={labels.email}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {labels.password}
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  placeholder={labels.password}
                  minLength={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleLogoutAdmin}
                  className="flex-1 py-4 rounded-xl font-medium text-base transition-all hover:brightness-95"
                  style={{ 
                    background: 'var(--color-bg-subtle)', 
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  Logout
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="flex-1 btn-primary py-4 rounded-xl font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? labels.creatingAccount : !canSubmit ? `${labels.waitSeconds} ${cooldownRemaining}s` : labels.createShop}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 flex gap-3">
            <Link 
              to="/login" 
              className="flex-1 text-center py-3 rounded-xl font-medium text-sm transition-all hover:brightness-95"
              style={{ 
                background: 'var(--color-bg-subtle)', 
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              {labels.backToLogin}
            </Link>
            <Link 
              to="/login" 
              className="flex-1 text-center py-3 rounded-xl font-medium text-sm btn-primary"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div 
          className="mt-6 p-4 rounded-xl text-sm text-center"
          style={{ background: 'rgba(6,78,59,0.05)', color: 'var(--color-text-secondary)' }}
        >
          {labels.note}
        </div>
      </div>
    </div>
  )
}
