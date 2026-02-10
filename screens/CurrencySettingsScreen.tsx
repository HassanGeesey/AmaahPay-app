import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'

interface CurrencySettings {
  useUSD: boolean
  exchangeRate: number
}

export default function CurrencySettingsScreen() {
  const { t } = useShop()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<CurrencySettings>({
    useUSD: false,
    exchangeRate: 32
  })
  const [newRate, setNewRate] = useState('32')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('currency_settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setNewRate(parsed.exchangeRate.toString())
    }
  }, [])

  const handleApply = () => {
    const newSettings: CurrencySettings = {
      useUSD: settings.useUSD,
      exchangeRate: parseFloat(newRate) || 32
    }
    setSettings(newSettings)
    localStorage.setItem('currency_settings', JSON.stringify(newSettings))
    setSaved(true)
    
    // Force page reload to apply changes
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleRateChange = (value: string) => {
    setNewRate(value)
    if (parseFloat(value) > 0) {
      setSettings(prev => ({ ...prev, exchangeRate: parseFloat(value) }))
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6 pb-32 max-w-lg mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{t.currencySettings}</h1>
      </header>

      {/* Currency Selection */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-5 mb-6">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">{t.switchCurrency}</h2>
        <div className="space-y-3">
          <button
            onClick={() => setSettings(prev => ({ ...prev, useUSD: false }))}
            className={`w-full p-4 rounded-lg border transition-all ${
              !settings.useUSD
                ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <span className="text-stone-700 dark:text-stone-300 font-bold text-lg">S</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-50">{t.sos}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Somali Shilling</div>
                </div>
              </div>
              {!settings.useUSD && (
                <svg className="w-5 h-5 text-stone-900 dark:text-stone-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => setSettings(prev => ({ ...prev, useUSD: true }))}
            className={`w-full p-4 rounded-lg border transition-all ${
              settings.useUSD
                ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <span className="text-stone-700 dark:text-stone-300 font-bold text-lg">$</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-50">{t.usd}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">US Dollar</div>
                </div>
              </div>
              {settings.useUSD && (
                <svg className="w-5 h-5 text-stone-900 dark:text-stone-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Exchange Rate (only shows when using USD) */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-5 mb-6">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">{t.exchangeRate}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">
              {t.usdEquals}
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-base font-medium text-stone-900 dark:text-stone-50">1 USD = </span>
              <input
                type="number"
                id="exchange-rate"
                name="exchange-rate"
                value={newRate}
                onChange={(e) => handleRateChange(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base font-medium text-stone-900 dark:text-stone-50"
                min="1"
                step="0.01"
              />
              <span className="text-base font-medium text-stone-500 dark:text-stone-400">SOS</span>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            {saved ? 'Applied' : 'Apply Currency'}
          </button>
        </div>

        {/* Current Status */}
        <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400 text-sm">{t.currentRate}</span>
            <span className="font-medium text-stone-900 dark:text-stone-50">1 USD = {settings.exchangeRate} SOS</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-5 mb-6">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">Preview</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <span className="text-sm text-stone-600 dark:text-stone-400">100,000 SOS</span>
            <span className="font-medium text-stone-900 dark:text-stone-50">
              {settings.useUSD
                ? `$${(100000 / settings.exchangeRate).toFixed(2)}`
                : '100,000 SOS'
              }
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <span className="text-sm text-stone-600 dark:text-stone-400">$100 USD</span>
            <span className="font-medium text-stone-900 dark:text-stone-50">
              {settings.useUSD
                ? '$100 USD'
                : `${(100 * settings.exchangeRate).toLocaleString()} SOS`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 text-sm text-stone-600 dark:text-stone-400">
        {settings.useUSD
          ? 'All amounts will display in USD. Use the exchange rate above to convert from SOS.'
          : 'All amounts will display in Somali Shillings (SOS).'}
      </div>
    </div>
  )
}
