import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SpecialityCard } from '../../components/public/SpecialityCard';
import { SpecialityCardSkeleton } from '../../components/common/LoadingSkeleton';
import { Speciality } from '../../types';
import { getSpecialities } from '../../firebase/firestore';

export const SpecialitiesPage: React.FC = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSpecialities({ onlyActive: true });
        setSpecialities(data);
      } catch (err) {
        console.error('Error loading specialities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Therapeutic Portfolios</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              Medical Specialities
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Targeted medicine distribution across vital therapeutic branches including organ transplant care, nephrology/dialysis, immunology vaccines, reproductive endocrinology, and oncology.
            </p>
          </div>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SpecialityCardSkeleton key={i} />)
            : specialities.map((spec) => (
                <SpecialityCard key={spec.id} speciality={spec} />
              ))}
        </div>
      </div>
    </div>
  );
};
