import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
    <div className="w-full h-44 bg-slate-200 rounded-xl" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
    <div className="h-9 bg-slate-200 rounded-lg w-full" />
  </div>
);

export const SpecialityCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
    <div className="h-6 bg-slate-200 rounded w-2/3" />
    <div className="h-4 bg-slate-200 rounded w-full" />
    <div className="h-4 bg-slate-200 rounded w-4/5" />
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <tr className="animate-pulse border-b border-slate-100">
    {Array.from({ length: columns }).map((_, idx) => (
      <td key={idx} className="p-4">
        <div className="h-4 bg-slate-200 rounded w-full" />
      </td>
    ))}
  </tr>
);
