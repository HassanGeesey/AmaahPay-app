-- Fix RLS policies for transactions and cash_transactions
-- Run this in Supabase SQL Editor to fix the security policies

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON public.transactions;

DROP POLICY IF EXISTS "Authenticated users can view cash transactions" ON public.cash_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert cash transactions" ON public.cash_transactions;

-- Create new policies using profile_id
CREATE POLICY "Authenticated users can view transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can update transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can view cash transactions" ON public.cash_transactions
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can insert cash transactions" ON public.cash_transactions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON public.transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_profile_id ON public.cash_transactions(profile_id);

SELECT 'RLS policies updated successfully!' as message;
