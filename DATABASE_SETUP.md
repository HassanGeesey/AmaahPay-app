# Database Setup Guide

## Overview

AmaahPay uses **Supabase** for backend services. This guide shows you how to set up the database tables required for the app to work.

## Prerequisites

1. A Supabase account (free tier works)
2. Created a new Supabase project
3. Note down your Supabase URL and anon key

## Setup Steps

### Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `amaahpay` (or any name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Step 2: Get Your Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xyz.supabase.co`)
   - **Anon public key** (long string starting with `ey...`)

### Step 3: Run the Database Schema

1. Go to **SQL Editor** in the sidebar
2. Click **"New query"**
3. Paste the entire content of `database/schema.sql`
4. Click **"Run"** (or press Ctrl+Enter)

You should see the message:
```
✅ AmaahPay database schema created successfully!
```

### Step 4: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Make sure "Confirm email" is optional (for easier testing)
4. Save changes

### Step 5: Set Up Environment Variables

Create or update your `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Access Code (change this for security!)
VITE_ADMIN_ACCESS_CODE=SHOPKEEP_ADMIN_2025
```

### Step 6: Start the App

```bash
npm run dev
```

## Testing Your Setup

1. Open the app in your browser
2. Try to create an account via the Admin Panel
3. Check Supabase → **Authentication** → **Users** to see registered users
4. Check Supabase → **Table Editor** to see created data

## Common Issues

### Tables not created
- Make sure you ran the SQL script in Step 3
- Check for error messages in the SQL editor

### Can't sign up
- Check that Email provider is enabled in Authentication settings
- Verify your Supabase URL and anon key are correct

### Permission errors
- Row Level Security (RLS) is enabled by default
- Only authenticated users can access data
- This is intentional for security

## Database Schema

The following tables are created:

| Table | Description |
|-------|-------------|
| `profiles` | User account information |
| `customers` | Shop customers |
| `products` | Shop inventory |
| `transactions` | Sales and payment records |
| `cash_transactions` | Cash in/out tracking |
| `subscriptions` | Payment status for shop owners |
| `settings` | App configuration |

## Next Steps

1. **Customize**: Update the `VITE_ADMIN_ACCESS_CODE` in `.env.local`
2. **Deploy**: Deploy to Vercel/Netlify or build as Android APK
3. **Sell**: Start selling your app to shop owners!

## Support

For help, contact via WhatsApp: +252619444629
