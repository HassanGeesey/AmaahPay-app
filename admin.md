# Admin Dashboard & Subscription Logic

## Overview
This document describes the admin dashboard functionality and subscription management logic for the AmaahPay POS system.

## Subscription Logic

### 1. New Shop Creation
When an admin creates a new shop account:
- A new user is created in `auth.users` via Supabase Auth.
- A `profile` record is created with:
  - `is_active`: true
  - `subscription_end`: Current date + 30 days
- A `subscription` record is created with:
  - `status`: "paid"
  - `expiry_date`: Current date + 30 days

### 2. Subscription Expiration
- **Automatic Disable**: A PostgreSQL function `disable_expired_subscriptions()` runs to check if `subscription_end < NOW()`.
  - If true, it sets `is_active = false` in the `profiles` table.
- **Manual Re-enable**: When an admin verifies a payment or manually enables a user:
  - `is_active` is set to `true`.
  - `subscription_end` is updated to `NOW() + 30 days`.

### 3. Payment Verification
When an admin verifies a payment:
1. Update `subscriptions` table:
   - Set `status` to "paid"
   - Set `payment_date` to current timestamp
   - Set `expiry_date` to current timestamp + 30 days
2. Update `profiles` table for the user:
   - Set `is_active` to `true`
   - Set `subscription_end` to current timestamp + 30 days

## Database Schema Updates
Ensure the `profiles` table has:
- `subscription_end` (TIMESTAMP WITH TIME ZONE)
- `is_active` (BOOLEAN)

## Admin Context Methods
- `createShopAccount()`: Creates user and sets initial subscription
- `toggleUserAccess()`: Toggles user access and updates subscription end date if enabling
- `verifyPayment()`: Verifies payment and extends subscription

## Files
- `contexts/AdminContext.tsx`: Core logic
- `screens/UserManagementScreen.tsx`: User management UI
- `screens/SubscriptionManagementScreen.tsx`: Subscription management UI
- `database/schema.sql`: Database structure
