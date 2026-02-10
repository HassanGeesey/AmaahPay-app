export type TransactionType = 'purchase' | 'payment';
export type Language = 'en' | 'so';
export type Theme = 'light' | 'dark' | 'system';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  deposit: number;
  credit: number;
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  totalSold: number;
  createdAt: number;
  updatedAt: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  customerId: string;
  customerName: string;
  amount: number;
  items?: TransactionItem[];
  previousBalance: { deposit: number; credit: number };
  newBalance: { deposit: number; credit: number };
  timestamp: number;
  notes?: string;
}

export interface AppState {
  customers: Customer[];
  products: Product[];
  transactions: Transaction[];
  cashTransactions: any[];
  settings: { currency: string; currencySymbol: string; language: Language; theme: Theme };
  formatCurrency: (amount: number) => string;
  shopName: string;
  isOnline: boolean;
}
