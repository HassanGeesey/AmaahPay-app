import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../contexts/AdminContext'

export default function AdminSignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [plan, setPlan] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  const { user, isAdmin, language } = useAuth()
  const { createShopAccount } = useAdmin()
  const navigate = useNavigate()

  const t = {
    en: {
      title: 'Create New Shop Account',
      email: 'Shop Owner Email',
      password: 'Password',
      shopName: 'Shop Name',
      plan: 'Subscription Plan',
      createAccount: 'Create Shop Account',
      backToDashboard: 'Back to Dashboard',
      accountCreated: 'Account created successfully!',
      genericError: 'An error occurred. Please try again.',
      creatingAccount: 'Creating Account...',
      waitSeconds: 'Wait',
      note: 'Create a new shop account with 30 days free trial.',
      createShop: 'Create New Shop',
      basic: 'Basic',
      professional: 'Professional',
      enterprise: 'Enterprise'
    },
    so: {
      title: 'Ka Abuuro Accountka Dukaanka Cusub',
      email: 'Email-ka Milkiilaha Dukaanka',
      password: 'Eremaanka',
      shopName: 'Magaca Dukaanka',
      plan: 'Qorshaha Daawashada',
      createAccount: 'Abuuro Accountka Dukaanka',
      backToDashboard: 'Ku Noqo Dashboard',
      accountCreated: 'Account-ku waa la abuuray si sax ah!',
      genericError: 'Waxaa dhacay khalad. Fadlan isku day markale.',
      creatingAccount: 'Waa la abuurayaa...',
      waitSeconds: 'Sug',
      note: 'Abuuro account cusub oo leh 30 maalmood oo bilaash ah.',
      createShop: 'Abuuro Dukaanka Cusub',
      basic: 'Aasaasiga',
      professional: 'Shaqo',
      enterprise: 'Shirkad'
    }
  }

  const labels = t[language]

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login')
    }
  }, [user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !user || !isAdmin()) return
    
    setLoading(true)
    setError(null)

    try {
      const result = await createShopAccount(email, password, shopName, plan)
      if (result.success) {
        setCanSubmit(false)
        const cooldownTime = 5
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
        // Reset form
        setEmail('')
        setPassword('')
        setShopName('')
        setPlan('basic')
      } else {
        setError(result.error || labels.genericError)
      }
    } catch (err) {
      setError(labels.genericError)
    } finally {
      setLoading(false)
    }
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
            style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--color-success)' }}
          >
            {labels.createShop}
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

          {/* Shop Creation Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                {labels.plan}
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="input-field w-full px-4 py-3.5 rounded-xl"
              >
                <option value="basic">{labels.basic} ($9/mo)</option>
                <option value="professional">{labels.professional} ($19/mo)</option>
                <option value="enterprise">{labels.enterprise} ($49/mo)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 py-4 rounded-xl font-medium text-base transition-all hover:brightness-95"
                style={{ 
                  background: 'var(--color-bg-subtle)', 
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {labels.backToDashboard}
              </button>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="flex-1 btn-primary py-4 rounded-xl font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? labels.creatingAccount : !canSubmit ? `${labels.waitSeconds} ${cooldownRemaining}s` : labels.createAccount}
              </button>
            </div>
          </form>

          <div className="mt-6 flex gap-3">
            <Link 
              to="/admin" 
              className="flex-1 text-center py-3 rounded-xl font-medium text-sm transition-all hover:brightness-95"
              style={{ 
                background: 'var(--color-bg-subtle)', 
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              {labels.backToDashboard}
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
