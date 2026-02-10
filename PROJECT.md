# RukunApp - Shop Management Application

A React/TypeScript web application for shop management with offline-first capabilities, embedded in an Android WebView.

## Project Overview

RukunApp is a point-of-sale (POS) and shop management system that allows shop owners to:
- Manage customers with deposit and credit tracking
- Manage products and inventory
- Record purchases and payments
- Track transaction history
- Synchronize data between devices
- Backup and restore data

**Architecture:** React SPA → Vite build → Android WebView

## Directory Structure

```
rukunApp/
├── src/                      # Source files
│   ├── components/           # Reusable UI components
│   │   ├── dashboard/        # Dashboard-related components
│   │   └── ui/               # shadcn/ui components
│   ├── contexts/             # React Context providers
│   ├── lib/                  # Third-party library configs
│   ├── screens/              # Page components
│   ├── services/             # API and business logic
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── App.tsx               # Root component
├── contexts/                  # Context providers (alt location)
├── components/                # Reusable components (alt location)
├── screens/                   # Screen components (alt location)
├── services/                  # Services (alt location)
├── @/                         # Path aliases
├── database/                  # SQL schema files
├── index.tsx                  # Entry point
├── App.tsx                    # Root component
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── index.css                  # Global styles
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router DOM** - Routing
- **Supabase** - Backend (auth + database)
- **shadcn/ui** - UI component library

## Key Features

### Authentication
- Email/password authentication via Supabase Auth
- Session management with auto-restore
- Language preference persistence
- Protected routes with `ProtectedRoute` component

### Customer Management
- Add customers with name, phone, deposit, and credit
- Edit customer information
- View customer transaction history
- Customer detail screen with balance tracking

### Product Management
- Add products with name and unit price
- Track total sold for each product
- Product catalog with search

### Transactions
- **Purchases**: Create sales with multiple items
  - Updates customer deposit/credit balance
  - Tracks product sales quantities
- **Payments**: Record customer payments
  - Reduces credit balance
  - Can increase deposit if overpayment

### Offline Support
- LocalStorage for offline data persistence
- Sync queue for pending operations
- Auto-sync when coming back online
- Manual sync trigger available

### Data Synchronization
- Sync pending operations to Supabase
- Download data for offline use
- Connection status indicator
- Last sync timestamp tracking

### Data Backup
- Daily automatic backups
- Manual backup creation
- Restore from backup
- Backup schema documentation

### Multi-Language Support
- English (en) and Somali (so)
- Toggle language from auth context
- All UI text translatable

## Screens

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginScreen | User authentication |
| `/admin-signup` | AdminSignupScreen | New shop registration |
| `/` | Dashboard | Main dashboard with stats |
| `/customers` | CustomersScreen | Customer list |
| `/customer/:id` | CustomerDetailScreen | Customer details & history |
| `/products` | ProductsScreen | Product catalog |
| `/purchase` | PurchaseScreen | New sale entry |
| `/payment` | PaymentScreen | New payment entry |
| `/statistics` | StatisticsScreen | Sales reports |
| `/currency` | CurrencySettingsScreen | Currency preferences |
| `/sync` | SyncScreen | Data sync management |
| `/backup` | BackupScreen | Backup & restore |

## Context Providers

### AuthContext (`contexts/AuthContext.tsx`)
- User authentication state
- Session management
- Language preference (`en` | `so`)
- Auth methods: `signUp`, `signIn`, `signOut`, `resetPassword`

### ShopContext (`contexts/ShopContext.tsx`)
- Customers, products, transactions state
- CRUD operations for customers/products
- Purchase and payment processing
- Sync status and operations
- Currency formatting
- Translation access via `t` object

## Data Types (`types.ts`)

```typescript
TransactionType = 'purchase' | 'payment'
Language = 'en' | 'so'

interface Customer {
  id, name, phone, deposit, credit, createdAt, updatedAt
}

interface Product {
  id, name, unitPrice, totalSold, createdAt, updatedAt
}

interface TransactionItem {
  productId, productName, quantity, unitPrice, total
}

interface Transaction {
  id, type, customerId, customerName, amount, items?,
  previousBalance, newBalance, timestamp, notes?
}
```

## Services

### SupabaseService (`services/SupabaseService.ts`)
- Database CRUD operations
- Offline-first with sync queue
- LocalStorage persistence
- Methods:
  - `getCustomers()` / `createCustomer()` / `updateCustomer()`
  - `getProducts()` / `createProduct()` / `updateProduct()`
  - `getTransactions()` / `createTransaction()`
  - `syncPendingOperations()`
  - `getSyncStats()`

### BackupService (`services/BackupService.ts`)
- Daily automatic backups
- Manual backup/restore
- Data export/import

## Components

### Layout Components
- **Header**: Top navigation bar
- **BottomNav**: Mobile bottom navigation
- **DashboardLayout**: Dashboard wrapper

### UI Components (`components/ui/`)
- Button, Card, Input, Badge
- Dialog, Select, DropdownMenu
- Separator, Avatar, Progress

### Feature Components
- **StatCardV2**: Statistics display card
- **QuickActionCard**: Quick action buttons
- **ActivityFeed**: Recent activity timeline
- **ConnectionStatus**: Online/offline indicator
- **ProtectedRoute**: Auth protection wrapper

## Build & Run

```bash
# Install dependencies
cd rukunApp
npm install

# Development server (port 3000)
npm run dev

# Production build
npm run build

# Output: dist/ folder
```

## Build Output Fix (Android WebView)

After `npm run build`, fix `dist/index.html`:
1. Remove `type="module"` from script tag
2. Remove `crossorigin` from script/link tags
3. Move script tag to end of `<body>`
4. Change asset paths to `./assets/filename.js`

## Path Aliases

Configured in `vite.config.ts`:
- `@/` → project root

## Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

See `database/schema.sql` for Supabase table definitions:
- `customers` - Customer records
- `products` - Product catalog
- `transactions` - Purchase/payment history
- `profiles` - User profiles with shop names

## Code Style

- Functional React components with hooks
- TypeScript strict mode
- PascalCase for components/types
- camelCase for variables/functions
- Named exports for utilities
- Default exports for components

## Integration with Android

After building:
1. Copy `dist/*` to `app/src/main/assets/webapp/`
2. Android WebView loads `file:///android_asset/webapp/index.html`
3. Ensure HTML is fixed for WebView (no modules, relative paths)

## Dependencies

### Core
- `react`, `react-dom` - UI framework
- `react-router-dom` - Routing

### Backend
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-ui-react` - Auth UI components

### Styling
- `tailwindcss` - CSS framework
- `@tailwindcss/vite` - Vite plugin

### Development
- `typescript` - Type checking
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin

## License

MIT
