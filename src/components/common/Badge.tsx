import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'navy' | 'emerald' | 'amber' | 'red' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    teal: 'bg-teal-50 text-teal-800 border-teal-200/80',
    navy: 'bg-navy-50 text-navy-900 border-navy-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase font-sans ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
