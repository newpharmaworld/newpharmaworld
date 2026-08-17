import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Brand } from '../../types';

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-teal-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group h-full text-center">
      <div className="space-y-4">
        {/* Brand Logo Container */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
          <img
            src={brand.logoUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
            alt={brand.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=' + encodeURIComponent(brand.name);
            }}
          />
        </div>

        <div>
          <h3 className="text-lg font-bold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
            {brand.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/products?brand=${encodeURIComponent(brand.name)}`}
          className="text-xs font-bold uppercase tracking-wider text-teal-700 hover:text-teal-800 flex items-center gap-1 mx-auto"
        >
          <span>View Catalogue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {brand.websiteUrl && (
          <a
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-600 p-1"
            title="Official Website"
            aria-label={`Official website of ${brand.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
