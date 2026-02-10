-- Supabase Database Schema for ShopKeep/Rukun POS System
-- Run this in your Supabase project SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users with shop information)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  shop_name TEXT NOT NULL,
  shop_email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (per-shop)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  deposit DECIMAL(10,2) DEFAULT 0.00,
  credit DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (per-shop)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_sold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (per-shop)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('purchase', 'payment')) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  items JSONB, -- TransactionItem[] for purchases only
  previous_balance JSONB NOT NULL CHECK (jsonb_typeof(previous_balance) = 'object'),
  new_balance JSONB NOT NULL CHECK (jsonb_typeof(new_balance) = 'object'),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash transactions table (for cash in/out tracking)
CREATE TABLE IF NOT EXISTS cash_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('cash_in', 'cash_out', 'cash_purchase')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_profile_id ON customers(profile_id);
CREATE INDEX IF NOT EXISTS idx_products_profile_id ON products(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_profile_id ON cash_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_type ON cash_transactions(type);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Create policies with IF NOT EXISTS clause
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Drop existing customer policies if they exist
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

-- Create policies with IF NOT EXISTS clause
CREATE POLICY IF NOT EXISTS "Users can view own customers" ON customers FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can insert own customers" ON customers FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can update own customers" ON customers FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can delete own customers" ON customers FOR DELETE USING (auth.uid() = profile_id);

-- Drop existing product policies if they exist
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

-- Create policies with IF NOT EXISTS clause
CREATE POLICY IF NOT EXISTS "Users can view own products" ON products FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can update own products" ON products FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can delete own products" ON products FOR DELETE USING (auth.uid() = profile_id);

-- Drop existing transaction policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Create policies with IF NOT EXISTS clause
CREATE POLICY IF NOT EXISTS "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY IF NOT EXISTS "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own cash transactions" ON cash_transactions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own cash transactions" ON cash_transactions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own cash transactions" ON cash_transactions FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own cash transactions" ON cash_transactions FOR DELETE USING (auth.uid() = profile_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, shop_name)
  VALUES (new.id, new.raw_user_meta_data->>'shop_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create unique constraints for business logic
ALTER TABLE customers ADD CONSTRAINT unique_customer_name_per_shop 
  UNIQUE (profile_id, name);
  
ALTER TABLE products ADD CONSTRAINT unique_product_name_per_shop 
  UNIQUE (profile_id, name);