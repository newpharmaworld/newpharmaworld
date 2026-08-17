import React from 'react';
import { ShieldCheck, Award, Tag, Truck, CheckCircle2 } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export const WhyChooseUsSection: React.FC = () => {
  const { homepage } = useSite();
  const indicators = homepage.trustIndicators || [];

  const getIcon = (iconName: string, index: number) => {
    switch (iconName?.toLowerCase() || index) {
      case 'shieldcheck':
      case 0:
        return <ShieldCheck className="w-7 h-7 text-teal-600" />;
      case 'award':
      case 1:
        return <Award className="w-7 h-7 text-teal-600" />;
      case 'tag':
      case 2:
        return <Tag className="w-7 h-7 text-teal-600" />;
      case 'truck':
      case 3:
      default:
        return <Truck className="w-7 h-7 text-teal-600" />;
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight">
            Reliable Pharmaceutical Distribution You Can Trust
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Committed to supporting healthcare providers, pharmacies, and patients with authentic medicine supply, uncompromising quality controls, and prompt service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-surface-bg rounded-2xl p-7 border border-slate-200/80 hover:border-teal-400 hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-teal-100/70 group-hover:bg-teal-600 flex items-center justify-center transition-colors">
                  <div className="group-hover:text-white transition-colors">
                    {getIcon(item.icon, idx)}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-display group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
