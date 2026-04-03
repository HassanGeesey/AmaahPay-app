import React, { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  role: string
  shop_name: string
  subscription_status: string
  subscription_end: string | null
  is_active: boolean
  last_login: string
  created_at: string
}

interface Subscription {
  id: string
  user_id: string
  email: string
  plan: string
  amount: number
  status: string
  payment_date: string
  expiry_date: string
}

interface AdminContextType {
  users: UserProfile[]
  subscriptions: Subscription[]
  loading: boolean
  error: string | null
  getAllUsers: () => Promise<void>
  toggleUserAccess: (userId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>
  createShopAccount: (email: string, password: string, shopName: string, plan: string) => Promise<{ success: boolean; error?: string }>
  getSubscriptions: () => Promise<void>
  verifyPayment: (subscriptionId: string, amount: number) => Promise<{ success: boolean; error?: string }>
  getActiveUserCount: () => number
  getInactiveUserCount: () => number
  getTotalRevenue: () => number
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logAdminAction = async (action: string, targetUserId?: string, details?: Record<string, any>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('admin_audit_log').insert({
      admin_id: user.id,
      action,
      target_user_id: targetUserId,
      details,
      ip_address: window.location.hostname
    })
  }

  const getAllUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Fetching users from profiles table...')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Profiles table error (will try subscriptions):', error.message)
      }
      
      console.log('Users fetched from profiles:', data)
      
      // If profiles table is empty or error, try to get users from subscriptions
      if (!data || data.length === 0) {
        console.log('Profiles table empty, fetching from subscriptions...')
        const { data: subsData, error: subsError } = await supabase
          .from('subscriptions')
          .select('user_id, email, plan, status, expiry_date, created_at')
          .order('created_at', { ascending: false })
        
        if (subsError) {
          console.warn('Subscriptions fetch error:', subsError.message)
        }
        
        if (subsData && subsData.length > 0) {
          // Map subscriptions to user format
          const mappedUsers: UserProfile[] = subsData.map(sub => ({
            id: sub.user_id,
            email: sub.email || '',
            role: sub.plan || 'shop_owner',
            shop_name: sub.email?.split('@')[0] || '',
            subscription_status: sub.status || 'active',
            subscription_end: sub.expiry_date,
            is_active: sub.status === 'paid',
            last_login: '',
            created_at: sub.created_at
          }))
          console.log('Users from subscriptions:', mappedUsers)
          setUsers(mappedUsers)
          setLoading(false)
          return
        }
      }
      
      setUsers(data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleUserAccess = useCallback(async (userId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      const newStatus = !isActive
      const updateData: { is_active: boolean; subscription_end?: string } = { is_active: newStatus }
      
      // If enabling the user, extend subscription by 30 days
      if (newStatus) {
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 30)
        updateData.subscription_end = expiryDate.toISOString()
      }

      // Try to update profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      // If profiles table fails, log the action anyway (RLS may block)
      if (error) {
        console.warn('Could not update profiles table (RLS may block):', error.message)
      }

      // Log the action
      await logAdminAction(isActive ? 'disable_user' : 'enable_user', userId)

      // Update local state regardless of profile update success
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newStatus, ...(newStatus && { subscription_end: updateData.subscription_end || '' }) } : u))

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle user access'
      console.error('Error toggling user access:', err)
      return { success: false, error: message }
    }
  }, [])

  const createShopAccount = useCallback(async (
    email: string,
    password: string,
    shopName: string,
    plan: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            shop_name: shopName,
            role: 'shop_owner' 
          } 
        }
      })

      if (signUpError) throw signUpError

      const userId = signUpData.user?.id
      if (!userId) throw new Error('Failed to get user ID')

      // Calculate expiry date (30 days from now)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)

      // Create subscription record
      try {
        const { error: subError } = await supabase.from('subscriptions').insert({
          user_id: userId,
          email,
          plan,
          amount: plan === 'basic' ? 9 : plan === 'professional' ? 19 : 49,
          status: 'paid',
          expiry_date: expiryDate.toISOString()
        })

        if (subError) {
          console.warn('Could not create subscription record:', subError.message)
        }
      } catch (subErr) {
        console.warn('Subscription creation warning:', subErr)
      }

      // Try to update/insert profile
      try {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          email,
          shop_name: shopName,
          role: 'shop_owner',
          subscription_end: expiryDate.toISOString(),
          is_active: true,
          subscription_status: 'active'
        }, { onConflict: 'id' })

        if (profileError) {
          console.warn('Could not update profile:', profileError.message)
        }
      } catch (profileErr) {
        console.warn('Profile update warning:', profileErr)
      }

      // Try to log the action
      try {
        await logAdminAction('create_shop', userId, { email, shopName, plan })
      } catch (logErr) {
        console.warn('Audit log warning:', logErr)
      }

      // Refresh the user list
      getAllUsers()

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create shop account'
      console.error('Error creating shop account:', err)
      return { success: false, error: message }
    }
  }, [getAllUsers])

  const getSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubscriptions(data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscriptions'
      setError(message)
      console.error('Error fetching subscriptions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyPayment = useCallback(async (subscriptionId: string, amount: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'paid',
          payment_date: new Date().toISOString(),
          expiry_date: expiryDate.toISOString()
        })
        .eq('id', subscriptionId)

      if (error) throw error

      // Re-enable the user and update subscription end date
      const subscription = subscriptions.find(s => s.id === subscriptionId)
      if (subscription) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            is_active: true,
            subscription_end: expiryDate.toISOString()
          })
          .eq('email', subscription.email)

        if (profileError) throw profileError
      }

      await logAdminAction('verify_payment', undefined, { subscriptionId, amount })

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment'
      console.error('Error verifying payment:', err)
      return { success: false, error: message }
    }
  }, [subscriptions])

  const getActiveUserCount = useCallback(() => {
    return users.filter(u => u.is_active).length
  }, [users])

  const getInactiveUserCount = useCallback(() => {
    return users.filter(u => !u.is_active).length
  }, [users])

  const getTotalRevenue = useCallback(() => {
    return subscriptions
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + s.amount, 0)
  }, [subscriptions])

  const value: AdminContextType = {
    users,
    subscriptions,
    loading,
    error,
    getAllUsers,
    toggleUserAccess,
    createShopAccount,
    getSubscriptions,
    verifyPayment,
    getActiveUserCount,
    getInactiveUserCount,
    getTotalRevenue
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
