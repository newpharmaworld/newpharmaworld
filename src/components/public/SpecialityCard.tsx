import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, HeartPulse, Syringe, Pill, Sparkles, ShieldAlert } from 'lucide-react';
import { Speciality } from '../../types';

interface SpecialityCardProps {
  speciality: Speciality;
}

export const SpecialityCard: React.FC<SpecialityCardProps> = ({ speciality }) => {
  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5" />;
      case 'Syringe':
        return <Syringe className="w-5 h-5" />;
      case 'Pill':
        return <Pill className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'ShieldAlert':
      default:
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-teal-400 hover:shadow-card-hover transition-all duration-300 flex flex-col group h-full">
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={speciality.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'}
          alt={speciality.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        
        {/* Floating Icon Badge */}
        <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
          {getLucideIcon(speciality.iconName)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold font-display text-navy-900 group-hover:text-teal-700 transition-colors">
            {speciality.name}
          </h3>
          <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {speciality.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/products?category=${encodeURIComponent(speciality.name)}`}
            className="text-xs font-bold uppercase tracking-wider text-teal-700 group-hover:text-teal-800 flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to={`/specialities/${speciality.slug || speciality.id}`}
            className="text-xs text-slate-500 hover:text-navy-900"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
