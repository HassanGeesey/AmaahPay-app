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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6 max-w-lg mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">Settings</h1>
      </header>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-5 mb-6">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">Appearance</h2>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedTheme('light')}
            className={`w-full p-4 rounded-lg border transition-all ${
              selectedTheme === 'light'
                ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-700 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-50">Light</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Light mode</div>
                </div>
              </div>
              {selectedTheme === 'light' && (
                <svg className="w-5 h-5 text-stone-900 dark:text-stone-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedTheme('dark')}
            className={`w-full p-4 rounded-lg border transition-all ${
              selectedTheme === 'dark'
                ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-700 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-50">Dark</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Dark mode</div>
                </div>
              </div>
              {selectedTheme === 'dark' && (
                <svg className="w-5 h-5 text-stone-900 dark:text-stone-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedTheme('system')}
            className={`w-full p-4 rounded-lg border transition-all ${
              selectedTheme === 'system'
                ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-700 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-50">System</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Follow system preference</div>
                </div>
              </div>
              {selectedTheme === 'system' && (
                <svg className="w-5 h-5 text-stone-900 dark:text-stone-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Apply Theme Button */}
        <button
          onClick={handleApply}
          className="w-full mt-4 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
        >
          {saved ? 'Theme Applied!' : 'Apply Theme'}
        </button>
      </div>

      {/* Other Settings Links */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
        <button
          onClick={() => navigate('/currency')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <span className="text-stone-700 dark:text-stone-300 font-bold">$</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-stone-900 dark:text-stone-50">Currency</div>
              <div className="text-sm text-stone-500 dark:text-stone-400">Change currency settings</div>
            </div>
          </div>
          <svg className="w-5 h-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => navigate('/backup')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-stone-700 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-stone-900 dark:text-stone-50">Backup</div>
              <div className="text-sm text-stone-500 dark:text-stone-400">Export your data</div>
            </div>
          </div>
          <svg className="w-5 h-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
