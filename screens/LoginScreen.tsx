import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img 
              src="./app_icon.png" 
              alt="App Icon" 
              className="w-16 h-16 rounded-xl mx-auto object-cover"
            />
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50 mt-4">AmaahPay</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-lg disabled:opacity-40"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
            <p className="text-xs text-center text-stone-500 dark:text-stone-400 mb-3">Need an account?</p>
            <div className="flex gap-2 justify-center">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-medium"
              >
                Call
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
