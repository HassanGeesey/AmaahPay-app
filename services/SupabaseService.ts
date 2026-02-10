import { supabase } from '../lib/supabase'
import { Customer, Product, Transaction, TransactionItem } from '../types'

class SupabaseService {
  private userId: string | null = null

  setUserId(userId: string) {
    this.userId = userId
  }

  async getCustomers(): Promise<Customer[]> {
    if (!this.userId) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('profile_id', this.userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      
      const customers = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone || '',
        deposit: Number(customer.deposit),
        credit: Number(customer.credit),
        createdAt: new Date(customer.created_at).getTime(),
        updatedAt: new Date(customer.updated_at).getTime()
      }))
      
      return customers
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const id = crypto.randomUUID()
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          id,
          profile_id: this.userId,
          name: customer.name,
          phone: customer.phone || null,
          deposit: customer.deposit,
          credit: customer.credit,
          created_at: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        phone: data.phone || '',
        deposit: Number(data.deposit),
        credit: Number(data.credit),
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          name: updates.name,
          phone: updates.phone || null,
          deposit: updates.deposit,
          credit: updates.credit,
          updated_at: new Date(now).toISOString()
        })
        .eq('id', id)
        .eq('profile_id', this.userId)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        phone: data.phone || '',
        deposit: Number(data.deposit),
        credit: Number(data.credit),
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  }

  async getProducts(): Promise<Product[]> {
    if (!this.userId) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', this.userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      const products = data.map(product => ({
        id: product.id,
        name: product.name,
        unitPrice: Number(product.unit_price),
        totalSold: product.total_sold,
        createdAt: new Date(product.created_at).getTime(),
        updatedAt: new Date(product.updated_at).getTime()
      }))
      
      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const id = crypto.randomUUID()
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          id,
          profile_id: this.userId,
          name: product.name,
          unit_price: product.unitPrice,
          total_sold: product.totalSold,
          created_at: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        unitPrice: Number(data.unit_price),
        totalSold: data.total_sold,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
      }
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          unit_price: updates.unitPrice,
          total_sold: updates.totalSold,
          updated_at: new Date(now).toISOString()
        })
        .eq('id', id)
        .eq('profile_id', this.userId)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        unitPrice: Number(data.unit_price),
        totalSold: data.total_sold,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.userId) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', this.userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(transaction => ({
        id: transaction.id,
        customerId: transaction.customer_id,
        customerName: transaction.customer_name,
        type: transaction.type,
        items: transaction.items,
        amount: transaction.amount,
        previousBalance: transaction.previous_balance || { deposit: 0, credit: 0 },
        newBalance: transaction.new_balance || { deposit: 0, credit: 0 },
        notes: transaction.notes,
        timestamp: new Date(transaction.created_at).getTime()
      }))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const id = crypto.randomUUID()
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          id,
          profile_id: this.userId,
          customer_id: transaction.customerId,
          customer_name: transaction.customerName,
          type: transaction.type,
          items: transaction.items,
          amount: transaction.amount,
          previous_balance: transaction.previousBalance,
          new_balance: transaction.newBalance,
          notes: transaction.notes,
          created_at: new Date(now).toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        type: data.type,
        items: data.items,
        amount: data.amount,
        previousBalance: data.previous_balance,
        newBalance: data.new_balance,
        notes: data.notes,
        timestamp: new Date(data.created_at).getTime()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  async getCashTransactions(): Promise<any[]> {
    if (!this.userId) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .eq('profile_id', this.userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(transaction => ({
        id: transaction.id,
        customerId: transaction.customer_id || null,
        customerName: transaction.customer_name || '',
        type: transaction.type,
        amount: transaction.amount,
        notes: transaction.notes,
        timestamp: new Date(transaction.created_at).getTime()
      }))
    } catch (error) {
      console.error('Error fetching cash transactions:', error)
      throw error
    }
  }

  async createCashTransaction(transaction: { type: string; amount: number; notes?: string; customerId?: string; customerName?: string }): Promise<any> {
    if (!this.userId) throw new Error('User not authenticated')
    
    const id = crypto.randomUUID()
    const now = Date.now()

    try {
      const { data, error } = await supabase
        .from('cash_transactions')
        .insert({
          id,
          profile_id: this.userId,
          type: transaction.type,
          amount: transaction.amount,
          notes: transaction.notes,
          customer_id: transaction.customerId || null,
          customer_name: transaction.customerName || '',
          created_at: new Date(now).toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        type: data.type,
        amount: data.amount,
        notes: data.notes,
        timestamp: new Date(data.created_at).getTime()
      }
    } catch (error) {
      console.error('Error creating cash transaction:', error)
      throw error
    }
  }
}

export const supabaseService = new SupabaseService()