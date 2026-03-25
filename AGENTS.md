# AGENTS.md - RukunApp Development Guide

This file provides guidelines for AI agents working on the RukunApp project.

## Project Overview

RukunApp is a React/TypeScript web application for shop management (POS system) with offline-first capabilities, embedded in an Android WebView.

**Tech Stack:**
- React 19 with TypeScript
- Vite 6 for build/dev
- Tailwind CSS 4 for styling
- Supabase for auth and database
- React Router DOM for routing

---

## Build & Development Commands

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
- Runs on http://localhost:3000
- Uses port 3000, host 0.0.0.0

### Production Build
```bash
npm run build
```
- Output: `dist/` folder
- Build uses IIFE format for Android WebView compatibility

### Testing
**No test framework is currently set up.** If adding tests, use Vitest or React Testing Library.

To run a single test file (if tests are added):
```bash
npx vitest run src/path/to/test file
# or
npx vitest --run src/path/to/test file
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## Code Style Guidelines

### General Principles
- Functional React components with hooks
- TypeScript strict mode enabled
- Keep components focused and small
- Use context for global state (AuthContext, ShopContext, ThemeContext)

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Dashboard.tsx`, `CustomerDetailScreen.tsx` |
| Types/Interfaces | PascalCase | `Customer`, `Transaction`, `TransactionType` |
| Variables/Functions | camelCase | `formatCurrency`, `isOnline`, `createCustomer` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Files (utils/helpers) | camelCase | `currency.ts`, `supabase.ts` |

### Import Order
1. React/React DOM imports
2. External libraries (react-router-dom, @supabase/...)
3. Relative imports from `../` or `@/`
4. Relative imports from `./`

```typescript
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
import { Customer } from '../types'
import { formatCurrency } from '../utils/currency'
import LoadingSpinner from '../components/LoadingSpinner'
```

### Component Structure
```typescript
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../contexts/ShopContext'
import { Customer } from '../types'

interface Props {
  customerId: string
  onComplete?: () => void
}

export default function CustomerDetailScreen({ customerId, onComplete }: Props) {
  const navigate = useNavigate()
  const { customers, formatCurrency } = useShop()
  const [isLoading, setIsLoading] = useState(false)

  // ... component logic

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Type Definitions (`types.ts`)
- Use `type` for unions/primitives
- Use `interface` for objects
- Export all types
- Use descriptive property names

```typescript
export type TransactionType = 'purchase' | 'payment'
export type Language = 'en' | 'so'

export interface Customer {
  id: string
  name: string
  phone: string
  deposit: number
  credit: number
  createdAt: number
  updatedAt: number
}
```

### React Patterns
- **Context consumption**: Use custom hooks (`useAuth`, `useShop`, `useTheme`)
- **State**: Use `useState` for local state, context for global state
- **Effects**: Use `useEffect` for side effects, prefer `useMemo` for expensive calculations
- **Refs**: Use `useRef` for mutable values that don't trigger re-renders
- **Event handlers**: Define with `const handleX = () => {...}`

### Error Handling
- Use ErrorBoundary component at app root
- Wrap async operations in try/catch
- Provide user feedback via Toast notifications
- Log errors appropriately

```typescript
try {
  setIsLoading(true)
  await createCustomer(data)
  toast.success('Customer created')
} catch (error) {
  console.error('Failed to create customer:', error)
  toast.error('Failed to create customer')
} finally {
  setIsLoading(false)
}
```

### Routing
- Use React Router DOM v7
- Routes defined in `App.tsx`
- Use `HashRouter` for Android WebView compatibility
- Protected routes via `ProtectedRoute` component

```typescript
<Route path="/customers" element={
  <ProtectedRoute>
    <CustomersScreen />
  </ProtectedRoute>
} />
```

### Styling with Tailwind
- Use Tailwind CSS utility classes
- Prefer semantic class combinations
- Use consistent spacing scale

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span className="text-lg font-medium text-gray-900">{customer.name}</span>
</div>
```

---

## Project Structure

```
rukunApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   └── *.tsx            # Feature components
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ShopContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/             # Page components
│   ├── services/            # API and business logic
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── lib/                 # Third-party configs
│   ├── App.tsx              # Root component
│   └── index.tsx            # Entry point
├── @/                       # Path alias to project root
├── types.ts                 # Global type definitions
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

---

## Android WebView Notes

After running `npm run build`, fix `dist/index.html` for Android WebView:
1. Remove `type="module"` from script tag
2. Remove `crossorigin` from script/link tags
3. Move script tag to end of `<body>`
4. Change asset paths to `./assets/filename.js`

---

## Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Key Contexts

### AuthContext
- User authentication state
- Session management
- Language preference (`en` | `so`)
- Methods: `signUp`, `signIn`, `signOut`, `resetPassword`

### ShopContext
- Customers, products, transactions state
- CRUD operations
- Purchase and payment processing
- Sync status
- Currency formatting (`formatCurrency`)
- Translation access via `t` object

### ThemeContext
- Theme management: `light` | `dark` | `system`

---

## Database

Supabase tables: `customers`, `products`, `transactions`, `profiles`
See `database/schema.sql` for full definitions.

---

## No Lint/Prettier Config

Currently no ESLint or Prettier is configured. Consider adding:
- ESLint with React plugin
- Prettier for code formatting
- Consider using `@typescript-eslint/recommended`
