import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useShop } from '../contexts/ShopContext'

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme()
  const { t } = useShop()
  const navigate = useNavigate()
  
  const [selectedTheme, setSelectedTheme] = useState(theme)
  const [saved, setSaved] = useState(false)

  // Update selected theme when context theme changes
  useEffect(() => {
    setSelectedTheme(theme)
  }, [theme])

  const handleApply = () => {
    console.log('Applying theme:', selectedTheme);
    setTheme(selectedTheme);
    setSaved(true);
    
    // Reset saved state after 2 seconds
    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl transition-all hover:brightness-95"
          style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Settings
        </h1>
      </header>

      {/* Theme Selection */}
      <div className="card-elevated rounded-3xl p-6 mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Appearance
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedTheme('light')}
            className={`w-full p-4 rounded-xl border transition-all ${
              selectedTheme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-transparent hover:bg-primary/5'
            }`}
            style={selectedTheme === 'light' ? { borderColor: 'var(--color-primary)' } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-bg-subtle)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium" style={{ color: 'var(--color-text)' }}>Light</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Light mode</div>
                </div>
              </div>
              {selectedTheme === 'light' && (
                <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedTheme('dark')}
            className={`w-full p-4 rounded-xl border transition-all ${
              selectedTheme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-transparent hover:bg-primary/5'
            }`}
            style={selectedTheme === 'dark' ? { borderColor: 'var(--color-primary)' } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-bg-subtle)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium" style={{ color: 'var(--color-text)' }}>Dark</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Dark mode</div>
                </div>
              </div>
              {selectedTheme === 'dark' && (
                <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedTheme('system')}
            className={`w-full p-4 rounded-xl border transition-all ${
              selectedTheme === 'system'
                ? 'border-primary bg-primary/5'
                : 'border-transparent hover:bg-primary/5'
            }`}
            style={selectedTheme === 'system' ? { borderColor: 'var(--color-primary)' } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-bg-subtle)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium" style={{ color: 'var(--color-text)' }}>System</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Follow system preference</div>
                </div>
              </div>
              {selectedTheme === 'system' && (
                <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Apply Theme Button */}
        <button
          onClick={handleApply}
          className="btn-primary w-full mt-5 py-4 rounded-xl font-medium"
        >
          {saved ? 'Theme Applied!' : 'Apply Theme'}
        </button>
      </div>

      {/* Settings Links */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <button
          onClick={() => navigate('/currency')}
          className="w-full p-4 flex items-center justify-between hover:brightness-95 transition-all border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-bg-subtle)' }}>
              <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>$</span>
            </div>
            <div className="text-left">
              <div className="font-medium" style={{ color: 'var(--color-text)' }}>Currency</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Change currency settings</div>
            </div>
          </div>
          <svg className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => navigate('/backup')}
          className="w-full p-4 flex items-center justify-between hover:brightness-95 transition-all border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-bg-subtle)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium" style={{ color: 'var(--color-text)' }}>Backup</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Export your data</div>
            </div>
          </div>
          <svg className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => navigate('/admin-signup')}
          className="w-full p-4 flex items-center justify-between hover:brightness-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--color-error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium" style={{ color: 'var(--color-error)' }}>Admin Panel</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Shop management & settings</div>
            </div>
          </div>
          <svg className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
