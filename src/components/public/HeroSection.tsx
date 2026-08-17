import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, PhoneCall, Building2, Award, HeartPulse } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl } from '../../utils/formatters';

export const HeroSection: React.FC = () => {
  const { homepage, settings } = useSite();
  const { hero } = homepage;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-surface-bg pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-teal-100/60">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-400 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-navy-400 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold tracking-wide border border-teal-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>{hero.badge || 'Authorized Pharmaceutical Supply in Chennai'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              {hero.headline}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              {hero.description}
            </p>

            {/* Quick Badges / Stats Bar */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-navy-900 block">Hospitals & Clinics</span>
                  <span className="text-slate-500">Institutional Supply</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-navy-900 block">100% Genuine</span>
                  <span className="text-slate-500">Authorized Brands</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-navy-900 block">Cold-Chain</span>
                  <span className="text-slate-500">Biological Products</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={hero.primaryCtaLink || '/products'}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-base"
              >
                <span>{hero.primaryCtaText || 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to inquire about pharmaceutical supply.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-navy-900 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all text-base"
              >
                <PhoneCall className="w-4 h-4 text-teal-600" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl border-4 border-white">
                <img
                  src={hero.heroImageUrl || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop'}
                  alt="Pharmaceutical Supply at New Pharma World"
                  className="w-full h-80 sm:h-96 object-cover transform transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
                <div className="p-6 bg-gradient-to-r from-navy-900 to-navy-950 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                      Located in Chennai
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">
                      Kodambakkam – 600024
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    View Location
                  </Link>
                </div>
              </div>

              {/* Floating Trust Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-navy-900">Trusted Healthcare Supply</h4>
                  <p className="text-[11px] text-slate-500">Strict quality assurance & batch traceability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
