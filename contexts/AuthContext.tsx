import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { translations, Language } from './Translations'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, shopName: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ data?: any, error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  language: Language
  toggleLanguage: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setSession(session)
        setUser(session?.user ?? null)

        // Load language preference from localStorage if logged in
        if (session?.user) {
          const savedLanguage = localStorage.getItem('shop_keep_language') as Language
          if (savedLanguage && ['en', 'so'].includes(savedLanguage)) {
            setLanguage(savedLanguage)
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Clear local data on sign out
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('shop_keep_data_v2')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, shopName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            shop_name: shopName
          }
        }
      })
      
      if (error?.status === 429) {
        error.message = 'Too many requests. Please wait a few minutes before trying again.'
      }
      
      return { error }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Signin error:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Signout error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: error as AuthError }
    }
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'so' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('shop_keep_language', newLanguage)
  }

  const isAdmin = () => {
    // Check if user has admin role based on user_metadata role
    // This allows database-driven admin management
    const hasRole = user?.user_metadata?.role === 'admin'
    
    // Debug logging
    console.log('isAdmin check:', {
      userEmail: user?.email,
      userRole: user?.user_metadata?.role,
      result: hasRole
    })
    
    return hasRole
  }

  const t = translations[language]

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    language,
    toggleLanguage,
    isAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}