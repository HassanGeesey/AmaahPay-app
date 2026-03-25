import React from 'react';
import { NavLink } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';

export default function BottomNav() {
  const { t } = useShop();
  const navItems = [
    { label: t.home, path: '/', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { label: t.people, path: '/customers', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { label: t.items, path: '/products', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
    { label: 'Report', path: '/report', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  ];
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 flex justify-around items-center"
      style={{ 
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      }}
    >
      {navItems.map(({ path, label, icon }) => (
        <NavLink 
          key={path} 
          to={path}
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center p-2 rounded-xl transition-all">
              <div 
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 transition-all ${
                  isActive ? 'gradient-primary text-white' : ''
                }`}
                style={isActive ? {} : { background: 'var(--color-bg-subtle)', opacity: 0.7 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
              </div>
              <span className="text-[10px] font-medium" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
