# AmaahPay - Shop Management POS System

**AmaahPay** is a modern, offline-first Point of Sale (POS) system for shop management, built with React/TypeScript. Designed for shops in Somalia and the Horn of Africa with full Somali language support.

![AmaahPay Dashboard](https://i.imgur.com/placeholder.png)

## 🚀 Live Demo

**[https://amaahpay.vercel.app](https://amaahpay.vercel.app)**

## ✨ Features

### Core Functionality
- **Customer Management** - Track deposits, credits, and customer profiles
- **Product Catalog** - Manage inventory and pricing
- **Sales & Purchases** - Full transaction recording
- **Payment Tracking** - Monitor deposits and credit balances
- **Cash Management** - Record cash-in and cash-out

### Business Intelligence
- **Reports Dashboard** - Complete financial overview
- **Customer Analytics** - Track spending patterns
- **Transaction History** - Full audit trail with timestamps
- **Balance Tracking** - Net position calculations

### Admin Features
- **Shop Creation** - Admin panel for creating new shops
- **Access Control** - Subscription-based access management
- **User Management** - Monitor all shop owners

### Design & UX
- **Modern Editorial Design** - Playfair Display + DM Sans typography
- **Dark/Light Mode** - System-based theme support
- **Mobile-First** - Responsive design for all devices
- **Offline Support** - Works without internet connection

## 📱 Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite 6 | Build Tool |
| Tailwind CSS 4 | Styling |
| Supabase | Backend & Auth |
| React Router DOM | Navigation |

## 🗣️ Language Support

- **English** 🇺🇸
- **Somali** 🇸🇴 (af-Soomaali)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- NPM or Yarn
- Supabase Account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HassanGeesey/AmaahPay-app.git
   cd AmaahPay-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_ACCESS_CODE=your-admin-code
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Deployment

### Android WebView
After running `npm run build`, update `dist/index.html` for Android WebView:
1. Remove `type="module"` from script tag
2. Remove `crossorigin` attributes
3. Move script tag to end of `<body>`
4. Change asset paths to `./assets/filename.js`

### Vercel / Netlify
Simply connect your GitHub repository and deploy automatically.

## 💰 Business Model

AmaahPay is designed as a **B2B SaaS product** for shop owners:

- **Admin Access** - Requires special admin code (`VITE_ADMIN_ACCESS_CODE`)
- **Shop Creation** - Admins can create new shop accounts
- **Subscription** - Charge shop owners monthly/annually for access

### Pricing Strategy (Suggested)
| Plan | Price | Features |
|------|-------|----------|
| Starter | $9/mo | 1 shop, 100 products |
| Professional | $19/mo | 3 shops, unlimited products |
| Enterprise | $49/mo | 10 shops, premium support |

## 🛠️ Project Structure

```
rukunApp/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── BottomNav.tsx # Mobile navigation
│   │   └── DesktopSidebar.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ShopContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/
│   │   ├── Dashboard.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── AdminSignupScreen.tsx
│   │   ├── CustomersScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   ├── utils/
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

## 🔧 Configuration

### Supabase Setup
1. Create a Supabase project
2. Set up authentication (Email/Password)
3. Create database tables:
   - `customers`
   - `products`
   - `transactions`
   - `profiles`

### Database Schema
See `database/schema.sql` for table definitions.

## 🎨 Design System

### Colors
- **Primary**: Emerald Green (#064E3B)
- **Accent**: Amber (#D97706)
- **Success**: Green (#059669)
- **Warning**: Amber (#D97706)
- **Error**: Red (#DC2626)

### Typography
- **Display**: Playfair Display (headings)
- **Body**: DM Sans (body text)

### Icons
- Heroicons or custom SVG icons

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **Developer**: Hassan Geesey
- **Repository**: [https://github.com/HassanGeesey/AmaahPay-app](https://github.com/HassanGeesey/AmaahPay-app)
- **Support**: Contact via WhatsApp +252619444629

## 🙏 Acknowledgments

- Built for Somali shop owners
- Designed for offline-first environments
- Optimized for Android WebView deployment
