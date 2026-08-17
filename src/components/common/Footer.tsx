import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, MessageSquare, Mail, MapPin, Clock, ArrowRight, Lock } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl, getTelUrl } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { settings } = useSite();

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-display font-extrabold text-white tracking-tight">
                NEW PHARMA <span className="text-teal-400">WORLD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline} — Genuine pharmaceutical supply for hospitals, clinics, licensed pharmacies, and healthcare institutions across Chennai and Tamil Nadu.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to connect.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-teal-600 text-teal-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-teal-600 text-teal-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={getTelUrl(settings.phone)}
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-teal-600 text-teal-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide uppercase text-xs">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Product Catalogue
                </Link>
              </li>
              <li>
                <Link to="/specialities" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Medical Specialities
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Partner Brands
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Submit Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialities */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide uppercase text-xs">
              Specialized Care
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/specialities/transplant-medicine" className="hover:text-teal-300 transition-colors">
                  Transplant Medicine
                </Link>
              </li>
              <li>
                <Link to="/specialities/dialysis" className="hover:text-teal-300 transition-colors">
                  Dialysis & Renal Care
                </Link>
              </li>
              <li>
                <Link to="/specialities/vaccines" className="hover:text-teal-300 transition-colors">
                  Cold-Chain Biological Vaccines
                </Link>
              </li>
              <li>
                <Link to="/specialities/cancer-care" className="hover:text-teal-300 transition-colors">
                  Oncology & Cancer Care
                </Link>
              </li>
              <li>
                <Link to="/specialities/fertility" className="hover:text-teal-300 transition-colors">
                  Fertility & Hormone Therapies
                </Link>
              </li>
              <li>
                <Link to="/specialities/general-medicine" className="hover:text-teal-300 transition-colors">
                  General Medicine Formulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide uppercase text-xs">
              Office & Supply Center
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
                <span>
                  {settings.addressLine1}, {settings.addressLine2}, {settings.area}, {settings.city} – {settings.pincode}, {settings.state}, {settings.country}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href={getTelUrl(settings.phone)} className="hover:text-white transition-colors">
                  {settings.phoneDisplay || settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a
                  href={getWhatsAppUrl(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +{settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="py-6 border-b border-navy-800">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Notice: </span>
            {settings.disclaimer}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved. Kodambakkam, Chennai.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">
              Privacy & Supply Terms
            </Link>
            <span>•</span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-slate-500 hover:text-teal-400 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
