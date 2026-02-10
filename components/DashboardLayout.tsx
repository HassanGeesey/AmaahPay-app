import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-[#FAFAFA]", className)}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-5",
      className
    )}>
      {children}
    </div>
  );
}

interface GridColumnProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  className?: string;
}

export function GridColumn({ children, span = 1, className }: GridColumnProps) {
  const spanClasses = {
    1: "col-span-1",
    2: "col-span-1 md:col-span-2",
    3: "col-span-1 md:col-span-3",
    4: "col-span-1 md:col-span-4"
  };

  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Section({ children, title, subtitle, action, className }: SectionProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-[#E8E8E8] shadow-sm", className)}>
      {(title || subtitle || action) && (
        <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>}
            {subtitle && <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
