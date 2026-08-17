import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ShieldAlert } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-surface-bg flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-4xl font-extrabold font-display text-navy-900">404</span>
          <h1 className="text-xl font-bold font-display text-navy-900">Page Not Found</h1>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The pharmaceutical catalogue or page you requested could not be located. It may have been moved or updated.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
