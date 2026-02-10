import React from 'react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function QuickActionCard({
  icon,
  label,
  description,
  onClick,
  variant = 'primary',
  className
}: QuickActionCardProps) {
  const variants = {
    primary: "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm",
    secondary: "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm",
    outline: "bg-white border border-[#E8E8E8] text-[#1A1A1A] hover:border-[#D1D5DB] hover:bg-[#FAFAFA]"
  };

  const iconVariants = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-[#6B7280]"
  };

  const Content = () => (
    <div className={cn(
      "flex flex-col items-center justify-center p-5 rounded-xl transition-all duration-300",
      "hover:scale-[1.02] active:scale-[0.98]",
      variants[variant],
      className
    )}>
      <div className={cn("mb-2.5", iconVariants[variant])}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <span className="font-medium text-sm">{label}</span>
      {description && (
        <p className={cn("text-xs mt-1 opacity-80", iconVariants[variant])}>{description}</p>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        <Content />
      </button>
    );
  }

  return <Content />;
}

interface QuickActionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function QuickActionGrid({ children, columns = 2, className }: QuickActionGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns], className)}>
      {children}
    </div>
  );
}
