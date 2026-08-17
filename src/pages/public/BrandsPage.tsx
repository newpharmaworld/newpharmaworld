import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { BrandCard } from '../../components/public/BrandCard';
import { Brand } from '../../types';
import { getBrands } from '../../firebase/firestore';

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrands({ onlyActive: true });
        setBrands(data);
      } catch (err) {
        console.error('Error loading brands:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmaceutical Manufacturers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              Pharmaceutical Brands
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We distribute authentic pharmaceutical medicines and biological products manufactured by established, globally certified pharmaceutical corporations.
            </p>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
};
