import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminSignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  const { signUp, language } = useAuth()
  const navigate = useNavigate()

  const ADMIN_ACCESS_CODE = 'SHOPKEEP_ADMIN_2025'

  const t = {
    en: {
      title: 'Admin: Create New Shop Account',
      adminOnly: 'Admin Access Only',
      email: 'Email Address',
      password: 'Password',
      shopName: 'Shop Name',
      adminCode: 'Admin Access Code',
      enterAdminCode: 'Enter admin access code',
      createAccount: 'Create Shop Account',
      backToLogin: 'Back to Login',
      invalidAdminCode: 'Invalid admin access code',
      accountCreated: 'Account created successfully! Please check your email to verify.',
      genericError: 'An error occurred. Please try again.',
      creatingAccount: 'Creating Account...',
      waitSeconds: 'Wait',
      note: 'Note: This page is for administrators only. Regular users should contact their admin to create accounts.'
    },
    so: {
      title: 'Maamul: Ka Abuuro Accountka Dukaanka Cusub',
      adminOnly: 'Helitaanka Maamulka oo keliya',
      email: 'Cinwaanka Email',
      password: 'Password',
      shopName: 'Magaca Dukaanka',
      adminCode: 'Koodka Helitaanka Maamulka',
      enterAdminCode: 'Gali koodka helitaanka maamulka',
      createAccount: 'Abuuro Accountka Dukaanka',
      backToLogin: 'Ku Noqo Login',
      invalidAdminCode: 'Koodka helitaanka maamulka khaldan ah',
      accountCreated: 'Account-ku waa la abuuray si sax ah! Hubi email-kaaga si aad xaqiijiso.',
      genericError: 'Waxaa dhacay khalad. Fadlan isku day markale.',
      creatingAccount: 'Waa la abuurayaa...',
      waitSeconds: 'Sug',
      note: 'Xusid: Boggan waa maamulaha keliya. Userska caadiga ah waa in la wada xidhiidhho maamulaha si ay u abuuraan accounts.'
    }
  }

  const labels = t[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    
    setLoading(true)
    setError(null)

    if (adminCode !== ADMIN_ACCESS_CODE) {
      setError(labels.invalidAdminCode)
      setLoading(false)
      return
    }

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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="./app_icon.png" 
            alt="App Icon" 
            className="w-16 h-16 rounded-xl mx-auto object-cover"
          />
          <h1 className="text-center text-2xl font-semibold text-stone-900 dark:text-stone-50 mt-4">AmaahPay</h1>
          <div className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-lg text-sm font-medium text-center mt-4">
            {labels.adminOnly}
          </div>
          <h2 className="text-center text-xl font-semibold text-stone-900 dark:text-stone-50 mt-4">
            {labels.title}
          </h2>
        </div>

        {error && (
          <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="shop-name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {labels.shopName}
            </label>
            <input
              id="shop-name"
              name="shopName"
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              placeholder={labels.shopName}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {labels.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              placeholder={labels.email}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {labels.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              placeholder={labels.password}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="admin-code" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {labels.adminCode}
            </label>
            <input
              id="admin-code"
              name="adminCode"
              type="password"
              required
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              placeholder={labels.enterAdminCode}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-lg disabled:opacity-40"
          >
            {loading ? labels.creatingAccount : !canSubmit ? `${labels.waitSeconds} ${cooldownRemaining}s` : labels.createAccount}
          </button>

          <div className="text-center">
            <Link to="/login" className="font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:text-stone-50">
              {labels.backToLogin}
            </Link>
          </div>
        </form>

        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 px-4 py-3 rounded-lg text-xs">
          {labels.note}
        </div>
      </div>
    </div>
  )
}
