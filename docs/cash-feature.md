# Cash Feature Specification

## Overview

A unified cash management system for handling all cash-based customer transactions. This feature replaces the existing "Payment" screen with a comprehensive "Cash" screen.

## Feature Summary

| Action | Description | Balance Effect |
|--------|-------------|---------------|
| **Cash In** | Customer deposits money | deposit += amount |
| **Cash Out** | Customer withdraws money | deposit -= amount (credit added if exceeds) |
| **Buy** | Customer buys items, pays immediately | No balance change |

## User Interface

### Cash Screen (`/cash`)

```
+-------------------------------------+
|  Cash                                |
+-------------------------------------+
|  Select Customer: [Dropdown -]      |
|                                     |
|  +----------+ +----------+ +----+  |
|  | Cash In  | | Cash Out | |Buy|  |
|  |    $     | |    $     | |  $|  |
|  +----------+ +----------+ +----+  |
|                                     |
|  [Form based on selected action]    |
+-------------------------------------+
```

### Cash In Flow
1. Select customer from dropdown
2. Click "Cash In" button
3. Enter amount
4. Optional: add notes
5. Confirm
6. Result: deposit increases

### Cash Out Flow
1. Select customer from dropdown
2. Click "Cash Out" button
3. Enter amount
4. System shows:
   - Current deposit balance
   - Amount that will be deducted
   - New deposit balance
5. **If amount > deposit:**
   - Warning appears: "Amount exceeds deposit by X"
   - Shows: "Credit will be added: X"
   - User can Cancel or Proceed Anyway
6. Confirm
7. Result: deposit decreases (or = 0 with credit added)

### Buy Flow
1. Select customer from dropdown
2. Click "Buy" button
3. Search and select products (like Purchase screen)
4. Add items to cart
5. See total
6. Confirm
7. Result: transaction recorded, no balance change

## Data Types

### New Type Definition (`types.ts`)

```typescript
export type CashTransactionType = 'cash_in' | 'cash_out' | 'cash_purchase';

export interface CashTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: CashTransactionType;
  amount: number;
  depositBefore: number;
  depositAfter: number;
  creditAdded?: number;
  items?: TransactionItem[];
  notes?: string;
  timestamp: number;
}

export interface CashStats {
  totalCashIn: number;
  totalCashOut: number;
  totalCashPurchases: number;
  netCashFlow: number;
}
```

## Database Schema

### New Table: `cash_transactions`

```sql
CREATE TABLE cash_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id),
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash_in', 'cash_out', 'cash_purchase')),
  amount DECIMAL(10,2) NOT NULL,
  deposit_before DECIMAL(10,2) NOT NULL,
  deposit_after DECIMAL(10,2) NOT NULL,
  credit_added DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cash_transactions"
  ON cash_transactions FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own cash_transactions"
  ON cash_transactions FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
```

## File Changes

### New Files

| File | Description |
|------|-------------|
| `rukunApp/docs/cash-feature.md` | This specification document |
| `rukunApp/components/CashActionDialog.tsx` | Dialog for cash actions |
| `rukunApp/screens/CashScreen.tsx` | Main cash screen |
| `rukunApp/screens/CashTransactionsScreen.tsx` | Cash transaction history |

### Modified Files

| File | Change |
|------|--------|
| `rukunApp/types.ts` | Add CashTransaction types |
| `rukunApp/services/SupabaseService.ts` | Add cash transaction CRUD methods |
| `rukunApp/contexts/ShopContext.tsx` | Add cash state and methods |
| `rukunApp/components/BottomNav.tsx` | Replace "Payment" with "Cash" |
| `rukunApp/App.tsx` | Replace "PaymentScreen" with "CashScreen" |
| `rukunApp/contexts/Translations.ts` | Add cash-related translations |

## Implementation Plan

### Phase 1: Core Data Layer

1. **Update `types.ts`**
   - Add `CashTransaction` interface
   - Add `CashTransactionType` type
   - Add `CashStats` interface

2. **Update `SupabaseService.ts`**
   - Add `getCashTransactions()`
   - Add `createCashIn()`
   - Add `createCashOut()`
   - Add `createCashPurchase()`
   - Add `getCashStats()`
   - Update sync queue handling for cash transactions

3. **Update `schema.sql`**
   - Add `cash_transactions` table
   - Add RLS policies

### Phase 2: Context State

4. **Update `ShopContext.tsx`**
   - Add `cashTransactions` to state
   - Add `processCashIn()` method
   - Add `processCashOut()` method
   - Add `processCashPurchase()` method
   - Add `getCashStats()` method

### Phase 3: UI Components

5. **Create `CashActionDialog.tsx`**
   - Props: `customer`, `actionType`, `open`, `onClose`, `onConfirm`
   - Show customer info and current deposit
   - Amount input with validation
   - Warning display for cash out exceeding deposit
   - Notes optional field
   - Real-time balance preview

6. **Create `CashScreen.tsx`**
   - Customer dropdown selector
   - Three action buttons (Cash In, Cash Out, Buy)
   - CashActionDialog for each action
   - Recent cash transactions list
   - Cash stats summary

7. **Create `CashTransactionsScreen.tsx`**
   - List all cash transactions
   - Filter by customer (optional)
   - Summary stats: Total In, Out, Purchases, Net
   - Grouped by date

### Phase 4: Navigation & Routing

8. **Update `App.tsx`**

```typescript
<Route path="/cash" element={<Layout><CashScreen /></Layout>} />
<Route path="/cash-transactions" element={<Layout><CashTransactionsScreen /></Layout>} />
```

9. **Update `BottomNav.tsx`**

```typescript
// Replace Payment with Cash
<NavItem icon={<CashIcon />} label={t.cash} path="/cash" />
```

### Phase 5: Customer Detail Integration

10. **Update `CustomerDetailScreen.tsx`**

```typescript
// Add quick action buttons
<Button onClick={() => navigate('/cash?customer=' + customer.id + '&action=cashIn')}>
  Cash In
</Button>
<Button onClick={() => navigate('/cash?customer=' + customer.id + '&action=cashOut')}>
  Cash Out
</Button>
```

### Phase 6: Translations

11. **Update `Translations.ts`**

```typescript
en: {
  cash: 'Cash',
  cashIn: 'Cash In',
  cashOut: 'Cash Out',
  cashPurchase: 'Cash Purchase',
  cashTransactions: 'Cash Transactions',
  depositBalance: 'Deposit Balance',
  amountExceedsDeposit: 'Amount exceeds deposit',
  creditToBeAdded: 'Credit to be added',
  newDepositBalance: 'New deposit balance',
  proceedAnyway: 'Proceed Anyway',
  cashInSuccess: 'Cash added successfully',
  cashOutSuccess: 'Cash withdrawn successfully',
  buySuccess: 'Purchase recorded',
}

so: {
  cash: 'Lacagta',
  cashIn: 'Lac-bixidda',
  cashOut: 'Qaadis',
  cashPurchase: 'Iibka Lacagta',
  cashTransactions: 'Gal-Qaadis Macmiil',
  depositBalance: 'Haraaga depositeedka',
  amountExceedsDeposit: 'Tirada waxay ka badan tahay depositeedka',
  creditToBeAdded: 'Credit la darayo',
  newDepositBalance: 'Haraaga cusub',
  proceedAnyway: 'Sii soco',
  cashInSuccess: 'Lac-bixidda waa lagu guuleystay',
  cashOutSuccess: 'Qaadiska waa lagu guuleystay',
  buySuccess: 'Iibka waa la diiwaan galay',
}
```

## Cash Out Warning Logic

### Scenario: Customer has 500,000 deposit, wants 600,000 cash out

```
+-------------------------------------------------+
|  Warning                                        |
+-------------------------------------------------+
|  Amount: 600,000 SOS                            |
|  Current Deposit: 500,000 SOS                   |
|                                                 |
|  This exceeds your deposit by: 100,000 SOS      |
|                                                 |
|  ---------------------------------------------  |
|  After transaction:                             |
|  - New Deposit: 0 SOS                          |
|  - Credit Added: 100,000 SOS                   |
|                                                 |
|  [Cancel]                    [Proceed Anyway]  |
+-------------------------------------------------+
```

## Cash Purchase Flow

### No Inventory Impact

Cash purchases are recorded for business records but do NOT:
- Reduce product stock
- Update `totalSold` on products
- Track inventory levels

## Offline Support

Cash transactions follow the same offline-first pattern:
1. **Online:** Record to Supabase immediately
2. **Offline:** Store in localStorage, add to sync queue, sync when back online

## Testing Checklist

- [ ] Cash In increases deposit correctly
- [ ] Cash Out within deposit decreases correctly
- [ ] Cash Out with warning: proceeds despite insufficient deposit
- [ ] Credit added correctly when cash out exceeds deposit
- [ ] Buy records transaction without balance change
- [ ] Customer dropdown shows all customers
- [ ] Recent transactions display correctly
- [ ] Offline: transactions queued, sync when online
- [ ] All translations work in both languages
- [ ] Bottom navigation updated

## Migration

- No database migration needed (new table)
- "Payment" nav item becomes "Cash"
- Existing payment history remains in transactions table
- New cash transactions go to cash_transactions table
