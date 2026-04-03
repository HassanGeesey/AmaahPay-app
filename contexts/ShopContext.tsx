import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Customer, Product, Transaction, TransactionItem, Language, Theme } from '../types';
import { supabaseService } from '../services/SupabaseService';
import { useAuth } from './AuthContext';
import { translations } from './Translations';
import { getCurrencySettings } from '../utils/currency';
import { supabase } from '../lib/supabase';

interface ShopContextType extends AppState {
  addCustomer: (name: string, phone: string, initialDeposit: number, initialCredit: number) => Promise<Customer>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  addProduct: (name: string, price: number) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  processPurchase: (customerId: string, items: TransactionItem[], notes?: string) => Promise<void>;
  processPayment: (customerId: string, amount: number, notes?: string) => Promise<void>;
  processCashOut: (customerId: string, amount: number, notes?: string) => Promise<void>;
  addCashTransaction: (type: string, amount: number, notes?: string) => Promise<void>;
  cashStats: any;
  t: typeof translations.en;
  loading: boolean;
  error: string | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_STATE: AppState = {
  customers: [], products: [], transactions: [], cashTransactions: [],
  settings: { currency: 'SOS', currencySymbol: 'SOS', language: 'en' as Language, theme: 'light' as Theme },
  shopName: '',
  formatCurrency: (amount: number) => `${amount.toLocaleString()} SOS`,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, language } = useAuth();

  // Initialize service and load data
  useEffect(() => {
const loadUserData = async () => {
      if (user) {
        supabaseService.setUserId(user.id);
        
        try {
          setError(null);
          console.log('Loading data for user:', user.id);
          
          // Load all data directly without timeout for now
          await loadData();
          
          console.log('Data loaded successfully');
          setLoading(false);
        } catch (err) {
          console.error('Error loading user data:', err);
          setError(err instanceof Error ? err.message : 'Failed to load data');
          
          // Set empty state on error to prevent infinite loading
          setState({
            customers: [],
            products: [],
            transactions: [],
            cashTransactions: [],
            settings: { ...DEFAULT_STATE.settings, language },
            shopName: '',
            isOnline: navigator.onLine,
            formatCurrency: DEFAULT_STATE.formatCurrency
          });
          setLoading(false);
        }
      } else {
        console.log('No user found, setting default state');
        setState(DEFAULT_STATE);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setState(s => ({ ...s, isOnline: true }));
    const handleOffline = () => setState(s => ({ ...s, isOnline: false }));

    setState(s => ({ ...s, isOnline: navigator.onLine }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async () => {
    if (!user) return;

    let shopName = '';

    try {
      // Fetch shop name from profile
      if (navigator.onLine) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('shop_name')
            .eq('id', user.id)
            .single();
          
          if (profile && !profileError) {
            shopName = profile.shop_name || '';
            localStorage.setItem('shop_name', shopName);
          }
        } catch (profileErr) {
          console.error('Error fetching shop name:', profileErr);
          shopName = localStorage.getItem('shop_name') || '';
        }
      } else {
        shopName = localStorage.getItem('shop_name') || '';
      }
    } catch (error) {
      console.error('Error fetching shop name:', error);
      shopName = localStorage.getItem('shop_name') || '';
    }

try {
      console.log('Loading data for user:', user?.id);
      const [customers, products, transactions, cashTransactions] = await Promise.all([
        supabaseService.getCustomers(),
        supabaseService.getProducts(),
        supabaseService.getTransactions(),
        supabaseService.getCashTransactions()
      ]);

      console.log('Data loaded successfully:', { customers: customers.length, products: products.length, transactions: transactions.length, cashTransactions: cashTransactions.length });

      setState({
        customers,
        products,
        transactions,
        cashTransactions,
        settings: { ...DEFAULT_STATE.settings, language },
        shopName,
        isOnline: navigator.onLine,
        formatCurrency: DEFAULT_STATE.formatCurrency
      });
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error details:', (error as Error).message || 'Unknown error');
      setState({
        customers: [],
        products: [],
        transactions: [],
        cashTransactions: [],
        settings: { ...DEFAULT_STATE.settings, language },
        shopName,
        isOnline: navigator.onLine,
        formatCurrency: DEFAULT_STATE.formatCurrency
      });
    }
  };

  const addCustomer = async (name: string, phone: string, initialDeposit: number, initialCredit: number): Promise<Customer> => {
    try {
      const newCustomer = await supabaseService.createCustomer({
        name,
        phone,
        deposit: initialDeposit,
        credit: initialCredit
      });

      setState(s => ({ ...s, customers: [...s.customers, newCustomer] }));
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<void> => {
    try {
      const updatedCustomer = await supabaseService.updateCustomer(id, updates);
      setState(s => ({ 
        ...s, 
        customers: s.customers.map(c => c.id === id ? updatedCustomer : c) 
      }));
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const addProduct = async (name: string, price: number): Promise<Product | null> => {
    try {
      // Check for duplicate names locally first
      if (state.products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        return null;
      }

      const newProduct = await supabaseService.createProduct({
        name,
        unitPrice: price,
        totalSold: 0
      });

      setState(s => ({ ...s, products: [...s.products, newProduct] }));
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    try {
      const updatedProduct = await supabaseService.updateProduct(id, updates);
      setState(s => ({ 
        ...s, 
        products: s.products.map(p => p.id === id ? updatedProduct : p) 
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const processPurchase = async (customerId: string, items: TransactionItem[], notes?: string): Promise<void> => {
    try {
      const customer = state.customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Customer not found');

      const total = items.reduce((acc, item) => acc + item.total, 0);
      let { deposit, credit } = customer;
      const previousBalance = { deposit, credit };
      
      if (total <= deposit) {
        deposit -= total;
      } else {
        const rem = total - deposit;
        deposit = 0;
        credit += rem;
      }

      const transaction = await supabaseService.createTransaction({
        type: 'purchase',
        customerId,
        customerName: customer.name,
        amount: total,
        items,
        previousBalance,
        newBalance: { deposit, credit },
        notes
      });

      // Update product sales locally for immediate feedback
      const updatedProducts = state.products.map(p => {
        const item = items.find(i => i.productId === p.id);
        return item ? { ...p, totalSold: p.totalSold + item.quantity, updatedAt: Date.now() } : p;
      });

      setState(s => ({ 
        ...s, 
        transactions: [transaction, ...s.transactions], 
        customers: s.customers.map(c => c.id === customerId ? { ...c, deposit, credit, updatedAt: Date.now() } : c),
        products: updatedProducts
      }));
    } catch (error) {
      console.error('Error processing purchase:', error);
      throw error;
    }
  };

  const processPayment = async (customerId: string, amount: number, notes?: string): Promise<void> => {
    try {
      const customer = state.customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Customer not found');

      let { deposit, credit } = customer;
      const previousBalance = { deposit, credit };
      
      if (amount <= credit) {
        credit -= amount;
      } else {
        const rem = amount - credit;
        credit = 0;
        deposit += rem;
      }

      const transaction = await supabaseService.createTransaction({
        type: 'payment',
        customerId,
        customerName: customer.name,
        amount,
        previousBalance,
        newBalance: { deposit, credit },
        notes
      });

      setState(s => ({ 
        ...s, 
        transactions: [transaction, ...s.transactions], 
        customers: s.customers.map(c => c.id === customerId ? { ...c, deposit, credit, updatedAt: Date.now() } : c)
      }));
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const processCashOut = async (customerId: string, amount: number, notes?: string): Promise<void> => {
    try {
      const customer = state.customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Customer not found');

      let { deposit, credit } = customer;
      const previousBalance = { deposit, credit };

      const remainingAfterDeposit = Math.max(0, deposit - amount);
      const shortfall = Math.max(0, amount - deposit);
      
      deposit = remainingAfterDeposit;
      if (shortfall > 0) {
        credit += shortfall;
      }

      const transaction = await supabaseService.createTransaction({
        type: 'payment',
        customerId,
        customerName: customer.name,
        amount,
        previousBalance,
        newBalance: { deposit, credit },
        notes
      });

      const cashTransaction = await supabaseService.createCashTransaction({
        type: 'cash_out',
        amount,
        notes,
        customerId,
        customerName: customer.name
      });

      setState(s => ({ 
        ...s, 
        transactions: [transaction, ...s.transactions],
        cashTransactions: [cashTransaction, ...s.cashTransactions],
        customers: s.customers.map(c => c.id === customerId ? { ...c, deposit, credit, updatedAt: Date.now() } : c)
      }));
    } catch (error) {
      console.error('Error processing cash out:', error);
      throw error;
    }
  };

  const addCashTransaction = async (type: string, amount: number, notes?: string) => {
    try {
      const transaction = await supabaseService.createCashTransaction({ type, amount, notes });
      setState(s => ({ ...s, cashTransactions: [transaction, ...s.cashTransactions] }));
    } catch (error) {
      console.error('Error adding cash transaction:', error);
      throw error;
    }
  };

  const cashStats = {
    totalIn: state.cashTransactions.filter((t: any) => t.type === 'cash_in').reduce((sum: number, t: any) => sum + t.amount, 0),
    totalOut: state.cashTransactions.filter((t: any) => t.type === 'cash_out').reduce((sum: number, t: any) => sum + t.amount, 0),
    totalPurchases: state.cashTransactions.filter((t: any) => t.type === 'cash_purchase').reduce((sum: number, t: any) => sum + t.amount, 0),
    balance: state.cashTransactions.reduce((sum: number, t: any) => {
      if (t.type === 'cash_in') return sum + t.amount;
      if (t.type === 'cash_out' || t.type === 'cash_purchase') return sum - t.amount;
      return sum;
    }, 0)
  };

 const t = translations[language];
  const currencySettings = getCurrencySettings();
  const formatCurrency = (amount: number): string => {
    if (currencySettings.useUSD) {
      return `$${amount.toFixed(2)}`
    } else {
      return `${amount.toLocaleString()} SOS`
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop data...</p>
        </div>
      </div>
    );
  }

return (
<ShopContext.Provider value={{ 
      ...state, 
      addCustomer, 
      updateCustomer, 
      addProduct, 
      updateProduct, 
      processPurchase, 
      processPayment,
      processCashOut,
      addCashTransaction,
      cashStats,
      t,
      formatCurrency,
      loading,
      error
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};