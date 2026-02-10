export interface CurrencySettings {
  useUSD: boolean
  exchangeRate: number
}

const DEFAULT_SETTINGS: CurrencySettings = {
  useUSD: false,
  exchangeRate: 32
}

export function getCurrencySettings(): CurrencySettings {
  const saved = localStorage.getItem('currency_settings')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return DEFAULT_SETTINGS
    }
  }
  return DEFAULT_SETTINGS
}

export function formatCurrency(amount: number, currencySettings?: CurrencySettings): string {
  const settings = currencySettings || getCurrencySettings()
  
  if (settings.useUSD) {
    return `$${amount.toFixed(2)}`
  } else {
    return `${amount.toLocaleString()} SOS`
  }
}

export function convertFromUSD(sosAmount: number, currencySettings?: CurrencySettings): number {
  const settings = currencySettings || getCurrencySettings()
  return settings.useUSD ? sosAmount / settings.exchangeRate : sosAmount
}

export function convertToUSD(usdAmount: number, currencySettings?: CurrencySettings): number {
  const settings = currencySettings || getCurrencySettings()
  return settings.useUSD ? usdAmount : usdAmount * settings.exchangeRate
}

export function getCurrencySymbol(): string {
  const settings = getCurrencySettings()
  return settings.useUSD ? '$' : 'SOS'
}