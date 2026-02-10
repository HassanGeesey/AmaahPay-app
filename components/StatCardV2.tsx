import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardV2Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  status?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function StatCardV2({
  label,
  value,
  icon,
  trend,
  status = 'default',
  className
}: StatCardV2Props) {
  const statusColors = {
    default: "text-[#6B7280]",
    success: "text-[#10B981]",
    warning: "text-[#F59E0B]",
    error: "text-[#EF4444]"
  };

  const iconBgColors = {
    default: "bg-[#F5F5F5]",
    success: "bg-[#ECFDF5]",
    warning: "bg-[#FFFBEB]",
    error: "bg-[#FEF2F2]"
  };

  const trendColors = {
    positive: "text-[#10B981]",
    negative: "text-[#EF4444]",
    neutral: "text-[#9CA3AF]"
  };

  const getTrendType = (): 'positive' | 'negative' | 'neutral' => {
    if (!trend) return 'neutral';
    return trend.value >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className={cn(
      "bg-white rounded-xl p-5 border border-[#E8E8E8] shadow-sm",
      "hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          iconBgColors[status]
        )}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trendColors[getTrendType()]
          )}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {trend.value >= 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-[#6B7280]">{label}</p>
        <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{value}</p>
        {trend && (
          <p className="text-xs text-[#9CA3AF] mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  );
}

interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatCardGrid({ children, columns = 4, className }: StatCardGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}
