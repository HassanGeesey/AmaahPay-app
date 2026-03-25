import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="pb-24 min-h-screen">
          <Header />
          {children}
          <BottomNav />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <DesktopSidebar />
        <main className="ml-64 flex-1 min-h-screen overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
