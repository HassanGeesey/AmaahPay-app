-- Additional tables for backup system
-- Run this in your Supabase SQL Editor after the main schema

-- Backup storage bucket (create manually in Supabase Dashboard):
-- 1. Go to Storage > Buckets
-- 2. Create new bucket named "shop-backups"
-- 3. Set up Row Level Security policies for the bucket

-- Backup logs table
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  backup_type TEXT CHECK (backup_type IN ('manual', 'daily', 'auto')) NOT NULL,
  filename TEXT NOT NULL,
  backup_url TEXT,
  backup_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for backup logs
CREATE INDEX IF NOT EXISTS idx_backup_logs_profile_id ON backup_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_backup_logs_created_at ON backup_logs(created_at);

-- Enable RLS for backup logs
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for backup logs
CREATE POLICY "Users can view own backup logs" ON backup_logs FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own backup logs" ON backup_logs FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Storage policies for shop-backups bucket
-- Run these in the Supabase Dashboard SQL Editor:

-- Allow users to upload to their own folder
CREATE POLICY "Users can upload own backups" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'shop-backups' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own backups
CREATE POLICY "Users can read own backups" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'shop-backups' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own backups
CREATE POLICY "Users can delete own backups" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'shop-backups' AND 
  auth.role() = 'authenticated' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);