-- ============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- Add profile_id to customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add profile_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add profile_id to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add profile_id to cash_transactions table
ALTER TABLE public.cash_transactions 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

SELECT '✅ Added profile_id columns to all tables' as message;