import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  Building2,
  HeartHandshake,
  Target,
  Eye,
  CheckCircle2,
  MapPin,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl } from '../../utils/formatters';

export const AboutPage: React.FC = () => {
  const { settings } = useSite();

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmaceutical Partner in Chennai</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              About New Pharma World
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your Trusted Pharmaceutical Partner, providing dependable healthcare supply solutions for hospitals, clinics, licensed pharmacies, and institutional customers across Tamil Nadu.
            </p>
          </div>
        </div>

        {/* Company Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight leading-tight">
              Dedicated to Healthcare Supply Excellence & Integrity
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Based in Kodambakkam, Chennai, <strong className="text-navy-900 font-semibold">New Pharma World</strong> was established with the primary commitment of bridging the vital link between world-class pharmaceutical manufacturers and frontline healthcare providers.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We specialize in critical medicine categories that demand strict temperature control, precise storage parameters, and rapid logistical fulfillment — including organ transplant immunosuppressants, hemodialysis solutions, biological vaccines, and oncology therapies.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-2xl font-bold font-display text-teal-700">100%</div>
                <div className="text-xs font-semibold text-navy-900 mt-0.5">Genuine Medicines</div>
                <div className="text-[11px] text-slate-500">Sourced from top manufacturers</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-2xl font-bold font-display text-teal-700">Cold Chain</div>
                <div className="text-xs font-semibold text-navy-900 mt-0.5">Assured Integrity</div>
                <div className="text-[11px] text-slate-500">Validated 2°C to 8°C protocols</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1000&auto=format&fit=crop"
                alt="New Pharma World supply operations"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Kodambakkam, Chennai – 600024</span>
                </div>
                <div className="text-lg font-bold font-display mt-0.5">
                  Strategic Healthcare Hub in Tamil Nadu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-navy-900">
              Our Mission
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To supply healthcare providers, hospitals, pharmacies, and patients with authentic, high-quality pharmaceuticals at competitive prices, maintaining the highest ethical standards and temperature-sensitive storage integrity.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-900 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-navy-900">
              Our Vision
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be Chennai and Tamil Nadu’s most trusted pharmaceutical supply partner, recognized for exceptional dependability, speed of fulfillment, and unwavering adherence to authentic healthcare standards.
            </p>
          </div>
        </div>

        {/* Our Supply Services */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              <Truck className="w-3.5 h-3.5" />
              <span>Core Supply Services</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold text-navy-900 tracking-tight">
              Comprehensive Pharmaceutical Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display text-navy-900">Hospital & Clinical Supply</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bulk institutional supply for multispeciality hospitals, nursing homes, dialysis centers, and oncology day-care units.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display text-navy-900">Retail Pharmacy Distribution</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reliable stock replenishment and fast delivery for community pharmacies and licensed medicine retailers in Chennai.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display text-navy-900">Cold-Chain Distribution</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated temperature-monitored logistics for biological vaccines, insulins, and sensitive oncology formulations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold font-display">
            Partner With New Pharma World Today
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Get in touch with our representative for corporate supply contracts, hospital rate cards, or medicine availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-md"
            >
              Visit Contact Page
            </Link>
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to enquire about pharmaceutical supply partnerships.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-md flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
