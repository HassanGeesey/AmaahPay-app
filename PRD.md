# AmaahPay — Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** 2026-04-03  
**Product Name:** AmaahPay  
**Platform:** Web App (React/TypeScript), embedded in Android WebView  
**Audience:** Shop owners (Somali small businesses) + Platform Admin  

---

## 1. Overview

AmaahPay is a shop management point-of-sale (POS) system designed for small Somali shops. It uses a **deposit-and-credit** financial model: each customer has a deposit (money paid in advance) and a credit balance (money owed). Shopkeepers record sales against a customer's deposit, and customers can add/withdraw funds.

The app runs in an Android WebView. It must be **offline-first** and synced with Supabase when online.

---

## 2. User Roles

| Role | Description |
|---|---|
| **Shop Owner** | Logs in and manages their own shop: customers, products, sales, cash, and reports. |
| **Platform Admin** | System administrator who manages all shop owner accounts and subscriptions. |

---

## 3. Authentication

### 3.1 Login Screen (`/login`)

**Purpose:** Single entry point for all users.

**UI Elements:**
- App logo (box icon) + "AmaahPay" wordmark centered at top
- Subtitle: "Sign in to continue to your shop"
- Email input field
- Password input field
- "Sign In" primary button (full width)
- Contact section below: "Call" and "WhatsApp" buttons (grid 2-col) for support

**Behavior:**
- On successful login:
  - If `user.user_metadata.role === 'admin'` → redirect to `/admin`
  - Otherwise → redirect to `/` (shop dashboard)
- Show inline error message on failed login: "Invalid email or password"
- Show loading spinner inside button while request is in flight

**Notes:**
- No "sign up" link for shop owners (accounts are created by admin)
- No "Admin Panel" link visible on this screen

---

### 3.2 Session Management

- Session persisted via Supabase `auth.getSession()`
- On `SIGNED_OUT` event: clear `shop_keep_data_v2` from localStorage
- Language preference persisted in `localStorage` as `shop_keep_language`

---

## 4. Shop Owner App (Regular User)

### 4.1 Layout & Navigation

#### Mobile (`< 1024px`)
- **Header** (top bar): Shop name & online/offline badge on the left; hamburger menu on the right with language toggle and sign out.
- **Bottom Navigation Bar**: 5 tabs — Dashboard, Customers, Items, Reports, Settings.
- **Page content** fills between header and bottom nav.

#### Desktop (`≥ 1024px`)
- **Sidebar** (left, fixed, 256px wide):
  - Top: App logo + shop name + online/offline status pill
  - Navigation items (with icon + label):
    1. Dashboard (`/`)
    2. Customers (`/customers`)
    3. Items (`/products`)
    4. New Sale (`/purchase`)
    5. Cash (`/cash`)
    6. Reports (`/report`)
  - Admin section (only shown if user is admin):
    - Label "ADMIN"
    - Dashboard (`/admin`)
    - Users (`/admin/users`)
    - Subscriptions (`/admin/subscriptions`)
  - Bottom section:
    - Settings button (`/settings`)
    - **Logout button** (red tint, with logout arrow icon) — calls `signOut()` then navigates to `/login`
- **Main content** area is to the right of the sidebar (`ml-64`), padded `p-8`, scrollable.

---

### 4.2 Dashboard (`/`)

**Purpose:** Overview of the shop's financial health + quick actions.

**UI Layout (Mobile):**
- Shop name + customer count in a header row with logo icon
- 3 stat cards in a row:
  - **Deposit** (green): sum of all customers' deposits
  - **Credit** (amber): sum of all customers' credits
  - **Net** (green if ≥ 0, red if < 0): Deposit − Credit
- 2 large action buttons stacked:
  - **New Sale** (primary/green) → `/purchase`
  - **Cash** (card style) → `/cash`
- Recent Transactions card (last 4):
  - Each row: customer avatar icon (purchase=green gradient, payment=amber), customer name, time, amount
  - Click row → goes to `/customer/:id`
  - "View All" link → `/report`
  - Empty state with "New Sale" CTA

**UI Layout (Desktop):**
- Two-column layout:
  - Left column (fixed width): 3 stat cards stacked vertically + 2 action buttons
  - Right column: Recent Transactions card (fills remaining width)

---

### 4.3 Customers Screen (`/customers`)

**Purpose:** View and manage all customers.

**UI:**
- Top summary bar (3 cells, row):
  - Total Deposit (green bg)
  - Total Credit (amber bg)
  - Customer Count
- Header row: "Customers" title + "Add Customer" primary button
- Search bar (with search icon inside, searches by name or phone)
- Customer cards grid:
  - **Mobile:** 1 column, stacked
  - **Desktop:** 2-column grid
  - Each card:
    - Avatar (first letter of name, green gradient circle)
    - Name (bold), Phone (muted)
    - Net balance badge (green pill if positive, red pill if negative)
    - Deposit progress bar (green) + credit progress bar (amber)
    - Click card → `/customer/:id`
- Empty state: illustration icon + "Add Customer" CTA

**Add Customer Modal (overlay):**
- Title: "Add Person"
- Fields: Name (text, required), Phone (tel, required), Initial Deposit (number, default 0), Initial Credit (number, default 0)
- Buttons: Cancel + Save
- Error message if save fails

---

### 4.4 Customer Detail Screen (`/customer/:id`)

**Purpose:** View a single customer's balances and full transaction history, and take actions.

**UI:**
- Back button → `/customers`
- Page title: "Customer Profile"
- **Profile Card** (rounded, elevated):
  - Avatar (large, 80px, green gradient, first letter)
  - Name + Phone
  - Net Position: shows `+amount` in green or `-amount` in red
- **Balance Breakdown** (3 stat mini-cards, row):
  - Deposit (green)
  - Credit (amber)
  - Available (= max(0, deposit))
- **Quick Action Buttons** (2-col grid):
  - New Sale (primary) → `/purchase?customerId=:id`
  - Cash → `/cash?customerId=:id`
- **Transaction History Card:**
  - Header: "Transaction History" + count badge
  - List of all transactions for this customer, sorted newest first:
    - Icon (purchase=green gradient, payment=green tint)
    - Type label (PURCHASE / PAYMENT), date/time, optional notes
    - Amount + new deposit/credit balance badges
  - Max height 400px, scrollable
  - Empty state

---

### 4.5 Products Screen (`/products`)

**Purpose:** Manage the product catalog used when creating sales.

**UI:**
- Header: "Items" title + product count + "Add Item" button
- Product list (1 column):
  - Each card (elevated, rounded):
    - Product name (bold, large)
    - Unit price with currency symbol
    - Total sold count
    - Edit button (pencil icon)
- Empty state: box icon + "Add Item" CTA

**Add / Edit Product Modal:**
- Title: "Add Item" or "Save"
- Fields: Name (text, required), Price (number with currency prefix, required)
- Buttons: Cancel + Save
- Click outside modal to close

---

### 4.6 New Sale Screen (`/purchase`)

**Purpose:** Create a purchase transaction for a customer.

**UI:**
- Header: Back button + "New Sale" title
- Customer selector (`<select>` dropdown, "Choose customer")
- 2-col button row:
  - **Add Customer** (opens inline modal to create new customer on the fly)
  - **Cash Out** (adds a special "Cash Out" line item to the cart — disabled if already added)
- Product search input (autocomplete dropdown, shows up to 8 matching products):
  - Each dropdown row: product name (left), price (right)
  - Click to add to cart
  - If no match: "No results" message
- Cart items list:
  - Each item: dot + name, remove X button
  - For regular products: quantity stepper (−/+) + editable unit price field + item total
  - For Cash Out items: "Numbers" input + "Amount per number" input + calculated total
- Notes textarea (shown when cart has items)
- Summary panel (dark background, bottom):
  - Total amount
  - Customer snapshot: name, deposit, credit
  - Confirm button (disabled if no customer selected)
- On Confirm → save purchase, navigate to `/customer/:id`
- Add Customer modal (same as Customers screen modal, pre-fills selection after save)

---

### 4.7 Cash Screen (`/cash`)

**Purpose:** Process cash-in (deposit) or cash-out (withdrawal) for a customer.

**Two-step flow:**

**Step 1 – Customer Selection:**
- Header: Back button (→ `/`) + "Cash" title
- Search input to filter customers
- Customer list: name + phone + deposit/credit amounts
- Tap customer → move to Step 2

**Step 2 – Transaction Entry:**
- Header: Back (→ Step 1) + "Cash / {customer name}"
- Balance display (2-col card): Deposit | Credit
- 2 action buttons row:
  - **Cash In** (dark, adds to deposit)
  - **Cash Out** (dark, reduces deposit; if amount > deposit, shows warning modal)
- Form card:
  - Amount input (number, large font)
  - Notes input (optional)
- Preview card: shows estimated new deposit balance
- On Cash In/Out → process, navigate to `/`
- **Warning modal** (if cash out > deposit):
  - Shows current deposit, requested amount, shortfall as credit
  - Cancel / Continue (proceeds with credit)

---

### 4.8 Reports Screen (`/report`)

**Purpose:** View financial summaries and transaction history with filtering.

**UI:**
- Header: Back button + "Report" title + "PDF" export button (right)
- Filter section:
  - Customer dropdown ("All Customers" + individual customers)
  - Date range tabs: All | Today | Week | Month
- Summary stats (2×2 grid of metric cards):
  - Cash In (green)
  - Cash Out (red)
  - Purchases (primary)
  - Products (amber)
- "Products by Customer" card (collapsible list, max 320px/scrollable):
  - Customer name + total purchased
  - Products breakdown: name × qty + subtotal
  - Only shown if there are purchase transactions
- "Cash Transactions" card (scrollable list):
  - Each row: type icon (green/red) + customer name + date + signed amount
- "Sales & Payments" card (scrollable list):
  - Same structure as cash transactions

---

### 4.9 Settings Screen (`/settings`)

**Purpose:** Configure app preferences.

**UI:**
- Back button + "Settings" title
- **Appearance card:**
  - 3 theme options (radio-style buttons): Light | Dark | System
  - Each shows icon + label + description
  - "Apply Theme" primary button (shows "Theme Applied!" for 2s after save)
- **Settings list (card):**
  - Currency → `/currency`
  - Backup → `/backup`
  - (Admin Panel link — for admin-role users only, navigates to `/admin-signup`)

---

### 4.10 Currency Settings Screen (`/currency`)

**Purpose:** Change the currency symbol and code used throughout the app.

**UI:**
- Back button + title
- List of supported currencies (e.g. USD, SOS, etc.)
- Select a currency → updates globally via ShopContext
- Apply button

---

### 4.11 Backup Screen (`/backup`)

**Purpose:** Export data for backup.

**UI:**
- Back button + title
- Export buttons (JSON, CSV etc.)
- Last backup timestamp

---

## 5. Platform Admin App

The admin panel is a separate layout accessible only to users with `role === 'admin'` in `user_metadata`.

### 5.1 Admin Layout (`/admin/*`)

**Sidebar (left, fixed):**
- Logo + "AmaahPay Admin" + admin badge
- Navigation:
  - Dashboard (`/admin`)
  - Users (`/admin/users`)
  - Subscriptions (`/admin/subscriptions`)
  - Reports (`/admin/reports`)
- Bottom: User info (email) + Logout button

**Content area:** right of sidebar

---

### 5.2 Admin Dashboard (`/admin`)

**Purpose:** Overview of all shops on the platform.

**UI:**
- Header: "Admin Dashboard" + subtitle
- 4 stat cards (2×2 grid on mobile, 4-col on desktop):
  - Total Users
  - Active Users (green)
  - Inactive Users (red)
  - Total Revenue ($)
- Two widget cards (1-col mobile, 2-col desktop):
  - **User Management widget:** lists 5 most recent users with status badge + "View All" button → `/admin/users`
  - **Quick Actions widget** (2×2 grid):
    - View Users → `/admin/users`
    - Create Shop → `/admin-signup`
    - Subscriptions → `/admin/subscriptions`
    - Reports → `/admin/reports`

---

### 5.3 User Management Screen (`/admin/users`)

**Purpose:** View and manage all shop owner accounts.

**UI:**
- Header + search bar
- User list/table:
  - Each row: avatar (first letter) + Email + Shop Name + Status (Active/Inactive pill) + subscription expiry + toggle access button
- **Toggle Access:** enables/disables a shop account. When enabling, extends subscription by 30 days.
- Empty / loading states

---

### 5.4 Subscription Management Screen (`/admin/subscriptions`)

**Purpose:** View and verify subscription payments.

**UI:**
- Header
- Subscriptions list:
  - Each row: shop email + plan + amount + payment date + expiry date + status
  - "Verify Payment" button for pending subscriptions

---

### 5.5 Admin Reports Screen (`/admin/reports`)

**Purpose:** Platform-level analytics.

**UI:**
- Revenue charts / summaries
- Subscription status breakdown
- Active/inactive user trends

---

### 5.6 Create Shop Account Screen (`/admin-signup`)

**Purpose:** Admin creates a new shop owner account.

**Access:** Only accessible by logged-in admin users.

**UI:**
- Logo + "Create New Shop" badge
- Form card:
  - Shop Name (text, required)
  - Email (required)
  - Password (min 6 chars, required)
  - Subscription Plan (select: Basic $9/mo | Professional $19/mo | Enterprise $49/mo)
  - Buttons: Back to Dashboard | Create Shop Account
- 30-day free trial auto-applied on creation
- Note box: "Create a new shop account with 30 days free trial."
- Success message + 5s cooldown before next submission
- Error message displayed inline

---

## 6. Data Model

### Customer
```
id: string
name: string
phone: string
deposit: number        // money deposited
credit: number         // money owed (spent beyond deposit)
createdAt: timestamp
updatedAt: timestamp
```

### Product
```
id: string
name: string
unitPrice: number
totalSold: number
createdAt: timestamp
updatedAt: timestamp
```

### Transaction
```
id: string
type: 'purchase' | 'payment'
customerId: string
customerName: string
amount: number
items?: TransactionItem[]   // present for purchase type
previousBalance: { deposit, credit }
newBalance: { deposit, credit }
timestamp: number
notes?: string
```

### TransactionItem
```
productId: string
productName: string
quantity: number
unitPrice: number
total: number
```

### CashTransaction
```
id: string
type: 'cash_in' | 'cash_out'
customerId: string
customerName: string
amount: number
notes?: string
timestamp: number
```

### Profile (Supabase `profiles` table)
```
id: uuid (FK to auth.users)
email: string
shop_name: string
role: string
subscription_status: string
subscription_end: timestamp
is_active: boolean
last_login: timestamp
created_at: timestamp
```

---

## 7. Business Logic

### Financial Model

- **Deposit** = money the customer has paid upfront
- **Credit** = money the customer owes (accumulated when purchase > available deposit)
- **Net** = Deposit − Credit
- A **purchase** deducts from deposit first; if deposit is insufficient, remainder goes to credit.
- A **cash-in payment** adds to deposit (reduces any outstanding credit effectively).
- A **cash-out** deducts from deposit. If amount > deposit, the shortfall is logged as credit after admin warning and confirmation.

### Subscription Model

- Each shop account has a subscription with: plan (basic/professional/enterprise), amount ($9/$19/$49), expiry date.
- New accounts get 30 days free trial.
- When admin enables a disabled user, their subscription is extended by 30 days.
- Inactive accounts cannot access the shop dashboard (blocked by `is_active` check).

---

## 8. Themes & Styling

### Color System

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | white | near-black |
| `--color-surface` | white | dark surface |
| `--color-primary` | deep green (#064E3B) | emerald |
| `--color-success` | `#059669` | emerald-400 |
| `--color-warning` | `#D97706` | amber-400 |
| `--color-error` | `#DC2626` | red-400 |
| `--color-accent` | amber | amber |
| `--color-text` | near-black | white |
| `--color-text-secondary` | gray-600 | gray-300 |
| `--color-text-muted` | gray-400 | gray-500 |
| `--color-border` | gray-200 | gray-800 |
| `--color-bg-subtle` | gray-50 | gray-900 |

### Themes
- **Light**: white backgrounds, standard shadows
- **Dark**: dark backgrounds, inverted
- **System**: follows `prefers-color-scheme` media query

### Typography
- Display font: custom `--font-display` variable (Inter or similar sans-serif)
- Body: system-ui or Inter
- Use font weights: 400 (body), 500 (medium), 600 (semibold)

### Component Styles

| Class | Meaning |
|---|---|
| `card-elevated` | White card with shadow |
| `btn-primary` | Deep green button, white text |
| `input-field` | Bordered input with proper focus ring |
| `gradient-primary` | Deep green gradient (used in avatars) |
| `gradient-mesh` | Full page subtle background gradient |
| `animate-fade-in-up` | Entrance animation from bottom |
| `animate-scale-in` | Scale-in entrance for modals |
| `animate-pulse-glow` | Slow pulsing glow for icon |

---

## 9. Multilingual Support

The app supports two languages:

| Code | Language |
|---|---|
| `en` | English (default) |
| `so` | Somali |

- Language toggled via a button in the Header / Admin sidebar
- Persisted to `localStorage` as `shop_keep_language`
- All UI strings come from the `translations` object keyed by `Language`
- Currency symbol and formatting are configurable separately via Settings

---

## 10. Offline-First Architecture

- Data is stored in `localStorage` under the key `shop_keep_data_v2`
- Data includes: `customers`, `products`, `transactions`, `cashTransactions`, `settings`
- When online, data syncs with Supabase (`customers`, `products`, `transactions`, `profiles` tables)
- Online status is shown in the sidebar/header as a green `● Online` or grey `○ Offline` indicator

---

## 11. Routing Summary

### Shop Owner Routes
| Path | Component | Auth |
|---|---|---|
| `/login` | LoginScreen | Public |
| `/` | Dashboard | Protected |
| `/customers` | CustomersScreen | Protected |
| `/customer/:id` | CustomerDetailScreen | Protected |
| `/products` | ProductsScreen | Protected |
| `/purchase` | PurchaseScreen | Protected |
| `/cash` | CashScreen | Protected |
| `/report` | ReportScreen | Protected |
| `/statistics` | StatisticsScreen | Protected |
| `/settings` | SettingsScreen | Protected |
| `/currency` | CurrencySettingsScreen | Protected |
| `/backup` | BackupScreen | Protected |

### Admin Routes
| Path | Component | Auth |
|---|---|---|
| `/admin` | AdminDashboardScreen | Admin only |
| `/admin/users` | UserManagementScreen | Admin only |
| `/admin/subscriptions` | SubscriptionManagementScreen | Admin only |
| `/admin/reports` | AdminReportsScreen | Admin only |
| `/admin-signup` | AdminSignupScreen | Admin only |

---

## 12. Technical Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Router | React Router DOM v7 (HashRouter) |
| Backend | Supabase (auth + PostgreSQL) |
| Deployment | Android WebView (IIFE build) |

### Android WebView Build Requirements
After `npm run build`, manually fix `dist/index.html`:
- Remove `type="module"` from `<script>` tag
- Remove `crossorigin` attributes
- Move `<script>` to end of `<body>`
- Change asset paths to `./assets/filename.js`

---

## 13. Error Handling

- Root `<ErrorBoundary>` component wraps the whole app
- Loading states handled per-screen with `LoadingSpinner`
- Toast notifications (`addToast`) for user feedback on actions
- Async operations wrapped in try/catch with `setLoading` guards
- `ProtectedRoute`: redirects unauthenticated users to `/login`
- `AdminProtectedRoute`: redirects non-admins to `/` and unauthenticated users to `/login`

---

## 14. Key UX Principles

1. **Mobile-first**: designed for hand-held shop use on small screens
2. **Speed**: optimistic UI updates; animations deferred, no blocking spinners unless necessary
3. **Clarity**: financial amounts always formatted with currency symbol; green = positive, red/amber = negative/credit
4. **Offline resilience**: app works fully offline; sync is background/non-blocking
5. **Safety**: destructive actions (disabling users, large cash-outs) require confirmation
6. **Privacy**: admin and shop data are strictly separated by role
