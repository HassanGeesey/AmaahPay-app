import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface ActivityItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  type?: 'purchase' | 'payment' | 'info' | 'warning' | 'success';
  icon?: React.ReactNode;
  avatar?: string;
  badge?: string;
  amount?: string;
  metadata?: Record<string, string>;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityFeed({ items, emptyMessage = "No activity yet", className }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className={cn("py-10 text-center text-[#9CA3AF]", className)}>
        <svg className="w-10 h-10 mx-auto mb-3 text-[#E5E5E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  const typeStyles = {
    purchase: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      badge: "bg-[#FEF3C7] text-[#D97706]"
    },
    payment: {
      bg: "bg-[#D1FAE5]",
      text: "text-[#059669]",
      badge: "bg-[#D1FAE5] text-[#059669]"
    },
    info: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#2563EB]",
      badge: "bg-[#DBEAFE] text-[#2563EB]"
    },
    warning: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      badge: "bg-[#FEF3C7] text-[#D97706]"
    },
    success: {
      bg: "bg-[#D1FAE5]",
      text: "text-[#059669]",
      badge: "bg-[#D1FAE5] text-[#059669]"
    }
  };

  const getTypeStyle = (type?: string) => typeStyles[type as keyof typeof typeStyles] || typeStyles.info;

  return (
    <div className={cn("divide-y divide-[#F0F0F0]", className)}>
      {items.map((item, index) => {
        const style = getTypeStyle(item.type);
        return (
          <div
            key={item.id || index}
            className={cn(
              "flex items-center justify-between p-3.5 -mx-3.5 hover:bg-[#FAFAFA] transition-colors rounded-lg",
              "cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", style.bg)}>
                  <svg className={cn("w-4.5 h-4.5", style.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon || (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1A1A1A] truncate text-sm">{item.title}</p>
                {(item.subtitle || item.timestamp) && (
                  <p className="text-xs text-[#9CA3AF] truncate">
                    {item.subtitle}
                    {item.timestamp && <span className="ml-2 text-[#D1D5DB]">{item.timestamp}</span>}
                  </p>
                )}
                {item.metadata && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <span key={key} className="text-xs text-[#9CA3AF]">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2.5 ml-3">
              {item.badge && (
                <Badge variant="secondary" className={cn("text-xs px-2 py-0.5", style.badge)}>
                  {item.badge}
                </Badge>
              )}
              {item.amount && (
                <span className={cn(
                  "font-semibold text-xs whitespace-nowrap",
                  item.type === 'payment' ? "text-[#059669]" : "text-[#1A1A1A]"
                )}>
                  {item.type === 'payment' ? '+' : '-'}{item.amount}
                </span>
              )}
              <svg className="w-4 h-4 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ActivityFeedHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function ActivityFeedHeader({ title, action, className }: ActivityFeedHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between pb-3.5 border-b border-[#F0F0F0]", className)}>
      <h3 className="text-sm font-semibold text-[#1A1A1A]">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
