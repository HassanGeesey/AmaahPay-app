import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PHONE_NUMBER = '+252619444629'
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError('Invalid email or password')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          {/* Logo & Branding */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-xl animate-pulse-glow" style={{ boxShadow: '0 0 40px rgba(6,78,59,0.3)' }}>
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              AmaahPay
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Sign in to continue to your shop</p>
          </div>

          {/* Login Card */}
          <div className="card-elevated rounded-3xl p-8 animate-fade-in-up delay-200" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            {error && (
              <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl focus:ring-2"
                  style={{ borderRadius: '12px' }}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full px-4 py-3.5 rounded-xl"
                  style={{ borderRadius: '12px' }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-xl font-medium text-base transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderRadius: '16px' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>Need help?</span>
              </div>
            </div>

            {/* Admin Link */}
            <Link 
              to="/admin-signup" 
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all hover:brightness-95 mb-4"
              style={{ 
                background: 'rgba(220,38,38,0.08)', 
                color: 'var(--color-error)',
                border: '1px solid rgba(220,38,38,0.2)'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Admin Panel - Create Shop
            </Link>

            {/* Contact Options */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all hover:brightness-95"
                style={{ 
                  background: 'var(--color-bg-subtle)', 
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all hover:brightness-110"
                style={{ 
                  background: '#25D366',
                  color: 'white'
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-xs animate-fade-in-up delay-400" style={{ color: 'var(--color-text-muted)', animation: 'fadeIn 0.5s ease forwards', animationDelay: '400ms', opacity: 0 }}>
            Shop management made simple
          </p>
        </div>
      </div>
    </div>
  )
}
