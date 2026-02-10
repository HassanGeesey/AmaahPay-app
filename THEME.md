# Editorial Minimal Theme

## Overview

A monochrome, minimal design system focused on clarity and elegance. No colored accents or gradients—just pure typographic hierarchy and subtle borders.

## Design Philosophy

- **Monochrome palette**: Only grays and off-whites
- **Typography-driven**: Use font weight and size for hierarchy
- **Subtle borders**: Light borders (stone-200) for card separation
- **Small rounded corners**: Consistent `rounded-lg` (8px) throughout
- **Clean whitespace**: Generous padding and spacing

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `bg-stone-50` | Page backgrounds |
| `--bg-card` | `bg-white` | Cards, modals, dropdowns |
| `--border` | `border-stone-200` | Card borders, dividers |
| `--text-primary` | `text-stone-900` | Headings, primary text |
| `--text-secondary` | `text-stone-500` | Labels, descriptions |
| `--text-muted` | `text-stone-400` | Timestamps, hints |
| `--accent` | `bg-stone-900` | Buttons, active states |

### ❌ No Status Colors

Avoid using colored accents for states:
- ❌ No `bg-green-*` for positive values
- ❌ No `bg-red-*` for negative values
- ❌ No `bg-yellow-*` for warnings
- ❌ No `bg-indigo-*`, `bg-blue-*`, `bg-emerald-*`, etc.

Use monochrome indicators instead:
- Numbers: Plain `text-stone-900`
- Status: Text labels or icons only
- Success/Error: Subtle icon changes or text

## Typography

### Font Family
- **Primary**: System fonts (default Tailwind)
- **Optional**: Google Sans (loaded in index.html)

### Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | `text-2xl` | `font-bold` | `text-stone-900` |
| Section Header | `text-xl` | `font-semibold` | `text-stone-900` |
| Card Title | `text-lg` | `font-medium` | `text-stone-900` |
| Body Text | `text-sm` | `font-normal` | `text-stone-900` |
| Labels | `text-xs` | `font-medium` | `text-stone-500` |
| Captions | `text-xs` | `font-normal` | `text-stone-400` |

### Uppercase Labels
Use for form labels and section headers:
```css
text-xs font-medium text-stone-500 uppercase tracking-wide
```

## Spacing

### Page Layout
```css
min-h-screen bg-stone-50 p-6 pb-32  /* Main container */
max-w-lg mx-auto                   /* Content constraint */
```

### Card Spacing
```css
p-5 or p-6        /* Card padding */
gap-3 or gap-4    /* Grid gaps */
space-y-4 or space-y-6  /* Vertical spacing */
```

### Component Spacing
```css
py-2 px-4         /* Button padding */
p-3               /* Icon button padding */
mb-1              /* Label margin bottom */
```

## Components

### Cards
```jsx
<div className="bg-white p-5 rounded-lg border border-stone-200">
  {/* Content */}
</div>
```

### Buttons

**Primary (Filled)**
```jsx
<button className="bg-stone-900 text-white px-4 py-2 rounded-lg font-medium">
  Button Text
</button>
```

**Secondary (Outlined)**
```jsx
<button className="bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg font-medium">
  Button Text
</button>
```

**Ghost**
```jsx
<button className="text-stone-600 hover:bg-stone-100 px-4 py-2 rounded-lg">
  Button Text
</button>
```

### Form Inputs
```jsx
<input 
  className="w-full px-4 py-3 rounded-lg border border-stone-200 
             focus:ring-2 focus:ring-stone-400 outline-none"
/>
```

### Select/Dropdown
```jsx
<select className="w-full p-3 border border-stone-200 rounded-lg bg-white text-stone-900">
  {/* Options */}
</select>
```

### Modals/Overlays
```jsx
<div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
  <div className="bg-white w-full max-w-sm rounded-lg p-6">
    {/* Modal content */}
  </div>
</div>
```

### Lists with Dividers
```jsx
<div className="divide-y divide-stone-100">
  {items.map(item => (
    <div key={item.id} className="p-4">
      {/* List item */}
    </div>
  ))}
</div>
```

### Icon Buttons
```jsx
<button className="p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg">
  <svg className="w-5 h-5">...</svg>
</button>
```

## Layout Patterns

### Header with Back Button
```jsx
<header className="flex items-center gap-3 mb-6">
  <button className="p-2 -ml-2 text-stone-400 hover:text-stone-600">
    <svg className="w-5 h-5">...</svg>
  </button>
  <h1 className="text-xl font-semibold text-stone-900">Page Title</h1>
</header>
```

### Stats Grid (3 columns)
```jsx
<div className="grid grid-cols-3 gap-3">
  <div className="bg-white rounded-lg p-4 border border-stone-200">
    <p className="text-xs font-medium text-stone-500 mb-1">Label</p>
    <p className="text-base font-semibold text-stone-900">Value</p>
  </div>
</div>
```

### Action Buttons (2 columns)
```jsx
<div className="grid grid-cols-2 gap-3">
  <button className="flex items-center justify-center gap-2 bg-stone-900 text-white rounded-lg py-4 font-medium">
    <svg>...</svg>
    <span>Action 1</span>
  </button>
</div>
```

## Icon Guidelines

### SVG Attributes
```jsx
<svg 
  className="w-5 h-5" 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="..." 
  />
</svg>
```

### Icon Colors
- Default: `text-stone-400` (subtle)
- Hover: `text-stone-900` (emphasis)
- Button icons: Inherit from button text color

## Responsive Considerations

- **Mobile-first**: Design for mobile primarily
- **Max-width**: Constrain content to `max-w-lg` for readability
- **Touch targets**: Minimum 44px for buttons
- **Bottom padding**: Add `pb-32` to account for bottom navigation

## Examples

### Before (Old Design)
```jsx
<div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100">
  <div className="text-emerald-600 font-bold">+ $100</div>
</div>
```

### After (Editorial Minimal)
```jsx
<div className="bg-white p-5 rounded-lg border border-stone-200">
  <div className="text-stone-900 font-semibold">+ $100</div>
</div>
```

## Files Using This Theme

- `Dashboard.tsx`
- `CashScreen.tsx`
- `CustomerDetailScreen.tsx`
- `PurchaseScreen.tsx`
- `CustomersScreen.tsx`
- `ReportScreen.tsx`
- `BackupScreen.tsx`
- `LoginScreen.tsx`
- `AdminSignupScreen.tsx`
- `ProductsScreen.tsx`
- `BottomNav.tsx`
- `Header.tsx`

## Build Output

After building, ensure:
1. All screens use the stone color palette
2. No colored status indicators remain
3. Consistent rounded-lg corners everywhere
4. Proper spacing and typography hierarchy
