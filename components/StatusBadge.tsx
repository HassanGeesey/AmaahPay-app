import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'pending'
  | 'draft';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className
}: StatusBadgeProps) {
  const variants = {
    default: {
      bg: "bg-[#F5F5F5]",
      text: "text-[#6B7280]",
      border: "border-[#E5E5E5]",
      dot: "bg-[#9CA3AF]"
    },
    success: {
      bg: "bg-[#ECFDF5]",
      text: "text-[#059669]",
      border: "border-[#A7F3D0]",
      dot: "bg-[#10B981]"
    },
    warning: {
      bg: "bg-[#FFFBEB]",
      text: "text-[#D97706]",
      border: "border-[#FDE68A]",
      dot: "bg-[#F59E0B]"
    },
    error: {
      bg: "bg-[#FEF2F2]",
      text: "text-[#DC2626]",
      border: "border-[#FECACA]",
      dot: "bg-[#EF4444]"
    },
    info: {
      bg: "bg-[#EFF6FF]",
      text: "text-[#2563EB]",
      border: "border-[#BFDBFE]",
      dot: "bg-[#3B82F6]"
    },
    neutral: {
      bg: "bg-[#F3F4F6]",
      text: "text-[#4B5563]",
      border: "border-[#E5E7EB]",
      dot: "bg-[#6B7280]"
    },
    pending: {
      bg: "bg-[#EEF2FF]",
      text: "text-[#4F46E5]",
      border: "border-[#C7D2FE]",
      dot: "bg-[#6366F1]"
    },
    draft: {
      bg: "bg-[#F9FAFB]",
      text: "text-[#9CA3AF]",
      border: "border-[#E5E7EB] border-dashed",
      dot: "bg-[#9CA3AF]"
    }
  };

  const sizes = {
    sm: { container: "px-2 py-0.5 text-xs", icon: "w-2.5 h-2.5" },
    md: { container: "px-2.5 py-1 text-xs", icon: "w-3 h-3" },
    lg: { container: "px-3 py-1 text-sm", icon: "w-3.5 h-3.5" }
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        style.bg,
        style.text,
        style.border,
        sizeStyle.container,
        className
      )}
    >
      {dot && (
        <span className={cn("rounded-full", style.dot, sizeStyle.icon)} />
      )}
      {icon && <span className={sizeStyle.icon}>{icon}</span>}
      {label}
    </span>
  );
}

interface StatusDotProps {
  variant?: StatusVariant;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  variant = 'default',
  size = 'md',
  pulse = false,
  className
}: StatusDotProps) {
  const variants = {
    default: "bg-[#9CA3AF]",
    success: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    error: "bg-[#EF4444]",
    info: "bg-[#3B82F6]",
    neutral: "bg-[#6B7280]",
    pending: "bg-[#6366F1]",
    draft: "bg-[#9CA3AF]"
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3"
  };

  return (
    <span
      className={cn(
        "relative inline-flex rounded-full",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-75",
          variants[variant]
        )} />
      )}
    </span>
  );
}

interface LabelProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function Label({ children, size = 'md', className }: LabelProps) {
  return (
    <label
      className={cn(
        "font-medium text-[#6B7280]",
        size === 'sm' ? "text-xs" : "text-sm",
        className
      )}
    >
      {children}
    </label>
  );
}
